<template>
  <div class="calculator-shell space-y-4">
    <section class="overflow-hidden rounded-3xl border border-ink-700 bg-ink-800 text-white shadow-card">
      <div class="relative p-5 sm:p-7">
        <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-400/15 blur-3xl"></div>
        <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-[11px] font-semibold tracking-[.18em] text-brand-300">你的第 {{ state.age }} 歲</p>
            <p class="mt-2 text-sm text-ink-200">目前淨資產</p>
            <p class="mt-1 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">{{ formatMoney(result.netWorth) }}</p>
            <p class="mt-3 max-w-xl text-xs leading-6 text-ink-300">
              這是可重玩的財務情境，不是人生預測。每個選擇會改變現金、固定負擔、幸福感與退休進度。
            </p>
          </div>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[480px]">
            <div class="rounded-2xl bg-white/8 p-3">
              <p class="text-[10px] text-ink-300">現金</p>
              <p class="mt-1 text-sm font-semibold tabular-nums">{{ formatCompact(state.cash) }}</p>
            </div>
            <div class="rounded-2xl bg-white/8 p-3">
              <p class="text-[10px] text-ink-300">投資</p>
              <p class="mt-1 text-sm font-semibold tabular-nums">{{ formatCompact(state.investments) }}</p>
            </div>
            <div class="rounded-2xl bg-white/8 p-3">
              <p class="text-[10px] text-ink-300">年結餘</p>
              <p class="mt-1 text-sm font-semibold tabular-nums" :class="annualSurplus < 0 ? 'text-red-300' : 'text-brand-200'">
                {{ formatSigned(annualSurplus) }}
              </p>
            </div>
            <div class="rounded-2xl bg-white/8 p-3">
              <p class="text-[10px] text-ink-300">退休進度</p>
              <p class="mt-1 text-sm font-semibold tabular-nums">{{ Math.round(result.retirementProgress) }}%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="grid border-t border-white/10 sm:grid-cols-[1fr_auto]">
        <div class="grid grid-cols-2 gap-4 px-5 py-4 sm:px-7">
          <div>
            <div class="flex justify-between text-[10px] text-ink-300"><span>幸福感</span><span>{{ Math.round(state.happiness) }}</span></div>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-brand-300 transition-all" :style="{ width: `${state.happiness}%` }"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-[10px] text-ink-300"><span>壓力</span><span>{{ Math.round(state.stress) }}</span></div>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-amber-300 transition-all" :style="{ width: `${state.stress}%` }"></div></div>
          </div>
        </div>
        <button
          type="button"
          class="m-3 rounded-2xl bg-brand-400 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-40"
          :disabled="finished"
          @click="advanceYear"
        >
          {{ finished ? `已到 ${state.targetAge} 歲` : '前進一年 →' }}
        </button>
      </div>
    </section>

    <section v-if="state.latestEvent" class="flex items-start gap-3 rounded-2xl border p-4" :class="state.latestEvent.cashImpact < 0 ? 'border-amber-200 bg-amber-50' : state.latestEvent.cashImpact > 0 ? 'border-brand-200 bg-brand-50' : 'border-paper-300 bg-paper-200'">
      <span class="text-xl">{{ state.latestEvent.cashImpact < 0 ? '🌧️' : state.latestEvent.cashImpact > 0 ? '✨' : '🌤️' }}</span>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold text-ink-700">今年事件：{{ state.latestEvent.label }}</p>
          <p class="text-sm font-semibold tabular-nums" :class="state.latestEvent.cashImpact < 0 ? 'text-amber-700' : 'text-brand-700'">{{ formatSigned(state.latestEvent.cashImpact) }}</p>
        </div>
        <p class="mt-1 text-xs text-ink-500">{{ state.latestEvent.detail }}</p>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
      <div class="card-surface p-4 sm:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-[10px] font-semibold tracking-[.14em] text-brand-600">LIFE MARKET</p>
            <h2 class="mt-1 text-lg font-semibold text-ink-800">你今年想做什麼？</h2>
          </div>
          <div class="flex gap-2">
            <button type="button" class="btn-ghost text-xs" :disabled="undoStack.length === 0" @click="undo">復原</button>
            <button type="button" class="btn-ghost text-xs" @click="shareResult">{{ copied ? '已複製結果' : '分享結局' }}</button>
          </div>
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <article v-for="choice in choices" :key="choice.id" class="group rounded-2xl border border-paper-300 bg-paper-100 p-4 transition hover:border-brand-200 hover:shadow-card">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-200 text-xl">{{ choice.icon }}</span>
                <div>
                  <h3 class="text-sm font-semibold text-ink-700">{{ choice.label }}</h3>
                  <p class="mt-0.5 text-[10px] text-ink-400">{{ choice.effect }}</p>
                </div>
              </div>
              <span v-if="ownedCount(choice)" class="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">× {{ ownedCount(choice) }}</span>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div class="rounded-xl bg-paper-200 px-3 py-2"><span class="block text-[9px] text-ink-400">一次支出</span><strong class="mt-0.5 block text-ink-700">{{ formatCompact(choice.cost) }}</strong></div>
              <div class="rounded-xl bg-paper-200 px-3 py-2"><span class="block text-[9px] text-ink-400">每年增加</span><strong class="mt-0.5 block text-ink-700">{{ choice.annualCost ? formatCompact(choice.annualCost) : '—' }}</strong></div>
            </div>
            <div class="mt-3 flex gap-2">
              <button
                type="button"
                class="flex-1 rounded-xl bg-ink-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-paper-300 disabled:text-ink-400"
                :disabled="finished || !canBuy(choice)"
                @click="buy(choice)"
              >
                {{ choiceButtonLabel(choice) }}
              </button>
              <button v-if="choice.sellbackRate && ownedCount(choice)" type="button" class="rounded-xl border border-paper-300 px-3 py-2 text-xs text-ink-500 hover:bg-paper-200" @click="sell(choice)">出售</button>
            </div>
          </article>
        </div>

        <div class="mt-4 rounded-2xl border border-azure-100 bg-azure-50/60 p-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p class="text-sm font-semibold text-ink-700">把現金放進投資帳戶</p><p class="mt-1 text-[10px] text-ink-400">只是資產轉移，未來依你設定的報酬情境增減。</p></div>
            <div class="flex flex-wrap gap-2">
              <button v-for="amount in investmentAmounts" :key="amount" type="button" class="rounded-xl border border-azure-200 bg-white px-3 py-2 text-xs font-semibold text-azure-700 disabled:opacity-40" :disabled="state.cash < amount || finished" @click="invest(amount)">投資 {{ formatCompact(amount) }}</button>
            </div>
          </div>
        </div>
      </div>

      <aside class="space-y-4">
        <div class="card-surface p-4 sm:p-5">
          <div class="flex items-center justify-between gap-3">
            <div><p class="text-[10px] font-semibold tracking-[.14em] text-azure-600">TRAJECTORY</p><h2 class="mt-1 text-sm font-semibold text-ink-700">人生資產軌跡</h2></div>
            <span class="text-[10px] text-ink-400">{{ profile.startAge }} → {{ state.targetAge }} 歲</span>
          </div>
          <svg class="mt-4 h-44 w-full overflow-visible" viewBox="0 0 640 180" role="img" aria-label="人生資產變化折線圖">
            <defs><linearGradient id="lifeArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16a085" stop-opacity=".28"/><stop offset="1" stop-color="#16a085" stop-opacity="0"/></linearGradient></defs>
            <line v-for="line in [30, 80, 130]" :key="line" x1="0" :y1="line" x2="640" :y2="line" stroke="#e7e5e4" stroke-width="1" />
            <path :d="areaPath" fill="url(#lifeArea)" />
            <polyline :points="chartPoints" fill="none" stroke="#139b79" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            <circle v-for="point in chartDots" :key="point.age" :cx="point.x" :cy="point.y" r="5" fill="#fff" stroke="#139b79" stroke-width="3" />
          </svg>
          <div class="grid grid-cols-2 gap-2">
            <div class="rounded-xl bg-paper-200 p-3"><p class="text-[9px] text-ink-400">退休目標</p><p class="mt-1 text-xs font-semibold text-ink-700">{{ formatCompact(result.retirementTarget) }}</p></div>
            <div class="rounded-xl bg-paper-200 p-3"><p class="text-[9px] text-ink-400">人生分數</p><p class="mt-1 text-xs font-semibold text-ink-700">{{ result.score }} · {{ result.rank }}</p></div>
          </div>
        </div>

        <details class="card-surface p-4 sm:p-5">
          <summary class="cursor-pointer list-none text-sm font-semibold text-ink-700">調整你的起點與世界規則 <span class="float-right text-brand">＋</span></summary>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <label class="field-label">現在年齡<input v-model.number="profile.startAge" type="number" min="18" max="75" class="input-clean-sm mt-1" /></label>
            <label class="field-label">模擬到幾歲<input v-model.number="profile.targetAge" type="number" min="30" max="90" class="input-clean-sm mt-1" /></label>
            <label class="field-label">每月可支配收入<input v-model.number="profile.monthlyIncome" type="number" min="0" step="1000" class="input-clean-sm mt-1" /></label>
            <label class="field-label">每月基本生活費<input v-model.number="profile.monthlyLivingCost" type="number" min="0" step="1000" class="input-clean-sm mt-1" /></label>
            <label class="field-label">起始現金<input v-model.number="profile.initialCash" type="number" min="0" step="10000" class="input-clean-sm mt-1" /></label>
            <label class="field-label">起始投資<input v-model.number="profile.initialInvestments" type="number" min="0" step="10000" class="input-clean-sm mt-1" /></label>
            <label class="field-label">年收入成長 %<input v-model.number="profile.annualIncomeGrowth" type="number" min="-20" max="30" step="0.5" class="input-clean-sm mt-1" /></label>
            <label class="field-label">投資年報酬 %<input v-model.number="profile.annualInvestmentReturn" type="number" min="-50" max="50" step="0.5" class="input-clean-sm mt-1" /></label>
            <label class="field-label col-span-2">年通膨情境 %<input v-model.number="profile.inflation" type="number" min="-10" max="20" step="0.5" class="input-clean-sm mt-1" /></label>
          </div>
          <button type="button" class="mt-4 w-full rounded-xl bg-brand-500 px-4 py-3 text-xs font-semibold text-white hover:bg-brand-600" @click="restart">用新設定重新開始</button>
        </details>
      </aside>
    </section>

    <section v-if="finished" class="rounded-3xl border border-brand-200 bg-brand-50 p-6 text-center sm:p-8">
      <p class="text-[10px] font-semibold tracking-[.18em] text-brand-700">YOUR ENDING</p>
      <h2 class="mt-3 text-2xl font-semibold text-ink-800">{{ state.targetAge }} 歲的你：{{ result.rank }}</h2>
      <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-500">人生分數 {{ result.score }} 分，淨資產 {{ formatMoney(result.netWorth) }}，退休目標完成 {{ Math.round(result.retirementProgress) }}%。換一組選擇，再看看另一條人生路線。</p>
      <div class="mt-5 flex flex-wrap justify-center gap-2"><button type="button" class="btn-secondary" @click="restart">再玩一次</button><button type="button" class="btn-primary" @click="shareResult">分享這個結局</button></div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {
  advanceLifeYear,
  applyLifeChoice,
  canApplyChoice,
  createLifeState,
  getAnnualSurplus,
  getLifeResult,
  investCash,
  sellLifeChoice,
} from '../../utils/calculators/lifeSimulator';

