<template>
  <div class="space-y-6">
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
          <p v-if="minimumChargeApplied > 0" class="mt-2 text-xs text-stone-500">
            已含每月最低計收 $100，補足 ${{ minimumChargeApplied }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-stone-500 mb-1">平均每度</p>
          <p class="text-xl font-bold text-stone-700 font-mono">${{ avgRate }}</p>
        </div>
      </div>

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
              :style="{ width: (tier.cost / Math.max(1, energyCharge) * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div v-if="minimumChargeApplied > 0" class="flex justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>每月最低計收補足</span>
          <span class="font-bold text-stone-700">+$ {{ minimumChargeApplied }}</span>
        </div>
      </div>

      <div
        v-if="breakdown.length > 2"
        class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm text-rose-700 font-medium flex gap-2 items-start"
      >
        <span>⚠️</span>
        <span>
          高級距電費佔比 <span class="font-bold">{{ highTierPercent }}%</span>，最後一級每度 ${{ breakdown[breakdown.length - 1].rate }}，是第一級的 {{ highTierMultiple }} 倍。
        </span>
      </div>
    </section>

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

    <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
      <h2 class="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
        <span class="text-lg">👻</span> 耗電怪獸分析
      </h2>

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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="userAppliances.length > 0">
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

    <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
      <h2 class="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
        <span class="text-lg">🌡️</span> 冷氣耗電估算
      </h2>

      <div class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="mode in acModes"
          :key="mode.id"
          @click="acInputMode = mode.id"
          :class="[
            'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
            acInputMode === mode.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100'
          ]"
        >
          {{ mode.label }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="acInputMode === 'kw'">
          <label for="acPower" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            電功率
          </label>
          <input
            id="acPower"
            type="number"
            v-model.number="acPower"
            min="0.1"
            max="20"
            step="0.1"
            aria-label="冷氣電功率"
            class="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acPowerPresets"
              :key="preset"
              type="button"
              @click="acPower = preset"
              class="px-2.5 py-1 rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              {{ preset }} kW
            </button>
          </div>
          <p class="mt-2 text-[11px] text-stone-400">直接輸入銘板上的消耗功率，適合已知實際耗電規格時使用。</p>
        </div>

        <div v-else-if="acInputMode === 'btu'">
          <label for="acBtu" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            冷房能力
          </label>
          <input
            id="acBtu"
            type="number"
            v-model.number="acBtu"
            min="3000"
            max="120000"
            step="500"
            aria-label="冷房能力 BTU/h"
            class="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acBtuPresets"
              :key="preset"
              type="button"
              @click="acBtu = preset"
              class="px-2.5 py-1 rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              {{ preset.toLocaleString() }}
            </button>
          </div>
          <p class="mt-2 text-[11px] text-stone-400">BTU/h 是冷房能力，不是耗電功率，仍需搭配 COP 或 CSPF 估算輸入功率。</p>
        </div>

        <div v-else>
          <label for="acCapacityKw" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            冷房能力
          </label>
          <input
            id="acCapacityKw"
            type="number"
            v-model.number="acCapacityKw"
            min="0.8"
            max="35"
            step="0.1"
            aria-label="冷房能力 kW"
            class="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acCapacityPresets"
              :key="preset"
              type="button"
              @click="acCapacityKw = preset"
              class="px-2.5 py-1 rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              {{ preset }} kW
            </button>
          </div>
          <p class="mt-2 text-[11px] text-stone-400">若銘板標示為冷房能力 kW，可在這裡直接搭配 COP 或 CSPF 換算。</p>
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
          <p class="mt-2 text-[11px] text-stone-400">依每天平均運轉時數估算，變頻機實際耗電仍會受室外溫度與設定溫度影響。</p>
        </div>
      </div>

      <div v-if="acInputMode !== 'kw'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">效能指標</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="acEfficiencyType = 'cop'"
              :class="[
                'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                acEfficiencyType === 'cop'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100'
              ]"
            >
              COP
            </button>
            <button
              @click="acEfficiencyType = 'cspf'"
              :class="[
                'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                acEfficiencyType === 'cspf'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100'
              ]"
            >
              CSPF
            </button>
          </div>
          <p class="mt-2 text-[11px] text-stone-400">
            COP 可近似即時效率；CSPF 是季節效率，本工具以平均值粗估輸入功率。
          </p>
        </div>
        <div>
          <label for="acEfficiencyValue" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            {{ acEfficiencyType.toUpperCase() }} 數值
          </label>
          <input
            id="acEfficiencyValue"
            type="number"
            v-model.number="acEfficiencyValue"
            min="1"
            max="8"
            step="0.1"
            aria-label="效能值"
            class="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acEfficiencyPresets"
              :key="preset"
              type="button"
              @click="acEfficiencyValue = preset"
              class="px-2.5 py-1 rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              {{ preset }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4 p-4 bg-stone-100/50 rounded-xl border border-stone-100">
        <div class="flex flex-col gap-1 text-center">
          <p class="text-stone-500 text-xs font-medium">冷氣每月預估</p>
          <div class="flex items-center justify-center gap-2 mt-1">
            <p class="text-2xl font-bold text-stone-800 font-mono">
              {{ acMonthlyKwh }} <span class="text-sm font-sans text-stone-500 font-normal">度</span>
            </p>
            <span class="text-stone-300">|</span>
            <p class="text-sm text-stone-500">約 ${{ acMonthlyCost }}</p>
          </div>
          <p class="text-xs text-stone-500 mt-1">
            {{ acEstimateLabel }}
          </p>
          <p v-if="acInputMode !== 'kw'" class="text-[11px] text-stone-400">
            冷房能力 {{ acCoolingCapacityKw.toFixed(2) }} kW
            <span class="mx-1">≈</span>
            {{ acCoolingCapacityBtu.toLocaleString() }} BTU/h
            <span class="mx-1">→</span>
            推估輸入功率 {{ acEstimatedInputKw.toFixed(2) }} kW
          </p>
          <button @click="addAcToGhost" class="mt-2 text-xs text-blue-600 hover:underline">
            + 加入到耗電怪獸分析
          </button>
        </div>
      </div>
    </section>

    <footer class="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-500">
      <p class="font-bold text-stone-600 mb-2">📌 資料版本與說明</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-500">
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span> 夏月：6~9月</div>
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400"></span> 非夏月：其他月份</div>
        <div class="md:col-span-2">住宅累進級距採台電 2024-04-01 起實施費率，高用電級距已更新為夏月 $6.24 / $8.46、非夏月 $5.66 / $6.71。</div>
        <div class="md:col-span-2">已納入 2025-09-12 公告後之每月最低計收 $100 規則；冷氣 BTU/h、CSPF 換算為平均估算值，仍以設備銘板與實際帳單為準。</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import {
  BTU_PER_KW,
  NON_SUMMER_ELECTRICITY_RATES,
  SUMMER_ELECTRICITY_RATES,
  calcElectricityCostSummary,
  convertKwToBtu,
  estimateAcInputKw,
  estimateAcMonthlyKwh
} from '../../utils/calculators/electricity';

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
  { name: '電燈 (全家)', watts: 100, hours: 6 }
];

