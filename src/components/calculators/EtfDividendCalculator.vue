// TaiCalc：ETF 配息試算機
// 輸入持有股數與每股配息，試算配息總額、二代健保補充保費與實拿金額。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="fld-74414bd8" class="block text-xs font-medium text-ink-400 mb-1.5">持有股數（股）</label>
                    <input id="fld-74414bd8" type="text" inputmode="decimal" v-model.number="shares" aria-label="持有股數" placeholder="1000"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label for="fld-e2f97d4a" class="block text-xs font-medium text-ink-400 mb-1.5">每股配息（元）</label>
                    <input id="fld-e2f97d4a" type="text" inputmode="decimal" v-model.number="dividendPerShare" step="0.01" aria-label="每股配息" placeholder="1.5"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="fld-3a5a9b32" class="block text-xs font-medium text-ink-400 mb-1.5">每年配息次數</label>
                    <select id="fld-3a5a9b32" v-model.number="frequency" aria-label="每年配息次數" class="input-clean font-semibold">
                        <option :value="1">年配（1 次）</option>
                        <option :value="2">半年配（2 次）</option>
                        <option :value="4">季配（4 次）</option>
                        <option :value="12">月配（12 次）</option>
                    </select>
                </div>
                <div>
                    <label for="fld-adf0f14b" class="block text-xs font-medium text-ink-400 mb-1.5">目前股價（元，選填）</label>
                    <input id="fld-adf0f14b" type="text" inputmode="decimal" v-model.number="price" step="0.01" aria-label="目前股價" placeholder="用於算配息率"
                        class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <p class="text-[11px] text-ink-400">單次配息滿 2 萬元要扣 2.11% 健保補充保費。配息還要併進綜合所得稅申報。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="本次配息"
                :subtitle="`每股 ${fmt2(dividendPerShare)} 元 × ${fmt(shares)} 股`"
                main-label="這次實際拿到"
                :main-value="`$ ${fmt(netDividend)}`"
                main-tone="brand"
                :rows="[
                    { label: '配息總共多少', value: `$ ${fmt(totalDividend)}` },
                    { label: '健保補充保費 2.11%', value: suppFee > 0 ? `−$ ${fmt(suppFee)}` : '$ 0（未達 2 萬門檻）', tone: suppFee > 0 ? 'tax' : 'neutral' },
                ]"
            />
            <ResultReceipt
                title="一年下來"
                :subtitle="`一年配 ${frequency} 次`"
                main-label="一年配息總共"
                :main-value="`$ ${fmt(annualDividend)}`"
                :rows="[
                    { label: '一年配息率', value: annualYield !== null ? `${annualYield}%` : '請輸入股價', tone: 'growth' },
                    { label: '一年實際拿到（扣掉健保補充保費）', value: `$ ${fmt(annualNet)}` },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider">差異解讀</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-400">這是大概估的。配息可以併進綜合所得稅（8.5% 抵稅、上限 8 萬）或選 28% 分開算，實際繳多少以報稅結果為準。</p>
        </div>

        <div class="flex gap-2">
            <a href="/tools/stock-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                算股票買賣損益
                <span aria-hidden="true">→</span>
            </a>
            <a href="/tools/real-return-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-paper-300 bg-white px-4 py-2.5 text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                看扣掉通膨後真正賺多少
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
        parts.push(`這次配息有到門檻，要扣 2.11%（$ ${fmt(suppFee.value)}），實際拿到 $ ${fmt(netDividend.value)}。`)
    } else {
        parts.push('這次沒到 2 萬門檻，不用扣補充保費。')
    }
    parts.push('提醒一下：配息不是多賺的——除息那天股價會跟著往下扣，真正要看的是「含息總報酬」有沒有賺。')
    return parts.join(' ')
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'
const fmt2 = (n) => (n || 0).toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

watch(shares, (v) => { if (v < 0) shares.value = 0; if (v > 100000000) shares.value = 100000000 })
watch(dividendPerShare, (v) => { if (v < 0) dividendPerShare.value = 0; if (v > 1000) dividendPerShare.value = 1000 })
watch(price, (v) => { if (v < 0) price.value = 0 })
</script>
