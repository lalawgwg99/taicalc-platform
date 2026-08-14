<template>
  <div class="calculator-shell decision-calculator">
    <div v-if="type !== 'car'" class="scenario-toolbar">
      <div>
        <strong>方案 A／B 比較</strong>
        <span>先存 A，再調整目前條件成 B</span>
      </div>
      <div>
        <button type="button" @click="saveCurrentScenario">{{ scenarioSaved ? '方案 A 已儲存' : hasSavedScenario ? '更新方案 A' : '儲存為方案 A' }}</button>
        <button v-if="hasSavedScenario" type="button" @click="loadCurrentScenario">載入方案 A</button>
      </div>
    </div>
    <section v-if="type === 'car'" class="calc-grid">
      <div class="input-panel">
        <div class="panel-title"><span>01</span><div><h2>車輛與貸款</h2><p>先填成交價，再補上日常使用習慣</p></div></div>
        <div class="preset-panel">
          <label>
            熱門車款快速帶入
            <select v-model="selectedCarPreset" class="input-clean" @change="applyCarPreset">
              <option value="">自訂條件</option>
              <option v-for="preset in carPresets" :key="preset.id" :value="preset.id">{{ preset.label }}</option>
            </select>
          </label>
          <p v-if="activeCarPreset" class="preset-source">
            已帶入原廠售價、排氣量與測試油耗；實際成交價和道路油耗仍可修改。
            <a :href="activeCarPreset.sourceUrl" target="_blank" rel="noopener noreferrer">{{ activeCarPreset.sourceLabel }}</a>
          </p>
        </div>
        <div class="field-grid">
          <label>車價（元）<input v-model.number="car.price" type="number" class="input-clean"></label>
          <label>頭期款（元）<input v-model.number="car.downPayment" type="number" class="input-clean"></label>
          <label>車貸年利率（%）<input v-model.number="car.annualRate" type="number" step="0.1" class="input-clean"></label>
          <label>貸款年限<input v-model.number="car.loanYears" type="number" class="input-clean"></label>
          <label>持有年限<input v-model.number="car.years" type="number" class="input-clean"></label>
          <label>動力
            <select v-model="car.fuel" class="input-clean">
              <option value="gasoline">汽油</option><option value="hybrid">油電（汽油稅制）</option><option value="diesel">柴油</option><option value="electric">純電</option>
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
        <div class="scenario-actions">
          <button type="button" @click="saveCarScenario">{{ carScenarioSaved ? '方案 A 已儲存' : hasSavedCarScenario ? '更新方案 A' : '儲存為方案 A' }}</button>
          <button v-if="hasSavedCarScenario" type="button" @click="loadCarScenario">載入方案 A</button>
          <span>調整目前條件，即時比較方案 B。</span>
        </div>
      </div>
      <ResultPanel
        eyebrow="真正的車價"
        label="平均每月總成本"
        :value="currency(carResult.monthlyTrueCost)"
        :insight="carInsight"
        :share-url="carShareUrl"
        :report-title="`${activeCarPreset?.label ?? '自訂車款'}養車成本`"
        :share-image-data="carShareImageData"
        :comparison-items="carComparisonItems"
      >
        <Metric label="持有期總成本" :value="currency(carResult.total)" />
        <Metric label="車貸月付" :value="currency(carResult.payment)" />
        <Metric label="牌照稅＋公路養管費" :value="currency(carResult.licenseTax + carResult.fuelFee)" />
        <Metric label="每年能源費" :value="currency(carResult.energyAnnual)" />
        <Metric label="折舊成本" :value="currency(carResult.depreciation)" />
        <Metric label="貸款總利息" :value="currency(carResult.loanInterest)" />
        <DecisionChart title="持有期成本組成" caption="每一元花在哪裡" kind="stack" :items="carChartItems" />
        <a class="result-transfer" :href="carDebtTransferUrl" data-next-tool>把車貸條件帶到債務比較 <span>→</span></a>
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
      <ResultPanel eyebrow="應結算項目" label="預估結算總額" :value="currency(separationResult.total)" :insight="separationInsight" :share-url="scenarioShareUrl" :report-title="scenarioReportTitle" :share-image-data="{ breakdown: separationChartItems }" :comparison-items="scenarioComparisonItems">
        <Metric label="資遣費" :value="currency(separationResult.severance)" />
        <Metric label="預告工資" :value="currency(separationResult.noticePay)" />
        <Metric label="未休特休" :value="currency(separationResult.unusedLeavePay)" />
        <Metric label="最後薪資" :value="currency(separationResult.finalSalary)" />
        <DecisionChart title="結算金額組成" caption="各項占總額比例" kind="stack" :items="separationChartItems" />
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
      <ResultPanel eyebrow="整合前後" label="整合後月付" :value="currency(debtResult.newPayment)" :insight="debtInsight" :share-url="scenarioShareUrl" :report-title="scenarioReportTitle" :share-image-data="{ breakdown: debtChartItems }" :comparison-items="scenarioComparisonItems">
        <Metric label="目前月付合計" :value="currency(debtResult.currentPayment)" />
        <Metric label="整合本金" :value="currency(debtResult.balance)" />
        <Metric label="整合總利息＋費用" :value="currency(debtResult.newCosts)" />
        <Metric v-if="debtResult.currentPayoffPossible" label="相較目前省下" :value="currency(debtResult.savings)" :tone="debtResult.savings >= 0 ? 'good' : 'bad'" />
        <Metric v-if="debtPlan.extra > 0" label="多還後清償時間" :value="duration(debtResult.extraMonths)" />
        <Metric v-if="debtPlan.extra > 0" label="多還可省利息" :value="currency(debtResult.extraSavings)" tone="good" />
        <DecisionChart title="每月還款比較" caption="越短代表現金流壓力越低" kind="columns" :items="debtChartItems" />
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
      <ResultPanel eyebrow="退休現金流" label="預估每月年金" :value="currency(laborPensionResult.monthly)" :insight="pensionInsight" :share-url="scenarioShareUrl" :report-title="scenarioReportTitle" :share-image-data="{ breakdown: pensionChartItems }" :comparison-items="scenarioComparisonItems">
        <Metric label="採用公式" :value="laborPensionResult.formula" />
        <Metric label="年領合計" :value="currency(laborPensionResult.annual)" />
        <Metric label="年齡增減給" :value="percent(laborPensionResult.ageAdjustment)" />
        <Metric v-if="laborPension.lumpSumEligible" label="一次請領估算" :value="currency(laborPensionResult.lumpSum)" />
        <Metric v-if="laborPension.lumpSumEligible" label="月領損益兩平" :value="`${laborPensionResult.breakEvenYears.toFixed(1)} 年`" />
        <DecisionChart title="月領累積進度" caption="未計時間價值，顯示長期現金流" kind="columns" :items="pensionChartItems" />
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
      <ResultPanel eyebrow="115 年度" label="預估應納稅額" :value="currency(taxResult.tax)" :insight="taxInsight" :share-url="scenarioShareUrl" :report-title="scenarioReportTitle" :share-image-data="{ breakdown: taxChartItems }" :comparison-items="scenarioComparisonItems">
        <Metric label="免稅額" :value="currency(taxResult.exemption)" />
        <Metric label="扣除額合計" :value="currency(taxResult.deductions)" />
        <Metric label="課稅淨額" :value="currency(taxResult.net)" />
        <DecisionChart title="申報金額拆解" caption="從財產總額看到應納稅額" kind="columns" :items="taxChartItems" />
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
      <ResultPanel eyebrow="家庭可領金額" label="合計估算" :value="currency(parentalResult.total)" :insight="parentalInsight" :share-url="scenarioShareUrl" :report-title="scenarioReportTitle" :share-image-data="{ breakdown: parentalChartItems }" :comparison-items="scenarioComparisonItems">
        <Metric label="育嬰留停給付＋補助" :value="currency(parentalResult.leaveBenefit)" />
        <Metric label="每月育兒津貼" :value="currency(parentalResult.allowanceMonthly)" />
        <Metric label="育兒津貼合計" :value="currency(parentalResult.allowanceTotal)" />
        <Metric label="留停期間收入缺口" :value="currency(parentalResult.incomeGap)" />
        <DecisionChart title="家庭現金流比較" caption="補助與仍需準備的缺口" kind="columns" :items="parentalChartItems" />
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
      <ResultPanel eyebrow="不只房貸" label="平均每月持有成本" :value="currency(homeResult.monthlyCost)" :insight="homeInsight" :share-url="scenarioShareUrl" :report-title="scenarioReportTitle" :share-image-data="{ breakdown: homeChartItems }" :comparison-items="scenarioComparisonItems">
        <Metric label="房貸月付現金流" :value="currency(homeResult.mortgagePayment)" />
        <Metric label="每年房屋稅" :value="currency(homeResult.houseTax)" />
        <Metric label="每年地價稅" :value="currency(homeResult.landTax)" />
        <Metric label="首年房貸利息" :value="currency(homeResult.firstYearInterest)" />
        <Metric label="每年持有成本" :value="currency(homeResult.annualCost)" />
        <Metric label="每年現金流出" :value="currency(homeResult.annualCashOutflow)" />
        <DecisionChart title="首年持有成本組成" caption="不含房貸本金" kind="stack" :items="homeChartItems" />
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
      <ResultPanel eyebrow="購買力比較" label="最高實質期末價值" :value="currency(Math.max(...returnResults.map(item => item.realValue)))" :insight="returnsInsight" :share-url="scenarioShareUrl" :report-title="scenarioReportTitle" :share-image-data="{ breakdown: returnChartItems }" :comparison-items="scenarioComparisonItems">
        <div v-for="item in returnResults" :key="item.name" class="return-result">
          <div><strong>{{ item.name }}</strong><small>實質年報酬 {{ percent(item.realAnnualRate) }}</small></div>
          <div><span>{{ currency(item.realValue) }}</span><small>名目 {{ currency(item.nominalValue) }}</small></div>
        </div>
        <DecisionChart title="通膨後購買力" caption="相同本金與投入期間比較" kind="columns" :items="returnChartItems" />
        <div class="result-callout">預設值只是比較情境，不代表未來績效或特定商品報酬。</div>
      </ResultPanel>
    </section>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue';
