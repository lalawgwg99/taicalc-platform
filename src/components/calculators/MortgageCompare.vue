// TaiCalc 互動比較器：新青安 vs 一般房貸
// 共用同一筆貸款金額，左右兩方案即時對照月付金、總利息與負擔差異。
<template>
    <div class="calculator-shell space-y-4">

        <!-- 共用輸入 -->
        <div class="card-surface p-5">
            <label class="block text-xs font-medium text-ink-400 mb-1.5">貸款總額（萬）</label>
            <input type="number" v-model.number="amountWan" aria-label="貸款總額" placeholder="1000"
                class="input-clean text-xl font-semibold tabular-nums">
            <p class="mt-2 text-[11px] text-ink-400">同一筆貸款金額，左右兩案即時對照</p>
        </div>

        <!-- 兩方案輸入 -->
        <div class="grid gap-3 md:grid-cols-2">
            <div v-for="side in sides" :key="side.key" class="card-surface p-5 space-y-3">
                <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-ink-600">{{ side.label }}</p>
                    <span v-if="side.key === 'a'"
                        class="data-pill !px-2.5 !py-1 text-brand-700 bg-brand-50 border-brand-200">優惠補貼</span>
                    <span v-else class="data-pill !px-2.5 !py-1 text-stone-600 bg-stone-100 border-stone-200">一般市場</span>
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">年利率（%）</label>
                    <input type="number" v-model.number="side.rate" step="0.005" :aria-label="side.label + '利率'"
                        class="input-clean font-semibold tabular-nums">
                    <p v-if="side.key === 'a'" class="mt-1 text-[10px] text-brand-600/70">預設為 2026 新青安優惠利率（補貼期間）</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-medium text-ink-400 mb-1.5">貸款年限</label>
                        <input type="number" v-model.number="side.years" :aria-label="side.label + '年限'"
                            class="input-clean font-semibold">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-ink-400 mb-1.5">寬限期（年）</label>
                        <select v-model.number="side.grace" :aria-label="side.label + '寬限期'"
                            class="input-clean font-medium">
                            <option :value="0">無</option>
                            <option v-for="y in 5" :key="y" :value="y">{{ y }} 年</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- 結果對照（收據式結果卡） -->
        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                v-for="side in sides"
                :key="side.key"
                :title="side.label"
                :subtitle="`${side.years} 年 / ${side.rate}% / 寬限 ${side.grace} 年`"
                :main-label="side.grace > 0 ? '寬限期後月付' : '每月還款'"
                :main-value="`$ ${fmt(side.res.pay)}`"
                :main-tone="side.key === 'a' ? 'brand' : 'neutral'"
                :secondary-label="side.grace > 0 ? '寬限期內月付（僅利息）' : ''"
                :secondary-value="side.grace > 0 ? `$ ${fmt(side.res.gracePay)}` : ''"
                :rows="[
                { label: '總利息', value: `$ ${fmt(side.res.totalInterest)}`, tone: 'tax' },
                { label: '本息總額', value: `$ ${fmt(side.res.totalPayment)}` },
                ]"
            />
        </div>

        <!-- 差異摘要 -->
        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">兩案差多少</p>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <p class="text-[11px] text-ink-400">月付差額（寬限期後）</p>
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
            <p class="text-[11px] leading-relaxed text-ink-400">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">採本息平均攤還法估算，四捨五入至元。寬限期後月付以剩餘期數重新攤還本金計算。</p>
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

// ── 狀態 ───────────────────────────────────────────────────────
const amountWan = ref(1000)
const sides = ref([
    { key: 'a', label: '新青安', rate: 1.775, years: 40, grace: 5 },
    { key: 'b', label: '一般房貸', rate: 2.185, years: 30, grace: 0 },
])

// ── 核心計算（本息平均攤還，含寬限期）────────────────────────
function compute(rate, years, grace, principal) {
    const P = Math.max(0, principal || 0)
    const Y = Math.max(1, Math.min(50, years || 0))
    const G = Math.max(0, Math.min(Math.max(0, Y - 1), grace || 0))
    const r = Math.max(0, rate || 0) / 100 / 12
    if (P <= 0) return { pay: 0, gracePay: 0, totalInterest: 0, totalPayment: 0, months: 0 }
    const remaining = Math.max(1, (Y - G) * 12)
    if (r === 0) {
        const pay = P / remaining
        return { pay, gracePay: 0, totalInterest: 0, totalPayment: P, months: remaining }
    }
    const power = Math.pow(1 + r, remaining)
    const annuity = (P * r * power) / (power - 1)
    if (G > 0) {
        const gracePay = P * r
        const totalInterest = gracePay * G * 12 + (annuity * remaining - P)
        return { pay: annuity, gracePay, totalInterest, totalPayment: P + totalInterest, months: Y * 12 }
    }
    const totalInterest = annuity * remaining - P
    return { pay: annuity, gracePay: 0, totalInterest, totalPayment: P + totalInterest, months: remaining }
}

