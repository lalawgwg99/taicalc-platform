// TaiCalc 比較器：城市生活成本
// 選兩個城市，並排比較三級月支出與生活指數。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">城市 A</label>
                    <select v-model="cityA" class="input-clean font-medium">
                        <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name['zh-TW'] }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">城市 B</label>
                    <select v-model="cityB" class="input-clean font-medium">
                        <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name['zh-TW'] }}</option>
                    </select>
                </div>
            </div>
            <p class="mt-2 text-[11px] text-ink-400">比較兩城的月生活成本（USD）與生活指數</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                :title="nameA"
                subtitle="月生活成本"
                main-label="舒適水準"
                :main-value="`$ ${fmt(comfortA)}`"
                main-tone="brand"
                :rows="[
                { label: '生存水準', value: `$ ${fmt(survivalA)}` },
                { label: '奢華水準', value: `$ ${fmt(luxuryA)}` },
                ]"
            />
            <ResultReceipt
                :title="nameB"
                subtitle="月生活成本"
                main-label="舒適水準"
                :main-value="`$ ${fmt(comfortB)}`"
                main-tone="neutral"
                :rows="[
                { label: '生存水準', value: `$ ${fmt(survivalB)}` },
                { label: '奢華水準', value: `$ ${fmt(luxuryB)}` },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">差異</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">金額為 USD 月支出概估；指數為 0–100 概估。</p>
        </div>

        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                {{ shareCopied ? '已複製連結 ✓' : '複製比較結果連結' }}
            </button>
            <a href="/tools/life-simulator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                用人生模擬器規劃
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';
import cities from '../../../public/data/cities.json';

const cityA = ref('taipei')
const cityB = ref('osaka')
const cityAId = ref(cityA.value)
const cityBId = ref(cityB.value)

const cityAObj = computed(() => cities.find((c) => c.id === cityA.value) || cities[0])
const cityBObj = computed(() => cities.find((c) => c.id === cityB.value) || cities[1])

const nameA = computed(() => cityAObj.value.name['zh-TW'])
const nameB = computed(() => cityBObj.value.name['zh-TW'])
const survivalA = computed(() => cityAObj.value.costs_usd.survival)
const comfortA = computed(() => cityAObj.value.costs_usd.comfort)
const luxuryA = computed(() => cityAObj.value.costs_usd.luxury)
const survivalB = computed(() => cityBObj.value.costs_usd.survival)
const comfortB = computed(() => cityBObj.value.costs_usd.comfort)
const luxuryB = computed(() => cityBObj.value.costs_usd.luxury)

const insight = computed(() => {
    const diff = comfortA.value - comfortB.value
    if (diff > 0) return `${nameA.value}的舒適月支出比 ${nameB.value} 高約 $ ${fmt(diff)} USD——若追求低成本生活，${nameB.value} 較輕鬆。`
    if (diff < 0) return `${nameB.value}的舒適月支出比 ${nameA.value} 高約 $ ${fmt(-diff)} USD——若追求低成本生活，${nameA.value} 較輕鬆。`
    return '兩城舒水準支出相近，可再比較安全、網路與氣候指數。'
})

const fmt = (n) => n ? Math.round(n).toLocaleString('en-US') : '0'

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({ a: cityA.value, b: cityB.value })
    return `${window.location.origin}/cost-of-living/compare?${p.toString()}`
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
        if (p.has('a') && cities.some((c) => c.id === p.get('a'))) cityA.value = p.get('a')
        if (p.has('b') && cities.some((c) => c.id === p.get('b'))) cityB.value = p.get('b')
    }
})
</script>