import { carPresets, getCarPreset } from '../../data/carPresets';
import {
  calculateCarCost, calculateDebtConsolidation, calculateEstateTax, calculateHomeCost,
  calculateLaborPension, calculateParentalBenefits, calculateRealReturns, calculateSeparation,
} from '../../utils/calculators/decisionTools';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const Metric = defineComponent({
  props: { label: String, value: [String, Number], tone: String },
  setup(p) { return () => h('div', { class: ['metric', p.tone && `metric-${p.tone}`] }, [h('span', p.label), h('strong', String(p.value))]); },
});
const chartPalette = ['#72dfba', '#32c99c', '#2a9b7e', '#b8c8be', '#e8b26f', '#e1806c', '#91a69a'];
const DecisionChart = defineComponent({
  props: {
    title: String,
    caption: String,
    kind: { type: String, default: 'columns' },
    items: { type: Array, default: () => [] },
  },
  setup(p) {
    return () => {
      const items = p.items
        .map((item, index) => ({
          ...item,
          value: Math.max(0, Number(item.value) || 0),
          color: item.color || chartPalette[index % chartPalette.length],
        }))
        .filter((item) => item.value > 0);
      if (!items.length) {
        return null;
      }
      const total = Math.max(1, items.reduce((sum, item) => sum + item.value, 0));
      const maximum = Math.max(1, ...items.map((item) => item.value));
      const ariaLabel = `${p.title}：${items.map((item) => `${item.label} ${item.displayValue}`).join('、')}`;
      const header = h('figcaption', { class: 'decision-chart-heading' }, [
        h('strong', p.title),
        h('span', p.caption),
      ]);
      if (p.kind === 'stack') {
        return h('figure', { class: 'decision-chart', role: 'img', 'aria-label': ariaLabel }, [
          header,
          h('div', { class: 'chart-stack', 'aria-hidden': 'true' }, items.map((item) => h('i', {
            key: item.label,
            style: { width: `${Math.max(1.5, item.value / total * 100)}%`, background: item.color },
            title: `${item.label} ${item.displayValue}`,
          }))),
          h('div', { class: 'chart-legend' }, items.map((item) => h('div', { key: item.label, class: 'chart-legend-item' }, [
            h('i', { style: { background: item.color }, 'aria-hidden': 'true' }),
            h('span', item.label),
            h('strong', item.displayValue),
          ]))),
        ]);
      }
      return h('figure', { class: 'decision-chart', role: 'img', 'aria-label': ariaLabel }, [
        header,
        h('div', { class: 'chart-columns' }, items.map((item) => h('div', { key: item.label, class: 'chart-column' }, [
          h('strong', { class: 'chart-column-value' }, item.displayValue),
          h('div', { class: 'chart-column-track', 'aria-hidden': 'true' }, [h('i', {
            style: { height: `${Math.max(7, item.value / maximum * 100)}%`, background: item.color },
          })]),
          h('span', { class: 'chart-column-label' }, item.label),
        ]))),
      ]);
    };
  },
});
const ResultPanel = defineComponent({
  props: {
    eyebrow: String,
    label: String,
    value: String,
    insight: String,
    shareUrl: String,
    reportTitle: String,
    shareImageData: Object,
    comparisonItems: { type: Array, default: () => [] },
  },
  setup(p, { slots }) {
    const copied = reactive({ value: false });
    const shared = reactive({ value: false });
    const copySummary = async () => {
      const summary = `${p.label}：${p.value}\n判斷提示：${p.insight ?? ''}\n${window.location.href}`;
      try {
        await navigator.clipboard.writeText(summary);
        window.taicalcTrackEvent?.('result_copy', { copy_method: 'decision_summary' });
        copied.value = true;
        window.setTimeout(() => { copied.value = false; }, 1600);
      } catch {
        copied.value = false;
      }
    };
    const shareResult = async () => {
      const url = p.shareUrl || window.location.href;
      const shareData = {
        title: p.reportTitle || document.title,
        text: `${p.label}：${p.value}｜TaiCalc`,
        url,
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          window.taicalcTrackEvent?.('result_share', { share_method: 'native' });
        } else {
          await navigator.clipboard.writeText(url);
          window.taicalcTrackEvent?.('result_share', { share_method: 'clipboard' });
          shared.value = true;
          window.setTimeout(() => { shared.value = false; }, 1600);
        }
      } catch (error) {
        if (error?.name !== 'AbortError') {
          shared.value = false;
        }
      }
    };
    const printReport = () => {
      window.taicalcTrackEvent?.('report_print', { report_type: 'decision_result' });
      window.print();
    };
    const downloadShareImage = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }
      const breakdown = Array.isArray(p.shareImageData?.breakdown)
        ? p.shareImageData.breakdown.slice(0, 5)
        : [];
      const maxValue = Math.max(1, ...breakdown.map((item) => Number(item.value) || 0));

      context.fillStyle = '#f6f0e4';
      context.fillRect(0, 0, 1200, 630);
      context.fillStyle = '#171714';
      context.fillRect(52, 48, 1096, 534);
      context.fillStyle = '#f2c230';
      context.fillRect(52, 48, 12, 534);

      context.fillStyle = '#f2c230';
      context.font = '700 24px Arial, sans-serif';
      context.fillText('TAICALC · 決策試算報告', 102, 108);
      context.fillStyle = '#ffffff';
      context.font = '700 46px Arial, sans-serif';
      context.fillText(p.reportTitle || 'TaiCalc 試算結果', 102, 172);
      context.fillStyle = '#b8c8be';
      context.font = '24px Arial, sans-serif';
      context.fillText(p.label || '平均每月總成本', 102, 222);
      context.fillStyle = '#ffffff';
      context.font = '700 66px Arial, sans-serif';
      context.fillText(p.value || '', 102, 296);

      let y = 354;
      breakdown.forEach((item) => {
        const amount = Number(item.value) || 0;
        const width = Math.max(8, 430 * amount / maxValue);
        context.fillStyle = '#b8c8be';
        context.font = '20px Arial, sans-serif';
        context.fillText(String(item.label), 102, y);
        context.fillStyle = '#2f7550';
        context.fillRect(260, y - 17, width, 16);
        context.fillStyle = '#eef7f1';
        context.font = '700 18px Arial, sans-serif';
        context.fillText(String(item.displayValue), 718, y);
        y += 42;
      });

      context.fillStyle = '#91a69a';
      context.font = '20px Arial, sans-serif';
      context.fillText('把複雜規則，算成清楚選擇', 830, 520);
      context.fillStyle = '#f2c230';
      context.font = '700 24px Arial, sans-serif';
      context.fillText('taicalc.com', 932, 554);

      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'taicalc-result.png';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        window.taicalcTrackEvent?.('result_share', { share_method: 'image_download' });
      }, 'image/png');
    };
    return () => h('aside', { class: 'result-panel', id: 'decision-result', 'aria-live': 'polite' }, [
      h('div', { class: 'result-heading' }, [
        h('p', { class: 'result-eyebrow' }, p.eyebrow),
        h('div', { class: 'result-actions' }, [
          h('button', { type: 'button', class: 'result-copy', onClick: copySummary, title: '複製結果摘要', 'aria-label': '複製結果摘要' }, copied.value ? '已複製' : '複製'),
          p.shareUrl ? h('button', { type: 'button', class: 'result-copy', onClick: shareResult, title: '分享完整試算結果', 'aria-label': '分享完整試算結果' }, shared.value ? '已複製' : '分享') : null,
          p.shareImageData ? h('button', { type: 'button', class: 'result-copy', onClick: downloadShareImage, title: '下載分享圖片', 'aria-label': '下載分享圖片' }, '分享圖') : null,
          h('button', { type: 'button', class: 'result-copy', onClick: printReport, title: '列印或儲存 PDF', 'aria-label': '列印或儲存 PDF' }, 'PDF'),
        ]),
      ]),
      h('span', { class: 'result-label' }, p.label),
      h('strong', { class: 'result-total' }, p.value),
      p.insight ? h('div', { class: 'result-insight' }, [
        h('span', '判斷提示'),
        h('p', p.insight),
      ]) : null,
      h('div', { class: 'result-metrics' }, [
        ...(slots.default?.() ?? []),
        p.comparisonItems.length ? h(DecisionChart, {
          title: '方案 A／B 比較',
          caption: 'A 為儲存方案，B 為目前輸入',
          kind: 'columns',
          items: p.comparisonItems,
        }) : null,
      ]),
    ]);
  },
});

