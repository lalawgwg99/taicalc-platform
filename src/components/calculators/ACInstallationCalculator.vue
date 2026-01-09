<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- 1. 規格與路徑 -->
    <div class="card bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <h2 class="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
        <span class="w-1 h-5 bg-sky-500 rounded-full"></span>
        1. 規格與路徑
      </h2>

      <div class="space-y-6">
        <!-- 銅管規格 -->
        <div>
          <label class="block text-sm font-bold text-stone-700 mb-2">銅管規格</label>
          <div class="relative">
            <select
              v-model="specPair"
              class="w-full bg-stone-50 border border-stone-200 text-stone-800 text-lg font-bold rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            >
              <option value="2-3">2 分 / 3 分</option>
              <option value="2-4">2 分 / 4 分</option>
              <option value="2-5">2 分 / 5 分</option>
              <option value="3-5">3 分 / 5 分</option>
              <option value="3-6">3 分 / 6 分</option>
              <option value="4-6">4 分 / 6 分</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-stone-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 走線長度 -->
        <div>
          <label class="block text-sm font-bold text-stone-700 mb-2">走線長度 (米)</label>
          <div class="flex items-center gap-3">
            <button
              @click="pathM = Math.max(0, pathM - 1)"
              class="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 active:bg-stone-300 transition-colors text-xl font-bold"
            >
              -
            </button>
            <div class="flex-1 relative">
              <input
                type="number"
                v-model.number="pathM"
                class="w-full text-center bg-white border-2 border-stone-100 text-stone-800 text-2xl font-bold rounded-xl px-2 py-2 focus:outline-none focus:border-sky-500 transition-all placeholder-stone-300"
                placeholder="0"
              />
            </div>
            <button
              @click="pathM++"
              class="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 active:bg-stone-300 transition-colors text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <!-- 進階參數 -->
        <div class="pt-2">
          <button
            @click="showAdvancedSpecs = !showAdvancedSpecs"
            class="flex items-center gap-2 text-sm text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
          >
            <span>{{ showAdvancedSpecs ? '▼' : '▶' }} 進階參數 (彎頭、預留端)</span>
          </button>

          <div v-show="showAdvancedSpecs" class="grid grid-cols-1 gap-4 mt-4 bg-stone-50 p-4 rounded-xl">
            <!-- 彎頭 -->
            <div>
              <label class="block text-xs font-bold text-stone-500 mb-1.5">彎頭數量</label>
              <div class="flex items-center gap-3">
                <button
                  @click="bends = Math.max(0, bends - 1)"
                  class="w-10 h-10 rounded-lg bg-white border border-stone-200 shadow-sm text-lg font-bold text-stone-600"
                >
                  -
                </button>
                <input
                  type="number"
                  v-model.number="bends"
                  class="flex-1 min-w-0 text-center bg-transparent font-bold text-lg"
                />
                <button
                  @click="bends++"
                  class="w-10 h-10 rounded-lg bg-white border border-stone-200 shadow-sm text-lg font-bold text-stone-600"
                >
                  +
                </button>
              </div>
              <div class="mt-2 flex items-center gap-2 justify-center">
                <span class="text-[10px] text-stone-400">單個消耗</span>
                <input
                  type="number"
                  v-model.number="perBendCm"
                  class="w-12 text-center text-xs bg-white border border-stone-200 rounded px-1 py-0.5"
                />
                <span class="text-[10px] text-stone-400">cm</span>
              </div>
            </div>
            <!-- 預留 -->
            <div>
              <label class="block text-xs font-bold text-stone-500 mb-1.5">預留端數</label>
              <div class="flex items-center gap-3">
                <button
                  @click="ends = Math.max(0, ends - 1)"
                  class="w-10 h-10 rounded-lg bg-white border border-stone-200 shadow-sm text-lg font-bold text-stone-600"
                >
                  -
                </button>
                <input
                  type="number"
                  v-model.number="ends"
                  class="flex-1 min-w-0 text-center bg-transparent font-bold text-lg"
                />
                <button
                  @click="ends++"
                  class="w-10 h-10 rounded-lg bg-white border border-stone-200 shadow-sm text-lg font-bold text-stone-600"
                >
                  +
                </button>
              </div>
              <div class="mt-2 flex items-center gap-2 justify-center">
                <span class="text-[10px] text-stone-400">單端預留</span>
                <input
                  type="number"
                  v-model.number="endLenCm"
                  class="w-12 text-center text-xs bg-white border border-stone-200 rounded px-1 py-0.5"
                />
                <span class="text-[10px] text-stone-400">cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 flex items-baseline gap-2 text-stone-400 text-xs px-2">
        <span>預估裁切:</span>
        <span class="font-mono font-bold text-stone-600 text-sm">{{ displayTotalLen }}m</span>
        <span class="text-[10px] opacity-70">(含損耗與預留)</span>
      </div>
    </div>

    <!-- 2. 線材庫存成本 -->
    <div class="card bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <h2 class="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
        <span class="w-1 h-5 bg-sky-500 rounded-full"></span>
        2. 線材庫存成本
      </h2>

      <div class="space-y-4">
        <!-- 銅管價格 -->
        <div class="p-4 bg-stone-50 rounded-xl border border-stone-100">
          <div class="flex justify-between items-end mb-2">
            <label class="block text-sm font-bold text-stone-700">銅管整箱價</label>
            <span v-if="priceKit && boxLen" class="text-xs text-stone-500 font-mono">
              ≈ ${{ Math.round(priceKit / boxLen) }}/m
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-stone-400 text-lg">$</span>
            <input
              type="number"
              v-model.number="priceKit"
              class="flex-1 input-base text-xl p-2 font-bold text-stone-800 placeholder-stone-300 bg-white"
              placeholder="輸入箱價"
            />
          </div>
          <div class="mt-2 flex items-center gap-2 text-xs text-stone-400">
            <span>整箱長度:</span>
            <input
              type="number"
              v-model.number="boxLen"
              class="w-16 text-center border-b border-stone-300 focus:border-sky-500 outline-none bg-transparent text-stone-600 font-bold"
              placeholder="30"
            />
            <span>m</span>
          </div>
        </div>

        <!-- 其他耗材 -->
        <div>
          <button
            @click="showOtherMats = !showOtherMats"
            class="w-full text-left flex items-center justify-between text-sm font-bold text-emerald-600 hover:text-emerald-700 py-2"
          >
            <span>其他線材 (訊號/電源/保溫)</span>
            <span class="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">{{
              showOtherMats ? '收起' : '展開'
            }}</span>
          </button>

          <div v-show="showOtherMats" class="grid grid-cols-3 gap-3 mt-2 bg-stone-50 p-3 rounded-xl">
            <div class="bg-white p-2 rounded-lg border border-stone-200 shadow-sm">
              <label class="block text-[10px] text-stone-500 mb-1 font-bold text-center">訊號線</label>
              <input
                type="number"
                v-model.number="priceSig"
                class="w-full text-center bg-transparent text-sm font-bold"
                placeholder="$"
              />
            </div>
            <div class="bg-white p-2 rounded-lg border border-stone-200 shadow-sm">
              <label class="block text-[10px] text-stone-500 mb-1 font-bold text-center">電源線</label>
              <input
                type="number"
                v-model.number="pricePwr"
                class="w-full text-center bg-transparent text-sm font-bold"
                placeholder="$"
              />
            </div>
            <div class="bg-white p-2 rounded-lg border border-stone-200 shadow-sm">
              <label class="block text-[10px] text-stone-500 mb-1 font-bold text-center">保溫材</label>
              <input
                type="number"
                v-model.number="priceInsu"
                class="w-full text-center bg-transparent text-sm font-bold"
                placeholder="$"
              />
            </div>
            <p class="col-span-3 text-[10px] text-center text-stone-300 mt-1">* 輸入整箱價格，自動按比例分攤</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 冷媒追加 -->
    <div class="card bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-stone-800 flex items-center gap-2">
          <span class="w-1 h-5 bg-sky-500 rounded-full"></span>
          3. 冷媒追加
        </h2>
        <span
          :class="[
            'text-xs font-bold px-3 py-1.5 rounded-full transition-colors',
            gasAdded ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400',
          ]"
        >
          {{ gasAdded ? '需追加' : '標準內' }}
        </span>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold text-stone-500 mb-1.5 text-center">免填標準</label>
          <div class="relative">
            <input type="number" v-model.number="gasLimit" class="input-base w-full text-center p-2 font-bold" />
            <span class="absolute right-1 top-2.5 text-stone-400 text-[10px]">m</span>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 mb-1.5 text-center">每米追加</label>
          <div class="relative">
            <input type="number" v-model.number="gasRate" class="input-base w-full text-center p-2 font-bold" />
            <span class="absolute right-1 top-2.5 text-stone-400 text-[10px]">g</span>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 mb-1.5 text-center">冷媒單價</label>
          <div class="relative">
            <input
              type="number"
              v-model.number="gasPrice"
              class="input-base w-full text-center p-2 font-bold"
              step="0.5"
            />
            <span class="absolute right-1 top-2.5 text-stone-400 text-[10px]">$/g</span>
          </div>
        </div>
      </div>

      <div
        v-if="gasAdded"
        class="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between"
      >
        <div class="text-sm text-amber-800 font-bold">
          <div>超長 +{{ (pathM - gasLimit).toFixed(1) }}m</div>
          <div class="text-xs font-normal opacity-80 mt-0.5">補 {{ gasExtraG }}g × ${{ gasPrice }}</div>
        </div>
        <div class="text-xl font-bold text-amber-600 font-mono">+${{ gasCost.toLocaleString() }}</div>
      </div>
    </div>

    <!-- 明細 -->
    <div class="card bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <h2 class="text-lg font-bold text-stone-800 mb-4">費用明細</h2>
      <div class="space-y-3 text-sm text-stone-600">
        <div class="flex justify-between items-center py-1 border-b border-stone-100">
          <span>規格</span>
          <span class="font-bold text-stone-800">{{ specPair }}</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-stone-100">
          <span>裁切總長</span>
          <span class="font-mono">{{ displayTotalLen }}m</span>
        </div>

        <div v-if="boxLen && priceKit" class="flex justify-between items-center py-1">
          <span>銅管分攤</span>
          <span class="font-mono">${{ Math.round(breakdown.kit).toLocaleString() }}</span>
        </div>
        <div v-if="priceSig" class="flex justify-between items-center py-1">
          <span>訊號線</span>
          <span class="font-mono">${{ Math.round(breakdown.sig).toLocaleString() }}</span>
        </div>
        <div v-if="pricePwr" class="flex justify-between items-center py-1">
          <span>電源線</span>
          <span class="font-mono">${{ Math.round(breakdown.pwr).toLocaleString() }}</span>
        </div>
        <div v-if="priceInsu" class="flex justify-between items-center py-1">
          <span>保溫材</span>
          <span class="font-mono">${{ Math.round(breakdown.insu).toLocaleString() }}</span>
        </div>

        <div
          v-if="gasAdded"
          class="flex justify-between items-center py-1 text-amber-600 font-bold mt-2 pt-2 border-t border-dashed border-stone-200"
        >
          <span>冷媒追加</span>
          <span class="font-mono">${{ gasCost.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Final Calculation Result -->
    <div
      class="card bg-stone-900 rounded-2xl p-6 shadow-lg shadow-stone-200 border border-stone-800 text-white relative overflow-hidden mb-8"
    >
      <div class="absolute -right-6 -top-6 w-32 h-32 bg-sky-500 rounded-full opacity-20 blur-2xl"></div>
      <div class="relative z-10 flex flex-col items-center justify-center text-center">
        <h3 class="text-sm font-bold text-stone-400 mb-1 uppercase tracking-wider">預估總成本 (含冷媒)</h3>
        <div class="text-4xl font-bold font-mono text-emerald-400 mb-2">${{ totalCost.toLocaleString() }}</div>

        <button
          @click="copyBreakdown"
          class="mt-4 flex items-center justify-center gap-2 bg-white text-stone-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-stone-100 active:bg-stone-200 transition-all shadow-lg active:scale-95"
        >
          <span v-if="copyStatus === 'idle'">📋 複製報價單</span>
          <span v-else class="text-emerald-600">✓ 已複製</span>
        </button>
      </div>
    </div>

    <!-- Market Data Toggle -->
    <div class="text-center mb-6">
      <button
        @click="showMarketData = !showMarketData"
        class="text-xs text-stone-400 hover:text-stone-600 flex items-center justify-center gap-1 mx-auto transition-colors"
      >
        <span v-if="!showMarketData">📈</span>
        <span>{{ showMarketData ? '隱藏即時行情' : '查看即時銅價與匯率' }}</span>
        <svg
          v-if="!showMarketData"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </div>

    <!-- Market Data Widget (TradingView) -->
    <div
      v-if="showMarketData"
      class="card bg-white rounded-2xl p-0 overflow-hidden shadow-sm border border-stone-200 mb-6 relative"
      style="height: 100px"
    >
      <div class="absolute inset-0 flex items-center justify-center text-xs text-stone-400 z-0 bg-stone-50">
        載入即時行情中...<br />(若無顯示，請確認網路或關閉擋廣告軟體)
      </div>
      <div ref="tvWidget" class="tradingview-widget-container" style="position: relative; z-index: 1"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

// Inputs
const specPair = ref('2-3');
const pathM = ref(5);
const bends = ref(2);
const perBendCm = ref(10);
const ends = ref(2);
const endLenCm = ref(20);

const boxLen = ref(30);
const priceKit = ref(5500);
const priceSig = ref(500);
const pricePwr = ref(1000);
const priceInsu = ref(null);

const gasLimit = ref(7);
const gasRate = ref(20);
const gasPrice = ref(2);

const copyStatus = ref('idle');
const showMarketData = ref(false);

// UI Toggles
const showAdvancedSpecs = ref(false);
const showOtherMats = ref(false);

const tvWidget = ref(null);

// Constants
const WASTE_RATE = 0.1;

// Computed
const displayTotalLen = computed(() => {
  const bendsM = (bends.value * perBendCm.value) / 100;
  const endsM = (ends.value * endLenCm.value) / 100;
  const wasteM = pathM.value * (1 + WASTE_RATE);
  return (wasteM + bendsM + endsM).toFixed(2);
});

const factor = computed(() => {
  const total = parseFloat(displayTotalLen.value);
  if (!boxLen.value) return 0;
  return total / boxLen.value;
});

const breakdown = computed(() => {
  const f = factor.value;
  return {
    kit: f * (priceKit.value || 0),
    sig: f * (priceSig.value || 0),
    pwr: f * (pricePwr.value || 0),
    insu: f * (priceInsu.value || 0),
  };
});

const gasAdded = computed(() => pathM.value > gasLimit.value);
const gasExtraG = computed(() => {
  if (!gasAdded.value) return 0;
  const over = pathM.value - gasLimit.value;
  return Math.ceil(over * gasRate.value);
});
const gasCost = computed(() => {
  return gasExtraG.value * gasPrice.value;
});

const totalCost = computed(() => {
  const mat = breakdown.value.kit + breakdown.value.sig + breakdown.value.pwr + breakdown.value.insu;
  return Math.round(mat + gasCost.value);
});

// Actions
const resetDefaults = () => {
  if (!confirm('確定重置所有設定？')) return;
  specPair.value = '2-3';
  pathM.value = 5;
  bends.value = 2;
  perBendCm.value = 10;
  ends.value = 2;
  endLenCm.value = 20;
  boxLen.value = 30;
  priceKit.value = 5500;
  priceSig.value = 500;
  pricePwr.value = 1000;
  priceInsu.value = null;
  gasLimit.value = 7;
  gasRate.value = 20;
  gasPrice.value = 2;
};

const copyBreakdown = async () => {
  if (totalCost.value === 0) return;

  const text = `【配管估價單】
規格: ${specPair.value}
走線: ${pathM.value}m (裁切約 ${displayTotalLen.value}m)
------------
材料成本:
${priceKit.value ? `- 銅管: $${Math.round(breakdown.value.kit)}` : ''}
${priceSig.value ? `- 訊號線: $${Math.round(breakdown.value.sig)}` : ''}
${pricePwr.value ? `- 電源線: $${Math.round(breakdown.value.pwr)}` : ''}
${priceInsu.value ? `- 保溫: $${Math.round(breakdown.value.insu)}` : ''}
${gasAdded.value ? `- 冷媒追加 (${gasExtraG.value}g): $${gasCost.value}` : ''}
------------
預估總成本: $${totalCost.value.toLocaleString()}`
    .trim()
    .replace(/^\s*[\r\n]/gm, '');

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value = 'copied';
    setTimeout(() => (copyStatus.value = 'idle'), 2000);
  } catch (e) {
    alert('複製失敗');
  }
};

// Persistence
const STORAGE_KEY = 'taicalc_ac_cost_v1';

watch(
  [
    specPair,
    pathM,
    bends,
    perBendCm,
    ends,
    endLenCm,
    boxLen,
    priceKit,
    priceSig,
    pricePwr,
    priceInsu,
    gasLimit,
    gasRate,
    gasPrice,
  ],
  () => {
    const state = {
      specPair: specPair.value,
      pathM: pathM.value,
      bends: bends.value,
      perBendCm: perBendCm.value,
      ends: ends.value,
      endLenCm: endLenCm.value,
      boxLen: boxLen.value,
      priceKit: priceKit.value,
      priceSig: priceSig.value,
      pricePwr: pricePwr.value,
      priceInsu: priceInsu.value,
      gasLimit: gasLimit.value,
      gasRate: gasRate.value,
      gasPrice: gasPrice.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  { deep: true }
);

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const s = JSON.parse(saved);
      if (s.specPair) specPair.value = s.specPair;
      if (s.pathM) pathM.value = s.pathM;
      if (s.bends) bends.value = s.bends;
      if (s.perBendCm) perBendCm.value = s.perBendCm;
      if (s.ends) ends.value = s.ends;
      if (s.endLenCm) endLenCm.value = s.endLenCm;
      if (s.boxLen) boxLen.value = s.boxLen;
      if (s.priceKit) priceKit.value = s.priceKit;
      if (s.priceSig) priceSig.value = s.priceSig;
      if (s.pricePwr) pricePwr.value = s.pricePwr;
      if (s.priceInsu) priceInsu.value = s.priceInsu;
      if (s.gasLimit) gasLimit.value = s.gasLimit;
      if (s.gasRate) gasRate.value = s.gasRate;
      if (s.gasPrice) gasPrice.value = s.gasPrice;
    } catch (e) {}
  }
});

// Load TradingView widget when toggled
watch(showMarketData, async (val) => {
  if (val) {
    await nextTick();
    if (tvWidget.value && !tvWidget.value.innerHTML) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: 'COMEX:HG1!', title: '銅期貨' },
          { description: 'USD/TWD', proName: 'FX_IDC:USDTWD' },
        ],
        showSymbolLogo: true,
        colorTheme: 'light',
        isTransparent: true,
        displayMode: 'regular',
        locale: 'zh_TW',
      });
      tvWidget.value.appendChild(script);
    }
  }
});
</script>

<style scoped>
.input-base {
  @apply bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder-stone-300;
}
</style>
