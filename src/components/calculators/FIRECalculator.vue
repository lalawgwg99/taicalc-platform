<template>
  <div class="space-y-4">

    <!-- 輸入面板 -->
    <div class="card-surface p-5 space-y-5">
      <h2 class="text-sm font-medium text-ink-600 flex items-center gap-2">
        <span class="w-1 h-4 bg-azure rounded-full"></span>
        現況輸入
      </h2>

      <!-- 年齡 & 淨資產 -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">現在年齡</label>
          <input type="number" v-model.number="currentAge" class="input-clean" placeholder="30" />
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">目前淨資產（TWD）</label>
          <input type="number" v-model.number="currentNetWorth" class="input-clean tabular-nums" placeholder="1,000,000" />
        </div>
      </div>

      <div class="h-px bg-paper-300"></div>

      <!-- 月支出 & 月儲蓄 -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">退休月支出（TWD）</label>
          <input type="number" v-model.number="monthlyExpense" class="input-clean tabular-nums" placeholder="40,000" />
          <p class="text-[10px] text-ink-400 mt-1">這決定了你的自由門檻</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">每月投入（TWD）</label>
          <input type="number" v-model.number="monthlySavings" class="input-clean tabular-nums" placeholder="20,000" />
        </div>
      </div>

      <!-- 報酬率 -->
      <div>
        <label class="block text-xs font-medium text-ink-400 mb-2">
          預期年化報酬率：<span class="text-azure font-semibold">{{ annualReturn }}%</span>
        </label>
        <input type="range" v-model.number="annualReturn" min="1" max="15" step="0.5"
          class="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-azure" />
        <!-- ETF 歷史報酬快速帶入 -->
        <div class="flex flex-wrap gap-1.5 mt-2 items-center">
          <span class="text-[10px] text-ink-400">參考帶入：</span>
          <button v-for="p in returnPresets" :key="p.symbol"
                  @click="annualReturn = p.rate"
                  :title="p.note"
                  :class="['text-[11px] px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer',
                           annualReturn === p.rate
                             ? 'bg-azure text-white border-azure'
                             : 'bg-paper-200 text-ink-600 border-transparent hover:border-azure-200 hover:text-azure']">
            {{ p.label }} {{ p.rate }}%
          </button>
        </div>
        <p class="text-[10px] text-ink-400 mt-1.5">保守 4–5%，積極 7–8%（扣除通膨後）</p>
      </div>

      <!-- 進階設定 -->
      <div class="border-t border-paper-300 pt-4">
        <button @click="showAdvanced = !showAdvanced"
          class="flex items-center gap-2 text-xs font-medium text-ink-400 hover:text-ink-700 transition-colors">
          <span>進階設定（通膨 / 提領率）</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            :class="showAdvanced ? 'rotate-180' : ''" class="transition-transform">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div v-if="showAdvanced" class="space-y-4 mt-4 animate-fade-in-up">
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-2">
              通膨率：<span class="text-red-500 font-semibold">{{ inflationRate }}%</span>
            </label>
            <input type="range" v-model.number="inflationRate" min="0" max="10" step="0.1"
              class="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-red-400" />
            <!-- ⚡ 主計總處即時 CPI -->
            <div v-if="liveCPI" class="flex items-center gap-2 mt-2 bg-red-50 rounded-lg px-3 py-1.5 animate-fade-in-up">
              <span class="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse flex-shrink-0"></span>
              <span class="text-[11px] text-red-600 flex-1">
                主計總處最新 CPI <strong>{{ liveCPI.rate }}%</strong>
                <span class="text-[10px] text-red-400 ml-1">（{{ liveCPI.period }}）</span>
              </span>
              <button @click="inflationRate = parseFloat(liveCPI.rate)"
                      class="text-[11px] font-medium text-red-600 hover:text-red-800 transition-colors flex-shrink-0">
                套用 →
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-2">
              安全提領率：<span class="text-ink-600 font-semibold">{{ withdrawalRate }}%</span>
            </label>
            <input type="range" v-model.number="withdrawalRate" min="1" max="10" step="0.1"
              class="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-azure" />
            <p class="text-[10px] text-ink-400 mt-1">標準 4%，保守可設 3%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要 KPI -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- FIRE 目標 -->
      <div class="card-surface p-5 bg-ink-700 border-ink-700">
        <p class="text-xs text-ink-400 uppercase tracking-wider mb-1">FIRE 目標資產</p>
        <p class="text-3xl font-bold tabular-nums text-azure-400 mb-4">
          ${{ fmt(fireNumber) }}
        </p>
        <div class="w-full bg-ink-800 h-1.5 rounded-full overflow-hidden">
          <div class="bg-azure h-full rounded-full transition-all duration-700"
            :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="flex justify-between mt-2 text-[11px] text-ink-400">
          <span>目前：${{ fmt(currentNetWorth || 0) }}</span>
          <span class="text-azure font-medium">{{ progressPercent }}%</span>
        </div>
      </div>

      <!-- 倒數 -->
      <div class="card-surface p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
        <div v-if="yearsToFreedom > 0 && yearsToFreedom < 100">
          <p class="text-xs text-ink-400 mb-1">距離財務自由還有</p>
          <p class="text-5xl font-bold text-ink-700 tabular-nums leading-none mb-2">{{ yearsToFreedom }}</p>
          <p class="text-sm text-ink-400 mb-3">年</p>
          <span class="badge-neutral">{{ currentAge + parseFloat(yearsToFreedom) }} 歲達成</span>
        </div>
        <div v-else-if="yearsToFreedom <= 0" class="flex flex-col items-center">
          <span class="text-4xl mb-2">🎉</span>
          <p class="text-base font-semibold text-ink-700">已達財務自由！</p>
          <p class="text-xs text-ink-400 mt-1">4% 提領率已可覆蓋開銷</p>
        </div>
        <div v-else class="flex flex-col items-center">
          <span class="text-4xl mb-2">🐢</span>
          <p class="text-sm text-ink-500">請增加儲蓄或提高報酬率</p>
        </div>
      </div>
    </div>

    <!-- 資產成長圖 -->
    <div class="card-surface p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-ink-600">資產成長預測</h3>
        <span class="badge-neutral">考慮複利</span>
      </div>
      <div class="h-56 chart-wrap">
        <canvas ref="fireChartRef"></canvas>
      </div>
    </div>

    <!-- 分析小卡 -->
    <div class="grid grid-cols-3 gap-3">
      <div class="card-surface p-3 text-center">
        <p class="stat-label">目前被動收入</p>
        <p class="text-base font-semibold text-ink-700 tabular-nums">
          ${{ fmt(Math.floor((currentNetWorth * 0.04) / 12)) }}
        </p>
        <p class="text-[10px] text-ink-400 mt-0.5">月領</p>
      </div>
      <div class="card-surface p-3 text-center">
        <p class="stat-label">加速因子</p>
        <p class="text-sm font-semibold text-ink-700">
          {{ monthlySavings > monthlyExpense ? '儲蓄力強 🚀' : '複利效應 📈' }}
        </p>
      </div>
      <div class="card-surface p-3 text-center">
        <p class="stat-label">多存 1 萬</p>
        <p class="text-base font-semibold text-azure tabular-nums">{{ saveMoreImpact }} 年</p>
        <p class="text-[10px] text-ink-400 mt-0.5">提早退休</p>
      </div>
    </div>

    <!-- 拿鐵因子 -->
    <div class="card-surface p-5 bg-amber-50/60 border-amber-100">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h3 class="text-sm font-medium text-amber-800">☕ 拿鐵因子模擬</h3>
          <p class="text-xs text-amber-600/80 mt-0.5">每天少喝一杯拿鐵（$150），能提早多久退休？</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer shrink-0">
          <input type="checkbox" v-model="coffeeMode" class="sr-only peer" />
          <div class="w-10 h-6 bg-amber-200 rounded-full peer peer-checked:bg-amber-500
               after:content-[''] after:absolute after:top-[2px] after:left-[2px]
               after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
               peer-checked:after:translate-x-4"></div>
        </label>
      </div>
      <div v-if="coffeeMode" class="bg-white/60 rounded-xl p-3 text-center animate-fade-in-up mt-3">
        <p class="text-xs text-amber-700 mb-1">每月多存 $4,500，複利加速…</p>
        <p class="text-xl font-bold text-amber-600">提早 {{ coffeeSavedYears }} 年！</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// ── 輸入狀態 ───────────────────────────────────────────────────