const currency = (value) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
const compactCurrency = (value) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', notation: 'compact', maximumFractionDigits: 1 }).format(Number.isFinite(value) ? value : 0);
const percent = (value) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
const duration = (months) => !Number.isFinite(months) ? '無法清償' : `${Math.floor(months / 12)} 年 ${months % 12} 月`;

const car = reactive({ price: 1_000_000, downPayment: 200_000, annualRate: 3, loanYears: 5, years: 8, cc: 1800, fuel: 'gasoline', annualKm: 15_000, efficiency: 14, energyPrice: 31, insuranceAnnual: 25_000, maintenanceAnnual: 15_000, parkingMonthly: 3_000, resaleRate: 35 });
const selectedCarPreset = ref('');
const carScenarioSaved = ref(false);
const hasSavedCarScenario = ref(false);
const savedCarScenario = ref(null);
const activeCarPreset = computed(() => getCarPreset(selectedCarPreset.value));
const carStateKeys = ['price', 'downPayment', 'annualRate', 'loanYears', 'years', 'cc', 'fuel', 'annualKm', 'efficiency', 'energyPrice', 'insuranceAnnual', 'maintenanceAnnual', 'parkingMonthly', 'resaleRate'];

const applyCarPreset = () => {
  const preset = activeCarPreset.value;
  if (!preset) {
    return;
  }
  car.price = preset.price;
  car.downPayment = Math.round(preset.price * 0.2);
  car.cc = preset.cc;
  car.fuel = preset.fuel;
  car.efficiency = preset.efficiency;
  carScenarioSaved.value = false;
  window.taicalcTrackEvent?.('scenario_preset', {
    preset_id: preset.id,
    preset_type: 'car',
  });
};

