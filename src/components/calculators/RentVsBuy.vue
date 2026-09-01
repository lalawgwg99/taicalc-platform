// TaiCalc 比較器：買房 vs 租屋
// 比較買房（月付+持有成本+資產累積）與租屋（租金+頭期款投資）的長期成本與期末淨資產。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">房價（萬）</label>
                    <input type="number" v-model.number="homePriceWan" aria-label="房價" placeholder="1200"
                    class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">頭期款（萬）</label>
                    <input type="number" v-model.number="downWan" aria-label="頭期款" placeholder="300"
                    class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">房貸利率（%）</label>
                    <input type="number" v-model.number="rate" step="0.05" aria-label="房貸利率"
                    class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">房貸年限</label>
                    <input type="number" v-model.number="loanYears" min="10" max="40" aria-label="房貸年限"
                    class="input-clean font-semibold">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">月租金（元）</label>
                    <input type="number" v-model.number="monthlyRent" aria-label="月租金" placeholder="25000"
                    class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">持有/租期（年）</label>
                    <input type="number" v-model.number="years" min="1" max="40" aria-label="持有年數"
                    class="input-clean font-semibold">
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">房價年漲幅（%）</label>
                    <input type="number" v-model.number="homeAppr" step="0.5" aria-label="房價年漲幅"
                    class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">租金年漲幅（%）</label>
                    <input type="number" v-model.number="rentAppr" step="0.5" aria-label="租金年漲幅"
                    class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">投資報酬率（%）</label>
                    <input type="number" v-model.number="investRate" step="0.5" aria-label="投資報酬率"
                    class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <p class="text-[11px] text-ink-400">買房另估每年房屋稅+地價稅+管理費約房價 1%；租屋頭期款投入投資。均為估算假設。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="買房"
                subtitle="月付 + 持有成本"
                main-label="每月總支出"
                :main-value="`$ ${fmt(buyMonthly)}`"
                main-tone="brand"
                :rows="[
                { label: '期末房產價值', value: `$ ${fmt(homeValue)}` },
                { label: '期末剩餘貸款', value: `− $ ${fmt(remainingLoan)}`, tone: 'tax' },
                { label: '期末淨資產', value: `$ ${fmt(buyNetAsset)}` },
                ]"
            />
            <ResultReceipt
                title="租屋"
                subtitle="租金支出"
                main-label="每月租金"
                :main-value="`$ ${fmt(monthlyRent)}`"
                main-tone="neutral"
                :rows="[
                { label: '頭期款投資增值', value: `$ ${fmt(downInvest)}` },
                { label: '期末淨資產', value: `$ ${fmt(rentNetAsset)}` },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">哪個划算</p>
            <p class="text-xs leading-relaxed text-ink-500">{{ insight }}</p>
            <p class="text-[10px] text-ink-300">本比較未計裝潢、仲介、搬家與心理因素；房價與租金漲幅假設會大幅影響結果。</p>
        </div>

        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                {{ shareCopied ? '已複製連結 ✓' : '複製比較結果連結' }}
            </button>
            <a href="/tools/home-ownership-cost-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                進階：買房持有成本試算
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';

const homePriceWan = ref(1200)
const downWan = ref(300)
const rate = ref(2)
const loanYears = ref(30)
const monthlyRent = ref(25000)
const years = ref(10)
const homeAppr = ref(3)
const rentAppr = ref(2)
const investRate = ref(5)

const homePrice = computed(() => homePriceWan.value * 10000)
const down = computed(() => downWan.value * 10000)
const loan = computed(() => Math.max(0, homePrice.value - down.value))

// 買房：月付（本息平均攤還）
const buyMonthly = computed(() => {
    const P = loan.value, Y = loanYears.value, r = (rate.value || 0) / 100 / 12
    if (P <= 0) return 0
    if (r === 0) return P / (Y * 12)
    const n = Y * 12
    const power = Math.pow(1 + r, n)
    return (P * r * power) / (power - 1)
})
// 每月持有成本（房屋稅+地價稅+管理費 約房價 1%/年）
const carryMonthly = computed(() => homePrice.value * 0.01 / 12)
const buyTotalMonthly = computed(() => buyMonthly.value + carryMonthly.value)

// 期末房產價值與剩餘貸款
const homeValue = computed(() => Math.round(homePrice.value * Math.pow(1 + (homeAppr.value || 0) / 100, years.value)))
const remainingLoan = computed(() => {
    const P = loan.value, r = (rate.value || 0) / 100 / 12, N = loanYears.value * 12, n = years.value * 12
    if (P <= 0 || r === 0) return Math.max(0, P * (1 - n / N))
    const powerN = Math.pow(1 + r, N)
    const powerNn = Math.pow(1 + r, N - n)
    return Math.max(0, P * (powerN - powerNn) / (powerN - 1))
})
const buyNetAsset = computed(() => Math.max(0, homeValue.value - remainingLoan.value))

// 租屋：頭期款投資增值 + 租金成長
const downInvest = computed(() => Math.round(down.value * Math.pow(1 + (investRate.value || 0) / 100, years.value)))
const rentNetAsset = computed(() => downInvest.value)
const totalRentPaid = computed(() => {
    const g = (rentAppr.value || 0) / 100, n = years.value, r0 = monthlyRent.value * 12
    if (g === 0) return r0 * n
    return Math.round(r0 * ((Math.pow(1 + g, n) - 1) / g))
})

const insight = computed(() => {
    const diff = buyNetAsset.value - rentNetAsset.value
    if (diff > 0) return `${years} 年後：買房期末淨資產約 $ ${fmt(buyNetAsset.value)}，租屋約 $ ${fmt(rentNetAsset.value)}，買房多 $ ${fmt(diff)}（含房價漲幅 ${homeAppr}% 假設）。`
    if (diff < 0) return `${years} 年後：租屋期末淨資產約 $ ${fmt(rentNetAsset.value)}，買房約 $ ${fmt(buyNetAsset.value)}，租屋多 $ ${fmt(-diff)}——房價漲幅低於投資報酬時，租屋＋投資可能更划算。`
    return '兩者淨資產相近，可依居住需求與穩定性決定。'
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'

const validate = () => {
    if (homePriceWan.value < 0) homePriceWan.value = 0
    if (downWan.value < 0) downWan.value = 0
    if (downWan.value > homePriceWan.value) downWan.value = homePriceWan.value
    if (rate.value < 0) rate.value = 0
    if (loanYears.value < 1) loanYears.value = 1
    if (loanYears.value > 40) loanYears.value = 40
    if (monthlyRent.value < 0) monthlyRent.value = 0
    if (years.value < 1) years.value = 1
    if (years.value > 40) years.value = 40
}
watch([homePriceWan, downWan, rate, loanYears, monthlyRent, years], validate, { deep: true })

const shareCopied = ref(false)
const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({
        h: String(Math.round(homePriceWan.value)), d: String(Math.round(downWan.value)),
        r: String(rate.value), ly: String(loanYears.value), rent: String(Math.round(monthlyRent.value)),
        y: String(years.value), ha: String(homeAppr.value), ra: String(rentAppr.value), ir: String(investRate.value),
    })
    return `${window.location.origin}/compare/rent-vs-buy?${p.toString()}`
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
        if (p.has('h')) homePriceWan.value = parseFloat(p.get('h')) || homePriceWan.value
        if (p.has('d')) downWan.value = parseFloat(p.get('d')) || downWan.value
        if (p.has('y')) years.value = parseInt(p.get('y')) || years.value
    }
})
</script>