const acModes = [
  { id: 'kw', label: 'kW 輸入' },
  { id: 'btu', label: 'BTU/h 輸入' },
  { id: 'capacity', label: '冷房能力 + 效能' }
];

const acPowerPresets = [0.6, 0.8, 1.2, 1.8, 2.5, 3.6, 5, 7.2, 10];
const acBtuPresets = [9000, 12000, 18000, 24000, 36000, 48000];
const acCapacityPresets = [2.6, 3.5, 5, 7.1, 10, 14];
const acEfficiencyPresets = [2.8, 3.2, 3.8, 4.5, 5.2, 6];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const kwh = ref(400);
const isSummer = ref(true);
const simulatedSave = ref(0);

const acInputMode = ref('kw');
const acPower = ref(1.2);
const acBtu = ref(12000);
const acCapacityKw = ref(3.5);
const acEfficiencyType = ref('cop');
const acEfficiencyValue = ref(3.8);
const acHours = ref(8);

const userAppliances = ref([]);
const newAppliance = ref({
  preset: '',
  watts: '',
  hours: ''
});

const appliancePresets = APPLIANCE_PRESETS;
let chartInstance = null;

const rates = computed(() => (isSummer.value ? SUMMER_ELECTRICITY_RATES : NON_SUMMER_ELECTRICITY_RATES));
const costSummary = computed(() => calcElectricityCostSummary(Number(kwh.value) || 0, rates.value));
const breakdown = computed(() => costSummary.value.tiers);
const energyCharge = computed(() => costSummary.value.energyCharge);
const minimumChargeApplied = computed(() => costSummary.value.minimumChargeApplied);
const totalCost = computed(() => costSummary.value.totalCost);
const avgRate = computed(() => (kwh.value > 0 ? (totalCost.value / kwh.value).toFixed(2) : '0.00'));