const storageKey = 'taicalc_life_simulator_v1';
const defaultProfile = {
  startAge: 28,
  targetAge: 65,
  monthlyIncome: 48_000,
  monthlyLivingCost: 28_000,
  initialCash: 300_000,
  initialInvestments: 200_000,
  annualIncomeGrowth: 2,
  annualInvestmentReturn: 5,
  inflation: 2,
  seed: Date.now() % 4_294_967_295,
};

const profile = ref({ ...defaultProfile });
const state = ref(createLifeState(profile.value));
const undoStack = ref([]);
const copied = ref(false);

const choices = [
  { id: 'course', label: '職涯進修', icon: '🎓', effect: '收入情境 +8%', cost: 80_000, annualCost: 0, incomeRateDelta: 8, happiness: 5, stress: 3, maxCount: 2 },
  { id: 'travel', label: '長途旅行', icon: '✈️', effect: '幸福感 +12', cost: 45_000, annualCost: 0, happiness: 12, stress: -8, maxCount: 12 },
  { id: 'scooter', label: '買一台機車', icon: '🛵', effect: '通勤更自由', cost: 100_000, annualCost: 30_000, happiness: 6, stress: 2, sellbackRate: 0.55, maxCount: 1 },
  { id: 'car', label: '擁有一台車', icon: '🚗', effect: '便利，也開始養車', cost: 900_000, annualCost: 180_000, happiness: 9, stress: 7, sellbackRate: 0.6, maxCount: 1 },
  { id: 'wedding', label: '舉辦婚禮', icon: '💍', effect: '一段重要回憶', cost: 500_000, annualCost: 0, happiness: 18, stress: 6, maxCount: 1 },
  { id: 'child', label: '迎接一個孩子', icon: '🍼', effect: '家庭新成員', cost: 200_000, annualCost: 180_000, happiness: 20, stress: 12, maxCount: 3 },
  { id: 'home', label: '準備買房', icon: '🏠', effect: '頭期款＋房貸情境', cost: 2_000_000, annualCost: 360_000, happiness: 15, stress: 15, sellbackRate: 0.85, maxCount: 1 },
  { id: 'sabbatical', label: '休息充電一年', icon: '🌿', effect: '降低壓力', cost: 300_000, annualCost: 0, happiness: 18, stress: -22, maxCount: 2 },
  { id: 'business', label: '嘗試一人創業', icon: '🚀', effect: '收入情境 +20%', cost: 500_000, annualCost: 60_000, incomeRateDelta: 20, happiness: 10, stress: 18, maxCount: 1 },
];

