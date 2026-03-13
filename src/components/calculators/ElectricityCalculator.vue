<template>
  <div class="space-y-6">
    <!-- 輸入區 -->
    <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button
          @click="isSummer = true"
          :class="['py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border', 
          isSummer ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100']"
        >
          <span>🌞</span> 夏月 (6-9月)
        </button>
        <button
          @click="isSummer = false"
          :class="['py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border', 
          !isSummer ? 'bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100']"
        >
          <span>❄️</span> 非夏月
        </button>
      </div>

      <div>
        <label for="kwhInput" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
          每月用電度數 (度)
        </label>
        <div class="relative">
          <input
            id="kwhInput"
            type="number"
            v-model.number="kwh"
            class="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-gray-900 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-stone-400"
          />
          <span class="absolute right-4 top-4 text-stone-400 font-medium">kWh</span>
        </div>

        <label for="kwhRange" class="sr-only">調整度數</label>
        <input
          id="kwhRange"
          type="range"
          v-model.number="kwh"
          min="0"
          max="2000"
          step="10"
          class="w-full mt-6 accent-amber-500 cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
          <span>0</span><span>500</span><span>1000</span><span>1500</span><span>2000</span>
        </div>
      </div>
    </section>

    <!-- 主要結果 -->
    <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
      <div class="flex items-end justify-between mb-6 pb-6 border-b border-stone-100">
        <div>
          <p class="text-xs text-stone-500 font-semibold uppercase tracking-wider mb-1">預估電費</p>
          <p
            class="text-4xl sm:text-5xl font-bold font-mono tracking-tight"
            :class="isSummer ? 'text-orange-600' : 'text-blue-600'"
          >
            <span class="text-2xl text-stone-400 mr-1">$</span>{{ totalCost.toLocaleString() }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-stone-500 mb-1">平均每度</p>
          <p class="text-xl font-bold text-stone-700 font-mono">${{ avgRate }}</p>
        </div>
      </div>

      <!-- 級距條形圖 -->
      <div class="space-y-3 mb-6">
        <div v-for="(tier, i) in breakdown" :key="i" class="relative">
          <div class="flex justify-between text-xs text-stone-500 mb-1 font-medium">
            <span>{{ tier.label }}</span>
            <span>
              {{ tier.kwh }}度 × ${{ tier.rate }} = <span class="font-bold text-stone-700">${{ tier.cost }}</span>
            </span>
          </div>
          <div class="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="i === breakdown.length - 1 && breakdown.length > 1 ? 'bg-red-500' : (isSummer ? 'bg-orange-400' : 'bg-blue-400')"
              :style="{ width: (tier.cost / totalCost * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div
        v-if="breakdown.length > 2"
        class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm text-rose-700 font-medium flex gap-2 items-start"
      >
        <span>⚠️</span>
        <span>
          高級距電費佔比 <span class="font-bold">{{ highTierPercent }}%</span>！最後一級每度 ${{ breakdown[breakdown.length - 1].rate }}，是第一級的 {{ highTierMultiple }} 倍。
        </span>
      </div>
    </section>

    <!-- 省電模擬 -->
    <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
      <h2 class="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
        <span class="text-lg">💡</span> 省電模擬
        <span class="text-stone-400 font-normal text-xs ml-auto">如果每月少用...</span>
      </h2>

      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="n in [30, 50, 100]"
          :key="n"
          @click="simulateSave(n)"
          class="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl p-3 text-center transition-all group active:scale-95"
        >
          <p class="text-lg font-bold text-stone-700 group-hover:text-brand-600">-{{ n }} 度</p>
          <p class="text-xs text-stone-500 mt-1">省 ${{ getSaving(n) }}</p>
        </button>
      </div>

      <div
        v-if="simulatedSave > 0"
        class="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl text-center"
      >
        <p class="text-brand-800 text-sm font-medium">
          省下 {{ simulatedSave }} 度，每月可省 <span class="text-xl font-bold text-brand-600">${{ simulatedSaving }}</span>
        </p>
        <p class="text-xs text-brand-600/70 mt-1">
          一年約可省下 ${{ (simulatedSaving * 12).toLocaleString() }}
        </p>
      </div>
    </section>

    <!-- 耗電怪獸分析 (Appliance Analysis) -->
    <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
      <h2 class="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
        <span class="text-lg">👻</span> 耗電怪獸分析
      </h2>

      <!-- Add Appliance Form -->
      <div class="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-1">
            <label class="block text-xs font-semibold text-stone-500 mb-1">選擇電器</label>
            <select
              v-model="newAppliance.preset"
              @change="applyPreset"
              title="選擇電器"
              class="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="" disabled>--- 請選擇 ---</option>
              <option v-for="item in appliancePresets" :key="item.name" :value="item">{{ item.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-500 mb-1">功率 (瓦特 W)</label>
            <input
              type="number"
              v-model.number="newAppliance.watts"
              placeholder="W"
              class="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-500 mb-1">每日時數 (hr)</label>
            <input
              type="number"
              v-model.number="newAppliance.hours"
              placeholder="hr"
              min="0"
              max="24"
              class="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
        <button
          @click="addAppliance"
          class="mt-3 w-full py-2 bg-stone-800 text-white rounded-lg text-sm font-bold hover:bg-stone-700 transition-colors"
        >
          + 加入清單
        </button>
      </div>

      <!-- Appliance List & Chart Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="userAppliances.length > 0">
        <!-- List -->
        <div class="space-y-3">
          <div
            v-for="(app, idx) in userAppliances"
            :key="idx"
            class="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100"
          >
            <div>
              <p class="font-bold text-stone-700 text-sm">{{ app.name }}</p>
              <p class="text-xs text-stone-500">{{ app.watts }}W × {{ app.hours }}hr/日</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="font-bold text-stone-800 text-sm">{{ Math.round(app.monthlyKwh) }}度</p>
                <p class="text-xs text-stone-400">約 ${{ Math.round(app.monthlyCost) }}</p>
              </div>
              <button
                @click="removeAppliance(idx)"
                class="text-stone-300 hover:text-red-500"
                title="移除"
                aria-label="移除電器"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <div class="pt-3 border-t border-stone-100 flex justify-between items-center text-sm">
            <span class="text-stone-500">分析總計</span>
            <span class="font-bold text-stone-800">{{ totalGhostKwh }} 度 ({{ ghostCoverage }}%)</span>
          </div>
        </div>

        <!-- Chart -->
        <div class="flex flex-col items-center justify-center bg-stone-50 rounded-xl p-4 border border-stone-100">
          <div class="w-full h-[200px] relative">
            <canvas id="ghostChart"></canvas>
          </div>
          <p class="text-xs text-stone-400 mt-2 text-center" v-if="ghostCoverage < 100">
            還有 {{ 100 - ghostCoverage }}% 用電未被分析到
          </p>
        </div>
      </div>
    </section>

    <!-- 冷氣耗電估算 -->
    <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
      <h2 class="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
        <span class="text-lg">🌡️</span> 冷氣耗電估算
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="acPower" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            冷氣功率
          </label>
          <select
            id="acPower"
            v-model.number="acPower"
            aria-label="冷氣功率"
            class="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option :value="0.8">小型 (0.8kW)</option>
            <option :value="1.2">中型 (1.2kW)</option>
            <option :value="1.8">大型 (1.8kW)</option>
            <option :value="2.5">超大 (2.5kW)</option>
          </select>
        </div>
        <div>
          <label for="acHours" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            每日時數
          </label>
          <input
            id="acHours"
            type="number"
            v-model.number="acHours"
            min="0"
            max="24"
            class="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>
      <div class="mt-4 p-3 bg-stone-100/50 rounded-xl text-center border border-stone-100">
        <p class="text-stone-500 text-xs font-medium">冷氣每月預估</p>
        <div class="flex items-center justify-center gap-2 mt-1">
          <p class="text-2xl font-bold text-stone-800 font-mono">
            {{ acMonthlyKwh }} <span class="text-sm font-sans text-stone-500 font-normal">度</span>
          </p>
          <span class="text-stone-300">|</span>
          <p class="text-sm text-stone-500">約 ${{ acMonthlyCost }}</p>
        </div>
        <button @click="addAcToGhost" class="mt-2 text-xs text-blue-600 hover:underline">
          + 加入到耗電怪獸分析
        </button>
      </div>
    </section>

    <!-- 費率說明 -->
    <footer class="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-500">
      <p class="font-bold text-stone-600 mb-2">📌 台電 2024 年住宅電價結構</p>
      <div class="grid grid-cols-2 gap-2 text-stone-500">
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span> 夏月：6~9月</div>
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400"></span> 非夏月：其他月份</div>
        <div class="col-span-2 mt-1 text-stone-400">採 6 段累進費率，用越多越貴。</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const SUMMER = [
  { limit: 120, rate: 1.68 },
  { limit: 330, rate: 2.45 },
  { limit: 500, rate: 3.70 },
  { limit: 700, rate: 5.04 },
  { limit: 1000, rate: 6.03 },
  { limit: Infinity, rate: 7.69 }
];
const NON_SUMMER = [
  { limit: 120, rate: 1.68 },
  { limit: 330, rate: 2.16 },
  { limit: 500, rate: 3.03 },
  { limit: 700, rate: 4.14 },
  { limit: 1000, rate: 5.07 },
  { limit: Infinity, rate: 6.63 }
];

const calcBreakdown = (kwh, rates) => {
  let remain = kwh, prev = 0, result = [];
  for (const t of rates) {
    if (remain <= 0) break;
    const use = Math.min(remain, t.limit - prev);
    if (use > 0) {
      result.push({
        label: `${prev + 1}~${t.limit === Infinity ? '以上' : t.limit}度`,
        kwh: use,
        rate: t.rate,
        cost: Math.round(use * t.rate)
      });
    }
    remain -= use;
    prev = t.limit;
  }
  return result;
};

const APPLIANCE_PRESETS = [
  { name: '冷氣 (小型)', watts: 800, hours: 8 },
  { name: '冷氣 (中型)', watts: 1200, hours: 8 },
  { name: '冰箱 (中型)', watts: 130, hours: 24 },
  { name: '除濕機', watts: 300, hours: 8 },
  { name: '電視 (65吋)', watts: 150, hours: 4 },
  { name: '電腦 (桌機)', watts: 300, hours: 6 },
  { name: '電熱水瓶', watts: 800, hours: 2 },
  { name: '電鍋 (保溫)', watts: 40, hours: 12 },
  { name: '吹風機', watts: 1200, hours: 0.2 },
  { name: '洗衣機', watts: 500, hours: 1 },
  { name: '電燈 (全家)', watts: 100, hours: 6 },
];

const kwh = ref(400);
const isSummer = ref(true);
const simulatedSave = ref(0);
const acPower = ref(1.2);
const acHours = ref(8);

// Ghost Hunter State
const userAppliances = ref([]);
const newAppliance = ref({
  preset: '',
  watts: '',
  hours: ''
});
const appliancePresets = APPLIANCE_PRESETS;
let chartInstance = null;

const rates = computed(() => isSummer.value ? SUMMER : NON_SUMMER);
const breakdown = computed(() => calcBreakdown(kwh.value || 0, rates.value));
const totalCost = computed(() => breakdown.value.reduce((s, t) => s + t.cost, 0));
const avgRate = computed(() => kwh.value > 0 ? (totalCost.value / kwh.value).toFixed(2) : '0.00');

const highTierPercent = computed(() => {
  if (breakdown.value.length < 2) return 0;
  const last = breakdown.value[breakdown.value.length - 1];
  return Math.round(last.cost / totalCost.value * 100);
});
const highTierMultiple = computed(() => {
  if (breakdown.value.length < 2) return 1;
  return (breakdown.value[breakdown.value.length - 1].rate / breakdown.value[0].rate).toFixed(1);
});

const getSaving = (n) => {
  const newKwh = Math.max(0, (kwh.value || 0) - n);
  const newCost = calcBreakdown(newKwh, rates.value).reduce((s, t) => s + t.cost, 0);
  return totalCost.value - newCost;
};

const simulatedSaving = computed(() => getSaving(simulatedSave.value));

const simulateSave = (n) => { simulatedSave.value = n; };

const acMonthlyKwh = computed(() => Math.round(acPower.value * acHours.value * 30));
const acMonthlyCost = computed(() => calcBreakdown(acMonthlyKwh.value, rates.value).reduce((s, t) => s + t.cost, 0));

// Ghost Hunter Logic
const applyPreset = () => {
  if (newAppliance.value.preset) {
    newAppliance.value.watts = newAppliance.value.preset.watts;
    newAppliance.value.hours = newAppliance.value.preset.hours;
  }
};

const addAppliance = () => {
  const { preset, watts, hours } = newAppliance.value;
  const name = preset ? preset.name : (watts ? `自訂電器 (${watts}W)` : '未命名');
  const w = Number(watts) || 0;
  const h = Number(hours) || 0;
  if (w > 0 && h > 0) {
    userAppliances.value.push({
      name,
      watts: w,
      hours: h,
      monthlyKwh: (w * h * 30) / 1000,
      monthlyCost: 0 // Calculated dynamically later
    });
    // Reset but keep watts/hours maybe? No clear form
    newAppliance.value = { preset: '', watts: '', hours: '' };
  }
};

const addAcToGhost = () => {
  const kw = acPower.value;
  const h = acHours.value;
  userAppliances.value.push({
    name: `冷氣估算 (${kw}kW)`,
    watts: kw * 1000,
    hours: h,
    monthlyKwh: kw * h * 30,
    monthlyCost: 0
  });
};

const removeAppliance = (idx) => {
  userAppliances.value.splice(idx, 1);
};

// Update costs for appliances based on current total avg rate to give a rough estimate
watch([avgRate, userAppliances], () => {
  const rate = Number(avgRate.value) || 0;
  userAppliances.value.forEach(app => {
    app.monthlyCost = app.monthlyKwh * rate;
  });
  updateChart();
}, { deep: true });

const totalGhostKwh = computed(() => Math.round(userAppliances.value.reduce((s, a) => s + a.monthlyKwh, 0)));
const ghostCoverage = computed(() => {
  const total = kwh.value || 1;
  return Math.min(100, Math.round(totalGhostKwh.value / total * 100));
});

function updateChart() {
  const ctx = document.getElementById('ghostChart');
  if (!ctx) return;
  
  if (userAppliances.value.length === 0) {
    if (chartInstance) chartInstance.destroy();
    return;
  }

  if (chartInstance) chartInstance.destroy();

  const labels = userAppliances.value.map(a => a.name);
  const data = userAppliances.value.map(a => a.monthlyKwh);

  // Add "Unknown" if coverage < 100
  const unknown = (kwh.value || 0) - totalGhostKwh.value;
  if (unknown > 0) {
    labels.push('其他/未知');
    data.push(unknown);
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#a78bfa', '#e879f9', '#f472b6',
          '#e5e7eb' // Gray for unknown
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { font: { size: 10 }, boxWidth: 10 }
        }
      }
    }
  });
}

// Auto-save for Dashboard
watch(totalCost, (newVal) => {
  const val = parseInt(newVal);
  if (val > 0) {
    localStorage.setItem('taicalc_electricity_monthly', val);
  } else {
    localStorage.removeItem('taicalc_electricity_monthly');
  }
});

// Persistence
onMounted(() => {
  const saved = localStorage.getItem('taicalc_electricity_inputs');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.kwh) kwh.value = data.kwh;
      if (data.isSummer !== undefined) isSummer.value = data.isSummer;
      if (data.acPower) acPower.value = data.acPower;
      if (data.acHours) acHours.value = data.acHours;
      if (data.userAppliances) userAppliances.value = data.userAppliances;
    } catch (e) { }
  }
  // Wait for DOM
  nextTick(() => {
     updateChart();
  });
});

watch([kwh, isSummer, acPower, acHours, userAppliances], () => {
  localStorage.setItem('taicalc_electricity_inputs', JSON.stringify({
    kwh: kwh.value,
    isSummer: isSummer.value,
    acPower: acPower.value,
    acHours: acHours.value,
    userAppliances: userAppliances.value
  }));
}, { deep: true });
</script>
