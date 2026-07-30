<template>
  <div class="calculator-shell decision-calculator">
    <section v-if="type === 'car'" class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>車輛與貸款</h2><p>先填成交價，再補上日常使用習慣</p></div></div>
        <div class="field-grid">
          <label>車價（元）<input v-model.number="car.price" type="number" class="input-clean"></label>
          <label>頭期款（元）<input v-model.number="car.downPayment" type="number" class="input-clean"></label>
          <label>車貸年利率（%）<input v-model.number="car.annualRate" type="number" step="0.1" class="input-clean"></label>
          <label>貸款年限<input v-model.number="car.loanYears" type="number" class="input-clean"></label>
          <label>持有年限<input v-model.number="car.years" type="number" class="input-clean"></label>
          <label>動力
            <select v-model="car.fuel" class="input-clean">
              <option value="gasoline">汽油</option><option value="diesel">柴油</option><option value="electric">純電</option>
            </select>
          </label>
          <label v-if="car.fuel !== 'electric'">排氣量（cc）<input v-model.number="car.cc" type="number" class="input-clean"></label>
          <label>每年里程（km）<input v-model.number="car.annualKm" type="number" class="input-clean"></label>
          <label>{{ car.fuel === 'electric' ? '效率（km/kWh）' : '平均油耗（km/L）' }}<input v-model.number="car.efficiency" type="number" step="0.1" class="input-clean"></label>
          <label>{{ car.fuel === 'electric' ? '每度電價' : '每公升油價' }}（元）<input v-model.number="car.energyPrice" type="number" step="0.1" class="input-clean"></label>
          <label>每年保險<input v-model.number="car.insuranceAnnual" type="number" class="input-clean"></label>
          <label>每年保養／維修<input v-model.number="car.maintenanceAnnual" type="number" class="input-clean"></label>
          <label>每月停車<input v-model.number="car.parkingMonthly" type="number" class="input-clean"></label>
          <label>持有期末殘值（%）<input v-model.number="car.resaleRate" type="number" class="input-clean"></label>
        </div>
      </div>
      <ResultPanel eyebrow="真正的車價" label="平均每月總成本" :value="currency(carResult.monthlyTrueCost)" :insight="carInsight">
        <Metric label="持有期總成本" :value="currency(carResult.total)" />
        <Metric label="車貸月付" :value="currency(carResult.payment)" />
        <Metric label="牌照稅＋公路養管費" :value="currency(carResult.licenseTax + carResult.fuelFee)" />
        <Metric label="每年能源費" :value="currency(carResult.energyAnnual)" />
        <Metric label="折舊成本" :value="currency(carResult.depreciation)" />
        <Metric label="貸款總利息" :value="currency(carResult.loanInterest)" />
      </ResultPanel>
    </section>

    <section v-else-if="type === 'separation'" class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>離職結算條件</h2><p>適用勞退新制資遣費；自願離職通常沒有資遣費與預告工資</p></div></div>
        <div class="field-grid">
          <label>離職前 6 個月平均工資<input v-model.number="separation.averageMonthlyWage" type="number" class="input-clean"></label>
          <label>正常月薪<input v-model.number="separation.regularMonthlyWage" type="number" class="input-clean"></label>
          <label>年資（年，可填小數）<input v-model.number="separation.serviceYears" type="number" step="0.1" class="input-clean"></label>
          <label>雇主已預告天數<input v-model.number="separation.noticeDaysGiven" type="number" class="input-clean"></label>
          <label>未休特休（天）<input v-model.number="separation.unusedLeaveDays" type="number" class="input-clean"></label>
          <label>最後月份已工作天數<input v-model.number="separation.workedDays" type="number" class="input-clean"></label>
        </div>
        <p class="scope-note">若屬舊制年資、定期契約、退休或非資遣原因，請另依個案確認。</p>
      </div>
      <ResultPanel eyebrow="應結算項目" label="預估結算總額" :value="currency(separationResult.total)" :insight="separationInsight">
        <Metric label="資遣費" :value="currency(separationResult.severance)" />
        <Metric label="預告工資" :value="currency(separationResult.noticePay)" />
        <Metric label="未休特休" :value="currency(separationResult.unusedLeavePay)" />
        <Metric label="最後薪資" :value="currency(separationResult.finalSalary)" />
        <div class="result-callout">法定預告期：{{ separationResult.statutoryNoticeDays }} 天</div>
      </ResultPanel>
    </section>

    <section v-else-if="type === 'debt'" class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>整合前債務</h2><p>最多先比較三筆；月付低於月利息時會顯示無法清償</p></div></div>
        <div v-for="(debt, index) in debts" :key="index" class="debt-row">
          <strong>債務 {{ index + 1 }}</strong>
          <label>餘額<input v-model.number="debt.balance" type="number" class="input-clean"></label>
          <label>年利率 %<input v-model.number="debt.rate" type="number" step="0.1" class="input-clean"></label>
          <label>目前月付<input v-model.number="debt.payment" type="number" class="input-clean"></label>
        </div>
        <div class="panel-title panel-title-secondary"><span>02</span><div><h2>整合方案</h2><p>費用與違約金也要算進去</p></div></div>
        <div class="field-grid">
          <label>新年利率（%）<input v-model.number="debtPlan.rate" type="number" step="0.1" class="input-clean"></label>
          <label>新期限（年）<input v-model.number="debtPlan.years" type="number" class="input-clean"></label>
          <label>開辦費<input v-model.number="debtPlan.fee" type="number" class="input-clean"></label>
          <label>提前清償違約金<input v-model.number="debtPlan.penalty" type="number" class="input-clean"></label>
          <label>整合後每月多還<input v-model.number="debtPlan.extra" type="number" class="input-clean"></label>
        </div>
      </div>
      <ResultPanel eyebrow="整合前後" label="整合後月付" :value="currency(debtResult.newPayment)" :insight="debtInsight">
        <Metric label="目前月付合計" :value="currency(debtResult.currentPayment)" />
        <Metric label="整合本金" :value="currency(debtResult.balance)" />
        <Metric label="整合總利息＋費用" :value="currency(debtResult.newCosts)" />
        <Metric v-if="debtResult.currentPayoffPossible" label="相較目前省下" :value="currency(debtResult.savings)" :tone="debtResult.savings >= 0 ? 'good' : 'bad'" />
        <Metric v-if="debtPlan.extra > 0" label="多還後清償時間" :value="duration(debtResult.extraMonths)" />
        <Metric v-if="debtPlan.extra > 0" label="多還可省利息" :value="currency(debtResult.extraSavings)" tone="good" />
        <div v-if="!debtResult.currentPayoffPossible" class="result-callout">目前至少一筆月付不高於月利息，本金不會下降，無法計算原方案總利息。</div>
      </ResultPanel>
    </section>

    <section v-else-if="type === 'labor-pension'" class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>老年年金條件</h2><p>這是勞保老年給付，不是勞退個人專戶</p></div></div>
        <div class="field-grid">
          <label>平均月投保薪資<input v-model.number="laborPension.averageInsuredSalary" type="number" class="input-clean"></label>
          <label>勞保年資<input v-model.number="laborPension.insuredYears" type="number" step="0.1" class="input-clean"></label>
          <label>請領年齡
            <select v-model.number="laborPension.claimAge" class="input-clean">
              <option v-for="age in 11" :key="age" :value="age + 59">{{ age + 59 }} 歲</option>
            </select>
          </label>
          <label class="check-field"><input v-model="laborPension.lumpSumEligible" type="checkbox"> 2009/1/1 前已有勞保年資，可比較一次請領</label>
        </div>
      </div>
      <ResultPanel eyebrow="退休現金流" label="預估每月年金" :value="currency(laborPensionResult.monthly)" :insight="pensionInsight">
        <Metric label="採用公式" :value="laborPensionResult.formula" />
        <Metric label="年領合計" :value="currency(laborPensionResult.annual)" />
        <Metric label="年齡增減給" :value="percent(laborPensionResult.ageAdjustment)" />
        <Metric v-if="laborPension.lumpSumEligible" label="一次請領估算" :value="currency(laborPensionResult.lumpSum)" />
        <Metric v-if="laborPension.lumpSumEligible" label="月領損益兩平" :value="`${laborPensionResult.breakEvenYears.toFixed(1)} 年`" />
      </ResultPanel>
    </section>

    <section v-else-if="type === 'estate-tax'" class="calc-grid">
      <div class="input-panel">
        <div class="seg-control">
          <button type="button" :aria-pressed="tax.type === 'estate'" :class="['seg-btn', tax.type === 'estate' && 'seg-btn-active']" @click="tax.type = 'estate'">遺產稅</button>
          <button type="button" :aria-pressed="tax.type === 'gift'" :class="['seg-btn', tax.type === 'gift' && 'seg-btn-active']" @click="tax.type = 'gift'">贈與稅</button>
        </div>
        <div class="panel-title"><span>01</span><div><h2>{{ tax.type === 'estate' ? '遺產總額與扣除額' : '本年度贈與總額' }}</h2><p>金額以申報認定價值為準</p></div></div>
        <div class="field-grid">
          <label>{{ tax.type === 'estate' ? '遺產總額' : '贈與總額' }}<input v-model.number="tax.gross" type="number" class="input-clean"></label>
          <label>{{ tax.type === 'estate' ? '債務及必要費用' : '可扣除負擔' }}<input v-model.number="tax.debts" type="number" class="input-clean"></label>
          <template v-if="tax.type === 'estate'">
            <label class="check-field"><input v-model="tax.spouse" type="checkbox"> 有配偶</label>
            <label>直系卑親屬人數<input v-model.number="tax.children" type="number" class="input-clean"></label>
            <label>受扶養父母人數<input v-model.number="tax.parents" type="number" class="input-clean"></label>
            <label>重度以上身心障礙人數<input v-model.number="tax.disabled" type="number" class="input-clean"></label>
          </template>
          <label>其他依法扣除額<input v-model.number="tax.otherDeductions" type="number" class="input-clean"></label>
        </div>
        <p v-if="tax.type === 'estate'" class="scope-note">未滿 18 歲直系卑親屬依距成年年數可再增加扣除；本簡版先計每人基本扣除，額外金額請填入「其他依法扣除額」。</p>
      </div>
      <ResultPanel eyebrow="115 年度" label="預估應納稅額" :value="currency(taxResult.tax)" :insight="taxInsight">
        <Metric label="免稅額" :value="currency(taxResult.exemption)" />
        <Metric label="扣除額合計" :value="currency(taxResult.deductions)" />
        <Metric label="課稅淨額" :value="currency(taxResult.net)" />
        <div class="result-callout">採 10%／15%／20% 累進稅率逐段計算</div>
      </ResultPanel>
    </section>

    <section v-else-if="type === 'parental'" class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>育嬰留停與津貼</h2><p>每位家長每名子女最多 6 個月，合計按平均月投保薪資 80%</p></div></div>
        <div class="field-grid">
          <label>平均月投保薪資<input v-model.number="parental.insuredSalary" type="number" class="input-clean"></label>
          <label>家長 A 請領月數<input v-model.number="parental.parent1Months" type="number" min="0" max="6" class="input-clean"></label>
          <label>家長 B 請領月數<input v-model.number="parental.parent2Months" type="number" min="0" max="6" class="input-clean"></label>
          <label>第幾名子女<input v-model.number="parental.childOrder" type="number" min="1" class="input-clean"></label>
          <label>育兒津貼月數<input v-model.number="parental.allowanceMonths" type="number" min="0" max="24" class="input-clean"></label>
          <label class="check-field"><input v-model="parental.publicCare" type="checkbox"> 使用公共化／準公共托育（不重複計育兒津貼）</label>
        </div>
      </div>
      <ResultPanel eyebrow="家庭可領金額" label="合計估算" :value="currency(parentalResult.total)" :insight="parentalInsight">
        <Metric label="育嬰留停給付＋補助" :value="currency(parentalResult.leaveBenefit)" />
        <Metric label="每月育兒津貼" :value="currency(parentalResult.allowanceMonthly)" />
        <Metric label="育兒津貼合計" :value="currency(parentalResult.allowanceTotal)" />
        <Metric label="留停期間收入缺口" :value="currency(parentalResult.incomeGap)" />
      </ResultPanel>
    </section>

    <section v-else-if="type === 'home-cost'" class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>房屋持有條件</h2><p>房屋稅用房屋評定現值，不是成交價</p></div></div>
        <div class="field-grid">
          <label>房屋評定現值<input v-model.number="home.assessedHouseValue" type="number" class="input-clean"></label>
          <label>房屋稅率
            <select v-model.number="home.houseTaxRate" class="input-clean">
              <option :value="1">全國單一自住 1%</option><option :value="1.2">一般自住 1.2%</option>
              <option :value="1.5">出租申報所得（1–4 戶）1.5%</option><option :value="2">出租申報所得（5–6 戶）2%</option><option :value="2.4">出租申報所得（7 戶以上）2.4%</option>
              <option :value="2.6">其他非自住（1 戶）2.6%</option><option :value="3.2">其他非自住（2–4 戶）3.2%</option><option :value="3.8">其他非自住（5–6 戶）3.8%</option><option :value="4.8">其他非自住（7 戶以上）4.8%</option>
            </select>
          </label>
          <label>申報地價<input v-model.number="home.declaredLandValue" type="number" class="input-clean"></label>
          <label>地價稅率（%）<input v-model.number="home.landTaxRate" type="number" step="0.1" class="input-clean"></label>
          <label>房貸餘額<input v-model.number="home.mortgageBalance" type="number" class="input-clean"></label>
          <label>房貸年利率（%）<input v-model.number="home.mortgageRate" type="number" step="0.01" class="input-clean"></label>
          <label>剩餘年限<input v-model.number="home.mortgageYears" type="number" class="input-clean"></label>
          <label>每月管理費<input v-model.number="home.managementMonthly" type="number" class="input-clean"></label>
          <label>每年維修準備<input v-model.number="home.repairAnnual" type="number" class="input-clean"></label>
          <label>每年住宅保險<input v-model.number="home.insuranceAnnual" type="number" class="input-clean"></label>
        </div>
      </div>
      <ResultPanel eyebrow="不只房貸" label="平均每月持有成本" :value="currency(homeResult.monthlyCost)" :insight="homeInsight">
        <Metric label="房貸月付現金流" :value="currency(homeResult.mortgagePayment)" />
        <Metric label="每年房屋稅" :value="currency(homeResult.houseTax)" />
        <Metric label="每年地價稅" :value="currency(homeResult.landTax)" />
        <Metric label="首年房貸利息" :value="currency(homeResult.firstYearInterest)" />
        <Metric label="每年持有成本" :value="currency(homeResult.annualCost)" />
        <Metric label="每年現金流出" :value="currency(homeResult.annualCashOutflow)" />
        <div class="result-callout">成本排除償還本金；現金流出則包含完整房貸月付。</div>
      </ResultPanel>
    </section>

    <section v-else class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>共同假設</h2><p>報酬率、費用與稅務耗損都可自行調整</p></div></div>
        <div class="field-grid">
          <label>起始本金<input v-model.number="returns.principal" type="number" class="input-clean"></label>
          <label>投資年數<input v-model.number="returns.years" type="number" class="input-clean"></label>
          <label>每月投入<input v-model.number="returns.monthlyContribution" type="number" class="input-clean"></label>
          <label>預期通膨（%）<input v-model.number="returns.inflation" type="number" step="0.1" class="input-clean"></label>
        </div>
        <div v-for="scenario in returns.scenarios" :key="scenario.name" class="scenario-row">
          <strong>{{ scenario.name }}</strong>
          <label>名目報酬 %<input v-model.number="scenario.nominalRate" type="number" step="0.1" class="input-clean"></label>
          <label>年費用 %<input v-model.number="scenario.feeRate" type="number" step="0.1" class="input-clean"></label>
          <label>稅務耗損 %<input v-model.number="scenario.taxDrag" type="number" step="0.1" class="input-clean"></label>
        </div>
      </div>
      <ResultPanel eyebrow="購買力比較" label="最高實質期末價值" :value="currency(Math.max(...returnResults.map(item => item.realValue)))" :insight="returnsInsight">
        <div v-for="item in returnResults" :key="item.name" class="return-result">
          <div><strong>{{ item.name }}</strong><small>實質年報酬 {{ percent(item.realAnnualRate) }}</small></div>
          <div><span>{{ currency(item.realValue) }}</span><small>名目 {{ currency(item.nominalValue) }}</small></div>
        </div>
        <div class="result-callout">預設值只是比較情境，不代表未來績效或特定商品報酬。</div>
      </ResultPanel>
    </section>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, reactive, watch } from 'vue';
