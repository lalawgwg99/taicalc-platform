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

    <!-- 🏎️ The Race Track (Split Inputs) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      
      <!-- Path A: The Safe Road -->
      <div class="bg-white rounded-3xl p-6 border-2 border-stone-100 shadow-lg relative overflow-hidden group hover:border-blue-200 transition-all">
        <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black text-stone-800 flex items-center gap-2">
                <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">A</span>
                {{ pathA.name }}
            </h2>
            <!-- Emotional Tag -->
            <div class="flex gap-2 text-xs font-bold">
                <span class="px-2 py-1 rounded bg-stone-100 text-stone-500">🛡️ {{ t.security }} +80</span>
                <span class="px-2 py-1 rounded bg-stone-100 text-stone-500">🦅 {{ t.freedom }} -40</span>
            </div>
        </div>

        <div class="space-y-4 relative z-10">
            <div>
                <label class="text-xs font-bold text-stone-400 uppercase">{{ t.initial_cost }}</label>
                <input v-model.number="pathA.initial" type="number" class="w-full text-xl font-bold border-b-2 border-stone-100 py-2 focus:outline-none focus:border-blue-500 transition-colors bg-transparent">
            </div>
             <div>
                <label class="text-xs font-bold text-stone-400 uppercase">{{ t.monthly_cashflow }} ({{ t.expense_negative }})</label>
                <input v-model.number="pathA.monthly" type="number" class="w-full text-xl font-bold border-b-2 border-stone-100 py-2 focus:outline-none focus:border-blue-500 transition-colors bg-transparent text-rose-500">
            </div>
            <div>
                <label class="text-xs font-bold text-stone-400 uppercase">{{ t.roi }} (%)</label>
                <input v-model.number="pathA.roi" type="number" step="0.1" class="w-full text-xl font-bold border-b-2 border-stone-100 py-2 focus:outline-none focus:border-blue-500 transition-colors bg-transparent">
            </div>
        </div>
      </div>

      <!-- Path B: The Bold Road -->
      <div class="bg-white rounded-3xl p-6 border-2 border-stone-100 shadow-lg relative overflow-hidden group hover:border-purple-200 transition-all">
         <div class="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
         <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black text-stone-800 flex items-center gap-2">
                <span class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">B</span>
                {{ pathB.name }}
            </h2>
             <!-- Emotional Tag -->
            <div class="flex gap-2 text-xs font-bold">
                <span class="px-2 py-1 rounded bg-stone-100 text-stone-500">🦅 {{ t.freedom }} +90</span>
                <span class="px-2 py-1 rounded bg-stone-100 text-stone-500">😱 {{ t.anxiety }} +50</span>
            </div>
        </div>

        <div class="space-y-4 relative z-10">
            <div>
                <label class="text-xs font-bold text-stone-400 uppercase">{{ t.initial_cost }}</label>
                <input v-model.number="pathB.initial" type="number" class="w-full text-xl font-bold border-b-2 border-stone-100 py-2 focus:outline-none focus:border-purple-500 transition-colors bg-transparent">
            </div>
             <div>
                <label class="text-xs font-bold text-stone-400 uppercase">{{ t.monthly_cashflow }}</label>
                <input v-model.number="pathB.monthly" type="number" class="w-full text-xl font-bold border-b-2 border-stone-100 py-2 focus:outline-none focus:border-purple-500 transition-colors bg-transparent text-emerald-500">
            </div>
            <div>
                <label class="text-xs font-bold text-stone-400 uppercase">{{ t.roi }} (%)</label>
                <input v-model.number="pathB.roi" type="number" step="0.1" class="w-full text-xl font-bold border-b-2 border-stone-100 py-2 focus:outline-none focus:border-purple-500 transition-colors bg-transparent">
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
                class="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,1)] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
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
                Path A: {{ formatMoney(finalValueA) }}
            </div>
            <div class="flex items-center gap-2 text-purple-400">
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                Path B: {{ formatMoney(finalValueB) }}
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
    subtitle: '如果當年我選擇了那條路...別再用腦袋空想，讓數據畫出你的平行時空。',
    security: '安全感',
    freedom: '自由度',
    anxiety: '焦慮值',
    initial_cost: '初始投入 (頭期款/成本)',
    monthly_cashflow: '每月現金流',
    expense_negative: '負數=支出',
    roi: '預期年化報酬',
    wealth_projection_30y: '30 年財富賽跑',
    overtake: '黃金交叉點: 第',
    verdict_title: '殘酷的結論',
    verdict_b_wins: '如果選擇 Path B，你將在第 {year} 年超越對手，最終多賺 {val}。',
    verdict_a_wins: 'Path A 虽然保守，但最終竟多累積了 {val}。姜是老的辣？',
    share_result: '生成對決圖卡',
};

// Default Scenario: Buy House (A) vs Rent & Invest (B)
const pathA = ref({
    name: '買房自住 (Buy House)',
    initial: 3000000, // Down payment
    monthly: -40000,  // Mortgage + Maintenance
    roi: 2.5          // House appreciation
});

const pathB = ref({
    name: '租房投資 (Rent & Invest)',
    initial: 0,       // Keep cash
    monthly: 10000,   // Surplus from renting (Rent 30k vs Mortgage 40k = +10k save? No, usually rent is cheaper. Let's say Rent 25k, Save 15k)
                      // Logic check: If Path A spends 3M and -40k/mo. 
                      // Path B keeps 3M (invested) and pays rent (say -25k).
                      // We need to model "Net Worth" change.
                      // Path A: Asset = House (3M+Loan). Equity starts at 3M. Monthly Cost -40k. 
                      // To simplify: Input is "Net Change to Net Worth". 
                      // Path A: House grows 2.5%. Mortgage interest is cost. 
                      // SIMPLIFICATION FOR UX:
    // Let's model "Investment Portfolio Value".
    // Path A Input: Initial Investment, Monthly Contribution, Return.
    // Buying a house is complex. Let's Frame it as:
    // Path A (House): Initial 3M -> Grows at 2.5%. Monthly Payment -40k is "forced savings" (principal) + "expense" (interest).
    // This is too complex for a slider tool.
    // BETTER MODEL: 
    // Path A: You dump 3M in. You add 0/mo (house measures appreciation). Return 3% (House price).
    // Path B: You dump 3M in ETF. You add 0/mo. Return 8%.
    initial: 3000000,
    monthly: 0, 
    roi: 7
});

const years = 30;

const calculateCurve = (initial, monthly, roi, years) => {
    const data = [];
    let current = initial;
    const r = roi / 100 / 12;
    for (let m = 0; m <= years * 12; m++) {
        if (m % 12 === 0) { // Record yearly for smoother svg
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

// Find Crossover
const crossoverIndex = computed(() => {
    const arrA = chartData.value.pathA;
    const arrB = chartData.value.pathB;
    // Assuming starting positions are different, find first cross
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

// Chart Visuals
const maxVal = computed(() => Math.max(...chartData.value.pathA, ...chartData.value.pathB) * 1.1);

const generatePathD = (data) => {
    if (!data || data.length === 0) return '';
    const rangeX = years; 
    const rangeY = maxVal.value;
    
    // Scale X: 0 -> 100
    // Scale Y: 0 -> 100 (Inverted, 100 is bottom)
    
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

</script>
