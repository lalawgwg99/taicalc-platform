<template>
  <section class="grid gap-4 lg:grid-cols-[1.08fr_.92fr]">
    <div class="rounded-3xl border border-paper-300 bg-white p-5 shadow-sm sm:p-7">
      <div class="mb-6 flex items-start gap-3">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-sm font-bold text-white">01</span>
        <div><h2 class="text-lg font-semibold text-ink-700">你的長期投入計畫</h2><p class="mt-1 text-sm text-ink-500">所有數字都是假設；先用保守條件看自己能否持續。</p></div>
      </div>
      <div class="mb-6 rounded-2xl border border-paper-300 bg-paper-100 p-4">
        <div class="flex items-center justify-between gap-3"><div><strong class="text-sm text-ink-700">持有標的快速換算</strong><p class="mt-1 text-xs text-ink-500">輸入成交價與股數，換算為起始資金；不抓即時報價。</p></div><span class="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-ink-400">非推薦</span></div>
        <div class="mt-3 grid gap-3 sm:grid-cols-4">
          <label>標的<select v-model="selectedAsset" class="input-clean" @change="applyAsset"><option v-for="asset in assets" :key="asset.id" :value="asset.id">{{ asset.label }}</option></select></label>
          <label>每股價格（{{ activeAsset.currency }}）<input v-model.number="unitPrice" type="number" min="0" step="0.01" class="input-clean" /></label>
          <label>持有股數<input v-model.number="shares" type="number" min="0" step="1" class="input-clean" /></label>
          <label v-if="activeAsset.currency === 'USD'">美元匯率<input v-model.number="exchangeRate" type="number" min="0" step="0.01" class="input-clean" /></label>
        </div>
        <button type="button" class="mt-3 rounded-xl bg-ink-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink-800" @click="useHoldingValue">帶入起始資金 {{ money(holdingValue) }}</button>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <label>起始資金（元）<input v-model.number="principal" type="number" min="0" class="input-clean" /></label>
        <label>每月投入（元）<input v-model.number="monthly" type="number" min="0" class="input-clean" /></label>
        <label>投資年限（年）<input v-model.number="years" type="number" min="1" max="60" class="input-clean" /></label>
        <label>年化報酬假設（%）<input v-model.number="returnRate" type="number" step="0.1" class="input-clean" /></label>
        <label>每年總費用率（%）<input v-model.number="feeRate" type="number" min="0" step="0.01" class="input-clean" /></label>
        <label>年通膨率（%）<input v-model.number="inflation" type="number" min="0" step="0.1" class="input-clean" /></label>
      </div>
      <div class="mt-6 rounded-2xl bg-paper-200 p-4">
        <p class="text-xs font-semibold tracking-[.08em] text-ink-500">兩種思考鏡頭</p>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <div><strong class="text-sm text-ink-700">指數與分散</strong><p class="mt-1 text-xs leading-5 text-ink-500">不把擊敗市場當前提；重視低成本、分散與長期持有。</p></div>
          <div><strong class="text-sm text-ink-700">紀律與續航</strong><p class="mt-1 text-xs leading-5 text-ink-500">把可持續投入和面對波動的行為，放在報酬假設之前。</p></div>
        </div>
      </div>
    </div>
    <aside class="rounded-3xl bg-ink-800 p-5 text-white shadow-sm sm:p-7">
      <p class="text-xs font-semibold tracking-[.12em] text-brand-200">通膨後的購買力</p>
      <p class="mt-2 text-4xl font-semibold tracking-tight">{{ money(result.realValue) }}</p>
      <p class="mt-2 text-sm leading-6 text-ink-200">以今天的購買力計算；不是未來帳戶保證金額。</p>
      <div class="mt-6 grid grid-cols-2 gap-3">
        <div v-for="item in metrics" :key="item.label" class="rounded-2xl border border-white/15 bg-white/5 p-4"><p class="text-xs text-ink-200">{{ item.label }}</p><strong class="mt-1 block text-lg text-white">{{ item.value }}</strong></div>
      </div>
      <div class="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
        <div class="flex items-end justify-between gap-4"><div><p class="text-xs text-ink-200">相同假設若只算單利</p><strong class="mt-1 block text-xl">{{ money(result.simpleValue) }}</strong></div><div class="text-right"><p class="text-xs text-ink-200">複利多出</p><strong class="mt-1 block text-lg text-brand-200">{{ money(result.compoundGain) }}</strong></div></div>
        <p class="mt-2 text-[11px] leading-5 text-ink-200">單利比較：每筆本金只依剩餘持有時間計息，不把利息加入下一期本金；複利會將報酬繼續累積。</p>
      </div>
      <div class="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
        <p class="text-xs font-semibold text-brand-100">下跌時的行為壓力測試</p>
        <p class="mt-2 text-sm leading-6 text-ink-100">若第 {{ shockYear }} 年帳面下跌 {{ drawdown }}%，持續投入的情境約為 <strong>{{ money(shockResult) }}</strong>。這是固定假設的數學結果，不代表市場路徑。</p>
        <div class="mt-3 flex gap-2"><label class="flex-1 text-xs text-ink-200">下跌年<input v-model.number="shockYear" type="number" min="1" :max="years" class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-white" /></label><label class="flex-1 text-xs text-ink-200">跌幅 %<input v-model.number="drawdown" type="number" min="0" max="100" class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-white" /></label></div>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const principal = ref(500000), monthly = ref(10000), years = ref(20), returnRate = ref(6), feeRate = ref(0.3), inflation = ref(2), shockYear = ref(5), drawdown = ref(30);
