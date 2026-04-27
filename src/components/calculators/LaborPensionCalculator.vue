<template>
  <div class="calculator-shell">
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 左側：輸入 -->
      <div class="space-y-6 lg:col-span-1">
        <section class="calculator-card">
          <h2 class="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
            <span>🐢</span> 基礎設定
          </h2>
          <div class="space-y-4">
            <div>
              <label for="salary" class="block text-xs font-medium text-stone-500 mb-1">月薪 (NT$)</label>
              <input
                id="salary"
                type="number"
                v-model.number="salary"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label for="currentAge" class="block text-xs font-medium text-stone-500 mb-1">目前年齡</label>
              <input
                id="currentAge"
                type="number"
                v-model.number="currentAge"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label for="retireAge" class="block text-xs font-medium text-stone-500 mb-1">預計退休年齡</label>
              <input
                id="retireAge"
                type="number"
                v-model.number="retireAge"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </section>

        <section class="calculator-card">
          <h2 class="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
            <span>📈</span> 投資與節稅
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-stone-500 mb-2">自提比例 (0-6%)</label>
              <div class="flex gap-1">
                <button v-for="rate in [0, 3, 6]" :key="rate" @click="selfRate = rate"
                                :class="['flex-1 py-2 rounded-lg text-sm font-medium transition-all group',
                                         selfRate === rate ? 'bg-gradient-to-r from-brand-500 to-azure-500 text-white shadow-md' : 'bg-white/50 text-stone-600 hover:bg-white border border-stone-100']">
                                {{ rate }}%
                            </button>
                <input
                  aria-label="自提比例"
                  type="number"
                  v-model.number="selfRate"
                  min="0"
                  max="6"
                  class="w-12 bg-stone-50 border border-stone-200 rounded-lg text-center text-stone-800 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div>
              <label for="roiInput" class="block text-xs font-medium text-stone-500 mb-2">預估年報酬率</label>
              <div class="flex gap-1 mb-2">
                <button
                  @click="roi = 3"
                  class="flex-1 py-1 rounded bg-stone-100 text-stone-500 text-xs hover:bg-stone-200 transition-colors"
                >
                  保守 3%
                </button>
                <button
                  @click="roi = 5"
                  class="flex-1 py-1 rounded bg-stone-100 text-stone-500 text-xs hover:bg-stone-200 transition-colors"
                >
                  穩健 5%
                </button>
                <button
                  @click="roi = 8"
                  class="flex-1 py-1 rounded bg-stone-100 text-stone-500 text-xs hover:bg-stone-200 transition-colors"
                >
                  積極 8%
                </button>
              </div>
              <input
                id="roiInput"
                type="number"
                v-model.number="roi"
                step="0.5"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label for="taxRateSelect" class="block text-xs font-medium text-stone-500 mb-2">所得稅率 (計算節稅)</label>
              <select
                id="taxRateSelect"
                v-model.number="taxRate"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 text-sm focus:outline-none appearance-none"
              >
                <option :value="5">5% (年收 0-59萬)</option>
                <option :value="12">12% (59-133萬)</option>
                <option :value="20">20% (133-266萬)</option>
                <option :value="30">30% (266-498萬)</option>
                <option :value="40">40% (498萬以上)</option>
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
              <p class="text-xs text-stone-500 uppercase tracking-wider mb-1">
                預估累積總額 ({{ retireAge - currentAge }} 年)
              </p>
              <p class="text-4xl font-bold stat-value text-amber-600">
                <span class="text-2xl text-stone-400 mr-1">$</span>{{ totalAmount.toLocaleString() }}
              </p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-xs text-stone-500 mb-1">預估月領 (20年年金)</p>
              <p class="text-xl font-semibold text-stone-700 stat-value">${{ monthlyPension.toLocaleString() }}</p>
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
            <h3 class="text-sm font-bold text-stone-700 mb-4">💰 資金結構 (本金 vs 複利)</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-stone-500">投資收益({{ interestPercent }}%)</span>
                  <span class="text-amber-600 font-bold">+${{ totalInterest.toLocaleString() }}</span>
                </div>
                <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full" :style="{ width: interestPercent + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-stone-500">本金投入({{ principalPercent }}%)</span>
                  <span class="text-stone-700 font-bold">${{ totalPrincipal.toLocaleString() }}</span>
                </div>
                <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-stone-500 h-full" :style="{ width: principalPercent + '%' }"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- 節稅 & 月提 -->
          <section class="calculator-card-tight">
            <h3 class="text-sm font-bold text-stone-700 mb-4">🎁 節稅效益</h3>
            <div class="relative z-10">
                <div class="text-center mb-6">
                    <p class="text-stone-500 text-sm mb-1 uppercase tracking-wider">每年預估省稅</p>
                    <p class="text-4xl md:text-5xl font-bold text-brand-600">
                        <span class="text-brand-400 text-2xl mr-1">$</span>{{ taxSavingYearly.toLocaleString() }}
                    </p>
                    <p class="text-xs text-stone-400 mt-2">根據您的稅率 {{ taxRate }}% 計算</p>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-2">
                    <div class="bg-white/50 rounded-xl p-3 text-center border border-stone-100">
                        <p class="text-xs text-stone-400 mb-1">自提總投入</p>
                        <p class="text-lg font-bold text-stone-700">${{ (selfMonthlyContribution * 12 * years).toLocaleString() }}</p>
                    </div>
                    <div class="bg-white/50 rounded-xl p-3 text-center border border-stone-100">
                        <p class="text-xs text-stone-400 mb-1">累計省稅</p>
                        <p class="text-lg font-bold text-brand-500">+${{ (taxSavingYearly * years).toLocaleString() }}</p>
                    </div>
                </div>
            </div>
          </section>
        </div>

        <!-- 說明 -->
        <div class="p-5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-500 space-y-2 leading-relaxed">
          <p class="font-bold text-stone-700">ℹ️ 極致使用技巧：</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>
              <strong>為什麼要自提？</strong>
              除了像存錢罐一樣強制儲蓄，最直接的效益是「節稅」。自提金額會從當年度「個人綜合所得總額」中全數扣除，直接降低您的稅基。
            </li>
            <li>
              <strong>複利的威力：</strong> 試著將報酬率從 3% 調整到 5%，即便是微小的差距，經過 30
              年的時間複利滾存，退休金總額可能會翻倍！
            </li>
            <li>
              <strong>本工具假設：</strong> 月領金額採「年金法」計算，並假設退休後資金繼續以 2%
              保守報酬率滾存，摊提 20 年。
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
const selfRate = ref(6);
const roi = ref(5); // Annual ROI
const taxRate = ref(12); // Tax Rate

const growthChart = ref(null);
let chartInstance = null;

const years = computed(() => Math.max(1, retireAge.value - currentAge.value));
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
  let balanceBasic = new Decimal(0);
  let balanceTotal = new Decimal(0);
  let principalTotal = new Decimal(0);

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
          label: '總累積 (含自提)',
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
          label: '僅雇主提撥(6%)',
          data: projection.value.map((d) => d.balanceBasic),
          borderColor: '#a8a29e', // stone-400
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