const sideResult = (index) => computed(() => {
    const s = sides.value[index]
    return compute(s.rate, s.years, s.grace, amountWan.value * 10000)
})
const sideA = sideResult(0)
const sideB = sideResult(1)

// 每個 side 掛上即時結果（供模板直接取用）
watch([sideA, sideB], () => {
    sides.value[0].res = sideA.value
    sides.value[1].res = sideB.value
}, { immediate: true, deep: true })

// ── 差異摘要 ───────────────────────────────────────────────────
const diffMonthly = computed(() => (sideB.value.pay || 0) - (sideA.value.pay || 0))
const diffInterest = computed(() => (sideB.value.totalInterest || 0) - (sideA.value.totalInterest || 0))
const insight = computed(() => {
    const m = diffMonthly.value, i = diffInterest.value, t = 300
    if (Math.abs(m) < t && Math.abs(i) < t) return '兩方案的月付與總利息相近，可再比較寬限期壓力與申請資格。'
    if (m > 0 && i < 0) return `一般房貸月付較高（多 $ ${fmt(m)}），但完整清償的總利息反而較低——貸款年限與寬限期拉得越長，付出的總利息越多。`
    if (m < 0 && i > 0) return `新青安月付較低，但總利息較高。寬限期只減輕前期負擔，寬限期結束後的「真實月付」才是長期壓力來源。`
    return '兩案各有優勢，請同時比較「寬限期後的真實月付」與總利息。'
})

// ── 工具 ───────────────────────────────────────────────────────
const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (amountWan.value < 0) amountWan.value = 0
    if (amountWan.value > 10000) amountWan.value = 10000
    sides.value.forEach(s => {
        if (s.rate < 0 || s.rate === undefined) s.rate = 0
        if (s.rate > 20) s.rate = 20
        if (s.years < 1) s.years = 1
        if (s.years > 50) s.years = 50
        if (s.grace < 0) s.grace = 0
        if (s.grace >= s.years) s.grace = Math.max(0, s.years - 1)
    })
}
watch(amountWan, validate)
watch(sides, validate, { deep: true, immediate: true })

// ── 分享連結 ───────────────────────────────────────────────────
const shareCopied = ref(false)

const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({
        amount: String(Math.round(amountWan.value)),
        ra: String(sides.value[0].rate), ya: String(sides.value[0].years), ga: String(sides.value[0].grace),
        rb: String(sides.value[1].rate), yb: String(sides.value[1].years), gb: String(sides.value[1].grace),
    })
    return `${window.location.origin}/compare/xin-qing-an-vs-general-mortgage?${p.toString()}`
}

const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(buildShareURL())
        shareCopied.value = true
        setTimeout(() => { shareCopied.value = false }, 2500)
    } catch (_) {}
}

// ── URL 參數 + localStorage ────────────────────────────────────
onMounted(() => {
    if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search)
        if (p.has('amount')) {
            amountWan.value = parseFloat(p.get('amount')) || amountWan.value
            sides.value[0].rate = parseFloat(p.get('ra')) ?? sides.value[0].rate
            sides.value[0].years = parseInt(p.get('ya')) || sides.value[0].years
            sides.value[0].grace = parseInt(p.get('ga')) ?? sides.value[0].grace
            sides.value[1].rate = parseFloat(p.get('rb')) ?? sides.value[1].rate
            sides.value[1].years = parseInt(p.get('yb')) || sides.value[1].years
            sides.value[1].grace = parseInt(p.get('gb')) ?? sides.value[1].grace
            return
        }
    }
    try {
        const saved = localStorage.getItem('taicalc_mortgage_compare')
        if (saved) {
            const d = JSON.parse(saved)
            if (d.amountWan) amountWan.value = d.amountWan
            if (d.sides) sides.value = d.sides
        }
    } catch (_) {}
})

watch([amountWan, sides], () => {
    if (typeof localStorage === 'undefined') return
    validate()
    localStorage.setItem('taicalc_mortgage_compare', JSON.stringify({
        amountWan: amountWan.value,
        sides: sides.value.map(s => ({ key: s.key, label: s.label, rate: s.rate, years: s.years, grace: s.grace })),
    }))
}, { deep: true })
</script>
