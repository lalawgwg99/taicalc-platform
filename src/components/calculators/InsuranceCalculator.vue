<template>
  <div class="space-y-6">
    <div class="card bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6">
      <!-- Identity Selection -->
      <div>
        <label class="block text-xs font-semibold text-stone-500 mb-2">投保身分</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="role in roles"
            :key="role.id"
            @click="currentRole = role.id"
            class="py-2.5 px-2 text-sm font-bold rounded-lg border transition-all truncate"
            :class="
              currentRole === role.id
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
            "
          >
            {{ role.label }}
          </button>
        </div>
      </div>

      <!-- Salary Input -->
      <div>
        <label class="block text-xs font-semibold text-stone-500 mb-2">月薪收入</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">$</span>
          <input
            type="number"
            v-model.number="salary"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-8 pr-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="請輸入月薪"
          />
        </div>
        <p class="text-xs text-stone-400 mt-2">
          對應投保級距：<span class="font-bold text-stone-600">{{ fmt(matchedBracket) }}</span> 元
          <span v-if="salary < 29500" class="text-red-500 ml-1">(低於基本工資 29,500)</span>
        </p>
      </div>

      <!-- Dependents -->
      <div v-if="currentRole !== 'union'">
        <label class="block text-xs font-semibold text-stone-500 mb-2">健保依附眷口數</label>
        <div class="flex items-center gap-2">
          <button
            v-for="n in 5"
            :key="n - 1"
            @click="dependents = n - 1"
            class="w-10 h-10 rounded-lg border transition-all font-bold text-sm flex items-center justify-center"
            :class="
              dependents === n - 1
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
            "
          >
            {{ n - 1 }}
          </button>
        </div>
        <p class="text-[10px] text-stone-400 mt-1">超過 3 口以 3 口計算。</p>
      </div>

      <!-- Results -->
      <div class="pt-6 border-t border-stone-100 grid gap-4">
        <!-- Worker Cost -->
        <div class="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <div class="flex justify-between items-end mb-2">
            <h3 class="text-sm font-bold text-stone-700">個人負擔</h3>
            <span class="text-2xl font-bold font-mono text-blue-600">{{ fmt(result.workerTotal) }}</span>
          </div>
          <div class="space-y-1 text-xs text-stone-500">
            <div class="flex justify-between">
              <span>勞保費</span>
              <span>{{ fmt(result.workerLabor) }}</span>
            </div>
            <div class="flex justify-between">
              <span>健保費</span>
              <span>{{ fmt(result.workerHealth) }}</span>
            </div>
          </div>
        </div>

        <!-- Company Cost -->
        <div v-if="currentRole === 'employee'" class="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <div class="flex justify-between items-end mb-2">
            <h3 class="text-sm font-bold text-stone-700">雇主負擔</h3>
            <span class="text-2xl font-bold font-mono text-stone-600">{{ fmt(result.employerTotal) }}</span>
          </div>
          <div class="space-y-1 text-xs text-stone-500">
            <div class="flex justify-between">
              <span>勞保費</span>
              <span>{{ fmt(result.employerLabor) }}</span>
            </div>
            <div class="flex justify-between">
              <span>健保費</span>
              <span>{{ fmt(result.employerHealth) }}</span>
            </div>
            <div class="flex justify-between">
              <span>勞退 (6%)</span>
              <span>{{ fmt(result.employerPension) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const roles = [
  { id: 'employee', label: '一般勞工' },
  { id: 'union', label: '職業工會' },
  { id: 'employer', label: '雇主/負責人' },
];
const currentRole = ref('employee');
const salary = ref(35000);
const dependents = ref(0);

const fmt = (n) => (n ? n.toLocaleString('zh-TW') : '0');

// 2026 Labor Insurance Table (Selected grades for lookup)
const LABOR_GRADES = [29500, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800];

// 2026 Health Insurance Table
const HEALTH_GRADES = [
  29500, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800, 48200, 50600, 53000, 55400, 57800, 60800,
  63800, 66800, 69800, 72800, 76500, 80200, 83900, 87600, 92100, 96600, 101100, 105600, 110100, 115500, 120900, 126300,
  131700, 137100, 142500, 147900, 150000, 156400, 162800, 169200, 175600, 182000, 189500, 197000, 204500, 212000,
  219500, 313000,
];

const getInsuredSalary = (salary, table, max) => {
  if (salary < table[0]) return table[0];
  if (salary >= max) return max;
  for (let g of table) {
    if (g >= salary) return g;
  }
  return max;
};

const result = computed(() => {
  const s = salary.value || 0;

  const lBracket = getInsuredSalary(s, LABOR_GRADES, 45800);
  const hBracket = getInsuredSalary(s, HEALTH_GRADES, 313000);

  let wLabor = 0,
    eLabor = 0;
  let wHealth = 0,
    eHealth = 0;
  let ePension = 0;

  if (currentRole.value === 'employee') {
    wLabor = Math.round(lBracket * 0.12 * 0.2);
    const effDep = Math.min(dependents.value, 3);
    wHealth = Math.round(hBracket * 0.0517 * 0.3 * (1 + effDep));

    eLabor = Math.round(lBracket * 0.12 * 0.7);
    eHealth = Math.round(hBracket * 0.0517 * 0.6 * 1.58);
    // Pension based on higher grade table but cap 150k
    ePension = Math.round(Math.min(getInsuredSalary(s, HEALTH_GRADES, 150000), 150000) * 0.06);
  } else if (currentRole.value === 'union') {
    wLabor = Math.round(lBracket * 0.11 * 0.6);
    const effDep = Math.min(dependents.value, 3);
    wHealth = Math.round(hBracket * 0.0517 * 0.6 * (1 + effDep));
  } else if (currentRole.value === 'employer') {
    const effDep = Math.min(dependents.value, 3);
    wHealth = Math.round(hBracket * 0.0517 * 1.0 * (1 + effDep));
    wLabor = Math.round(lBracket * 0.11);
  }

  return {
    workerLabor: wLabor,
    workerHealth: wHealth,
    workerTotal: wLabor + wHealth,
    employerLabor: eLabor,
    employerHealth: eHealth,
    employerPension: ePension,
    employerTotal: eLabor + eHealth + ePension,
    laborBracket: lBracket,
    healthBracket: hBracket,
  };
});

const matchedBracket = computed(() => result.value.laborBracket);
</script>
