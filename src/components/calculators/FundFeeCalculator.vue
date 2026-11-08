<template>
  <div class="calculator-shell">
    <div class="calculator-card">
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label for="ff-principal" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">目前本金 (NT$)</label>
          <input id="ff-principal" type="text" inputmode="decimal" v-model.number="principal"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label for="ff-monthly" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">每月再投入 (NT$)</label>
          <input id="ff-monthly" type="text" inputmode="decimal" v-model.number="monthly"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">沒有定期定額就填 0。</p>
        </div>
        <div>
          <label for="ff-return" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">年報酬假設（未扣費用，%)</label>
          <input id="ff-return" type="text" inputmode="decimal" v-model.number="grossReturn"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">假設值，不是保證。</p>
        </div>
        <div>
          <label for="ff-years" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">持有年數 (年)</label>
          <input id="ff-years" type="text" inputmode="decimal" v-model.number="years"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label for="ff-fee-a" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">方案 A 費用率</label>
          <input id="ff-fee-a" type="text" inputmode="decimal" v-model.number="feeA"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">主動型基金常見 1.2%～2%。</p>
        </div>
        <div>
          <label for="ff-fee-b" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">方案 B 費用率</label>
          <input id="ff-fee-b" type="text" inputmode="decimal" v-model.number="feeB"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1.5 text-[11px] text-ink-400">指數型 ETF 常見 0.03%～0.5%。</p>
        </div>
      </div>

      <div class="calculator-subcard md:p-6 mt-6">
        <div class="text-center mb-6">
          <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2"><span v-if="diffAB >= 0">{{ safeYears }} 年後，A 比 B 少 {{ fmt(diffAB) }} 元</span><span v-else>{{ safeYears }} 年後，A 比 B 多 {{ fmt(diffAbs) }} 元</span></p>
          <p class="text-4xl sm:text-5xl font-bold text-ink-800 font-mono tracking-tight whitespace-nowrap">
            <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ fmt(diffAbs) }}
          </p>
          <p class="mt-2 text-xs text-ink-400">同樣本金、同樣報酬假設，只差費用率 {{ feeA }}% 與 {{ feeB }}%</p>
        </div>
        <div class="grid grid-cols-1 gap-3 pt-6 border-t border-ink-100 text-center sm:grid-cols-3 sm:gap-4">
          <div>
            <p class="text-xs text-ink-400 mb-1">零費用（假設 {{ grossReturn }}%）</p>
            <p class="text-lg font-bold text-ink-600 font-mono whitespace-nowrap">${{ fmt(fvGross) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 mb-1">方案 A（費用 {{ feeA }}%）</p>
            <p class="text-lg font-bold text-red-600 font-mono whitespace-nowrap">${{ fmt(fvA) }}</p>
            <p class="text-[11px] text-ink-400 mt-0.5">被費用吃掉 ${{ fmt(fvGross - fvA) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 mb-1">方案 B（費用 {{ feeB }}%）</p>
            <p class="text-lg font-bold text-brand-700 font-mono whitespace-nowrap">${{ fmt(fvB) }}</p>
            <p class="text-[11px] text-ink-400 mt-0.5">被費用吃掉 ${{ fmt(fvGross - fvB) }}</p>
          </div>
        </div>
        <div class="mt-6 pt-5 border-t border-ink-100">
          <p class="text-xs font-semibold text-ink-500 mb-3">不同年數的 A／B 期末差額</p>
          <div class="grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-4">
            <div v-for="row in horizonRows" :key="row.y" class="rounded-xl bg-paper-100 border border-paper-300 py-3">
              <p class="text-[11px] text-ink-400">{{ row.y }} 年</p>
              <p class="text-base font-bold text-ink-700 font-mono whitespace-nowrap">${{ fmt(row.diff) }}</p>
            </div>
          </div>
          <p class="mt-3 text-[11px] leading-5 text-ink-400">差額隨年數放大；三格固定以 10／20／30 年計算，與上方年數欄位無關。</p>
        </div>
        <p class="mt-4 text-[11px] leading-5 text-ink-400">報酬為假設、未計稅與手續費；實際報酬逐年波動，費用率以各基金最新月報為準。</p>
      </div>

      <div class="mt-5 flex justify-center">
        <SnapshotButton tool-name="基金費用拖累試算" :metrics="snapshotMetrics" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SnapshotButton from '../SnapshotButton.vue';

const principal = ref(1000000);
const monthly = ref(10000);
const grossReturn = ref(7);
const years = ref(30);
const feeA = ref(1.5);
const feeB = ref(0.25);

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('zh-TW');
const num = (v) => Math.max(Number(v) || 0, 0);

function fv(ratePct, yrs) {
  const r = ratePct / 100;
  const p = num(principal.value);
  const m = num(monthly.value);
  const lump = p * Math.pow(1 + r, yrs);
  if (m <= 0) return lump;
  const rm = r / 12;
  const n = Math.round(yrs * 12);
  const annuity = rm === 0 ? m * n : m * ((Math.pow(1 + rm, n) - 1) / rm);
  return lump + annuity;
}

const fvGross = computed(() => fv(num(grossReturn.value), num(years.value)));
const fvA = computed(() => fv(num(grossReturn.value) - num(feeA.value), num(years.value)));
const fvB = computed(() => fv(num(grossReturn.value) - num(feeB.value), num(years.value)));
const diffAB = computed(() => fvB.value - fvA.value);
const diffAbs = computed(() => Math.abs(diffAB.value));
// 標題用箝制後年數：年數填負數或清空時，計算用 0 年、標題不應顯示負年數或空白
const safeYears = computed(() => Math.max(0, Math.round(Number(years.value) || 0)));

const horizonRows = computed(() => [10, 20, 30].map((y) => ({
  y,
  diff: fv(num(grossReturn.value) - num(feeB.value), y) - fv(num(grossReturn.value) - num(feeA.value), y),
})));

const snapshotMetrics = computed(() => [
  { label: '本金', value: `$${fmt(principal.value)}` },
  { label: '費用率 A／B', value: `${feeA.value}%／${feeB.value}%` },
  { label: `${safeYears.value} 年差額`, value: `$${fmt(diffAbs.value)}` },
]);
</script>