const serializeCar = () => Object.fromEntries(carStateKeys.map((key) => [key, car[key]]));
const applyCarState = (state) => {
  carStateKeys.forEach((key) => {
    if (!(key in state)) {
      return;
    }
    if (key === 'fuel') {
      if (['gasoline', 'hybrid', 'diesel', 'electric'].includes(state[key])) {
        car[key] = state[key];
      }
      return;
    }
    const value = Number(state[key]);
    if (Number.isFinite(value)) {
      car[key] = value;
    }
  });
};

const carShareUrl = computed(() => {
  if (typeof window === 'undefined') {
    return '';
  }
  const url = new URL(window.location.href);
  url.search = '';
  if (selectedCarPreset.value) {
    url.searchParams.set('preset', selectedCarPreset.value);
  }
  Object.entries(serializeCar()).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
});

const saveCarScenario = () => {
  try {
    const snapshot = {
      preset: selectedCarPreset.value,
      values: serializeCar(),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('taicalc_car_scenario', JSON.stringify(snapshot));
    savedCarScenario.value = snapshot;
    hasSavedCarScenario.value = true;
    carScenarioSaved.value = true;
    window.taicalcTrackEvent?.('scenario_save', { scenario_type: 'car', storage: 'local' });
    window.setTimeout(() => { carScenarioSaved.value = false; }, 1800);
  } catch {
    carScenarioSaved.value = false;
  }
};

const loadCarScenario = () => {
  try {
    const saved = savedCarScenario.value ?? JSON.parse(localStorage.getItem('taicalc_car_scenario') || '{}');
    savedCarScenario.value = saved;
    selectedCarPreset.value = typeof saved.preset === 'string' ? saved.preset : '';
    if (saved.values && typeof saved.values === 'object') {
      applyCarState(saved.values);
    }
    window.taicalcTrackEvent?.('scenario_load', { scenario_type: 'car', storage: 'local' });
  } catch {
    hasSavedCarScenario.value = false;
  }
};

const carResult = computed(() => calculateCarCost(car));
const carCostBreakdown = computed(() => {
  const years = Math.max(1, car.years);
  const values = [
    { label: '折舊', value: carResult.value.depreciation },
    { label: '停車', value: car.parkingMonthly * 12 * years },
    { label: '能源', value: carResult.value.energyAnnual * years },
    { label: '保險', value: car.insuranceAnnual * years },
    { label: '保養維修', value: car.maintenanceAnnual * years },
    { label: '稅費', value: (carResult.value.licenseTax + carResult.value.fuelFee) * years },
    { label: '貸款利息', value: carResult.value.loanInterest },
  ].filter((item) => item.value > 0);
  const total = values.reduce((sum, item) => sum + item.value, 0) || 1;
  return values
    .map((item) => ({ ...item, percent: Math.max(2, Math.round(item.value / total * 100)) }))
    .sort((a, b) => b.value - a.value);
});
const carChartItems = computed(() => carCostBreakdown.value.map((item) => ({
  ...item,
  displayValue: compactCurrency(item.value),
})));
const carComparisonItems = computed(() => {
  const savedValues = savedCarScenario.value?.values;
  if (!savedValues) {
    return [];
  }
  const savedResult = calculateCarCost(savedValues);
  return [
    { label: '方案 A', value: savedResult.monthlyTrueCost, displayValue: compactCurrency(savedResult.monthlyTrueCost) },
    { label: '目前方案 B', value: carResult.value.monthlyTrueCost, displayValue: compactCurrency(carResult.value.monthlyTrueCost), color: '#e8b26f' },
  ];
});
const carDebtTransferUrl = computed(() => {
  const scenario = {
    debts: [
      { balance: Math.max(0, car.price - car.downPayment), rate: car.annualRate, payment: carResult.value.payment },
      { balance: 0, rate: 0, payment: 0 },
      { balance: 0, rate: 0, payment: 0 },
    ],
  };
  return `/tools/debt-consolidation-calculator?scenario=${encodeURIComponent(JSON.stringify(scenario))}`;
});
const carShareImageData = computed(() => ({
  breakdown: carChartItems.value,
}));
const carInsight = computed(() => {
  const yearly = carResult.value.monthlyTrueCost * 12;
  const depreciation = carResult.value.depreciation / Math.max(car.years, 1);
  return depreciation > yearly * .35
    ? '折舊是目前最大成本之一。比較車款時，殘值率通常比小幅油耗差更影響總成本。'
    : '日常持有費用占比偏高。可先調整里程、停車與保險，確認每月現金流是否仍有餘裕。';
});

onMounted(() => {
  if (props.type !== 'car') {
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem('taicalc_car_scenario') || 'null');
    savedCarScenario.value = saved;
    hasSavedCarScenario.value = Boolean(saved?.values);
  } catch {
    hasSavedCarScenario.value = false;
  }
  const params = new URLSearchParams(window.location.search);
  const preset = params.get('preset');
  if (preset && getCarPreset(preset)) {
    selectedCarPreset.value = preset;
  }
  const state = {};
  carStateKeys.forEach((key) => {
    const value = params.get(key);
    if (value !== null) {
      state[key] = value;
    }
  });
  applyCarState(state);
});
const separation = reactive({ averageMonthlyWage: 50_000, regularMonthlyWage: 50_000, serviceYears: 3, noticeDaysGiven: 0, unusedLeaveDays: 7, workedDays: 15 });
const separationResult = computed(() => calculateSeparation(separation));
const separationChartItems = computed(() => [
  { label: '資遣費', value: separationResult.value.severance },
  { label: '預告工資', value: separationResult.value.noticePay },
  { label: '未休特休', value: separationResult.value.unusedLeavePay },
  { label: '最後薪資', value: separationResult.value.finalSalary },
].map((item) => ({ ...item, displayValue: compactCurrency(item.value) })));
const separationInsight = computed(() => separationResult.value.severance > 0
  ? '先用薪資單與出勤紀錄逐項核對；資遣費、預告工資與未休特休應分開列明。'
  : '目前資遣費為 0，請先確認離職原因；自願離職與資遣的法定給付不同。');
