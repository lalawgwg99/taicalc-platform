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
          <input
            type="number"
            v-model.number="salary"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="請輸入月薪"
          />
        </div>
        <p class="text-xs text-stone-400 mt-2">
          對應投保級距：<span class="font-bold text-stone-600">{{ fmt(matchedBracket) }}</span> 元
          <span v-if="salary < MINIMUM_WAGE" class="text-red-500 ml-1">(低於基本工資 29,500)</span>
        </p>
      </div>

      <!-- Dependents -->
      <div>
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
        <p class="text-[10px] text-stone-400 mt-1">健保超過 3 口以 3 口計算；勞保不受眷口數影響。</p>
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
import { computed, ref } from 'vue';

import { MINIMUM_WAGE } from '../../data/calculators/taiwanInsurance';
import { calculateInsurancePremiums } from '../../utils/calculators/insurance';

const roles = [
  { id: 'employee', label: '一般勞工' },
  { id: 'union', label: '職業工會' },
  { id: 'employer', label: '雇主/負責人' },
];
const currentRole = ref('employee');
const salary = ref(35000);
const dependents = ref(0);

const fmt = (n) => (n ? n.toLocaleString('zh-TW') : '0');

const result = computed(() => {
  return calculateInsurancePremiums({
    salary: salary.value || 0,
    role: currentRole.value,
    dependents: dependents.value,
  });
});

const matchedBracket = computed(() => result.value.laborBracket);
</script>
