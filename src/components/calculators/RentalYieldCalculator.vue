<template>
  <div class="calculator-shell">
    <!-- 快速預設情境 -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" style="mask-image: linear-gradient(to right, black 88%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 88%, transparent 100%);">
      <span class="text-xs font-semibold text-ink-400 flex-shrink-0">快速情境：</span>
      <button
        v-for="p in presets"
        :key="p.title"
        @click="askPreset(p)"
        class="text-xs font-medium text-[#1D4B34] px-0 py-1.5 transition-all flex-shrink-0 hover:underline"
      >
        {{ p.title }}
      </button>
    </div>
    <!-- 站內確認：原生 window.confirm 在自動化瀏覽器會被靜默駁回（等同取消），
         改用站內確認列＋復原，任何環境都看得到、測得到 -->
    <div v-if="pendingPreset" class="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-[#E3DCCB] bg-[#F7F3EA] px-3 py-2">
      <span class="text-xs text-ink-700">套用「{{ pendingPreset.title }}」會覆蓋目前輸入的數字，確定嗎？</span>
      <button @click="confirmPreset" class="text-xs font-semibold text-white bg-[#1D4B34] rounded-lg px-3 py-1.5 min-h-[32px]">確定套用</button>
      <button @click="pendingPreset = null" class="text-xs font-medium text-ink-600 px-2 py-1.5 min-h-[32px]">取消</button>
    </div>
    <div v-if="appliedPreset" class="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-[#E3DCCB] bg-[#F7F3EA] px-3 py-2">
      <span class="text-xs text-ink-700">已套用「{{ appliedPreset }}」。</span>
      <button @click="undoPreset" class="text-xs font-semibold text-[#1D4B34] underline px-2 py-1.5 min-h-[32px]">復原</button>
      <button @click="appliedPreset = ''" class="text-xs font-medium text-ink-600 px-2 py-1.5 min-h-[32px]">關閉</button>
    </div>

    <!-- 1. 輸入：購屋與租金 -->
    <div class="calculator-card">
      <h3 class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-4">購屋與租金</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="fld-ba0f95d1" class="block text-xs font-semibold text-ink-400 mb-2">房屋總價（萬元）</label>
          <ThousandsInput v-model="totalPriceWan" id="fld-ba0f95d1" aria-label="房屋總價（萬元）"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="totalPriceError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ totalPriceError }}</p>
        </div>
        <div>
          <label for="fld-b6d67af7" class="block text-xs font-semibold text-ink-400 mb-2">每月租金（元）</label>
          <ThousandsInput v-model="monthlyRent" id="fld-b6d67af7" aria-label="每月租金"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="monthlyRentError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ monthlyRentError }}</p>
        </div>
      </div>
    </div>

    <!-- 2. 輸入：每年持有成本 -->
    <div class="calculator-card">
      <h3 class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-4">每年持有成本</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="fld-3cdd99ab" class="block text-xs font-semibold text-ink-400 mb-2">管理費（月/元）</label>
          <ThousandsInput v-model="mgmtMonthly" id="fld-3cdd99ab" aria-label="管理費"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="mgmtError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ mgmtError }}</p>
        </div>
        <div>
          <label for="fld-1ad3a797" class="block text-xs font-semibold text-ink-400 mb-2">房屋稅（年/元）</label>
          <ThousandsInput v-model="houseTaxYearly" id="fld-1ad3a797" aria-label="房屋稅"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="houseTaxError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ houseTaxError }}</p>
        </div>
        <div>
          <label for="fld-d2bc8447" class="block text-xs font-semibold text-ink-400 mb-2">地價稅（年/元）</label>
          <ThousandsInput v-model="landTaxYearly" id="fld-d2bc8447" aria-label="地價稅"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="landTaxError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ landTaxError }}</p>
        </div>
        <div>
          <label for="fld-5c97bfa3" class="block text-xs font-semibold text-ink-400 mb-2">維修預算（年/元）</label>
          <ThousandsInput v-model="repairYearly" id="fld-5c97bfa3" aria-label="維修預算"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="repairError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ repairError }}</p>
        </div>
        <div>
          <label for="fld-bf79f8fd" class="block text-xs font-semibold text-ink-400 mb-2">火險地震險（年/元）</label>
          <ThousandsInput v-model="insuranceYearly" id="fld-bf79f8fd" aria-label="火險地震險"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="insuranceError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ insuranceError }}</p>
        </div>
        <div>
          <label for="fld-080a1d2b" class="block text-xs font-semibold text-ink-400 mb-2">每年空租（月）</label>
          <input id="fld-080a1d2b" type="text" inputmode="decimal" v-model.number="vacancyMonths" v-sync-change
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="vacancyError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ vacancyError }}</p>
        </div>
      </div>
    </div>

    <!-- 3. 房貸（選填） -->
    <div class="calculator-card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xs font-semibold text-ink-400 uppercase tracking-wider">房貸（選填，不貸就留 0）</h3>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label for="fld-46b1790b" class="block text-xs font-semibold text-ink-400 mb-2">貸款金額（萬元）</label>
          <ThousandsInput v-model="loanWan" id="fld-46b1790b" aria-label="貸款金額（萬元）"
            input-class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p v-if="loanError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ loanError }}</p>
        </div>
        <div>
          <label for="fld-f552ad1c" class="block text-xs font-semibold text-ink-400 mb-2">年利率（%）</label>
          <input id="fld-f552ad1c" type="text" inputmode="decimal" v-model.number="loanRate" v-sync-change
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label for="fld-8469f532" class="block text-xs font-semibold text-ink-400 mb-2">年限（年）</label>
          <input id="fld-8469f532" type="text" inputmode="decimal" v-model.number="loanYears" v-sync-change
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
      </div>
    </div>

    <!-- 4. 結果 -->
    <div class="calculator-card-accent">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-ink-800 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#A58436]"></span> 報酬率試算結果
        </h2>
      </div>

      <div v-if="hasInputError" class="text-center py-6">
        <p class="text-sm font-semibold text-[#B3261E]">請先修正上方輸入再試算</p>
      </div>
      <template v-else>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="py-2 text-center">
          <div class="text-[11px] text-ink-400 font-medium mb-1">毛報酬率</div>
          <div class="receipt-main-value whitespace-nowrap">{{ grossYield }}%</div>
          <div class="text-[11px] text-ink-400 mt-1">年租金 ÷ 房屋總價</div>
        </div>
        <div class="py-2 text-center border-l border-[#E3DCCB]">
          <div class="text-[11px] text-ink-400 font-medium mb-1">淨報酬率</div>
          <div class="receipt-main-value whitespace-nowrap">{{ netYield }}%</div>
          <div class="text-[11px] text-ink-400 mt-1">扣成本後 ÷ 房屋總價</div>
        </div>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between py-2 border-b border-[#E3DCCB]">
          <span class="text-ink-400">年租金收入（扣空租後）</span>
          <span class="font-semibold whitespace-nowrap text-ink-900">${{ annualRent }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-[#E3DCCB]">
          <span class="text-ink-400">年持有成本合計</span>
          <span class="font-semibold whitespace-nowrap text-ink-900">${{ annualCostFmt }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-[#E3DCCB]">
          <span class="text-ink-400">年淨收益</span>
          <span class="font-semibold whitespace-nowrap text-ink-900">${{ annualNetFmt }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-[#E3DCCB]">
          <span class="text-ink-400">約幾年回本</span>
          <span class="font-semibold whitespace-nowrap text-ink-900">{{ paybackYears === '—' ? '—' : paybackYears + ' 年' }}</span>
        </div>
        <div v-if="hasLoan" class="flex justify-between py-2 border-b border-[#E3DCCB]">
          <span class="text-ink-400">每月房貸月付金</span>
          <span class="font-semibold whitespace-nowrap text-ink-900">${{ monthlyPayment }}</span>
        </div>
        <div v-if="hasLoan" class="flex justify-between py-2 border-b border-[#E3DCCB]">
          <span class="text-ink-400">自備款報酬率（槓桿後）</span>
          <span class="font-semibold whitespace-nowrap text-ink-900">{{ equityYield }}%</span>
        </div>
        <div v-if="hasLoan" class="flex justify-between py-2">
          <span class="text-ink-400">每月淨現金流<small class="block text-[10px]">租金 − 月付 − 月均成本</small></span>
          <span class="font-semibold whitespace-nowrap" :class="monthlyCashflowRaw >= 0 ? 'text-ink-900' : 'text-[#B3261E]'">${{ monthlyCashflow }}</span>
        </div>
      </div>

      <p class="text-xs text-ink-400 leading-relaxed mt-4">
        {{ verdict }}
      </p>

      <div class="mt-5 flex justify-center">
        <SnapshotButton tool-name="租金報酬率試算" :metrics="[{ label: '毛報酬率', value: grossYield + '%' }, { label: '淨報酬率', value: netYield + '%' }, { label: '年淨收益', value: '$' + annualNetFmt }]" />
      </div>
      </template>
    </div>

    <p class="text-[11px] text-ink-400 leading-relaxed px-1">
      僅供試算參考，不構成投資建議。房屋稅、地價稅實際金額依房屋評定現值、申報地價與各縣市稅率而定，出租中房屋不適用自住優惠稅率，精確數字請以稅單為準。
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ThousandsInput from '../ThousandsInput.vue';
import SnapshotButton from '../SnapshotButton.vue';
import { vSyncChange } from '../../utils/vueSyncChange';

const totalPriceWan = ref(1000);
const monthlyRent = ref(20000);
const mgmtMonthly = ref(1500);
const houseTaxYearly = ref(12000);
const landTaxYearly = ref(8000);
const repairYearly = ref(12000);
const insuranceYearly = ref(4000);
const vacancyMonths = ref(0.5);
const loanWan = ref(0);
const loanRate = ref(2.2);
const loanYears = ref(30);

const presets = [
  { title: '台北小套房', v: { totalPriceWan: 1500, monthlyRent: 25000, mgmtMonthly: 2500, houseTaxYearly: 18000, landTaxYearly: 12000, repairYearly: 12000, insuranceYearly: 5000, vacancyMonths: 0.5, loanWan: 0 } },
  { title: '台中兩房', v: { totalPriceWan: 900, monthlyRent: 18000, mgmtMonthly: 1200, houseTaxYearly: 10000, landTaxYearly: 6000, repairYearly: 10000, insuranceYearly: 4000, vacancyMonths: 0.5, loanWan: 0 } },
  { title: '高雄三房', v: { totalPriceWan: 750, monthlyRent: 16000, mgmtMonthly: 1000, houseTaxYearly: 9000, landTaxYearly: 5000, repairYearly: 10000, insuranceYearly: 3500, vacancyMonths: 1, loanWan: 0 } },
];

const pendingPreset = ref(null);
const appliedPreset = ref('');
const lastInputs = ref(null);

function snapshotInputs() {
  return {
    totalPriceWan: totalPriceWan.value,
    monthlyRent: monthlyRent.value,
    mgmtMonthly: mgmtMonthly.value,
    houseTaxYearly: houseTaxYearly.value,
    landTaxYearly: landTaxYearly.value,
    repairYearly: repairYearly.value,
    insuranceYearly: insuranceYearly.value,
    vacancyMonths: vacancyMonths.value,
    loanWan: loanWan.value,
  };
}

function askPreset(p) {
  appliedPreset.value = '';
  pendingPreset.value = p;
}

function confirmPreset() {
  const p = pendingPreset.value;
  if (!p) return;
  lastInputs.value = snapshotInputs();
  totalPriceWan.value = p.v.totalPriceWan;
  monthlyRent.value = p.v.monthlyRent;
  mgmtMonthly.value = p.v.mgmtMonthly;
  houseTaxYearly.value = p.v.houseTaxYearly;
  landTaxYearly.value = p.v.landTaxYearly;
  repairYearly.value = p.v.repairYearly;
  insuranceYearly.value = p.v.insuranceYearly;
  vacancyMonths.value = p.v.vacancyMonths;
  loanWan.value = p.v.loanWan;
  pendingPreset.value = null;
  appliedPreset.value = p.title;
}

function undoPreset() {
  const s = lastInputs.value;
  if (!s) return;
  totalPriceWan.value = s.totalPriceWan;
  monthlyRent.value = s.monthlyRent;
  mgmtMonthly.value = s.mgmtMonthly;
  houseTaxYearly.value = s.houseTaxYearly;
  landTaxYearly.value = s.landTaxYearly;
  repairYearly.value = s.repairYearly;
  insuranceYearly.value = s.insuranceYearly;
  vacancyMonths.value = s.vacancyMonths;
  loanWan.value = s.loanWan;
  lastInputs.value = null;
  appliedPreset.value = '';
}

const num = (v) => Number(v) || 0;
const fmt = (v) => Math.round(v).toLocaleString('en-US');

const totalPrice = computed(() => num(totalPriceWan.value) * 10000);
const grossAnnualRent = computed(() => num(monthlyRent.value) * 12);
const vacancyLoss = computed(() => num(monthlyRent.value) * num(vacancyMonths.value));
const annualRentNet = computed(() => grossAnnualRent.value - vacancyLoss.value);

const annualCost = computed(() =>
  num(mgmtMonthly.value) * 12 +
  num(houseTaxYearly.value) +
  num(landTaxYearly.value) +
  num(repairYearly.value) +
  num(insuranceYearly.value) +
  vacancyLoss.value
);

const annualNet = computed(() => annualRentNet.value - (annualCost.value - vacancyLoss.value));

const grossYield = computed(() =>
  totalPrice.value > 0 ? (grossAnnualRent.value / totalPrice.value * 100).toFixed(2) : '0.00'
);
const netYield = computed(() =>
  totalPrice.value > 0 ? (annualNet.value / totalPrice.value * 100).toFixed(2) : '0.00'
);
const paybackYears = computed(() =>
  annualNet.value > 0 && totalPrice.value > 0 ? (totalPrice.value / annualNet.value).toFixed(1) : '—'
);

// 防呆：金額欄位留空（null）→「請輸入 XXX」；負數→紅字提示。
// 貸款金額 0 是合法值（不貸就留 0）；房屋總價 0 不在此報錯，維持 verdict 的「請先輸入房屋總價」。
const amountError = (v, label) =>
  v === null || v === undefined || v === '' ? `請輸入${label}` : Number(v) < 0 ? `${label}不可為負數` : '';
const totalPriceError = computed(() => {
  const v = totalPriceWan.value;
  if (v === null || v === undefined || v === '') return '請輸入房屋總價';
  return Number(v) < 0 ? '房屋總價不可為負數' : '';
});
const monthlyRentError = computed(() => amountError(monthlyRent.value, '每月租金'));
const mgmtError = computed(() => amountError(mgmtMonthly.value, '管理費'));
const houseTaxError = computed(() => amountError(houseTaxYearly.value, '房屋稅'));
const landTaxError = computed(() => amountError(landTaxYearly.value, '地價稅'));
const repairError = computed(() => amountError(repairYearly.value, '維修預算'));
const insuranceError = computed(() => amountError(insuranceYearly.value, '火險地震險'));
const loanError = computed(() => amountError(loanWan.value, '貸款金額'));
const vacancyError = computed(() => {
  const v = vacancyMonths.value;
  if (v === null || v === undefined || v === '') return '請輸入每年空租月數';
  const n = Number(v);
  if (Number.isNaN(n)) return '請輸入每年空租月數';
  if (n > 12) return '每年空租最多 12 個月';
  if (n < 0) return '空租月數不可為負數';
  return '';
});
const hasInputError = computed(() => Boolean(
  totalPriceError.value || monthlyRentError.value || mgmtError.value || houseTaxError.value
  || landTaxError.value || repairError.value || insuranceError.value || loanError.value
  || vacancyError.value,
));

// 房貸：等額本息
const loanAmount = computed(() => num(loanWan.value) * 10000);
const hasLoan = computed(() => loanAmount.value > 0 && num(loanYears.value) > 0);
const monthlyRate = computed(() => num(loanRate.value) / 100 / 12);
const totalMonths = computed(() => Math.round(num(loanYears.value) * 12));
const monthlyPayment = computed(() => {
  if (!hasLoan.value) return 0;
  const r = monthlyRate.value, n = totalMonths.value, P = loanAmount.value;
  if (r === 0) return P / n;
  return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
});
// 首年利息（逐月攤還加總）
const firstYearInterest = computed(() => {
  if (!hasLoan.value) return 0;
  const r = monthlyRate.value, pmt = monthlyPayment.value;
  let bal = loanAmount.value, interest = 0;
  const m = Math.min(12, totalMonths.value);
  for (let i = 0; i < m; i++) {
    const it = bal * r;
    interest += it;
    bal -= (pmt - it);
  }
  return interest;
});
const downPayment = computed(() => totalPrice.value - loanAmount.value);
const equityYield = computed(() => {
  if (!hasLoan.value || downPayment.value <= 0) return '0.00';
  return ((annualNet.value - firstYearInterest.value) / downPayment.value * 100).toFixed(2);
});
const monthlyCashflowRaw = computed(() =>
  annualNet.value / 12 - monthlyPayment.value
);
const monthlyCashflow = computed(() => fmt(monthlyCashflowRaw.value));

const annualRent = computed(() => fmt(annualRentNet.value));
const annualCostExVacancy = computed(() => annualCost.value - vacancyLoss.value);
const annualCostFmt = computed(() => fmt(annualCostExVacancy.value));
const annualNetFmt = computed(() => fmt(annualNet.value));

const verdict = computed(() => {
  const y = parseFloat(netYield.value);
  if (totalPrice.value <= 0) return '請先輸入房屋總價。';
  if (y <= 0) return '試算結果為負值：租金連持有成本都 cover 不住，這間房當包租標的不划算，先檢查租金或成本假設是否合理。';
  if (y < 1.5) return `淨報酬率 ${y}%：偏低，台灣住宅包租淨報酬常見約 1.5%～2.5%。低於定存太多時，要想清楚賺的是租金還是房價上漲。`;
  if (y <= 2.5) return `淨報酬率 ${y}%：落在台灣住宅包租常見區間（約 1.5%～2.5%）。記得這還沒扣所得稅與未來大修，實際會再低一點。`;
  return `淨報酬率 ${y}%：高於常見區間，數字漂亮但先別急——檢查租金是否高估、空租與維修是否低估，高報酬通常伴隨高風險（地點、屋況或租客穩定度）。`;
});
</script>
