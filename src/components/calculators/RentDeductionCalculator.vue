<template>
  <div class="calculator-shell">
    <div class="calculator-card">
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label for="rd-rent" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">每月租金 (NT$)</label>
          <input id="rd-rent" type="text" inputmode="decimal" v-model.number="monthlyRent"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label for="rd-months" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">課稅年度內承租月數</label>
          <input id="rd-months" type="text" inputmode="decimal" v-model.number="months"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">全年住滿填 12；年中搬入、搬出按實際月份填。</p>
        </div>
        <div>
          <label for="rd-subsidy" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">每月領取的租金補貼 (NT$)</label>
          <input id="rd-subsidy" type="text" inputmode="decimal" v-model.number="subsidyMonthly"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">沒領補貼填 0。財政部規定：申報金額要先減除政府補助。</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">你的邊際稅率</label>
          <div class="seg-control">
            <button type="button" @click="rateMode = 'direct'" :class="['seg-btn', rateMode === 'direct' ? 'seg-btn-active' : '']">直接選稅率</button>
            <button type="button" @click="rateMode = 'income'" :class="['seg-btn', rateMode === 'income' ? 'seg-btn-active' : '']">用所得淨額推算</button>
          </div>
        </div>
        <div v-if="rateMode === 'direct'">
          <label for="rd-rate" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">邊際稅率</label>
          <select id="rd-rate" v-model.number="directRate"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
            <option :value="0.05">5%</option>
            <option :value="0.12">12%</option>
            <option :value="0.2">20%（排富，不適用）</option>
            <option :value="0.3">30%（排富，不適用）</option>
            <option :value="0.4">40%（排富，不適用）</option>
          </select>
          <p class="mt-1.5 text-[11px] text-ink-400">看去年申報書的「適用稅率」欄位；不確定就用右邊的所得淨額推算。</p>
        </div>
        <div v-else>
          <label for="rd-income" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">全年綜合所得淨額 (NT$)</label>
          <input id="rd-income" type="text" inputmode="decimal" v-model.number="netIncome"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">所得淨額＝所得總額減免稅額與扣除額，申報書上有這一欄。推算稅率：{{ (marginalRate * 100).toFixed(0) }}%（115 年度級距）。</p>
        </div>
      </div>

      <div v-if="excluded" class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-semibold text-amber-800">⚠️ 你的適用稅率在 20% 以上，依排富規定不能申報租金特別扣除額</p>
        <p class="mt-1 text-xs leading-5 text-amber-700">排富三種情形（符合任一即不適用）：申報適用稅率 20% 以上、股利按 28% 分開計稅、基本所得額超過當年度扣除額（113 至 115 年度皆為 750 萬元）。下方金額僅供對照，實際省稅為 0。</p>
      </div>

      <div class="calculator-subcard md:p-6 mt-6">
        <div class="text-center mb-6">
          <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">預估一年省稅金額</p>
          <p class="text-4xl sm:text-5xl font-bold text-ink-800 font-mono tracking-tight">
            <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ fmt(taxSaved) }}
          </p>
          <p class="mt-2 text-xs text-ink-400">申報扣除額 ${{ fmt(deduction) }} × 邊際稅率 {{ (marginalRate * 100).toFixed(0) }}%</p>
        </div>
        <div class="grid grid-cols-3 gap-4 text-center pt-6 border-t border-ink-100">
          <div>
            <p class="text-xs text-ink-400 mb-1">年租金總額</p>
            <p class="text-lg font-bold text-ink-600 font-mono">${{ fmt(annualRent) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 mb-1">減除補助後金額</p>
            <p class="text-lg font-bold text-ink-600 font-mono">${{ fmt(deductibleBase) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 mb-1">可申報扣除額（上限 18 萬）</p>
            <p class="text-lg font-bold text-brand-700 font-mono">${{ fmt(deduction) }}</p>
          </div>
        </div>
        <p class="mt-4 text-[11px] leading-5 text-ink-400">省稅以「扣除額 × 邊際稅率」估算；若扣除後剛好跨越稅率級距，實際省稅會略低於這個數字。申報還需符合：本人、配偶及受扶養直系親屬在國內沒有自有房屋（財政部核釋的 5 種例外情形除外）、租屋供自住且非營業使用。</p>
      </div>

      <div class="mt-6 rounded-2xl border border-paper-300 bg-paper-100 p-5">
        <h3 class="text-sm font-bold text-ink-700">房東說申報就漲租，漲多少以內還划算？</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2 md:items-end">
          <div>
            <label for="rd-raise" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">房東預計漲租幅度 (%)</label>
            <input id="rd-raise" type="text" inputmode="decimal" v-model.number="raisePct"
              class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          </div>
          <div class="text-sm leading-6 text-ink-600">
            <p>漲租後每年多付：<strong class="font-mono">${{ fmt(extraRentYear) }}</strong></p>
            <p>申報淨效益（省稅 − 多付租金）：<strong class="font-mono" :class="netBenefit >= 0 ? 'text-brand-700' : 'text-red-600'">${{ fmt(netBenefit) }}</strong></p>
          </div>
        </div>
        <p class="mt-3 text-xs leading-5 text-ink-500"><span v-if="taxSaved > 0">損益平衡漲幅是 <strong>{{ breakevenPct.toFixed(1) }}%</strong>：漲幅低於這個數字，申報後整年仍是賺的；高於這個數字，多付的租金會吃掉全部省稅。</span><span v-else>目前沒有省稅可抵漲租：省稅為 0 時，任何漲租都會讓你多付錢。</span>這個算法只算錢——房東若因申報衍生其他爭議（提前解約、不續租），不在試算範圍內。</p>
      </div>

      <div class="mt-5 flex justify-center">
        <SnapshotButton tool-name="租金特別扣除額試算" :metrics="snapshotMetrics" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SnapshotButton from '../SnapshotButton.vue';
import { TAX_BRACKETS, RENT_DEDUCTION_MAX } from '../../data/calculators/taiwanIncomeTax';

const monthlyRent = ref(15000);
const months = ref(12);
const subsidyMonthly = ref(0);
const rateMode = ref('direct');
const directRate = ref(0.12);
const netIncome = ref(800000);
const raisePct = ref(5);

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('zh-TW');

const marginalRate = computed(() => {
  if (rateMode.value === 'direct') return directRate.value;
  const income = Math.max(Number(netIncome.value) || 0, 0);
  const bracket = TAX_BRACKETS.find((b) => income <= b.max) ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return bracket.rate;
});

const excluded = computed(() => marginalRate.value >= 0.2);
// 逐欄箝制：雙負相乘不得變正；承租月數一年最多 12 個月
const clampedMonths = computed(() => Math.min(Math.max(Number(months.value) || 0, 0), 12));
const annualRent = computed(() => Math.max(Number(monthlyRent.value) || 0, 0) * clampedMonths.value);
const annualSubsidy = computed(() => Math.max(Number(subsidyMonthly.value) || 0, 0) * clampedMonths.value);
const deductibleBase = computed(() => Math.max(annualRent.value - annualSubsidy.value, 0));
const deduction = computed(() => Math.min(deductibleBase.value, RENT_DEDUCTION_MAX));
const taxSaved = computed(() => (excluded.value ? 0 : Math.round(deduction.value * marginalRate.value)));
const extraRentYear = computed(() => Math.round(annualRent.value * (Math.max(Number(raisePct.value) || 0, 0) / 100)));
const netBenefit = computed(() => taxSaved.value - extraRentYear.value);
const breakevenPct = computed(() => (annualRent.value > 0 ? (taxSaved.value / annualRent.value) * 100 : 0));

const snapshotMetrics = computed(() => [
  { label: '年租金', value: `$${fmt(annualRent.value)}` },
  { label: '可申報扣除額', value: `$${fmt(deduction.value)}` },
  { label: '邊際稅率', value: `${(marginalRate.value * 100).toFixed(0)}%` },
  { label: '預估省稅', value: `$${fmt(taxSaved.value)}` },
  { label: '損益平衡漲幅', value: `${breakevenPct.value.toFixed(1)}%` },
]);
</script>