import {
  calculateCarCost, calculateDebtConsolidation, calculateEstateTax, calculateHomeCost,
  calculateLaborPension, calculateParentalBenefits, calculateRealReturns, calculateSeparation,
} from '../../utils/calculators/decisionTools';

defineProps({
  type: {
    type: String,
    required: true,
  },
});

const Metric = defineComponent({
  props: { label: String, value: [String, Number], tone: String },
  setup(p) { return () => h('div', { class: ['metric', p.tone && `metric-${p.tone}`] }, [h('span', p.label), h('strong', String(p.value))]); },
});
const ResultPanel = defineComponent({
  props: { eyebrow: String, label: String, value: String, insight: String },
  setup(p, { slots }) {
    const copied = reactive({ value: false });
    const copySummary = async () => {
      const summary = `${p.label}：${p.value}\n判斷提示：${p.insight ?? ''}\n${window.location.href}`;
      try {
        await navigator.clipboard.writeText(summary);
        copied.value = true;
        window.setTimeout(() => { copied.value = false; }, 1600);
      } catch {
        copied.value = false;
      }
    };
    return () => h('aside', { class: 'result-panel', id: 'decision-result', 'aria-live': 'polite' }, [
      h('div', { class: 'result-heading' }, [
        h('p', { class: 'result-eyebrow' }, p.eyebrow),
        h('button', { type: 'button', class: 'result-copy', onClick: copySummary }, copied.value ? '已複製' : '複製摘要'),
      ]),
      h('span', { class: 'result-label' }, p.label),
      h('strong', { class: 'result-total' }, p.value),
      p.insight ? h('div', { class: 'result-insight' }, [
        h('span', '判斷提示'),
        h('p', p.insight),
      ]) : null,
      h('div', { class: 'result-metrics' }, slots.default?.()),
    ]);
  },
});

