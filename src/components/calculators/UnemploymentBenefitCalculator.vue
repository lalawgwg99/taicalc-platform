<template>
  <div class="calculator-shell">
    <div class="calculator-card">
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label for="ub-salary" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">離職前 6 個月平均月投保薪資 (NT$)</label>
          <input id="ub-salary" type="text" inputmode="decimal" v-model.number="averageSalary"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">前 6 個月合計 ÷ 6。</p>
        </div>
        <div>
          <label for="ub-age" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">離職時年齡</label>
          <input id="ub-age" type="text" inputmode="decimal" v-model.number="age"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">年滿 45 歲最長 9 個月，未滿 6 個月。</p>
        </div>
        <div class="md:col-span-2">
          <label class="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" v-model="disabled" class="accent-emerald-700" />
            領有身心障礙證明（最長可領 9 個月）
          </label>
        </div>
        <div>
          <label for="ub-dependents" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">受扶養眷屬人數（0–2 名）</label>
          <input id="ub-dependents" type="number" min="0" max="2" step="1" inputmode="numeric" v-model.number="dependents"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">每名 +10%，最多 2 名。</p>
        </div>
      </div>

      <div class="calculator-subcard md:p-6 mt-6">
        <div class="text-center mb-6">
          <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">每月失業給付</p>
          <p class="text-4xl sm:text-5xl font-bold text-ink-800 font-mono tracking-tight">
            <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ fmt(result.monthly) }}
          </p>
          <p class="mt-2 text-xs text-ink-400 whitespace-nowrap">平均月投保薪資 ${{ fmt(num(averageSalary)) }} × {{ 60 + 10 * clampedDependents }}%</p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <p class="text-xs text-ink-400">最長可領月數</p>
            <p class="text-lg font-bold text-ink-600 font-mono">{{ result.maxMonths }} 個月</p>
          </div>
          <div>
            <p class="text-xs text-ink-400">領滿最長總額</p>
            <p class="text-lg font-bold text-ink-600 font-mono">${{ fmt(result.maxTotal) }}</p>
          </div>
        </div>

        <p class="mt-5 text-xs leading-5 text-ink-400">領滿是上限不是保證。須非自願離職＋求職登記，金額以勞保局核定為準。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { calculateUnemploymentBenefit } from '../../utils/calculators/unemploymentBenefit';

const averageSalary = ref(40000);
const age = ref(30);
const disabled = ref(false);
const dependents = ref(0);

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('zh-TW');
const num = (v) => Math.max(Number(v) || 0, 0);
const clampedDependents = computed(() => Math.min(2, Math.max(0, Math.floor(num(dependents.value)))));
const result = computed(() => calculateUnemploymentBenefit({
  averageSalary: num(averageSalary.value),
  age: num(age.value),
  disabled: disabled.value,
  dependents: clampedDependents.value,
}));
</script>
