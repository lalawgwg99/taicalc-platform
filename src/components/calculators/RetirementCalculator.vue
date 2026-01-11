<template>
  <div class="space-y-6">
    <div class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="currentAge" class="block text-xs font-semibold text-stone-500 mb-2">現在年齡</label>
          <input
            id="currentAge"
            type="number"
            v-model.number="currentAge"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div>
          <label for="retireAge" class="block text-xs font-semibold text-stone-500 mb-2">預計退休年齡</label>
          <input
            id="retireAge"
            type="number"
            v-model.number="retireAge"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label for="monthlyExpense" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
          退休後每月生活費 (NT$)
        </label>
        <div class="relative">
          <input
            id="monthlyExpense"
            type="number"
            v-model.number="monthlyExpense"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="lifeExpectancy" class="block text-xs font-semibold text-stone-500 mb-2">預期壽命</label>
          <input
            id="lifeExpectancy"
            type="number"
            v-model.number="lifeExpectancy"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div>
          <label for="annualReturn" class="block text-xs font-semibold text-stone-500 mb-2">預期年報酬率 (%)</label>
          <input
            id="annualReturn"
            type="number"
            v-model.number="annualReturn"
            step="0.1"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label for="currentSavings" class="block text-xs font-semibold text-stone-500 mb-2">目前已有資產 (NT$)</label>
        <div class="relative">
          <input
            id="currentSavings"
            type="number"
            v-model.number="currentSavings"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- 結果 -->
      <div class="bg-stone-50 rounded-2xl p-4 md:p-6 border border-stone-200">
        <div class="text-center mb-6">
          <p class="text-xs text-stone-500 font-bold uppercase tracking-wider mb-2">退休所需總金額</p>
          <p class="text-3xl sm:text-4xl font-bold text-stone-800 font-mono tracking-tight">
            <span class="text-2xl text-stone-400 align-top mr-1">$</span>{{ needTotal }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-center pt-6 border-t border-stone-200">
          <div>
            <p class="text-xs text-stone-500 mb-1">距離退休</p>
            <p class="text-xl font-bold text-stone-700">
              {{ yearsToRetire }} <span class="text-sm font-normal text-stone-400">年</span>
            </p>
          </div>
          <div>
            <p class="text-xs text-stone-500 mb-1">還需準備</p>
            <p class="text-xl font-bold text-amber-600 font-mono">{{ needMore }}</p>
          </div>
        </div>

        <div class="text-center pt-6 mt-6 border-t border-stone-200 bg-blue-50/50 -mx-4 -mb-4 p-4 md:-mx-6 md:-mb-6 md:p-6 rounded-b-2xl">
          <p class="text-blue-800/70 text-sm font-medium mb-2">為達成目標，每月需儲蓄</p>
          <p class="text-3xl font-bold text-blue-600 font-mono">NT$ {{ monthlySaving }}</p>
        </div>
      </div>

      <div class="text-center text-sm text-stone-500 flex items-center justify-center gap-2">
        <span>💡</span>
        <span>4% 法則：年支出 × 25 = 財務自由門檻</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentAge = ref(30);
const retireAge = ref(60);
const monthlyExpense = ref(40000);
const lifeExpectancy = ref(85);
const annualReturn = ref(4);
const currentSavings = ref(500000);

const yearsToRetire = computed(() => Math.max(0, (retireAge.value || 0) - (currentAge.value || 0)));
const retirementYears = computed(() => Math.max(0, (lifeExpectancy.value || 0) - (retireAge.value || 0)));

const needTotal = computed(() => {
  const annual = (monthlyExpense.value || 0) * 12;
  return (annual * retirementYears.value).toLocaleString();
});

const needMore = computed(() => {
  const annual = (monthlyExpense.value || 0) * 12;
  const total = annual * retirementYears.value;
  const more = total - (currentSavings.value || 0);
  return more > 0 ? `NT$ ${more.toLocaleString()}` : '已達標！';
});

const monthlySaving = computed(() => {
  const annual = (monthlyExpense.value || 0) * 12;
  const total = annual * retirementYears.value;
  const more = total - (currentSavings.value || 0);
  if (more <= 0) return '0';

  const months = yearsToRetire.value * 12;
  if (months <= 0) return '∞';

  const r = (annualReturn.value || 0) / 100 / 12;
  if (r === 0) return Math.round(more / months).toLocaleString();

  // PMT formula
  const pmt = (more * r) / (Math.pow(1 + r, months) - 1);
  return Math.round(pmt).toLocaleString();
});
</script>
