<template>
  <div class="calculator-shell">
    <div class="calculator-card">
      <h2 class="text-sm font-bold text-ink-700 mb-4">目前的房貸</h2>
      <div class="grid gap-5 md:grid-cols-3">
        <div>
          <label for="rf-balance" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">目前貸款餘額 (NT$)</label>
          <input id="rf-balance" type="text" inputmode="decimal" v-model.number="balance"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label for="rf-cur-rate" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">目前利率 (%)</label>
          <input id="rf-cur-rate" type="text" inputmode="decimal" v-model.number="currentRate"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label for="rf-remain" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">剩餘年期 (年)</label>
          <input id="rf-remain" type="text" inputmode="decimal" v-model.number="remainingYears"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
      </div>

      <h2 class="text-sm font-bold text-ink-700 mt-8 mb-4">轉貸的新條件</h2>
      <div class="grid gap-5 md:grid-cols-3">
        <div>
          <label for="rf-new-rate" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">新貸款利率 (%)</label>
          <input id="rf-new-rate" type="text" inputmode="decimal" v-model.number="newRate"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label for="rf-new-years" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">新貸款年期 (年)</label>
          <input id="rf-new-years" type="text" inputmode="decimal" v-model.number="newYears"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">年期拉長會讓月付變低，但總利息不一定比較少，下面有同年期對照。</p>
        </div>
        <div>
          <label for="rf-hold" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">預計再持有這間房 (年)</label>
          <input id="rf-hold" type="text" inputmode="decimal" v-model.number="holdYears"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          <p class="mt-1.5 text-[11px] text-ink-400">打算幾年後賣房或再轉貸？回本月數要小於持有月數才划算。</p>
        </div>
      </div>

      <h2 class="text-sm font-bold text-ink-700 mt-8 mb-1">轉貸一次性成本（可修改）</h2>
      <p class="text-[11px] leading-5 text-ink-400 mb-4">預設值是市場常見範圍，不是官方定價，實際金額以銀行與代書報價為準。抵押權設定規費是法定費用：設定金額（通常為貸款金額 1.2 倍）的千分之一，會依餘額自動估算，可再自行調整。</p>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label for="rf-penalty" class="block text-xs font-semibold text-ink-400 mb-2">提前清償違約金 (NT$)</label>
          <input id="rf-penalty" type="text" inputmode="decimal" v-model.number="penalty"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1 text-[11px] text-ink-400">綁約期內清償常見為清償金額 0.5%～1%；已過綁約期填 0。</p>
        </div>
        <div>
          <label for="rf-scrivener" class="block text-xs font-semibold text-ink-400 mb-2">代書費 (NT$)</label>
          <input id="rf-scrivener" type="text" inputmode="decimal" v-model.number="scrivener"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1 text-[11px] text-ink-400">塗銷＋新設定代書費，市場常見 10,000～20,000 元。</p>
        </div>
        <div>
          <label for="rf-setting" class="block text-xs font-semibold text-ink-400 mb-2">抵押權設定規費 (NT$)</label>
          <input id="rf-setting" type="text" inputmode="decimal" v-model.number="settingFee"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1 text-[11px] text-ink-400">法定規費＝設定金額 × 0.1%。改餘額時會重新估算。</p>
        </div>
        <div>
          <label for="rf-appraisal" class="block text-xs font-semibold text-ink-400 mb-2">鑑價費 (NT$)</label>
          <input id="rf-appraisal" type="text" inputmode="decimal" v-model.number="appraisal"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1 text-[11px] text-ink-400">市場常見 3,000～5,000 元，部分銀行免收。</p>
        </div>
        <div>
          <label for="rf-bankfee" class="block text-xs font-semibold text-ink-400 mb-2">銀行開辦／手續費 (NT$)</label>
          <input id="rf-bankfee" type="text" inputmode="decimal" v-model.number="bankFee"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1 text-[11px] text-ink-400">各銀行方案不同，常見 3,000～9,000 元，也有 0 開辦費方案。</p>
        </div>
        <div>
          <label for="rf-other" class="block text-xs font-semibold text-ink-400 mb-2">其他費用 (NT$)</label>
          <input id="rf-other" type="text" inputmode="decimal" v-model.number="otherFee"
            class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
          <p class="mt-1 text-[11px] text-ink-400">火險、地震險重辦等雜費，沒有就填 0。</p>
        </div>
      </div>

      <div v-if="yearsInvalid" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-semibold text-amber-800">⚠️ 年期未填或為 0，無法試算</p>
        <p class="mt-1 text-xs leading-5 text-amber-700">剩餘年期與新貸款年期都要填大於 0 的數字；清空欄位重打字時會短暫出現這個提示，填好就恢復正常。</p>
      </div>

      <div v-if="!yearsInvalid && monthlySaving <= 0" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-semibold text-amber-800">⚠️ 新條件的月付沒有比較低</p>
        <p class="mt-1 text-xs leading-5 text-amber-700">月付差額為 {{ fmt(monthlySaving) }} 元。可能是新利率不夠低，或新年期比剩餘年期短。月付沒降就不會有回本點，先確認利率與年期有沒有填錯；但全期淨效益仍可能為正，請看下方全期欄。</p>
      </div>

      <div class="calculator-subcard md:p-6 mt-6">
        <div class="grid gap-6 md:grid-cols-2 text-center">
          <div>
            <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">每月少付</p>
            <p class="text-4xl font-bold text-ink-800 font-mono tracking-tight"><span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ fmt(monthlySaving) }}</p>
            <p class="mt-2 text-xs text-ink-400">目前月付 ${{ fmt(oldPayment) }} → 轉貸月付 ${{ fmt(newPayment) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">回本時間</p>
            <p class="text-4xl font-bold text-brand-700 font-mono tracking-tight">{{ breakevenText }}</p>
            <p class="mt-2 text-xs text-ink-400">一次性成本 ${{ fmt(totalCost) }} ÷ 每月少付 ${{ fmt(monthlySaving) }}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 text-center pt-6 mt-6 border-t border-ink-100">
          <div>
            <p class="text-xs text-ink-400 mb-1">不轉貸：剩餘總利息</p>
            <p class="text-lg font-bold text-ink-600 font-mono">${{ fmt(oldTotalInterest) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 mb-1">轉貸後：總利息</p>
            <p class="text-lg font-bold text-ink-600 font-mono">${{ fmt(newTotalInterest) }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 mb-1">全期淨效益（利息差 − 成本）</p>
            <p class="text-lg font-bold font-mono" :class="netBenefit >= 0 ? 'text-brand-700' : 'text-red-600'">${{ fmt(netBenefit) }}</p>
          </div>
        </div>
        <div class="mt-5 rounded-xl bg-paper-100 border border-paper-300 p-4 text-left">
          <p class="text-xs leading-6 text-ink-600">
            <strong>同年期對照：</strong>若新貸款年期和剩餘年期相同（{{ remainingYears || 0 }} 年），新月付是 ${{ fmt(newPaymentSameTerm) }}，每月少付 ${{ fmt(sameTermSaving) }}，回本 {{ sameTermBreakevenText }}。
            年期不同時，月付差額有一部分來自「借久一點」，不是利率省下的，這個對照把年期因素排除。
          </p>
          <p class="mt-2 text-xs leading-6 text-ink-600">
            <strong>持有期間判斷：</strong>你預計再持有 {{ holdYears || 0 }} 年（{{ holdMonths }} 個月），回本需要 {{ breakevenMonths === Infinity ? '—' : breakevenMonths + ' 個月' }}。
            <span v-if="monthlySaving > 0 && breakevenMonths <= holdMonths" class="text-brand-700 font-semibold">持有期間內可以回本，之後每個月都是淨省。</span>
            <span v-else-if="monthlySaving > 0" class="text-red-600 font-semibold">持有期間內回不了本——若真的會在 {{ holdYears }} 年內賣房或再轉貸，這次轉貸不划算。</span>
          </p>
        </div>
        <p class="mt-4 text-[11px] leading-5 text-ink-400">試算假設新舊利率全期固定，未計寬限期、提前還款與利率調整；新銀行是否核貸、實際利率與費用以銀行核定及代書報價為準。本工具不提供貸款媒合，也不保證轉貸結果。</p>
      </div>

      <div class="mt-5 flex justify-center">
        <SnapshotButton tool-name="房貸轉貸損益平衡試算" :metrics="snapshotMetrics" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import SnapshotButton from '../SnapshotButton.vue';
import { monthlyPayment } from '../../utils/calculators/decisionTools';

const balance = ref(8000000);
const currentRate = ref(2.35);
const remainingYears = ref(20);
const newRate = ref(2.06);
const newYears = ref(20);
const holdYears = ref(10);

const penalty = ref(0);
const scrivener = ref(14000);
const settingFee = ref(9600);
const appraisal = ref(3000);
const bankFee = ref(5000);
const otherFee = ref(0);

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('zh-TW');
const num = (v) => Math.max(Number(v) || 0, 0);

// 設定規費 = 貸款金額 × 1.2（設定金額）× 0.1%（法定千分之一），餘額變動時自動重估，使用者仍可手改
watch(balance, (b) => { settingFee.value = Math.round(num(b) * 1.2 * 0.001); });

const totalCost = computed(() => num(penalty.value) + num(scrivener.value) + num(settingFee.value) + num(appraisal.value) + num(bankFee.value) + num(otherFee.value));
const oldMonths = computed(() => Math.round(num(remainingYears.value) * 12));
const newMonths = computed(() => Math.round(num(newYears.value) * 12));
const holdMonths = computed(() => Math.round(num(holdYears.value) * 12));

// 年期為 0 時 monthlyPayment 會回傳月付 0，造成「每月少付＝舊月付全額」的假結論；直接擋下計算
const yearsInvalid = computed(() => oldMonths.value <= 0 || newMonths.value <= 0);
const oldPayment = computed(() => (yearsInvalid.value ? 0 : monthlyPayment(num(balance.value), num(currentRate.value), oldMonths.value)));
const newPayment = computed(() => (yearsInvalid.value ? 0 : monthlyPayment(num(balance.value), num(newRate.value), newMonths.value)));
const newPaymentSameTerm = computed(() => (yearsInvalid.value ? 0 : monthlyPayment(num(balance.value), num(newRate.value), oldMonths.value)));

const monthlySaving = computed(() => oldPayment.value - newPayment.value);
const sameTermSaving = computed(() => oldPayment.value - newPaymentSameTerm.value);
const oldTotalInterest = computed(() => Math.max(oldPayment.value * oldMonths.value - num(balance.value), 0));
const newTotalInterest = computed(() => Math.max(newPayment.value * newMonths.value - num(balance.value), 0));
const netBenefit = computed(() => (oldTotalInterest.value - newTotalInterest.value) - totalCost.value);

const breakevenMonths = computed(() => (monthlySaving.value > 0 ? Math.ceil(totalCost.value / monthlySaving.value) : Infinity));
const sameTermBreakevenMonths = computed(() => (sameTermSaving.value > 0 ? Math.ceil(totalCost.value / sameTermSaving.value) : Infinity));

const fmtBreakeven = (m) => {
  if (!isFinite(m)) return '不會回本';
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y === 0) return `${mo} 個月`;
  return mo === 0 ? `${y} 年` : `${y} 年 ${mo} 個月`;
};
const breakevenText = computed(() => fmtBreakeven(breakevenMonths.value));
const sameTermBreakevenText = computed(() => fmtBreakeven(sameTermBreakevenMonths.value));

const snapshotMetrics = computed(() => [
  { label: '每月少付', value: `$${fmt(monthlySaving.value)}` },
  { label: '一次性成本', value: `$${fmt(totalCost.value)}` },
  { label: '回本時間', value: breakevenText.value },
  { label: '全期淨效益', value: `$${fmt(netBenefit.value)}` },
]);
</script>
