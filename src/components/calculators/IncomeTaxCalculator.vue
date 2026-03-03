<template>
  <div class="space-y-4">

    <!-- 標題說明 -->
    <div class="note-box flex items-start gap-2">
      <span class="text-base">📋</span>
      <div>
        <p class="font-medium text-ink-600 mb-0.5">適用對象：上班族、斜槓族、小房東</p>
        <p class="text-[11px] text-ink-400">依據 2026 年度綜合所得稅率表（財政部）。本試算為估算，實際以報稅結果為準。</p>
      </div>
    </div>

    <!-- ── 所得輸入 ── -->
    <div class="card-surface p-5 space-y-4">
      <h2 class="text-sm font-medium text-ink-600 flex items-center gap-2">
        <span class="w-1 h-4 bg-azure rounded-full"></span>
        全年所得
      </h2>

      <div>
        <label class="block text-xs font-medium text-ink-400 mb-1.5">薪資所得（NT$）</label>
        <input type="number" v-model.number="salaryIncome" class="input-clean tabular-nums text-lg font-semibold"
          placeholder="600,000" />
        <p class="text-[10px] text-ink-400 mt-1">可填年薪或多份工作薪資合計</p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">股利所得（NT$）</label>
          <input type="number" v-model.number="dividendIncome" class="input-clean tabular-nums" placeholder="0" />
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">利息所得（NT$）</label>
          <input type="number" v-model.number="interestIncome" class="input-clean tabular-nums" placeholder="0" />
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">租金收入（NT$）</label>
          <input type="number" v-model.number="rentalIncome" class="input-clean tabular-nums" placeholder="0" />
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">其他所得（NT$）</label>
          <input type="number" v-model.number="otherIncome" class="input-clean tabular-nums" placeholder="0" />
        </div>
      </div>
    </div>

    <!-- ── 家庭狀況 ── -->
    <div class="card-surface p-5 space-y-4">
      <h2 class="text-sm font-medium text-ink-600 flex items-center gap-2">
        <span class="w-1 h-4 bg-azure rounded-full"></span>
        家庭與扶養
      </h2>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">納稅義務人</label>
          <select v-model="filingStatus" class="input-clean">
            <option value="single">單身</option>
            <option value="married">已婚合併申報</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-400 mb-1.5">扶養親屬人數</label>
          <input type="number" v-model.number="dependents" class="input-clean" placeholder="0" min="0" max="10" />
          <p class="text-[10px] text-ink-400 mt-1">含子女、父母</p>
        </div>
      </div>

      <!-- 配偶所得（合併申報） -->
      <div v-if="filingStatus === 'married'" class="animate-fade-in-up">
        <label class="block text-xs font-medium text-ink-400 mb-1.5">配偶薪資所得（NT$）</label>
        <input type="number" v-model.number="spouseSalary" class="input-clean tabular-nums" placeholder="0" />
      </div>
    </div>

    <!-- ── 扣除額選擇 ── -->
    <div class="card-surface p-5 space-y-4">
      <h2 class="text-sm font-medium text-ink-600 flex items-center gap-2">
        <span class="w-1 h-4 bg-azure rounded-full"></span>
        扣除方式
        <span v-if="recommendation" :class="['text-[10px] font-medium px-2 py-0.5 rounded-full ml-auto',
          recommendation === 'itemized' ? 'bg-green-100 text-green-700' : 'bg-azure-100 text-azure-700']">
          建議選{{ recommendation === 'itemized' ? '列舉' : '標準' }}扣除
        </span>
      </h2>

      <div class="seg-control">
        <button @click="deductionType = 'standard'"
          :class="['seg-btn', deductionType === 'standard' ? 'seg-btn-active' : '']">標準扣除</button>
        <button @click="deductionType = 'itemized'"
          :class="['seg-btn', deductionType === 'itemized' ? 'seg-btn-active' : '']">列舉扣除</button>
      </div>

      <!-- 比較提示 -->
      <div class="grid grid-cols-2 gap-2 text-center text-xs">
        <div class="bg-paper-200/60 rounded-lg p-2">
          <p class="text-ink-400 mb-0.5">標準扣除額</p>
          <p class="font-semibold text-ink-700 tabular-nums">$ {{ fmt(standardDeduction) }}</p>
        </div>
        <div class="bg-paper-200/60 rounded-lg p-2">
          <p class="text-ink-400 mb-0.5">列舉扣除額</p>
          <p class="font-semibold text-ink-700 tabular-nums">$ {{ fmt(itemizedTotal) }}</p>
          <p v-if="itemizedTotal <= standardDeduction" class="text-[10px] text-amber-500 mt-0.5">低於標準扣除</p>
        </div>
      </div>

      <!-- 列舉扣除細項 -->
      <div v-if="deductionType === 'itemized'" class="space-y-3 animate-fade-in-up border-t border-paper-300 pt-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-1.5">捐贈支出（NT$）</label>
            <input type="number" v-model.number="donationDeduction" class="input-clean-sm tabular-nums" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-1.5">人身保險費（NT$）</label>
            <input type="number" v-model.number="insuranceDeduction" class="input-clean-sm tabular-nums" placeholder="0" />
            <p class="text-[10px] text-ink-400 mt-0.5">上限 24,000/人</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-1.5">醫藥及生育費（NT$）</label>
            <input type="number" v-model.number="medicalDeduction" class="input-clean-sm tabular-nums" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-1.5">自用住宅利息（NT$）</label>
            <input type="number" v-model.number="mortgageDeduction" class="input-clean-sm tabular-nums" placeholder="0" />
            <p class="text-[10px] text-ink-400 mt-0.5">上限 300,000</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-1.5">房屋租金支出（NT$）</label>
            <input type="number" v-model.number="rentDeduction" class="input-clean-sm tabular-nums" placeholder="0" />
            <p class="text-[10px] text-ink-400 mt-0.5">上限 120,000（自住、非出租）</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-400 mb-1.5">政治捐獻（NT$）</label>
            <input type="number" v-model.number="politicalDeduction" class="input-clean-sm tabular-nums" placeholder="0" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── 計算結果 ── -->
    <div class="card-surface p-5">
      <div class="flex items-start justify-between mb-5">
        <div>
          <p class="stat-label">估算應納所得稅</p>
          <p class="stat-value-lg" :class="totalTax > 0 ? 'text-ink-700' : 'text-green-600'">
            {{ totalTax > 0 ? '$' + fmt(totalTax) : '免稅 ✓' }}
          </p>
        </div>
        <button @click="copyResult"
          class="btn-ghost text-xs flex items-center gap-1.5 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          {{ copied ? '已複製 ✓' : '複製結果' }}
        </button>
      </div>

      <!-- 計算流程 -->
      <div class="space-y-2 text-sm mb-5">
        <div class="flex justify-between items-center py-2 border-b border-paper-200">
          <span class="text-ink-400">全年綜合所得總額</span>
          <span class="tabular-nums font-medium text-ink-700">$ {{ fmt(grossIncome) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-paper-200">
          <span class="text-ink-400">薪資特別扣除額</span>
          <span class="tabular-nums text-red-500">− $ {{ fmt(salarySpecialDeduction) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-paper-200">
          <span class="text-ink-400">免稅額（{{ totalExemptions }} 人）</span>
          <span class="tabular-nums text-red-500">− $ {{ fmt(exemptionAmount) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-paper-200">
          <span class="text-ink-400">{{ deductionType === 'standard' ? '標準' : '列舉' }}扣除額</span>
          <span class="tabular-nums text-red-500">− $ {{ fmt(deductionType === 'standard' ? standardDeduction : itemizedTotal) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-paper-200 font-medium">
          <span class="text-ink-600">課稅所得淨額</span>
          <span class="tabular-nums text-ink-700">$ {{ fmt(Math.max(0, taxableIncome)) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-paper-200">
          <span class="text-ink-400">適用稅率</span>
          <span class="font-bold text-azure">{{ taxBracketLabel }}</span>
        </div>
        <div class="flex justify-between items-center py-2 font-semibold">
          <span class="text-ink-700">估算應納稅額</span>
          <span class="tabular-nums text-ink-800">$ {{ fmt(totalTax) }}</span>
        </div>
      </div>

      <!-- 有效稅率 -->
      <div class="grid grid-cols-3 gap-2 text-center text-xs">
        <div class="bg-paper-200/60 rounded-xl p-3">
          <p class="text-ink-400 mb-0.5">有效稅率</p>
          <p class="text-base font-bold text-ink-700">{{ effectiveRate }}%</p>
        </div>
        <div class="bg-paper-200/60 rounded-xl p-3">
          <p class="text-ink-400 mb-0.5">月繳估算</p>
          <p class="text-base font-bold text-ink-700 tabular-nums">$ {{ fmt(Math.round(totalTax / 12)) }}</p>
        </div>
        <div class="bg-paper-200/60 rounded-xl p-3">
          <p class="text-ink-400 mb-0.5">所得後稅率</p>
          <p class="text-base font-bold text-ink-700">{{ afterTaxRate }}%</p>
        </div>
      </div>
    </div>

    <!-- 稅率級距表 -->
    <div class="card-surface p-5">
      <h3 class="text-sm font-medium text-ink-600 mb-3">2026 累進稅率級距</h3>
      <div class="space-y-1.5">
        <div v-for="bracket in TAX_BRACKETS" :key="bracket.rate"
          :class="['flex items-center justify-between text-xs px-3 py-2 rounded-lg transition-colors',
            isCurrentBracket(bracket) ? 'bg-azure-50 border border-azure-100' : 'bg-paper-200/40']">
          <div class="flex items-center gap-2">
            <span v-if="isCurrentBracket(bracket)" class="w-1.5 h-1.5 bg-azure rounded-full shrink-0"></span>
            <span v-else class="w-1.5 h-1.5 rounded-full bg-paper-300 shrink-0"></span>
            <span :class="isCurrentBracket(bracket) ? 'text-azure font-medium' : 'text-ink-400'">
              {{ fmt(bracket.min + 1) }} ~ {{ bracket.max === Infinity ? '以上' : fmt(bracket.max) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['font-bold', isCurrentBracket(bracket) ? 'text-azure' : 'text-ink-500']">
              {{ bracket.rate * 100 }}%
            </span>
            <span v-if="bracket.subtract > 0" class="text-ink-300 text-[10px]">
              累進差額 {{ fmt(bracket.subtract) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 免稅說明 -->
    <div class="note-box space-y-1.5">
      <p class="font-medium text-ink-500">2026 扣除標準（財政部公告）</p>
      <div class="grid grid-cols-2 gap-2 mt-2 text-[11px]">
        <div>• 每人免稅額：<strong>$97,000</strong></div>
        <div>• 標準扣除（單身）：<strong>$131,000</strong></div>
        <div>• 標準扣除（夫妻）：<strong>$262,000</strong></div>
        <div>• 薪資特別扣除：<strong>$218,000</strong>（上限）</div>
        <div>• 儲蓄投資特扣：<strong>$270,000</strong></div>
        <div>• 身障特別扣除：<strong>$218,000</strong>/人</div>
        <div>• 幼兒學前特扣：<strong>$150,000</strong>/人</div>
        <div>• 長照特別扣除：<strong>$120,000</strong>/人</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// ── 2026 所得稅常數 ──────────────────────────────────────────
const EXEMPTION_PER_PERSON  = 97000    // 免稅額/人
const SALARY_SPECIAL_MAX    = 218000   // 薪資特別扣除上限
const STANDARD_SINGLE       = 131000   // 標準扣除（單身）
const STANDARD_MARRIED      = 262000   // 標準扣除（已婚合申）
const SAVINGS_DEDUCTION_MAX = 270000   // 儲蓄投資特別扣除

const TAX_BRACKETS = [
  { min: 0,       max: 590000,   rate: 0.05, subtract: 0       },
  { min: 590000,  max: 1330000,  rate: 0.12, subtract: 41300   },
  { min: 1330000, max: 2660000,  rate: 0.20, subtract: 147700  },
  { min: 2660000, max: 4980000,  rate: 0.30, subtract: 413700  },
  { min: 4980000, max: Infinity, rate: 0.40, subtract: 911700  },
]

// ── 狀態 ─────────────────────────────────────────────────────
const salaryIncome      = ref(600000)
const dividendIncome    = ref(0)
const interestIncome    = ref(0)
const rentalIncome      = ref(0)
const otherIncome       = ref(0)
const spouseSalary      = ref(0)
const filingStatus      = ref('single')
const dependents        = ref(0)
const deductionType     = ref('standard')

// 列舉扣除細項
const donationDeduction   = ref(0)
const insuranceDeduction  = ref(0)   // 上限 24,000/人
const medicalDeduction    = ref(0)
const mortgageDeduction   = ref(0)   // 上限 300,000
const rentDeduction       = ref(0)   // 上限 120,000
const politicalDeduction  = ref(0)

const copied = ref(false)

// ── 工具 ─────────────────────────────────────────────────────
const fmt = (n) => (n ? Math.round(n).toLocaleString('zh-TW') : '0')

// ── Computed ─────────────────────────────────────────────────
// 總所得
const grossIncome = computed(() =>
  (salaryIncome.value || 0)
  + (dividendIncome.value || 0)
  + (interestIncome.value || 0)
  + (rentalIncome.value || 0)
  + (otherIncome.value || 0)
  + (filingStatus.value === 'married' ? (spouseSalary.value || 0) : 0)
)

// 薪資特別扣除（不超過薪資所得本身，且上限 218,000/人）
const salarySpecialDeduction = computed(() => {
  const totalSalary = (salaryIncome.value || 0) + (filingStatus.value === 'married' ? (spouseSalary.value || 0) : 0)
  const perPerson   = Math.min(totalSalary, SALARY_SPECIAL_MAX)
  // 有配偶薪資則各別計算
  if (filingStatus.value === 'married' && spouseSalary.value > 0) {
    return Math.min(salaryIncome.value || 0, SALARY_SPECIAL_MAX) +
           Math.min(spouseSalary.value || 0, SALARY_SPECIAL_MAX)
  }
  return Math.min(salaryIncome.value || 0, SALARY_SPECIAL_MAX)
})

// 免稅額（本人 + 配偶 + 扶養）
const totalExemptions = computed(() => {
  let count = 1
  if (filingStatus.value === 'married') count += 1
  count += (dependents.value || 0)
  return count
})
const exemptionAmount = computed(() => totalExemptions.value * EXEMPTION_PER_PERSON)

// 標準扣除額
const standardDeduction = computed(() =>
  filingStatus.value === 'married' ? STANDARD_MARRIED : STANDARD_SINGLE
)

// 儲蓄投資特別扣除（利息所得）
const savingsDeduction = computed(() =>
  Math.min(interestIncome.value || 0, SAVINGS_DEDUCTION_MAX)
)

// 列舉扣除合計（含各項上限）
const itemizedTotal = computed(() => {
  const perPersonInsuranceCap = 24000 * totalExemptions.value
  const ins  = Math.min(insuranceDeduction.value || 0, perPersonInsuranceCap)
  const mort = Math.min(mortgageDeduction.value || 0, 300000)
  const rent = Math.min(rentDeduction.value || 0, 120000)
  return (donationDeduction.value || 0) + ins + (medicalDeduction.value || 0) + mort + rent + (politicalDeduction.value || 0)
})

// 建議使用哪種扣除
const recommendation = computed(() => {
  if (deductionType.value === 'itemized') return null
  return itemizedTotal.value > standardDeduction.value ? 'itemized' : 'standard'
})

// 課稅所得淨額
const taxableIncome = computed(() => {
  const deduction = deductionType.value === 'standard'
    ? standardDeduction.value
    : Math.max(itemizedTotal.value, 0)

  return grossIncome.value
    - salarySpecialDeduction.value
    - exemptionAmount.value
    - deduction
    - savingsDeduction.value
})

// 計算稅額（累進）
const calcTax = (income) => {
  if (income <= 0) return 0
  for (const b of TAX_BRACKETS) {
    if (income <= b.max) {
      return Math.round(income * b.rate - b.subtract)
    }
  }
  return 0
}

const totalTax = computed(() => Math.max(0, calcTax(taxableIncome.value)))

// 目前適用稅率級距
const currentBracket = computed(() => {
  const income = Math.max(0, taxableIncome.value)
  for (const b of TAX_BRACKETS) {
    if (income <= b.max) return b
  }
  return TAX_BRACKETS[TAX_BRACKETS.length - 1]
})

const isCurrentBracket = (b) => b === currentBracket.value && taxableIncome.value > 0

const taxBracketLabel = computed(() => {
  if (taxableIncome.value <= 0) return '0%（免稅）'
  return currentBracket.value.rate * 100 + '%'
})

// 有效稅率 & 稅後率
const effectiveRate = computed(() => {
  if (!grossIncome.value) return '0'
  return (totalTax.value / grossIncome.value * 100).toFixed(1)
})

const afterTaxRate = computed(() => {
  if (!grossIncome.value) return '100'
  return ((1 - totalTax.value / grossIncome.value) * 100).toFixed(1)
})

// ── 複製結果 ───────────────────────────────────────────────
const copyResult = async () => {
  const text = `TaiCalc 綜合所得稅試算結果\n── 2026 年度 ──\n全年所得：$${fmt(grossIncome.value)}\n應納稅額：$${fmt(totalTax.value)}\n有效稅率：${effectiveRate.value}%\n（以上為估算，詳見 taicalc.com）`
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {}
}

// 若列舉比標準高，自動切換建議提示
watch(deductionType, () => {})

// ── 從 LocalStorage 抓取全站通用輸入 (黏著度體驗) ───────────────────
import { onMounted } from 'vue'
onMounted(() => {
  try {
    const saved = localStorage.getItem('taicalc_salary_inputs')
    if (saved) {
      const data = JSON.parse(saved)
      if (data.salary) {
        // 從薪資計算器帶入年薪：月薪 * (12 + (年終或0))
        const s = data.salary
        const b = data.bonus !== undefined ? data.bonus : 0
        salaryIncome.value = s * (12 + b)
      }
    }
  } catch (e) {}
})

</script>
