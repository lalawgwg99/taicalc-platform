// TaiCalc：年終獎金試算機
// 輸入年終獎金總額，試算預扣所得稅 5%、二代健保補充保費與實拿金額。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div>
                <label class="block text-xs font-medium text-ink-400 mb-1.5">年終獎金總額（元）</label>
                <input type="text" inputmode="decimal" v-model.number="bonus" aria-label="年終獎金總額" placeholder="100000"
                    class="input-clean text-lg font-semibold tabular-nums">
            </div>
            <div>
                <label class="block text-xs font-medium text-ink-400 mb-1.5">健保投保金額（元）</label>
                <input type="text" inputmode="decimal" v-model.number="insuredAmount" aria-label="健保投保金額" placeholder="45800"
                    class="input-clean font-semibold tabular-nums">
            </div>
            <p class="text-[11px] text-ink-400">115 年度（2026）起扣點為 90,501 元；全年獎金超過當月投保金額 4 倍，超過部分扣 2.11% 補充保費。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="發放當下"
                :subtitle="withholdingTax > 0 ? '達起扣點，預扣 5%' : '未達起扣點，免預扣'"
                main-label="實拿年終"
                :main-value="`$ ${fmt(netBonus)}`"
                main-tone="brand"
                :rows="[
                    { label: '年終總額', value: `$ ${fmt(bonus)}` },
                    { label: '預扣所得稅 (5%)', value: withholdingTax > 0 ? `−$ ${fmt(withholdingTax)}` : '$ 0', tone: withholdingTax > 0 ? 'tax' : 'neutral' },
                    { label: '補充保費 (2.11%)', value: suppFee > 0 ? `−$ ${fmt(suppFee)}` : '$ 0', tone: suppFee > 0 ? 'tax' : 'neutral' },
                ]"
            />
            <ResultReceipt
                title="關鍵門檻"
                subtitle="115 年度適用"
                main-label="距離起扣點"
                :main-value="thresholdDiff"
                :rows="[
                    { label: '起扣點', value: '$ 90,501' },
                    { label: '補充保費門檻（投保金額 × 4）', value: `$ ${fmt(suppThreshold)}` },
                    { label: '預扣稅率', value: '5%（按給付總額計算）' },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider">差異解讀</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">預扣稅款不是最終稅額，隔年 5 月申報綜所稅時多退少補。補充保費以「全年累計獎金」比較投保金額 4 倍，本試算以本次年終單筆估算，實際以投保單位核算為準。</p>
        </div>

        <div class="flex gap-2">
            <a href="/tools/salary-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                算月薪實拿
                <span aria-hidden="true">→</span>
            </a>
            <a href="/tools/income-tax-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-paper-300 bg-white px-4 py-2.5 text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                試算綜合所得稅
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const bonus = ref(100000)
const insuredAmount = ref(45800)

const WITHHOLD_THRESHOLD = 90501
const WITHHOLD_RATE = 0.05
const SUPP_RATE = 0.0211
const SUPP_MULTIPLE = 4

const withholdingTax = computed(() => {
    const b = bonus.value || 0
    return b >= WITHHOLD_THRESHOLD ? Math.round(b * WITHHOLD_RATE) : 0
})
const suppThreshold = computed(() => (insuredAmount.value || 0) * SUPP_MULTIPLE)
const suppFee = computed(() => {
    const over = (bonus.value || 0) - suppThreshold.value
    return over > 0 ? Math.round(over * SUPP_RATE) : 0
})
const netBonus = computed(() => (bonus.value || 0) - withholdingTax.value - suppFee.value)
const thresholdDiff = computed(() => {
    const b = bonus.value || 0
    if (b >= WITHHOLD_THRESHOLD) return '已超過，須預扣'
    const diff = WITHHOLD_THRESHOLD - b
    return `還差 $ ${fmt(diff)}`
})

const insight = computed(() => {
    const parts = []
    const b = bonus.value || 0
    if (b >= WITHHOLD_THRESHOLD) {
        parts.push(`年終達 90,501 元起扣點，公司須按「全額」預扣 5%（$ ${fmt(withholdingTax.value)}），這就是「90,501 魔咒」——90,501 元實拿比 90,500 元少 4,525 元。`)
    } else {
        parts.push('未達起扣點，發放時免預扣，但年終仍須併入當年度薪資所得申報。')
    }
    if (suppFee.value > 0) {
        parts.push(`年終超過投保金額 4 倍（$ ${fmt(suppThreshold.value)}），超過部分再扣 2.11% 補充保費 $ ${fmt(suppFee.value)}。`)
    }
    parts.push('被預扣的 5% 不是消失，隔年報稅可抵減，多退少補。')
    return parts.join(' ')
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

watch(bonus, (v) => { if (v < 0) bonus.value = 0; if (v > 100000000) bonus.value = 100000000 })
watch(insuredAmount, (v) => { if (v < 0) insuredAmount.value = 0; if (v > 313000) insuredAmount.value = 313000 })
</script>
