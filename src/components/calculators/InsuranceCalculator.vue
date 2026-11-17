<template>
  <div class="calculator-shell">
    <div class="calculator-card space-y-6">
      <!-- Identity Selection -->
      <div>
        <label class="block text-xs font-semibold text-ink-400 mb-2">投保身分</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="role in roles"
            :key="role.id"
            @click="currentRole = role.id"
            class="py-2 px-0 text-sm font-bold border-b-2 transition-all whitespace-nowrap"
            :class="
              currentRole === role.id
                ? 'text-ink-800 border-[#A58436]'
                : 'text-ink-400 border-transparent hover:text-ink-600'
            "
          >
            {{ role.label }}
          </button>
        </div>
      </div>

      <!-- Salary Input -->
      <div>
        <label for="fld-2ca33c24" class="block text-xs font-semibold text-ink-400 mb-2">月薪收入</label>
        <div class="relative">
          <input id="fld-2ca33c24"
            type="text" inputmode="decimal"
            v-model.number="salary"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            placeholder="請輸入月薪"
          />
        </div>
        <p class="text-xs text-ink-400 mt-2">
          對應投保級距：<span class="font-bold text-ink-500">{{ fmt(matchedBracket) }}</span> 元
        </p>
        <p v-if="salary < MINIMUM_WAGE" class="text-xs text-red-500 mt-1">低於基本工資 29,500 元</p>
      </div>

      <!-- Dependents -->
      <div>
        <label class="block text-xs font-semibold text-ink-400 mb-2">健保依附眷口數</label>
        <div class="flex items-center gap-2">
          <button
            v-for="n in 5"
            :key="n - 1"
            @click="dependents = n - 1"
            class="flex h-10 w-10 items-center justify-center border-b-2 text-sm font-bold transition-all"
            :class="
              dependents === n - 1
                ? 'text-ink-800 border-[#A58436]'
                : 'text-ink-400 border-transparent hover:text-ink-600'
            "
          >
            {{ n - 1 }}
          </button>
        </div>
        <p class="text-[10px] text-ink-400 mt-1">健保超過 3 口以 3 口計算；勞保不受眷口數影響。</p>
      </div>

      <!-- Results -->
      <div class="pt-6 border-t border-[#E3DCCB] grid gap-4">
        <!-- Worker Cost -->
        <div class="calculator-subcard">
          <div class="flex justify-between items-end mb-2">
            <h3 class="text-sm font-bold text-ink-600">你每個月要繳</h3>
            <span class="receipt-main-value whitespace-nowrap">{{ fmt(result.workerTotal) }}</span>
          </div>
          <div class="space-y-1 text-xs text-ink-400">
            <div class="flex justify-between">
              <span>勞保費</span>
              <span class="whitespace-nowrap">{{ fmt(result.workerLabor) }}</span>
            </div>
            <div class="flex justify-between">
              <span>健保費</span>
              <span class="whitespace-nowrap">{{ fmt(result.workerHealth) }}</span>
            </div>
          </div>
        </div>

        <!-- Company Cost -->
        <div v-if="currentRole === 'employee'" class="calculator-subcard">
          <div class="flex justify-between items-end mb-2">
            <h3 class="text-sm font-bold text-ink-600">老闆每個月要繳</h3>
            <span class="receipt-main-value whitespace-nowrap">{{ fmt(result.employerTotal) }}</span>
          </div>
          <div class="space-y-1 text-xs text-ink-400">
            <div class="flex justify-between">
              <span>勞保費</span>
              <span class="whitespace-nowrap">{{ fmt(result.employerLabor) }}</span>
            </div>
            <div class="flex justify-between">
              <span>健保費</span>
              <span class="whitespace-nowrap">{{ fmt(result.employerHealth) }}</span>
            </div>
            <div class="flex justify-between">
              <span>勞退 (6%)</span>
              <span class="whitespace-nowrap">{{ fmt(result.employerPension) }}</span>
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
            <strong>每個月保費怎麼分</strong>
            <span>同一個投保級距，實際各繳多少</span>
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
  { id: 'employee', label: '勞工' },
  { id: 'union', label: '工會' },
  { id: 'employer', label: '雇主' },
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
    label: '你每個月要繳',
    total: result.value.workerTotal,
    segments: [
      { label: '勞保', value: result.value.workerLabor, color: '#32c99c' },
      { label: '健保', value: result.value.workerHealth, color: '#72dfba' },
    ],
  }];
  if (currentRole.value === 'employee') {
    rows.push({
      label: '老闆每個月要繳',
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
.premium-chart{border:0;border-top:1px solid #E3DCCB;border-radius:0;background:transparent;padding:1rem 0 0;color:#1C1B1A;box-shadow:none}
.premium-chart-heading,.premium-chart-meta{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem}.premium-chart-heading{margin-bottom:1rem}.premium-chart-heading strong,.premium-chart-heading span{display:block}.premium-chart-heading strong{font-size:.82rem;color:#161511}.premium-chart-heading span{margin-top:.18rem;color:#5C665D;font-size:.65rem}.premium-chart-heading small{color:#A58436;font-size:.62rem}.premium-chart-row+.premium-chart-row{margin-top:.85rem}.premium-chart-meta span{color:#5C665D;font-size:.68rem}.premium-chart-meta strong{font-size:.78rem;color:#1C1B1A}.premium-chart-scale{height:.7rem;margin-top:.35rem;overflow:hidden;border-radius:999px;background:#E3DCCB}.premium-chart-total{display:flex;height:100%;min-width:3px;overflow:hidden;border-radius:inherit;transition:width .25s ease}.premium-chart-total i{display:block;height:100%;min-width:1px;transition:width .25s ease}.premium-chart-total i+i{border-left:2px solid #FDFCF8}.premium-chart-legend{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:.9rem;padding-top:.75rem;border-top:1px solid #E3DCCB}.premium-chart-legend span{display:flex;align-items:center;gap:.3rem;color:#5C665D;font-size:.62rem}.premium-dot{width:.42rem;height:.42rem;border-radius:999px}.premium-dot-labor{background:#32c99c}.premium-dot-health{background:#72dfba}.premium-dot-pension{background:#e8b26f}
</style>
