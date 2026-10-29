<template>
  <div class="calculator-shell">
    <div class="calculator-card">
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label for="ub-salary" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">離職前 6 個月平均月投保薪資 (NT$)</label>
          <input id="ub-salary" type="text" inputmode="decimal" v-model.number="averageSalary"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">前 6 個月投保薪資合計 ÷ 6；投保未滿 6 個月按實際投保期間計算。</p>
        </div>
        <div>
          <label for="ub-age" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">離職時年齡</label>
          <input id="ub-age" type="text" inputmode="decimal" v-model.number="age"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">離職時年滿 45 歲，最長可領 9 個月；未滿 45 歲最長 6 個月。</p>
        </div>
        <div class="md:col-span-2">
          <label class="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" v-model="disabled" class="accent-emerald-700" />
            領有身心障礙證明（最長可領 9 個月）
          </label>
        </div>
      </div>

      <div class="calculator-subcard md:p-6 mt-6">
        <div class="text-center mb-6">
          <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">每月失業給付</p>
          <p class="text-4xl sm:text-5xl font-bold text-ink-800 font-mono tracking-tight">
            <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ fmt(result.monthly) }}
          </p>
          <p class="mt-2 text-xs text-ink-400">平均月投保薪資 ${{ fmt(num(averageSalary)) }} × 60%</p>
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

        <p class="mt-5 text-xs leading-5 text-ink-400">實際領取月數依求職情形而定，領滿是上限不是保證。另有扶養眷屬加給（勞保局：每名受扶養眷屬加給平均月投保薪資 10%、最多 2 名），本工具第一版未納入計算。請領須符合非自願離職等法定要件並辦理求職登記，實際金額以勞保局核定為準。</p>
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

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('zh-TW');
const num = (v) => Math.max(Number(v) || 0, 0);
const result = computed(() => calculateUnemploymentBenefit({
  averageSalary: num(averageSalary.value),
  age: num(age.value),
  disabled: disabled.value,
}));
</script>
