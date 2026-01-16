<template>
  <div class="max-w-6xl mx-auto px-4 py-12 font-sans text-stone-800">
    
    <!-- 🌍 Global Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {{ t('title') }}
            </h1>
            <span class="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full border border-emerald-200 uppercase tracking-wide">Beta 2.0</span>
        </div>
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
      
      <!-- 🎛️ Input & Config Panel -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Lifestyle Tier Selector -->
        <div class="bg-white rounded-3xl shadow-sm border border-stone-200 p-2 flex">
           <button 
             v-for="tier in ['survival', 'comfort', 'luxury']"
             :key="tier"
             @click="inputs.lifestyle = tier"
             class="flex-1 py-3 rounded-2xl text-sm font-bold transition-all relative overflow-hidden"
             :class="inputs.lifestyle === tier ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'"
           >
             {{ t('tier_' + tier) }}
           </button>
        </div>

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
            </div>
          </div>
        </div>

        <!-- 💡 Your Power Card -->
        <div class="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="font-bold text-lg mb-2 opacity-90">{{ t('your_passive_power') }}</h3>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-bold font-mono text-emerald-400">{{ formatMoney(safeWithdrawalAmount / 12) }}</span>
              <span class="text-sm opacity-70">/ {{ t('month') }}</span>
            </div>
             <p class="text-xs opacity-60 mb-4">{{ t('based_on_withdrawal', { rate: inputs.withdrawal }) }}</p>

            <div class="h-px bg-white/10 w-full mb-4"></div>
            
            <div class="flex justify-between items-center">
                <span class="text-sm opacity-80">{{ t('lifestyle_target') }}:</span>
                <span class="font-bold text-amber-400">{{ t('tier_' + inputs.lifestyle) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 🗺️ Geo-Arbitrage Engine -->
      <div class="lg:col-span-8">
        <!-- Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 class="text-xl font-bold text-stone-800 flex items-center gap-2">
            🚀 {{ t('geo_title') }}
          </h2>
          
          <div class="flex gap-2">
            <select v-model="sortBy" class="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2">
                <option value="freedom">{{ t('sort_freedom') }}</option>
                <option value="cost_low">{{ t('sort_cost_low') }}</option>
                <option value="safety">{{ t('sort_safety') }}</option>
            </select>
          </div>
        </div>

        <!-- City Cards Grid -->
        <div v-if="loading" class="text-center py-20 text-stone-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            Loading Global Database...
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="city in sortedCities" 
            :key="city.id"
            class="group bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            :class="city.isFree ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-stone-100 hover:border-emerald-300'"
          >
            <div class="p-4 flex flex-col h-full">
              <!-- Top Row: Image + Name + Badge -->
              <div class="flex items-start gap-4 mb-3">
                <!-- Visual -->
                <div class="w-16 h-16 rounded-xl bg-stone-100 flex-shrink-0 overflow-hidden relative shadow-inner">
                    <img 
                    :src="city.image" 
                    alt="City" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    >
                </div>

                <!-- Header Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start gap-2">
                        <div>
                            <h3 class="font-bold text-lg text-stone-800 leading-tight">{{ city.name[lang] || city.name.en }}</h3>
                            <p class="text-xs text-stone-500 mt-1">
                                {{ city.country[lang] || city.country.en }}
                            </p>
                        </div>
                    </div>
                </div>
              </div>

              <!-- Status Badge (Moved to own row/block for safety) -->
              <div class="mb-4">
                  <div 
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold w-full justify-between"
                    :class="city.isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'"
                  >
                    <span v-if="city.isFree">🎉 {{ t('status_freedom') }}</span>
                    <span v-else>📉 {{ t('status_gap') }}: -{{ formatMoney(city.monthlyGap) }}/{{ t('month_short') }}</span>
                    
                    <span class="text-[10px] opacity-80 font-normal">
                        {{ city.isFree ? t('surplus') : t('shortage') }}
                    </span>
                  </div>
              </div>

              <!-- Key Metrics -->
              <div class="grid grid-cols-3 gap-2 mb-4 text-[10px] text-stone-500">
                  <div class="bg-stone-50 rounded p-1.5 text-center border border-stone-100">
                      <div class="font-bold text-stone-700 text-xs">{{ city.indices.safety }}/100</div>
                      <div>{{ t('metric_safety') }}</div>
                  </div>
                  <div class="bg-stone-50 rounded p-1.5 text-center border border-stone-100">
                      <div class="font-bold text-stone-700 text-xs">{{ city.indices.weather }}/100</div>
                      <div>{{ t('metric_weather') }}</div>
                  </div>
                  <div class="bg-stone-50 rounded p-1.5 text-center border border-stone-100">
                      <div class="font-bold text-stone-700 text-xs">{{ city.indices.internet }}M</div>
                      <div>{{ t('metric_internet') }}</div>
                  </div>
              </div>

              <!-- Progress Section (Pushed to bottom) -->
              <div class="mt-auto space-y-2">
                <div class="flex justify-between text-xs font-medium items-end">
                    <span class="text-stone-500">
                        {{ t('target_label') }}: <span class="text-stone-800 font-bold">{{ formatMoney(city.targetCost) }}</span>
                    </span>
                    <span v-if="!city.isFree" class="text-amber-600 font-bold">{{ city.yearsLeft }} {{ t('years_to_fire') }}</span>
                </div>
                
                <div class="w-full h-3 bg-stone-100 rounded-full overflow-hidden relative">
                    <div 
                        class="h-full rounded-full transition-all duration-1000 ease-out"
                        :class="city.isFree ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-red-400'"
                        :style="{ width: Math.min(100, city.progress) + '%' }"
                    ></div>
                </div>
                <div class="flex justify-between text-[10px] items-center text-stone-400">
                    <span>{{ Math.round(city.progress) }}% {{ t('covered') }}</span>
                    <span>{{ t('tier_label') }}: {{ t('tier_' + inputs.lifestyle) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 💡 Detailed Methodology (Collapsible) -->
    <div class="mt-16 bg-stone-100 rounded-2xl p-6 text-sm text-stone-600">
        <details class="group cursor-pointer">
            <summary class="font-bold text-lg text-stone-800 list-none flex items-center gap-2 select-none">
                <span class="group-open:rotate-90 transition-transform">▸</span>
                {{ t('methodology_title') }}
            </summary>
            <div class="mt-4 space-y-4 pl-4 border-l-2 border-stone-300">
                <p>{{ t('methodology_p1') }}</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li><strong>{{ t('methodology_source') }}:</strong> Numbeo 2025 Cost of Living Index.</li>
                    <li><strong>{{ t('methodology_rule') }}:</strong> Trinity Study (4% Rule) - Safe Withdrawal Rate.</li>
                    <li><strong>{{ t('methodology_tiers') }}:</strong>
                        <ul class="list-circle pl-5 mt-1 text-stone-500">
                            <li>Survival: Basic rent (studio outside center), cooking at home, minimal transport.</li>
                            <li>Comfort: 1BR in center, eating out 30%, coworking space, occasional trips.</li>
                            <li>Luxury: Penthouse/Villa, eating out 80%, taxi everywhere, premium services.</li>
                        </ul>
                    </li>
                </ul>
                <p class="text-xs opacity-70 italic">{{ t('methodology_disclaimer') }}</p>
            </div>
        </details>
    </div>

    <!-- 🚀 Next Steps: Creative Lab Integration -->
    <div class="mt-12 bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        
        <div class="relative z-10 text-center">
            <h2 class="text-2xl font-bold mb-4">{{ t('lab_promo_title') }}</h2>
            <p class="text-stone-300 max-w-2xl mx-auto mb-8">{{ t('lab_promo_desc') }}</p>
            
            <div class="flex flex-wrap justify-center gap-4">
                <a href="/lab/countdown" class="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 px-6 py-4 rounded-xl flex items-center gap-3 transition-all hover:-translate-y-1">
                    <span class="text-2xl">⏳</span>
                    <div class="text-left">
                        <div class="font-bold text-sm text-emerald-300">{{ t('lab_tool_1') }}</div>
                        <div class="text-xs text-stone-400">Time Calculator</div>
                    </div>
                </a>
                <a href="/lab/path-tester" class="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 px-6 py-4 rounded-xl flex items-center gap-3 transition-all hover:-translate-y-1">
                    <span class="text-2xl">🏎️</span>
                    <div class="text-left">
                        <div class="font-bold text-sm text-blue-300">{{ t('lab_tool_2') }}</div>
                        <div class="text-xs text-stone-400">Path Simulator</div>
                    </div>
                </a>
                <a href="/lab/garden" class="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 px-6 py-4 rounded-xl flex items-center gap-3 transition-all hover:-translate-y-1">
                    <span class="text-2xl">🌿</span>
                    <div class="text-left">
                        <div class="font-bold text-sm text-purple-300">{{ t('lab_tool_3') }}</div>
                        <div class="text-xs text-stone-400">Asset Garden</div>
                    </div>
                </a>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// --- i18n Dictionary ---
const messages = {
  'zh-TW': {
    title: '全球 FIRE 自由度模擬器',
    subtitle: '如果這筆錢搬到別的國家，你會過著什麼樣的人生？',
    input_section: '資產配置',
    curr_net_worth: '淨資產總額',
    monthly_saving: '每月儲蓄',
    annual_return: '年化報酬率',
    withdrawal_rate: '提領率',
    your_passive_power: '你的被動鈔能力',
    month: '月',
    month_short: '月',
    years_to_fire: '年後自由',
    geo_title: '全球自由度排名',
    sort_freedom: '排序: 最快自由',
    sort_cost_low: '排序: 物價最低',
    sort_safety: '排序: 治安最好',
    tier_survival: '生存模式',
    tier_comfort: '舒適模式',
    tier_luxury: '奢華模式',
    tier_label: '生活等級',
    covered: '已覆蓋',
    status_freedom: '財務自由',
    status_gap: '每月缺口',
    surplus: '資金充裕',
    shortage: '需持續累積',
    target_label: '目標開銷',
    metric_safety: '治安',
    metric_weather: '氣候',
    metric_internet: '網速',
    lifestyle: '生活等級',
    lifestyle_target: '目標生活',
    based_on_withdrawal: '基於 {rate}% 安全提領率計算',
    methodology_title: '演算邏輯與數據來源透明化報告',
    methodology_p1: '本工具旨在提供跨國界的財務自由度比較。我們不只是計算數字，更考慮了不同城市的生活品質差異。',
    methodology_source: '數據來源',
    methodology_rule: '核心法則',
    methodology_tiers: '生活分級定義',
    methodology_disclaimer: '註：所有數據僅供模擬參考，實際開銷因個人消費習慣而異。投資具有風險，過往績效不代表未來表現。',
  },
  'en': {
    title: 'Global FIRE Simulator',
    subtitle: 'What if you moved your wealth elsewhere? Discover your parallel lives.',
    input_section: 'Financial Base',
    curr_net_worth: 'Net Worth',
    monthly_saving: 'Monthly Saving',
    annual_return: 'Annual Return',
    withdrawal_rate: 'Withdrawal Rate',
    your_passive_power: 'Passive Income Power',
    month: 'month',
    month_short: 'mo',
    years_to_fire: 'Years to FIRE',
    geo_title: 'Global Freedom Index',
    sort_freedom: 'Sort: Easiest FIRE',
    sort_cost_low: 'Sort: Lowest Cost',
    sort_safety: 'Sort: Safest',
    tier_survival: 'Survival (Lean)',
    tier_comfort: 'Comfort (Std)',
    tier_luxury: 'Luxury (Fat)',
    tier_label: 'Tier',
    covered: 'Covered',
    status_freedom: 'Freedom',
    status_gap: 'Gap',
    surplus: 'Surplus',
    shortage: 'Work needed',
    target_label: 'Target',
    metric_safety: 'Safety',
    metric_weather: 'Weather',
    metric_internet: 'Net',
    lifestyle: 'Lifestyle',
    lifestyle_target: 'Target Tier',
    based_on_withdrawal: 'Based on {rate}% SWR',
    methodology_title: 'Methodology & Data Transparency',
    methodology_p1: 'This tool compares financial freedom across borders, accounting for quality of life differences.',
    methodology_source: 'Data Source',
    methodology_rule: 'Core Rule',
    methodology_tiers: 'Lifestyle Definitions',
    methodology_disclaimer: 'Disclaimer: Data for simulation only. Real costs vary by habit. Investment involves risk.',
  }
};

const lang = ref('zh-TW'); // State
const t = (key, params = {}) => {
  let text = messages[lang.value][key] || key;
  // Simple param replacement
  Object.keys(params).forEach(k => {
    text = text.replace(`{${k}}`, params[k]);
  });
  return text;
};

// --- State ---
const inputs = ref({
  netWorth: 5000000,
  monthlySaving: 30000,
  roi: 6,
  withdrawal: 4,
  lifestyle: 'comfort' // survival, comfort, luxury
});

const citiesData = ref([]);
const loading = ref(true);
const sortBy = ref('freedom');

// --- Currency Logic ---
const EXCHANGE_RATE = 32; // 1 USD = 32 TWD
const currencySymbol = computed(() => lang.value === 'zh-TW' ? 'NT$' : '$');
const currencyCode = computed(() => lang.value === 'zh-TW' ? 'TWD' : 'USD');

// Auto-convert values when switching languages
watch(lang, (newLang, oldLang) => {
  if (newLang === 'en' && oldLang === 'zh-TW') {
    inputs.value.netWorth = Math.round(inputs.value.netWorth / EXCHANGE_RATE);
    inputs.value.monthlySaving = Math.round(inputs.value.monthlySaving / EXCHANGE_RATE);
  } else if (newLang === 'zh-TW' && oldLang === 'en') {
    inputs.value.netWorth = Math.round(inputs.value.netWorth * EXCHANGE_RATE);
    inputs.value.monthlySaving = Math.round(inputs.value.monthlySaving * EXCHANGE_RATE);
  }
});

const setLang = (l) => lang.value = l;
const formatMoney = (val) => currencySymbol.value + Math.round(val).toLocaleString();

// --- Core Logic ---
const safeWithdrawalAmount = computed(() => {
  return inputs.value.netWorth * (inputs.value.withdrawal / 100);
});

// Fetch Data
onMounted(async () => {
    try {
        const response = await fetch('/data/cities.json');
        citiesData.value = await response.json();
    } catch (e) {
        console.error("Failed to fetch city data", e);
    } finally {
        loading.value = false;
    }
});

const sortedCities = computed(() => {
    // 1. Process Logic for each city
    const processed = citiesData.value.map(city => {
        // Determine Cost based on Lifestyle Tier
        const baseCostUSD = city.costs_usd[inputs.value.lifestyle];
        
        let localCost = 0;
        if (lang.value === 'zh-TW') {
            localCost = baseCostUSD * EXCHANGE_RATE;
        } else {
            localCost = baseCostUSD;
        }
        
        const annualCost = localCost * 12;
        const monthlyGap = localCost - (safeWithdrawalAmount.value / 12);
        
        const progress = (safeWithdrawalAmount.value / annualCost) * 100;
        const isFree = progress >= 100;
        
        // Years Left Calculation
        let yearsLeft = 0;
        if(!isFree) {
           const targetPrincipal = annualCost / (inputs.value.withdrawal / 100);
           const principalGap = targetPrincipal - inputs.value.netWorth;
           
           const annualSave = inputs.value.monthlySaving * 12;
           if (annualSave > 0) {
              const r = inputs.value.roi / 100;
              const pmt = annualSave;
              const pv = inputs.value.netWorth;
              const fv = targetPrincipal;
              
              if (r === 0) {
                  yearsLeft = (fv - pv) / pmt;
              } else {
                 try {
                   // Solve n: (1+r)^n = (FV + PMT/r) / (PV + PMT/r)
                   const numerator = fv + (pmt / r);
                   const denominator = pv + (pmt / r);
                   const base = 1 + r;
                   yearsLeft = Math.log(numerator / denominator) / Math.log(base);
                 } catch(err) {
                   yearsLeft = 999;
                 }
              }
              yearsLeft = Math.max(0, yearsLeft).toFixed(1);
           } else {
             yearsLeft = '∞'; 
           }
        }
        
        return {
            ...city,
            targetCost: localCost, // Monthly target
            monthlyGap,
            progress,
            isFree,
            yearsLeft,
            image: city.image
        };
    });

    // 2. Sort
    return processed.sort((a, b) => {
        if (sortBy.value === 'freedom') return b.progress - a.progress;
        if (sortBy.value === 'cost_low') return a.costs_usd[inputs.value.lifestyle] - b.costs_usd[inputs.value.lifestyle];
        if (sortBy.value === 'safety') return b.indices.safety - a.indices.safety;
        return 0;
    });
});

</script>

<style scoped>
.list-circle {
    list-style-type: circle;
}
</style>