const currentAge      = ref(30);
const currentNetWorth = ref(1000000);
const monthlyExpense  = ref(40000);
const monthlySavings  = ref(20000);
const annualReturn    = ref(6);
const inflationRate   = ref(2.0);
const withdrawalRate  = ref(4.0);
const showAdvanced    = ref(false);
const coffeeMode      = ref(false);

// ── 主計總處即時 CPI + ETF 報酬預設 ─────────────────────────────────
const liveCPI = ref(null);

const returnPresets = [
  { symbol: '0050', label: '0050',    rate: 10, note: '元大台灣50 2009–2024 含息年化 ~10%' },
  { symbol: '0056', label: '0056',    rate:  8, note: '元大高股息 2008–2024 含息年化 ~8%' },
  { symbol: 'MIX',  label: '股債均衡', rate:  6, note: '60/40 股債配置長期均值' },
  { symbol: 'SAFE', label: '保守',    rate:  4, note: '保守估算（扣通膨後）' },
];

const fetchLiveCPI = async () => {
  try {
    const res = await fetch('/api/rates?type=cpi');
    if (!res.ok) return;
    const data = await res.json();
    if (data?.rate) {
      liveCPI.value = data;
      // 僅在使用者尚未修改預設值時才自動帶入
      if (inflationRate.value === 2.0) {
        inflationRate.value = parseFloat(data.rate);
      }
    }
  } catch (_) {}
};

