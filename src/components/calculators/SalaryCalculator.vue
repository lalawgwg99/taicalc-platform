<template>
    <div class="space-y-4">

        <!-- 輸入卡片 -->
        <div class="card-surface p-5">
            <!-- 模式切換 -->
            <div class="seg-control mb-5">
                <button @click="mode = 'single'" :class="['seg-btn', mode === 'single' ? 'seg-btn-active' : '']">單一薪資</button>
                <button @click="mode = 'compare'" :class="['seg-btn', mode === 'compare' ? 'seg-btn-active' : '']">比較 Offer</button>
            </div>

            <div class="grid gap-5" :class="mode === 'compare' ? 'grid-cols-1 sm:grid-cols-2' : ''">
                <!-- A 方案 -->
                <div class="space-y-4">
                    <div v-if="mode === 'compare'" class="text-xs font-medium text-ink-400 uppercase tracking-widest pb-1 border-b border-paper-300">方案 A（現職）</div>
                    <div>
                        <label for="salaryA" class="block text-xs font-medium text-ink-400 mb-1.5">月薪（NT$）</label>
                        <input id="salaryA" type="number" v-model.number="salary" class="input-clean text-xl font-semibold tabular-nums" placeholder="45,800">
                    </div>
                    <div>
                        <label for="bonusA" class="block text-xs font-medium text-ink-400 mb-1.5">年終獎金（月數）</label>
                        <input id="bonusA" type="number" v-model.number="bonus" step="0.5" min="0" max="12" class="input-clean" placeholder="2">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-ink-400 mb-1.5">勞退自提比例</label>
                        <div class="grid grid-cols-4 gap-1.5">
                            <button v-for="n in [0, 2, 4, 6]" :key="n" @click="pension = n"
                                :class="['py-2 rounded-lg text-sm font-medium transition-all',
                                    pension === n
                                        ? 'bg-azure text-white shadow-sm'
                                        : 'bg-paper-200 text-ink-500 hover:bg-paper-300']">
                                {{ n }}%
                            </button>
                        </div>
                    </div>
                </div>

                <!-- B 方案 -->
                <div v-if="mode === 'compare'" class="space-y-4 sm:border-l sm:border-paper-300 sm:pl-5">
                    <div class="text-xs font-medium text-azure uppercase tracking-widest pb-1 border-b border-paper-300">方案 B（新 Offer）</div>
                    <div>
                        <label for="salaryB" class="block text-xs font-medium text-ink-400 mb-1.5">月薪（NT$）</label>
                        <input id="salaryB" type="number" v-model.number="salaryB" class="input-clean text-xl font-semibold tabular-nums" placeholder="50,000">
                    </div>
                    <div>
                        <label for="bonusB" class="block text-xs font-medium text-ink-400 mb-1.5">年終獎金（月數）</label>
                        <input id="bonusB" type="number" v-model.number="bonusB" step="0.5" min="0" max="12" class="input-clean" placeholder="1">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-ink-400 mb-1.5">勞退自提比例</label>
                        <div class="grid grid-cols-4 gap-1.5">
                            <button v-for="n in [0, 2, 4, 6]" :key="n" @click="pensionB = n"
                                :class="['py-2 rounded-lg text-sm font-medium transition-all',
                                    pensionB === n
                                        ? 'bg-azure text-white shadow-sm'
                                        : 'bg-paper-200 text-ink-500 hover:bg-paper-300']">
                                {{ n }}%
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── 單一模式結果 ── -->
        <div v-if="mode === 'single'" class="space-y-4">
            <!-- 主要數字 -->
            <div class="card-surface p-5">
                <div class="flex items-start justify-between mb-5">
                    <div>
                        <p class="stat-label">每月實拿</p>
                        <p class="stat-value-lg">
                            <span class="text-2xl text-ink-400 font-light mr-1">$</span>{{ monthlyNet.toLocaleString() }}
                        </p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <div class="text-right">
                            <p class="stat-label">年度總額</p>
                            <p class="stat-value-md text-ink-500">$ {{ yearlyNet.toLocaleString() }}</p>
                            <p class="text-xs text-ink-400 mt-0.5">≈ {{ (yearlyNet / 10000).toFixed(1) }} 萬</p>
                        </div>
                        <button @click="shareResult"
                            class="btn-ghost text-xs flex items-center gap-1.5 px-2 py-1 -mr-2 text-azure hover:bg-azure/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                            {{ copied ? '已複製 ✓' : '分享結果' }}
                        </button>
                    </div>
                </div>

                <!-- 薪資百分位 (PR值) -->
                <div class="mt-1 mb-6 p-4 bg-gradient-to-br from-azure-50 to-blue-50 rounded-xl border border-azure-100 flex items-center justify-between relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center gap-1.5 mb-1">
                            <p class="text-xs text-ink-500 font-medium">台灣同齡 (25-34歲) 薪資排名</p>
                            <div class="group relative cursor-help">
                                <svg class="text-ink-300 w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ink-800 text-white text-[10px] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">本推估基於行政院主計總處 112 年受僱員工薪資調查進行常態分佈精算。</div>
                            </div>
                        </div>
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-sm font-medium text-ink-600">前</span>
                            <span class="text-3xl font-bold tracking-tight text-azure">{{ prValue }}</span>
                            <span class="text-sm font-medium text-ink-600">%</span>
                        </div>
                    </div>
                    <div class="text-right relative z-10">
                        <p class="text-[10px] text-ink-400 mb-0.5">大約贏過</p>
                        <p class="text-base font-semibold text-ink-700 tabular-nums">{{ prBeatenCount }} 萬人</p>
                    </div>
                </div>

                <!-- 甜甜圈圖 -->
                <div class="h-44 relative mb-5">
                    <canvas ref="donutChartRef"></canvas>
                </div>

                <!-- 明細 4 格 -->
                <div class="grid grid-cols-2 gap-2">
                    <div class="bg-red-50 rounded-xl p-3">
                        <p class="text-xs text-red-400 mb-0.5">勞保費（自付）</p>
                        <p class="text-base font-semibold text-red-600 tabular-nums">− {{ laborIns.toLocaleString() }}</p>
                    </div>
                    <div class="bg-red-50 rounded-xl p-3">
                        <p class="text-xs text-red-400 mb-0.5">健保費（自付）</p>
                        <p class="text-base font-semibold text-red-600 tabular-nums">− {{ healthIns.toLocaleString() }}</p>
                    </div>
                    <div class="bg-amber-50 rounded-xl p-3">
                        <p class="text-xs text-amber-500 mb-0.5">勞退自提</p>
                        <p class="text-base font-semibold text-amber-600 tabular-nums">− {{ pensionSelf.toLocaleString() }}</p>
                    </div>
                    <div class="bg-green-50 rounded-xl p-3">
                        <p class="text-xs text-green-500 mb-0.5">年省所得稅</p>
                        <p class="text-base font-semibold text-green-600 tabular-nums">+ {{ taxSave.toLocaleString() }}</p>
                    </div>
                </div>
            </div>

            <!-- 雇主成本視角 -->
            <div class="card-surface p-5">
                <h3 class="text-sm font-medium text-ink-600 mb-4">💼 雇主視角：實際人力成本</h3>
                <div class="grid grid-cols-3 gap-3 text-center">
                    <div>
                        <p class="stat-label">你的月薪</p>
                        <p class="text-base font-semibold text-ink-700 tabular-nums">$ {{ (salary || 0).toLocaleString() }}</p>
                    </div>
                    <div>
                        <p class="stat-label">雇主額外</p>
                        <p class="text-base font-semibold text-red-500 tabular-nums">+ {{ employerCost.toLocaleString() }}</p>
                    </div>
                    <div>
                        <p class="stat-label">總人力成本</p>
                        <p class="text-base font-semibold text-ink-800 tabular-nums">$ {{ totalCost.toLocaleString() }}</p>
                    </div>
                </div>
                <p class="note-box mt-3">雇主每月額外負擔：勞保 70%、健保 60%（×1.58 眷屬係數）、勞退 6%。</p>
            </div>

            <!-- 5年預測 -->
            <div class="card-surface p-5">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-sm font-medium text-ink-600">5 年薪資預測</h3>
                    <div class="flex items-center gap-3 text-xs text-ink-400">
                        <label class="flex items-center gap-1">
                            調薪
                            <input type="number" v-model.number="raiseRate" step="0.5" aria-label="每年調薪幅度"
                                class="w-12 input-clean-sm text-center px-2 py-1 text-xs">%
                        </label>
                        <label class="flex items-center gap-1">
                            通膨
                            <input type="number" v-model.number="inflationRate" step="0.5" aria-label="通膨率"
                                class="w-12 input-clean-sm text-center px-2 py-1 text-xs">%
                        </label>
                    </div>
                </div>
                <div class="h-44 relative mb-4">
                    <canvas ref="lineChartRef"></canvas>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs">
                        <thead>
                            <tr class="text-ink-400 border-b border-paper-300">
                                <th class="text-left py-2 font-medium">年份</th>
                                <th class="text-right py-2 font-medium">名目年薪</th>
                                <th class="text-right py-2 font-medium">實質購買力</th>
                                <th class="text-right py-2 font-medium">成長</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, i) in forecast" :key="i" class="border-b border-paper-200">
                                <td class="py-2 text-ink-400">{{ 2026 + i }}</td>
                                <td class="py-2 text-right tabular-nums text-ink-600">$ {{ row.nominal.toLocaleString() }}</td>
                                <td class="py-2 text-right tabular-nums"
                                    :class="row.real < row.nominal ? 'text-amber-600' : 'text-green-600'">
                                    $ {{ row.real.toLocaleString() }}
                                </td>
                                <td class="py-2 text-right"
                                    :class="row.growth.startsWith('+') ? 'text-green-600' : 'text-ink-400'">
                                    {{ row.growth }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ── 比較模式結果 ── -->
        <div v-if="mode === 'compare'" class="card-surface p-5">
            <!-- 差異標語 -->
            <div v-if="monthlyNetB !== monthlyNet" class="flex justify-center mb-5">
                <span :class="['px-3 py-1 rounded-full text-sm font-medium',
                    monthlyNetB > monthlyNet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                    B 方案每月
                    {{ monthlyNetB > monthlyNet ? '多拿' : '少拿' }}
                    $ {{ Math.abs(monthlyNetB - monthlyNet).toLocaleString() }}
                </span>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <!-- 方案 A -->
                <div class="text-center">
                    <p class="text-xs text-ink-400 mb-1">方案 A（現職）</p>
                    <p class="text-2xl font-semibold text-ink-700 tabular-nums">$ {{ monthlyNet.toLocaleString() }}</p>
                    <p class="text-xs text-ink-400 mt-2">年薪 {{ (yearlyNet / 10000).toFixed(1) }} 萬</p>
                    <div class="space-y-1 mt-3 text-xs text-ink-400">
                        <div class="flex justify-between">
                            <span>勞保</span><span>− {{ laborIns.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>健保</span><span>− {{ healthIns.toLocaleString() }}</span>
                        </div>
                    </div>
                </div>
                <!-- 方案 B -->
                <div class="text-center border-l border-paper-300 pl-4">
                    <p class="text-xs text-azure mb-1">方案 B（新 Offer）</p>
                    <p class="text-2xl font-semibold tabular-nums"
                       :class="monthlyNetB >= monthlyNet ? 'text-azure' : 'text-red-500'">
                        $ {{ monthlyNetB.toLocaleString() }}
                    </p>
                    <p class="text-xs text-ink-400 mt-2">年薪 {{ (yearlyNetB / 10000).toFixed(1) }} 萬</p>
                    <div class="space-y-1 mt-3 text-xs text-ink-400">
                        <div class="flex justify-between">
                            <span>勞保</span><span>− {{ laborInsB.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>健保</span><span>− {{ healthInsB.toLocaleString() }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 年薪比較 -->
            <div class="border-t border-paper-300 mt-5 pt-4 grid grid-cols-2 gap-4 text-center text-xs">
                <div>
                    <p class="text-ink-400 mb-1">年薪（含年終）</p>
                    <p class="text-base font-semibold text-ink-700 tabular-nums">$ {{ yearlyNet.toLocaleString() }}</p>
                </div>
                <div class="border-l border-paper-300">
                    <p class="text-ink-400 mb-1">年薪（含年終）</p>
                    <p class="text-base font-semibold tabular-nums"
                       :class="yearlyNetB >= yearlyNet ? 'text-azure' : 'text-red-500'">
                        $ {{ yearlyNetB.toLocaleString() }}
                    </p>
                </div>
            </div>
        </div>

        <!-- 回本分析分析 (僅比較模式) -->
        <div v-if="mode === 'compare'" class="card-surface p-5 bg-gradient-to-br from-white to-amber-50/30">
            <h3 class="text-sm font-medium text-ink-600 mb-4 flex items-center gap-2">
                <span class="text-base">🚀</span> 換工作回本分析
            </h3>
            
            <div class="mb-5 p-3 bg-white rounded-lg border border-paper-200">
                <label class="block text-xs font-medium text-ink-400 mb-1.5">轉職沉沒成本 (NT$)</label>
                <input type="number" v-model.number="relocationCost" class="input-clean bg-paper-100 focus:bg-white tabular-nums" placeholder="50,000">
                <p class="text-[10px] text-ink-400 mt-1.5">例如：放棄的未領年終、搬家租屋違約金、待業期空白成本</p>
            </div>

            <div class="flex flex-col items-center justify-center p-4 rounded-xl text-center border"
                 :class="breakEvenMonths > 0 ? 'bg-amber-50/50 border-amber-100' : 'bg-paper-100/50 border-paper-200'">
                <template v-if="monthlyNetB <= monthlyNet && yearlyNetB <= yearlyNet">
                    <p class="text-sm font-medium text-ink-600">新 Offer 收入未達現職水準</p>
                    <p class="text-xs text-ink-400 mt-1">無法計算回本時間，請謹慎評估發展性</p>
                </template>
                <template v-else-if="breakEvenMonths === 0 && relocationCost === 0">
                    <p class="text-sm font-medium text-green-600">跳槽立刻加薪無痛上壘！</p>
                    <p class="text-xs text-ink-400 mt-1">每月淨賺多 $ {{ Math.max(0, monthlyNetB - monthlyNet).toLocaleString() }}</p>
                </template>
                <template v-else-if="breakEvenMonths > 0">
                    <p class="text-xs text-ink-500 mb-1">為了彌補沉沒成本，預計需要</p>
                    <p class="text-3xl font-bold text-amber-600 my-1">{{ breakEvenMonths }} <span class="text-sm font-medium text-ink-500">個月</span></p>
                    <p class="text-xs text-ink-400">才能透過新工作的薪資差距回本</p>
                </template>
                <template v-else>
                    <p class="text-sm font-medium text-green-600">僅靠年薪差距即可首年回本！</p>
                </template>
            </div>
            
            <!-- 3 年淨利基差 -->
            <div v-if="threeYearsNetGap" class="mt-4 flex justify-between items-center text-xs px-1">
                <span class="text-ink-400">3 年後累計財富差距：</span>
                <span class="font-semibold tabular-nums" :class="threeYearsNetGap > 0 ? 'text-azure' : 'text-red-500'">
                    {{ threeYearsNetGap > 0 ? '+' : '' }}$ {{ threeYearsNetGap.toLocaleString() }}
                </span>
            </div>
        </div>

        <!-- 費率說明 -->
        <div class="note-box space-y-2">
            <p class="font-medium text-ink-500">📌 2026 費率依據</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                <div class="bg-white rounded-lg p-2.5 text-center border border-paper-300">
                    <p class="text-xs text-ink-400">基本工資</p>
                    <p class="text-sm font-bold text-ink-700 mt-0.5">$29,500</p>
                </div>
                <div class="bg-white rounded-lg p-2.5 text-center border border-paper-300">
                    <p class="text-xs text-ink-400">勞保費率</p>
                    <p class="text-sm font-bold text-ink-700 mt-0.5">12%</p>
                    <p class="text-[10px] text-ink-300">含就保 1%</p>
                </div>
                <div class="bg-white rounded-lg p-2.5 text-center border border-paper-300">
                    <p class="text-xs text-ink-400">健保費率</p>
                    <p class="text-sm font-bold text-ink-700 mt-0.5">5.17%</p>
                </div>
                <div class="bg-white rounded-lg p-2.5 text-center border border-paper-300">
                    <p class="text-xs text-ink-400">勞退提撥</p>
                    <p class="text-sm font-bold text-ink-700 mt-0.5">6%</p>
                    <p class="text-[10px] text-ink-300">雇主全額</p>
                </div>
            </div>
            <p class="text-[11px] text-ink-400 mt-2">
                年終獎金不扣月勞健保費；單筆年終超過投保薪資 4 倍時，超過部分扣繳 2.11% 二代健保補充保費。
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import Decimal from 'decimal.js';

// ── 2026 費率常數 ──────────────────────────────────────────────
const LABOR_RATE  = new Decimal(0.12)   // 11% 普通 + 1% 就保
const LABOR_SHARE = new Decimal(0.2)    // 勞工自付 20%
const HEALTH_RATE = new Decimal(0.0517)
const HEALTH_SHARE = new Decimal(0.3)   // 勞工自付 30%
const SUPP_HEALTH_RATE = new Decimal(0.0211) // 二代健保補充保費

const LABOR_GRADES = [
    29500, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800
]
const HEALTH_GRADES = [
    29500, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800,
    48200, 50600, 53000, 55400, 57800, 60800, 63800, 66800, 69800, 72800,
    76500, 80200, 83900, 87600, 92100, 96600, 101100, 105600, 110100, 115500,
    120900, 126300, 131700, 137100, 142500, 147900, 150000, 156400, 162800,
    169200, 175600, 182000, 189500, 197000, 204500, 212000, 219500, 313000
]

const getGrade = (salary, table, max) => {
    if (salary < table[0]) return table[0]
    if (salary >= max)     return max
    for (let g of table) { if (g >= salary) return g }
    return max
}

// ── 響應式狀態 ─────────────────────────────────────────────────
const mode = ref('single')

// 方案 A
const salary  = ref(45800)
const bonus   = ref(2)
const pension = ref(6)

// 方案 B（比較用）
const salaryB  = ref(50000)
const bonusB   = ref(1)
const pensionB = ref(0)

const raiseRate     = ref(3)
const inflationRate = ref(2)

const relocationCost = ref(0)
const copied = ref(false)

const donutChartRef = ref(null)
const lineChartRef  = ref(null)
let donutInstance = null
let lineInstance  = null

// ── 核心計算函式 ────────────────────────────────────────────────
const calc = (s, b, p) => {
    const sal = new Decimal(s || 0)
    const bon = new Decimal(b || 0)

    // 1. 取投保薪資級距
    const laborGrade  = new Decimal(getGrade(sal.toNumber(), LABOR_GRADES,  45800))
    const healthGrade = new Decimal(getGrade(sal.toNumber(), HEALTH_GRADES, 313000))

    // 2. 月扣費用
    const labor  = laborGrade.mul(LABOR_RATE).mul(LABOR_SHARE).round().toNumber()
    const health = healthGrade.mul(HEALTH_RATE).mul(HEALTH_SHARE).round().toNumber()

    // 3. 勞退自提（上限 150,000）
    const pensionBasis = new Decimal(getGrade(sal.toNumber(), HEALTH_GRADES, 150000))
    const penS = pensionBasis.mul(p).div(100).round().toNumber()

    // 4. 每月實拿
    const mNet = sal.minus(labor).minus(health).minus(penS).toNumber()

    // 5. 節稅金額（假設邊際稅率 12%，自提每月省稅）
    const tSave = new Decimal(penS).mul(12).mul(0.12).round().toNumber()

    // 6. 年薪計算（修正：年終獎金不扣月勞健保費）
    //    台灣法規：年終為年度獎金，不屬於月薪資，不逐月計算勞健保
    //    超過 4 倍投保薪資的部分才扣 2.11% 二代健保補充保費
    const bonusTotal  = sal.mul(bon)
    const fourTimesInsured = healthGrade.mul(4)
    const suppHealthBonus = bonusTotal.gt(fourTimesInsured)
        ? bonusTotal.minus(fourTimesInsured).mul(SUPP_HEALTH_RATE).round()
        : new Decimal(0)

    const yearlyNet = new Decimal(mNet).mul(12)
        .plus(bonusTotal)
        .minus(suppHealthBonus)
        .plus(tSave)
        .round()
        .toNumber()

    // 7. 雇主成本
    const empLabor   = laborGrade.mul(LABOR_RATE).mul(0.7).round().toNumber()
    const empHealth  = healthGrade.mul(HEALTH_RATE).mul(0.6).mul(1.58).round().toNumber() // 眷屬係數 1.58
    const empPension = pensionBasis.mul(0.06).round().toNumber()
    const empCost    = empLabor + empHealth + empPension
    const tCost      = sal.plus(empCost).toNumber()

    return { labor, health, penS, mNet, tSave, yNet: yearlyNet, empCost, tCost }
}

// ── Computed ───────────────────────────────────────────────────
const res  = computed(() => calc(salary.value,  bonus.value,  pension.value))
const resB = computed(() => calc(salaryB.value, bonusB.value, pensionB.value))

const laborIns    = computed(() => res.value.labor)
const healthIns   = computed(() => res.value.health)
const pensionSelf = computed(() => res.value.penS)
const monthlyNet  = computed(() => res.value.mNet)
const taxSave     = computed(() => res.value.tSave)
const yearlyNet   = computed(() => res.value.yNet)
const employerCost = computed(() => res.value.empCost)
const totalCost   = computed(() => res.value.tCost)

const monthlyNetB = computed(() => resB.value.mNet)
const yearlyNetB  = computed(() => resB.value.yNet)
const laborInsB   = computed(() => resB.value.labor)
const healthInsB  = computed(() => resB.value.health)

// ── 5年預測 ────────────────────────────────────────────────────
const forecast = computed(() => {
    const rows = []
    let s = new Decimal(salary.value || 0)
    let cumInf = new Decimal(1)
    const rr = new Decimal(raiseRate.value).div(100).plus(1)
    const ir = new Decimal(inflationRate.value).div(100).plus(1)

    for (let i = 0; i < 5; i++) {
        if (i > 0) s = s.mul(rr).round()
        cumInf = cumInf.mul(ir)

        // 年薪 = (月薪 × 12 + 年終) × (1 - 勞健保率約 12%)
        const nominal = s.mul(new Decimal(12).plus(bonus.value)).mul(0.88).round()
        const real    = nominal.div(cumInf).round()

        let growth = '—'
        if (i > 0) {
            const prevNominal = new Decimal(rows[0].nominal)
            const g = real.div(prevNominal).minus(1).mul(100).round().toNumber()
            growth = (g > 0 ? '+' : '') + g + '%'
        }
        rows.push({ nominal: nominal.toNumber(), real: real.toNumber(), growth })
    }
    return rows
})

// ── 薪資排名與洞察 (主計處公開數據估算) ─────────────────────────────────
// 主計處 25-34 歲受僱者月薪概況：PR25約3.2萬、PR50約4.1萬、PR75約5.4萬、PR90約7.2萬
const prValue = computed(() => {
    const s = salary.value || 0
    let p = 1
    if (s < 28000) p = 10 + ((s-27470)/530) * 10
    else if (s < 32000) p = 20 + ((s-28000)/4000) * 5
    else if (s < 41000) p = 25 + ((s-32000)/9000) * 25
    else if (s < 54000) p = 50 + ((s-41000)/13000) * 25
    else if (s < 72000) p = 75 + ((s-54000)/18000) * 15
    else if (s < 90000) p = 90 + ((s-72000)/18000) * 5
    else if (s < 120000) p = 95 + ((s-90000)/30000) * 4
    else p = 99
    
    // 轉換為排名：前 {p}% (也就是 100 - 百分位)
    return Math.max(1, Math.min(99, Math.round(100 - p)))
})

// 主計處數據：25-34歲受僱員工約 230 萬人
const prBeatenCount = computed(() => {
    const beatenPercent = 100 - prValue.value
    return ((beatenPercent / 100) * 230).toFixed(1)
})

// ── 回本分析 ──────────────────────────────────────────────────
const breakEvenMonths = computed(() => {
    const monthlyGap = monthlyNetB.value - monthlyNet.value
    const yearlyGap  = yearlyNetB.value - yearlyNet.value
    
    // 如果連年薪都不如現職，那就永遠不會回本
    if (yearlyGap <= 0 && monthlyGap <= 0) return -1
    
    // 如果單月薪水變少，但年薪變高，表示靠年終回血，以年來計算更準確
    if (monthlyGap <= 0 && yearlyGap > 0) {
        if (relocationCost.value <= yearlyGap) return 12 // 首年發年終時回本
        return Math.ceil(relocationCost.value / (yearlyGap/12))
    }
    
    // 如果月薪變高，單靠月薪差幾個月回本
    if (monthlyGap > 0) {
        const months = Math.ceil(relocationCost.value / monthlyGap)
        // 防呆，如果回本期過長超過 5 年
        if (months > 60) return 60
        return months
    }
    return 0
})

const threeYearsNetGap = computed(() => {
     // 新方案 3 年總拿到的錢 - 原方案 3 年總拿到的 - 轉職成本
     return (yearlyNetB.value * 3) - (yearlyNet.value * 3) - (relocationCost.value || 0)
})

// ── 分享卡片 ──────────────────────────────────────────────────
const shareResult = async () => {
    const title = 'TaiCalc 薪資試算分析'
    const text = `🎯 \n\n💰 名目月薪：$${(salary.value || 0).toLocaleString()}\n✨ 每月實拿：$${monthlyNet.value.toLocaleString()}\n🎉 年薪估算：$${yearlyNet.value.toLocaleString()}\n\n🏆 贏過了全台同齡（25-34歲）中 ${prValue.value}% 受僱者！\n（約嬴過 ${prBeatenCount.value} 萬人）\n\n👇 來算算你的隱藏薪資落點`
    const url = 'https://taicalc.com/tools/salary-calculator'
    
    // 優先使用 Native Share API (手機使用極佳體驗)
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url })
            return
        } catch (e) { console.log('分享取消或失敗。') }
    }
    
    // Fallback 到剪貼簿複製
    try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url}`)
        copied.value = true
        setTimeout(() => copied.value = false, 2500)
    } catch {}
}

// ── 圖表 ───────────────────────────────────────────────────────
const CHART_COLORS = {
    primary: '#0891B2',
    red:     '#EF4444',
    amber:   '#F59E0B',
    ink:     '#6B6760',
}

const updateCharts = () => {
    if (donutInstance) donutInstance.destroy()
    if (donutChartRef.value) {
        donutInstance = new Chart(donutChartRef.value, {
            type: 'doughnut',
            data: {
                labels: ['實拿薪資', '勞保費', '健保費', '勞退自提'],
                datasets: [{
                    data: [monthlyNet.value, laborIns.value, healthIns.value, pensionSelf.value],
                    backgroundColor: [CHART_COLORS.primary, CHART_COLORS.red, '#F97316', CHART_COLORS.amber],
                    borderWidth: 2,
                    borderColor: '#F5F4F0',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#6B6760',
                            font: { size: 11, family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' },
                            usePointStyle: true,
                            pointStyleWidth: 8,
                            padding: 12
                        }
                    }
                }
            }
        })
    }

    if (lineInstance) lineInstance.destroy()
    if (lineChartRef.value) {
        lineInstance = new Chart(lineChartRef.value, {
            type: 'line',
            data: {
                labels: ['2026', '2027', '2028', '2029', '2030'],
                datasets: [
                    {
                        label: '名目年薪',
                        data: forecast.value.map(r => r.nominal),
                        borderColor: CHART_COLORS.primary,
                        backgroundColor: 'rgba(59,147,247,0.07)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: CHART_COLORS.primary,
                    },
                    {
                        label: '實質購買力',
                        data: forecast.value.map(r => r.real),
                        borderColor: CHART_COLORS.amber,
                        borderDash: [4, 4],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: CHART_COLORS.amber,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9B9890', font: { size: 11 } } },
                    y: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: {
                            color: '#9B9890',
                            font: { size: 11 },
                            callback: v => '$' + (v / 10000).toFixed(0) + '萬'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#6B6760',
                            font: { size: 11 },
                            usePointStyle: true,
                            pointStyleWidth: 8,
                            padding: 12
                        }
                    }
                }
            }
        })
    }
}

// ── 儲存 / 持久化 ───────────────────────────────────────────────
watch(monthlyNet, (v) => {
    if (v > 0) localStorage.setItem('taicalc_salary_net', v)
    else       localStorage.removeItem('taicalc_salary_net')
})

watch([salary, bonus, pension, raiseRate, inflationRate], updateCharts, { deep: true })
watch(mode, () => { if (mode.value === 'single') setTimeout(updateCharts, 100) })

onMounted(() => {
    try {
        const saved = localStorage.getItem('taicalc_salary_inputs')
        if (saved) {
            const data = JSON.parse(saved)
            if (data.salary)              salary.value  = data.salary
            if (data.bonus  !== undefined) bonus.value  = data.bonus
            if (data.pension !== undefined) pension.value = data.pension
            if (data.relocationCost !== undefined) relocationCost.value = data.relocationCost
        }
    } catch (e) {}
    setTimeout(updateCharts, 100)
})

watch([salary, bonus, pension, relocationCost], ([s, b, p, r]) => {
    localStorage.setItem('taicalc_salary_inputs', JSON.stringify({ salary: s, bonus: b, pension: p, relocationCost: r }))
})
</script>
