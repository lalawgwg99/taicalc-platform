<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Input Section -->
    <div class="lg:col-span-4 space-y-6">
      <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 md:p-6">
        <h2 class="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
          <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
          現況輸入
        </h2>

        <div class="space-y-5">
          <!-- Age -->
          <div>
            <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">現在年齡</label>
            <input type="number" v-model.number="currentAge" class="input-base w-full text-lg" placeholder="30" />
          </div>

          <!-- Asset -->
          <div>
            <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">目前淨資產 (TWD)</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">$</span>
              <input
                type="number"
                v-model.number="currentNetWorth"
                class="input-base w-full pl-8 text-lg font-mono"
                placeholder="1000000"
              />
            </div>
          </div>

          <hr class="border-stone-100" />

          <!-- Monthly Expense -->
          <div>
            <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5"
              >目標月支出 (退休後)</label
            >
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">$</span>
              <input
                type="number"
                v-model.number="monthlyExpense"
                class="input-base w-full pl-8 text-lg font-mono"
                placeholder="40000"
              />
            </div>
            <p class="text-xs text-stone-400 mt-1">這決定了你的自由門檻。</p>
          </div>

          <!-- Monthly Savings -->
          <div>
            <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5"
              >每月能存 (投入投資)</label
            >
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">$</span>
              <input
                type="number"
                v-model.number="monthlySavings"
                class="input-base w-full pl-8 text-lg font-mono"
                placeholder="20000"
              />
            </div>
          </div>

          <!-- Rate -->
          <div>
            <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5"
              >預期年化報酬率 (%)</label
            >
            <div class="flex items-center gap-3">
              <input
                type="range"
                v-model.number="annualReturn"
                min="1"
                max="15"
                step="0.5"
                class="flex-1 accent-emerald-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-lg font-bold text-emerald-600 w-12 text-right">{{ annualReturn }}%</span>
            </div>
            <p class="text-xs text-stone-400 mt-1">建議：保守 4-5%，積極 7-8% (扣除通膨後)</p>
          </div>
        </div>

        <!-- Advanced Settings -->
        <div class="border-t border-stone-100 pt-4 mt-2">
          <button
            @click="showAdvanced = !showAdvanced"
            class="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider hover:text-stone-700 transition-colors"
          >
            <span>進階設定 (通膨 / 提領率)</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-transform"
              :class="showAdvanced ? 'rotate-180' : ''"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div v-if="showAdvanced" class="space-y-5 mt-4 animate-fade-in-down">
            <!-- Inflation -->
            <div>
              <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5"
                >預估通膨率 (%)</label
              >
              <div class="flex items-center gap-3">
                <input
                  type="range"
                  v-model.number="inflationRate"
                  min="0"
                  max="10"
                  step="0.1"
                  class="flex-1 accent-rose-500 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
                <span class="text-lg font-bold text-rose-500 w-16 text-right">{{ inflationRate }}%</span>
              </div>
              <p class="text-[10px] text-stone-400 mt-1">影響購買力。歷史長期平均約 2-3%。</p>
            </div>

            <!-- Withdrawal Rate -->
            <div>
              <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5"
                >安全提領率 (%)</label
              >
              <div class="flex items-center gap-3">
                <input
                  type="range"
                  v-model.number="withdrawalRate"
                  min="1"
                  max="10"
                  step="0.1"
                  class="flex-1 accent-indigo-500 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
                <span class="text-lg font-bold text-indigo-500 w-16 text-right">{{ withdrawalRate }}%</span>
              </div>
              <p class="text-[10px] text-stone-400 mt-1">決定目標金額。標準為 4%，保守可設 3%。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Coffee Simulator -->
      <div
        class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-4 md:p-6 relative overflow-hidden"
      >
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-bold text-amber-900">拿鐵因子模擬</h3>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="coffeeMode" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-amber-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"
              ></div>
            </label>
          </div>
          <p class="text-sm text-amber-800/80 mb-4">每天少喝一杯拿鐵 ($150)，能提早多久退休？</p>

          <div v-if="coffeeMode" class="bg-white/60 rounded-lg p-3 text-center animate-fade-in-up">
            <p class="text-xs text-amber-800 mb-1">每月多存 $4,500，複利效果...</p>
            <p class="text-xl font-bold text-amber-600">提早 {{ coffeeSavedYears }} 年！</p>
          </div>
        </div>
        <!-- Decoration -->
        <div class="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none">☕</div>
      </div>
    </div>

    <!-- Result Section -->
    <div class="lg:col-span-8 space-y-6">
      <!-- Main KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Target Block -->
        <div class="bg-stone-900 text-white rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <p class="text-stone-400 text-sm font-medium mb-1 uppercase tracking-wider">FIRE 目標資產</p>
          <p class="text-3xl sm:text-4xl font-bold font-mono text-emerald-400 mb-4">${{ fmt(fireNumber) }}</p>
          <div class="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              class="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-stone-500">
            <span>目前: ${{ fmt(currentNetWorth || 0) }}</span>
            <span>{{ progressPercent }}%</span>
          </div>
        </div>

        <!-- Countdown Block -->
        <div
          class="bg-white border border-stone-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden"
        >
          <div v-if="yearsToFreedom > 0 && yearsToFreedom < 100">
            <p class="text-stone-500 text-sm font-medium mb-2">距離財務自由還有</p>
            <p class="text-5xl font-bold text-stone-800 font-mono tracking-tight leading-none mb-2">
              {{ yearsToFreedom }} <span class="text-xl text-stone-400 font-sans font-normal">年</span>
            </p>
            <p class="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full inline-block">
              {{ currentAge + parseFloat(yearsToFreedom) }} 歲達成
            </p>
          </div>
          <div v-else-if="yearsToFreedom <= 0" class="flex flex-col items-center">
            <span class="text-5xl mb-2">🎉</span>
            <p class="text-xl font-bold text-stone-800">恭喜！您已達成財務自由</p>
            <p class="text-sm text-stone-500 mt-1">您的資產 4% 已足以覆蓋開銷。</p>
          </div>
          <div v-else>
            <span class="text-4xl mb-2">🐢</span>
            <p class="text-stone-500">路途遙遠，請增加儲蓄或提高報酬率。</p>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 md:p-6">
        <h3 class="font-bold text-stone-800 mb-6 flex items-center justify-between">
          資產成長預測
          <span class="text-xs font-normal text-stone-400 bg-stone-100 px-2 py-1 rounded">考慮複利</span>
        </h3>
        <div class="w-full h-64 md:h-80 relative">
          <canvas ref="fireChartRef"></canvas>
        </div>
      </div>

      <!-- Analysis Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="bg-stone-50 rounded-xl p-4 border border-stone-100">
          <p class="text-xs text-stone-500 mb-1">不工作月領</p>
          <p class="text-xl font-bold text-stone-700 font-mono">
            ${{ fmt(Math.floor((currentNetWorth * 0.04) / 12)) }}
          </p>
          <p class="text-[10px] text-stone-400">目前資產產生之被動收入</p>
        </div>
        <div class="bg-stone-50 rounded-xl p-4 border border-stone-100">
          <p class="text-xs text-stone-500 mb-1">主要動力</p>
          <p class="text-lg font-bold text-stone-700">
            {{ monthlySavings > monthlyExpense ? '儲蓄力強 🚀' : '複利效應 📈' }}
          </p>
          <p class="text-[10px] text-stone-400">加速因子</p>
        </div>
        <div class="col-span-2 md:col-span-1 bg-stone-50 rounded-xl p-4 border border-stone-100">
          <p class="text-xs text-stone-500 mb-1">致富關鍵</p>
          <p class="text-sm text-stone-600 leading-snug">
            每多存 1 萬元，可讓退休提早
            <span class="font-bold text-emerald-600">{{ saveMoreImpact }}</span> 年
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// Inputs
const currentAge = ref(30);
const currentNetWorth = ref(1000000);
const monthlyExpense = ref(40000);
const monthlySavings = ref(20000);
const annualReturn = ref(6); // % Nominal
const inflationRate = ref(2.0);
const withdrawalRate = ref(4.0);

