<template>
  <div class="calculator-shell">
    <div class="calculator-card">
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label for="re-sale" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">賣出價 (NT$)</label>
          <input id="re-sale" type="text" inputmode="decimal" v-model.number="salePrice"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label for="re-buy" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">買入價／取得成本 (NT$)</label>
          <input id="re-buy" type="text" inputmode="decimal" v-model.number="purchasePrice"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label for="re-costs" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">必要費用 (NT$)</label>
          <input id="re-costs" type="text" inputmode="decimal" v-model.number="costs"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">仲介費、代書費、裝修費等取得、改良、移轉費用；沒有填 0。</p>
        </div>
        <div>
          <label for="re-land" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">土地漲價總數額 (NT$)</label>
          <input id="re-land" type="text" inputmode="decimal" v-model.number="landIncrement"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">申報土地增值稅時核定的漲價總數額；沒有或不清楚填 0。</p>
        </div>
        <div>
          <label for="re-years" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">持有年數</label>
          <input id="re-years" type="text" inputmode="decimal" v-model.number="holdingYears"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label for="re-months" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">持有月數（0–11）</label>
          <input id="re-months" type="text" inputmode="decimal" v-model.number="holdingMonths"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">合計持有 {{ totalMonths }} 個月；實際持有期間以取得日至交易日為準。</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">是否自用住宅</label>
          <div class="seg-control">
            <button type="button" @click="selfUse = false" :class="['seg-btn', !selfUse ? 'seg-btn-active' : '']">一般</button>
            <button type="button" @click="selfUse = true" :class="['seg-btn', selfUse ? 'seg-btn-active' : '']">自用住宅</button>
          </div>
          <p class="mt-1.5 text-[11px] text-ink-400">自用優惠須同時符合：個人、配偶或未成年子女設籍並連續持有滿 6 年，且 6 年內未出租、未供營業或執行業務使用。</p>
        </div>
      </div>

      <div v-if="selfUse && totalMonths < 72" class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-semibold text-amber-800">⚠️ 持有未滿 6 年，不符合自用住宅優惠條件，以下按一般稅率試算</p>
        <p class="mt-1 text-xs leading-5 text-amber-700">距自用優惠還差 {{ result.selfUseShortfallMonths }} 個月。等持有設籍滿 6 年且 6 年內未出租營業，才能適用 400 萬以下免稅、超過部分 10% 的優惠。</p>
      </div>

      <div class="calculator-subcard md:p-6 mt-6">
        <div class="text-center mb-6">
          <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">預估應納稅額</p>
          <p class="text-4xl sm:text-5xl font-bold text-ink-800 font-mono tracking-tight">
            <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ fmt(result.tax) }}
          </p>
          <p class="mt-2 text-xs text-ink-400">課稅所得 ${{ fmt(result.taxableIncome) }} × 適用稅率 {{ rateLabel }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <p class="text-xs text-ink-400">課稅所得</p>
            <p class="text-lg font-bold text-ink-600 font-mono">${{ fmt(result.taxableIncome) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400">適用稅率</p>
            <p class="text-lg font-bold text-ink-600 font-mono">{{ rateLabel }}</p>
          </div>
        </div>

        <div v-if="result.selfUseApplied" class="mt-5 rounded-xl bg-paper-50 p-4">
          <p class="text-sm leading-6 text-ink-700">已適用自用住宅優惠：課稅所得 {{ fmt(result.taxableIncome) }} 元，400 萬以下免稅，超過部分 {{ fmt(Math.max(0, result.taxableIncome - 4000000)) }} 元 × 10%。</p>
        </div>
        <div v-else-if="result.nextBracketMonths !== null" class="mt-5 rounded-xl bg-paper-50 p-4">
          <p class="text-sm leading-6 text-ink-700">再持有 <strong class="font-mono">{{ result.nextBracketMonths }}</strong> 個月，稅率可從 {{ (result.rate * 100).toFixed(0) }}% 降至 {{ (result.nextBracketRate * 100).toFixed(0) }}%（持有期間跨過臨界點時適用）。</p>
        </div>
        <div v-else class="mt-5 rounded-xl bg-paper-50 p-4">
          <p class="text-sm leading-6 text-ink-700">持有已超過 10 年，適用個人最低稅率 15%，沒有更低的一級可降。</p>
        </div>

        <p class="mt-5 text-xs leading-5 text-ink-400">課稅所得＝賣出價 − 買入價 − 必要費用 − 土地漲價總數額；虧損時課稅所得為 0。本工具為試算，非申報金額，實際應納稅額以國稅局核定為準。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { calculateGainsTax } from '../../utils/calculators/realEstateGainsTax';

const salePrice = ref(12000000);
const purchasePrice = ref(8000000);
const costs = ref(200000);
const landIncrement = ref(0);
const holdingYears = ref(1);
const holdingMonths = ref(6);
const selfUse = ref(false);

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('zh-TW');
const num = (v) => Math.max(Number(v) || 0, 0);
const totalMonths = computed(() => Math.floor(num(holdingYears.value)) * 12 + Math.min(Math.floor(num(holdingMonths.value)), 11));
const result = computed(() => calculateGainsTax({
  salePrice: num(salePrice.value),
  purchasePrice: num(purchasePrice.value),
  costs: num(costs.value),
  landIncrement: num(landIncrement.value),
  holdingMonths: totalMonths.value,
  selfUse: selfUse.value,
}));
const rateLabel = computed(() => result.value.selfUseApplied ? '自用優惠 10%（400 萬以下免稅）' : `${(result.value.rate * 100).toFixed(0)}%`);
</script>
