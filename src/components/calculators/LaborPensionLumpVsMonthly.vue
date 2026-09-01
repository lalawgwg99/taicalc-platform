// TaiCalc 比較器：勞保老年年金 一次領 vs 月領
// 月領 = 平均月投保薪資 × 年資 × 1.55%；一次領 = 平均月投保薪資 × 給付月數。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div>
                <label class="block text-xs font-medium text-ink-400 mb-1.5">平均月投保薪資（元）</label>
                <input type="number" v-model.number="avgWage" aria-label="平均月投保薪資" placeholder="45800"
                class="input-clean text-lg font-semibold tabular-nums">
            </div>
            <div>
                <label class="block text-xs font-medium text-ink-400 mb-1.5">勞保年資（年）</label>
                <input type="number" v-model.number="years" min="1" max="50" aria-label="勞保年資"
                class="input-clean font-semibold">
            </div>
            <p class="text-[11px] text-ink-400">依勞保老年給付規則概算：月領年資給付率 1.55%/年；一次領前 15 年每年 1 個月、第 16 年起每年 2 個月（上限 50 個月）。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="月領年金"
                subtitle="每月領取"
                main-label="每月金額"
                :main-value="`$ ${fmt(monthly)}`"
                main-tone="brand"
                :rows="[
                { label: '年資', value: `${years} 年` },
                { label: '給付率', value: '1.55% / 年' },
                ]"
            />
            <ResultReceipt
                title="一次請領"
                subtitle="一次領取"
                main-label="一次領總額"
                :main-value="`$ ${fmt(lumpSum)}`"
                main-tone="neutral"
                :rows="[
                { label: '給付月數', value: `${months} 個月` },
                { label: '平均投保薪資', value: `$ ${fmt(avgWage)}` },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">怎麼選</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">月領約 {{ breakevenYears }} 年累計可超過一次領總額。實際給付仍以勞保局核定為準。</p>
        </div>

        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                {{ shareCopied ? '已複製連結 ✓' : '複製比較結果連結' }}
            </button>
            <a href="/tools/labor-insurance-pension-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                進階試算：提前/延後請領
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const avgWage = ref(45800)
const years = ref(30)

const monthly = computed(() => Math.round(Math.max(0, avgWage.value || 0) * Math.max(0, years.value || 0) * 0.0155))
const months = computed(() => Math.min(50, 15 + Math.max(0, (years.value || 0) - 15) * 2))
const lumpSum = computed(() => Math.round(Math.max(0, avgWage.value || 0) * months.value))
const breakevenYears = computed(() => monthly.value > 0 ? lumpSum.value / monthly.value / 12 : 0)
const insight = computed(() => {
    const y = breakevenYears.value
    if (y <= 0) return '請輸入投保薪資與年資。'
    if (y <= 15) return `月領約 ${y} 年就能累計超過一次領總額——若預期長壽或需要穩定現金流，月領通常較有利。`
    if (y <= 20) return `月領約 ${y} 年超過一次領。若你預期壽命長、或需要每月現金流，月領較合適；否則一次領可靈活運用。`
    return `月領需 ${y} 年才超過一次領——若你較早退休、或想一次運用資金，一次領可能是較佳選擇。`
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (avgWage.value < 0) avgWage.value = 0
    if (avgWage.value > 150000) avgWage.value = 150000
    if (years.value < 1) years.value = 1
    if (years.value > 50) years.value = 50
}
watch(avgWage, validate)
watch(years, validate)

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({ w: String(Math.round(avgWage.value)), y: String(years.value) })
    return `${window.location.origin}/compare/labor-pension-lump-vs-monthly?${p.toString()}`
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
        if (p.has('w')) avgWage.value = parseFloat(p.get('w')) || avgWage.value
        if (p.has('y')) years.value = parseInt(p.get('y')) || years.value
    }
})
</script>
