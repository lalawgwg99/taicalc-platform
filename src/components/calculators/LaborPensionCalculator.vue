<template>
  <div class="calculator-shell">
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 左側：輸入 -->
      <div class="space-y-6 lg:col-span-1">
        <section class="calculator-card">
          <h2 class="text-sm font-bold text-ink-600 mb-4 flex items-center gap-2">
            <span>🐢</span> 基礎設定
          </h2>
          <div class="space-y-4">
            <div>
              <label for="salary" class="block text-xs font-medium text-ink-400 mb-1">月薪 (NT$)</label>
              <input
                id="salary"
                type="text" inputmode="decimal"
                v-model.number="salary"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label for="currentAge" class="block text-xs font-medium text-ink-400 mb-1">目前年齡</label>
              <input
                id="currentAge"
                type="text" inputmode="decimal"
                v-model.number="currentAge"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label for="retireAge" class="block text-xs font-medium text-ink-400 mb-1">預計退休年齡</label>
              <input
                id="retireAge"
                type="text" inputmode="decimal"
                v-model.number="retireAge"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label for="pastYears" class="block text-xs font-medium text-ink-400 mb-1">勞退已提繳年資（年）</label>
              <input
                id="pastYears"
                type="text" inputmode="decimal"
                v-model.number="pastYears"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <p class="text-xs text-ink-400 mt-1.5 leading-relaxed">
                不知道年資？<a href="https://edesk.bli.gov.tw/na/" target="_blank" rel="noopener" class="underline decoration-amber-500 underline-offset-2">去勞保局 e 化服務系統查</a>（手機門號驗證就能登入，可查總提繳年資），查完回來填。
              </p>
            </div>
          </div>
        </section>

        <section class="calculator-card">
          <h2 class="text-sm font-bold text-ink-600 mb-4 flex items-center gap-2">
            <span>📈</span> 投資與節稅
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-ink-400 mb-2">自提比例 (0-6%)</label>
              <div class="flex gap-1">
                <button v-for="rate in [0, 3, 6]" :key="rate" @click="selfRate = rate"
                                :class="['flex-1 py-2 rounded-lg text-sm font-medium transition-all group',
                                         selfRate === rate ? 'bg-gradient-to-r from-brand-500 to-azure-500 text-white shadow-md' : 'bg-white/50 text-ink-500 hover:bg-white border border-paper-100']">
                                {{ rate }}%
                            </button>
                <input
                  aria-label="自提比例"
                  type="text" inputmode="decimal"
                  v-model.number="selfRate"
                  min="0"
                  max="6"
                  class="w-12 bg-paper-50 border border-ink-100 rounded-lg text-center text-ink-800 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div>
              <label for="roiInput" class="block text-xs font-medium text-ink-400 mb-2">預估年報酬率</label>
              <div class="flex gap-1 mb-2">
                <button
                  @click="roi = 3"
                  class="flex-1 py-1 rounded bg-paper-100 text-ink-400 text-xs hover:bg-ink-100 transition-colors"
                >
                  保守 3%
                </button>
                <button
                  @click="roi = 5"
                  class="flex-1 py-1 rounded bg-paper-100 text-ink-400 text-xs hover:bg-ink-100 transition-colors"
                >
                  穩健 5%
                </button>
                <button
                  @click="roi = 8"
                  class="flex-1 py-1 rounded bg-paper-100 text-ink-400 text-xs hover:bg-ink-100 transition-colors"
                >
                  積極 8%
                </button>
              </div>
              <input
                id="roiInput"
                type="text" inputmode="decimal"
                v-model.number="roi"
                step="0.5"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2 px-3 text-ink-800 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label for="taxRateSelect" class="block text-xs font-medium text-ink-400 mb-2">所得稅率 (計算節稅)</label>
              <select
                id="taxRateSelect"
                v-model.number="taxRate"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2 px-3 text-ink-800 text-sm focus:outline-none appearance-none"
              >
                <option :value="5">5% (所得淨額 0-61萬)</option>
                <option :value="12">12% (61-138萬)</option>
                <option :value="20">20% (138-277萬)</option>
                <option :value="30">30% (277-519萬)</option>
                <option :value="40">40% (519萬以上)</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <!-- 右側：結果與圖表 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 核心數字 -->
        <section class="calculator-card">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
            <div>
              <p class="text-xs text-ink-400 uppercase tracking-wider mb-1">
                退休時大約存到 ({{ retireAge - currentAge }} 年後)
              </p>
              <p class="text-4xl font-bold stat-value text-amber-600">
                <span class="text-2xl text-ink-400 mr-1">$</span>{{ totalAmount.toLocaleString() }}
              </p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-xs text-ink-400 mb-1">每個月可領（領 20 年）</p>
              <p class="text-xl font-semibold text-ink-600 stat-value">${{ monthlyPension.toLocaleString() }}</p>
            </div>
          </div>

          <!-- 複利圖表 -->
          <div class="chart-container relative h-80 w-full">
            <canvas ref="growthChart"></canvas>
          </div>
        </section>

        <!-- 分析卡片 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <!-- 資金結構 -->
          <section class="calculator-card-tight">
            <h3 class="text-sm font-bold text-ink-600 mb-4">💰 錢是怎麼變多的</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-ink-400">投資賺的 ({{ interestPercent }}%)</span>
                  <span class="text-amber-600 font-bold">+${{ totalInterest.toLocaleString() }}</span>
                </div>
                <div class="w-full bg-paper-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full" :style="{ width: interestPercent + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-ink-400">自己投入的本金 ({{ principalPercent }}%)</span>
                  <span class="text-ink-600 font-bold">${{ totalPrincipal.toLocaleString() }}</span>
                </div>
                <div class="w-full bg-paper-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-ink-400 h-full" :style="{ width: principalPercent + '%' }"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- 節稅 & 月提 -->
          <section class="calculator-card-tight">
            <h3 class="text-sm font-bold text-ink-600 mb-4">🎁 省稅效果</h3>
            <div class="relative z-10">
                <div class="text-center mb-6">
                    <p class="text-ink-400 text-sm mb-1 uppercase tracking-wider">每年少繳的稅</p>
                    <p class="text-4xl md:text-5xl font-bold text-brand-600">
                        <span class="text-brand-400 text-2xl mr-1">$</span>{{ taxSavingYearly.toLocaleString() }}
                    </p>
                    <p class="text-xs text-ink-400 mt-2">用你的稅率 {{ taxRate }}% 算的</p>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-2">
                    <div class="bg-white/50 rounded-xl p-3 text-center border border-paper-100">
                        <p class="text-xs text-ink-400 mb-1">自己總共提撥</p>
                        <p class="text-lg font-bold text-ink-600">${{ (selfMonthlyContribution * 12 * (years + pastYearsClamped)).toLocaleString() }}</p>
                    </div>
                    <div class="bg-white/50 rounded-xl p-3 text-center border border-paper-100">
                        <p class="text-xs text-ink-400 mb-1">總共省下的稅</p>
                        <p class="text-lg font-bold text-brand-500">+${{ (taxSavingYearly * (years + pastYearsClamped)).toLocaleString() }}</p>
                    </div>
                </div>
            </div>
          </section>
        </div>

        <!-- 說明 -->
        <div class="p-5 rounded-xl border border-ink-100 bg-paper-50 text-xs text-ink-400 space-y-2 leading-relaxed">
          <p class="font-bold text-ink-600">ℹ️ 極致使用技巧：</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>
              <strong>為什麼要自提？</strong>
              除了強迫存錢，最直接的好處是省稅：自提的錢當年不用繳稅，等於直接降低要課稅的所得。
            </li>
            <li>
              <strong>複利很驚人：</strong> 報酬率從 3% 調到 5%，差一點點，30 年下來退休金可能差到快一倍！
            </li>
            <li>
              <strong>算法說明：</strong> 月領金額用年金法算，假設退休後錢繼續以 2%
              滾存，分 20 年領完。
            </li>
            <li>
              <strong>已提繳年資：</strong>
              過去年資以目前提繳水準估算本金（未計過去的投資報酬，偏保守），實際專戶累計金額以勞保局查詢為準。
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import Decimal from 'decimal.js';

