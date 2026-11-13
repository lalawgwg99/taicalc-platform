// TaiCalc：新股抽籤期望值試算機
// 輸入承銷價、申購股數、預期賣出價、中籤率、凍結天數、資金年利率，
// 算出預扣金額、中籤損益、未中籤損失與期望值，直接回答「這檔該不該抽」。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5 space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
                <div>
                    <label for="fld-ipo-issue" class="block text-xs font-medium text-ink-400 mb-1.5">承銷價（元／股）</label>
                    <input id="fld-ipo-issue" type="text" inputmode="decimal" v-model.number="issuePrice" aria-label="承銷價" placeholder="100"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label for="fld-ipo-shares" class="block text-xs font-medium text-ink-400 mb-1.5">申購股數（股）</label>
                    <input id="fld-ipo-shares" type="text" inputmode="decimal" v-model.number="shares" aria-label="申購股數" placeholder="1000"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label for="fld-ipo-sell" class="block text-xs font-medium text-ink-400 mb-1.5">預期賣出價（元／股）</label>
                    <input id="fld-ipo-sell" type="text" inputmode="decimal" v-model.number="sellPrice" aria-label="預期賣出價" placeholder="120"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label for="fld-ipo-rate" class="block text-xs font-medium text-ink-400 mb-1.5">中籤率（%）</label>
                    <input id="fld-ipo-rate" type="text" inputmode="decimal" v-model.number="winRatePct" aria-label="中籤率" placeholder="5"
                        class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label for="fld-ipo-days" class="block text-xs font-medium text-ink-400 mb-1.5">資金凍結天數（天）</label>
                    <input id="fld-ipo-days" type="text" inputmode="decimal" v-model.number="frozenDays" aria-label="資金凍結天數" placeholder="5"
                        class="input-clean font-semibold tabular-nums">
                </div>
                <div>
                    <label for="fld-ipo-interest" class="block text-xs font-medium text-ink-400 mb-1.5">資金年利率（%，機會成本）</label>
                    <input id="fld-ipo-interest" type="text" inputmode="decimal" v-model.number="annualRatePct" aria-label="資金年利率" placeholder="2"
                        class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                <button type="button" @click="applyHanCe"
                    class="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-400">
                    熱門檔參考：漢測中籤率 0.29%
                </button>
                <button type="button" @click="applyJuHong"
                    class="rounded-full border border-paper-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-brand-200 hover:text-brand-600">
                    破發範例：巨虹 45.6 → 33.1 元
                </button>
            </div>
            <p class="text-[11px] text-ink-400">中籤率沒有公開 API，請自填或參考該檔歷史中籤率；年利率只是機會成本假設（錢凍著不能用），不是真的要付利息。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 items-stretch">
            <ResultReceipt
                title="期望值"
                :subtitle="verdictSubtitle"
                main-label="每次申購期望值"
                :main-value="evDisplay"
                :main-tone="verdictTone"
                :rows="[
                    { label: '預扣總金額', value: `$${fmt(result.prepaid)}` },
                    { label: '中籤時損益', value: signed(result.winProfit), tone: result.winProfit >= 0 ? 'growth' : 'tax' },
                    { label: '未中籤損失', value: `−$${fmt(result.loseLoss)}`, tone: 'tax' },
                    { label: '損益平衡賣出價', value: breakEvenDisplay },
                ]"
            />
            <ResultReceipt
                title="怎麼算出來的"
                subtitle="中籤率 × 價差 − 手續費 − 機會成本"
                main-label="中籤率"
                :main-value="`${winRatePct || 0}%`"
                :rows="[
                    { label: '價差', value: signed(result.spread), tone: result.spread >= 0 ? 'growth' : 'tax' },
                    { label: '手續費', value: '−$70', tone: 'tax' },
                    { label: '機會成本', value: `−$${fmt(result.opportunityCost)}`, tone: 'tax' },
                ]"
            />
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm space-y-2">
            <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider">結論解讀</p>
            <ul class="text-xs leading-relaxed text-ink-500 space-y-1 list-disc pl-4">
                <li v-for="(line, i) in insight" :key="i">{{ line }}</li>
            </ul>
            <p class="text-[10px] text-ink-400">期望值是機率平均，不是保證獲利；掛牌價可能低於承銷價（破發），中籤率是自填假設，填錯期望值就跟著錯。</p>
        </div>

        <div class="flex gap-2">
            <a href="/tools/stock-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                算股票損益
                <span aria-hidden="true">→</span>
            </a>
            <a href="/tools/etf-dividend-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-paper-300 bg-white px-4 py-2.5 text-sm text-ink-600 hover:border-brand-200 hover:text-brand-600 transition-all">
                試算 ETF 配息
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ResultReceipt from '../ResultReceipt.vue';
import { calculateIpoLottery } from '../../utils/calculators/ipoLottery';