const investmentAmounts = [50_000, 100_000, 300_000];
const annualSurplus = computed(() => Math.round(getAnnualSurplus(state.value)));
const result = computed(() => getLifeResult(state.value));
const finished = computed(() => state.value.age >= state.value.targetAge);

const chartDots = computed(() => {
  const history = state.value.history;
  const values = history.map(item => item.netWorth);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const range = Math.max(1, max - min);
  return history.map((item, index) => ({
    age: item.age,
    x: history.length === 1 ? 0 : index / (history.length - 1) * 640,
    y: 160 - (item.netWorth - min) / range * 140,
  }));
});
const chartPoints = computed(() => chartDots.value.map(point => `${point.x},${point.y}`).join(' '));
const areaPath = computed(() => {
  const dots = chartDots.value;
  if (!dots.length) {
    return '';
  }
  return `M 0 180 L ${dots.map(point => `${point.x} ${point.y}`).join(' L ')} L ${dots[dots.length - 1].x} 180 Z`;
});

const cloneState = value => JSON.parse(JSON.stringify(value));
const remember = () => {
  undoStack.value = [...undoStack.value.slice(-19), cloneState(state.value)];
};
const track = (event, params = {}) => {
  window.taicalcTrackEvent?.(event, { simulator: 'life', age: state.value.age, ...params });
};

