<template>
  <div class="max-w-4xl mx-auto px-4 py-12 font-sans text-stone-800">
    
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
        {{ t.title }} ⏳
      </h1>
      <p class="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
        {{ t.subtitle }}
      </p>
    </div>

    <!-- 🎛️ Input Board -->
    <div class="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 mb-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <!-- Current Status -->
            <div class="space-y-4">
                <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider">{{ t.current_savings }}</label>
                <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl font-bold">$</span>
                    <input 
                        v-model.number="baseMonthlySavings" 
                        type="number" 
                        class="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-4 pl-10 pr-4 text-2xl font-black text-stone-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                </div>
            </div>

            <div class="space-y-4">
                <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider">{{ t.target_corpus }}</label>
                <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl font-bold">$</span>
                    <input 
                        v-model.number="targetAmount" 
                        type="number" 
                        class="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-4 pl-10 pr-4 text-2xl font-black text-stone-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                </div>
            </div>
             <div class="space-y-4">
                <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider">{{ t.current_corpus }}</label>
                <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl font-bold">$</span>
                    <input 
                        v-model.number="currentAmount" 
                        type="number" 
                        class="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-4 pl-10 pr-4 text-2xl font-black text-stone-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                </div>
            </div>
        </div>
    </div>

    <!-- ⚡ The Magic Slider (Contrast Engine) -->
    <div class="mb-16">
        <div class="bg-stone-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <!-- Background Pulse -->
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-stone-900 z-0"></div>

            <div class="relative z-10 text-center">
                <h3 class="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-8">{{ t.magic_slider_title }}</h3>
                
                <!-- The Slider -->
                <div class="relative h-16 bg-white/10 rounded-full flex items-center px-4 mb-8 group cursor-ew-resize">
                    <!-- Center Marker -->
                    <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20"></div>
                    
                    <!-- Track Fill -->
                    <div 
                        class="absolute left-1/2 top-2 bottom-2 rounded-full transition-all duration-100"
                        :class="sliderValue > 0 ? 'bg-emerald-500' : 'bg-rose-500'"
                        :style="{ 
                            width: Math.abs(sliderPercentage) + '%',
                            left: sliderValue >= 0 ? '50%' : (50 + sliderPercentage) + '%' 
                        }"
                    ></div>

                    <input 
                        type="range" 
                        v-model.number="sliderValue" 
                        min="-20000" 
                        max="20000" 
                        step="1000"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    >
                    
                    <!-- Value Display -->
                    <div 
                        class="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 font-mono font-bold text-2xl"
                        :class="sliderValue === 0 ? 'text-stone-400 left-1/2 -translate-x-1/2' : 'text-white'"
                        :style="{ left: `calc(50% + ${sliderPercentage}%)`, transform: `translate(${sliderValue >= 0 ? '-50%' : '-50%'}, -50%)` }"
                    >
                        {{ sliderValue > 0 ? '+' : '' }}{{ sliderValue }}
                    </div>
                </div>

                <p class="text-stone-400 text-sm font-medium">
                    {{ sliderValue === 0 ? t.slider_instruction : (sliderValue > 0 ? t.saved_more : t.spent_more) }}
                </p>
            </div>
        </div>
    </div>


    <!-- 📊 The Verdict (Split Screen) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Scenario A: Status Quo -->
        <div class="group relative rounded-3xl border-4 border-stone-100 bg-stone-50 p-8 transition-all duration-500" :class="{ 'opacity-50 blur-[1px] scale-95': sliderValue !== 0 }">
             <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-stone-200 text-stone-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ t.scenario_status_quo }}
            </div>
            
            <div class="text-center mt-4">
                <div class="text-stone-400 text-sm font-bold uppercase mb-2">{{ t.freedom_day }}</div>
                <div class="text-3xl font-black text-stone-600 mb-2">{{ formatDate(baseDate) }}</div>
                <div class="text-stone-400 font-mono text-sm">{{ calculateTimeLeft(baseAmount, baseMonthlySavings) }}</div>
            </div>
        </div>

        <!-- Scenario B: Optimized (The Highlight) -->
        <div class="group relative rounded-3xl border-4 p-8 transition-all duration-500 shadow-2xl scale-105 z-10 overflow-hidden bg-white" 
             :class="sliderValue >= 0 ? 'border-emerald-500' : 'border-rose-500'">
            
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                 :class="sliderValue >= 0 ? 'bg-emerald-500' : 'bg-rose-500'">
                 {{ sliderValue === 0 ? t.scenario_current : t.scenario_new }}
            </div>

            <!-- Dynamic Background Effect -->
            <div class="absolute inset-0 opacity-10 pointer-events-none"
                 :class="sliderValue >= 0 ? 'bg-emerald-500' : 'bg-rose-500'"></div>

            <div class="text-center mt-4 relative z-10">
                <div class="text-sm font-bold uppercase mb-2 transition-colors"
                     :class="sliderValue >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                    {{ t.freedom_day }}
                </div>
                
                <!-- The Date -->
                <div class="text-4xl md:text-5xl font-black mb-4 transition-all"
                     :class="sliderValue >= 0 ? 'text-emerald-700' : 'text-rose-700'">
                    {{ formatDate(adjustedDate) }}
                </div>

                <!-- The Difference Badge -->
                <div v-if="sliderValue !== 0" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm mb-4"
                     :class="sliderValue > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                    <span v-if="sliderValue > 0">🚀 {{ t.earlier_by }} {{ dateDiff }}</span>
                    <span v-else>⛓️ {{ t.later_by }} {{ dateDiff }}</span>
                </div>
                
                <!-- The Narrative -->
                 <p class="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
                    <span v-if="sliderValue > 0">
                        {{ t.positive_message }}
                    </span>
                    <span v-else-if="sliderValue < 0">
                        {{ t.negative_message }}
                    </span>
                    <span v-else>
                        {{ t.neutral_message }}
                    </span>
                </p>
            </div>
        </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const t = {
    title: '自由日倒數計時器',
    subtitle: '你的每一筆花費，都在偷偷竊取（或買回）你的未來。',
    current_savings: '目前每月儲蓄',
    target_corpus: '自由目標金額',
    current_corpus: '目前資產總額',
    magic_slider_title: '如果我每個月...',
    slider_instruction: '滑動滑桿，看看未來會如何改變',
    saved_more: '多存這些錢 (犧牲現在)',
    spent_more: '多花這些錢 (享受現在)',
    scenario_status_quo: '如果什麼都不變',
    scenario_current: '目前軌跡',
    scenario_new: '你的新人生',
    freedom_day: '你的自由日',
    earlier_by: '提早自由',
    later_by: '延後刑期',
    positive_message: '恭喜！你刚刚用这点小小的牺牲，买回了人生中最宝贵的自由时光。',
    negative_message: '警告：这一时的享受，将让你在工作岗位上多被囚禁这段时间。值得吗？',
    neutral_message: '試著移動滑桿，看看你的「拿鐵因子」對 20 年後有多大影響。'
};