const currency = (value) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
const percent = (value) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
const duration = (months) => !Number.isFinite(months) ? '無法清償' : `${Math.floor(months / 12)} 年 ${months % 12} 月`;

const car = reactive({ price: 1_000_000, downPayment: 200_000, annualRate: 3, loanYears: 5, years: 8, cc: 1800, fuel: 'gasoline', annualKm: 15_000, efficiency: 14, energyPrice: 31, insuranceAnnual: 25_000, maintenanceAnnual: 15_000, parkingMonthly: 3_000, resaleRate: 35 });
const carResult = computed(() => calculateCarCost(car));
const carInsight = computed(() => {
  const yearly = carResult.value.monthlyTrueCost * 12;
  const depreciation = carResult.value.depreciation / Math.max(car.years, 1);
  return depreciation > yearly * .35
    ? '折舊是目前最大成本之一。比較車款時，殘值率通常比小幅油耗差更影響總成本。'
    : '日常持有費用占比偏高。可先調整里程、停車與保險，確認每月現金流是否仍有餘裕。';
});
const separation = reactive({ averageMonthlyWage: 50_000, regularMonthlyWage: 50_000, serviceYears: 3, noticeDaysGiven: 0, unusedLeaveDays: 7, workedDays: 15 });
const separationResult = computed(() => calculateSeparation(separation));
const separationInsight = computed(() => separationResult.value.severance > 0
  ? '先用薪資單與出勤紀錄逐項核對；資遣費、預告工資與未休特休應分開列明。'
  : '目前資遣費為 0，請先確認離職原因；自願離職與資遣的法定給付不同。');