const ownedCount = choice => state.value.owned[choice.id] ?? 0;
const canBuy = choice => canApplyChoice(state.value, choice);
const choiceButtonLabel = choice => {
  if ((state.value.owned[choice.id] ?? 0) >= (choice.maxCount ?? 1)) {
    return '已完成';
  }
  if (state.value.cash < choice.cost) {
    return `還差 ${formatCompact(choice.cost - state.value.cash)}`;
  }
  return '選擇這條路';
};

const buy = choice => {
  remember();
  state.value = applyLifeChoice(state.value, choice);
  track('life_choice', { choice_id: choice.id, choice_cost: choice.cost });
};
const sell = choice => {
  remember();
  state.value = sellLifeChoice(state.value, choice);
  track('life_choice_sell', { choice_id: choice.id });
};
const invest = amount => {
  remember();
  state.value = investCash(state.value, amount);
  track('life_invest', { amount });
};
const advanceYear = () => {
  remember();
  state.value = advanceLifeYear(state.value);
  track('life_year_advance', { net_worth: result.value.netWorth });
  if (finished.value) {
    track('calculation_complete', { result_value: result.value.netWorth, life_score: result.value.score });
  }
};
const undo = () => {
  const previous = undoStack.value.at(-1);
  if (!previous) {
    return;
  }
  state.value = previous;
  undoStack.value = undoStack.value.slice(0, -1);
};
const restart = () => {
  profile.value.seed = Date.now() % 4_294_967_295;
  state.value = createLifeState(profile.value);
  undoStack.value = [];
  track('life_restart');
};