const highTierPercent = computed(() => {
  if (breakdown.value.length < 2 || totalCost.value <= 0) return 0;
  const last = breakdown.value[breakdown.value.length - 1];
  return Math.round(last.cost / totalCost.value * 100);
});

const highTierMultiple = computed(() => {
  if (breakdown.value.length < 2) return 1;
  return (breakdown.value[breakdown.value.length - 1].rate / breakdown.value[0].rate).toFixed(1);
});

const getSaving = (savingKwh) => {
  const newKwh = Math.max(0, (kwh.value || 0) - savingKwh);
  const newCost = calcElectricityCostSummary(newKwh, rates.value).totalCost;
  return totalCost.value - newCost;
};

const simulatedSaving = computed(() => getSaving(simulatedSave.value));
const simulateSave = (savingKwh) => {
  simulatedSave.value = savingKwh;
};

const normalizedAcPower = computed(() => clamp(Number(acPower.value) || 0, 0.1, 20));
const normalizedAcBtu = computed(() => clamp(Number(acBtu.value) || 0, 3000, 120000));
const normalizedAcCapacityKw = computed(() => clamp(Number(acCapacityKw.value) || 0, 0.8, 35));
const normalizedAcEfficiencyValue = computed(() => clamp(Number(acEfficiencyValue.value) || 0, 1, 8));
const normalizedAcHours = computed(() => clamp(Number(acHours.value) || 0, 0, 24));

const acCoolingCapacityKw = computed(() => {
  if (acInputMode.value === 'btu') {
    return normalizedAcBtu.value / BTU_PER_KW;
  }
  if (acInputMode.value === 'capacity') {
    return normalizedAcCapacityKw.value;
  }
  return normalizedAcPower.value;
});

const acCoolingCapacityBtu = computed(() => convertKwToBtu(acCoolingCapacityKw.value));

const acEstimatedInputKw = computed(() => {
  return estimateAcInputKw({
    mode: acInputMode.value,
    powerKw: normalizedAcPower.value,
    btuPerHour: normalizedAcBtu.value,
    coolingCapacityKw: normalizedAcCapacityKw.value,
    efficiencyValue: normalizedAcEfficiencyValue.value
  });
});

const acEstimateLabel = computed(() => {
  if (acInputMode.value === 'kw') {
    return `以實際電功率 ${acEstimatedInputKw.value.toFixed(2)} kW 估算`;
  }

  const metric = acEfficiencyType.value.toUpperCase();
  return `以冷房能力 ÷ ${metric} 推估平均輸入功率 ${acEstimatedInputKw.value.toFixed(2)} kW`;
});

const acMonthlyKwh = computed(() => estimateAcMonthlyKwh(acEstimatedInputKw.value, normalizedAcHours.value));
const acMonthlyCost = computed(() => calcElectricityCostSummary(acMonthlyKwh.value, rates.value).totalCost);

const applyPreset = () => {
  if (newAppliance.value.preset) {
    newAppliance.value.watts = newAppliance.value.preset.watts;
    newAppliance.value.hours = newAppliance.value.preset.hours;
  }
};

const addAppliance = () => {
  const { preset, watts, hours } = newAppliance.value;
  const powerWatts = Number(watts) || 0;
  const dailyHours = clamp(Number(hours) || 0, 0, 24);
  const name = preset ? preset.name : (powerWatts ? `自訂電器 (${powerWatts}W)` : '未命名');

  if (powerWatts > 0 && dailyHours > 0) {
    userAppliances.value.push({
      name,
      watts: powerWatts,
      hours: dailyHours,
      monthlyKwh: (powerWatts * dailyHours * 30) / 1000,
      monthlyCost: 0
    });
    newAppliance.value = { preset: '', watts: '', hours: '' };
  }
};

const getAcGhostName = () => {
  if (acInputMode.value === 'kw') {
    return `冷氣估算 (${acEstimatedInputKw.value.toFixed(1)}kW)`;
  }
  if (acInputMode.value === 'btu') {
    return `冷氣估算 (${normalizedAcBtu.value.toLocaleString()} BTU/h, ${acEfficiencyType.value.toUpperCase()} ${normalizedAcEfficiencyValue.value.toFixed(1)})`;
  }
  return `冷氣估算 (${acCoolingCapacityKw.value.toFixed(1)}kW 冷房, ${acEfficiencyType.value.toUpperCase()} ${normalizedAcEfficiencyValue.value.toFixed(1)})`;
};

