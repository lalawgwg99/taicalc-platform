// TaiCalc 比較器：0050 vs 0056 vs 006208（台股 ETF 定期定額）
// 以歷史年化報酬概估比較三檔 ETF 的定期定額累積成果。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div>
                <label class="block text-xs font-medium text-ink-400 mb-1.5">每月投入金額（元）</label>
                <input type="number" v-model.number="monthlyAmount" aria-label="每月投入金額" placeholder="10000"
                class="input-clean text-lg font-semibold tabular-nums">
            </div>
            <div>
                <label class="block text-xs font-medium text--ink-400 mb-1.5">投資年數</label>
                <input type="number" v-model.number="years" min="1" max="40" aria-label="投資年數"
                class="input-clean font-semibold">
            </div>
            <p class="text-[11px] text-ink-400">年化報酬為歷史長期概估值（含息），非保證報酬。0050/006208 追蹤台灣 50（市值型），0056 追蹤高股息指數。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-3 items-stretch">
            <ResultReceipt
                v-for="etf in etfs"
                :key="etf.key"
                :title="etf.name"
                :subtitle="`${etf.rate}% 年化概估`"
                main-label="期末價值"
                :main-value="`$ ${fmt(etf.fv)}`"
                :main-tone="etf.key === 'a' ? 'brand' : 'neutral'"
                :rows="[
                { label: '投入總額', value: `$ ${fmt(totalContribution)}` },
                { label: '累積收益', value: `$ ${fmt(etf.gain)}`, tone: 'growth' },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">差異解讀</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">定期定額、月投入、複利估算，未計手續費與稅；0056 配息率較高但長期總報酬通常低於市值型。</p>
        </div>

        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                {{ shareCopied ? '已複製連結 ✓' : '複製比較結果連結' }}
            </button>
            <a href="/tools/real-return-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                看通膨後實質報酬
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const monthlyAmount = ref(10000)
const years = ref(20)
const rates = { a: 8, b: 8, c: 6.5 } // 0050/006208 市值型、0056 高股息（歷史概估）

const totalContribution = computed(() => Math.round(monthlyAmount.value * 12 * years.value))
const fv = (rate) => {
    const n = years.value * 12
    const r = (rate || 0) / 100 / 12
    if (r <= 0) return monthlyAmount.value * n
    return Math.round(monthlyAmount.value * ((Math.pow(1 + r, n) - 1) / r))
}
const etfs = computed(() => [
    { key: 'a', name: '0050 市值型', rate: rates.a, fv: fv(rates.a), gain: fv(rates.a) - totalContribution.value },
    { key: 'b', name: '006208 市值型', rate: rates.b, fv: fv(rates.b), gain: fv(rates.b) - totalContribution.value },
    { key: 'c', name: '0056 高股息', rate: rates.c, fv: fv(rates.c), gain: fv(rates.c) - totalContribution.value },
])

const insight = computed(() => {
    const a = fv(rates.a), c = fv(rates.c)
    const diff = a - c
    if (diff <= 0) return '三檔差異不大，可依配息需求選擇。'
    return `長期定期定額下，市值型（0050/006208）期末價值約比高股息（0056）多 $ ${fmt(diff)}。市值型追求總報酬，高股息追求現金流——先想清楚你要的是「資產成長」還是「每月配息」。`
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (monthlyAmount.value < 0) monthlyAmount.value = 0
    if (monthlyAmount.value > 1000000) monthlyAmount.value = 1000000
    if (years.value < 1) years.value = 1
    if (years.value > 40) years.value = 40
}
watch(monthlyAmount, validate)
watch(years, validate)

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({ m: String(Math.round(monthlyAmount.value)), y: String(years.value) })
    return `${window.location.origin}/compare/etf-0050-vs-0056-vs-006208??${p.toString()}`
}
const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(buildShareURL())
        shareCopied.value = true
        setTimeout(() => { shareCopied.value = false }, 2500)
    } catch (_) {}
}
onMounted(() => {
    if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search)
        if (p.has('m')) monthlyAmount.value = parseFloat(p.get('m')) || monthlyAmount.value
        if (p.has('y')) years.value = parseInt(p.get('y')) || years.value
    }
})
</script>
