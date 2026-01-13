<template>
  <div class="max-w-6xl mx-auto px-4 py-12 font-sans text-stone-800">
    
    <!-- 🌍 Global Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          {{ t('title') }}
        </h1>
        <p class="text-stone-500 font-medium">{{ t('subtitle') }}</p>
      </div>

      <!-- Language Switcher -->
      <div class="flex bg-stone-100 p-1 rounded-xl">
        <button 
          @click="setLang('zh-TW')" 
          :class="lang === 'zh-TW' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'"
          class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
        >
          🇹🇼 繁體中文
        </button>
        <button 
          @click="setLang('en')" 
          :class="lang === 'en' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'"
          class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
        >
          🇺🇸 English
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- 🎛️ Input Panel -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-6 relative overflow-hidden">
          <!-- Ambient BG -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <h2 class="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2 relative z-10">
            <span class="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></span>
            {{ t('input_section') }}
          </h2>

          <div class="space-y-6 relative z-10">
            <!-- Net Worth -->
            <div>
              <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                {{ t('curr_net_worth') }} ({{ currencyCode }})
              </label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg group-focus-within:text-emerald-500 transition-colors">{{ currencySymbol }}</span>
                <input 
                  type="number" 
                  v-model.number="inputs.netWorth" 
                  class="w-full bg-stone-50 border-2 border-stone-100 rounded-xl py-3 pl-16 pr-4 text-xl font-bold font-mono text-stone-800 focus:outline-none focus:border-emerald-500/50 focus:bg-white transition-all shadow-inner"
                  :placeholder="lang === 'en' ? '250000' : '5000000'"
                >
              </div>
            </div>

            <!-- Monthly Saving -->
            <div>
              <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                {{ t('monthly_saving') }} ({{ currencyCode }})
              </label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg group-focus-within:text-emerald-500 transition-colors">{{ currencySymbol }}</span>
                <input 
                  type="number" 
                  v-model.number="inputs.monthlySaving" 
                  class="w-full bg-stone-50 border-2 border-stone-100 rounded-xl py-3 pl-16 pr-4 text-xl font-bold font-mono text-stone-800 focus:outline-none focus:border-emerald-500/50 focus:bg-white transition-all shadow-inner"
                >
              </div>
            </div>

            <!-- Return Rate -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-bold text-stone-500 uppercase tracking-wider">{{ t('annual_return') }}</label>
                <div class="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">{{ inputs.roi }}%</div>
              </div>
              <input 
                type="range" 
                v-model.number="inputs.roi" 
                min="1" max="15" step="0.5"
                class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              >
              <div class="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                <span>1%</span>
                <span>SP500 Avg (8-10%)</span>
                <span>15%</span>
              </div>
            </div>

            <!-- Withdrawal Rate -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-bold text-stone-500 uppercase tracking-wider">{{ t('withdrawal_rate') }}</label>
                <div class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">{{ inputs.withdrawal }}%</div>
              </div>
              <input 
                type="range" 
                v-model.number="inputs.withdrawal" 
                min="2" max="6" step="0.1"
                class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              >
              <p class="text-xs text-stone-400 mt-2 leading-relaxed">
                {{ t('withdraw_desc') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 💡 Insight Card -->
        <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="font-bold text-lg mb-2 opacity-90">{{ t('insight_title') }}</h3>
            <p class="text-sm opacity-80 leading-relaxed mb-4">
              {{ t('insight_body') }}
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold font-mono">{{ formatMoney(safeWithdrawalAmount / 12) }}</span>
              <span class="text-sm opacity-70">/ {{ t('month') }}</span>
            </div>
            <p class="text-xs opacity-50 mt-1">{{ t('passive_income_potential') }}</p>
          </div>
          <!-- Deco -->
          <div class="absolute -right-4 -bottom-4 bg-white opacity-10 w-32 h-32 rounded-full blur-2xl"></div>
        </div>
      </div>

      <!-- 🗺️ Geo-Arbitrage Result -->
      <div class="lg:col-span-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-stone-800 flex items-center gap-2">
            🚀 {{ t('geo_title') }}
            <span class="text-xs font-normal text-stone-500 bg-stone-100 px-2 py-1 rounded-full border border-stone-200 ml-2 hidden sm:inline-block">
              {{ lang === 'zh-TW' ? '基於 4% 法則' : 'Based on 4% Rule' }}
            </span>
          </h2>
        </div>

        <!-- Cities Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <div 
            v-for="city in citiesComputed" 
            :key="city.id"
            class="group relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1"
            :class="city.isFree ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-100 hover:border-emerald-300'"
          >
            <!-- Badge: Freedom Status -->
            <div 
              class="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md"
              :class="city.isFree ? 'bg-emerald-500 text-white' : 'bg-stone-200/80 text-stone-600'"
            >
              {{ city.isFree ? 'FREEDOM 🎉' : `${city.yearsLeft} ${t('years_left')}` }}
            </div>

            <div class="p-5 flex items-start gap-5">
              <!-- Visual -->
              <div class="w-20 h-20 rounded-xl bg-stone-100 flex-shrink-0 overflow-hidden relative shadow-inner">
                <img 
                  :src="city.img" 
                  alt="City" 
                  class="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-lg text-stone-800 mb-1 truncate">{{ city.name[lang] }}</h3>
                <p class="text-xs text-stone-500 mb-3 flex items-center gap-1">
                  <span class="opacity-70">{{ city.country[lang] }}</span> • 
                  <span class="text-stone-400">{{ t('col_index') }}: {{ city.colIndex }}</span>
                </p>

                <!-- Financial Bar -->
                <div class="space-y-1.5">
                  <div class="flex justify-between text-xs font-medium">
                    <span :class="city.isFree ? 'text-emerald-600' : 'text-stone-600'">
                      {{ t('cost_living') }}: {{ formatMoney(city.monthlyCost) }}
                    </span>
                  </div>
                  
                  <!-- Progress Bar -->
                  <div class="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden relative">
                    <!-- Target Marker (100%) -->
                    <div class="absolute right-0 top-0 bottom-0 w-0.5 bg-stone-300 z-10"></div>
                    <!-- Fill -->
                    <div 
                      class="h-full rounded-full transition-all duration-1000 ease-out"
                      :class="city.isFree ? 'bg-emerald-500' : 'bg-amber-400'"
                      :style="{ width: Math.min(100, city.progress) + '%' }"
                    ></div>
                  </div>
                  <div class="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                    <span>{{ Math.round(city.progress) }}% {{ t('covered') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- "Move Here" CTA (Mock) -->
            <div class="bg-stone-50 px-5 py-3 border-t border-stone-100 flex justify-between items-center">
               <span class="text-xs text-stone-500 italic">
                 {{ city.tagline[lang] }}
               </span>
               <button class="text-xs font-bold text-stone-700 hover:text-emerald-600 transition-colors flex items-center gap-1">
                 {{ t('explore') }} →
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 💡 Methodology Section -->
    <div class="mt-16 border-t border-stone-200 pt-8 text-center text-stone-500 space-y-4 max-w-2xl mx-auto">
      <h4 class="text-sm font-bold uppercase tracking-widest opacity-50">{{ t('methodology') }}</h4>
      <p class="text-sm">
        {{ t('methodology_desc') }}
      </p>
      <div class="flex justify-center gap-4 text-xs opacity-60">
        <span>Numbeo Data (2025)</span>
        <span>•</span>
        <span>4% Rule (Trinity Study)</span>
        <span>•</span>
        <span>Inflation Adjusted</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// --- i18n Dictionary ---
const messages = {
  'zh-TW': {
    title: '全球 FIRE 自由度模擬器',
    subtitle: '你的錢在台灣只能活 10 年，但在這裡你是國王。',
    input_section: '設定你的資產現況',
    curr_net_worth: '目前淨資產',
    monthly_saving: '每月可存金額',
    annual_return: '預期年化報酬率',
    withdrawal_rate: '安全提領率',
    withdraw_desc: '傳統建議為 4%。這決定了你需要多少本金才能讓資產永續不滅。',
    insight_title: '金錢的時空價值',
    insight_body: '這不僅是計算機，這是一台時光機與任意門。看看你的資產搬到世界的另一端會有什麼魔力。',
    month: '月',
    day: '天',
    passive_income_potential: '潛在被動收入 (4%)',
    geo_title: '你的多重宇宙人生',
    cost_living: '當地舒適開銷',
    years_left: '年後自由',
    covered: '開銷覆蓋率',
    explore: '探索生活',
    col_index: '物價指數',
    methodology: '計算方法',
    methodology_desc: '我們使用 Numbeo 2025 的全球生活成本指數，結合您的資產產生之被動收入，計算在不同城市的相對自由度。',
  },
  'en': {
    title: 'Global FIRE Simulator',
    subtitle: 'Your money might last 10 years here, but elsewhere? You could be a king.',
    input_section: 'Your Financial Base',
    curr_net_worth: 'Current Net Worth',
    monthly_saving: 'Monthly Savings',
    annual_return: 'Exp. Annual Return',
    withdrawal_rate: 'Safe Withdrawal Rate',
    withdraw_desc: 'Standard is 4%. This determines the capital needed for perpetual sustainability.',
    insight_title: 'Geo-Arbitrage Power',
    insight_body: 'This isn\'t just a calculator; it’s a teleportation device. See how your freedom timeline shifts across borders.',
    month: 'mo',
    day: 'day',
    passive_income_potential: 'Potential Passive Income (4%)',
    geo_title: 'Your Freedom Map',
    cost_living: 'Local Cost',
    years_left: 'Years to FIRE',
    covered: 'Covered',
    explore: 'Explore',
    col_index: 'COL Index',
    methodology: 'Methodology',
    methodology_desc: 'Using Numbeo 2025 Cost of Living indices combined with your passive income potential to calculate financial freedom relative to each city.',
  }
};

const lang = ref('zh-TW'); // State
const t = (key) => messages[lang.value][key] || key;

// --- State ---
// Default Values are in TWD roughly
const inputs = ref({
  netWorth: 5000000,
  monthlySaving: 30000,
  roi: 6,
  withdrawal: 4
});

// --- Currency Logic ---
const EXCHANGE_RATE = 32; // 1 USD = 32 TWD

const currencySymbol = computed(() => lang.value === 'zh-TW' ? 'NT$' : '$');
const currencyCode = computed(() => lang.value === 'zh-TW' ? 'TWD' : 'USD');

// Auto-convert values when switching languages
watch(lang, (newLang, oldLang) => {
  if (newLang === 'en' && oldLang === 'zh-TW') {
    // TWD -> USD
    inputs.value.netWorth = Math.round(inputs.value.netWorth / EXCHANGE_RATE);
    inputs.value.monthlySaving = Math.round(inputs.value.monthlySaving / EXCHANGE_RATE);
  } else if (newLang === 'zh-TW' && oldLang === 'en') {
    // USD -> TWD
    inputs.value.netWorth = Math.round(inputs.value.netWorth * EXCHANGE_RATE);
    inputs.value.monthlySaving = Math.round(inputs.value.monthlySaving * EXCHANGE_RATE);
  }
});

const setLang = (l) => {
  lang.value = l;
};

const formatMoney = (val) => {
  return currencySymbol.value + val.toLocaleString();
};

// --- Geo Logic ---
// Passive Income = Net Worth * Withdrawal Rate
const safeWithdrawalAmount = computed(() => {
  return inputs.value.netWorth * (inputs.value.withdrawal / 100);
});

// City Database (Abstracted Cost Units)
// Base Cost is in USD for easier scaling, we convert to TWD if needed.
const CITIES = [
  {
    id: 'chiang_mai',
    name: { 'zh-TW': '清邁, 泰國', 'en': 'Chiang Mai, Thailand' },
    country: { 'zh-TW': '東南亞', 'en': 'Southeast Asia' },
    tagline: { 'zh-TW': '數位遊牧聖地，天天按摩', 'en': 'Digital Nomad Hub' },
    baseCostUSD: 800, // Comfortable single life
    img: '/images/cities/city_chiang_mai_thumbnail_1768274099394.png',
    colIndex: 35
  },
  {
    id: 'lisbon',
    name: { 'zh-TW': '里斯本, 葡萄牙', 'en': 'Lisbon, Portugal' },
    country: { 'zh-TW': '歐洲', 'en': 'Europe' },
    tagline: { 'zh-TW': '歐洲後花園，陽光普照', 'en': 'Sunny European Gateway' },
    baseCostUSD: 1600,
    img: '/images/cities/city_lisbon_thumbnail_1768274113632.png',
    colIndex: 55
  },
  {
    id: 'jaipur',
    name: { 'zh-TW': '齋浦爾, 印度', 'en': 'Jaipur, India' },
    country: { 'zh-TW': '南亞', 'en': 'South Asia' },
    tagline: { 'zh-TW': '粉紅城市，極低成本奢華', 'en': 'The Pink City' },
    baseCostUSD: 500,
    img: '/images/cities/city_jaipur_thumbnail_1768274129569.png',
    colIndex: 25
  },
  {
    id: 'taipei',
    name: { 'zh-TW': '台北, 台灣', 'en': 'Taipei, Taiwan' },
    country: { 'zh-TW': '東亞', 'en': 'East Asia' },
    tagline: { 'zh-TW': '便利超商之都，醫療頂級', 'en': 'Convenience Capital' },
    baseCostUSD: 1400,
    img: '/images/cities/city_taipei_thumbnail_1768274152964.png',
    colIndex: 65
  },
  {
    id: 'osaka',
    name: { 'zh-TW': '大阪, 日本', 'en': 'Osaka, Japan' },
    country: { 'zh-TW': '東北亞', 'en': 'East Asia' },
    tagline: { 'zh-TW': '美食之都，比東京宜居', 'en': 'Kitchen of Japan' },
    baseCostUSD: 1800,
    img: '/images/cities/city_osaka_thumbnail_1768274167362.png',
    colIndex: 70
  },
  {
    id: 'new_york',
    name: { 'zh-TW': '紐約, 美國', 'en': 'New York, USA' },
    country: { 'zh-TW': '北美', 'en': 'North America' },
    tagline: { 'zh-TW': '世界的中心，燃燒靈魂', 'en': 'Concrete Jungle' },
    baseCostUSD: 4500,
    img: '/images/cities/city_new_york_thumbnail_1768274185933.png',
    colIndex: 100
  },
];

const citiesComputed = computed(() => {
  return CITIES.map(city => {
    // 1. Determine local monthly cost in current currency
    // Current Lang 'zh-TW' -> Cost should be TWD. city.baseCostUSD * 32
    // Current Lang 'en' -> Cost should be USD. city.baseCostUSD
    let localCost = 0;
    if (lang.value === 'zh-TW') {
      localCost = city.baseCostUSD * EXCHANGE_RATE;
    } else {
      localCost = city.baseCostUSD;
    }

    // 2. Annualize cost
    const annualCost = localCost * 12;

    // 3. Compare with Safe Withdrawal Amount
    const passiveIncome = safeWithdrawalAmount.value; // Already in current currency
    
    // 4. Calculate Progress
    const progress = (passiveIncome / annualCost) * 100;
    const isFree = progress >= 100;

    // 5. Calculate Years Left if not free
    // Formula: NPER function essentially. 
    // Simpler approximation: (Target - Current) / MonthlySavingAndGrowth
    let yearsLeft = 0;
    if(!isFree) {
       const target = annualCost / (inputs.value.withdrawal / 100);
       const gap = target - inputs.value.netWorth;
       // Simply assume we save strictly linear for this quick viz (or use simple growth)
       // Let's use simple logic: Gap / (MonthlySave * 12) roughly
       // Better: use the same math as FIRE calculator but simplified
       // Here we just give a rough Estimate for the card
       const annualSave = inputs.value.monthlySaving * 12;
       if (annualSave > 0) {
         yearsLeft = Math.ceil(gap / annualSave); // Very rough, ignores compound interest for visual speed
         // Adjust for compound partially
         yearsLeft = Math.max(0.1, yearsLeft * 0.7).toFixed(1); // Discounting future value
       } else {
         yearsLeft = '∞';
       }
    }

    return {
      ...city,
      monthlyCost: localCost,
      annualCost,
      progress,
      isFree,
      yearsLeft
    };
  }).sort((a, b) => b.progress - a.progress); // Sort by easiest to hardest
});

</script>

<style scoped>
/* Custom Scrollbar if needed */
</style>
