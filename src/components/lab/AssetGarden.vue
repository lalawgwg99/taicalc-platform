<template>
  <div class="max-w-6xl mx-auto px-4 py-8 font-sans text-stone-800">
    
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
        Visualizer
      </div>
      <h1 class="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
        {{ t.title }} 🌿
      </h1>
      <p class="text-stone-500 max-w-xl mx-auto">
        {{ t.subtitle }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- 🎛️ The Controls (Garden Inputs) -->
        <div class="lg:col-span-4 space-y-6">
            <div class="bg-white rounded-3xl p-6 shadow-xl shadow-stone-200/50 border border-stone-100">
                <h3 class="font-bold text-stone-800 mb-6 flex items-center gap-2">
                    🌱 {{ t.input_title }}
                </h3>
                
                <div class="space-y-4">
                    <!-- Cash (Water) -->
                    <div>
                        <label class="flex justify-between text-xs font-bold text-blue-400 uppercase mb-1">
                            <span>💧 {{ t.cat_cash }} ({{ t.role_water }})</span>
                            <span>{{ formatMoney(assets.cash) }}</span>
                        </label>
                        <input v-model.number="assets.cash" type="range" min="0" max="5000000" step="10000" class="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500">
                    </div>

                    <!-- Stocks (Trees) -->
                    <div>
                        <label class="flex justify-between text-xs font-bold text-emerald-500 uppercase mb-1">
                            <span>🌳 {{ t.cat_stock }} ({{ t.role_trees }})</span>
                            <span>{{ formatMoney(assets.stock) }}</span>
                        </label>
                        <input v-model.number="assets.stock" type="range" min="0" max="10000000" step="50000" class="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                    </div>

                    <!-- Crypto (Exotic) -->
                    <div>
                        <label class="flex justify-between text-xs font-bold text-purple-500 uppercase mb-1">
                            <span>🌺 {{ t.cat_crypto }} ({{ t.role_flowers }})</span>
                            <span>{{ formatMoney(assets.crypto) }}</span>
                        </label>
                        <input v-model.number="assets.crypto" type="range" min="0" max="2000000" step="10000" class="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-500">
                    </div>

                    <!-- Real Estate (Rocks) -->
                    <div>
                        <label class="flex justify-between text-xs font-bold text-stone-500 uppercase mb-1">
                            <span>🪨 {{ t.cat_real_estate }} ({{ t.role_rocks }})</span>
                            <span>{{ formatMoney(assets.realEstate) }}</span>
                        </label>
                        <input v-model.number="assets.realEstate" type="range" min="0" max="20000000" step="100000" class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-500">
                    </div>

                     <!-- Debt (Pests) -->
                    <div class="pt-4 border-t border-dashed border-stone-200">
                        <label class="flex justify-between text-xs font-bold text-rose-500 uppercase mb-1">
                            <span>🐛 {{ t.cat_debt }} ({{ t.role_pests }})</span>
                            <span>-{{ formatMoney(assets.debt) }}</span>
                        </label>
                        <input v-model.number="assets.debt" type="range" min="0" max="5000000" step="10000" class="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500">
                         <p class="text-[10px] text-rose-400 mt-1 italic">{{ t.pest_warning }}</p>
                    </div>
                </div>
            </div>

            <!-- Season Control -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <h3 class="font-bold text-stone-800 mb-4 text-sm">{{ t.market_season }}</h3>
                <div class="flex gap-2">
                    <button @click="season = 'spring'" :class="season === 'spring' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-stone-50 text-stone-400 border-transparent'" class="flex-1 py-2 rounded-xl text-xs font-bold border transition-all">
                        🌱 {{ t.season_spring }}
                    </button>
                    <button @click="season = 'winter'" :class="season === 'winter' ? 'bg-sky-100 text-sky-700 border-sky-200' : 'bg-stone-50 text-stone-400 border-transparent'" class="flex-1 py-2 rounded-xl text-xs font-bold border transition-all">
                        ❄️ {{ t.season_winter }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 🖼️ The Garden (Visual Canvas) -->
        <div class="lg:col-span-8">
            <div class="relative w-full aspect-square md:aspect-video bg-stone-50 rounded-3xl overflow-hidden shadow-inner border-4 border-stone-100 transition-colors duration-1000"
                 :class="season === 'spring' ? 'bg-[#f0fdf4]' : 'bg-[#f0f9ff]'">
                
                <!-- Sky / Env -->
                <div class="absolute inset-0 opacity-50 pointer-events-none transition-colors duration-1000"
                     :class="season === 'spring' ? 'bg-gradient-to-b from-blue-100 to-transparent' : 'bg-gradient-to-b from-slate-200 to-transparent'"></div>

                <!-- 🌞 Sun/Moon -->
                <div class="absolute top-8 right-8 w-16 h-16 rounded-full blur-xl transition-all duration-1000"
                     :class="season === 'spring' ? 'bg-yellow-400/60 shadow-[0_0_40px_rgba(250,204,21,0.6)]' : 'bg-blue-100/40 shadow-[0_0_40px_rgba(255,255,255,0.8)]'"></div>


                <!-- SVG Canvas -->
                <svg class="w-full h-full absolute inset-0" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                    
                    <!-- 1. Water (Cash) - Bottom Layer -->
                    <defs>
                         <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6" />
                            <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.9" />
                        </linearGradient>
                    </defs>
                    <path 
                        :d="waterPath" 
                        fill="url(#waterGrad)" 
                        class="transition-all duration-1000 ease-in-out"
                    />

                    <!-- 2. Real Estate (Rocks) - Stationary but sized -->
                    <g transform="translate(100, 450)">
                         <path 
                            v-for="(rock, i) in rockNodes" 
                            :key="'rock-'+i"
                            :d="rock.d" 
                            fill="#a8a29e" 
                            stroke="#78716c" 
                            stroke-width="2"
                            :transform="`scale(${rock.scale}) translate(${rock.x}, 0)`"
                            class="transition-transform duration-700"
                         />
                    </g>
                    
                    <!-- 3. Trees (Stocks) - Middle Ground -->
                    <g transform="translate(0, 50)">
                        <g v-for="(tree, i) in treeNodes" :key="'tree-'+i" :transform="`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`" class="transition-transform duration-1000 ease-out origin-bottom">
                            <!-- Trunk -->
                            <rect x="-5" y="-60" width="10" height="60" rx="2" fill="#854d0e" />
                            <!-- Leaves -->
                            <circle cx="0" cy="-70" r="35" :fill="season === 'spring' ? '#22c55e' : '#84cc16'" class="transition-colors duration-1000" opacity="0.9" />
                            <circle cx="-20" cy="-60" r="25" :fill="season === 'spring' ? '#16a34a' : '#65a30d'" class="transition-colors duration-1000" opacity="0.9" />
                            <circle cx="20" cy="-60" r="25" :fill="season === 'spring' ? '#15803d' : '#4d7c0f'" class="transition-colors duration-1000" opacity="0.9" />
                            <!-- Fruit (Dividends - only in Spring) -->
                             <circle v-if="season === 'spring'" cx="-10" cy="-70" r="4" fill="#ef4444" class="animate-pulse" />
                             <circle v-if="season === 'spring'" cx="15" cy="-55" r="4" fill="#ef4444" class="animate-pulse" style="animation-delay: 0.5s" />
                        </g>
                    </g>

                    <!-- 4. Flowers (Crypto) - Foreground -->
                    <g transform="translate(0, 0)">
                        <g v-for="(flower, i) in flowerNodes" :key="'flower-'+i" :transform="`translate(${flower.x}, ${flower.y}) scale(${flower.scale})`" class="transition-transform duration-500 origin-bottom">
                             <line x1="0" y1="0" x2="0" y2="-30" stroke="#10b981" stroke-width="2" />
                             <circle cx="0" cy="-35" r="10" fill="#d8b4fe" />
                             <circle cx="0" cy="-35" r="5" fill="#a855f7" />
                        </g>
                    </g>

                    <!-- 5. Pests (Debt) - Infestation Overlay -->
                    <g v-if="assets.debt > 0">
                        <g v-for="(bug, i) in bugNodes" :key="'bug-'+i" :transform="`translate(${bug.x}, ${bug.y})`" class="animate-bounce" :style="`animation-duration: ${bug.speed}s`">
                             <text font-size="20">🐛</text>
                        </g>
                    </g>

                </svg>

                <div class="absolute bottom-4 right-4 bg-white/80 backdrop-blur rounded-xl px-4 py-2 text-xs font-bold text-stone-500 shadow-sm border border-stone-200">
                    {{ t.garden_status }}: 
                    <span :class="healthStatus.color">{{ healthStatus.text }}</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const t = {
    title: '數位資產花園',
    subtitle: '將冷冰冰的資產數字，轉化為直觀的生態系。看見你的財富生命力。',
    input_title: '種植你的資產',
    cat_cash: '現金水位',
    cat_stock: '股票/ETF',
    cat_crypto: '加密貨幣/新創',
    cat_real_estate: '房地產/黃金',
    cat_debt: '高利債務',
    role_water: '水源',
    role_trees: '果樹',
    role_flowers: '異花',
    role_rocks: '基石',
    role_pests: '害蟲',
    pest_warning: '警告：債務害蟲會啃食你的果實！',
    market_season: '市場季節 (模擬情境)',
    season_spring: '牛市 (春暖花開)',
    season_winter: '熊市 (休養生息)',
    garden_status: '花園健康度',
};

const assets = ref({
    cash: 500000,
    stock: 2000000,
    crypto: 100000,
    realEstate: 0,
    debt: 0
});

const season = ref('spring');

const formatMoney = (v) => '$' + Math.round(v).toLocaleString();

// --- Visual Generators ---

// Water: Height depends on Cash absolute value relative to a "Healthy Baseline" (say 1M)
const waterPath = computed(() => {
    // Canvas Height 600. Water starts from bottom.
    // Max Cash ~ 5M -> Height 300.
    const height = Math.min(300, (assets.value.cash / 5000000) * 200 + 50); 
    const y = 600 - height;
    
    // Create a wave looking path
    return `M 0 600 L 0 ${y} Q 200 ${y+20} 400 ${y} T 800 ${y} L 800 600 Z`;
});

// Resources generator
const seededRandom = (seed) => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Rocks (Real Estate)
const rockNodes = computed(() => {
    const count = Math.ceil(assets.value.realEstate / 4000000); // 1 Rock per 4M
    const nodes = [];
    for(let i=0; i<count; i++) {
        nodes.push({
            scale: 0.5 + seededRandom(i)*0.5,
            x: i * 80,
            d: "M0 0 Q 30 -50 60 0 Z" // Triangle-ish
        });
    }
    return nodes;
});

// Trees (Stocks)
const treeNodes = computed(() => {
    const count = Math.min(15, Math.ceil(assets.value.stock / 500000)); // 1 Tree per 500k
    const nodes = [];
    for(let i=0; i<count; i++) {
        nodes.push({
            x: 100 + (i * 50) + seededRandom(i)*30, // Spread out
            y: 450 + seededRandom(i+10)*20,          // Vary depth
            scale: 0.7 + seededRandom(i+20)*0.5
        });
    }
    return nodes;
});

// Flowers (Crypto)
const flowerNodes = computed(() => {
    const count = Math.min(20, Math.ceil(assets.value.crypto / 50000)); // 1 Flower per 50k
    const nodes = [];
    for(let i=0; i<count; i++) {
        nodes.push({
            x: 50 + (i * 40) + seededRandom(i+50)*20,
            y: 520 + seededRandom(i+60)*30,
            scale: 0.8 + seededRandom(i+70)*0.4
        });
    }
    return nodes;
});

// Bugs (Debt)
const bugNodes = computed(() => {
    const count = Math.min(10, Math.ceil(assets.value.debt / 100000)); // 1 Bug per 100k
    const nodes = [];
    for(let i=0; i<count; i++) {
        // Bugs target trees (stocks) first!
        const targetTreeIdx = Math.floor(seededRandom(i)*treeNodes.value.length);
        const targetX = treeNodes.value.length > 0 ? treeNodes.value[targetTreeIdx].x : 400;
        const targetY = treeNodes.value.length > 0 ? treeNodes.value[targetTreeIdx].y - 50 : 300;
        
        nodes.push({
            x: targetX + (seededRandom(i)*40 - 20),
            y: targetY + (seededRandom(i)*40 - 20),
            speed: 0.5 + seededRandom(i)*0.5
        });
    }
    return nodes;
});

// Health Status Logic
const healthStatus = computed(() => {
    if (assets.value.debt > assets.value.cash + assets.value.stock) return { text: '瀕臨枯竭 (Critical)', color: 'text-rose-600' };
    if (assets.value.cash < 50000) return { text: '缺水乾旱 (Dry)', color: 'text-amber-500' };
    if (assets.value.stock > 0 && assets.value.debt === 0) return { text: '欣欣向榮 (Thriving)', color: 'text-emerald-600' };
    return { text: '穩定生長 (Stable)', color: 'text-blue-500' };
});

</script>