const debts = reactive([{ balance: 180_000, rate: 12, payment: 7_000 }, { balance: 300_000, rate: 8, payment: 10_000 }, { balance: 0, rate: 6, payment: 0 }]);
const debtPlan = reactive({ rate: 5, years: 5, fee: 5_000, penalty: 0, extra: 2_000 });
const debtResult = computed(() => calculateDebtConsolidation(debts, debtPlan.rate, debtPlan.years, debtPlan.fee, debtPlan.penalty, debtPlan.extra));
const debtInsight = computed(() => !debtResult.value.currentPayoffPossible
  ? '目前付款不足以穩定降低本金，應先停止新增債務並向銀行確認可行還款方案。'
  : debtResult.value.savings > 0
    ? '整合後總成本較低；申辦前仍要確認綁約期、總費用年百分率與提前清償條款。'
    : '整合雖可能降低月付，但總成本沒有變少。不要只看月付，期限與費用更關鍵。');
const laborPension = reactive({ averageInsuredSalary: 45_800, insuredYears: 30, claimAge: 65, lumpSumEligible: true });
const laborPensionResult = computed(() => calculateLaborPension(laborPension.averageInsuredSalary, laborPension.insuredYears, laborPension.claimAge, laborPension.lumpSumEligible));
const pensionInsight = computed(() => laborPension.claimAge < 65
  ? '提前請領會永久減額；若現金流允許，可把延後請領後的終身月領差額一起比較。'
  : '月領適合規劃長期現金流；一次請領資格與實際金額仍須由勞保局個人資料確認。');
