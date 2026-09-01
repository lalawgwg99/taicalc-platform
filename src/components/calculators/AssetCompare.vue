// TaiCalc 比較器：定存 vs 債券 vs ETF（名目與實質報酬）
// 比較三種資產的期末價值與扣除通膨後的購買力。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div>
                <label class="block text-xs font-medium text-ink-400 mb-1.5">投入金額（萬）</label>
                <input type="number" v-model.number="amountWan" aria-label="投入金額" placeholder="100"
                class="input-clean text-lg font-semibold tabular-nums">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">投資年數</label>
                    <input type="number" v-model.number="years" min="1" max="40" aria-label="投資年數"
                    class="input-clean font-semibold">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">年通膨率（%）</label>
                    <input type="number" v-model.number="inflation" step="0.1" aria-label="年通膨率"
                    class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <p class="text-[11px] text-ink-400">年化報酬為歷史概估：定存 1.5%、債券型 3.5%、股票型 ETF 7%。實質價值已扣除通膨。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-3 items-stretch">
            <ResultReceipt
                v-for="asset in assets"
                :key="asset.key"
                :title="asset.name"
                :subtitle="`${asset.rate}% 年化概估`"
                main-label="實質價值（扣通膨）"
                :main-value="`$ ${fmt(asset.real)}`"
                :main-tone="asset.key === 'c' ? 'brand' : 'neutral'"
                :rows="[
                { label: '名目價值', value: `$ ${fmt(asset.nominal)}` },
                { label: '名目報酬', value: `$ ${fmt(asset.nominal - principal)}`, tone: 'growth' },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">重點</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">單筆投入、複利估算，未計稅與費用。高報酬伴隨高波動，請依風險承受度配置。</p>
        </div>

        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                {{ shareCopied ? '已複製連結 ✓' : '複製比較結果連結' }}
            </button>
            <a href="/tools/real-return-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                進階：通膨後實質報酬試算
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const amountWan = ref(100)
const years = ref(10)
const inflation = ref(2)
const rates = { a: 1.5, b: 3.5, c: 7 } // 定存 / 債券 / 股票ETF（歷史概估）

const principal = computed(() => amountWan.value * 10000)
const nominal = (rate) => Math.round(principal.value * Math.pow(1 + (rate || 0) / 100, years.value))
const real = (nominalValue) => Math.round(nominalValue / Math.pow(1 + (inflation.value || 0) / 100, years.value))
const assets = computed(() => [
    { key: 'a', name: '台幣定存', rate: rates.a, nominal: nominal(rates.a), real: real(nominal(rates.a)) },
    { key: 'b', name: '債券型 ETF', rate: rates.b, nominal: nominal(rates.b), real: real(nominal(rates.b)) },
    { key: 'c', name: '股票型 ETF', rate: rates.c, nominal: nominal(rates.c), real: real(nominal(rates.c)) },
])
const insight = computed(() => {
    const a = assets.value[0].real, c = assets.value[2].real
    const diff = c - a
    return diff > 0
        ? `投入 $ ${fmt(principal)}、${years} 年後：定存實質價值約 $ ${fmt(a)}，股票型 ETF 約 $ ${fmt(c)}，相差 $ ${fmt(diff)}。通膨 ${inflation}% 下，低報酬資產的購買力幾乎原地踏步。`
        : '請調整參數後再比較。'
})
const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (amountWan.value < 0) amountWan.value = 0
    if (amountWan.value > 10000) amountWan.value = 10000
    if (years.value < 1) years.value = 1
    if (years.value > 40) years.value = 40
    if (inflation.value < 0) inflation.value = 0
    if (inflation.value > 20) inflation.value = 20
}
watch(amountWan, validate)
watch(years, validate)
watch(inflation, validate)

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({ a: String(Math.round(amountWan.value)), y: String(years.value), i: String(inflation.value) })
    return `${window.location.origin}/compare/asset-real-return?${p.toString()}`
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
        if (p.has('a')) amountWan.value = parseFloat(p.get('a')) || amountWan.value
        if (p.has('y')) years.value = parseInt(p.get('y')) || years.value
        if (p.has('i')) inflation.value = parseFloat(p.get('i')) ?? inflation.value
    }
})
</script>