// 2026 級距 (Min 1500, Max 150000 for Pension)
const PENSION_GRADES = [
    1500, 3000, 4500, 6000, 7500, 8700, 9900, 11100, 12540, 13500, 15840, 16500,
    17280, 17880, 19047, 20008, 21009, 22000, 23100, 24000, 25200, 26400, 27600,
    28800, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800,
    48200, 50600, 53000, 55400, 57800, 60800, 63800, 66800, 69800, 72800, 76500,
    80200, 83900, 87600, 92100, 96600, 101100, 105600, 110100, 115500, 120900,
    126300, 131700, 137100, 142500, 147900, 150000
]

const getPensionGrade = (s) => {
    if (s < 1500) return 1500
    if (s > 150000) return 150000
    for (let g of PENSION_GRADES) {
        if (g >= s) return g
    }
    return 150000
}

const salary = ref(45000);
const currentAge = ref(30);
const retireAge = ref(65);
const pastYears = ref(0); // 已經提繳的年資（過去）
const selfRate = ref(6);
const roi = ref(5); // Annual ROI
const taxRate = ref(12); // Tax Rate

const growthChart = ref(null);
let chartInstance = null;

const years = computed(() => Math.max(1, retireAge.value - currentAge.value));
// 已提繳年資（防呆：負數或空值視為 0）
const pastYearsClamped = computed(() => Math.max(0, pastYears.value || 0));
// 計算過去提繳累積的本金估算（以目前提繳水準估算，未計過去報酬，偏保守）
const pastPrincipalTotal = computed(() => new Decimal(totalMonthlyContribution.value).mul(pastYearsClamped.value * 12).toNumber());
const pastPrincipalBasic = computed(() => new Decimal(employerMonthlyContribution.value).mul(pastYearsClamped.value * 12).toNumber());
const monthlyWageGrade = computed(() => getPensionGrade(salary.value));