const shareResult = async () => {
  const text = `我的 TaiCalc 人生模擬結局：${state.value.age} 歲「${result.value.rank}」\n人生分數 ${result.value.score}，淨資產 ${formatMoney(result.value.netWorth)}，退休進度 ${Math.round(result.value.retirementProgress)}%\n你會走出哪一條人生？ https://taicalc.com/tools/life-simulator`;
  try {
    if (navigator.share) {
      await navigator.share({ title: '我的 TaiCalc 人生模擬結局', text, url: 'https://taicalc.com/tools/life-simulator' });
      track('share', { method: 'native', content_type: 'life_simulator_result' });
      return;
    }
    await navigator.clipboard.writeText(text);
    copied.value = true;
    track('result_copy', { copy_method: 'life_simulator_result' });
    window.setTimeout(() => { copied.value = false; }, 1800);
  } catch {
    // 分享被取消或瀏覽器不支援時維持原畫面。
  }
};

const formatMoney = value => `${value < 0 ? '-' : ''}NT$ ${Math.abs(Math.round(value)).toLocaleString('zh-TW')}`;
const formatCompact = value => {
  const absolute = Math.abs(value);
  const prefix = value < 0 ? '-' : '';
  if (absolute >= 10_000_000) {
    return `${prefix}${(absolute / 10_000_000).toFixed(1)} 千萬`;
  }
  if (absolute >= 10_000) {
    return `${prefix}${Math.round(absolute / 10_000)} 萬`;
  }
  return `${prefix}${Math.round(absolute).toLocaleString('zh-TW')}`;
};
const formatSigned = value => `${value >= 0 ? '+' : '-'} ${formatCompact(Math.abs(value))}`;

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }
    const parsed = JSON.parse(saved);
    if (parsed.profile && parsed.state) {
      profile.value = parsed.profile;
      state.value = parsed.state;
    }
  } catch {
    // 無效的舊版資料會安全回到預設情境。
  }
});

watch([profile, state], () => {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ profile: profile.value, state: state.value }));
  } catch {
    // 隱私模式禁用儲存時，模擬器仍可繼續使用。
  }
}, { deep: true });
</script>

<style scoped>
.field-label { font-size: .65rem; font-weight: 600; color: #78716c; }
button:disabled { box-shadow: none; }
</style>