const tax = reactive({ type: 'estate', gross: 30_000_000, debts: 2_000_000, spouse: true, children: 2, parents: 0, disabled: 0, otherDeductions: 0 });
watch(() => tax.type, (type) => {
  tax.gross = type === 'gift' ? 3_000_000 : 30_000_000;
  tax.debts = type === 'gift' ? 0 : 2_000_000;
  tax.otherDeductions = 0;
});
const taxResult = computed(() => calculateEstateTax(tax));
const taxInsight = computed(() => taxResult.value.tax > 0
  ? '已進入課稅範圍。財產評價、扣除資格與贈與時點都會改變結果，正式申報前宜逐項核對。'
  : '目前試算未達課稅淨額，但仍要保留財產價值與扣除額證明，並留意同年度累計贈與。');
const parental = reactive({ insuredSalary: 40_000, parent1Months: 6, parent2Months: 6, childOrder: 1, allowanceMonths: 24, publicCare: false });
const parentalResult = computed(() => calculateParentalBenefits(parental));
const parentalInsight = computed(() => parental.publicCare
  ? '使用公共化或準公共托育時，補助採不同制度；請以孩子實際送托類型核對可領項目。'
  : '留停期間仍有收入缺口，建議把這個差額加入至少 6 個月的家庭預備金規劃。');
