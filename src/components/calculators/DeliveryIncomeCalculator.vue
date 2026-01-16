<template>
  <div class="space-y-6">
    <!-- 輸入區塊 -->
    <div class="grid lg:grid-cols-2 gap-6">
      <section class="card rounded-2xl p-6 md:p-8">
        <h2 class="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">💰 收入結構</h2>
        <div class="space-y-4">
          <div>
            <label for="baseIncome" class="block text-xs font-medium text-stone-500 mb-1"
              >基礎跑單收入 (不含獎勵)</label
            >
            <input
              id="baseIncome"
              type="number"
              v-model.number="baseIncome"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label for="incentive" class="block text-xs font-medium text-stone-500 mb-1"
              >平台獎勵/加碼 (趟次達標)</label
            >
            <input
              id="incentive"
              type="number"
              v-model.number="incentive"
              class="w-full bg-emerald-50 border border-emerald-200 rounded-xl py-2.5 px-3 text-emerald-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="0"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="kilometers" class="block text-xs font-medium text-stone-500 mb-1">總里程 (KM)</label>
              <input
                id="kilometers"
                type="number"
                v-model.number="kilometers"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label for="workHours" class="block text-xs font-medium text-stone-500 mb-1">總工時 (H)</label>
              <input
                id="workHours"
                type="number"
                v-model.number="workHours"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="card rounded-2xl p-6 md:p-8">
        <h2 class="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">🛵 車輛與隱性成本</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="gasPrice" class="block text-xs font-medium text-stone-500 mb-1">油價 ($/L)</label>
              <input
                id="gasPrice"
                type="number"
                v-model.number="gasPrice"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label for="kmPerLiter" class="block text-xs font-medium text-stone-500 mb-1">油耗 (KM/L)</label>
              <input
                id="kmPerLiter"
                type="number"
                v-model.number="kmPerLiter"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="maintenancePerKm" class="block text-xs font-medium text-stone-500 mb-1"
                >每公里保養攤提</label
              >
              <div class="relative">
                <input
                  id="maintenancePerKm"
                  type="number"
                  v-model.number="maintenancePerKm"
                  step="0.1"
                  class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label for="insuranceMonthly" class="block text-xs font-medium text-stone-500 mb-1"
                >商用保險/折舊</label
              >
              <div class="relative">
                <input
                  id="insuranceMonthly"
                  type="number"
                  v-model.number="insuranceMonthly"
                  class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 結果儀表板 -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- 核心數據 -->
      <section
        class="card bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col justify-between relative overflow-hidden"
      >
        <div
          class="absolute right-0 top-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"
        ></div>

        <div class="relative z-10">
          <p class="text-sm font-bold text-emerald-800 mb-1">實質淨收入 (Net Income)</p>
          <p class="text-4xl font-extrabold text-emerald-600 tracking-tight mb-2">
            <span class="text-2xl opacity-70">$</span>{{ netIncome }}
          </p>
          <div class="flex items-center gap-3 text-sm">
            <span class="bg-white/60 px-2 py-1 rounded text-emerald-700 font-medium">實薪 ${{ hourlyRate }}</span>
            <span class="bg-white/60 px-2 py-1 rounded text-emerald-700 font-medium">${{ perKm }}/km</span>
          </div>
        </div>

        <div class="relative z-10 pt-6 mt-6 border-t border-emerald-200/60 grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-emerald-600 mb-1">燃料成本占比</p>
             <p class="text-lg font-bold text-rose-600">{{ fuelCostRatio }}%</p>
          </div>
          <div>
            <p class="text-xs text-emerald-600 mb-1">獲利能力 (Margin)</p>
            <p class="text-lg font-bold text-emerald-800">{{ profitMargin }}%</p>
          </div>
        </div>
      </section>

      <!-- 成本結構圖表 -->
      <section class="card rounded-2xl p-6 md:p-8 flex items-center">
        <div class="w-1/2">
          <h3 class="text-sm font-bold text-stone-700 mb-4">支出明細</h3>
          <ul class="space-y-2 text-xs">
            <li class="flex justify-between">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-400"></span>油錢</span>
              <span class="font-mono text-stone-600">${{ gasCost }}</span>
            </li>
            <li class="flex justify-between">
              <span class="flex items-center gap-1"
                ><span class="w-2 h-2 rounded-full bg-orange-400"></span>保養</span
              >
              <span class="font-mono text-stone-600">${{ maintenanceTotal }}</span>
            </li>
            <li class="flex justify-between">
              <span class="flex items-center gap-1"
                ><span class="w-2 h-2 rounded-full bg-gray-400"></span>保險/其他</span
              >
              <span class="font-mono text-stone-600">${{ insuranceMonthlyDisplay }}</span>
            </li>
            <li class="pt-2 mt-2 border-t border-dashed border-stone-100 flex justify-between font-bold">
              <span class="text-stone-700">總成本</span>
              <span class="text-rose-500">-${{ totalCost }}</span>
            </li>
          </ul>
        </div>
        <div class="w-1/2 flex justify-center">
          <div class="chart-container w-32 h-32 relative">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </section>
    </div>

    <div class="text-center text-xs text-stone-400 mt-8">
      💡 建議：平台獎勵是各家業者的獲利關鍵，建議每週至少跑滿「達標趟次」才能有效拉高實薪。
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const baseIncome = ref(0);
const incentive = ref(0);
const kilometers = ref(0);
const gasPrice = ref(30);
const kmPerLiter = ref(35);
const workHours = ref(0);
const maintenancePerKm = ref(0.8);
const insuranceMonthly = ref(0);