const fireChartRef = ref(null);
let chartInstance  = null;

// ── 工具 ───────────────────────────────────────────────────────
const fmt = (n) => (n ? n.toLocaleString() : '0');

// ── Computed ───────────────────────────────────────────────────
const realSavings = computed(() => monthlySavings.value + (coffeeMode.value ? 4500 : 0));

const fireNumber = computed(() => {
  if (withdrawalRate.value <= 0) return 0;
  return Math.round((monthlyExpense.value * 12) / (withdrawalRate.value / 100));
});

const progressPercent = computed(() => {
  if (fireNumber.value <= 0) return 100;
  return Math.min(100, Math.round((currentNetWorth.value / fireNumber.value) * 100));
});

// 實質報酬率（扣通膨）
const realReturnRate = computed(() => {
  return (1 + annualReturn.value / 100) / (1 + inflationRate.value / 100) - 1;
});

// 核心計算：距離目標的年數
const calcYears = (start, target, monthlySave) => {
  if (start >= target) return 0;
  if (monthlySave <= 0 && start <= 0) return 999;
  const r = realReturnRate.value / 12;
  if (Math.abs(r) < 1e-9) {
    return (target - start) / (monthlySave * 12);
  }
  const num = target * r + monthlySave;
  const den = start * r  + monthlySave;
  if (den <= 0) return 999;
  const nMonths = Math.log(num / den) / Math.log(1 + r);
  const years   = nMonths / 12;
  return years > 100 ? 100 : Math.ceil(years * 10) / 10;
};

const yearsToFreedom = computed(() =>
  calcYears(currentNetWorth.value, fireNumber.value, realSavings.value)
);

const coffeeSavedYears = computed(() => {
  const base   = calcYears(currentNetWorth.value, fireNumber.value, monthlySavings.value);
  const coffee = calcYears(currentNetWorth.value, fireNumber.value, monthlySavings.value + 4500);
  return Math.max(0, (base - coffee).toFixed(1));
});

const saveMoreImpact = computed(() => {
  const base   = yearsToFreedom.value;
  const boosted = calcYears(currentNetWorth.value, fireNumber.value, realSavings.value + 10000);
  return Math.max(0, (base - boosted).toFixed(1));
});

// ── 圖表 ───────────────────────────────────────────────────────
const updateChart = () => {
  if (!fireChartRef.value) return;
  if (chartInstance) chartInstance.destroy();

  const labels     = [];
  const data       = [];
  const targetData = [];
  const totalYears = Math.min(60, Math.ceil(yearsToFreedom.value) + 5);
  let balance = currentNetWorth.value;
  const r     = realReturnRate.value / 12;
  const save  = realSavings.value;

  for (let y = 0; y <= totalYears; y++) {
    labels.push(currentAge.value + y);
    targetData.push(fireNumber.value);
    if (y === 0) { data.push(balance); continue; }
    for (let m = 0; m < 12; m++) balance = balance * (1 + r) + save;
    data.push(Math.round(balance));
  }

  chartInstance = new Chart(fireChartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '資產累積',
          data,
          borderColor: '#3B93F7',
          backgroundColor: 'rgba(59,147,247,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'FIRE 目標',
          data: targetData,
          borderColor: '#EF4444',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1.5,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          labels: {
            color: '#6B6760',
            font: { size: 11 },
            usePointStyle: true,
            pointStyleWidth: 8,
            padding: 12,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.96)',
          titleColor: '#2D2C28',
          bodyColor: '#6B6760',
          borderColor: '#D9D6CC',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (c) => c.dataset.label + ': $' + c.parsed.y.toLocaleString(),
          },
        },
      },
      scales: {
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: {
            color: '#9B9890',
            font: { size: 11 },
            callback: (v) => '$' + (v / 10000).toFixed(0) + '萬',
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: '#9B9890', font: { size: 11 } },
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
  fetchLiveCPI();
  setTimeout(updateChart, 200);
});
</script>
