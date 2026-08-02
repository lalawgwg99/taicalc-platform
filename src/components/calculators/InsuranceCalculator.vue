<template>
  <div class="calculator-shell">
    <div class="calculator-card space-y-6">
      <!-- Identity Selection -->
      <div>
        <label class="block text-xs font-semibold text-stone-500 mb-2">投保身分</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="role in roles"
            :key="role.id"
            @click="currentRole = role.id"
            class="py-2.5 px-2 text-sm font-bold rounded-xl border transition-all truncate"
            :class="
              currentRole === role.id
                ? 'bg-gradient-to-r from-brand-500 to-azure-500 text-white border-brand-500 shadow-card'
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
            class="flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-all"
            :class="
              dependents === n - 1
                ? 'bg-gradient-to-r from-brand-500 to-azure-500 text-white border-brand-500 shadow-card'
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
        <div class="calculator-subcard">
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
        <div v-if="currentRole === 'employee'" class="calculator-subcard">
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

      <figure
        class="premium-chart"
        role="img"
        :aria-label="premiumChartLabel"
      >
        <figcaption class="premium-chart-heading">
          <div>
            <strong>每月保費分攤</strong>
            <span>同一投保級距下的實際負擔</span>
          </div>
          <small>元／月</small>
        </figcaption>
        <div v-for="row in premiumChart" :key="row.label" class="premium-chart-row">
          <div class="premium-chart-meta">
            <span>{{ row.label }}</span>
            <strong>{{ fmt(row.total) }}</strong>
          </div>
          <div class="premium-chart-scale" aria-hidden="true">
            <div class="premium-chart-total" :style="{ width: `${row.scale}%` }">
              <i
                v-for="segment in row.segments"
                :key="segment.label"
                :style="{ width: `${segment.percent}%`, background: segment.color }"
                :title="`${segment.label} ${fmt(segment.value)} 元`"
              ></i>
            </div>
          </div>
        </div>
        <div class="premium-chart-legend" aria-hidden="true">
          <span><i class="premium-dot premium-dot-labor"></i>勞保</span>
          <span><i class="premium-dot premium-dot-health"></i>健保</span>
          <span v-if="currentRole === 'employee'"><i class="premium-dot premium-dot-pension"></i>勞退</span>
        </div>
      </figure>
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
const premiumChart = computed(() => {
  const rows = [{
    label: '個人負擔',
    total: result.value.workerTotal,
    segments: [
      { label: '勞保', value: result.value.workerLabor, color: '#32c99c' },
      { label: '健保', value: result.value.workerHealth, color: '#72dfba' },
    ],
  }];
  if (currentRole.value === 'employee') {
    rows.push({
      label: '雇主負擔',
      total: result.value.employerTotal,
      segments: [
        { label: '勞保', value: result.value.employerLabor, color: '#32c99c' },
        { label: '健保', value: result.value.employerHealth, color: '#72dfba' },
        { label: '勞退', value: result.value.employerPension, color: '#e8b26f' },
      ],
    });
  }
  const maximum = Math.max(1, ...rows.map((row) => row.total));
  return rows.map((row) => ({
    ...row,
    scale: Math.max(3, row.total / maximum * 100),
    segments: row.segments.map((segment) => ({
      ...segment,
      percent: row.total > 0 ? segment.value / row.total * 100 : 0,
    })),
  }));
});
const premiumChartLabel = computed(() => `每月保費分攤：${premiumChart.value.map((row) => `${row.label} ${fmt(row.total)} 元`).join('、')}`);
</script>

<style scoped>
.premium-chart{border:1px solid #d8e1db;border-radius:1.15rem;background:linear-gradient(145deg,#102419,#173528);padding:1rem;color:#fff;box-shadow:0 18px 44px -34px rgba(9,35,26,.55)}
.premium-chart-heading,.premium-chart-meta{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem}.premium-chart-heading{margin-bottom:1rem}.premium-chart-heading strong,.premium-chart-heading span{display:block}.premium-chart-heading strong{font-size:.82rem}.premium-chart-heading span{margin-top:.18rem;color:#91a69a;font-size:.65rem}.premium-chart-heading small{color:#72dfba;font-size:.62rem}.premium-chart-row+.premium-chart-row{margin-top:.85rem}.premium-chart-meta span{color:#b8c8be;font-size:.68rem}.premium-chart-meta strong{font-size:.78rem}.premium-chart-scale{height:.7rem;margin-top:.35rem;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.075)}.premium-chart-total{display:flex;height:100%;min-width:3px;overflow:hidden;border-radius:inherit;transition:width .25s ease}.premium-chart-total i{display:block;height:100%;min-width:1px;transition:width .25s ease}.premium-chart-total i+i{border-left:2px solid #102419}.premium-chart-legend{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:.9rem;padding-top:.75rem;border-top:1px solid rgba(255,255,255,.08)}.premium-chart-legend span{display:flex;align-items:center;gap:.3rem;color:#a5b5aa;font-size:.62rem}.premium-dot{width:.42rem;height:.42rem;border-radius:999px}.premium-dot-labor{background:#32c99c}.premium-dot-health{background:#72dfba}.premium-dot-pension{background:#e8b26f}
</style>
