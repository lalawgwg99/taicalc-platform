// TaiCalc 比較器：夏月 vs 非夏月電費
// 同用電度數，比較台電夏月與非夏月累進電價的費用差異。
<template>
    <div class="calculator-shell space-y-4">

        <!-- 共用輸入 -->
        <div class="card-surface p-5">
            <label class="block text-xs font-medium text-ink-400 mb-1.5">每月用電度數（度）</label>
            <input type="number" v-model.number="kwh" aria-label="每月用電度數" placeholder="500"
                class="input-clean text-xl font-semibold tabular-nums">
            <p class="mt-2 text-[11px] text-ink-400">同一用電量，左右比較夏月與非夏月的電費差異（台電 2025-10 起費率）</p>
        </div>

        <!-- 結果對照（收據式） -->
        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="夏月（6~9 月）"
                subtitle="累進電價"
                main-label="電費總額"
                :main-value="`$ ${fmt(summer.totalCost)}`"
                :main-tone="'tax'"
                :rows="summerRows"
            />
            <ResultReceipt
                title="非夏月"
                subtitle="累進電價"
                main-label="電費總額"
                :main-value="`$ ${fmt(winter.totalCost)}`"
                :main-tone="'brand'"
                :rows="winterRows"
            />
        </div>

        <!-- 差異摘要 -->
        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">夏月比非夏月多多少</p>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <p class="text-[11px] text-ink-400">電費差額</p>
                    <p class="text-lg font-bold tabular-nums text-amber-600">+$ {{ fmt(diff) }}</p>
                </div>
                <div>
                    <p class="text-[11px] text-ink-400">平均每度（夏月）</p>
                    <p class="text-lg font-bold tabular-nums text-ink-700">$ {{ fmt(avgSummer) }}</p>
                </div>
            </div>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">台電住宅累進電價：夏月 $1.78–$8.86、非夏月 $1.78–$7.03，採 2025-10-01 起實施費率。</p>
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
            <a href="/tools/electricity-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                進階試算：冷氣與電器用電
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';
import {
    SUMMER_ELECTRICITY_RATES,
    NON_SUMMER_ELECTRICITY_RATES,
    calcElectricityCostSummary,
} from '../../utils/calculators/electricity';

const kwh = ref(500)

const summer = computed(() => calcElectricityCostSummary(Math.max(0, kwh.value || 0), SUMMER_ELECTRICITY_RATES))
const winter = computed(() => calcElectricityCostSummary(Math.max(0, kwh.value || 0), NON_SUMMER_ELECTRICITY_RATES))

const summerRows = computed(() => summer.value.tiers.slice(0, 3).map(t => ({ label: t.label, value: `$ ${fmt(t.cost)}` })))
const winterRows = computed(() => winter.value.tiers.slice(0, 3).map(t => ({ label: t.label, value: `$ ${fmt(t.cost)}` })))

const diff = computed(() => Math.max(0, (summer.value.totalCost || 0) - (winter.value.totalCost || 0)))
const avgSummer = computed(() => kwh.value > 0 ? (summer.value.totalCost || 0) / kwh.value : 0)
const insight = computed(() => {
    if (kwh.value <= 0) return '請輸入用電度數。'
    if (kwh.value <= 120) return '用電量在基本級距內，夏月與非夏月費率相同，電費差異不大。'
    return `用電 ${kwh.value} 度，夏月比非夏月多約 $ ${fmt(diff.value)} 元。用電量越高、夏月差距越大——夏季省電（尤其冷空調）最有效。`
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (kwh.value < 0) kwh.value = 0
    if (kwh.value > 100000) kwh.value = 100000
}
watch(kwh, validate)

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({ kwh: String(Math.round(kwh.value)) })
    return `${window.location.origin}/compare/electricity-summer-vs-nonsummer?${p.toString()}`
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
        if (p.has('kwh')) {
            kwh.value = parseFloat(p.get('kwh')) || kwh.value
            return
        }
    }
    try {
        const saved = localStorage.getItem('taicalc_elec_compare')
        if (saved) kwh.value = JSON.parse(saved).kwh ?? kwh.value
    } catch (_) {}
})

watch(kwh, () => {
    if (typeof localStorage === 'undefined') return
    validate()
    localStorage.setItem('taicalc_elec_compare', JSON.stringify({ kwh: kwh.value }))
})
</script>