const addAcToGhost = () => {
  userAppliances.value.push({
    name: getAcGhostName(),
    watts: Math.round(acEstimatedInputKw.value * 1000),
    hours: normalizedAcHours.value,
    monthlyKwh: acEstimatedInputKw.value * normalizedAcHours.value * 30,
    monthlyCost: 0
  });
};

const removeAppliance = (index) => {
  userAppliances.value.splice(index, 1);
};

watch([avgRate, userAppliances], () => {
  const averageRate = Number(avgRate.value) || 0;
  userAppliances.value.forEach((appliance) => {
    appliance.monthlyCost = appliance.monthlyKwh * averageRate;
  });
  updateChart();
}, { deep: true });

const totalGhostKwh = computed(() => Math.round(userAppliances.value.reduce((sum, appliance) => sum + appliance.monthlyKwh, 0)));
const ghostCoverage = computed(() => {
  const monthlyUsage = kwh.value || 1;
  return Math.min(100, Math.round(totalGhostKwh.value / monthlyUsage * 100));
});

function updateChart() {
  const ctx = document.getElementById('ghostChart');
  if (!ctx) return;

  if (userAppliances.value.length === 0) {
    if (chartInstance) chartInstance.destroy();
    return;
  }

  if (chartInstance) chartInstance.destroy();

  const labels = userAppliances.value.map((appliance) => appliance.name);
  const data = userAppliances.value.map((appliance) => appliance.monthlyKwh);
  const unknown = (kwh.value || 0) - totalGhostKwh.value;

  if (unknown > 0) {
    labels.push('其他/未知');
    data.push(unknown);
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#a78bfa', '#e879f9', '#f472b6',
          '#e5e7eb'
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

watch(totalCost, (newValue) => {
  const value = parseInt(newValue, 10);
  if (value > 0) {
    localStorage.setItem('taicalc_electricity_monthly', value);
  } else {
    localStorage.removeItem('taicalc_electricity_monthly');
  }
});

onMounted(() => {
  const saved = localStorage.getItem('taicalc_electricity_inputs');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.kwh) kwh.value = data.kwh;
      if (data.isSummer !== undefined) isSummer.value = data.isSummer;
      if (data.acInputMode) acInputMode.value = data.acInputMode;
      if (data.acPower) acPower.value = data.acPower;
      if (data.acBtu) acBtu.value = data.acBtu;
      if (data.acCapacityKw) acCapacityKw.value = data.acCapacityKw;
      if (data.acEfficiencyType) acEfficiencyType.value = data.acEfficiencyType;
      if (data.acEfficiencyValue) acEfficiencyValue.value = data.acEfficiencyValue;
      if (data.acHours) acHours.value = data.acHours;
      if (data.userAppliances) userAppliances.value = data.userAppliances;
    } catch (_) {}
  }

  nextTick(() => {
    updateChart();
  });
});

watch(acPower, (value) => {
  const nextValue = Number(value) || 0;
  if (nextValue !== normalizedAcPower.value) {
    acPower.value = normalizedAcPower.value;
  }
});

watch(acBtu, (value) => {
  const nextValue = Number(value) || 0;
  if (nextValue !== normalizedAcBtu.value) {
    acBtu.value = normalizedAcBtu.value;
  }
});

watch(acCapacityKw, (value) => {
  const nextValue = Number(value) || 0;
  if (nextValue !== normalizedAcCapacityKw.value) {
    acCapacityKw.value = normalizedAcCapacityKw.value;
  }
});

watch(acEfficiencyValue, (value) => {
  const nextValue = Number(value) || 0;
  if (nextValue !== normalizedAcEfficiencyValue.value) {
    acEfficiencyValue.value = normalizedAcEfficiencyValue.value;
  }
});

watch(acHours, (value) => {
  const nextValue = Number(value) || 0;
  if (nextValue !== normalizedAcHours.value) {
    acHours.value = normalizedAcHours.value;
  }
});

watch([kwh, isSummer, acInputMode, acPower, acBtu, acCapacityKw, acEfficiencyType, acEfficiencyValue, acHours, userAppliances], () => {
  localStorage.setItem('taicalc_electricity_inputs', JSON.stringify({
    kwh: kwh.value,
    isSummer: isSummer.value,
    acInputMode: acInputMode.value,
    acPower: acPower.value,
    acBtu: acBtu.value,
    acCapacityKw: acCapacityKw.value,
    acEfficiencyType: acEfficiencyType.value,
    acEfficiencyValue: acEfficiencyValue.value,
    acHours: acHours.value,
    userAppliances: userAppliances.value
  }));
}, { deep: true });
</script>
