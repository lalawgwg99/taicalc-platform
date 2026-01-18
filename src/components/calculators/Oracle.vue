<template>
  <div class="oracle-container min-h-[600px] flex flex-col lg:flex-row gap-6 text-neutral-200">
    <!-- Left Console -->
    <div class="flex-1 flex flex-col gap-4">
      <!-- Input Area -->
      <div
        class="bg-neutral-900/40 border border-neutral-800 p-6 rounded-sm relative overflow-hidden terminal-glow group"
      >
        <div class="absolute top-0 left-0 w-1 h-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></div>
        <div class="absolute inset-0 bg-cyan-900/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
        
        <label class="block text-[10px] font-mono text-cyan-500/80 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
           <span class="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
           QUANTUM_QUERY_VECTOR
        </label>
        
        <div class="flex gap-3 relative">
          <input
            v-model="query"
            @keydown.enter="!isProcessing && handleDivination()"
            :disabled="isProcessing"
            placeholder="[ 輸入你的具體問題... ]"
            class="w-full bg-black/20 border-b border-neutral-700 focus:border-cyan-500 outline-none text-lg py-2 transition-all placeholder:text-neutral-700 font-light text-cyan-50 font-serif tracking-wide"
          />
          <button
            @click="handleDivination"
            :disabled="isProcessing || !query.trim()"
            class="px-6 py-1 text-xs font-bold font-mono border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest relative overflow-hidden"
          >
            <span class="relative z-10">{{ isProcessing ? 'COMPUTING' : 'EXECUTE' }}</span>
          </button>
        </div>
      </div>

      <!-- Logs Display -->
      <div
        class="flex-1 bg-black/60 border border-neutral-800 p-4 rounded-sm font-mono text-xs h-64 lg:h-auto overflow-y-auto relative min-h-[350px] scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
        ref="logsContainer"
      >
        <div class="absolute top-0 right-0 p-2 text-[9px] text-neutral-700 flex gap-2">
            <span>RAM: {{ Math.floor(Math.random()*40 + 20) }}%</span>
            <span>NET: ONLINE</span>
        </div>

        <div v-if="logs.length === 0" class="h-full flex flex-col items-center justify-center text-neutral-700/50 gap-2">
          <svg class="w-8 h-8 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M12 2v20M2 12h20M17 12a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5z" />
          </svg>
          <span class="tracking-widest text-[10px]">SYSTEM READY</span>
        </div>

        <div v-for="log in logs" :key="log.id" class="mb-2 flex items-start gap-3 group animate-fadeIn">
          <span class="text-neutral-700 shrink-0 text-[10px] pt-0.5 font-bold">
            {{
              new Date(log.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            }}
          </span>
          <span
            :class="{
              'text-neutral-400': log.type === 'info',
              'text-emerald-400': log.type === 'success',
              'text-amber-400': log.type === 'warn',
              'text-rose-400': log.type === 'error',
              'text-cyan-600': log.type === 'system',
            }"
            class="leading-relaxed"
          >
            <span class="opacity-50 mr-1">></span>
            <Typewriter :text="log.text" :speed="log.speed || 5" />
          </span>
        </div>
        
        <!-- Loading Indicator -->
        <div v-if="isProcessing" class="mt-2 text-cyan-500/50 text-[10px] animate-pulse pl-12">
            _ CSR_MATRIX_CALCULATION_IN_PROGRESS
        </div>
      </div>

      <!-- Control Panels -->
      <div class="flex flex-col gap-2">
        <!-- Explanation -->
        <Panel title="SYSTEM MANIFEST (系統說明)" icon="info">
          <div class="space-y-4 text-xs leading-relaxed text-neutral-400 p-4">
            <p>
              <strong class="text-cyan-400">SOCRATES AI v4.0</strong> 是一個基於量子疊加態(Quantum Superposition)原理的決策輔助系統。
              透過易經 64 卦的二進位原型，結合 Gemini AI 的語意解析，為您的決策提供「結構化」的戰略建議。
            </p>
            <p class="text-neutral-500 italic">
              "The Oracle matches your entropy with the universe's pattern."
            </p>
          </div>
        </Panel>

        <!-- History -->
        <Panel title="DATA LOGS (歷史記錄)" icon="history" :count="history.length">
          <div class="max-h-40 overflow-y-auto p-1 text-xs">
            <button
                v-for="rec in history"
                :key="rec.id"
                @click="loadHistory(rec)"
                class="w-full text-left p-2 hover:bg-neutral-800/50 rounded group flex justify-between items-center transition-colors border-b border-transparent hover:border-neutral-800"
              >
                <div class="flex items-center gap-2 overflow-hidden">
                    <span class="text-cyan-700 group-hover:text-cyan-400 font-mono text-[10px]">{{ new Date(rec.timestamp).toLocaleDateString() }}</span>
                    <span class="text-neutral-400 group-hover:text-white truncate">{{ rec.query }}</span>
                </div>
                <span class="text-[9px] font-mono text-neutral-600 group-hover:text-cyan-300 uppercase bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">{{ rec.hexagramName }}</span>
              </button>
          </div>
        </Panel>
      </div>
    </div>

    <!-- Right Visuals & Analysis -->
    <div class="w-full lg:w-[480px] shrink-0 flex flex-col gap-6">
      
      <!-- Hexagram Visual Container -->
      <div
        class="bg-black/40 border border-neutral-800 p-6 rounded-sm min-h-[220px] flex items-center justify-center relative overflow-hidden group"
      > 
        <!-- Background Grid -->
        <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

        <div v-if="result" class="flex gap-8 sm:gap-12 relative z-10">
          <!-- Original -->
          <div class="text-center group/hex">
            <div class="text-[9px] font-mono text-cyan-700 mb-2 tracking-widest uppercase group-hover/hex:text-cyan-400 transition-colors">Current State</div>
            <HexagramVisual :lines="result.lines" :animate="true" />
            <div class="mt-4 font-bold text-cyan-400 tracking-[0.2em] text-lg info-pop" style="text-shadow: 0 0 10px rgba(34,211,238,0.5)">
              {{ result.hexagramName }}
            </div>
            <div class="text-[10px] text-cyan-600/60 font-mono mt-1">{{ result.originalBinary }}</div>
          </div>

          <!-- Arrow -->
          <div v-if="result.hasChange" class="flex flex-col justify-center text-neutral-800 info-pop delay-500">
             <div class="w-8 h-px bg-neutral-800 relative">
                 <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-800 rotate-45"></div>
             </div>
          </div>

          <!-- Future -->
          <div v-if="result.hasChange" class="text-center group/hex">
            <div class="text-[9px] font-mono text-amber-700 mb-2 tracking-widest uppercase group-hover/hex:text-amber-500 transition-colors">Projected Vector</div>
            <HexagramVisual :bits="result.futureBinary.split('')" :animate="false" baseColor="bg-amber-600" />
            <div class="mt-4 font-bold text-amber-500 tracking-[0.2em] text-lg info-pop delay-300" style="text-shadow: 0 0 10px rgba(245,158,11,0.5)">
              {{ result.futureHexagramName }}
            </div>
             <div class="text-[10px] text-amber-900/60 font-mono mt-1 info-pop delay-300">{{ result.futureBinary }}</div>
          </div>
        </div>
        
        <div v-else class="text-neutral-800 text-xs font-mono animate-pulse">
            AWAITING_QUANTUM_COLLAPSE...
        </div>
      </div>

      <!-- AI Analysis Output -->
      <div v-if="aiAnalysis" class="space-y-4 info-pop delay-700">
        
        <!-- Narrative Card -->
        <div class="bg-neutral-900/30 border-l-2 border-cyan-500 p-5 backdrop-blur-sm shadow-[0_4px_20px_-10px_rgba(6,182,212,0.1)]">
            <h3 class="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">psychology</span>
                Deep Interpretation
            </h3>
            <p class="text-neutral-300 leading-7 text-sm font-light text-justify">
                <Typewriter :text="aiAnalysis.narrative" :speed="10" />
            </p>
             <div v-if="aiAnalysis.trend" class="mt-4 pt-4 border-t border-dashed border-neutral-800 text-amber-100/90 text-sm italic">
                <span class="text-amber-500 not-italic mr-2">►</span>
                <Typewriter :text="aiAnalysis.trend" :delay="2000" :speed="10" />
            </div>
        </div>

        <!-- Strategic Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Action Protocol -->
             <div class="bg-black/40 border border-neutral-800/60 p-4 rounded-sm">
                <h4 class="text-[10px] font-mono text-emerald-600 uppercase tracking-widest mb-3 border-b border-neutral-900 pb-2">Action Protocol</h4>
                <ul class="space-y-2">
                    <li v-for="(action, i) in aiAnalysis.actions" :key="i" class="flex items-start gap-2 text-xs text-neutral-300 group">
                        <span class="text-emerald-500 font-mono mt-0.5 group-hover:translate-x-1 transition-transform">>></span>
                        {{ action }}
                    </li>
                </ul>
             </div>

             <!-- Risk Assessment -->
             <div class="bg-black/40 border border-neutral-800/60 p-4 rounded-sm">
                <h4 class="text-[10px] font-mono text-rose-600 uppercase tracking-widest mb-3 border-b border-neutral-900 pb-2">Risk Factors</h4>
                <ul class="space-y-2">
                    <li v-for="(risk, i) in aiAnalysis.risks" :key="i" class="flex items-start gap-2 text-xs text-neutral-300">
                        <span class="text-rose-500 font-bold mt-0.5">!</span>
                        {{ risk }}
                    </li>
                </ul>
             </div>
        </div>

        <!-- Reflection -->
        <div class="p-4 border border-neutral-800 bg-neutral-950/30 rounded-sm text-center">
             <div class="text-[9px] text-neutral-600 uppercase tracking-widest mb-2">Reflective Query</div>
             <p class="text-sm font-serif italic text-neutral-400">"{{ aiAnalysis.questions[0] }}"</p>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 justify-center opacity-60">
            <span v-for="tag in aiAnalysis.themes" :key="tag" class="px-2 py-1 text-[10px] border border-neutral-800 rounded text-neutral-500">#{{ tag }}</span>
        </div>

      </div>

      <!-- Loading State for AI -->
      <div v-if="result && !aiAnalysis && !isProcessing" class="p-8 border border-neutral-800 border-dashed rounded-sm flex flex-col items-center justify-center gap-3 text-neutral-600 animate-pulse bg-neutral-900/20">
            <div class="flex gap-1">
                <span class="w-1.5 h-1.5 bg-cyan-700 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 bg-cyan-700 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 bg-cyan-700 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
            <span class="text-[10px] font-mono tracking-widest">DECRYPTING_SIGNAL_FROM_DELPHI_NODE...</span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import Typewriter from './oracle/Typewriter.vue';