// UI State
const showAdvanced = ref(false);

// Coffee Mode
const coffeeMode = ref(false);

// Chart reference
const fireChartRef = ref(null);
let chartInstance = null;

// Format
const fmt = (n) => (n ? n.toLocaleString() : '0');

// Computed
const realSavings = computed(() => {
  return monthlySavings.value + (coffeeMode.value ? 4500 : 0);
});

const fireNumber = computed(() => {
  // Target = Annual Expense / Withdrawal Rate
  // e.g. 40000 * 12 / 0.04 = 12,000,000
  if (withdrawalRate.value <= 0) return 0;
  return Math.round((monthlyExpense.value * 12) / (withdrawalRate.value / 100));
});

const progressPercent = computed(() => {
  if (fireNumber.value <= 0) return 100;
  return Math.min(100, Math.round((currentNetWorth.value / fireNumber.value) * 100));
});

// Real Rate of Return = (1 + nominal) / (1 + inflation) - 1
const realReturnRate = computed(() => {
  const r = (1 + annualReturn.value / 100) / (1 + inflationRate.value / 100) - 1;
  return r;
});

// Core Logic: Calculate Years to Target
const calculateYearsToTarget = (start, target, monthlySave, _nominalRateIgnored) => {
  if (start >= target) return 0;
  if (monthlySave <= 0 && start <= 0) return 999;

  // Use Real Return Rate for calculation to adjust for Inflation
  const r = realReturnRate.value / 12;

  if (Math.abs(r) < 0.00000001) {
    return (target - start) / monthlySave / 12;
  }

  const num = target * r + monthlySave;
  const den = start * r + monthlySave;

  if (den <= 0) return 999;

  const nMonths = Math.log(num / den) / Math.log(1 + r);
  const years = nMonths / 12;

  return years > 100 ? 100 : Math.ceil(years * 10) / 10;
};