const debts = reactive([{ balance: 180_000, rate: 12, payment: 7_000 }, { balance: 300_000, rate: 8, payment: 10_000 }, { balance: 0, rate: 6, payment: 0 }]);
const debtPlan = reactive({ rate: 5, years: 5, fee: 5_000, penalty: 0, extra: 2_000 });
const debtResult = computed(() => calculateDebtConsolidation(debts, debtPlan.rate, debtPlan.years, debtPlan.fee, debtPlan.penalty, debtPlan.extra));
const debtChartItems = computed(() => [
  { label: '目前月付', value: debtResult.value.currentPayment },
  { label: '整合後', value: debtResult.value.newPayment },
  ...(debtPlan.extra > 0 ? [{ label: '加速還款', value: debtResult.value.newPayment + debtPlan.extra, color: '#e8b26f' }] : []),
].map((item) => ({ ...item, displayValue: compactCurrency(item.value) })));
const debtInsight = computed(() => !debtResult.value.currentPayoffPossible
  ? '目前付款不足以穩定降低本金，應先停止新增債務並向銀行確認可行還款方案。'
  : debtResult.value.savings > 0
    ? '整合後總成本較低；申辦前仍要確認綁約期、總費用年百分率與提前清償條款。'
    : '整合雖可能降低月付，但總成本沒有變少。不要只看月付，期限與費用更關鍵。');
const laborPension = reactive({ averageInsuredSalary: 45_800, insuredYears: 30, claimAge: 65, lumpSumEligible: true });
const laborPensionResult = computed(() => calculateLaborPension(laborPension.averageInsuredSalary, laborPension.insuredYears, laborPension.claimAge, laborPension.lumpSumEligible));
const pensionChartItems = computed(() => [
  { label: '月領 1 年', value: laborPensionResult.value.annual },
  { label: '月領 5 年', value: laborPensionResult.value.annual * 5 },
  { label: '月領 10 年', value: laborPensionResult.value.annual * 10 },
  ...(laborPension.lumpSumEligible ? [{ label: '一次領', value: laborPensionResult.value.lumpSum, color: '#e8b26f' }] : []),
].map((item) => ({ ...item, displayValue: compactCurrency(item.value) })));
const pensionInsight = computed(() => laborPension.claimAge < 65
  ? '提前請領會永久減額；若現金流允許，可把延後請領後的終身月領差額一起比較。'
  : '月領適合規劃長期現金流；一次請領資格與實際金額仍須由勞保局個人資料確認。');
const tax = reactive({ type: 'estate', gross: 30_000_000, debts: 2_000_000, spouse: true, children: 2, parents: 0, disabled: 0, otherDeductions: 0 });
watch(() => tax.type, (type) => {
  tax.gross = type === 'gift' ? 3_000_000 : 30_000_000;
  tax.debts = type === 'gift' ? 0 : 2_000_000;
  tax.otherDeductions = 0;
}, { flush: 'sync' });
const taxResult = computed(() => calculateEstateTax(tax));
const taxChartItems = computed(() => [
  { label: tax.type === 'estate' ? '遺產總額' : '贈與總額', value: tax.gross },
  { label: '課稅淨額', value: taxResult.value.net },
  { label: '應納稅額', value: taxResult.value.tax, color: '#e8b26f' },
].map((item) => ({ ...item, displayValue: compactCurrency(item.value) })));
const taxInsight = computed(() => taxResult.value.tax > 0
  ? '已進入課稅範圍。財產評價、扣除資格與贈與時點都會改變結果，正式申報前宜逐項核對。'
  : '目前試算未達課稅淨額，但仍要保留財產價值與扣除額證明，並留意同年度累計贈與。');
const parental = reactive({ insuredSalary: 40_000, parent1Months: 6, parent2Months: 6, childOrder: 1, allowanceMonths: 24, publicCare: false });
const parentalResult = computed(() => calculateParentalBenefits(parental));
const parentalChartItems = computed(() => [
  { label: '留停給付', value: parentalResult.value.leaveBenefit },
  { label: '育兒津貼', value: parentalResult.value.allowanceTotal },
  { label: '收入缺口', value: parentalResult.value.incomeGap, color: '#e8b26f' },
].map((item) => ({ ...item, displayValue: compactCurrency(item.value) })));
const parentalInsight = computed(() => parental.publicCare
  ? '使用公共化或準公共托育時，補助採不同制度；請以孩子實際送托類型核對可領項目。'
  : '留停期間仍有收入缺口，建議把這個差額加入至少 6 個月的家庭預備金規劃。');
const home = reactive({ assessedHouseValue: 2_000_000, houseTaxRate: 1.2, declaredLandValue: 1_500_000, landTaxRate: 0.2, mortgageBalance: 10_000_000, mortgageRate: 2.3, mortgageYears: 30, managementMonthly: 3_000, repairAnnual: 50_000, insuranceAnnual: 5_000 });
const homeResult = computed(() => calculateHomeCost(home));
const homeChartItems = computed(() => [
  { label: '首年利息', value: homeResult.value.firstYearInterest },
  { label: '管理費', value: home.managementMonthly * 12 },
  { label: '維修準備', value: home.repairAnnual },
  { label: '房屋稅', value: homeResult.value.houseTax },
  { label: '地價稅', value: homeResult.value.landTax },
  { label: '住宅保險', value: home.insuranceAnnual },
].map((item) => ({ ...item, displayValue: compactCurrency(item.value) })));
const homeInsight = computed(() => `除房貸外，每月還有約 ${currency(homeResult.value.monthlyCost)} 的持有成本；看屋時應把它和家庭固定支出一起壓力測試。`);
const returns = reactive({ principal: 500_000, years: 10, monthlyContribution: 10_000, inflation: 2, scenarios: [
  { name: '定存', nominalRate: 1.7, feeRate: 0, taxDrag: 0.15 },
  { name: '債券', nominalRate: 3.5, feeRate: 0.3, taxDrag: 0.2 },
  { name: 'ETF', nominalRate: 7, feeRate: 0.4, taxDrag: 0.3 },
] });
const returnResults = computed(() => calculateRealReturns(returns.principal, returns.years, returns.inflation, returns.monthlyContribution, returns.scenarios));
const returnChartItems = computed(() => returnResults.value.map((item) => ({
  label: item.name,
  value: item.realValue,
  displayValue: compactCurrency(item.realValue),
})));
const returnsInsight = computed(() => {
  const leader = [...returnResults.value].sort((a, b) => b.realValue - a.realValue)[0];
  return `${leader?.name ?? '最高情境'} 的實質期末價值最高，但報酬假設不是保證；請同時比較波動、流動性與可承受虧損。`;
});

const scenarioSaved = ref(false);
const hasSavedScenario = ref(false);
const savedScenarioPayload = ref(null);
const scenarioStorageKey = computed(() => `taicalc_${props.type}_scenario`);
const scenarioReportTitle = computed(() => ({
  separation: '離職結算試算',
  debt: '債務整合比較',
  'labor-pension': '勞保老年年金試算',
  'estate-tax': '遺產與贈與稅試算',
  parental: '育兒與育嬰留停收入試算',
  'home-cost': '買房持有成本試算',
  'real-return': '通膨後實質報酬比較',
})[props.type] || 'TaiCalc 決策試算');