const employerMonthlyContribution = computed(() => new Decimal(monthlyWageGrade.value).mul(0.06).round().toNumber());
const selfMonthlyContribution = computed(() => new Decimal(monthlyWageGrade.value).mul(new Decimal(selfRate.value).div(100)).round().toNumber());
const totalMonthlyContribution = computed(() => new Decimal(employerMonthlyContribution.value).plus(selfMonthlyContribution.value).toNumber());

// Tax Saving
const taxSavingYearly = computed(() => new Decimal(selfMonthlyContribution.value).mul(12).mul(new Decimal(taxRate.value).div(100)).round().toNumber());

// Projection
const calculateProjection = () => {
  const months = years.value * 12;
  const monthlyRate = new Decimal(roi.value).div(100).div(12);

  const monthlyContribBasic = new Decimal(employerMonthlyContribution.value);
  const monthlyContribTotal = new Decimal(totalMonthlyContribution.value);

  let data = [];
  // 過去年資的累積本金當作起點，之後跟著一起複利
  let balanceBasic = new Decimal(pastPrincipalBasic.value);
  let balanceTotal = new Decimal(pastPrincipalTotal.value);
  let principalTotal = new Decimal(pastPrincipalTotal.value);

  for (let i = 1; i <= years.value; i++) {
    for (let m = 0; m < 12; m++) {
      balanceBasic = balanceBasic.mul(monthlyRate.plus(1)).plus(monthlyContribBasic);
      balanceTotal = balanceTotal.mul(monthlyRate.plus(1)).plus(monthlyContribTotal);
      principalTotal = principalTotal.plus(monthlyContribTotal);
    }
    data.push({
      year: currentAge.value + i,
      balanceBasic: balanceBasic.round().toNumber(),
      balanceTotal: balanceTotal.round().toNumber(),
      principal: principalTotal.round().toNumber(),
      interest: balanceTotal.minus(principalTotal).round().toNumber(),
    });
  }
  return data;
};

const projection = computed(() => calculateProjection());
const totalAmount = computed(() => projection.value[projection.value.length - 1]?.balanceTotal || 0);
const totalPrincipal = computed(() => projection.value[projection.value.length - 1]?.principal || 0);
const totalInterest = computed(() => projection.value[projection.value.length - 1]?.interest || 0);

const principalPercent = computed(() =>
  totalAmount.value > 0 ? new Decimal(totalPrincipal.value).div(totalAmount.value).mul(100).round().toNumber() : 0
);
const interestPercent = computed(() => 100 - principalPercent.value);

// Monthly Pension Estimate (Annuity for 20 years @ 2% post-retirement)
const monthlyPension = computed(() => {
  const r = new Decimal(0.02).div(12);
  const n = 20 * 12;
  // PV = PMT * ((1 - (1+r)^-n) / r) => PMT = PV * r / (1 - (1+r)^-n)
  if (totalAmount.value === 0) return 0;
  const factor = (new Decimal(1).minus(r.plus(1).pow(-n))).div(r);
  return new Decimal(totalAmount.value).div(factor).round().toNumber();
});

const updateChart = () => {
  if (!growthChart.value) return;
  if (chartInstance) chartInstance.destroy();

  const labels = projection.value.map((d) => `${d.year}歲`);

  chartInstance = new Chart(growthChart.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '總共存到（含自提）',
          data: projection.value.map((d) => d.balanceTotal),
          borderColor: '#d97706', // amber-600
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(217, 119, 6, 0.2)');
            gradient.addColorStop(1, 'rgba(217, 119, 6, 0.0)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: '只有老闆提撥 (6%)',
          data: projection.value.map((d) => d.balanceBasic),
          borderColor: '#a8a29e', // ink-300
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          hidden: selfRate.value === 0, // Hide if no self contribution
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#57534e', font: { family: 'Inter' }, usePointStyle: true } },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1c1917',
          bodyColor: '#44403c',
          borderColor: '#e7e5e4',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) label += '$' + context.parsed.y.toLocaleString();
              return label;
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#78716c', maxTicksLimit: 8 } },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#78716c', callback: (v) => '$' + (v / 10000).toFixed(0) + '萬' },
        },
      },
    },
  });
};

watch(selfRate, (val) => {
    if (val < 0) selfRate.value = 0
    if (val > 6) selfRate.value = 6
})

watch(pastYears, (val) => {
    if (val < 0) pastYears.value = 0
    if (val > 60) pastYears.value = 60
})

watch([salary, currentAge, retireAge, selfRate, roi, taxRate], updateChart, { deep: true });

onMounted(() => {
  setTimeout(updateChart, 200);
});
</script>

<style scoped>
.chart-container {
  height: 320px;
}
</style>
