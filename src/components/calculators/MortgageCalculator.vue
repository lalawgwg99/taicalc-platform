<template>
    <div class="calculator-shell">

        <!-- 快速預設 -->
        <div class="seg-control">
            <button @click="applyPreset('newYouth')" :class="['seg-btn', preset === 'newYouth' ? 'seg-btn-active' : '']">青安3.0</button>
            <button @click="applyPreset('general')"  :class="['seg-btn', preset === 'general'  ? 'seg-btn-active' : '']">一般房貸</button>
        </div>

        <!-- 基本設定 -->
        <div class="card-surface p-5 space-y-4">
            <div>
                <label for="fld-2093a6d1" class="block text-xs font-medium text-ink-400 mb-1.5">貸款總額（萬）</label>
                <ThousandsInput v-model="amountWan" id="fld-2093a6d1" aria-label="貸款總額" placeholder="1000"
                    input-class="input-clean text-xl font-semibold tabular-nums" />
                <p v-if="amountError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ amountError }}</p>
                <p v-else-if="amountCapNote" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ amountCapNote }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="fld-cb5e11e0" class="block text-xs font-medium text-ink-400 mb-1.5">貸款年限</label>
                    <input id="fld-cb5e11e0" type="text" inputmode="decimal" v-model.number="years" v-sync-change aria-label="貸款年限"
                        class="input-clean font-semibold">
                    <p v-if="yearsError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ yearsError }}</p>
                    <p v-else-if="yearsCapNote" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ yearsCapNote }}</p>
                </div>
                <div>
                    <label for="fld-1dced319" class="block text-xs font-medium text-ink-400 mb-1.5">寬限期（年）</label>
                    <select id="fld-1dced319" v-model.number="graceYears" aria-label="寬限期"
                        class="input-clean font-medium">
                        <option :value="0">無寬限期</option>
                        <option v-for="y in 5" :key="y" :value="y">{{ y }} 年</option>
                    </select>
                    <p v-if="graceNote" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ graceNote }}</p>
                </div>
            </div>
        </div>

        <!-- 利率設定 -->
        <div class="card-surface p-5 space-y-3">
            <p class="text-sm font-medium text-ink-600">利率設定</p>
            <div>
                <div>
                    <label for="fld-f18441ea" class="block text-xs font-medium text-ink-400 mb-1.5">年利率（%）</label>
                    <input id="fld-f18441ea" type="text" inputmode="decimal" v-model.number="rate1" v-sync-change step="0.005" aria-label="利率"
                        :class="['input-clean font-semibold tabular-nums transition-all', rateFlash ? 'border-azure shadow-input' : '']">
                    <p v-if="rateError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ rateError }}</p>
                </div>
                <p v-if="preset === 'newYouth'" class="text-[11px] text-ink-400 mt-1.5 leading-5">
                    前 3 年 1.775%，之後逐年退場至 2.275%。
                </p>
                <details v-if="preset === 'newYouth'" class="text-[11px] text-ink-400 mt-1">
                    <summary class="cursor-pointer">退場明細</summary>
                    <p class="mt-1 leading-5">第 4 年 1.9%、第 5 年 2.025%、第 6 年 2.15%、第 7 年起 2.275%。本試算以現行優惠利率估算，實際總利息會更高。</p>
                </details>
            </div>
        </div>
            <!-- 央行即時利率提示 -->
        <div v-if="liveRate" class="flex items-center justify-between bg-azure-50 rounded-lg px-3 py-2 animate-fade-in-up">
            <div class="flex items-center gap-1.5 text-[11px] text-azure min-w-0">
                <span class="w-1.5 h-1.5 bg-azure rounded-full animate-pulse flex-shrink-0"></span>
                <span>央行最新平均</span>
                <strong class="font-semibold">{{ liveRate.rate }}%</strong>
                <span class="text-ink-400 truncate">（{{ liveRate.period }}）</span>
            </div>
            <button @click="applyLiveRate"
                class="text-[11px] font-medium text-azure hover:text-azure-700 transition-colors ml-3 flex-shrink-0">
                套用 →
            </button>
        </div>

        <!-- 提前還款 -->
        <div class="card-surface p-5 space-y-3">
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-ink-600">提前還款試算</p>
                <button @click="prepaymentMode = !prepaymentMode"
                    class="text-xs text-azure hover:underline transition-colors">
                    {{ prepaymentMode ? '關閉' : '開啟' }}
                </button>
            </div>
            <div v-if="prepaymentMode" class="space-y-3 animate-fade-in-up">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label for="fld-4409c558" class="block text-xs font-medium text-ink-400 mb-1.5">每月多還（元）</label>
                        <ThousandsInput v-model="extraMonthly" id="fld-4409c558" aria-label="每月多還" placeholder="0"
                            input-class="input-clean tabular-nums" />
                    </div>
                    <div>
                        <label for="fld-31f5edce" class="block text-xs font-medium text-ink-400 mb-1.5">單筆大額還款（萬）</label>
                        <ThousandsInput v-model="extraLump" id="fld-31f5edce" aria-label="單筆大額還款" placeholder="0"
                            input-class="input-clean tabular-nums" />
                    </div>
                </div>
                <p v-if="extraError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ extraError }}</p>
                <div>
                    <label for="fld-b1594c4f" class="block text-xs font-medium text-ink-400 mb-1.5">大額還款時間（第 {{ lumpYear }} 年）</label>
                    <input id="fld-b1594c4f" type="range" v-model.number="lumpYear" min="1" :max="Math.max(1, (effectiveYears ?? 1) - 1)"
                        class="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-azure-500">
                </div>
            </div>
        </div>

        <!-- ── 結果（帳本收據式） ── -->
        <div class="receipt-card">
            <div class="receipt-head">
                <p class="receipt-title">每個月要繳</p>
                <span class="data-pill !px-2.5 !py-1 text-brand-700 bg-brand-50 border-brand-200">本息分期攤還</span>
            </div>
            <hr class="receipt-divider" />

            <!-- 輸入無效時不顯示數字 -->
            <div v-if="hasBlockingError" class="py-8 text-center">
                <p class="text-sm font-medium text-ink-600">請先修正上方輸入再試算</p>
            </div>
            <div v-else>
            <!-- 有寬限期 -->
            <div v-if="effectiveGraceYears > 0" class="text-center">
                <div class="mb-4">
                    <p class="text-xs text-ink-400 mb-1">寬限期內（{{ effectiveGraceYears }} 年）</p>
                    <p class="stat-value-lg text-azure">$ {{ fmt(results.gracePay) }}</p>
                </div>
                <div class="h-px bg-paper-300 w-24 mx-auto my-4"></div>
                <div>
                    <p class="text-xs text-ink-400 mb-1">寬限期後</p>
                    <p class="stat-value-md text-ink-700">$ {{ fmt(results.afterGracePay) }}</p>
                </div>
            </div>

            <!-- 無寬限期 -->
            <div v-else class="text-center">
                <p class="stat-value-lg text-azure">${{ fmt(results.basePay) }}</p>
            </div>

            <!-- 摘要統計 -->
            <div class="grid grid-cols-2 gap-3 mt-5">
                <div class="bg-paper-200/60 rounded-xl p-3">
                    <p class="text-xs text-ink-400 mb-0.5">利息總共繳多少</p>
                    <p class="text-base font-semibold text-ink-700 tabular-nums whitespace-nowrap">${{ fmt(results.totalInterest) }}</p>
                </div>
                <div class="bg-paper-200/60 rounded-xl p-3">
                    <p class="text-xs text-ink-400 mb-0.5">全部總共要繳</p>
                    <p class="text-base font-semibold text-ink-700 tabular-nums whitespace-nowrap">${{ fmt(results.totalPayment) }}</p>
                </div>
            </div>

            <div class="mt-5 flex justify-center">
                <SnapshotButton
                    tool-name="房貸試算"
                    :metrics="[
                        { label: '每個月要繳', value: '$' + fmt(effectiveGraceYears > 0 ? results.gracePay : results.basePay) },
                        { label: '利息總共繳多少', value: '$' + fmt(results.totalInterest) },
                        { label: '全部總共要繳', value: '$' + fmt(results.totalPayment) },
                    ]"
                />
            </div>

            <figure class="mt-4 border-t border-[#E3DCCB] pt-4" role="img" :aria-label="mortgageBreakdownLabel">
                <figcaption class="mb-3 flex items-end justify-between gap-3">
                    <span><strong class="block text-xs">總額裡面多少是本金、多少是利息</strong><small class="mt-0.5 block text-[10px] text-ink-400">一眼看出利息吃掉多少</small></span>
                    <small class="text-[10px] text-ink-400">整個貸款期間</small>
                </figcaption>
                <div class="flex h-3 overflow-hidden rounded-full bg-[#E3DCCB]" aria-hidden="true">
                    <i class="block h-full bg-brand-400 transition-all" :style="{ width: `${mortgagePrincipalShare}%` }"></i>
                    <i class="block h-full border-l-2 border-[#FDFCF8] bg-amber-400 transition-all" :style="{ width: `${mortgageInterestShare}%` }"></i>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-8 text-[10px]">
                    <div class="flex items-center justify-between gap-2 text-ink-400"><span class="inline-flex items-center gap-1.5"><i class="h-2 w-2 rounded-full bg-brand-400"></i>本金</span><strong class="whitespace-nowrap text-ink-700">$ {{ fmt(mortgagePrincipal) }}</strong></div>
                    <div class="flex items-center justify-between gap-2 text-ink-400"><span class="inline-flex items-center gap-1.5"><i class="h-2 w-2 rounded-full bg-amber-400"></i>利息</span><strong class="whitespace-nowrap text-ink-700">$ {{ fmt(results.totalInterest) }}</strong></div>
                </div>
            </figure>

            <!-- 提前還款效益 -->
            <div v-if="prepaymentMode && (extraMonthly > 0 || extraLump > 0)"
                class="mt-4 border-l-2 border-[#A58436] pl-3 py-1 animate-fade-in-up">
                <p class="text-xs font-medium text-amber-700 mb-3">提前還款效益</p>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <p class="text-xs text-amber-600/70 mb-0.5">節省利息</p>
                        <p class="text-lg font-bold text-amber-700 tabular-nums">$ {{ fmt(results.interestSaved) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-amber-600/70 mb-0.5">縮短時間</p>
                        <p class="text-lg font-bold text-amber-700">
                            {{ Math.floor(results.monthsSaved / 12) }} 年
                            {{ results.monthsSaved % 12 }} 月
                        </p>
                    </div>
                </div>
            </div>
            </div>
        </div>

        <!-- 競品優勢：方案對照與年度明細展延卡 -->
        <div class="border-t border-[#E3DCCB] pt-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold text-ink-400 uppercase tracking-wider">方案與試算明細</h3>
            <button 
              @click="showSchedule = !showSchedule" 
              class="text-xs text-[#1D4B34] font-semibold hover:underline underline-offset-4 px-0 py-1 transition-colors"
            >
              {{ showSchedule ? '收起 ▲' : '年度明細 ▼' }}
            </button>
          </div>

          <!-- 480期/年度還款明細表 -->
          <div v-if="showSchedule" class="mt-3 border-t border-[#E3DCCB] pt-3 max-h-72 overflow-y-auto overflow-x-auto font-mono text-xs">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-ink-100 text-ink-400 font-sans">
                  <th class="py-1.5 whitespace-nowrap">年度</th>
                  <th class="py-1.5 text-right whitespace-nowrap">當年還本金</th>
                  <th class="py-1.5 text-right whitespace-nowrap">當年繳利息</th>
                  <th class="py-1.5 text-right whitespace-nowrap">年底還欠多少</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-paper-100">
                <tr v-for="item in yearlySchedule" :key="item.year" class="hover:bg-paper-50">
                  <td class="py-1.5 font-semibold text-ink-600">第 {{ item.year }} 年</td>
                  <td class="py-1.5 text-right text-ink-900">${{ item.yearPrincipal.toLocaleString() }}</td>
                  <td class="py-1.5 text-right text-amber-600">${{ item.yearInterest.toLocaleString() }}</td>
                  <td class="py-1.5 text-right text-ink-400">${{ item.remainingBalance.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <a
            :href="homeCostTransferUrl"
            data-next-tool
            class="flex items-center justify-between gap-3 px-0 py-3 text-sm font-semibold text-brand-700 transition-all hover:underline underline-offset-4"
        >
            <span><small class="block text-[10px] font-medium text-brand-600/70">下一步</small>把房貸帶入買房持有成本</span>
            <span aria-hidden="true">→</span>
        </a>

        <!-- 月付房租比 -->
        <div class="note-box">
            <p>月付金佔稅前月薪比例建議不超過 <strong>30~40%</strong>。</p>
        </div>

        <!-- 分享列 -->
        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-ink-600 hover:text-brand-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {{ shareCopied ? '已複製連結 ✓' : '複製分享連結' }}
            </button>
            <button @click="downloadCard"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-ink-600 hover:text-brand-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                下載試算圖卡
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Decimal from 'decimal.js';
import { calculateMortgageResults } from '../../utils/calculators/mortgage';
import SnapshotButton from '../SnapshotButton.vue';
import ThousandsInput from '../ThousandsInput.vue';
import { vSyncChange } from '../../utils/vueSyncChange';
import { getSharedLoanAmountWan, setSharedLoanAmountWan, onSharedLoanAmountChange, MORTGAGE_TAB_EVENT } from '../../utils/mortgageSharedAmount';

// ── 狀態 ───────────────────────────────────────────────────────
const amountWan    = ref(1000)
const years        = ref(40)
const graceYears   = ref(5)
const rate1        = ref(1.775)
const rate2        = ref(2.299)
const twoStageMode = ref(false)  // 預設關閉，避免初次用戶困惑
const stage1Months = ref(12)
const preset       = ref('newYouth')
const monthlyIncomeRef = ref(0)

// ── 驗證（取代靜默 clamp：錯誤顯示紅字、結果區不顯示數字）──────────
// 超上限（總額 > 10,000 萬、年限 > 50 年）不擋結果，按上限計算並提示；
// 寬限期 ≥ 年限不改 ref 值，計算用有效寬限期（年限 - 1），並顯示調整原因。
const amountError = computed(() => {
    const v = amountWan.value
    if (typeof v !== 'number' || !Number.isFinite(v)) return '請輸入貸款總額'
    if (v <= 0) return '貸款總額須大於 0'
    return ''
})
const amountCapNote = computed(() => (typeof amountWan.value === 'number' && amountWan.value > 10000) ? '貸款總額上限 10,000 萬（1 億元），已按上限計算' : '')
const effectiveAmountWan = computed(() => {
    const v = amountWan.value
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) return null
    return Math.min(v, 10000)
})
const yearsError = computed(() => {
    const v = years.value
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) return '貸款年限須為 1～50 年'
    return ''
})
const yearsCapNote = computed(() => (typeof years.value === 'number' && years.value > 50) ? '貸款年限上限 50 年，已按 50 年計算' : '')
const effectiveYears = computed(() => {
    const v = years.value
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) return null
    return Math.min(v, 50)
})
const effectiveGraceYears = computed(() => {
    const y = effectiveYears.value
    const g = typeof graceYears.value === 'number' && Number.isFinite(graceYears.value) ? graceYears.value : 0
    if (y === null) return Math.max(0, g)
    return Math.max(0, Math.min(g, y - 1))
})
const graceNote = computed(() => {
    const y = effectiveYears.value
    if (y === null) return ''
    if ((graceYears.value ?? 0) >= y) return `寬限期不可超過年限，已調整為 ${effectiveGraceYears.value} 年`
    return ''
})
const rateError = computed(() => {
    const v = rate1.value
    if (typeof v !== 'number' || !Number.isFinite(v)) return '請輸入年利率'
    if (v < 0) return '年利率不可為負數'
    return ''
})
const hasBlockingError = computed(() => !!amountError.value || !!yearsError.value || !!rateError.value)

const showSchedule = ref(false)
const yearlySchedule = computed(() => {
  const list = []
  const P = (effectiveAmountWan.value ?? 0) * 10000
  const Y = effectiveYears.value ?? 0
  const G = effectiveGraceYears.value
  const r = (typeof rate1.value === 'number' && Number.isFinite(rate1.value) ? rate1.value : 0) / 100 / 12
  if (P <= 0 || Y <= 0) return []

  let balance = P
  for (let year = 1; year <= Y; year++) {
    let yearPrincipal = 0
    let yearInterest = 0
    for (let month = 1; month <= 12; month++) {
      const currentMonthIndex = (year - 1) * 12 + month
      let monthInterest = balance * r
      let monthPrincipal = 0
      if (currentMonthIndex <= G * 12) {
        monthPrincipal = 0
      } else {
        const remainingMonths = Y * 12 - G * 12
        if (remainingMonths > 0) {
          const power = Math.pow(1 + r, remainingMonths)
          const monthlyPayment = r === 0 ? P / remainingMonths : (P * r * power) / (power - 1)
          monthPrincipal = Math.min(balance, monthlyPayment - monthInterest)
        }
      }
      yearInterest += monthInterest
      yearPrincipal += monthPrincipal
      balance = Math.max(0, balance - monthPrincipal)
    }
    list.push({
      year,
      yearPrincipal: Math.round(yearPrincipal),
      yearInterest: Math.round(yearInterest),
      remainingBalance: Math.round(balance)
    })
  }
  return list
})

// ── 央行即時利率 ──────────────────────────────────────────────────────
const liveRate  = ref(null)
const rateFlash = ref(false)

const fetchLiveRate = async () => {
    try {
        const res = await fetch('/api/rates?type=mortgage')
        if (!res.ok) return
        const data = await res.json()
        if (data?.rate) liveRate.value = data
    } catch (_) {}
}

const applyLiveRate = () => {
    if (!liveRate.value) return
    rate1.value     = parseFloat(liveRate.value.rate)
    rateFlash.value = true
    setTimeout(() => { rateFlash.value = false }, 1500)
}

const prepaymentMode = ref(false)
const extraMonthly   = ref(0)
const extraLump      = ref(0)
const lumpYear       = ref(3)

// 提前還款欄位負數只提示、不擋結果（計算端本來就只認 > 0 的值）
const extraError = computed(() => {
    if ((typeof extraMonthly.value === 'number' && extraMonthly.value < 0) ||
        (typeof extraLump.value === 'number' && extraLump.value < 0)) return '提前還款金額不可為負數'
    return ''
})

// ── 快速預設 ───────────────────────────────────────────────────
const applyPreset = (type) => {
    preset.value = type
    if (type === 'newYouth') {
        amountWan.value    = 1000
        years.value        = 40
        graceYears.value   = 5
        rate1.value        = 1.775
        twoStageMode.value = false
        stage1Months.value = 12
    } else {
        amountWan.value    = 1200
        years.value        = 30
        graceYears.value   = 0
        rate1.value        = 2.5
        twoStageMode.value = false
    }
}

// ── 預設按鈕高亮同步 ─────────────────────────────────────────────
// 高亮必須反映欄位實際值：還原 localStorage／URL 參數／手動改欄位後，
// 若欄位恰好等於某組預設值才亮該按鈕，否則不亮任何按鈕，避免「亮青安、算一般」的誤導。
function syncPresetFromFields() {
    if (amountWan.value === 1000 && years.value === 40 && graceYears.value === 5 && rate1.value === 1.775) {
        preset.value = 'newYouth'
    } else if (amountWan.value === 1200 && years.value === 30 && graceYears.value === 0 && rate1.value === 2.5) {
        preset.value = 'general'
    } else {
        preset.value = ''
    }
}

// ── 工具 ───────────────────────────────────────────────────────
const fmt = (n) => n ? new Decimal(n).round().toNumber().toLocaleString('zh-TW') : '0'

// ── 核心計算 ───────────────────────────────────────────────────
const results = computed(() => calculateMortgageResults({
    amountWan: effectiveAmountWan.value ?? 0,
    years: effectiveYears.value ?? 0,
    graceYears: effectiveGraceYears.value,
    rate1: typeof rate1.value === 'number' && Number.isFinite(rate1.value) ? rate1.value : 0,
    rate2: rate2.value,
    twoStageMode: twoStageMode.value,
    stage1Months: stage1Months.value,
    prepaymentMode: prepaymentMode.value,
    extraMonthly: extraMonthly.value ?? 0,
    extraLump: extraLump.value ?? 0,
    lumpYear: lumpYear.value,
}))
const mortgagePrincipal = computed(() => Math.max(0, (effectiveAmountWan.value ?? 0) * 10000))
const mortgageBreakdownTotal = computed(() => Math.max(1, mortgagePrincipal.value + Math.max(0, results.value.totalInterest)))
const mortgagePrincipalShare = computed(() => mortgagePrincipal.value / mortgageBreakdownTotal.value * 100)
const mortgageInterestShare = computed(() => Math.max(0, results.value.totalInterest) / mortgageBreakdownTotal.value * 100)
const mortgageBreakdownLabel = computed(() => `總共要繳：本金 ${fmt(mortgagePrincipal.value)} 元、利息 ${fmt(results.value.totalInterest)} 元`)
const homeCostTransferUrl = computed(() => {
    const scenario = {
        home: {
            mortgageBalance: Math.max(0, (effectiveAmountWan.value ?? 0) * 10000),
            mortgageRate: Math.max(0, typeof rate1.value === 'number' && Number.isFinite(rate1.value) ? rate1.value : 0),
            mortgageYears: Math.max(1, effectiveYears.value ?? 1),
        },
    }
    return `/tools/home-ownership-cost-calculator?scenario=${encodeURIComponent(JSON.stringify(scenario))}`
})

// ── 驗證 ───────────────────────────────────────────────────────
// 欄位錯誤由上方的 amountError / yearsError / rateError 等 computed 呈現，
// 不再靜默改值；只有大額還款滑桿跟著年限上限走（滑桿 max 由年限決定）。
watch(effectiveYears, (y) => {
    if (y === null) return
    const maxLumpYear = Math.max(1, y - 1)
    if (lumpYear.value > maxLumpYear) lumpYear.value = maxLumpYear
})

// ── 三分頁共用貸款總額 ─────────────────────────────────────────
watch(amountWan, (v) => {
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) setSharedLoanAmountWan(v)
})
let offSharedLoanAmount = null
const handleMortgageTab = () => {
    const shared = getSharedLoanAmountWan()
    if (shared !== null && shared !== amountWan.value) amountWan.value = shared
}
onUnmounted(() => {
    if (offSharedLoanAmount) offSharedLoanAmount()
    if (typeof window !== 'undefined') window.removeEventListener(MORTGAGE_TAB_EVENT, handleMortgageTab)
})