const cloneScenario = (value) => JSON.parse(JSON.stringify(value));
const currentScenarioPayload = () => {
  switch (props.type) {
    case 'separation': return { separation: cloneScenario(separation) };
    case 'debt': return { debts: cloneScenario(debts), debtPlan: cloneScenario(debtPlan) };
    case 'labor-pension': return { laborPension: cloneScenario(laborPension) };
    case 'estate-tax': return { tax: cloneScenario(tax) };
    case 'parental': return { parental: cloneScenario(parental) };
    case 'home-cost': return { home: cloneScenario(home) };
    case 'real-return': return { returns: cloneScenario(returns) };
    default: return {};
  }
};

const scenarioPrimaryValue = (payload) => {
  if (!payload) {
    return 0;
  }
  switch (props.type) {
    case 'separation':
      return calculateSeparation(payload.separation).total;
    case 'debt': {
      const plan = payload.debtPlan;
      return calculateDebtConsolidation(payload.debts, plan.rate, plan.years, plan.fee, plan.penalty, plan.extra).newPayment;
    }
    case 'labor-pension': {
      const data = payload.laborPension;
      return calculateLaborPension(data.averageInsuredSalary, data.insuredYears, data.claimAge, data.lumpSumEligible).monthly;
    }
    case 'estate-tax':
      return calculateEstateTax(payload.tax).tax;
    case 'parental':
      return calculateParentalBenefits(payload.parental).total;
    case 'home-cost':
      return calculateHomeCost(payload.home).monthlyCost;
    case 'real-return': {
      const data = payload.returns;
      return Math.max(0, ...calculateRealReturns(data.principal, data.years, data.inflation, data.monthlyContribution, data.scenarios).map((item) => item.realValue));
    }
    default:
      return 0;
  }
};

const scenarioComparisonItems = computed(() => {
  if (!savedScenarioPayload.value) {
    return [];
  }
  try {
    const savedValue = scenarioPrimaryValue(savedScenarioPayload.value);
    const currentValue = scenarioPrimaryValue(currentScenarioPayload());
    return [
      { label: '方案 A', value: savedValue, displayValue: compactCurrency(savedValue) },
      { label: '目前方案 B', value: currentValue, displayValue: compactCurrency(currentValue), color: '#e8b26f' },
    ];
  } catch {
    return [];
  }
});

const assignKnown = (target, source) => {
  if (!source || typeof source !== 'object') {
    return;
  }
  Object.keys(target).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(source, key) && typeof source[key] !== 'object') {
      target[key] = source[key];
    }
  });
};

const applyScenarioPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return;
  }
  switch (props.type) {
    case 'separation':
      assignKnown(separation, payload.separation);
      break;
    case 'debt':
      if (Array.isArray(payload.debts)) {
        payload.debts.slice(0, 3).forEach((item, index) => assignKnown(debts[index], item));
      }
      assignKnown(debtPlan, payload.debtPlan);
      break;
    case 'labor-pension':
      assignKnown(laborPension, payload.laborPension);
      break;
    case 'estate-tax':
      assignKnown(tax, payload.tax);
      break;
    case 'parental':
      assignKnown(parental, payload.parental);
      break;
    case 'home-cost':
      assignKnown(home, payload.home);
      break;
    case 'real-return':
      assignKnown(returns, payload.returns);
      if (Array.isArray(payload.returns?.scenarios)) {
        payload.returns.scenarios.slice(0, 3).forEach((item, index) => assignKnown(returns.scenarios[index], item));
      }
      break;
  }
};

const scenarioShareUrl = computed(() => {
  if (typeof window === 'undefined' || props.type === 'car') {
    return '';
  }
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('scenario', JSON.stringify(currentScenarioPayload()));
  return url.toString();
});

const saveCurrentScenario = () => {
  try {
    const values = currentScenarioPayload();
    localStorage.setItem(scenarioStorageKey.value, JSON.stringify({
      values,
      savedAt: new Date().toISOString(),
    }));
    savedScenarioPayload.value = cloneScenario(values);
    hasSavedScenario.value = true;
    scenarioSaved.value = true;
    window.taicalcTrackEvent?.('scenario_save', { scenario_type: props.type, storage: 'local' });
    window.setTimeout(() => { scenarioSaved.value = false; }, 1600);
  } catch {
    scenarioSaved.value = false;
  }
};

const loadCurrentScenario = () => {
  try {
    const saved = savedScenarioPayload.value
      ? { values: savedScenarioPayload.value }
      : JSON.parse(localStorage.getItem(scenarioStorageKey.value) || '{}');
    savedScenarioPayload.value = cloneScenario(saved.values);
    applyScenarioPayload(saved.values);
    window.taicalcTrackEvent?.('scenario_load', { scenario_type: props.type, storage: 'local' });
  } catch {
    hasSavedScenario.value = false;
  }
};

onMounted(() => {
  if (props.type === 'car') {
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(scenarioStorageKey.value) || 'null');
    savedScenarioPayload.value = saved?.values ? cloneScenario(saved.values) : null;
    hasSavedScenario.value = Boolean(savedScenarioPayload.value);
  } catch {
    hasSavedScenario.value = false;
  }
  const serialized = new URLSearchParams(window.location.search).get('scenario');
  if (!serialized) {
    return;
  }
  try {
    applyScenarioPayload(JSON.parse(serialized));
  } catch {
    // Invalid shared state falls back to safe defaults.
  }
});
</script>