const home = reactive({ assessedHouseValue: 2_000_000, houseTaxRate: 1.2, declaredLandValue: 1_500_000, landTaxRate: 0.2, mortgageBalance: 10_000_000, mortgageRate: 2.3, mortgageYears: 30, managementMonthly: 3_000, repairAnnual: 50_000, insuranceAnnual: 5_000 });
const homeResult = computed(() => calculateHomeCost(home));
const homeInsight = computed(() => `除房貸外，每月還有約 ${currency(homeResult.value.monthlyCost)} 的持有成本；看屋時應把它和家庭固定支出一起壓力測試。`);
const returns = reactive({ principal: 500_000, years: 10, monthlyContribution: 10_000, inflation: 2, scenarios: [
  { name: '定存', nominalRate: 1.7, feeRate: 0, taxDrag: 0.15 },
  { name: '債券', nominalRate: 3.5, feeRate: 0.3, taxDrag: 0.2 },
  { name: 'ETF', nominalRate: 7, feeRate: 0.4, taxDrag: 0.3 },
] });
const returnResults = computed(() => calculateRealReturns(returns.principal, returns.years, returns.inflation, returns.monthlyContribution, returns.scenarios));
const returnsInsight = computed(() => {
  const leader = [...returnResults.value].sort((a, b) => b.realValue - a.realValue)[0];
  return `${leader?.name ?? '最高情境'} 的實質期末價值最高，但報酬假設不是保證；請同時比較波動、流動性與可承受虧損。`;
});
</script>

