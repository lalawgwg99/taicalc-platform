<template>
  <div class="oracle-container min-h-[600px] flex flex-col lg:flex-row gap-6 text-neutral-200">
    <!-- Left Console -->
    <div class="flex-1 flex flex-col gap-4">
      <!-- Input Area -->
      <div
        class="bg-neutral-900/30 border border-neutral-800 p-4 sm:p-6 rounded-sm relative overflow-hidden terminal-glow"
      >
        <div class="absolute top-0 left-0 w-1 h-full bg-cyan-600/50"></div>
        <label class="block text-xs font-mono text-neutral-500 mb-2 uppercase tracking-widest">
          Input Query Vector
        </label>
        <div class="flex gap-2">
          <input
            v-model="query"
            @keydown.enter="!isProcessing && handleDivination()"
            :disabled="isProcessing"
            placeholder="輸入你的問題 (越具體越準)..."
            class="w-full bg-transparent border-b border-neutral-700 focus:border-cyan-500 outline-none text-base sm:text-lg py-2 transition-colors placeholder:text-neutral-700 font-light text-cyan-100"
          />
          <button
            @click="handleDivination"
            :disabled="isProcessing || !query.trim()"
            class="px-4 py-1 text-sm font-mono border border-cyan-900/40 hover:bg-cyan-900/20 hover:border-cyan-500/50 text-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {{ isProcessing ? 'PROCESSING' : 'EXECUTE' }}
          </button>
        </div>
      </div>

      <!-- Logs Display -->
      <div
        class="flex-1 bg-black/40 border border-neutral-800/80 p-4 rounded-sm font-mono text-xs sm:text-sm h-64 lg:h-auto overflow-y-auto relative min-h-[300px]"
        ref="logsContainer"
      >
        <div class="absolute top-2 right-2 text-[10px] text-neutral-700">KERNEL_LOG</div>

        <div v-if="logs.length === 0" class="h-full flex items-center justify-center text-neutral-800 italic">
          Ready for input...
        </div>

        <div v-for="log in logs" :key="log.id" class="mb-1.5 flex items-start gap-2">
          <span class="text-neutral-600 shrink-0">
            [{{
              new Date(log.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            }}]
          </span>
          <span
            :class="{
              'text-neutral-300': log.type === 'info',
              'text-emerald-400': log.type === 'success',
              'text-amber-400': log.type === 'warn',
              'text-rose-400': log.type === 'error',
              'text-cyan-600': log.type === 'system',
            }"
          >
            <Typewriter :text="log.text" :speed="log.speed || 10" />
          </span>
        </div>
      </div>

      <!-- Control Panels -->
      <div class="flex flex-col gap-2">
        <!-- Explanation -->
        <Panel title="說明 / 使用方式" icon="info">
          <div class="space-y-4 text-xs leading-relaxed text-neutral-400 p-4">
            <div class="space-y-1">
              <div class="text-neutral-200 font-mono tracking-widest">SOCRATES 易經決策支援系統</div>
              <div class="text-neutral-500">
                「宇宙是用數學語言寫成的。」—— 伽利略　｜　「至誠之道，可以前知。」——《中庸》
              </div>
            </div>

            <div>
              <div class="text-cyan-400 font-mono uppercase tracking-widest mb-2">它是什麼？</div>
              <p class="text-neutral-300">
                這不是「保證預測」的工具，而是一套把複雜情境壓縮成 64 種原型的<strong>思考框架</strong>。
                你輸入問題 → 系統生成卦象 → 以「本卦（當下）」與「變卦（走向）」提供結構化理解與行動建議。
              </p>
            </div>

            <div>
              <div class="text-cyan-400 font-mono uppercase tracking-widest mb-2">為什麼看起來會準？</div>
              <ul class="list-disc pl-5 space-y-1">
                <li><span class="text-neutral-200">原型映射</span>：六爻二進位形成 64 種狀態，像「模式庫」協助你辨識局勢類型。</li>
                <li><span class="text-neutral-200">聚焦注意力</span>：把問題說清楚，等於把腦中的雜訊降到最低，決策品質會上升。</li>
                <li><span class="text-neutral-200">自我覺察</span>：你在閱讀卦象時，其實在替自己的情境做「重新詮釋」與「取捨排序」。</li>
              </ul>
            </div>

            <div>
              <div class="text-amber-400 font-mono uppercase tracking-widest mb-2">怎麼問最有效？</div>
              <ul class="list-disc pl-5 space-y-1">
                <li>問題越具體越好：把時間、對象、選項寫出來。</li>
                <li>避免是非題：改問「我該注意什麼 / 什麼會是最大風險 / 先做哪一步？」</li>
                <li>同一件事不要連續重問：先照建議做一個小行動，再回來看是否需要第二次校準。</li>
              </ul>
            </div>

             <div class="text-neutral-500 text-[10px] pt-2 border-t border-neutral-800">
               提示：SOCRATES 是一面鏡子，不是水晶球；它提供的是「更好的理解與選擇」，而不是替你決定命運。
             </div>
          </div>
        </Panel>

        <!-- History -->
        <Panel title="歷史記錄" icon="history" :count="history.length">
          <div class="max-h-56 overflow-y-auto p-2">
            <div v-if="history.length === 0" class="text-center text-neutral-600 py-4 text-xs">尚無記錄</div>
            <div v-else class="space-y-1">
              <button
                v-for="rec in history"
                :key="rec.id"
                @click="loadHistory(rec)"
                class="w-full text-left p-2 hover:bg-neutral-800/50 rounded group"
              >
                <div class="flex justify-between text-neutral-400 group-hover:text-cyan-200">
                  <span class="text-xs truncate max-w-[70%]">{{ rec.query }}</span>
                  <span class="text--[10px] font-mono">{{ rec.hexagramName }}</span>
                </div>
                <div class="text-[10px] text-neutral-600">{{ new Date(rec.timestamp).toLocaleString() }}</div>
              </button>
              <button
                @click="clearHistory"
                class="w-full text-center text-[10px] text-red-900 hover:text-red-500 py-2 mt-2 border-t border-neutral-800 transition-colors"
              >
                清除所有記錄
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>

    <!-- Right Visuals & Analysis -->
    <div class="w-full lg:w-[480px] shrink-0 flex flex-col gap-6">
      <!-- Hexagram Visual -->
      <div
        v-if="result"
        class="bg-black/20 border border-neutral-800 p-6 rounded-sm min-h-[200px] flex items-center justify-center relative overflow-hidden"
      >
        <div class="flex gap-8 sm:gap-12">
          <!-- Original -->
          <div class="text-center">
            <div class="text-[10px] font-mono text-neutral-500 mb-2 tracking-widest uppercase">Current</div>
            <HexagramVisual :lines="result.lines" :animate="true" />
            <div class="mt-3 font-bold text-cyan-400 tracking-widest info-pop">
              {{ getHexagramInfo(result.originalBinary).name }}
            </div>
          </div>

          <!-- Arrow -->
          <div v-if="result.hasChange" class="flex flex-col justify-center text-neutral-700 info-pop delay-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>

          <!-- Future -->
          <div v-if="result.hasChange" class="text-center info-pop delay-800">
            <div class="text-[10px] font-mono text-neutral-500 mb-2 tracking-widest uppercase">Trend</div>
            <HexagramVisual :bits="result.futureBinary.split('')" :animate="false" />
            <div class="mt-3 font-bold text-amber-400 tracking-widest">
              {{ getHexagramInfo(result.futureBinary).name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Structured Analysis -->
      <div v-if="structured" class="space-y-6 info-pop delay-1000">
        <!-- Narrative -->
        <div class="p-4 border-l-2 border-cyan-500 bg-cyan-950/10">
          <p class="text-sm leading-relaxed text-cyan-100">
            {{ structured.narrative }}
          </p>
          <p
            v-if="structured.trend"
            class="text-sm leading-relaxed text-amber-100/80 mt-2 pt-2 border-t border-cyan-900/30"
          >
            {{ structured.trend }}
          </p>
        </div>

        <!-- Themes -->
        <div class="bg-neutral-900/50 p-4 rounded-sm border border-neutral-800">
          <div class="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-3">Core Themes</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="t in structured.themes"
              :key="t"
              class="px-2 py-1 bg-cyan-900/20 border border-cyan-800/50 text-cyan-400 text-xs rounded"
            >
              {{ t }}
            </span>
          </div>
        </div>

        <!-- Actionable -->
        <div class="grid gap-4">
          <div class="bg-neutral-900/50 p-4 rounded-sm border border-neutral-800">
            <div class="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-2">Actions</div>
            <ul class="space-y-2">
              <li v-for="a in structured.actions" :key="a" class="text-sm text-neutral-300 flex items-start gap-2">
                <span class="text-emerald-500 mt-1">›</span> {{ a }}
              </li>
            </ul>
          </div>

          <div class="bg-neutral-900/50 p-4 rounded-sm border border-neutral-800">
            <div class="text-xs font-mono text-rose-500 uppercase tracking-widest mb-2">Risks</div>
            <ul class="space-y-2">
              <li v-for="r in structured.risks" :key="r" class="text-sm text-neutral-300 flex items-start gap-2">
                <span class="text-rose-500 mt-1">!</span> {{ r }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Questions -->
        <div class="p-4 border border-neutral-800 rounded-sm bg-neutral-900/30">
          <div class="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Reflection</div>
          <div class="space-y-3">
            <p v-for="q in structured.questions" :key="q" class="text-sm text-neutral-200 italic font-serif">
              "{{ q }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';

// --- Components ---

// Typewriter
const Typewriter = {
  props: ['text', 'speed'],
  template: `<span>{{ shown }}<span class="inline-block w-2 bg-current animate-caret h-3 align-middle ml-0.5" :class="{ 'opacity-0': done }"></span></span>`,
  setup(props) {
    const shown = ref('');
    const done = ref(false);

    watch(
      () => props.text,
      (newText) => {
        shown.value = '';
        done.value = false;
        let i = 0;
        let alive = true;
        
        const tick = () => {
          if (!alive) return;
          if (i >= newText.length) {
            done.value = true;
            return;
          }
          i++;
          shown.value = newText.slice(0, i);
          const ch = newText[i - 1];
          // Jitter logic: punctuation causes longer pause
          const jitter = ch === ' ' || ch === '.' || ch === ',' || ch === '，' || ch === '。' ? 80 : 0;
          setTimeout(tick, (props.speed || 10) + jitter);
        };
        setTimeout(tick, 20);
        return () => { alive = false; };
      },
      { immediate: true }
    );
    return { shown, done };
  },
};

// Panel
const Panel = {
  props: ['title', 'icon', 'count'],
  template: `
    <div class="bg-neutral-900/30 border border-neutral-800 rounded-sm overflow-hidden">
        <button @click="open = !open" class="w-full px-4 py-3 flex items-center justify-between text-neutral-400 hover:text-white transition-colors">
            <div class="flex items-center gap-2">
                <span class="text-xs font-mono uppercase tracking-widest">{{ title }}</span>
                <span v-if="count !== undefined" class="text-xs text-neutral-600">({{ count }})</span>
            </div>
            <span class="text-xs transform transition-transform" :class="open ? 'rotate-180' : ''">▼</span>
        </button>
        <div class="transition-all duration-300 ease-out overflow-hidden" :class="open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
            <div class="border-t border-neutral-800">
                <slot></slot>
            </div>
        </div>
    </div>
  `,
  setup() {
    const open = ref(false);
    return { open };
  },
};

// YinLine
const YinLine = {
  props: ['changing', 'label'],
  template: `
    <div class="relative w-full h-4 sm:h-5 flex items-center my-1">
        <div class="h-full basis-5/12 rounded-sm transition-colors" :class="changing ? 'bg-amber-600 animate-pulse' : 'bg-neutral-200'"></div>
        <div class="h-full basis-2/12 flex items-center justify-center">
            <span v-if="changing" class="text-[10px] text-amber-300 font-mono animate-bounce">✕</span>
        </div>
        <div class="h-full basis-5/12 rounded-sm transition-colors" :class="changing ? 'bg-amber-600 animate-pulse' : 'bg-neutral-200'"></div>
        <span v-if="label" class="absolute -left-6 text-xs text-neutral-500 font-mono hidden sm:block w-4 text-right">{{ label }}</span>
    </div>
  `
};

// YangLine
const YangLine = {
  props: ['changing', 'label'],
  template: `
    <div class="relative w-full h-4 sm:h-5 flex items-center justify-center my-1">
        <div class="h-full w-full rounded-sm transition-colors" :class="changing ? 'bg-amber-600 animate-pulse' : 'bg-neutral-200'"></div>
        <span v-if="changing" class="absolute text-[10px] text-amber-200 font-mono bg-neutral-900 px-1 rounded animate-pulse">○</span>
        <span v-if="label" class="absolute -left-6 text-xs text-neutral-500 font-mono hidden sm:block w-4 text-right">{{ label }}</span>
    </div>
  `
};

// HexagramVisual
const HexagramVisual = {
  components: { YinLine, YangLine },
  props: ['lines', 'bits', 'animate'],
  template: `
    <div class="flex flex-col w-28 sm:w-32 mx-auto py-2 bg-neutral-900/50 p-3 rounded border border-neutral-800/60">
        <div v-for="(l, i) in displayLines" :key="i" :class="animate ? 'oracle-pop' : ''" :style="{ animationDelay: (i * 90) + 'ms' }">
             <YangLine v-if="l.isYang" :changing="l.isChanging" :label="l.label" />
             <YinLine v-else :changing="l.isChanging" :label="l.label" />
        </div>
    </div>
  `,
  computed: {
    displayLines() {
      const res = [];
      if (this.lines) {
        // lines array: [line1, line2, ..., line6] (bottom to top)
        // map first, then reverse
        const mapped = this.lines.map((val, idx) => ({
             val,
             idx: idx + 1, // 1-based index (bottom is 1)
             isYang: val === 7 || val === 9,
             isChanging: val === 6 || val === 9
        }));
        return mapped.reverse().map(item => ({
            ...item,
            label: String(item.idx)
        }));
      }
      
      if (this.bits) {
         // bits array: ['1', '0', ...] (bottom to top)
         const mapped = this.bits.map((b, idx) => ({
             b,
             idx: idx + 1,
             isYang: b === '1',
             isChanging: false
         }));
         return mapped.reverse().map(item => ({
            ...item,
            label: '' 
         }));
      }
      return [];
    },
  },
};

// --- DATA ---
const HEXAGRAM_DB = {
  '111111': { name: '乾為天', nature: '剛健中正', desc: '大吉。能量充沛，適合啟動新計畫；但忌驕矜，守正則亨。' },
  '000000': { name: '坤為地', nature: '厚德載物', desc: '以柔克剛。順勢承載、配合大局；先穩後進，利於長線累積。' },
  '100010': { name: '水雷屯', nature: '創始維艱', desc: '萬事起頭難。條件未齊，先立基礎、找盟友；耐心推進則可成。' },
  '010001': { name: '山水蒙', nature: '啟蒙求教', desc: '資訊不明、經驗不足。宜請教與學習，先把方法弄清楚再動手。' },
  '111010': { name: '水天需', nature: '等待蓄勢', desc: '前有險阻。先養精蓄銳、備資源；時機到再行動，則能越險。' },
  '010111': { name: '天水訟', nature: '爭端辨明', desc: '易起口舌與衝突。宜求公正調解，退一步求全；不利硬碰硬。' },
  '010000': { name: '地水師', nature: '用師有紀', desc: '動員資源需要統帥與紀律。定規則、明權責，方可成事。' },
  '000010': { name: '水地比', nature: '親比合作', desc: '人心可聚。利於結盟、合作、建立信任；慎選同道，勿濫交。' },
  '111011': { name: '風天小畜', nature: '小積蓄', desc: '密雲不雨。力量尚小，宜小步快跑、累積籌碼，勿急求大成。' },
  '110111': { name: '天澤履', nature: '如履薄冰', desc: '步步為營、守禮守分。能避險過關；越矩則招惹強敵。' },
  '111000': { name: '地天泰', nature: '通達亨泰', desc: '上下相交、氣運暢通。適合推進合作與擴張，把握窗口期。' },
  '000111': { name: '天地否', nature: '閉塞不通', desc: '上下隔絕、資源卡住。宜收斂、修內功；強求合作多徒勞。' },
  '101111': { name: '天火同人', nature: '志同道合', desc: '同心則利。利公開合作與整合資源；以共同目標凝聚群體。' },
  '111101': { name: '火天大有', nature: '富有成果', desc: '資源充足、收穫可期。宜正道用財用權，惠及團隊則更吉。' },
  '001000': { name: '地山謙', nature: '謙虛受益', desc: '低調內強。謙而不卑、實而不張，反得人助與長期福報。' },
  '000100': { name: '雷地豫', nature: '順勢而動', desc: '士氣上揚、氣氛活絡。適合啟動，但須節制，勿樂極生亂。' },
  '100110': { name: '澤雷隨', nature: '隨時應變', desc: '順勢調整策略。跟對人、跟對潮流則吉；固執己見則失機。' },
  '011001': { name: '山風蠱', nature: '整頓革新', desc: '舊弊浮現。宜修補制度、清理腐敗；先除病灶再談成長。' },
  '110000': { name: '地澤臨', nature: '臨事而進', desc: '好運臨門但短暫。宜趁勢推進，同時預留退路，居安思危。' },
  '000011': { name: '風地觀', nature: '觀察示範', desc: '先看後做。適合視察、定位、建立形象；以身作則勝過命令。' },
  '100101': { name: '火雷噬嗑', nature: '剛決除障', desc: '障礙卡喉。需用規則與決斷清除阻礙；但手段要正、要明。' },
  '101001': { name: '山火賁', nature: '文飾有度', desc: '重形象與包裝能加分，但本質更重要。外飾不宜掩蓋問題。' },
  '000001': { name: '山地剝', nature: '剝落衰退', desc: '基礎受損。宜止損、避鋒芒、減少擴張；保存實力待時。' },
  '100000': { name: '地雷復', nature: '復興再起', desc: '一陽來復。低谷後見轉機；宜從小處重建，切忌躁進。' },
  '100111': { name: '天雷無妄', nature: '真誠自然', desc: '動機要純。順其自然、守正不妄作；投機取巧易招災。' },
  '111001': { name: '山天大畜', nature: '厚積薄發', desc: '實力雄厚可涉大川。宜蓄勢、練兵、把控節奏，等待爆發點。' },
  '100001': { name: '山雷頤', nature: '養與節口', desc: '慎言慎食。以養正心、以節自律；口舌是非與消耗要控管。' },
  '011110': { name: '澤風大過', nature: '非常承載', desc: '壓力過載、棟樑將曲。宜用非常手段解套，但要防斷裂風險。' },
  '010010': { name: '坎為水', nature: '重險重關', desc: '險中行。以信心與方法度關；重點是「習坎」：熟悉風險。' },
  '101101': { name: '離為火', nature: '附麗而明', desc: '要有所依附才發光。選對平台/夥伴，保持清明，不可迷失。' },
  '001110': { name: '澤山咸', nature: '感應相通', desc: '真誠互感，直覺敏銳。利於感情與合作；但要分清衝動與感應。' },
  '011100': { name: '雷風恆', nature: '恆久不變', desc: '長期主義得利。堅持初衷與節奏，穩定累積勝過短期爆衝。' },
  '001111': { name: '天山遯', nature: '退避保全', desc: '時局不利，宜退守。遠離消耗與小人，保存實力是智慧。' },
  '111100': { name: '雷天大壯', nature: '強而能正', desc: '勢大力強，但易傷己。要守正與節制，勿以力欺人。' },
  '000101': { name: '火地晉', nature: '晉升明進', desc: '旭日東昇。利升遷、曝光、推進；把握舞台，但避免招妒。' },
  '101000': { name: '地火明夷', nature: '韜光養晦', desc: '光受傷而不顯。宜低調保身、蓄力修整；逞強易再受挫。' },
  '101011': { name: '風火家人', nature: '內治為先', desc: '家/團隊內部規範重要。先整內、後整外，秩序立則萬事順。' },
  '110101': { name: '火澤睽', nature: '分歧相背', desc: '立場不一。宜求同存異，只宜小事；大事硬推多敗。' },
  '001010': { name: '水山蹇', nature: '行止有難', desc: '寸步難行。宜止而反省、改道求助；繞路比硬闖更快。' },
  '010100': { name: '雷水解', nature: '解結釋壓', desc: '雷雨解困。宜主動化解問題、清理舊帳；越早處理越吉。' },
  '110001': { name: '山澤損', nature: '減以成事', desc: '短期犧牲換長期利益。砍掉耗損、聚焦要務，反而更有利。' },
  '100011': { name: '風雷益', nature: '增益得助', desc: '資源下行、得到支持。利於擴張與冒險，但要把助力用在正道。' },
  '111110': { name: '澤天夬', nature: '決斷去邪', desc: '必須果斷公開決策。清除阻礙與小人；但忌暴烈，以正制之。' },
  '011111': { name: '天風姤', nature: '不期而遇', desc: '突發相遇與干擾。機會與風險同來；保持界線，勿被牽著走。' },
  '1000110': { name: '澤地萃', nature: '會聚成勢', desc: '人潮與資源聚集。利組織、社群與募資；同時要防意外與內耗。' },
  '000110': { name: '澤地萃', nature: '會聚成勢', desc: '人潮與資源聚集。利組織、社群與募資；同時要防意外與內耗。' }, 
  '011000': { name: '地風升', nature: '上升成長', desc: '循勢而上，步步登階。利求援見大人；重視流程與耐心。' },
  '010110': { name: '澤水困', nature: '困而守志', desc: '資源枯竭、信任不足。少說多做，守志自持；熬過即轉機。' },
  '010110': { name: '水風井', nature: '制度長養', desc: '井不改而水常新。架構可留，內容要更新；重點在維護與供養。' },
  '101110': { name: '澤火革', nature: '變革更新', desc: '改革到點才成。時機成熟就改制；先獲信任再動刀。' },
  '011101': { name: '火風鼎', nature: '鼎新立制', desc: '建立新秩序、引入新人才。利整合資源、定規格，做長久之器。' },
  '100100': { name: '震為雷', nature: '驚而不亂', desc: '突發震動。能鎮定者得主導；先穩住、再處置。' },
  '001001': { name: '艮為山', nature: '止而後定', desc: '該停就停。休息、反省、斷捨離；把握節奏勝過硬撐。' },
  '001011': { name: '風山漸', nature: '漸進有序', desc: '循序漸進，水到渠成。忌急躁；按階段推進最吉。' },
  '110100': { name: '雷澤歸妹', nature: '位置不當', desc: '衝動結合易後悔。適合短期安排，不利長遠承諾；先校正位置。' },
  '101100': { name: '雷火豐', nature: '盛極需醒', desc: '盛大盈滿。越高峰越要清醒；及時收束與分配，防由盛轉衰。' },
  '001101': { name: '火山旅', nature: '羈旅在外', desc: '變動奔波、環境不穩。宜低調自保、輕裝前行；小事可成。' },
  '011011': { name: '巽為風', nature: '柔入滲透', desc: '以柔克剛，循縫而入。利談判、滲透式推進；但要有底線。' },
  '110110': { name: '兌為澤', nature: '和悅相通', desc: '靠溝通與分享得利。言語是力量也是風險；誠信則吉。' },
  '010011': { name: '風水渙', nature: '渙散再聚', desc: '人心渙散或組織需重整。利用工具重建連結；也可能是解散舊局。' },
  '110010': { name: '水澤節', nature: '節制有度', desc: '有規矩才長久。適度限制能保護成果；過度緊縮則反噬。' },
  '110011': { name: '風澤中孚', nature: '誠信為本', desc: '以誠感人，建立信任。利合作與跨越困難；言行一致最關鍵。' },
  '001100': { name: '雷山小過', nature: '小事可成', desc: '可小事，不可大事。低調、精準、快修正；小幅超越有利。' },
  '101010': { name: '水火既濟', nature: '功成守成', desc: '事已成但易亂。重點轉為維持、檢查、收尾；防後續下滑。' },
  '010101': { name: '火水未濟', nature: '未竟之功', desc: '臨門一腳最關鍵。別急、別鬆；補齊最後缺口，循序完成。' },
};

// --- LOGIC ---

const query = ref('');
const isProcessing = ref(false);
const result = ref(null);
const logs = ref([]);
const history = ref([]);
const logsContainer = ref(null);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

const addLog = (text, type = 'info', speed = 10) => {
  logs.value.push({
    id: uid(),
    text,
    type,
    timestamp: Date.now(),
    speed,
  });
  nextTick(() => {
    if (logsContainer.value) logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
  });
};

const getHexagramInfo = (binary) => HEXAGRAM_DB[binary] || { name: '未知', desc: 'Unknown' };

const handleDivination = async () => {
  if (!query.value.trim()) return;

  isProcessing.value = true;
  result.value = null;
  logs.value = [];

  addLog('BOOT > Socrates Kernel v3.2', 'system', 5);
  await sleep(300);
  addLog(`INPUT > "${query.value}"`, 'info', 8);
  await sleep(300);
  addLog('ENTROPY > syncing noise floor ...', 'system', 2);
  await sleep(400);

  // Cast lines
  const castLine = () => {
    // 3 coins: tail=2, head=3
    const coins = [0, 0, 0].map(() => (Math.random() > 0.5 ? 3 : 2));
    return coins.reduce((a, b) => a + b, 0);
  };

  const lines = [];
  for (let i = 0; i < 6; i++) lines.push(castLine());

  const originalBits = lines.map((l) => (l === 7 || l === 9 ? '1' : '0'));
  const futureBits = lines.map((l) => {
    if (l === 6) return '1'; // yin->yang
    if (l === 9) return '0'; // yang->yin
    return l === 7 ? '1' : '0';
  });

  const changingLines = lines.map((l, i) => (l === 6 || l === 9 ? i : -1)).filter((i) => i !== -1);

  // Log casting
  for (let i = 0; i < 6; i++) {
    await sleep(150);
    const val = lines[i];
    let desc = '';
    let type = 'info';
    if (val === 6) {
      desc = '==X== 老陰 (變)';
      type = 'warn';
    } else if (val === 7) {
      desc = '==== 少陽';
    } else if (val === 8) {
      desc = '== == 少陰';
    } else if (val === 9) {
      desc = '==O== 老陽 (變)';
      type = 'warn';
    }
    addLog(`LINE ${i + 1} > [${val}] ${desc}`, type, 5);
  }

  await sleep(300);
  const originalBinary = originalBits.join('');
  const futureBinary = futureBits.join('');
  const info = getHexagramInfo(originalBinary);

  addLog(`LOCK > HEXAGRAM: ${info.name}`, 'success', 10);

  if (originalBinary !== futureBinary) {
    addLog(`MUTATION > ${changingLines.length} lines changing`, 'warn', 10);
  } else {
    addLog('STABLE > No change detected', 'success', 10);
  }

  const calcResult = {
    lines,
    originalBinary,
    futureBinary,
    hasChange: originalBinary !== futureBinary,
    changingLines,
  };

  // Save
  history.value.unshift({
    id: uid(),
    query: query.value,
    result: calcResult,
    hexagramName: info.name,
    timestamp: Date.now(),
  });
  if (history.value.length > 20) history.value.pop();

  result.value = calcResult;
  isProcessing.value = false;
};

const structured = computed(() => {
  if (!result.value) return null;
  const r = result.value;
  const q = query.value;
  const now = getHexagramInfo(r.originalBinary);
  const future = getHexagramInfo(r.futureBinary);

  // Simple analysis logic port
  const yangCount = r.originalBinary.split('').filter((c) => c === '1').length;
  const yinCount = 6 - yangCount;

  let intensity = '';
  if (yangCount >= 5) intensity = '極陽：推進力強、但容易過衝';
  else if (yangCount === 4) intensity = '偏陽：行動窗口明顯';
  else if (yangCount === 3) intensity = '陰陽均衡：可攻可守';
  else if (yangCount === 2) intensity = '偏陰：先整備、再出手';
  else intensity = '極陰：先止損/修復';

  let themes = [];
  if (yangCount >= 4) themes.push('推進', '決策', '主動權');
  if (yinCount >= 4) themes.push('修復', '整備', '耐心');
  if (r.hasChange) themes.push('轉折', '替代方案');
  else themes.push('穩定', '累積');

  let actions = [];
  actions.push('把問題拆成 1~3 個可驗證假設，先做最小測試');
  if (r.hasChange) actions.push('準備 Plan B：一條替代路線');
  else actions.push('保持節奏：只優化關鍵變數，不推翻架構');

  let risks = [];
  if (yangCount >= 5) risks.push('過度自信', '忽略回饋');
  if (yinCount >= 5) risks.push('拖延', '錯過窗口');
  if (r.hasChange) risks.push('外部變數干擾');

  let questions = ['我現在最害怕失去的是什麼？', '如果只能做一件事讓結果改善 20%，那是什麼？'];

  return {
    narrative: `「${q}」對應本卦「${now.name}」。${intensity}。${now.desc}`,
    trend: r.hasChange ? `趨勢卦為「${future.name}」：${future.desc}` : '局勢穩定，你現在的選擇將持續累積影響。',
    themes,
    actions,
    risks,
    questions,
  };
});

const loadHistory = (rec) => {
  query.value = rec.query;
  result.value = rec.result;
  logs.value = [
    {
      id: uid(),
      text: `LOAD HISTORY > ${rec.hexagramName}`,
      type: 'system',
      timestamp: Date.now(),
    },
  ];
};

const clearHistory = () => {
  if (confirm('Clear all history?')) history.value = [];
};

// Initial Load History
onMounted(() => {
  try {
    const saved = localStorage.getItem('socrates-history');
    if (saved) history.value = JSON.parse(saved);
  } catch (e) {}
});

watch(
  history,
  (newVal) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('socrates-history', JSON.stringify(newVal));
    }
  },
  { deep: true }
);
</script>

<style scoped>
/* Animations */
@keyframes oraclePop {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
    filter: blur(0.4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
.oracle-pop {
  opacity: 0;
  animation: oraclePop 420ms ease-out forwards;
}
.delay-600 {
  animation-delay: 600ms;
}
.delay-800 {
  animation-delay: 800ms;
}
.delay-1000 {
  animation-delay: 1000ms;
}

@keyframes scanline {
  0% {
    transform: translateY(-25%);
    opacity: 0.18;
  }
  100% {
    transform: translateY(140%);
    opacity: 0.18;
  }
}

@keyframes caretBlink {
  0%,
  49% {
    opacity: 0;
  }
  50%,
  100% {
    opacity: 1;
  }
}
.animate-caret {
  animation: caretBlink 800ms steps(1) infinite;
}

@keyframes noiseMove {
  0% {
    transform: translateY(0);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-6%);
    opacity: 0.14;
  }
  100% {
    transform: translateY(0);
    opacity: 0.1;
  }
}

@keyframes glowPulse {
  0%,
  100% {
    box-shadow: 0 0 0 rgba(34, 211, 238, 0);
  }
  50% {
    box-shadow: 0 0 24px rgba(34, 211, 238, 0.1);
  }
}
.terminal-glow {
  animation: glowPulse 4s ease-in-out infinite;
}

.info-pop {
  animation: oraclePop 420ms ease-out forwards;
}
</style>