const chartCanvas = ref(null);
let chartInstance = null;

// Computed
const grossIncome = computed(() => (baseIncome.value || 0) + (incentive.value || 0));

const gasCostRaw = computed(() => {
  if (!kmPerLiter.value) return 0;
  return (kilometers.value / kmPerLiter.value) * gasPrice.value;
});
const maintenanceTotalRaw = computed(() => kilometers.value * maintenancePerKm.value);

const gasCost = computed(() => Math.round(gasCostRaw.value).toLocaleString());
const maintenanceTotal = computed(() => Math.round(maintenanceTotalRaw.value).toLocaleString());
const insuranceMonthlyDisplay = computed(() => Math.round(insuranceMonthly.value).toLocaleString());

const totalCostRaw = computed(() => gasCostRaw.value + maintenanceTotalRaw.value + insuranceMonthly.value);
const totalCost = computed(() => Math.round(totalCostRaw.value).toLocaleString());

const netIncomeRaw = computed(() => grossIncome.value - totalCostRaw.value);
const netIncome = computed(() => Math.round(netIncomeRaw.value).toLocaleString());

const hourlyRate = computed(() =>
  workHours.value > 0 ? Math.round(netIncomeRaw.value / workHours.value) : 0
);
const perKm = computed(() =>
  kilometers.value > 0 ? Math.round((netIncomeRaw.value / kilometers.value) * 10) / 10 : 0
);

const fuelCostRatio = computed(() =>
  grossIncome.value > 0 ? Math.round((gasCostRaw.value / grossIncome.value) * 100) : 0
);
const profitMargin = computed(() =>
  grossIncome.value > 0 ? Math.round((netIncomeRaw.value / grossIncome.value) * 100) : 0
);

// Chart
const updateChart = () => {
  if (!chartCanvas.value) return;
  if (chartInstance) chartInstance.destroy();

  const net = Math.max(0, netIncomeRaw.value);
  const gas = gasCostRaw.value;
  const maint = maintenanceTotalRaw.value + insuranceMonthly.value;

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['淨收入', '油錢', '保養雜支'],
      datasets: [
        {
          data: [net, gas, maint],
          backgroundColor: ['#10b981', '#fb7185', '#fb923c'], // Emerald-500, Rose-400, Orange-400
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
  });
};

// Persistence
const STORAGE_KEY_INPUTS = 'taicalc_delivery_inputs';
const STORAGE_KEY_NET = 'taicalc_delivery_net';

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY_INPUTS);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.baseIncome) baseIncome.value = data.baseIncome;
      if (data.incentive) incentive.value = data.incentive;
      if (data.kilometers) kilometers.value = data.kilometers;
      if (data.gasPrice) gasPrice.value = data.gasPrice;
      if (data.kmPerLiter) kmPerLiter.value = data.kmPerLiter;
      if (data.workHours) workHours.value = data.workHours;
      if (data.maintenancePerKm) maintenancePerKm.value = data.maintenancePerKm;
       if (data.insuranceMonthly) insuranceMonthly.value = data.insuranceMonthly;
    } catch (e) {}
  }
  setTimeout(updateChart, 100);
});

watch(
  [baseIncome, incentive, kilometers, gasPrice, kmPerLiter, workHours, maintenancePerKm, insuranceMonthly],
  (vals) => {
    updateChart();
    localStorage.setItem(
      STORAGE_KEY_INPUTS,
      JSON.stringify({
        baseIncome: vals[0],
        incentive: vals[1],
        kilometers: vals[2],
        gasPrice: vals[3],
        kmPerLiter: vals[4],
        workHours: vals[5],
        maintenancePerKm: vals[6],
        insuranceMonthly: vals[7],
      })
    );
  }
);

watch(netIncome, (newVal) => {
  const val = parseInt(String(newVal).replace(/,/g, ''));
  if (val > 0) {
    localStorage.setItem(STORAGE_KEY_NET, val);
  }
});
</script>