import Panel from './oracle/Panel.vue';
import HexagramVisual from './oracle/HexagramVisual.vue';

// --- DATA CONSTANTS ---
const HEX_NAMES = {
  '111111': '乾為天', '000000': '坤為地', '100010': '水雷屯', '010001': '山水蒙', 
  '111010': '水天需', '010111': '天水訟', '010000': '地水師', '000010': '水地比',
  '111011': '風天小畜', '110111': '天澤履', '111000': '地天泰', '000111': '天地否',
  '101111': '天火同人', '111101': '火天大有', '001000': '地山謙', '000100': '雷地豫',
  '100110': '澤雷隨', '011001': '山風蠱', '110000': '地澤臨', '000011': '風地觀',
  '100101': '火雷噬嗑', '101001': '山火賁', '000001': '山地剝', '100000': '地雷復',
  '100111': '天雷無妄', '111001': '山天大畜', '100001': '山雷頤', '011110': '澤風大過',
  '010010': '坎為水', '101101': '離為火', '001110': '澤山咸', '011100': '雷風恆',
  '001111': '天山遯', '111100': '雷天大壯', '000101': '火地晉', '101000': '地火明夷',
  '101011': '風火家人', '110101': '火澤睽', '001010': '水山蹇', '010100': '雷水解',
  '110001': '山澤損', '100011': '風雷益', '111110': '澤天夬', '011111': '天風姤',
  '000110': '澤地萃', '011000': '地風升', '010110': '澤水困', '011010': '水風井',
  '101110': '澤火革', '011101': '火風鼎', '100100': '震為雷', '001001': '艮為山',
  '001011': '風山漸', '110100': '雷澤歸妹', '101100': '雷火豐', '001101': '火山旅',
  '011011': '巽為風', '110110': '兌為澤', '010011': '風水渙', '110010': '水澤節',
  '110011': '風澤中孚', '001100': '雷山小過', '101010': '水火既濟', '010101': '火水未濟'
};