// ── Dashboard 儲存 ─────────────────────────────────────────────
watch(results, (v) => {
    if (typeof localStorage === 'undefined') return
    const val = v.afterGracePay || v.basePay
    try {
        if (val > 0) localStorage.setItem('taicalc_mortgage_monthly', Math.floor(val))
        else         localStorage.removeItem('taicalc_mortgage_monthly')
    } catch (e) {}
}, { deep: true, immediate: true })

// ── 分享連結 ───────────────────────────────────────────────────
const shareCopied = ref(false)

const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({
        amount: String(effectiveAmountWan.value ?? 0),
        years:  String(effectiveYears.value ?? 0),
        grace:  String(effectiveGraceYears.value),
        r1:     String(typeof rate1.value === 'number' && Number.isFinite(rate1.value) ? rate1.value : 0),
        r2:     String(rate2.value),
        ts:     twoStageMode.value ? '1' : '0',
        sm:     String(stage1Months.value),
    })
    return `${window.location.origin}/tools/mortgage-calculator?${p.toString()}`
}

const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(buildShareURL())
        shareCopied.value = true
        setTimeout(() => { shareCopied.value = false }, 2500)
    } catch (_) {}
}

// ── 下載圖卡 ───────────────────────────────────────────────────
const downloadCard = () => {
    const canvas = document.createElement('canvas')
    const W = 800, H = 420
    canvas.width  = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 背景
    ctx.fillStyle = '#F7F5F0'
    ctx.fillRect(0, 0, W, H)

    // 橘色左側裝飾條
    ctx.fillStyle = '#059669'
    ctx.fillRect(0, 0, 6, H)

    // 白色主卡片區
    ctx.fillStyle = '#FFFFFF'
    roundRect(ctx, 32, 32, W - 64, H - 64, 16)
    ctx.fill()

    // 品牌名稱
    ctx.fillStyle = '#059669'
    ctx.font = 'bold 13px -apple-system, sans-serif'
    ctx.fillText('TaiCalc', 64, 72)

    // 標題
    ctx.fillStyle = '#1A1A1A'
    ctx.font = 'bold 22px -apple-system, sans-serif'
    ctx.fillText('房貸試算結果', 64, 110)

    // 貸款條件
    ctx.fillStyle = '#5A5A5A'
    ctx.font = '13px -apple-system, sans-serif'
    const conditionText = `貸款 ${effectiveAmountWan.value ?? 0} 萬 · ${effectiveYears.value ?? 0} 年期 · 利率 ${rate1.value}%${effectiveGraceYears.value > 0 ? ` · 寬限 ${effectiveGraceYears.value} 年` : ''}`
    ctx.fillText(conditionText, 64, 136)

    // 分隔線
    ctx.strokeStyle = '#E2DED5'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(64, 154)
    ctx.lineTo(W - 64, 154)
    ctx.stroke()

    // 主要數字
    const mainPay = results.value.gracePay || results.value.basePay
    const mainLabel = effectiveGraceYears.value > 0 ? `寬限期每月繳（${effectiveGraceYears.value} 年）` : '每月要繳'
    ctx.fillStyle = '#9B9890'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillText(mainLabel, 64, 184)
    ctx.fillStyle = '#059669'
    ctx.font = 'bold 44px -apple-system, sans-serif'
    ctx.fillText(`$ ${fmt(mainPay)}`, 64, 236)

    // 次要數字
    if (effectiveGraceYears.value > 0) {
        ctx.fillStyle = '#9B9890'
        ctx.font = '12px -apple-system, sans-serif'
        ctx.fillText('寬限期後每月繳', 64, 266)
        ctx.fillStyle = '#1A1A1A'
        ctx.font = 'bold 24px -apple-system, sans-serif'
        ctx.fillText(`$ ${fmt(results.value.afterGracePay)}`, 64, 293)
    }

    // 右側統計
    const rightX = 500
    ctx.fillStyle = '#9B9890'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillText('利息總共繳多少', rightX, 184)
    ctx.fillStyle = '#1A1A1A'
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillText(`$ ${fmt(results.value.totalInterest)}`, rightX, 210)

    ctx.fillStyle = '#9B9890'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillText('總共要繳', rightX, 240)
    ctx.fillStyle = '#1A1A1A'
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillText(`$ ${fmt(results.value.totalPayment)}`, rightX, 266)

    // 底部網址
    ctx.fillStyle = '#C4C0B6'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.fillText('taicalc.com  ·  本地計算，資料不上傳', 64, H - 44)

    // 下載
    const a = document.createElement('a')
    a.download = `TaiCalc-房貸試算-${effectiveAmountWan.value ?? 0}萬.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

// ── 持久化 + URL 參數 ─────────────────────────────────────────
onMounted(() => {
    fetchLiveRate()

    // 三分頁共用貸款總額：先掛監聽（要在 URL 早退分支之前，否則早退會漏掛）
    offSharedLoanAmount = onSharedLoanAmountChange((v) => {
        if (v !== amountWan.value) amountWan.value = v
    })
    if (typeof window !== 'undefined') window.addEventListener(MORTGAGE_TAB_EVENT, handleMortgageTab)

    // 1. URL 參數優先（分享連結）
    if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search)
        if (p.has('amount'))  amountWan.value    = parseFloat(p.get('amount')) || amountWan.value
        if (p.has('years'))   years.value        = parseInt(p.get('years'))    || years.value
        if (p.has('grace'))   graceYears.value   = parseInt(p.get('grace'))    ?? graceYears.value
        if (p.has('r1'))      rate1.value        = parseFloat(p.get('r1'))     || rate1.value
        // 二段式已於青安3.0取消：舊分享連結的 r2/ts/sm 參數不再讀取，強制單一利率
        twoStageMode.value = false
        // 有 URL 參數時不再讀 localStorage，直接返回
        if (p.has('amount') || p.has('r1')) {
            syncPresetFromFields()
            if (typeof amountWan.value === 'number' && amountWan.value > 0) setSharedLoanAmountWan(amountWan.value)
            return
        }
    }

    // 2. localStorage 備份
    if (typeof localStorage !== 'undefined') {
        try {
            const saved = localStorage.getItem('taicalc_mortgage_inputs')
            if (saved) {
                const d = JSON.parse(saved)
                if (d.amountWan)               amountWan.value    = d.amountWan
                if (d.years)                   years.value        = d.years
                if (d.graceYears !== undefined) graceYears.value  = d.graceYears
                if (d.rate1)                   rate1.value        = d.rate1
                // 舊版 localStorage 的二段式欄位不再還原，強制單一利率
                twoStageMode.value = false
            }
        } catch (e) {}
    }
    // 3. 共用貸款總額：有共用值就採用（覆蓋 localStorage 還原值），
    //    沒有就把主分頁目前的值寫進共用值，讓另兩個分頁跟進
    const shared = getSharedLoanAmountWan()
    if (shared !== null) amountWan.value = shared
    else if (typeof amountWan.value === 'number' && amountWan.value > 0) setSharedLoanAmountWan(amountWan.value)
    syncPresetFromFields()
})

watch([amountWan, years, graceYears, rate1, rate2, twoStageMode, stage1Months], (vals) => {
    syncPresetFromFields()
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.setItem('taicalc_mortgage_inputs', JSON.stringify({
            amountWan: vals[0], years: vals[1], graceYears: vals[2],
            rate1: vals[3], rate2: vals[4], twoStageMode: vals[5], stage1Months: vals[6]
        }))
    } catch (e) {}
})
</script>