<style>
.calc-grid{display:grid;gap:1rem;align-items:start}.input-panel,.result-panel{border:1px solid #d8e1db;background:rgba(255,255,255,.94);border-radius:1.35rem;padding:1.1rem;box-shadow:0 18px 48px -36px rgba(9,35,26,.4)}.panel-title{display:flex;gap:.8rem;align-items:flex-start;margin-bottom:1rem}.panel-title>span{display:grid;place-items:center;width:2rem;height:2rem;border-radius:.7rem;background:#102419;color:#fff;font-size:.68rem;font-weight:700}.panel-title h2{font-size:1rem;font-weight:700;color:#102419}.panel-title p{font-size:.75rem;color:#687b6e;margin-top:.15rem}.panel-title-secondary{margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #e1e8e3}.field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem}.field-grid label,.debt-row label,.scenario-row label{font-size:.72rem;font-weight:600;color:#45594b}.input-clean{margin-top:.35rem}.check-field{display:flex;align-items:center;gap:.55rem;grid-column:1/-1;padding:.8rem;border:1px solid #dde5e0;border-radius:.8rem;background:#f6f8f5}.check-field input{width:1rem;height:1rem;accent-color:#139b79}.scope-note,.result-callout{margin-top:1rem;border-radius:.8rem;background:#ecfdf7;color:#09634f;padding:.75rem;font-size:.72rem;line-height:1.6}.result-panel{position:sticky;top:5rem;background:#102419;color:#fff;border-color:#102419;overflow:hidden}.result-panel:before{content:"";position:absolute;width:12rem;height:12rem;border-radius:50%;background:rgba(54,196,155,.16);right:-4rem;top:-5rem}.result-heading{position:relative;display:flex;align-items:center;justify-content:space-between;gap:1rem}.result-eyebrow{color:#72dfba;font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.result-copy{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:.35rem .65rem;color:#c8d4cb;font-size:.65rem;font-weight:600;transition:.18s ease}.result-copy:hover{border-color:#72dfba;color:#fff;background:rgba(114,223,186,.1)}.result-label{position:relative;display:block;color:#c8d4cb;font-size:.78rem;margin-top:1rem}.result-total{position:relative;display:block;font-size:clamp(1.75rem,5vw,2.65rem);line-height:1.15;margin:.3rem 0 1rem;letter-spacing:-.04em}.result-insight{position:relative;margin-bottom:1rem;border-left:2px solid #72dfba;background:rgba(114,223,186,.08);border-radius:0 .75rem .75rem 0;padding:.7rem .8rem}.result-insight span{display:block;color:#72dfba;font-size:.62rem;font-weight:700;letter-spacing:.08em}.result-insight p{margin-top:.25rem;color:#dce7df;font-size:.72rem;line-height:1.55}.result-metrics{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}.metric{background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.09);border-radius:.8rem;padding:.75rem}.metric span,.metric strong{display:block}.metric span{color:#a5b5aa;font-size:.65rem}.metric strong{font-size:.86rem;margin-top:.25rem}.metric-good strong{color:#72dfba}.metric-bad strong{color:#fda4af}.result-panel .result-callout{grid-column:1/-1;background:rgba(114,223,186,.1);color:#a9efd4;border:1px solid rgba(114,223,186,.18)}.debt-row,.scenario-row{display:grid;grid-template-columns:5rem repeat(3,minmax(0,1fr));gap:.55rem;align-items:end;padding:.7rem 0;border-bottom:1px solid #e4ebe6}.debt-row strong,.scenario-row strong{font-size:.75rem;color:#192e21;padding-bottom:.75rem}.return-result{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.075);border-radius:.8rem;padding:.8rem}.return-result div:last-child{text-align:right}.return-result strong,.return-result span,.return-result small{display:block}.return-result small{color:#a5b5aa;font-size:.65rem}.return-result span{font-weight:700}
@media(min-width:900px){.calc-grid{grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr)}.input-panel,.result-panel{padding:1.35rem}}
@media(max-width:899px){.result-panel{position:relative;top:auto;order:-1}.calc-grid{gap:.8rem}}
@media(max-width:640px){.field-grid{grid-template-columns:1fr}.debt-row,.scenario-row{grid-template-columns:1fr 1fr}.debt-row strong,.scenario-row strong{grid-column:1/-1;padding-bottom:0}.result-metrics{grid-template-columns:1fr 1fr}.result-panel{border-radius:1.1rem}.result-total{font-size:2rem}}
</style>