const issuePrice = ref(100)
const shares = ref(1000)
const sellPrice = ref(120)
const winRatePct = ref(5)
const frozenDays = ref(5)
const annualRatePct = ref(2)

const result = computed(() => calculateIpoLottery({
    issuePrice: issuePrice.value,
    shares: shares.value,
    sellPrice: sellPrice.value,
    winRatePct: winRatePct.value,
    frozenDays: frozenDays.value,
    annualRatePct: annualRatePct.value,
}))

const verdictText = computed(() =>
    result.value.verdict === 'worth' ? '值得抽'
    : result.value.verdict === 'marginal' ? '邊際，可抽可不抽' : '不值得抽')
const verdictSubtitle = computed(() =>
    result.value.verdict === 'worth' ? '期望值為正，長期抽下來平均是賺的'
    : result.value.verdict === 'marginal' ? '期望值接近 0，抽不抽差別不大'
    : '期望值為負，長期抽下來平均是賠的')
const verdictTone = computed(() =>
    result.value.verdict === 'worth' ? 'brand'
    : result.value.verdict === 'marginal' ? 'neutral' : 'tax')
const evDisplay = computed(() => {
    const ev = result.value.expectedValue
    return ev >= 0 ? `+$${fmt(ev)}` : `−$${fmt(Math.abs(ev))}`
})
const breakEvenDisplay = computed(() =>
    `$${result.value.breakEvenSellPrice.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}／股`)

const insight = computed(() => {
    const parts = []
    parts.push(`結論：${verdictText.value}。期望值 ${signed(result.value.expectedValue)} 元是「每抽一次平均賺或賠多少」，不是保證。`)
    if (result.value.spread > 0) {
        parts.push(`中籤賣出價差 $${fmt(result.value.spread)}，扣 70 元手續費與 $${fmt(result.value.opportunityCost)} 機會成本，中籤賺 $${fmt(result.value.winProfit)}。`)
    } else if (result.value.spread < 0) {
        parts.push(`預期賣出價低於承銷價（破發），中籤反而賠 $${fmt(Math.abs(result.value.winProfit))}；巨虹 45.6 元抽到、33.1 元掛牌就是前車之鑑。`)
    } else {
        parts.push('預期賣出價等於承銷價，沒有價差，中籤只剩手續費與機會成本要賠。')
    }
    if ((winRatePct.value || 0) < 1) {
        parts.push(`中籤率不到 1%，幾乎等於沒抽到；期望值幾乎全靠價差撐，價差不夠大就不用抽。`)
    }
    parts.push(`損益平衡賣出價 ${breakEvenDisplay.value}：賣在這個價錢以上，中籤才賺錢；以下就是賠（承銷價＋每股分攤的 70 元手續費與機會成本）。`)
    parts.push(`申購前戶頭要先有 $${fmt(result.value.prepaid)}（承銷價×股數＋70 元），餘額不足會變不合格件。`)
    return parts
})

const fmt = (n) => n ? Math.round(n).toLocaleString('zh-TW') : '0'
const signed = (n) => n >= 0 ? `+$${fmt(n)}` : `−$${fmt(Math.abs(n))}`

// 漢測（7856）2026-09：承銷價 2,250 元、凍資 8,656 億元、合格件中籤率 0.29%、
// 9/22 掛牌首日收 4,730 元（抽中一張現賺約 248 萬）。只帶入中籤率，價格請自行對照該檔。
const applyHanCe = () => { winRatePct.value = 0.29 }
// 巨虹（8084）2026-09：承銷價 45.6 元、9/24 跌停 33.1 元，每張價差 −12,500 元，
// 公司 9/23 決議撤銷現增、金管會 9/24 核准。只帶入價格，中籤率請自行填寫。
const applyJuHong = () => { issuePrice.value = 45.6; sellPrice.value = 33.1 }

watch(issuePrice, (v) => { if (v < 0) issuePrice.value = 0; if (v > 100000) issuePrice.value = 100000 })
watch(shares, (v) => { if (v < 0) shares.value = 0; if (v > 100000) shares.value = 100000 })
watch(sellPrice, (v) => { if (v < 0) sellPrice.value = 0; if (v > 100000) sellPrice.value = 100000 })
watch(winRatePct, (v) => { if (v < 0) winRatePct.value = 0; if (v > 100) winRatePct.value = 100 })
watch(frozenDays, (v) => { if (v < 0) frozenDays.value = 0; if (v > 365) frozenDays.value = 365 })
watch(annualRatePct, (v) => { if (v < 0) annualRatePct.value = 0; if (v > 30) annualRatePct.value = 30 })
</script>