const yearsToFreedom = computed(() => {
  return calculateYearsToTarget(currentNetWorth.value, fireNumber.value, realSavings.value, annualReturn.value);
});

// Coffee Impact
const coffeeSavedYears = computed(() => {
  const baseYears = calculateYearsToTarget(
    currentNetWorth.value,
    fireNumber.value,
    monthlySavings.value,
    annualReturn.value
  );
  // Re-calculate basic scenario without coffee
  // Note: realSavings includes coffee if coffeeMode is on.
  // Actually, we should compare:
  // Scenario A (Base): monthlySavings
  // Scenario B (Coffee): monthlySavings + 4500
  // My original code logic in HTML might have been slightly circular or just illustrative.
  // Let's implement it cleanly:

  const savingsWithCoffee = monthlySavings.value + 4500;
  const yearsWithCoffee = calculateYearsToTarget(
    currentNetWorth.value,
    fireNumber.value,
    savingsWithCoffee,
    annualReturn.value
  );
  
  const yearsWithoutCoffee = calculateYearsToTarget(
      currentNetWorth.value,
      fireNumber.value,
      monthlySavings.value,
      annualReturn.value
  );

  return Math.max(0, (yearsWithoutCoffee - yearsWithCoffee).toFixed(1));
});

// Extra 10k Impact
const saveMoreImpact = computed(() => {
  const currentYears = yearsToFreedom.value;
  const boostYears = calculateYearsToTarget(
    currentNetWorth.value,
    fireNumber.value,
    realSavings.value + 10000,
    annualReturn.value
  );
  return Math.max(0, (currentYears - boostYears).toFixed(1));
});

const updateChart = () => {
  if (!fireChartRef.value) return;
  if (chartInstance) chartInstance.destroy();

  const labels = [];
  const data = [];
  const targetData = [];

  const years = Math.min(60, Math.ceil(yearsToFreedom.value) + 5); // Show 5 extra years
  let balance = currentNetWorth.value;
  const r = realReturnRate.value / 12; // Use real return
  const save = realSavings.value;

  for (let y = 0; y <= years; y++) {
    labels.push(currentAge.value + y);
    targetData.push(fireNumber.value);

    if (y === 0) {
      data.push(balance);
      continue;
    }

    // Compound for 12 months
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + save;
    }
    data.push(Math.round(balance));
  }

  const ctx = fireChartRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '資產累積',
          data: data,
          borderColor: '#10b981', // Emerald 500
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5
        },
        {
          label: 'FIRE 目標',
          data: targetData,
          borderColor: '#ef4444', // Red 500
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 2,
          fill: false
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          labels: { font: { family: 'Inter' } }
        },
        tooltip: {
            padding: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1c1917',
            bodyColor: '#44403c',
            borderColor: '#e7e5e4',
            borderWidth: 1,
            callbacks: {
                label: (c) => c.dataset.label + ': $' + c.parsed.y.toLocaleString()
            }
        }
      },
      scales: {
        y: {
          grid: { color: '#f5f5f4' },
          ticks: {
            callback: (v) => '$' + (v / 10000).toFixed(0) + '萬',
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
};

watch(
  [currentAge, currentNetWorth, monthlyExpense, realSavings, annualReturn, inflationRate, withdrawalRate],
  updateChart,
  { deep: true }
);

onMounted(() => {
  setTimeout(updateChart, 200);
});
</script>

<style scoped>
.input-base {
  @apply bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300;
}
</style>
