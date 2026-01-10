<template>
  <div class="space-y-6">
    <!-- Mode Switcher -->
    <div class="flex p-1 bg-stone-100 rounded-xl relative">
      <div
        class="absolute inset-y-1 w-1/2 bg-white shadow-sm rounded-lg transition-all duration-300 ease-out"
        :class="calcMode === 'installment' ? 'left-1' : 'left-1/2 -ml-1'"
      ></div>
      <button
        @click="calcMode = 'installment'"
        class="relative w-1/2 py-2 text-sm font-bold transition-colors z-10"
        :class="calcMode === 'installment' ? 'text-stone-800' : 'text-stone-500 hover:text-stone-700'"
      >
        分期試算
      </button>
      <button
        @click="calcMode = 'revolving'"
        class="relative w-1/2 py-2 text-sm font-bold transition-colors z-10"
        :class="calcMode === 'revolving' ? 'text-stone-800' : 'text-stone-500 hover:text-stone-700'"
      >
        循環利息試算
      </button>
    </div>

    <div>
      <label for="amount" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
        {{ calcMode === 'installment' ? '消費金額' : '信用卡未繳餘額' }}
      </label>
      <div class="relative">
        <span class="absolute left-4 top-3.5 text-stone-400 font-medium">$</span>
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-8 pr-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>
    </div>

    <!-- Installment Mode Inputs -->
    <div v-if="calcMode === 'installment'" class="space-y-6">
      <div>
        <span class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">分期期數</span>
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="n in [3, 6, 12, 18, 24]"
            :key="n"
            @click="installments = n"
            :aria-label="'選擇' + n + '期'"
            :class="['py-2.5 rounded-xl text-sm font-bold transition-all border', 
              installments === n ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100']"
          >
            {{ n }}期
          </button>
        </div>
      </div>

      <div>
        <label for="feePercent" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
          總手續費率 (%)
        </label>
        <div class="relative">
          <input
            id="feePercent"
            type="number"
            v-model.number="feePercent"
            step="0.1"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <span class="absolute right-4 top-3.5 text-stone-400 text-sm font-medium">%</span>
        </div>
      </div>

      <!-- 結果 (Installment) -->
      <div class="bg-stone-50 rounded-2xl p-4 md:p-6 border border-stone-200">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="text-center">
            <p class="text-stone-500 text-xs font-medium mb-1">每月應繳</p>
            <p class="text-2xl font-bold text-stone-800 font-mono tracking-tight">
              <span class="text-base text-stone-400 mr-1">$</span>{{ monthlyPayment }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-stone-500 text-xs font-medium mb-1">多付利息</p>
            <p class="text-2xl font-bold text-rose-500 font-mono tracking-tight">
              <span class="text-base text-rose-300 mr-1">$</span>{{ totalInterest }}
            </p>
          </div>
        </div>

        <div class="pt-5 border-t border-stone-200 flex flex-col items-center gap-2">
          <p class="text-stone-600 text-sm font-medium">
            總共付款 <span class="text-stone-900 font-bold font-mono text-lg">${{ totalPayment }}</span>
          </p>
          <div class="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
            真實年利率 (IRR) 約 <span class="text-lg ml-1">{{ annualRate }}%</span>
          </div>
        </div>
      </div>

      <div v-if="totalInterest > 0" class="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
        <span class="text-lg">💡</span>
        <p class="text-amber-800 text-xs leading-relaxed font-medium">
          注意：這 <span class="font-bold">${{ totalInterest.toLocaleString() }}</span>
          是隱藏成本。很多標榜「0利率」的分期，其實透過「手續費」將利息灌在總價中，請務必精算。
        </p>
      </div>
    </div>

    <!-- Revolving Mode Inputs -->
    <div v-else class="space-y-6">
      <div>
        <label
          for="revolvingRate"
          class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
        >
          循環年利率 (%)
        </label>
        <div class="relative">
          <input
            id="revolvingRate"
            type="number"
            v-model.number="revolvingRate"
            step="0.1"
            max="16"
            placeholder="15"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
          <span class="absolute right-4 top-3.5 text-stone-400 text-sm font-medium">%</span>
        </div>
        <p class="text-[10px] text-stone-400 mt-1">法規上限為 15%，通常介於 5%~15% 之間。</p>
      </div>

      <!-- 結果 (Revolving) -->
      <div class="bg-rose-50 rounded-2xl p-4 md:p-6 border border-rose-100">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="text-center">
            <p class="text-stone-500 text-xs font-medium mb-1">每日產生利息</p>
            <p class="text-2xl font-bold text-stone-800 font-mono tracking-tight">
              <span class="text-base text-stone-400 mr-1">$</span>{{ dailyInterest }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-stone-500 text-xs font-medium mb-1">每月累積利息 (預估)</p>
            <p class="text-2xl font-bold text-rose-600 font-mono tracking-tight">
              <span class="text-base text-rose-400 mr-1">$</span>{{ monthlyRevolvingInterest }}
            </p>
          </div>
        </div>
        <div class="pt-5 border-t border-rose-200/50 flex flex-col items-center gap-2">
          <div class="flex items-center gap-2 text-rose-800 text-sm font-bold">
            <span>⚠️ 這是高利貸等級的利息</span>
          </div>
        </div>
      </div>

      <div class="flex items-start gap-3 bg-stone-800 text-white border border-stone-700 rounded-xl p-4">
        <span class="text-lg">💸</span>
        <p class="text-stone-200 text-xs leading-relaxed font-medium">
          循環利息是以<span class="text-yellow-400 font-bold">「日」</span>計算。若只繳最低應繳金額，剩餘本金會每日滾息，非常可怕。建議優先償還此類債務。
        </p>
      </div>
    </div>
  </div>

  <!-- Carrefour Uniopen Calculator Section -->
  <section class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200 mt-8 space-y-6">
    <header class="flex items-center justify-between mb-4 border-b border-stone-100 pb-4">
      <div>
        <h2 class="text-xl font-bold text-stone-800 flex items-center gap-2">
          家樂福 uniopen 回饋試算
          <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold border border-blue-200">Beta</span>
        </h2>
        <p class="text-xs text-stone-400 mt-1">最高 11% 回饋攻略 · 點數 / 折價券試算</p>
      </div>
    </header>

    <!-- Inputs -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="min-w-0 w-full">
          <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">消費日期</label>
          <input
            type="date"
            v-model="uniData.txDate"
            class="input-base block w-full appearance-none min-w-0 bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300 text-sm"
            style="width: 100%; box-sizing: border-box;"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">金額 (NT$)</label>
          <input
            type="number"
            v-model.number="uniData.txAmount"
            class="input-base w-full bg-stone-50 font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300 text-sm"
            placeholder="5000"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">通路</label>
          <div class="input-base w-full bg-stone-100 text-stone-500 cursor-not-allowed bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300 text-sm">
            家樂福量販店 (實體)
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">支付方式</label>
          <div class="input-base w-full bg-stone-100 text-stone-500 cursor-not-allowed bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300 text-sm">
            UNIopen 聯名卡 (含綁定支付)
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">是否分期</label>
          <select
            v-model="uniData.txInstallment"
            class="input-base w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300 text-sm"
          >
            <option value="no">否 (全額付清)</option>
            <option value="yes">是 (點數不適用/折價券適用)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">商品類型</label>
          <select
            v-model="uniData.txProductType"
            class="input-base w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300 text-sm"
          >
            <option value="other">其他一般商品</option>
            <option value="appliance">家電</option>
            <option value="fresh">生鮮</option>
            <option value="private_label">自有品牌</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">折價券當日領取狀況</label>
          <select
            v-model="uniData.voucherDailyOk"
            class="input-base w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300 text-sm"
          >
            <option value="unknown">不確定 (預設試算)</option>
            <option value="yes">尚未領取 (今日第一筆)</option>
            <option value="no">已領取過 (不重複回饋)</option>
          </select>
        </div>
      </div>

      <!-- Advanced / Bonus Section -->
      <div class="border border-stone-100 rounded-xl overflow-hidden bg-white p-4 mt-4 space-y-4">
        <h3 class="text-xs font-bold text-stone-600 border-b border-stone-100 pb-2">進階設定 (2% 上限 / 踩點加碼)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-stone-500 mb-1">統一集團品牌消費確認</label>
            <select
              v-model="uniData.optUniBrandTx"
              class="input-base w-full text-sm py-2 bg-stone-50 border border-stone-200 rounded-xl px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300"
            >
              <option value="auto">自動判斷</option>
              <option value="yes">強制設為是</option>
              <option value="no">強制設為否</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-stone-500 mb-1">本月已獲得統一集團 2% 點數</label>
            <input
              type="number"
              v-model.number="uniData.optUni2Used"
              class="input-base w-full text-sm py-2 bg-stone-50 border border-stone-200 rounded-xl px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300"
              placeholder="0-500"
            />
            <p class="text-[10px] text-stone-400 mt-1">每月上限 500 點，填寫已獲得點數以精算剩餘額度。</p>
          </div>
          <div>
            <label class="block text-xs text-stone-500 mb-1">uniopen 會員連結 (踩點加碼)</label>
            <select
              v-model="uniData.optLinked"
              class="input-base w-full text-sm py-2 bg-stone-50 border border-stone-200 rounded-xl px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300"
            >
              <option value="yes">已連結</option>
              <option value="no">未連結</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-stone-500 mb-1">本月踩點家數 (0-5+)</label>
            <select
              v-model.number="uniData.optSteps"
              class="input-base w-full text-sm py-2 bg-stone-50 border border-stone-200 rounded-xl px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-300"
            >
              <option :value="0">0 家</option>
              <option :value="1">1 家 (無加碼)</option>
              <option :value="2">2 家 (+1%)</option>
              <option :value="3">3 家 (+2%)</option>
              <option :value="4">4 家 (+3%)</option>
              <option :value="5">5 家以上 (+4%)</option>
            </select>
            <p class="text-[10px] text-stone-400 mt-1">需含本次消費之不同品牌數，每月上限 500 點。</p>
          </div>
        </div>

        <div class="pt-2 border-t border-stone-50">
          <button @click="uniShowEditor = !uniShowEditor" class="text-[10px] text-stone-300 hover:text-stone-500">
            {{ uniShowEditor ? '隱藏規則編輯器' : '規則編輯器' }}
          </button>
          <div v-if="uniShowEditor" class="mt-2">
            <textarea
              v-model="uniPromoJson"
              class="w-full h-48 font-mono text-xs bg-stone-900 text-green-400 p-4 rounded-xl focus:outline-none"
              spellcheck="false"
            ></textarea>
            <div class="flex gap-2 mt-2">
              <button
                @click="resetUniPromos"
                class="px-3 py-1 bg-stone-200 text-stone-600 rounded text-xs hover:bg-stone-300"
              >
                恢復預設
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Points -->
        <div class="bg-white/80 rounded-lg p-3 shadow-sm">
          <p class="text-xs text-stone-500 uppercase font-bold mb-1">OPENPOINT 點數</p>
          <p class="text-2xl font-black text-blue-600 font-mono">{{ fmt(uniResult.points) }}</p>
          <p class="text-[10px] text-stone-400 mt-1 leading-tight">{{ uniResult.pointsNote }}</p>
        </div>
        <!-- Voucher -->
        <div class="bg-white/80 rounded-lg p-3 shadow-sm">
          <p class="text-xs text-stone-500 uppercase font-bold mb-1">家樂福折價券 (元)</p>
          <p class="text-2xl font-black text-emerald-600 font-mono">{{ fmt(uniResult.voucher) }}</p>
          <p class="text-[10px] text-stone-400 mt-1 leading-tight">{{ uniResult.voucherNote }}</p>
        </div>
      </div>

      <!-- Tag -->
      <div class="flex items-start gap-2 mb-4">
        <span class="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">適用</span>
        <p class="text-xs text-stone-600">{{ uniResult.activePromoTag }}</p>
      </div>

      <!-- Breakdown / Warnings -->
      <div class="space-y-3 pt-3 border-t border-blue-200/50">
        <!-- Warnings -->
        <div
          v-if="uniResult.warns.length > 0"
          class="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg border border-orange-100"
        >
          <p v-for="(w, i) in uniResult.warns" :key="i" class="flex gap-1.5 mb-1 last:mb-0">
            <span>⚠️</span> <span>{{ w }}</span>
          </p>
        </div>
        <!-- Errors -->
        <div
          v-if="uniResult.errors.length > 0"
          class="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-100"
        >
          <p v-for="(e, i) in uniResult.errors" :key="i" class="flex gap-1.5 mb-1 last:mb-0">
            <span>🚫</span> <span>{{ e }}</span>
          </p>
        </div>

        <!-- Details -->
        <div class="mt-3">
          <p class="text-xs text-stone-500 font-bold mb-2">查看詳細計算過程</p>
          <ul class="space-y-1 pl-4 border-l-2 border-stone-200 text-[11px] text-stone-500">
            <li v-for="(line, i) in uniResult.breakdown" :key="i">{{ line }}</li>
            <li v-if="uniResult.breakdown.length === 0">無資料</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';

const amount = ref(30000);
const calcMode = ref('installment'); // 'installment' or 'revolving'

// Installment State
const installments = ref(12);
const feePercent = ref(4.5);

// Revolving State
const revolvingRate = ref(15);

// Installment Computed
const totalInterest = computed(() => {
  if (calcMode.value !== 'installment') return 0;
  return Math.round((amount.value || 0) * (feePercent.value / 100));
});

const totalPayment = computed(() => {
  if (calcMode.value !== 'installment') return 0;
  return (amount.value || 0) + totalInterest.value;
});

const monthlyPayment = computed(() => {
  if (calcMode.value !== 'installment') return 0;
  return Math.round(totalPayment.value / installments.value);
});

// Revolving Computed
const dailyInterest = computed(() => {
  if (calcMode.value !== 'revolving') return 0;
  // Principle * Rate% / 365
  const p = amount.value || 0;
  const r = revolvingRate.value || 0;
  return Math.round((p * (r / 100)) / 365);
});

const monthlyRevolvingInterest = computed(() => {
  if (calcMode.value !== 'revolving') return 0;
  // Estimate 30 days
  return dailyInterest.value * 30;
});

// IRR for Installment... stays same
// 簡單估算年化利率：(總手續費率 / 期數) * 12 * 2 (約略值，IRR會更精確但這裡用簡單公式逼近)
// 這裡用簡易平攤法：(費率/期數)*12 * 1.9 (約略係數)?
const annualRate = computed(() => {
  if (calcMode.value !== 'installment') return 0;
  if (!installments.value || !feePercent.value) return 0;
  const r = (feePercent.value / installments.value) * 12 * 1.9;
  return Math.min(Math.round(r * 10) / 10, 100);
});

/* --- Carrefour Uniopen Logic --- */
// Utils
const pad2 = (n) => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
};
const parseDateYMD = (ymd) => {
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};
const inDateRange = (txYmd, startYmd, endYmd) => {
  const tx = parseDateYMD(txYmd);
  const st = parseDateYMD(startYmd);
  const en = parseDateYMD(endYmd);
  if (!tx || !st || !en) return false;
  const txT = tx.getTime();
  return txT >= st.getTime() && txT <= en.getTime();
};
const fmt = (n) => (n ? n.toLocaleString() : '0');

// Default Promos (Source of Truth)
const DEFAULT_PROMOS = {
  version: '2026-01-08-uni2-cap-500-style-taicalc',
  promos: [
    {
      id: 'base_1pct',
      title: '一般消費 1% OPENPOINT',
      rewardType: 'OPENPOINT',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      applies: { requiresUniopenCard: true },
      calc: { kind: 'rate_points', rate: 0.01 },
    },
    {
      id: 'uni_group_2pct_cap500',
      title: '統一企業集團品牌加碼 2% (月上限 500 點)',
      rewardType: 'OPENPOINT',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      applies: { requiresUniopenCard: true, requiresUniBrandTx: true },
      calc: { kind: 'rate_points', rate: 0.02, capMonthlyPoints: 500, capMonthlyKey: 'uni2' },
    },
    {
      id: 'step_bonus_tiered',
      title: '統一集團踩點任務加碼 (最高 4%)',
      rewardType: 'OPENPOINT',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      applies: { requiresUniopenCard: true, requiresUniBrandTx: true, requiresLinked: true, minSteps: 2 },
      calc: {
        kind: 'step_tiered',
        rates: { 2: 0.01, 3: 0.02, 4: 0.03, 5: 0.04 },
        capMonthlyPoints: 500,
        capMonthlyKey: 'steps',
      },
    },
    {
      id: 'cny_appliance_wave1_mass_4pct',
      title: '家電尾牙 第一波 (量販/家電) 4% 折價券',
      rewardType: 'VOUCHER',
      startDate: '2025-12-26',
      endDate: '2026-02-28',
      applies: {
        requiresUniopenCard: true,
        channels: ['store_mass'],
        productTypes: ['appliance'],
        minSpend: 3000,
        voucherDailyOnce: true,
      },
      calc: { kind: 'rate_twd', rate: 0.04, capPerHitTwd: 2000 },
    },
    {
      id: 'cny_wave2_mass_4pct',
      title: '家電尾牙 第二波 (量販) 4% 折價券',
      rewardType: 'VOUCHER',
      startDate: '2026-01-21',
      endDate: '2026-02-28',
      applies: { requiresUniopenCard: true, channels: ['store_mass'], minSpend: 2500, voucherDailyOnce: true },
      calc: { kind: 'rate_twd', rate: 0.04, capPerHitTwd: 2000 },
    },
    {
      id: 'cny_wave2_super_4pct',
      title: '家電尾牙 第二波 (超市) 4% 折價券',
      rewardType: 'VOUCHER',
      startDate: '2026-01-21',
      endDate: '2026-02-28',
      applies: { requiresUniopenCard: true, channels: ['store_super'], minSpend: 1000, voucherDailyOnce: true },
      calc: { kind: 'rate_twd', rate: 0.04, capPerHitTwd: 2000 },
    },
  ],
};

const uniData = reactive({
  txDate: todayStr(),
  txAmount: 3000,
  txChannel: 'store_mass',
  txPay: 'uniopen_card_ok',
  txInstallment: 'no',
  txProductType: 'appliance',
  voucherDailyOk: 'unknown',
  optUniBrandTx: 'yes',
  optUni2Used: '',
  optLinked: 'yes',
  optSteps: 0,
});
const uniShowAdvanced = ref(true);
const uniShowEditor = ref(false);
const uniPromoJson = ref(JSON.stringify(DEFAULT_PROMOS, null, 2));

const uniResult = reactive({
  points: 0,
  pointsNote: '—',
  voucher: 0,
  voucherNote: '—',
  activePromoTag: '—',
  warns: [],
  errors: [],
  breakdown: [],
});

const resetUniPromos = () => {
  uniPromoJson.value = JSON.stringify(DEFAULT_PROMOS, null, 2);
};

const calculateUniRewards = () => {
  uniResult.points = 0;
  uniResult.voucher = 0;
  uniResult.warns = [];
  uniResult.errors = [];
  uniResult.breakdown = [];
  const activeTitles = [];

  const txDate = uniData.txDate || todayStr();
  const amount = Number(uniData.txAmount || 0);
  if (amount <= 0) uniResult.errors.push('請輸入大於 0 的金額');

  const uniopenCard = uniData.txPay === 'uniopen_card_ok';
  const installment = uniData.txInstallment === 'yes';

  if (uniData.voucherDailyOk === 'unknown')
    uniResult.warns.push('注意：若今日已領過折價券，請記得將「當日領取狀況」改為已領取');
  if (installment) uniResult.warns.push('分期提醒：OPENPOINT 點數不適用分期，但折價券可能適用。');

  let uniBrandTx = false;
  if (uniData.optUniBrandTx === 'yes') uniBrandTx = true;
  else if (uniData.optUniBrandTx === 'no') uniBrandTx = false;
  else uniBrandTx = uniData.txChannel === 'uni_group_other';

  let uni2UsedPoints = 0;
  if (uniData.optUni2Used !== '' && !isNaN(Number(uniData.optUni2Used))) {
    uni2UsedPoints = Math.min(500, Math.max(0, Number(uniData.optUni2Used)));
  }

  let promos = [];
  try {
    const obj = JSON.parse(uniPromoJson.value);
    if (obj && Array.isArray(obj.promos)) promos = obj.promos;
    else throw new Error('無效的 promos 陣列');
  } catch (e) {
    uniResult.errors.push('活動規則 JSON 格式錯誤: ' + e.message);
    return;
  }

  const tx = {
    txDate,
    amount,
    channel: uniData.txChannel,
    productType: uniData.txProductType,
    uniopenCard,
    installment,
    linked: uniData.optLinked,
    steps: uniData.optSteps,
    uniBrandTx,
    voucherDailyOk: uniData.voucherDailyOk,
    uni2UsedPoints,
  };

  let points = 0;
  const voucherCandidates = [];

  for (const p of promos) {
    if (!inDateRange(txDate, p.startDate, p.endDate)) continue;

    let applyOk = true;
    let whyNot = '';

    const a = p.applies || {};
    if (tx.installment && p.rewardType === 'OPENPOINT') {
      applyOk = false;
      whyNot = '分期不適用 (點數)';
    } else if (a.requiresUniopenCard && !tx.uniopenCard) {
      applyOk = false;
      whyNot = '非聯名卡';
    } else if (a.channels && !a.channels.includes(tx.channel)) {
      applyOk = false;
      whyNot = '通路不符';
    } else if (a.productTypes && !a.productTypes.includes(tx.productType)) {
      applyOk = false;
      whyNot = '商品類型不符';
    } else if (typeof a.minSpend === 'number' && tx.amount < a.minSpend) {
      applyOk = false;
      whyNot = `未達門檻 $${a.minSpend}`;
    } else if (a.voucherDailyOnce && p.rewardType === 'VOUCHER' && tx.voucherDailyOk === 'no') {
      applyOk = false;
      whyNot = '今日已領過';
    } else if (a.requiresUniBrandTx && !tx.uniBrandTx) {
      applyOk = false;
      whyNot = '非統一集團品牌';
    } else if (a.requiresLinked && tx.linked !== 'yes') {
      applyOk = false;
      whyNot = '未連結會員';
    } else if (typeof a.minSteps === 'number' && tx.steps < a.minSteps) {
      applyOk = false;
      whyNot = `踩點不足 (${tx.steps}<${a.minSteps})`;
    }

    if (!applyOk) {
      if (tx.installment && p.rewardType === 'OPENPOINT') {
        uniResult.breakdown.push(`[排除] ${p.title}: ${whyNot}`);
      }
      continue;
    }

    const c = p.calc || {};
    let rewardVal = 0;
    let logLine = '';

    if (p.rewardType === 'OPENPOINT') {
      let rate = c.rate || 0;
      if (c.kind === 'step_tiered' && c.rates) {
        const s = Math.min(5, Math.max(0, tx.steps));
        rate = c.rates[s] || 0;
        if (rate === 0) {
          uniResult.breakdown.push(`[跳過] ${p.title}: 踩點數 ${s} 無對應加碼`);
          continue;
        }
      }

      const raw = Math.floor(tx.amount * rate);
      if (typeof c.capMonthlyPoints === 'number') {
        const used = c.capMonthlyKey === 'uni2' ? tx.uni2UsedPoints : 0;
        const remaining = Math.max(0, c.capMonthlyPoints - used);
        rewardVal = Math.min(raw, remaining);
        logLine = `[點數] ${p.title} (${(rate * 100).toFixed(0)}%): 原 ${raw} 點，上限剩 ${remaining}，得 ${rewardVal} 點`;
      } else {
        rewardVal = raw;
        logLine = `[點數] ${p.title} (${(rate * 100).toFixed(0)}%): ${rewardVal} 點`;
      }
      points += rewardVal;
      activeTitles.push(p.title);
      uniResult.breakdown.push(logLine);
    } else if (p.rewardType === 'VOUCHER' && c.kind === 'rate_twd') {
      let v = Math.round(tx.amount * c.rate);
      if (typeof c.capPerHitTwd === 'number') v = Math.min(v, c.capPerHitTwd);
      voucherCandidates.push({ promo: p, amount: v });
      uniResult.breakdown.push(`[折價券候選] ${p.title}: $${v}`);
    }
  }

  let bestVoucher = null;
  if (tx.voucherDailyOk === 'no') {
    uniResult.voucherNote = '今日已領過 (每日一次)';
  } else if (voucherCandidates.length > 0) {
    bestVoucher = voucherCandidates.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev));
    uniResult.voucher = bestVoucher.amount;
    activeTitles.push(bestVoucher.promo.title);
    uniResult.voucherNote = `採用: ${bestVoucher.promo.title}`;
    uniResult.breakdown.push(`[折價券擇優] 採用 ${bestVoucher.promo.title}: $${uniResult.voucher}`);
  } else {
    uniResult.voucherNote = '無符合條件';
  }

  uniResult.points = points;
  uniResult.pointsNote = installment ? '分期不適用 (0點)' : points > 0 ? '已加總符合活動' : '無符合活動';

  uniResult.activePromoTag =
    activeTitles.length > 0 ? activeTitles.slice(0, 2).join(' / ') + (activeTitles.length > 2 ? '...' : '') : '無';
};

watch(uniData, () => calculateUniRewards(), { deep: true });
watch(uniPromoJson, () => calculateUniRewards());

onMounted(() => {
  calculateUniRewards();
});
</script>
