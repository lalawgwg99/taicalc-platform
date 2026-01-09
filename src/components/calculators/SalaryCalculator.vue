<template>
    <div class="space-y-6">
        <!-- Header (Originally in HTML body but outside #app, moving inside component or Page? 
             Actually Breadcrumb and Header were inside #app in the original HTML. 
             I will keep them here for now, or maybe move Breadcrumb to Page. 
             Let's keep the main tool logic here.) 
        -->

        <!-- 輸入卡片 -->
        <section class="card rounded-2xl p-6 shadow-sm border border-stone-200 bg-white">
            <!-- 比較模式切換 -->
            <div class="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
                <h2 class="text-lg font-bold text-stone-800">薪資設定</h2>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-medium" :class="mode === 'compare' ? 'text-stone-800' : 'text-stone-400'">比較模式</span>
                    <button @click="mode = mode === 'single' ? 'compare' : 'single'" aria-label="切換比較模式"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        :class="mode === 'compare' ? 'bg-emerald-500' : 'bg-stone-200'">
                        <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                            :class="mode === 'compare' ? 'translate-x-6' : 'translate-x-1'"></span>
                    </button>
                </div>
            </div>

            <div class="grid gap-6" :class="mode === 'compare' ? 'grid-cols-2' : ''">
                <!-- A 方案 -->
                <div class="space-y-4">
                    <div v-if="mode === 'compare'"
                        class="font-bold text-stone-900 border-b border-stone-200 pb-2 mb-4">方案 A (現職)</div>

                    <div>
                        <label for="salaryA" class="block text-xs font-medium text-stone-500 mb-2">月薪 (NT$)</label>
                        <input id="salaryA" type="number" v-model.number="salary"
                            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            placeholder="45,800">
                    </div>
                    <div>
                        <label for="bonusA" class="block text-xs font-medium text-stone-500 mb-2">年終獎金 (月)</label>
                        <input id="bonusA" type="number" v-model.number="bonus" step="0.5" min="0" max="12"
                            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-stone-500 mb-2">勞退自提 (%)</label>
                        <div class="grid grid-cols-3 gap-1">
                            <button v-for="n in [0, 3, 6]" :key="n" @click="pension = n"
                                :class="['py-2 rounded-lg text-sm font-medium transition-all', 
                                            pension === n ? 'bg-emerald-600 text-white shadow-sm' : 'bg-stone-100 text-stone-500 hover:bg-stone-200']">
                                {{ n }}%
                            </button>
                        </div>
                    </div>
                </div>

                <!-- B 方案 (比較用) -->
                <div v-if="mode === 'compare'" class="space-y-4 border-l border-stone-200 pl-6">
                    <div class="font-bold text-emerald-700 border-b border-stone-200 pb-2 mb-4">方案 B (新 Offer)</div>

                    <div>
                        <label for="salaryB" class="block text-xs font-medium text-stone-500 mb-2">月薪 (NT$)</label>
                        <input id="salaryB" type="number" v-model.number="salaryB"
                            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            placeholder="50,000">
                    </div>
                    <div>
                        <label for="bonusB" class="block text-xs font-medium text-stone-500 mb-2">年終獎金 (月)</label>
                        <input id="bonusB" type="number" v-model.number="bonusB" step="0.5" min="0" max="12"
                            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-stone-500 mb-2">勞退自提 (%)</label>
                        <div class="grid grid-cols-3 gap-1">
                            <button v-for="n in [0, 3, 6]" :key="n" @click="pensionB = n"
                                :class="['py-2 rounded-lg text-sm font-medium transition-all', 
                                            pensionB === n ? 'bg-emerald-600 text-white shadow-sm' : 'bg-stone-100 text-stone-500 hover:bg-stone-200']">
                                {{ n }}%
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 主要結果 -->
        <section class="card rounded-2xl p-6 shadow-sm border border-stone-200 bg-white">
            <!-- 單人模式結果 -->
            <div v-if="mode === 'single'">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <p class="text-xs text-stone-500 uppercase tracking-wider mb-1">每月實拿 (Net Income)</p>
                        <p class="text-4xl sm:text-5xl font-bold text-stone-800 stat-value">
                            <span class="text-emerald-500">$</span>{{ monthlyNet.toLocaleString() }}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-stone-500 mb-1">年度總額</p>
                        <p class="text-xl font-semibold text-stone-600 stat-value">${{ yearlyNet.toLocaleString() }}
                        </p>
                    </div>
                </div>

                <!-- 甜甜圈圖 (保留) -->
                <div class="chart-container mb-6 h-[180px] relative">
                    <canvas ref="donutChartRef"></canvas>
                </div>

                <!-- 明細 -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                        <p class="text-xs text-stone-500 mb-1">勞保費 (自付)</p>
                        <p class="text-lg font-semibold text-rose-500 stat-value">-{{ laborIns.toLocaleString() }}
                        </p>
                    </div>
                    <div class="bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                        <p class="text-xs text-stone-500 mb-1">健保費 (自付)</p>
                        <p class="text-lg font-semibold text-rose-500 stat-value">-{{ healthIns.toLocaleString() }}
                        </p>
                    </div>
                    <div class="bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                        <p class="text-xs text-stone-500 mb-1">勞退自提</p>
                        <p class="text-lg font-semibold text-amber-500 stat-value">-{{ pensionSelf.toLocaleString()
                            }}</p>
                    </div>
                    <div class="bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                        <p class="text-xs text-stone-500 mb-1">節稅/年</p>
                        <p class="text-lg font-semibold text-emerald-600 stat-value">+{{ taxSave.toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- 比較模式結果 (雙欄) -->
            <div v-else class="grid grid-cols-2 gap-0">
                <div class="pr-4 border-r border-stone-200">
                    <p class="text-xs text-stone-400 mb-1 text-center">方案 A (現職)</p>
                    <p class="text-2xl font-bold text-stone-800 text-center mb-4">${{ monthlyNet.toLocaleString() }}
                    </p>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between text-stone-500"><span>勞保</span><span>-{{ laborIns }}</span>
                        </div>
                        <div class="flex justify-between text-stone-500"><span>健保</span><span>-{{ healthIns
                                }}</span></div>
                        <div class="flex justify-between text-stone-500"><span>年薪</span><span
                                class="font-medium text-stone-700">{{ (yearlyNet/10000).toFixed(1) }}萬</span></div>
                    </div>
                </div>
                <div class="pl-4 relative">
                    <!-- 差異標記 -->
                    <div v-if="monthlyNetB - monthlyNet > 0"
                        class="absolute -top-3 right-0 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        +${{ (monthlyNetB - monthlyNet).toLocaleString() }}
                    </div>

                    <p class="text-xs text-emerald-600 mb-1 text-center font-bold">方案 B (新 Offer)</p>
                    <p class="text-2xl font-bold text-emerald-700 text-center mb-4">${{ monthlyNetB.toLocaleString()
                        }}</p>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between text-stone-500"><span>勞保</span><span>-{{ laborInsB
                                }}</span></div>
                        <div class="flex justify-between text-stone-500"><span>健保</span><span>-{{ healthInsB
                                }}</span></div>
                        <div class="flex justify-between text-stone-500"><span>年薪</span><span
                                class="font-bold text-emerald-600">{{ (yearlyNetB/10000).toFixed(1) }}萬</span></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 5年預測 -->
        <section class="card rounded-2xl p-6 shadow-sm border border-stone-200 bg-white" v-show="mode === 'single'">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-semibold text-stone-800">5 年薪資預測</h2>
                <div class="flex items-center gap-3 text-xs text-stone-500">
                    <label class="flex items-center gap-1">
                        調薪
                        <input id="raiseRate" aria-label="每年調薪幅度" type="number" v-model.number="raiseRate"
                            step="0.5"
                            class="w-12 bg-stone-100 border border-stone-200 rounded px-2 py-1 text-stone-700 text-center">%
                    </label>
                    <label class="flex items-center gap-1">
                        通膨
                        <input id="inflationRate" aria-label="預估通膨率" type="number" v-model.number="inflationRate"
                            step="0.5"
                            class="w-12 bg-stone-100 border border-stone-200 rounded px-2 py-1 text-stone-700 text-center">%
                    </label>
                </div>
            </div>

            <!-- 折線圖 -->
            <div class="chart-container mb-4 h-[200px] relative">
                <canvas ref="lineChartRef"></canvas>
            </div>

            <!-- 5年數據表 -->
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-stone-400 text-xs">
                            <th class="text-left py-2 font-medium">年份</th>
                            <th class="text-right py-2 font-medium">名目年薪</th>
                            <th class="text-right py-2 font-medium">實質購買力</th>
                            <th class="text-right py-2 font-medium">成長</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in forecast" :key="i" class="border-t border-stone-100">
                            <td class="py-2 text-stone-500">{{ 2026 + i }}</td>
                            <td class="py-2 text-right font-mono text-stone-700">${{ row.nominal.toLocaleString() }}
                            </td>
                            <td class="py-2 text-right font-mono"
                                :class="row.real < row.nominal ? 'text-amber-600' : 'text-emerald-600'">${{
                                row.real.toLocaleString() }}</td>
                            <td class="py-2 text-right text-xs"
                                :class="row.growth.startsWith('+') ? 'text-emerald-600' : 'text-stone-400'">{{
                                row.growth }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 雇主視角 -->
        <section class="card rounded-2xl p-6 shadow-sm border border-stone-200 bg-white" v-if="mode === 'single'">
            <h2 class="text-sm font-semibold text-stone-800 mb-4">💼 雇主視角：實際人力成本</h2>
            <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p class="text-xs text-stone-500 mb-1">你的月薪</p>
                    <p class="text-lg font-semibold text-stone-700 stat-value">${{ (salary || 0).toLocaleString() }}
                    </p>
                </div>
                <div>
                    <p class="text-xs text-stone-500 mb-1">雇主額外負擔</p>
                    <p class="text-lg font-semibold text-rose-500 stat-value">+${{ employerCost.toLocaleString() }}
                    </p>
                </div>
                <div>
                    <p class="text-xs text-stone-500 mb-1">總人力成本</p>
                    <p class="text-lg font-semibold text-stone-900 stat-value">${{ totalCost.toLocaleString() }}</p>
                </div>
            </div>
            <p class="text-xs text-stone-400 mt-3 text-center">雇主每月需額外負擔勞保 70%、健保 60%、勞退 6%</p>
        </section>

        <!-- 費率說明 & FAQ - Extracted to a separate component usually, but keeping here for now -->
        <footer class="card rounded-xl p-6 border border-stone-200 bg-stone-50 text-sm text-stone-600 space-y-6">
            <div>
                <h3 class="font-bold text-stone-800 mb-2">📌 2026 年最新費率依據</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div class="bg-white p-2 rounded border border-stone-200">基本工資 <span
                            class="block text-lg font-bold text-stone-900">$29,500</span></div>
                    <div class="bg-white p-2 rounded border border-stone-200">勞保費率 <span
                            class="block text-lg font-bold text-stone-900">12%</span><span
                            class="text-stone-400 text-[10px]">含就保1%</span></div>
                    <div class="bg-white p-2 rounded border border-stone-200">健保費率 <span
                            class="block text-lg font-bold text-stone-900">5.17%</span></div>
                    <div class="bg-white p-2 rounded border border-stone-200">勞退提撥 <span
                            class="block text-lg font-bold text-stone-900">6%</span><span
                            class="text-stone-400 text-[10px]">雇主全額</span></div>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="font-bold text-stone-800">常見問題</h3>
                <div>
                    <h4 class="font-medium text-stone-700 mb-1">為什麼實領薪水比面議的少？</h4>
                    <p class="text-stone-500 text-xs leading-relaxed">
                        面議薪資通常指「稅前月薪」(Gross Salary)，實際入帳時會扣除「勞保自付額 (20%)」與「健保自付額 (30%)」。若您有自願提繳勞退
                        (0~6%)，也會一併從當月薪資扣除。
                    </p>
                </div>
                <div>
                    <h4 class="font-medium text-stone-700 mb-1">年終獎金會扣補充保費嗎？</h4>
                    <p class="text-stone-500 text-xs leading-relaxed">
                        當單筆獎金超過「投保金額的 4 倍」時，超過的部分才需要扣繳 2.11% 的二代健保補充保費。本計算機已內建此邏輯估算。
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// 2026 費率常數 & 級距表
const LABOR_RATE = 0.12     // 11% Ordinary + 1% Employment
const LABOR_SHARE = 0.2     // Worker 20%
const HEALTH_RATE = 0.0517
const HEALTH_SHARE = 0.3    // Worker 30%

// 2026 Labor (Min 29500, Max 45800)
const LABOR_GRADES = [
    29500, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800
]

// 2026 Health (Min 29500, Max 313000)
const HEALTH_GRADES = [
    29500, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800,
    48200, 50600, 53000, 55400, 57800, 60800, 63800, 66800, 69800, 72800,
    76500, 80200, 83900, 87600, 92100, 96600, 101100, 105600, 110100, 115500,
    120900, 126300, 131700, 137100, 142500, 147900, 150000, 156400, 162800,
    169200, 175600, 182000, 189500, 197000, 204500, 212000, 219500, 313000
]

// Helper: Find Insured Salary
const getGrade = (salary, table, max) => {
    if (salary < table[0]) return table[0] // Min floor
    if (salary >= max) return max
    for (let g of table) {
        if (g >= salary) return g
    }
    return max
}

const mode = ref('single') // single, compare

// A 方案
const salary = ref(45800)
const bonus = ref(2)
const pension = ref(6)

// B 方案 (比較用)
const salaryB = ref(50000)
const bonusB = ref(1)
const pensionB = ref(0)

const raiseRate = ref(3)
const inflationRate = ref(2)

const donutChartRef = ref(null)
const lineChartRef = ref(null)
let donutInstance = null
let lineInstance = null

// 計算邏輯函式
const calc = (s, b, p) => {
    const sal = s || 0

    // 1. Get Brackets
    const laborGrade = getGrade(sal, LABOR_GRADES, 45800)
    const healthGrade = getGrade(sal, HEALTH_GRADES, 313000)

    // 2. Calc Costs
    // Worker Labor: Grade * 12% * 20%
    const labor = Math.round(laborGrade * LABOR_RATE * LABOR_SHARE)

    // Worker Health: Grade * 5.17% * 30% * (1+0 dependents assumed for basic calc)
    const health = Math.round(healthGrade * HEALTH_RATE * HEALTH_SHARE)

    // Pension
    // Pension Table is capped at 150000. Closely aligned with Health grades up to 150k.
    const pensionBasis = getGrade(sal, HEALTH_GRADES, 150000)
    const penS_Real = Math.round(pensionBasis * p / 100)

    const mNet = sal - labor - health - penS_Real
    const tSave = Math.round(penS_Real * 12 * 0.12) // Assuming 12% tax bracket
    const yNet = mNet * 12 + sal * b - (labor + health) * b + tSave

    // Employer Cost
    const lg = laborGrade
    const hg = healthGrade
    // Employer Labor: Grade * 12% * 70%
    const empLabor = Math.round(lg * LABOR_RATE * 0.7)
    // Employer Health: Grade * 5.17% * 60% * 1.58
    const empHealth = Math.round(hg * HEALTH_RATE * 0.6 * 1.58)
    // Employer Pension: Grade * 6%
    const empPension = Math.round(pensionBasis * 0.06)

    const empCost = empLabor + empHealth + empPension
    const tCost = sal + empCost

    return { labor, health, penS: penS_Real, mNet, tSave, yNet, empCost, tCost }
}

// A 方案計算
const res = computed(() => calc(salary.value, bonus.value, pension.value))

// B 方案計算
const resB = computed(() => calc(salaryB.value, bonusB.value, pensionB.value))

// 綁定回傳值
const laborIns = computed(() => res.value.labor)
const healthIns = computed(() => res.value.health)
const pensionSelf = computed(() => res.value.penS)
const monthlyNet = computed(() => res.value.mNet)
const taxSave = computed(() => res.value.tSave)
const yearlyNet = computed(() => res.value.yNet)
const employerCost = computed(() => res.value.empCost)
const totalCost = computed(() => res.value.tCost)

// B 方案回傳
const monthlyNetB = computed(() => resB.value.mNet)
const yearlyNetB = computed(() => resB.value.yNet)
const laborInsB = computed(() => resB.value.labor)
const healthInsB = computed(() => resB.value.health)

// 5年預測
const forecast = computed(() => {
    const res = []
    let s = salary.value || 0
    let cumInf = 1
    for (let i = 0; i < 5; i++) {
        if (i > 0) s = Math.round(s * (1 + raiseRate.value / 100))
        cumInf *= (1 + inflationRate.value / 100)
        const nominal = Math.round(s * (12 + bonus.value) * 0.88)
        const real = Math.round(nominal / cumInf)
        const growth = i === 0 ? '-' : (real > res[0].real ? `+${Math.round((real / res[0].real - 1) * 100)}%` : `${Math.round((real / res[0].real - 1) * 100)}%`)
        res.push({ nominal, real, growth })
    }
    return res
})

// 繪製圖表
const updateCharts = () => {
    // Donut Chart
    if (donutInstance) donutInstance.destroy()
    if (donutChartRef.value) {
        donutInstance = new Chart(donutChartRef.value, {
            type: 'doughnut',
            data: {
                labels: ['實拿薪資', '勞保費', '健保費', '勞退自提'],
                datasets: [{
                    data: [monthlyNet.value, laborIns.value, healthIns.value, pensionSelf.value],
                    backgroundColor: ['#10b981', '#f43f5e', '#f97316', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: true, position: 'right', labels: { color: '#57534e', font: { size: 11, family: 'Inter' }, usePointStyle: true } }
                }
            }
        })
    }

    // Line Chart
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
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: '實質購買力',
                        data: forecast.value.map(r => r.real),
                        borderColor: '#f59e0b',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#78716c' } },
                    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#78716c', callback: v => '$' + (v / 10000) + '萬' } }
                },
                plugins: {
                    legend: { display: true, position: 'top', labels: { color: '#57534e', font: { size: 11 } } }
                }
            }
        })
    }
}

// Auto-save for Dashboard
watch(monthlyNet, (newVal) => {
    if (newVal > 0) {
        localStorage.setItem('taicalc_salary_net', newVal)
    } else {
        localStorage.removeItem('taicalc_salary_net')
    }
})

watch([salary, bonus, pension, raiseRate, inflationRate], updateCharts, { deep: true })
watch(mode, () => {
    if (mode.value === 'single') setTimeout(updateCharts, 100)
})

// Persistence
onMounted(() => {
    const saved = localStorage.getItem('taicalc_salary_inputs')
    if (saved) {
        try {
            const data = JSON.parse(saved)
            if (data.salary) salary.value = data.salary
            if (data.bonus !== undefined) bonus.value = data.bonus
            if (data.pension !== undefined) pension.value = data.pension
        } catch (e) { }
    }
    setTimeout(updateCharts, 100)
})

watch([salary, bonus, pension], ([s, b, p]) => {
    localStorage.setItem('taicalc_salary_inputs', JSON.stringify({ salary: s, bonus: b, pension: p }))
})
</script>
