// TaiCalc：ETF 配息試算機
// 輸入持有股數與每股配息，試算配息總額、二代健保補充保費與實拿金額。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">持有股數（股）</label>
                    <input type="text" inputmode="decimal" v-model.number="shares" aria-label="持有股數" placeholder="1000"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">每股配息（元）</label>
                    <input type="text" inputmode="decimal" v-model.number="dividendPerShare" step="0.01" aria-label="每股配息" placeholder="1.5"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">每年配息次數</label>
                    <select v-model.number="frequency" aria-label="每年配息次數" class="input-clean font-semibold">
                        <option :value="1">年配（1 次）</option>
                        <option :value="2">半年配（2 次）</option>
                        <option :value="4">季配（4 次）</option>
                        <option :value="12">月配（12 次）</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">目前股價（元，選填）</label>
                    <input type="text" inputmode="decimal" v-model.number="price" step="0.01" aria-label="目前股價" placeholder="用於算配息率"
                        class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <p class="text-[11px] text-ink-400">單次配息總額達 20,000 元（含）以上，扣取 2.11% 二代健保補充保費。配息另須併入綜合所得稅申報。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="本次配息"
                :subtitle="`每股 ${fmt2(dividendPerShare)} 元 × ${fmt(shares)} 股`"
                main-label="實拿配息"
                :main-value="`$ ${fmt(netDividend)}`"
                main-tone="brand"
                :rows="[
                    { label: '配息總額', value: `$ ${fmt(totalDividend)}` },
                    { label: '補充保費 (2.11%)', value: suppFee > 0 ? `−$ ${fmt(suppFee)}` : '$ 0（未達 2 萬門檻）', tone: suppFee > 0 ? 'tax' : 'neutral' },
                ]"
            />
            <ResultReceipt
                title="年化試算"
                :subtitle="`一年配 ${frequency} 次`"
                main-label="年配息總額"
                :main-value="`$ ${fmt(annualDividend)}`"
                :rows="[
                    { label: '年化配息率', value: annualYield !== null ? `${annualYield}%` : '請輸入股價', tone: 'growth' },
                    { label: '年實拿（扣補充保費後）', value: `$ ${fmt(annualNet)}` },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider">差異解讀</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">試算為估算值。配息所得可選擇併入綜合所得稅（8.5% 可抵減稅額，上限 8 萬元）或按 28% 分開計稅，實際稅負請以報稅結果為準。</p>
        </div>

        <div class="flex gap-2">
            <a href="/tools/stock-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                算股票買賣損益
                <span aria-hidden="true">→</span>
            </a>
            <a href="/tools/real-return-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-paper-300 bg-white px-4 py-2.5 text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                看通膨後實質報酬
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const shares = ref(1000)
const dividendPerShare = ref(1.5)
const frequency = ref(4)
const price = ref(0)

const SUPP_RATE = 0.0211
const SUPP_THRESHOLD = 20000

const totalDividend = computed(() => Math.round((shares.value || 0) * (dividendPerShare.value || 0)))
const suppFee = computed(() => totalDividend.value >= SUPP_THRESHOLD ? Math.round(totalDividend.value * SUPP_RATE) : 0)
const netDividend = computed(() => totalDividend.value - suppFee.value)

const annualDividend = computed(() => totalDividend.value * (frequency.value || 1))
const annualSuppFee = computed(() => {
    // 簡化：以單次門檻逐次判斷
    let fee = 0
    for (let i = 0; i < (frequency.value || 1); i++) {
        if (totalDividend.value >= SUPP_THRESHOLD) fee += Math.round(totalDividend.value * SUPP_RATE)
    }
    return fee
})
const annualNet = computed(() => annualDividend.value - annualSuppFee.value)
const annualYield = computed(() => {
    const p = price.value || 0
    if (p <= 0) return null
    return (((dividendPerShare.value || 0) * (frequency.value || 1)) / p * 100).toFixed(2)
})

const insight = computed(() => {
    const parts = []
    if (totalDividend.value >= SUPP_THRESHOLD) {
        parts.push(`本次配息達補充保費門檻，需扣 2.11%（$ ${fmt(suppFee.value)}），實拿 $ ${fmt(netDividend.value)}。`)
    } else {
        parts.push('本次配息未達 2 萬元門檻，不扣補充保費。')
    }
    parts.push('提醒：配息不是額外獲利——除息日股價會反映配息金額往下調整，真正要看的是「含息總報酬」。')
    return parts.join(' ')
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'
const fmt2 = (n) => (n || 0).toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

watch(shares, (v) => { if (v < 0) shares.value = 0; if (v > 100000000) shares.value = 100000000 })
watch(dividendPerShare, (v) => { if (v < 0) dividendPerShare.value = 0; if (v > 1000) dividendPerShare.value = 1000 })
watch(price, (v) => { if (v < 0) price.value = 0 })
</script>
