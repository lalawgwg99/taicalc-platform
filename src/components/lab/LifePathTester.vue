<template>
  <div class="max-w-6xl mx-auto px-4 py-8 font-sans text-stone-800">
    
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
        Decision Engine
      </div>
      <h1 class="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
        {{ t.title }}
      </h1>
      <p class="text-stone-500 max-w-xl mx-auto">
        {{ t.subtitle }}
      </p>
    </div>

    <!-- 🎭 Scenario Presets (The "Menu") -->
    <div class="mb-12">
        <h3 class="text-center text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">{{ t.scenario_picker_title }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
                v-for="preset in presets" 
                :key="preset.id"
                @click="applyPreset(preset)"
                class="group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1"
                :class="activePreset === preset.id ? 'border-stone-800 bg-stone-800 text-white shadow-xl' : 'border-stone-100 bg-white text-stone-600 hover:border-emerald-300'"
            >
                <span class="text-3xl mb-2 group-hover:scale-110 transition-transform">{{ preset.icon }}</span>
                <span class="font-bold text-sm">{{ preset.name }}</span>
            </button>
        </div>
    </div>

    <!-- 🏎️ The Race Track (Split Inputs) -->
    <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      
      <!-- VS Badge Mobile -->
      <div class="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-stone-900 text-white font-black px-3 py-1 rounded-full shadow-lg border-2 border-white">VS</div>

      <!-- Path A -->
      <div class="bg-white rounded-3xl p-6 border-4 border-stone-50 shadow-lg relative overflow-hidden group hover:border-blue-100 transition-all">
        <div class="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-blue-500 pointer-events-none">A</div>
        
        <div class="flex flex-col gap-1 mb-6 relative z-10">
            <div class="flex items-center gap-2">
                <span class="w-2 h-6 bg-blue-500 rounded-full"></span>
                <input v-model="pathA.name" class="font-black text-xl text-stone-800 bg-transparent focus:outline-none focus:bg-blue-50 rounded px-1 w-full" placeholder="Path Name">
            </div>
            <!-- Tags -->
            <div class="flex gap-2 text-[10px] font-bold uppercase pl-4">
                <span class="text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{{ t.security }} HIGH</span>
                <span class="text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{{ t.freedom }} LOW</span>
            </div>
        </div>

        <div class="space-y-6 relative z-10 p-2">
            <!-- Initial -->
            <div>
                <label class="flex justify-between text-xs font-bold text-stone-400 uppercase mb-2">
                    <span>🎬 {{ t.input_initial }}</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-serif font-bold">$</span>
                    <input v-model.number="pathA.initial" type="number" class="w-full bg-stone-50 rounded-xl py-3 pl-8 pr-4 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
                </div>
                <p class="text-[10px] text-stone-400 mt-1 pl-1">{{ t.hint_initial }}</p>
            </div>
            
            <!-- Monthly -->
            <div>
                <label class="flex justify-between text-xs font-bold text-stone-400 uppercase mb-2">
                    <span>💸 {{ t.input_monthly }}</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-serif font-bold">$</span>
                    <input v-model.number="pathA.monthly" type="number" class="w-full bg-stone-50 rounded-xl py-3 pl-8 pr-4 font-bold overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-200"
                           :class="pathA.monthly < 0 ? 'text-rose-500' : 'text-emerald-600'">
                </div>
                 <p class="text-[10px] text-stone-400 mt-1 pl-1">{{ t.hint_monthly }}</p>
            </div>

            <!-- ROI -->
            <div>
                 <label class="flex justify-between text-xs font-bold text-stone-400 uppercase mb-2">
                    <span>📈 {{ t.input_roi }}</span>
                    <span class="text-blue-600">{{ pathA.roi }}%</span>
                </label>
                <input v-model.number="pathA.roi" type="range" step="0.5" min="-5" max="20" class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-500">
            </div>
        </div>
      </div>

      <!-- Path B -->
      <div class="bg-white rounded-3xl p-6 border-4 border-stone-50 shadow-lg relative overflow-hidden group hover:border-purple-100 transition-all">
         <div class="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-purple-500 pointer-events-none">B</div>
         
         <div class="flex flex-col gap-1 mb-6 relative z-10">
            <div class="flex items-center gap-2">
                <span class="w-2 h-6 bg-purple-500 rounded-full"></span>
                <input v-model="pathB.name" class="font-black text-xl text-stone-800 bg-transparent focus:outline-none focus:bg-purple-50 rounded px-1 w-full" placeholder="Path Name">
            </div>
             <!-- Tags -->
            <div class="flex gap-2 text-[10px] font-bold uppercase pl-4">
                <span class="text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{{ t.security }} MID</span>
                <span class="text-purple-500 bg-purple-50 px-2 py-0.5 rounded">{{ t.freedom }} HIGH</span>
            </div>
        </div>

        <div class="space-y-6 relative z-10 p-2">
             <!-- Initial -->
            <div>
                <label class="flex justify-between text-xs font-bold text-stone-400 uppercase mb-2">
                    <span>🎬 {{ t.input_initial }}</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-serif font-bold">$</span>
                    <input v-model.number="pathB.initial" type="number" class="w-full bg-stone-50 rounded-xl py-3 pl-8 pr-4 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-200">
                </div>
            </div>

            <!-- Monthly -->
            <div>
                <label class="flex justify-between text-xs font-bold text-stone-400 uppercase mb-2">
                    <span>💸 {{ t.input_monthly }}</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-serif font-bold">$</span>
                    <input v-model.number="pathB.monthly" type="number" class="w-full bg-stone-50 rounded-xl py-3 pl-8 pr-4 font-bold overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-200"
                           :class="pathB.monthly < 0 ? 'text-rose-500' : 'text-emerald-600'">
                </div>
            </div>

            <!-- ROI -->
            <div>
                 <label class="flex justify-between text-xs font-bold text-stone-400 uppercase mb-2">
                    <span>📈 {{ t.input_roi }}</span>
                    <span class="text-purple-600">{{ pathB.roi }}%</span>
                </label>
                <input v-model.number="pathB.roi" type="range" step="0.5" min="-5" max="20" class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-500">
            </div>
        </div>
      </div>

    </div>

    <!-- 📈 The Racing Chart (SVG Visualization) -->
    <div class="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden relative mb-12">
        <div class="absolute top-0 right-0 p-6 opacity-30 pointer-events-none">
            <span class="text-9xl font-black">VS</span>
        </div>

        <h3 class="text-stone-400 font-bold uppercase tracking-widest text-sm mb-6">{{ t.wealth_projection_30y }}</h3>
        
        <!-- SVG Chart Container -->
        <div class="relative h-64 w-full">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <!-- Grid Lines -->
                <line x1="0" y1="100" x2="100" y2="100" stroke="#333" stroke-width="0.5" />
                <line x1="0" y1="0" x2="0" y2="100" stroke="#333" stroke-width="0.5" />

                <!-- Path A Line -->
                <path 
                    :d="generatePathD(chartData.pathA)" 
                    fill="none" 
                    stroke="#3b82f6" 
                    stroke-width="3" 
                    vector-effect="non-scaling-stroke"
                    class="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />

                <!-- Path B Line -->
                <path 
                    :d="generatePathD(chartData.pathB)" 
                    fill="none" 
                    stroke="#a855f7" 
                    stroke-width="3" 
                    vector-effect="non-scaling-stroke"
                    class="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                />
            </svg>

            <!-- Crossover Point Marker (Calculated Position) -->
            <div 
                v-if="crossoverIndex > 0"
                class="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,1)] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 z-10"
                :style="{ left: crossoverLeft + '%', top: crossoverTop + '%' }"
            >
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 text-stone-900 text-xs font-black px-2 py-1 rounded whitespace-nowrap">
                    {{ t.overtake }} {{ crossoverYear }}
                </div>
            </div>
        </div>
        
        <!-- Legend -->
        <div class="flex justify-center gap-8 mt-6 text-sm font-bold">
            <div class="flex items-center gap-2 text-blue-400">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                {{ pathA.name }}: {{ formatMoney(finalValueA) }}
            </div>
            <div class="flex items-center gap-2 text-purple-400">
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                {{ pathB.name }}: {{ formatMoney(finalValueB) }}
            </div>
        </div>

    </div>

    <!-- 🗳️ The Verdict Card -->
    <div class="bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl p-8 text-center border border-stone-300">
        <h3 class="text-2xl font-black text-stone-800 mb-4">{{ t.verdict_title }}</h3>
        <p class="text-lg text-stone-600 mb-6 leading-relaxed">
            <span v-if="finalValueB > finalValueA">
                {{ t.verdict_b_wins.replace('{val}', formatMoney(Math.abs(finalValueB - finalValueA))).replace('{year}', crossoverYear || 'N/A') }}
            </span>
            <span v-else>
                {{ t.verdict_a_wins.replace('{val}', formatMoney(Math.abs(finalValueA - finalValueB))) }}
            </span>
        </p>
        
        <div class="flex justify-center gap-4">
            <button class="bg-stone-800 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">
                {{ t.share_result }}
            </button>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const t = {
    title: '人生岔路模擬器',
    subtitle: '別再用腦袋空想，選一個劇本，讓數據畫出你的平行時空。',
    scenario_picker_title: '選擇你的戰場',
    security: '安全感',
    freedom: '自由度',
    anxiety: '焦慮值',
    input_initial: '初始本金',
    input_monthly: '每月金流',
    input_roi: '年化報酬',
    hint_initial: '頭期款、創業基金或現有存款',
    hint_monthly: '正數=存錢/獲利，負數=房貸/燒錢',
    wealth_projection_30y: '30 年資產競速',
    overtake: '黃金交叉點: 第',
    verdict_title: '殘酷的結論',
    verdict_b_wins: '如果選擇【{pathB}】，你將在第 {year} 年超越對手，30年後多賺 {val}。',
    verdict_a_wins: '【{pathA}】雖然保守，但靠著穩健累積，最終竟多出了 {val}。',
    share_result: '生成對決圖卡',
};

const activePreset = ref('buy_v_rent');

const presets = [
    {
        id: 'buy_v_rent',
        name: '買房 vs 租房',
        icon: '🏠',
        pathA: { name: '買房自住', initial: 3000000, monthly: -40000, roi: 2 }, // House apprec
        pathB: { name: '租房投資', initial: 0, monthly: 15000, roi: 7 } // Rent savings invested
    },
    {
        id: 'stable_v_startup',
        name: '上班 vs 創業',
        icon: '🚀',
        pathA: { name: '穩定工作', initial: 100000, monthly: 20000, roi: 5 },
        pathB: { name: '創業冒險', initial: 1000000, monthly: -30000, roi: 15 } // High burn, high potential
    },
    {
        id: 'coast_v_fat',
        name: '躺平 vs 拼命',
        icon: '🏖️',
        pathA: { name: 'Coast FIRE', initial: 5000000, monthly: 0, roi: 6 },
        pathB: { name: '拼命賺錢', initial: 500000, monthly: 50000, roi: 6 }
    },
    {
        id: 'custom',
        name: '自定義對決',
        icon: '🛠️',
        pathA: { name: '路徑 A', initial: 1000000, monthly: 10000, roi: 5 },
        pathB: { name: '路徑 B', initial: 1000000, monthly: 10000, roi: 8 }
    }
];

// State
const pathA = ref({ ...presets[0].pathA });
const pathB = ref({ ...presets[0].pathB });

const applyPreset = (preset) => {
    activePreset.value = preset.id;
    if(preset.id !== 'custom') {
        pathA.value = { ...preset.pathA };
        pathB.value = { ...preset.pathB };
    }
};

const years = 30;

const calculateCurve = (initial, monthly, roi, years) => {
    const data = [];
    let current = initial;
    const r = roi / 100 / 12;
    for (let m = 0; m <= years * 12; m++) {
        if (m % 12 === 0) { 
            data.push(current);
        }
        current = current * (1 + r) + monthly;
    }
    return data;
};

const chartData = computed(() => {
    return {
        pathA: calculateCurve(pathA.value.initial, pathA.value.monthly, pathA.value.roi, years),
        pathB: calculateCurve(pathB.value.initial, pathB.value.monthly, pathB.value.roi, years)
    };
});

const finalValueA = computed(() => chartData.value.pathA[years]);
const finalValueB = computed(() => chartData.value.pathB[years]);

const crossoverIndex = computed(() => {
    const arrA = chartData.value.pathA;
    const arrB = chartData.value.pathB;
    for (let i = 1; i < arrA.length; i++) {
        if ((arrA[i] > arrB[i] && arrA[i-1] < arrB[i-1]) || (arrA[i] < arrB[i] && arrA[i-1] > arrB[i-1])) {
            return i;
        }
    }
    return -1;
});

const crossoverYear = computed(() => {
    if (crossoverIndex.value === -1) return null;
    return crossoverIndex.value + " 年";
});

const maxVal = computed(() => Math.max(100000, ...chartData.value.pathA, ...chartData.value.pathB) * 1.1);

const generatePathD = (data) => {
    if (!data || data.length === 0) return '';
    const rangeX = years; 
    const rangeY = maxVal.value;
    
    return data.map((val, i) => {
        const x = (i / rangeX) * 100;
        const y = 100 - ((val / rangeY) * 100);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
};

const crossoverLeft = computed(() => (crossoverIndex.value / years) * 100);
const crossoverTop = computed(() => {
    if (crossoverIndex.value === -1) return 0;
    const val = chartData.value.pathA[crossoverIndex.value];
    return 100 - ((val / maxVal.value) * 100);
});

const formatMoney = (v) => '$' + Math.round(v).toLocaleString();

// Enhanced Message Parsing
const enrichedVerdictB = computed(() => {
    return t.verdict_b_wins
        .replace('{pathB}', pathB.value.name)
        .replace('{year}', crossoverYear.value || 'N/A')
        .replace('{val}', formatMoney(Math.abs(finalValueB.value - finalValueA.value)));
});

const enrichedVerdictA = computed(() => {
    return t.verdict_a_wins
        .replace('{pathA}', pathA.value.name)
        .replace('{val}', formatMoney(Math.abs(finalValueA.value - finalValueB.value)));
});

</script>