const getHexName = (bin) => HEX_NAMES[bin] || '未知卦';

// --- STATE ---
const query = ref('');
const isProcessing = ref(false);
const result = ref(null);
const aiAnalysis = ref(null);
const logs = ref([]);
const history = ref([]);
const logsContainer = ref(null);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

const addLog = (text, type = 'info', speed = 5) => {
  logs.value.push({ id: uid(), text, type, timestamp: Date.now(), speed });
  nextTick(() => { if (logsContainer.value) logsContainer.value.scrollTop = logsContainer.value.scrollHeight; });
};

// --- CORE LOGIC ---
const handleDivination = async () => {
  if (!query.value.trim()) return;

  isProcessing.value = true;
  result.value = null;
  aiAnalysis.value = null;
  logs.value = [];

  // 1. Simulation Sequence
  addLog('INIT_PROTOCOL > Socrates Kernel v4.2', 'system', 2);
  await sleep(200);
  addLog(`USER_QUERY > "${query.value}"`, 'info', 8);
  await sleep(300);
  addLog('ENTROPY_SEED > Generating true random noise...', 'system', 2);
  
  // Cast Lines logic
  const lines = [];
  for (let i = 0; i < 6; i++) {
        await sleep(100);
        // Simple coin toss simul: 3 coins. H=3, T=2. Sum 6/7/8/9.
        const coins = [0, 0, 0].map(() => (Math.random() > 0.5 ? 3 : 2));
        const sum = coins.reduce((a, b) => a + b, 0);
        lines.push(sum);
        
        let desc = sum === 6 ? 'Old Yin (X)' : sum === 7 ? 'Young Yang' : sum === 8 ? 'Young Yin' : 'Old Yang (O)';
        let type = (sum === 6 || sum === 9) ? 'warn' : 'info';
        addLog(`VECTOR_${i+1} > val[${sum}] : ${desc}`, type, 2);
  }

  const originalBits = lines.map(l => (l === 7 || l === 9 ? '1' : '0')).join('');
  const futureBits = lines.map(l => {
      if (l === 6) return '1'; // yin->yang
      if (l === 9) return '0'; // yang->yin
      return l === 7 ? '1' : '0';
  }).join('');

  const hexName = getHexName(originalBits);
  const futureHexName = getHexName(futureBits);

  addLog(`COLLAPSE > Present: [${hexName}]`, 'success', 5);
  if (originalBits !== futureBits) {
      addLog(`SHIFT > Future: [${futureHexName}]`, 'warn', 5);
  } else {
      addLog('STABLE > No mutation detected.', 'info', 5);
  }

  const calcResult = {
      lines,
      originalBinary: originalBits,
      futureBinary: futureBits,
      hexagramName: hexName,
      futureHexagramName: futureHexName,
      hasChange: originalBits !== futureBits
  };

  result.value = calcResult;
  isProcessing.value = false; // Calculating done, now AI fetch
  
  // 2. AI Interpretation Fetch
  addLog('UPLINK > Connecting to Gemini Interpretation Node...', 'system', 5);
  
  try {
      const response = await fetch('/api/oracle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              query: query.value,
              originalBinary: originalBits,
              futureBinary: futureBits,
              hexagramName: hexName,
              futureHexagramName: futureHexName
          })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      aiAnalysis.value = data.result;
      addLog('SUCCESS > Insight received. Rendering...', 'success', 2);
      
      // Save to History
      const historyItem = {
          id: uid(),
          query: query.value,
          result: calcResult,
          aiAnalysis: data.result,
          hexagramName: hexName,
          timestamp: Date.now()
      };
      history.value.unshift(historyItem);
      if (history.value.length > 20) history.value.pop();

  } catch (err) {
      console.error(err);
      addLog(`ERROR > ${err.message}`, 'error');
      // Fallback mock if API fails
      aiAnalysis.value = {
          narrative: "Connection interference detected. However, the hexagram speaks for itself. " + hexName + " suggests a state of " + (originalBits.includes('111') ? "strong energy" : "yielding receptivity") + ". Please meditate on the visual pattern.",
          trend: "The situation is evolving.",
          themes: ["Uncertainty", "Flux"],
          actions: ["Check your internal purpose", "Wait for clarity"],
          risks: ["Hasty decisions"],
          questions: ["What is your gut telling you?"]
      };
  }
};

const loadHistory = (rec) => {
    query.value = rec.query;
    result.value = rec.result;
    aiAnalysis.value = rec.aiAnalysis;
    logs.value = [{ id: uid(), text: `RELAY_LOG > Loaded: ${rec.hexagramName}`, type: 'system', timestamp: Date.now() }];
};

// Persistence
onMounted(() => {
    const saved = localStorage.getItem('socrates-history-v4');
    if (saved) history.value = JSON.parse(saved);
});
watch(history, (v) => localStorage.setItem('socrates-history-v4', JSON.stringify(v)), { deep: true });

</script>

<style scoped>
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 5px rgba(6,182,212,0.1); }
  50% { box-shadow: 0 0 20px rgba(6,182,212,0.3); border-color: rgba(6,182,212,0.5); }
}
.terminal-glow { animation: glowPulse 4s infinite; }
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateX(-5px); } to { opacity: 1; transform: translateX(0); } }
</style>
