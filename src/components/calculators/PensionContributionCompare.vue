// TaiCalc 比較器：勞退自提 0% vs 6%
// 比較每月自提 6% 進勞退專戶（享節稅）與不自提（6% 薪資一般投資）的長期差異。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">月薪（元）</label>
                    <input type="number" v-model.number="salary" aria-label="月薪" placeholder="45000"
                    class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">年資（年）</label>
                    <input type="number" v-model.number="years" min="1" max="40" aria-label="年資"
                    class="input-clean font-semibold">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">投資報酬率（%）</label>
                    <input type="number" v-model.number="roi" step="0.5" aria-label="投資報酬率"
                    class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">所得稅率（%）</label>
                    <input type="number" v-model.number="taxRate" step="1" aria-label="所得稅率"
                    class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <p class="text-[11px] text-ink-400">自提 6% 享免計入當年度所得之節稅優惠；不自提則將 6% 薪資投入一般投資。均為複利估算。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="自提 6%（勞退專戶）"
                subtitle="每月提撥 + 節稅"
                main-label="期末帳戶價值"
                :main-value="`$ ${fmt(contributionFV)}`"
                main-tone="brand"
                :rows="[
                { label: '每月提撥', value: `$ ${fmt(monthlyContribution)}` },
                { label: '累積節稅', value: `$ ${fmt(totalTaxSaving)}`, tone: 'growth' },
                ]"
            />
            <ResultReceipt
                title="不自提（一般投資）"
                subtitle="6% 薪資自行投資"
                main-label="期末投資價值"
                :main-value="`$ ${fmt(investFV)}`"
                main-tone="neutral"
                :rows="[
                { label: '每月投入', value: `$ ${fmt(monthlyContribution)}` },
                { label: '無節稅', value: '—' },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">節稅效益</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">自提 6% 每年節稅約 $ {{ fmt(yearlyTaxSaving) }}。勞退專戶具保證收益下限，但提領受法定年齡限制。</p>
        </div>

        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                {{ shareCopied ? '已複製連結 ✓' : '複製比較結果連結' }}
            </button>
            <a href="/tools/labor-pension-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                進階：勞退完整試算
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const salary = ref(45000)
const years = ref(30)
const roi = ref(5)
const taxRate = ref(12)

const monthlyContribution = computed(() => Math.round(Math.max(0, salary.value || 0) * 0.06))
const yearlyTaxSaving = computed(() => Math.round(monthlyContribution.value * 12 * (taxRate.value || 0) / 100))

// 每月投入的複利終值（月投入）
const fvMonthly = (monthly, nYears, annualRate) => {
    const n = nYears * 12
    const r = (annualRate || 0) / 100 / 12
    if (r <= 0) return monthly * n
    return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r))
}
const contributionFV = computed(() => fvMonthly(monthlyContribution.value, years.value, roi.value))
const investFV = computed(() => fvMonthly(monthlyContribution.value, years.value, roi.value))
// 節稅金額若也投入投資
const taxSavingFV = computed(() => fvMonthly(Math.round(yearlyTaxSaving.value / 12), years.value, roi.value))
const totalTaxSaving = computed(() => Math.round(yearlyTaxSaving.value * years.value))

const insight = computed(() => {
    const diff = taxSavingFV.value
    if (diff <= 0) return '請輸入月薪與年資。'
    return `自提 6% 的節稅金額若同率投資，${years} 年可額外累積約 $ ${fmt(diff)}。稅率越高、自提越划算；但勞退專戶資金須待法定年齡才能領取。`
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (salary.value < 0) salary.value = 0
    if (salary.value > 300000) salary.value = 300000
    if (years.value < 1) years.value = 1
    if (years.value > 40) years.value = 40
    if (roi.value < 0) roi.value = 0
    if (roi.value > 20) roi.value = 20
    if (taxRate.value < 0) taxRate.value = 0
    if (taxRate.value > 40) taxRate.value = 40
}
watch([salary, years, roi, taxRate], validate)

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({ s: String(Math.round(salary.value)), y: String(years.value), r: String(roi.value), t: String(taxRate.value) })
    return `${window.location.origin}/compare/pension-contribution-0-vs-6?${p.toString()}`
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
        if (p.has('s')) salary.value = parseFloat(p.get('s')) || salary.value
        if (p.has('y')) years.value = parseInt(p.get('y')) || years.value
    }
})
</script>