<style>
.calc-grid{display:grid;gap:1rem;align-items:start}.input-panel,.result-panel{border:1px solid #d8e1db;background:rgba(255,255,255,.94);border-radius:1.35rem;padding:1.1rem;box-shadow:0 18px 48px -36px rgba(9,35,26,.4)}.panel-title{display:flex;gap:.8rem;align-items:flex-start;margin-bottom:1rem}.panel-title>span{display:grid;place-items:center;width:2rem;height:2rem;border-radius:.7rem;background:#102419;color:#fff;font-size:.68rem;font-weight:700}.panel-title h2{font-size:1rem;font-weight:700;color:#102419}.panel-title p{font-size:.75rem;color:#687b6e;margin-top:.15rem}.panel-title-secondary{margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #e1e8e3}.preset-panel{margin-bottom:1rem;padding:1rem;border:1px solid #c9e9dc;border-radius:1rem;background:#f1fbf7}.preset-panel label{font-size:.72rem;font-weight:700;color:#234b3b}.preset-source{margin-top:.65rem;font-size:.68rem;line-height:1.55;color:#557064}.preset-source a{color:#08765d;text-decoration:underline;text-underline-offset:2px}.field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem}.field-grid label,.debt-row label,.scenario-row label{font-size:.72rem;font-weight:600;color:#45594b}.input-clean{margin-top:.35rem}.check-field{display:flex;align-items:center;gap:.55rem;grid-column:1/-1;padding:.8rem;border:1px solid #dde5e0;border-radius:.8rem;background:#f6f8f5}.check-field input{width:1rem;height:1rem;accent-color:#139b79}.scenario-actions{display:flex;align-items:center;flex-wrap:wrap;gap:.55rem;margin-top:1rem;padding-top:1rem;border-top:1px solid #e1e8e3}.scenario-actions button{border:1px solid #b9cec3;border-radius:999px;padding:.45rem .75rem;color:#234b3b;background:#fff;font-size:.68rem;font-weight:700;transition:.18s ease}.scenario-actions button:hover{border-color:#139b79;background:#f1fbf7}.scenario-actions span{font-size:.65rem;color:#7a8b81}.scope-note,.result-callout{margin-top:1rem;border-radius:.8rem;background:#ecfdf7;color:#09634f;padding:.75rem;font-size:.72rem;line-height:1.6}.result-panel{position:sticky;top:5rem;background:#102419;color:#fff;border-color:#102419;overflow:hidden}.result-panel:before{content:"";position:absolute;width:12rem;height:12rem;border-radius:50%;background:rgba(54,196,155,.16);right:-4rem;top:-5rem}.result-heading{position:relative;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.result-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.35rem}.result-eyebrow{color:#72dfba;font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding-top:.4rem}.result-copy{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:.35rem .65rem;color:#c8d4cb;font-size:.65rem;font-weight:600;transition:.18s ease}.result-copy:hover{border-color:#72dfba;color:#fff;background:rgba(114,223,186,.1)}.result-label{position:relative;display:block;color:#c8d4cb;font-size:.78rem;margin-top:1rem}.result-total{position:relative;display:block;font-size:clamp(1.75rem,5vw,2.65rem);line-height:1.15;margin:.3rem 0 1rem;letter-spacing:-.04em}.result-insight{position:relative;margin-bottom:1rem;border-left:2px solid #72dfba;background:rgba(114,223,186,.08);border-radius:0 .75rem .75rem 0;padding:.7rem .8rem}.result-insight span{display:block;color:#72dfba;font-size:.62rem;font-weight:700;letter-spacing:.08em}.result-insight p{margin-top:.25rem;color:#dce7df;font-size:.72rem;line-height:1.55}.result-metrics{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}.metric{background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.09);border-radius:.8rem;padding:.75rem}.metric span,.metric strong{display:block}.metric span{color:#a5b5aa;font-size:.65rem}.metric strong{font-size:.86rem;margin-top:.25rem}.metric-good strong{color:#72dfba}.metric-bad strong{color:#fda4af}.cost-breakdown{grid-column:1/-1;margin-top:.35rem;padding:.85rem;border:1px solid rgba(255,255,255,.09);border-radius:.9rem;background:rgba(255,255,255,.055)}.breakdown-heading,.breakdown-row>div:first-child{display:flex;align-items:center;justify-content:space-between;gap:1rem}.breakdown-heading{margin-bottom:.7rem}.breakdown-heading strong{font-size:.72rem}.breakdown-heading span{font-size:.62rem;color:#91a69a}.breakdown-row+.breakdown-row{margin-top:.55rem}.breakdown-row span{font-size:.64rem;color:#b8c8be}.breakdown-row strong{font-size:.64rem;color:#eef7f1}.breakdown-track{height:.28rem;margin-top:.25rem;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.09)}.breakdown-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#32c99c,#72dfba)}.result-panel .result-callout{grid-column:1/-1;background:rgba(114,223,186,.1);color:#a9efd4;border:1px solid rgba(114,223,186,.18)}.debt-row,.scenario-row{display:grid;grid-template-columns:5rem repeat(3,minmax(0,1fr));gap:.55rem;align-items:end;padding:.7rem 0;border-bottom:1px solid #e4ebe6}.debt-row strong,.scenario-row strong{font-size:.75rem;color:#192e21;padding-bottom:.75rem}.return-result{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.075);border-radius:.8rem;padding:.8rem}.return-result div:last-child{text-align:right}.return-result strong,.return-result span,.return-result small{display:block}.return-result small{color:#a5b5aa;font-size:.65rem}.return-result span{font-weight:700}
.scenario-toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:.8rem;padding:.8rem 1rem;border:1px solid #d8e1db;border-radius:1rem;background:#f6f8f5}.scenario-toolbar strong,.scenario-toolbar span{display:block}.scenario-toolbar strong{font-size:.72rem;color:#234b3b}.scenario-toolbar span{margin-top:.15rem;font-size:.65rem;color:#7a8b81}.scenario-toolbar>div:last-child{display:flex;gap:.45rem;flex-wrap:wrap;justify-content:flex-end}.scenario-toolbar button{border:1px solid #b9cec3;border-radius:999px;padding:.4rem .7rem;background:#fff;color:#234b3b;font-size:.66rem;font-weight:700}.scenario-toolbar button:hover{border-color:#139b79;background:#f1fbf7}
.decision-chart{grid-column:1/-1;margin-top:.35rem;padding:.9rem;border:1px solid rgba(255,255,255,.1);border-radius:1rem;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.035));overflow:hidden}.decision-chart-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;margin-bottom:.85rem}.decision-chart-heading strong{font-size:.72rem;color:#eef7f1}.decision-chart-heading span{font-size:.6rem;color:#91a69a;text-align:right}.chart-stack{display:flex;width:100%;height:.7rem;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.08);box-shadow:inset 0 1px 2px rgba(0,0,0,.16)}.chart-stack i{display:block;height:100%;min-width:2px;transition:width .25s ease}.chart-stack i+i{border-left:2px solid #102419}.chart-legend{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45rem .7rem;margin-top:.75rem}.chart-legend-item{display:grid;grid-template-columns:.45rem minmax(0,1fr) auto;align-items:center;gap:.4rem;min-width:0}.chart-legend-item>i{width:.42rem;height:.42rem;border-radius:999px}.chart-legend-item span{overflow:hidden;color:#b8c8be;font-size:.61rem;text-overflow:ellipsis;white-space:nowrap}.chart-legend-item strong{color:#eef7f1;font-size:.62rem}.chart-columns{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:.5rem;align-items:end;min-height:8.5rem}.chart-column{display:grid;grid-template-rows:auto 5.8rem auto;gap:.35rem;min-width:0;text-align:center}.chart-column-value{overflow:hidden;color:#eef7f1;font-size:.61rem;text-overflow:ellipsis;white-space:nowrap}.chart-column-track{position:relative;display:flex;align-items:flex-end;overflow:hidden;border-radius:.55rem .55rem .25rem .25rem;background:rgba(255,255,255,.06);box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}.chart-column-track i{display:block;width:100%;border-radius:.5rem .5rem .2rem .2rem;box-shadow:0 -8px 24px rgba(50,201,156,.14);transition:height .25s ease}.chart-column-label{overflow:hidden;color:#a5b5aa;font-size:.6rem;line-height:1.25;text-overflow:ellipsis;white-space:nowrap}
.result-transfer{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:1rem;border:1px solid rgba(114,223,186,.2);border-radius:.8rem;background:rgba(114,223,186,.09);padding:.75rem .8rem;color:#a9efd4;font-size:.68rem;font-weight:700;transition:.18s ease}.result-transfer:hover{border-color:#72dfba;background:rgba(114,223,186,.14);color:#fff}.result-transfer span{font-size:.9rem}
@media(min-width:900px){.calc-grid{grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr)}.input-panel,.result-panel{padding:1.35rem}}
@media(max-width:899px){.result-panel{position:relative;top:auto}.calc-grid{gap:.8rem}}
@media(max-width:640px){.scenario-toolbar{align-items:flex-start;flex-direction:column}.scenario-toolbar>div:last-child{justify-content:flex-start}.field-grid{grid-template-columns:1fr}.debt-row,.scenario-row{grid-template-columns:1fr 1fr}.debt-row strong,.scenario-row strong{grid-column:1/-1;padding-bottom:0}.result-heading{display:block}.result-actions{justify-content:flex-start;margin-top:.65rem}.result-eyebrow{padding-top:0;white-space:nowrap}.result-metrics{grid-template-columns:1fr 1fr}.result-panel{border-radius:1.1rem}.result-total{font-size:2rem}}
@media print{body *{visibility:hidden!important}.decision-calculator,.decision-calculator *{visibility:visible!important}.decision-calculator{position:absolute;inset:0;width:100%;background:#fff}.decision-calculator .input-panel,.decision-calculator .scenario-toolbar{display:none}.decision-calculator .calc-grid{display:block}.decision-calculator .result-panel{position:static;background:#fff;color:#102419;border:1px solid #aebfb5;box-shadow:none}.decision-calculator .result-panel:before,.decision-calculator .result-actions{display:none}.decision-calculator .result-eyebrow,.decision-calculator .result-label,.decision-calculator .metric span,.decision-calculator .breakdown-row span,.decision-calculator .breakdown-heading span{color:#557064}.decision-calculator .result-insight,.decision-calculator .metric,.decision-calculator .cost-breakdown{background:#f6f8f5;border-color:#d8e1db;color:#102419}.decision-calculator .result-insight p,.decision-calculator .metric strong,.decision-calculator .breakdown-row strong{color:#102419}}
@media print{.decision-calculator .decision-chart{background:#f6f8f5;border-color:#d8e1db}.decision-calculator .decision-chart-heading strong,.decision-calculator .chart-legend-item strong,.decision-calculator .chart-column-value{color:#102419}.decision-calculator .decision-chart-heading span,.decision-calculator .chart-legend-item span,.decision-calculator .chart-column-label{color:#557064}.decision-calculator .chart-stack i+i{border-color:#f6f8f5}.decision-calculator .chart-column-track{background:#e1e8e3}}

/* TaiCalc ledger: keep dense calculators readable on wide displays. */
@media screen {
  .calc-grid{gap:.85rem}
  .scenario-toolbar{border:1.5px solid #171714;border-radius:.45rem;background:#fffdf7;box-shadow:3px 4px 0 rgba(23,23,20,.07)}
  .scenario-toolbar strong{color:#171714}
  .scenario-toolbar button{border:1.5px solid #171714;border-radius:.35rem;background:#f2c230;color:#171714}
  .scenario-toolbar button:hover{border-color:#171714;background:#ffd94d}
  .input-panel{border:1.5px solid #171714;border-radius:.55rem;background:#fffdf7;box-shadow:4px 5px 0 rgba(23,23,20,.08)}
  .panel-title>span{border-radius:.25rem;background:#171714;color:#f2c230}
  .panel-title h2{color:#171714}
  .panel-title p{color:#6c6457}
  .panel-title-secondary{border-color:#cfc3ad}
  .field-grid label,.debt-row label,.scenario-row label{color:#4f493f}
  .input-clean{min-height:2.9rem;border:1.5px solid #9f927c;border-radius:.35rem;background:#fffdf7;padding:.68rem .8rem}
  .input-clean:focus{border-color:#171714;box-shadow:0 0 0 3px rgba(242,194,48,.28)}
  .debt-row,.scenario-row{grid-template-columns:4.4rem repeat(3,minmax(0,1fr));border-color:#d6ccba;padding:.65rem 0}
  .debt-row strong,.scenario-row strong{color:#171714}
  .check-field,.preset-panel{border-radius:.35rem;background:#f6f0e4}
  .scenario-actions button{border-radius:.35rem}
  .result-panel{border:2px solid #171714;border-radius:.55rem;background:#171714;box-shadow:5px 6px 0 rgba(23,23,20,.13)}
  .result-panel:before{display:none}
  .result-eyebrow{color:#f2c230}
  .result-copy{border-color:#6f695d;border-radius:.3rem;color:#f3ede1}
  .result-copy:hover{border-color:#f2c230;background:rgba(242,194,48,.1)}
  .result-label{margin-top:.8rem;color:#c9c1b3}
  .result-total{font-size:clamp(2rem,4vw,3.1rem);margin:.25rem 0 .85rem}
  .result-insight{margin-bottom:.8rem;border-left-color:#f2c230;border-radius:0 .35rem .35rem 0;background:rgba(242,194,48,.08);padding:.65rem .75rem}
  .result-insight span{color:#f2c230}
  .result-insight p{color:#eee8dc}
  .result-metrics{gap:.45rem}
  .metric{border-color:#4b4841;border-radius:.35rem;background:#272722;padding:.65rem}
  .metric span{color:#aaa396}
  .metric-good strong{color:#79d3a0}
  .metric-bad strong{color:#ef8b81}
  .decision-chart{margin-top:.25rem;border-color:#4b4841;border-radius:.35rem;background:#22221e;padding:.75rem}
  .chart-columns{min-height:7.2rem}
  .chart-column{grid-template-rows:auto 4.8rem auto}
  .chart-column-track{border-radius:.25rem;background:#34342f}
  .chart-column-track i{border-radius:.2rem .2rem 0 0}
  .result-transfer{border-radius:.35rem}
}
@media screen and (min-width:1200px){.calc-grid{grid-template-columns:minmax(0,1.42fr) minmax(300px,.68fr)}.input-panel,.result-panel{padding:1.15rem}}
@media screen and (max-width:640px){.debt-row,.scenario-row{grid-template-columns:1fr 1fr}.debt-row strong,.scenario-row strong{grid-column:1/-1}.input-clean{min-height:2.75rem}.result-metrics{grid-template-columns:1fr 1fr}}
</style>
