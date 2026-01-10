<template>
  <div class="space-y-6">
    <!-- Global Settings -->
    <div
      class="card bg-white rounded-2xl shadow-sm border border-stone-200 p-4 transition-all"
      :class="{ 'opacity-100': showSettings, 'opacity-70': !showSettings }"
    >
      <div class="flex items-center justify-between cursor-pointer" @click="showSettings = !showSettings">
        <h2 class="text-sm font-bold text-stone-600 flex items-center gap-2">
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
            <path
              d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
          交易設定 (手續費折扣)
        </h2>
        <span class="text-xs text-stone-400 transform transition-transform" :class="{ 'rotate-180': showSettings }"
          >▼</span
        >
      </div>

      <div v-show="showSettings" class="mt-4 grid grid-cols-2 gap-4 border-t border-stone-100 pt-4">
        <div>
          <label class="block text-xs font-semibold text-stone-500 mb-1">券商折扣 (折)</label>
          <input
            type="number"
            v-model.number="settings.discount"
            step="0.1"
            aria-label="券商折扣"
            class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <p class="text-[10px] text-stone-400 mt-1">例：2.8折 輸入 2.8</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-500 mb-1">最低手續費 ($)</label>
          <input
            type="number"
            v-model.number="settings.minFee"
            aria-label="最低手續費"
            class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>
    </div>

    <!-- Main Calc Card -->
    <div class="card bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-stone-200">
        <button
          @click="mode = 'profit'"
          class="flex-1 py-3 text-sm font-bold text-center tab-btn"
          :class="mode === 'profit' ? 'text-red-600 active bg-red-50/50' : 'text-stone-500 hover:bg-stone-50'"
        >
          損益試算
        </button>
        <button
          @click="mode = 'breakeven'"
          class="flex-1 py-3 text-sm font-bold text-center tab-btn"
          :class="mode === 'breakeven' ? 'text-red-600 active bg-red-50/50' : 'text-stone-500 hover:bg-stone-50'"
        >
          成本/損益平衡
        </button>
        <button
          @click="mode = 'avg'"
          class="flex-1 py-3 text-sm font-bold text-center tab-btn"
          :class="mode === 'avg' ? 'text-red-600 active bg-red-50/50' : 'text-stone-500 hover:bg-stone-50'"
        >
          定期定額/均價
        </button>
      </div>

      <div class="p-4 md:p-6 space-y-6">
        <!-- Common Inputs (Single Trade) -->
        <div class="space-y-4" v-show="mode !== 'avg'">
          <!-- Type Selection -->
          <div class="flex gap-2">
            <button
              v-for="type in stockTypes"
              :key="type.id"
              @click="stockType = type.id"
              class="flex-1 py-2 text-xs font-bold rounded-lg border transition-all"
              :class="
                stockType === type.id
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
              "
            >
              {{ type.label }} <span class="text-[10px] opacity-70">({{ type.tax * 1000 }}‰)</span>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-stone-500 mb-1">買進價格</label>
              <input
                type="number"
                v-model.number="buyPrice"
                step="0.1"
                aria-label="買進價格"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-500 mb-1">股數 (1張=1000)</label>
              <input
                type="number"
                v-model.number="qty"
                step="1000"
                aria-label="股數"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <div v-show="mode === 'profit'">
            <label class="block text-xs font-semibold text-stone-500 mb-1">賣出價格</label>
            <input
              type="number"
              v-model.number="sellPrice"
              step="0.1"
              aria-label="賣出價格"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <!-- Dividend Section (Optional) -->
          <div v-show="mode === 'profit'" class="border-t border-stone-100 pt-4">
            <div
              class="flex items-center justify-between cursor-pointer mb-3"
              @click="showDividends = !showDividends"
            >
              <span class="text-sm font-bold text-stone-600 flex items-center gap-2">
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
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                進階：股利/股息 (選填)
              </span>
              <span class="text-xs text-stone-400 transform transition-transform" :class="{ 'rotate-180': showDividends }"
                >▼</span
              >
            </div>

            <div v-show="showDividends" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-stone-500 mb-1">現金股利 (元/股)</label>
                <input
                  type="number"
                  v-model.number="cashDividend"
                  step="0.1"
                  placeholder="0"
                  class="w-full bg-yellow-50 border border-yellow-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-stone-500 mb-1">股票股利 (元/股)</label>
                <input
                  type="number"
                  v-model.number="stockDividend"
                  step="0.1"
                  placeholder="0"
                  class="w-full bg-yellow-50 border border-yellow-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
                <p class="text-[10px] text-stone-400 mt-1">例如配 1元 = 每張配 100股</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Single Trade Results -->
        <div v-if="mode === 'profit'" class="pt-4 border-t border-stone-100">
          <div
            class="bg-stone-50 rounded-xl p-6 text-center border overflow-hidden relative"
            :class="result.profit >= 0 ? 'border-red-200 bg-red-50/30' : 'border-green-200 bg-green-50/30'"
          >
            <p class="text-xs text-stone-500 uppercase tracking-wide mb-1">預估淨損益</p>
            <p
              class="text-3xl font-bold font-mono tracking-tight"
              :class="result.profit >= 0 ? 'text-red-500' : 'text-green-500'"
            >
              {{ result.profit >= 0 ? '+' : '' }}{{ fmt(result.profit) }}
            </p>
            <p class="text-sm font-medium mt-1" :class="result.profit >= 0 ? 'text-red-700' : 'text-green-700'">
              報酬率 {{ result.roi }}%
            </p>

            <!-- Detailed Breakdown -->
            <div class="mt-6 grid grid-cols-2 gap-4 text-left text-xs text-stone-500 bg-white/60 p-3 rounded-lg">
              <div>
                <span class="block">買進總成本</span>
                <span class="font-bold text-stone-700 font-mono">{{ fmt(result.totalBuyCost) }}</span>
              </div>
              <div>
                <span class="block">賣出總收入</span>
                <span class="font-bold text-stone-700 font-mono">{{ fmt(result.totalSellRevenue) }}</span>
              </div>
              <div>
                <span class="block">手續費 (買+賣)</span>
                <span class="font-bold text-stone-700 font-mono">{{ fmt(result.totalFee) }}</span>
              </div>
              <div>
                <span class="block">交易稅</span>
                <span class="font-bold text-stone-700 font-mono">{{ fmt(result.tax) }}</span>
              </div>
              <div
                v-if="result.totalDividend > 0"
                class="col-span-2 bg-yellow-50 p-2 rounded border border-yellow-100 mt-1"
              >
                <span class="block text-yellow-700">股利總收入 (現金+股票市值)</span>
                <span class="font-bold text-yellow-700 font-mono">+{{ fmt(result.totalDividend) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="mode === 'breakeven'" class="pt-4 border-t border-stone-100">
          <div class="bg-stone-50 rounded-xl p-6 text-center border border-indigo-100 bg-indigo-50/30">
            <p class="text-xs text-stone-500 uppercase tracking-wide mb-1">損益平衡價</p>
            <p class="text-3xl font-bold font-mono tracking-tight text-indigo-900">
              {{ fmt(breakevenPrice) }}
            </p>
            <p class="text-sm text-stone-500 mt-2">
              高於此價格賣出即獲利<br />
              <span class="text-xs opacity-70">(已含買賣手續費與交易稅)</span>
            </p>
          </div>
        </div>

        <!-- DCA / Avg Cost Mode -->
        <div v-else-if="mode === 'avg'" class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="flex-shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="16" y2="12" />
              <line x1="12" x2="12.01" y1="8" y2="8" />
            </svg>
            <p>輸入多次買進紀錄，自動計算加權平均成本與損益平衡點。</p>
          </div>

          <div class="space-y-3">
            <div v-for="(rec, idx) in dcaRecords" :key="idx" class="flex gap-2 items-end">
              <div class="flex-1">
                <label class="block text-xs font-semibold text-stone-500 mb-1">買進價格</label>
                <input
                  type="number"
                  v-model.number="rec.price"
                  placeholder="價格"
                  class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-semibold text-stone-500 mb-1">股數</label>
                <input
                  type="number"
                  v-model.number="rec.qty"
                  placeholder="股數"
                  class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                @click="removeRecord(idx)"
                class="mb-1 p-2 text-stone-400 hover:text-red-500"
                title="刪除"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            <button
              @click="addRecord"
              class="w-full py-2 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:bg-stone-50 hover:text-stone-700 font-medium text-sm transition-colors"
            >
              + 新增買入紀錄
            </button>
          </div>

          <div class="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
            <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <span class="block text-stone-500 text-xs mb-1">加權平均價</span>
              <span class="block text-2xl font-bold text-blue-800 font-mono">{{ fmt(dcaResult.avgPrice) }}</span>
            </div>
            <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <span class="block text-stone-500 text-xs mb-1">累積總股數</span>
              <span class="block text-2xl font-bold text-stone-700 font-mono">{{ fmt(dcaResult.totalQty) }}</span>
            </div>
            <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <span class="block text-stone-500 text-xs mb-1">總投入成本</span>
              <span class="block text-lg font-bold text-stone-700 font-mono">{{ fmt(dcaResult.totalCost) }}</span>
            </div>
            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <span class="block text-indigo-600/80 text-xs mb-1">損益平衡價</span>
              <span class="block text-lg font-bold text-indigo-800 font-mono">{{ fmt(dcaResult.breakeven) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const mode = ref('profit');
const showSettings = ref(false);

const settings = ref({
  discount: 6,
  minFee: 20,
});

const stockTypes = [
  { id: 'common', label: '一般現股', tax: 0.003 },
  { id: 'daytrade', label: '現股當沖', tax: 0.0015 },
  { id: 'etf', label: 'ETF', tax: 0.001 },
];
const stockType = ref('common');

const buyPrice = ref(100);
const sellPrice = ref(105);
const qty = ref(1000);

const showDividends = ref(false);
const cashDividend = ref(0);
const stockDividend = ref(0);

const dcaRecords = ref([
  { price: 100, qty: 1000 },
  { price: 95, qty: 1000 },
]);

const addRecord = () => dcaRecords.value.push({ price: '', qty: '' });
const removeRecord = (i) => dcaRecords.value.splice(i, 1);

const fmt = (n) => (n ? n.toLocaleString('zh-TW', { maximumFractionDigits: 2 }) : '0');

const userSettings = computed(() => {
  const d = parseFloat(settings.value.discount);
  return {
    discountFactor: (d || 10) / 10,
    minFee: parseInt(settings.value.minFee) || 0,
  };
});

const calculateFee = (amount) => {
  const rawFee = amount * 0.001425;
  const discountedFee = Math.floor(rawFee * userSettings.value.discountFactor);
  return Math.max(userSettings.value.minFee, discountedFee);
};

const result = computed(() => {
  const bp = buyPrice.value || 0;
  const sp = sellPrice.value || 0;
  const q = qty.value || 0;
  const taxRate = stockTypes.find((t) => t.id === stockType.value).tax;

  const buyAmt = bp * q;
  const buyFee = calculateFee(buyAmt);
  const totalBuyCost = buyAmt + buyFee;

  const totalCashDiv = cashDividend.value * q;
  const newShares = q * (stockDividend.value / 10);

  const totalQtySold = q + newShares;
  const realSellAmt = sp * totalQtySold;
  const realSellFee = calculateFee(realSellAmt);
  const realSellTax = Math.floor(realSellAmt * taxRate);
  const realTotalSellRevenue = realSellAmt - realSellFee - realSellTax;

  const realProfit = realTotalSellRevenue - totalBuyCost + totalCashDiv;
  const realRoi = totalBuyCost > 0 ? (realProfit / totalBuyCost) * 100 : 0;

  return {
    profit: realProfit,
    roi: realRoi.toFixed(2),
    totalBuyCost,
    totalSellRevenue: realTotalSellRevenue,
    totalFee: buyFee + realSellFee,
    tax: realSellTax,
    totalDividend: totalCashDiv, // Display cash dividend part mainly or combining is fine.
    // The original logic included stock div value in profit but displayed cash+stock value.
    // Simplifying display for now as per original code structure.
    totalDividend: totalCashDiv + newShares * sp,
  };
});

const breakevenPrice = computed(() => {
  const bp = buyPrice.value || 0;
  const q = qty.value || 0;
  if (q === 0) return 0;
  const taxRate = stockTypes.find((t) => t.id === stockType.value).tax;
  const buyAmt = bp * q;
  const buyFee = calculateFee(buyAmt);
  const totalBuyCost = buyAmt + buyFee;
  const factor = 0.001425 * userSettings.value.discountFactor + taxRate;
  let estimatedPrice = totalBuyCost / (q * (1 - factor));
  return Math.ceil(estimatedPrice * 100) / 100;
});

const dcaResult = computed(() => {
  let totalQ = 0;
  let totalC = 0;

  dcaRecords.value.forEach((r) => {
    const p = Number(r.price) || 0;
    const q = Number(r.qty) || 0;
    if (q > 0) {
      const amt = p * q;
      const fee = calculateFee(amt);
      totalQ += q;
      totalC += amt + fee;
    }
  });

  const avg = totalQ > 0 ? totalC / totalQ : 0;
  const taxRate = stockTypes.find((t) => t.id === stockType.value).tax;
  const factor = 0.001425 * userSettings.value.discountFactor + taxRate;
  const be = totalQ > 0 ? totalC / (totalQ * (1 - factor)) : 0;

  return {
    totalQty: totalQ,
    totalCost: totalC,
    avgPrice: avg,
    breakeven: Math.ceil(be * 100) / 100,
  };
});

onMounted(() => {
  const savedSettings = localStorage.getItem('taicalc_stock_settings');
  if (savedSettings) {
    try {
      settings.value = JSON.parse(savedSettings);
    } catch (e) {}
  }
  const savedRecords = localStorage.getItem('taicalc_stock_dca_records');
  if (savedRecords) {
    try {
      dcaRecords.value = JSON.parse(savedRecords);
    } catch (e) {}
  }
});

watch(
  settings,
  (newVal) => {
    localStorage.setItem('taicalc_stock_settings', JSON.stringify(newVal));
  },
  { deep: true }
);

watch(
  dcaRecords,
  (newVal) => {
    localStorage.setItem('taicalc_stock_dca_records', JSON.stringify(newVal));
  },
  { deep: true }
);
</script>

<style scoped>
.tab-btn {
  position: relative;
  transition: all 0.3s ease;
}
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ef4444;
}
</style>