const assets = [
  { id: 'custom-tw', label: '自訂台灣標的', currency: 'TWD' },
  { id: '0050', label: '0050 元大台灣50 ETF', currency: 'TWD' },
  { id: '006208', label: '006208 富邦台50 ETF', currency: 'TWD' },
  { id: '2330', label: '2330 台積電', currency: 'TWD' },
  { id: 'custom-us', label: '自訂美國標的', currency: 'USD' },
  { id: 'VT', label: 'VT 全球股票 ETF', currency: 'USD' },
  { id: 'VTI', label: 'VTI 美國全市場 ETF', currency: 'USD' },
  { id: 'VOO', label: 'VOO S&P 500 ETF', currency: 'USD' },
  { id: 'AAPL', label: 'AAPL Apple', currency: 'USD' },
] as const;
const selectedAsset = ref('custom-tw'), unitPrice = ref(0), shares = ref(0), exchangeRate = ref(32);
const activeAsset = computed(() => assets.find((item) => item.id === selectedAsset.value) ?? assets[0]);
const holdingValue = computed(() => safe(unitPrice.value) * safe(shares.value) * (activeAsset.value.currency === 'USD' ? safe(exchangeRate.value) : 1));
const applyAsset = () => { unitPrice.value = 0; };
const useHoldingValue = () => { principal.value = Math.round(holdingValue.value); window.taicalcTrackEvent?.('asset_preset_apply', { asset: selectedAsset.value }); };
const safe = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);
const futureValue = (rate: number, includeShock = false) => {
  let value = safe(principal.value);
  const months = Math.round(safe(years.value) * 12);
  const monthlyRate = rate / 12;
  for (let month = 1; month <= months; month++) {
    value = value * (1 + monthlyRate) + safe(monthly.value);
    if (includeShock && month === Math.min(months, Math.max(1, Math.round(safe(shockYear.value) * 12)))) value *= 1 - Math.min(1, safe(drawdown.value) / 100);
  }
  return value;
};
const result = computed(() => {
  const gross = safe(returnRate.value) / 100;
  const net = gross - safe(feeRate.value) / 100;
  const nominalValue = futureValue(net);
  const noFeeValue = futureValue(gross);
  const yearsValue = safe(years.value);
  const contributions = safe(principal.value) + safe(monthly.value) * yearsValue * 12;
  const monthlyAmount = safe(monthly.value);
  const months = Math.round(yearsValue * 12);
  const simpleContributions = Array.from({ length: months }, (_, index) => monthlyAmount * (1 + net * ((months - index - 1) / 12))).reduce((total, value) => total + value, 0);
  const simpleValue = safe(principal.value) * (1 + net * yearsValue) + simpleContributions;
  return { netRate: net, nominalValue, contributions, simpleValue, compoundGain: nominalValue - simpleValue, realValue: nominalValue / Math.pow(1 + safe(inflation.value) / 100, yearsValue), feeImpact: Math.max(0, noFeeValue - nominalValue) };
});
const shockResult = computed(() => futureValue(result.value.netRate, true) / Math.pow(1 + safe(inflation.value) / 100, safe(years.value)));
const money = (value: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(value);
const percent = (value: number) => `${(value * 100).toFixed(2)}%`;
const metrics = computed(() => [
  { label: '投入本金', value: money(result.value.contributions) },
  { label: '名目期末值', value: money(result.value.nominalValue) },
  { label: '扣除費用後年化', value: percent(result.value.netRate) },
  { label: '費用差額', value: money(result.value.feeImpact) },
]);
</script>
