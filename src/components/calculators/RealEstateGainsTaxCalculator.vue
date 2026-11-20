<template>
  <div class="calculator-shell">
    <div class="calculator-card">
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label for="re-sale" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">賣出價 (NT$)</label>
          <ThousandsInput v-model="salePrice" id="re-sale" aria-label="賣出價"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p v-if="salePriceError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ salePriceError }}</p>
        </div>
        <div>
          <label for="re-buy" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">買入價／取得成本 (NT$)</label>
          <ThousandsInput v-model="purchasePrice" id="re-buy" aria-label="買入價"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p v-if="purchasePriceError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ purchasePriceError }}</p>
        </div>
        <div>
          <label for="re-costs" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">必要費用 (NT$)</label>
          <ThousandsInput v-model="costs" id="re-costs" aria-label="必要費用"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="costsError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ costsError }}</p>
          <p class="mt-1.5 text-[11px] text-ink-400">仲介費、代書費、裝修費等取得、改良、移轉費用；沒有填 0。</p>
        </div>
        <div>
          <label for="re-land" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">土地漲價總數額 (NT$)</label>
          <ThousandsInput v-model="landIncrement" id="re-land" aria-label="土地漲價總數額"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="landIncrementError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ landIncrementError }}</p>
          <p class="mt-1.5 text-[11px] text-ink-400">申報土地增值稅時核定的漲價總數額；沒有或不清楚填 0。</p>
        </div>
        <div>
          <label for="re-years" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">持有年數</label>
          <input id="re-years" type="text" inputmode="decimal" v-model.number="holdingYears" v-sync-change
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="holdingYearsError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ holdingYearsError }}</p>
        </div>
        <div>
          <label for="re-months" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">持有月數（0–11）</label>
          <input id="re-months" type="text" inputmode="decimal" v-model.number="holdingMonths" v-sync-change @blur="applyCarryOver" @change="applyCarryOver"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="carryHint" class="mt-1.5 text-xs font-medium text-[#A58436]">{{ carryHint }}</p>
          <p class="mt-1.5 text-[11px] text-ink-400">合計持有 {{ totalMonths }} 個月；實際持有期間以取得日至交易日為準。</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">是否自用住宅</label>
          <div class="seg-control">
            <button type="button" @click="selfUse = false" :class="['seg-btn', !selfUse ? 'seg-btn-active' : '']">一般</button>
            <button type="button" @click="selfUse = true" :class="['seg-btn', selfUse ? 'seg-btn-active' : '']">自用住宅</button>
          </div>
          <details class="mt-1.5 text-[11px] text-ink-400">
            <summary class="cursor-pointer">自用優惠條件</summary>
            <p class="mt-1 leading-5">須同時符合：個人、配偶或未成年子女設籍並連續持有滿 6 年，且 6 年內未出租、未供營業或執行業務使用。</p>
          </details>
        </div>
      </div>

      <div v-if="selfUse && totalMonths < 72" class="mt-5 border-l-2 border-[#A58436] pl-4 py-1">
        <p class="text-sm font-semibold text-ink-700">⚠️ 持有未滿 6 年，不符合自用住宅優惠條件，以下按一般稅率試算</p>
        <p class="mt-1 text-xs leading-5 text-ink-400">距自用優惠還差 {{ result.selfUseShortfallMonths }} 個月。等持有設籍滿 6 年且 6 年內未出租營業，才能適用 400 萬以下免稅、超過部分 10% 的優惠。</p>
      </div>

      <div class="calculator-subcard md:p-6 mt-6">
        <div v-if="hasInputError" class="text-center py-6">
          <p class="text-sm font-semibold text-[#B3261E]">請先修正上方輸入再試算</p>
        </div>
        <template v-else>
        <div class="text-center mb-6">
          <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">預估應納稅額</p>
          <p class="receipt-main-value whitespace-nowrap">
            <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ fmt(result.tax) }}
          </p>
          <p class="mt-2 text-xs text-ink-400 whitespace-nowrap">課稅所得 ${{ fmt(result.taxableIncome) }}</p>
          <p class="mt-1 text-xs text-ink-400">適用稅率 {{ rateLabel }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <p class="text-xs text-ink-400">課稅所得</p>
            <p class="text-lg font-bold text-ink-600">${{ fmt(result.taxableIncome) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400">適用稅率</p>
            <p class="text-lg font-bold text-ink-600">{{ rateLabel }}</p>
          </div>
        </div>

        <div v-if="result.selfUseApplied" class="mt-5 border-l-2 border-[#A58436] pl-4 py-1">
          <div class="space-y-1 text-sm leading-6 text-ink-700">
            <p>已適用自用住宅優惠</p>
            <p>課稅所得 <span class="whitespace-nowrap">{{ fmt(result.taxableIncome) }} 元</span></p>
            <p>400 萬以下免稅，超過部分 <span class="whitespace-nowrap">{{ fmt(Math.max(0, result.taxableIncome - 4000000)) }} 元</span> × 10%</p>
          </div>
        </div>
        <div v-else-if="result.tax === 0" class="mt-5 border-l-2 border-[#A58436] pl-4 py-1">
          <p class="text-sm leading-6 text-ink-700">目前課稅所得為 0、無應納稅額，不需要再持有降稅。</p>
        </div>
        <div v-else-if="result.nextBracketMonths !== null" class="mt-5 border-l-2 border-[#A58436] pl-4 py-1">
          <p class="text-sm leading-6 text-ink-700">再持有 <strong>{{ result.nextBracketMonths }}</strong> 個月，稅率可從 {{ (result.rate * 100).toFixed(0) }}% 降至 {{ (result.nextBracketRate * 100).toFixed(0) }}%（持有期間跨過臨界點時適用）。</p>
        </div>
        <div v-else class="mt-5 border-l-2 border-[#A58436] pl-4 py-1">
          <p class="text-sm leading-6 text-ink-700">持有已超過 10 年，適用個人最低稅率 15%，沒有更低的一級可降。</p>
        </div>

        <div class="mt-5 flex justify-center">
          <SnapshotButton tool-name="房地合一稅試算" :metrics="[{ label: '預估應納稅額', value: '$' + fmt(result.tax) }, { label: '課稅所得', value: '$' + fmt(result.taxableIncome) }, { label: '適用稅率', value: rateLabel }]" />
        </div>

        <p class="mt-5 text-xs leading-5 text-ink-400">課稅所得＝賣出價 − 買入價 − 必要費用 − 土地漲價總數額；虧損時課稅所得為 0。本工具為試算，非申報金額，實際應納稅額以國稅局核定為準。</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { calculateGainsTax, normalizeHoldingPeriod } from '../../utils/calculators/realEstateGainsTax';
import ThousandsInput from '../ThousandsInput.vue';
import SnapshotButton from '../SnapshotButton.vue';
import { vSyncChange } from '../../utils/vueSyncChange';

const salePrice = ref(12000000);
const purchasePrice = ref(8000000);
const costs = ref(200000);
const landIncrement = ref(0);
const holdingYears = ref(1);
const holdingMonths = ref(6);
const selfUse = ref(false);

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('zh-TW');
const num = (v) => Math.max(Number(v) || 0, 0);
// 持有期間以 normalizeHoldingPeriod 正規化：月數 ≥12 自動進位成年，
// totalMonths 不再用 Math.min(..., 11) 夾掉（1 年 12 個月＝24 個月）。
const normalizedHolding = computed(() => normalizeHoldingPeriod(holdingYears.value, holdingMonths.value));
const totalMonths = computed(() => normalizedHolding.value.totalMonths);

// 月數 ≥12 時才顯示的進位提示（ref 存文字，進位時才顯示）
const carryHint = ref('');
watch([holdingYears, holdingMonths], ([y, m]) => {
  if (Math.floor(Number(m) || 0) >= 12) {
    const n = normalizeHoldingPeriod(y, m);
    carryHint.value = `已進位為 ${n.years} 年 ${n.months} 個月`;
  } else {
    carryHint.value = '';
  }
});

// 失焦時把進位寫回欄位（打字中途不改寫，避免干擾輸入）：
// 填 12 → 年數 +1、月數歸 0，欄位數字與「0–11」標示一致。
const applyCarryOver = () => {
  const n = normalizeHoldingPeriod(holdingYears.value, holdingMonths.value);
  if (n.years !== Math.floor(Number(holdingYears.value) || 0) || n.months !== Math.floor(Number(holdingMonths.value) || 0)) {
    holdingYears.value = n.years;
    holdingMonths.value = n.months;
  }
};

const amountError = (v, label) =>
  v === null || v === undefined || v === '' ? `請輸入${label}` : Number(v) < 0 ? `${label}不可為負數` : '';
const salePriceError = computed(() => amountError(salePrice.value, '賣出價'));
const purchasePriceError = computed(() => amountError(purchasePrice.value, '買入價'));
const costsError = computed(() => amountError(costs.value, '必要費用'));
const landIncrementError = computed(() => amountError(landIncrement.value, '土地漲價總數額'));
const holdingYearsError = computed(() => {
  const v = holdingYears.value;
  if (v === null || v === undefined || v === '') return '';
  return Number(v) < 0 ? '持有年數不可為負數' : '';
});
const hasInputError = computed(() => Boolean(
  salePriceError.value || purchasePriceError.value || costsError.value
  || landIncrementError.value || holdingYearsError.value,
));
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
