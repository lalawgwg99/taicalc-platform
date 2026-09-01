// TaiCalc 比較器：30 年 vs 40 年房貸
// 同利率、同貸款金額，比較不同年限的月付金與總利息。
<template>
    <div class="calculator-shell space-y-4">

        <!-- 共用輸入 -->
        <div class="card-surface p-5">
            <label class="block text-xs font-medium text-ink-400 mb-1.5">貸款總額（萬）</label>
            <input type="number" v-model.number="amountWan" aria-label="貸款總額" placeholder="1000"
                class="input-clean text-xl font-semibold tabular-nums">
            <div class="mt-3">
                <label class="block text-xs font-medium text-ink-400 mb-1.5">年利率（%）</label>
                <input type="number" v-model.number="rate" step="0.005" aria-label="年利率"
                    class="input-clean font-semibold tabular-nums">
            </div>
            <p class="mt-2 text-[11px] text-ink-400">同一筆貸款與利率，左右比較不同年限的真實負擔</p>
        </div>

        <!-- 兩年限輸入 -->
        <div class="grid gap-3 md:grid-cols-2">
            <div v-for="side in sides" :key="side.key" class="card-surface p-5">
                <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-ink-600">{{ side.label }}</p>
                    <span class="data-pill !px-2.5 !py-1 text-brand-700 bg-brand-50 border-brand-200">{{ side.years }} 年</span>
                </div>
                <div class="mt-3">
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">貸款年限</label>
                    <input type="number" v-model.number="side.years" min="10" max="50" :aria-label="side.label + '年限'"
                        class="input-clean font-semibold">
                </div>
            </div>
        </div>

        <!-- 結果對照（收據式） -->
        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                v-for="side in sides"
                :key="side.key"
                :title="`${side.years} 年期`"
                :subtitle="`${amountWan} 萬 / ${rate}%`"
                main-label="每月還款"
                :main-value="`$ ${fmt(side.res.pay)}`"
                :main-tone="side.key === 'a' ? 'brand' : 'neutral'"
                :rows="[
                { label: '總利息', value: `$ ${fmt(side.res.totalInterest)}`, tone: 'tax' },
                { label: '本息總額', value: `$ ${fmt(side.res.totalPayment)}` },
                ]"
            />
        </div>

        <!-- 差異摘要 -->
        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">兩年限差多少</p>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <p class="text-[11px] text-ink-400">月付差額</p>
                    <p class="text-lg font-bold tabular-nums" :class="diffMonthly >= 0 ? 'text-amber-600' : 'text-brand-700'">
                        {{ diffMonthly >= 0 ? '+' : '−' }}$ {{ fmt(Math.abs(diffMonthly)) }}
                    </p>
                </div>
                <div>
                    <p class="text-[11px] text-ink-400">總利息差額</p>
                    <p class="text-lg font-bold tabular-nums" :class="diffInterest <= 0 ? 'text-brand-700' : 'text-amber-600'">
                        {{ diffInterest <= 0 ? '−' : '+' }}$ {{ fmt(Math.abs(diffInterest)) }}
                    </p>
                </div>
            </div>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">採本息平均攤還法估算，四捨五入至元。</p>
        </div>

        <!-- 分享 -->
        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {{ shareCopied ? '已複製連結 ✓' : '複製比較結果連結' }}
            </button>
            <a href="/tools/mortgage-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                進階試算：寬限期與分段利率
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const amountWan = ref(1000)
const rate = ref(2.0)
const sides = ref([
    { key: 'a', label: '30 年期', years: 30 },
    { key: 'b', label: '40 年期', years: 40 },
])

function compute(years, principal) {
    const P = Math.max(0, principal || 0)
    const Y = Math.max(1, Math.min(50, years || 0))
    const r = Math.max(0, rate.value || 0) / 100 / 12
    if (P <= 0) return { pay: 0, totalInterest: 0, totalPayment: 0 }
    if (r === 0) {
        const pay = P / (Y * 12)
        return { pay, totalInterest: 0, totalPayment: P }
    }
    const n = Y * 12
    const power = Math.pow(1 + r, n)
    const annuity = (P * r * power) / (power - 1)
    const totalInterest = annuity * n - P
    return { pay: annuity, totalInterest, totalPayment: P + totalInterest }
}

const sideA = computed(() => compute(sides.value[0].years, amountWan.value * 10000))
const sideB = computed(() => compute(sides.value[1].years, amountWan.value * 10000))

watch([sideA, sideB], () => {
    sides.value[0].res = sideA.value
    sides.value[1].res = sideB.value
}, { immediate: true, deep: true })

const diffMonthly = computed(() => (sideB.value.pay || 0) - (sideA.value.pay || 0))
const diffInterest = computed(() => (sideB.value.totalInterest || 0) - (sideA.value.totalInterest || 0))
const insight = computed(() => {
    const m = diffMonthly.value, i = diffInterest.value
    if (Math.abs(m) < 300 && Math.abs(i) < 300000) return '兩年限的月付與總利息相近，可依現金流偏好選擇。'
    if (m > 0 && i < 0) return `年限較短（${sides.value[0].years} 年）月付較高，但總利息較低——縮短年限是省利息最直接的方法。`
    if (m < 0 && i > 0) return `年限較長（${sides.value[1].years} 年）月付較低，但總利息多出不少——延長年限是用利息換現金流。`
    return '請同時比較月付與總利息，找出長期負擔得起的組合。'
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (amountWan.value < 0) amountWan.value = 0
    if (amountWan.value > 10000) amountWan.value = 10000
    if (rate.value < 0) rate.value = 0
    if (rate.value > 20) rate.value = 20
    sides.value.forEach(s => {
        if (s.years < 10) s.years = 10
        if (s.years > 50) s.years = 50
    })
}
watch(amountWan, validate)
watch(rate, validate)
watch(sides, validate, { deep: true, immediate: true })

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({
        amount: String(Math.round(amountWan.value)),
        rate: String(rate.value),
        ya: String(sides.value[0].years),
        yb: String(sides.value[1].years),
    })
    return `${window.location.origin}/compare/mortgage-30-vs-40-years?${p.toString()}`
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
        if (p.has('amount')) {
            amountWan.value = parseFloat(p.get('amount')) || amountWan.value
            rate.value = parseFloat(p.get('rate')) ?? rate.value
            sides.value[0].years = parseInt(p.get('ya')) || sides.value[0].years
            sides.value[1].years = parseInt(p.get('yb')) || sides.value[1].years
            return
        }
    }
    try {
        const saved = localStorage.getItem('taicalc_mortgage_term_compare')
        if (saved) {
            const d = JSON.parse(saved)
            if (d.amountWan) amountWan.value = d.amountWan
            if (d.rate !== undefined) rate.value = d.rate
            if (d.sides) sides.value = d.sides
        }
    } catch (_) {}
})

watch([amountWan, rate, sides], () => {
    if (typeof localStorage === 'undefined') return
    validate()
    localStorage.setItem('taicalc_mortgage_term_compare', JSON.stringify({
        amountWan: amountWan.value,
        rate: rate.value,
        sides: sides.value.map(s => ({ key: s.key, label: s.label, years: s.years })),
    }))
}, { deep: true })
</script>