const baseMonthlySavings = ref(30000);
const targetAmount = ref(15000000);
const currentAmount = ref(2000000);
const annualReturn = 0.06; // 6% default

const sliderValue = ref(0);

// Helper: Calculate months to reach target
// FV = PV * (1+r)^n + PMT * [ (1+r)^n - 1 ] / r
// We need to solve for n.
// This is complex algebra, using iteration or NPER formula equivalent.
// NPER = ln( (FV*r + PMT) / (PV*r + PMT) ) / ln(1+r)
const calculateMonths = (pv, pmt, fv, rate) => {
    const r = rate / 12;
    if (pmt <= 0 && pv < fv) return 9999; // Never
    if (r === 0) return (fv - pv) / pmt;
    
    // Check if goal is reachable (if PMT is negative enough to drain PV)
    if (pv * r + pmt <= 0) return 9999; // Corpus depletes
    
    try {
        const num = fv * r + pmt;
        const den = pv * r + pmt;
        const n = Math.log(num / den) / Math.log(1 + r);
        return Math.max(0, n);
    } catch {
        return 9999;
    }
};

const sliderPercentage = computed(() => {
    return (sliderValue.value / 20000) * 50; // Map -20k~20k to percentages
});

const baseMonths = computed(() => {
    return calculateMonths(currentAmount.value, baseMonthlySavings.value, targetAmount.value, annualReturn);
});

const adjustedMonths = computed(() => {
    return calculateMonths(currentAmount.value, baseMonthlySavings.value + sliderValue.value, targetAmount.value, annualReturn);
});

const baseDate = computed(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + baseMonths.value);
    return d;
});

const adjustedDate = computed(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + adjustedMonths.value);
    return d;
});

const dateDiff = computed(() => {
    const diff = Math.abs(adjustedMonths.value - baseMonths.value);
    const years = Math.floor(diff / 12);
    const months = Math.round(diff % 12);
    if (years > 0) return `${years} 年 ${months} 個月`;
    return `${months} 個月`;
});

const formatDate = (date) => {
    if (isNaN(date.getTime()) || date.getFullYear() > 2100) return '遙遙無期';
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
};

const calculateTimeLeft = () => {
    if (baseMonths.value > 1200) return 'Forever';
    const y = Math.floor(baseMonths.value / 12);
    const m = Math.round(baseMonths.value % 12);
    return `${y} 年 ${m} 個月後`;
}

</script>
