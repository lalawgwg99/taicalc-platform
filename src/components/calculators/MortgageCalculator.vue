<template>
    <div class="space-y-6 card bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 md:p-6">
        <!-- Presets -->
        <div class="grid grid-cols-2 bg-stone-100/50 rounded-xl p-1 mb-6">
            <button @click="applyPreset('newYouth')"
                :class="['py-2 text-sm font-bold text-center rounded-lg transition-all', 
                type === 'newYouth' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700']">
                🏠 新青安
            </button>
            <button @click="applyPreset('general')"
                :class="['py-2 text-sm font-bold text-center rounded-lg transition-all',
                type === 'general' ? 'bg-white text-stone-700 shadow-sm' : 'text-stone-500 hover:text-stone-700']">
                🏦 一般房貸
            </button>
        </div>

        <div class="space-y-6">

            <!-- Basic Inputs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-semibold text-stone-500 mb-1">貸款總額 (萬)</label>
                        <input type="number" v-model.number="amountWan" aria-label="貸款總額" placeholder="1000"
                            title="貸款總額"
                            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-500 mb-1">期限 (年)</label>
                        <input type="number" v-model.number="years" aria-label="期限"
                            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-500 mb-1">寬限期 (年)</label>
                        <select v-model.number="graceYears" aria-label="寬限期"
                            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                            <option :value="0">無寬限期</option>
                            <option v-for="y in 5" :key="y" :value="y">{{ y }} 年</option>
                        </select>
                    </div>
                </div>

                <!-- Rate Settings -->
                <div class="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-bold text-stone-700">利率設定 (分段式)</h3>
                        <button @click="twoStageMode = !twoStageMode" class="text-xs text-blue-600 hover:underline">
                            {{ twoStageMode ? '切換單一利率' : '啟用分段利率 (補貼退場)' }}
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-stone-500 mb-1">
                                {{ twoStageMode ? '第一段利率 (%)' : '年利率 (%)' }}
                            </label>
                            <input type="number" v-model.number="rate1" step="0.005" aria-label="第一段利率或年利率"
                                class="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        </div>

                        <div v-if="twoStageMode">
                            <label class="block text-xs font-semibold text-stone-500 mb-1">第二段利率 (%)</label>
                            <input type="number" v-model.number="rate2" step="0.005" aria-label="第二段利率"
                                class="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        </div>
                    </div>

                    <div v-if="twoStageMode">
                        <label class="block text-xs font-semibold text-stone-500 mb-1">第一段期間 (月)</label>
                        <div class="flex gap-2 items-center">
                            <input type="number" v-model.number="stage1Months" title="第一段期間 (月)" placeholder="7"
                                class="w-20 bg-white border border-stone-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500">
                            <span class="text-xs text-stone-400">個月後變更 (如: 2026/8 退場剩 7 個月)</span>
                        </div>
                    </div>
                </div>

                <!-- Prepayment Settings -->
                <!-- Prepayment Settings -->
                <div class="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-bold text-stone-700">提前還款</h3>
                        <button @click="prepaymentMode = !prepaymentMode"
                            class="text-xs text-blue-600 hover:underline">
                            {{ prepaymentMode ? '關閉試算' : '開啟試算' }}
                        </button>
                    </div>

                    <div v-if="prepaymentMode" class="grid grid-cols-2 gap-4 animate-fade-in-up">
                        <div>
                            <label class="block text-xs font-semibold text-stone-500 mb-1">每月多還 (元)</label>
                            <input type="number" v-model.number="extraMonthly" placeholder="0"
                                class="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-stone-500 mb-1">單筆大額還款 (萬)</label>
                            <div class="flex gap-2">
                                <input type="number" v-model.number="extraLump" placeholder="0"
                                    class="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500">
                            </div>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs font-semibold text-stone-500 mb-1">大額還款時間 (第幾年)</label>
                            <div class="flex gap-2 items-center">
                                <input type="range" v-model.number="lumpYear" min="1" :max="years-1"
                                    class="flex-grow h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600">
                                <span class="text-sm font-bold text-stone-700 w-16 text-right">第 {{lumpYear}}
                                    年</span>
                            </div>
                        </div>
                    </div>
                </div>

            <!-- Results -->
            <div class="pt-4 border-t border-stone-100 grid gap-4">

                <!-- Monthly Pay -->
                <div
                    class="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-xl p-4 md:p-6 border border-emerald-100 text-center shadow-inner">
                    <p class="text-xs text-emerald-700 uppercase tracking-wide mb-1">預估月付金</p>

                    <!-- Logic for Displaying Ranges -->
                    <div v-if="graceYears > 0">
                        <p class="text-sm font-medium text-emerald-600 mb-1">寬限期內 ({{graceYears}}年)</p>
                        <p class="text-3xl font-bold font-mono text-emerald-800 mb-3">${{ fmt(results.gracePay) }}
                        </p>

                        <div class="h-px bg-emerald-200 w-1/2 mx-auto my-3"></div>

                        <p class="text-sm font-medium text-emerald-600 mb-1">寬限期後</p>
                        <p class="text-2xl font-bold font-mono text-emerald-800">${{ fmt(results.afterGracePay) }}
                        </p>
                        <p v-if="twoStageMode && results.stage2Pay !== results.afterGracePay"
                            class="text-xs text-emerald-600/70 mt-1">
                            (利率變更後: ${{ fmt(results.stage2Pay) }})
                        </p>
                    </div>
                    <div v-else>
                        <p class="text-3xl font-bold font-mono text-emerald-800">${{ fmt(results.basePay) }}</p>
                        <p v-if="twoStageMode && results.stage2Pay !== results.basePay"
                            class="text-sm text-emerald-600 mt-2">
                            第 {{stage1Months + 1}} 個月起: ${{ fmt(results.stage2Pay) }}
                        </p>
                    </div>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-2 gap-4 text-xs">
                    <div class="bg-white/50 p-3 rounded-xl border border-stone-200">
                        <span class="block text-stone-400 mb-1">利息總支出</span>
                        <span class="block text-lg font-bold text-stone-700 font-mono">${{
                            fmt(results.totalInterest) }}</span>
                    </div>
                    <div class="bg-white/50 p-3 rounded-xl border border-stone-200">
                        <span class="block text-stone-400 mb-1">本息總額</span>
                        <span class="block text-lg font-bold text-stone-700 font-mono">${{
                            fmt(results.totalPayment) }}</span>
                    </div>
                </div>

                <!-- Prepayment Comparison -->
                <div v-if="prepaymentMode && (extraMonthly > 0 || extraLump > 0)"
                    class="mt-4 bg-amber-50/80 rounded-xl p-4 border border-amber-100 animate-fade-in-up">
                    <h4 class="text-amber-800 font-bold mb-2 flex items-center gap-2">
                        <span>🎉 提前還款效益</span>
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-amber-600/80 text-xs mb-1">節省利息</span>
                            <span class="block text-xl font-bold text-amber-700 font-mono">${{
                                fmt(results.interestSaved) }}</span>
                        </div>
                        <div>
                            <span class="block text-amber-600/80 text-xs mb-1">縮短時間</span>
                            <span class="block text-xl font-bold text-amber-700 font-mono">{{
                                Math.floor(results.monthsSaved / 12) }}年 {{ results.monthsSaved % 12 }}月</span>
                        </div>
                        <div
                            class="col-span-2 pt-2 border-t border-amber-200/50 flex justify-between items-center">
                            <span class="text-amber-600/80 text-xs">預計還清時間</span>
                            <span class="text-sm font-bold text-amber-800 font-mono">第 {{
                                Math.floor(results.finalMonths / 12) + 1 }} 年</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Notes -->
        <div class="text-xs text-stone-400 space-y-1 opacity-80 px-2">
            <p>註：計算採用本息平均攤還法。</p>
            <p>新青安試算預設：前7個月 (至2026/7) 有補貼，之後回復一般利率。</p>
            <p v-if="prepaymentMode">提前還款計算：假設每月增加還款金額優先沖銷本金，且維持原設定的每月應繳本息金額 (縮短年限法)。</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Decimal from 'decimal.js';

const amountWan = ref(1000) // 1000萬
const years = ref(40)
const graceYears = ref(5)

const rate1 = ref(1.775)
const rate2 = ref(2.15)
const twoStageMode = ref(true)
const stage1Months = ref(7)

// Prepayment State
const prepaymentMode = ref(false)
const extraMonthly = ref(0)
const extraLump = ref(0)
const lumpYear = ref(3) // Default 3rd year

const applyPreset = (type) => {
    if (type === 'newYouth') {
        amountWan.value = 1000
        years.value = 40
        graceYears.value = 5
        rate1.value = 1.775
        rate2.value = 2.15
        twoStageMode.value = true
        stage1Months.value = 7
    } else if (type === 'general') {
        amountWan.value = 1200
        years.value = 30
        graceYears.value = 0
        rate1.value = 2.185
        twoStageMode.value = false
    }
}

const fmt = (n) => n ? new Decimal(n).round().toNumber().toLocaleString('zh-TW') : '0'

const PMT = (rateYear, nMonths, pv) => {
    const ry = new Decimal(rateYear)
    const nm = new Decimal(nMonths)
    const pval = new Decimal(pv)
    
    if (ry.equals(0)) return pval.div(nm)
    const r = ry.div(100).div(12)
    const onePlusR = r.plus(1)
    const pow = onePlusR.pow(nm)
    // pv * r * pow / (pow - 1)
    return pval.mul(r).mul(pow).div(pow.minus(1))
}

const results = computed(() => {
    const loan = new Decimal(amountWan.value || 0).mul(10000)
    const totalMonths = (years.value || 0) * 12
    const graceMonths = (graceYears.value || 0) * 12
    const changeMonth = twoStageMode.value ? stage1Months.value : 99999

    if (totalMonths <= 0) return {}

    // Rate Helper
    const getRate = (m) => {
        const rVal = (m <= changeMonth) ? rate1.value : (rate2.value || rate1.value)
        return new Decimal(rVal).div(100).div(12)
    }

    // Pass 1: Original Schedule
    let bal1 = loan
    let totInt1 = new Decimal(0)
    let pmts = []
    let payGrace = new Decimal(0)
    let payStart = new Decimal(0)
    let payStage2 = new Decimal(0)
    let currentStdPMT = new Decimal(0)

    for (let m = 1; m <= totalMonths; m++) {
        const r = getRate(m)
        const int = bal1.mul(r).round() // Interest is properly rounded monthly
        totInt1 = totInt1.plus(int)

        let pmt = new Decimal(0)
        if (m <= graceMonths) {
            pmt = int
            if (m === 1) payGrace = pmt
        } else {
            if (m === graceMonths + 1 || m === changeMonth + 1) {
                const rem = totalMonths - m + 1
                // Recalculate PMT based on remaining balance
                if (bal1.gt(0)) {
                    // PMT needs rate in %, remaining months, and PV
                    const ratePct = (m <= changeMonth ? rate1.value : (rate2.value || rate1.value))
                    currentStdPMT = PMT(ratePct, rem, bal1).round()
                } else {
                    currentStdPMT = new Decimal(0)
                }
            }
            pmt = currentStdPMT
            if (m === graceMonths + 1) payStart = pmt
            if (m === changeMonth + 1) payStage2 = pmt
        }
        
        // Final adjustment for last month? Usually regular PMT covers it, but with rounding differences...
        // For standard simulation, we just decrease balance.
        // If balance < pmt (last month), we just pay balance + int?
        // Standard amortization usually keeps PMT constant. Let's stick to standard.
        // But we should check if balance goes negative.

        let prin = pmt.minus(int)
        
        // Handling the very last payment precision if needed? 
        // For now, let standard logic run. 
        
        pmts.push(pmt)
        bal1 = bal1.minus(prin)
    }

    const totalPayment1 = loan.plus(totInt1)

    // Pass 2: Prepayment
    let totInt2 = totInt1
    let realMonths = totalMonths

    if (prepaymentMode.value && (extraMonthly.value > 0 || extraLump.value > 0)) {
        let bal2 = loan
        totInt2 = new Decimal(0)
        realMonths = 0
        const lumpM = (lumpYear.value * 12)
        const exMon = new Decimal(extraMonthly.value || 0)
        const exLump = new Decimal(extraLump.value || 0).mul(10000)

        let balPrepay = loan

        for (let m = 1; m <= totalMonths; m++) {
            if (balPrepay.lte(10)) { // Threshold for "paid off"
                if (realMonths === 0) realMonths = m - 1
                break
            }
            realMonths = m 

            const r = getRate(m)
            const int = balPrepay.mul(r).round()
            totInt2 = totInt2.plus(int)

            let basePmt = pmts[m - 1] || new Decimal(0)
            let actualPay = new Decimal(0)

            if (m <= graceMonths) {
                actualPay = int
            } else {
                actualPay = basePmt
            }

            let extra = exMon
            if (m === lumpM) extra = extra.plus(exLump)

            let totalPay = actualPay.plus(extra)

            if (totalPay.gt(balPrepay.plus(int))) {
                 totalPay = balPrepay.plus(int)
            }

            const prin = totalPay.minus(int)
            balPrepay = balPrepay.minus(prin)
        }
    }
    
    // Calculate stats
    const interestSaved = totInt1.minus(totInt2)

    return {
        gracePay: payGrace.toNumber(),
        afterGracePay: payStart.toNumber(),
        stage2Pay: (payStage2.gt(0) ? payStage2 : payStart).toNumber(),
        basePay: payStart.toNumber(),
        totalInterest: totInt1.toNumber(),
        totalPayment: totalPayment1.toNumber(),

        // New Results
        newTotalInterest: totInt2.toNumber(),
        newTotalPayment: loan.plus(totInt2).toNumber(),
        monthsSaved: totalMonths - realMonths,
        interestSaved: interestSaved.toNumber(),
        finalMonths: realMonths
    }
})

// Auto-save for Dashboard
watch(results, (newVal) => {
    if (typeof localStorage === 'undefined') return
    if (newVal.afterGracePay > 0) {
        localStorage.setItem('taicalc_mortgage_monthly', Math.floor(newVal.afterGracePay))
    } else {
        localStorage.removeItem('taicalc_mortgage_monthly')
    }
}, { deep: true, immediate: true })

// Persistence
onMounted(() => {
    if (typeof localStorage === 'undefined') return
    const saved = localStorage.getItem('taicalc_mortgage_inputs')
    if (saved) {
        try {
            const data = JSON.parse(saved)
            if (data.amountWan) amountWan.value = data.amountWan
            if (data.years) years.value = data.years
            if (data.graceYears !== undefined) graceYears.value = data.graceYears
            if (data.rate1) rate1.value = data.rate1
            if (data.rate2) rate2.value = data.rate2
            if (data.twoStageMode !== undefined) twoStageMode.value = data.twoStageMode
        } catch (e) { }
    }
})

const validateInputs = () => {
    if (amountWan.value < 0) amountWan.value = 0
    if (years.value < 1) years.value = 1
    if (years.value > 50) years.value = 50
    if (graceYears.value < 0) graceYears.value = 0
    if (graceYears.value >= years.value) graceYears.value = years.value - 1
    if (rate1.value < 0) rate1.value = 0
    if (rate2.value < 0) rate2.value = 0
}

watch([amountWan, years, graceYears, rate1, rate2], validateInputs)

watch([amountWan, years, graceYears, rate1, rate2, twoStageMode], (vals) => {
    validateInputs()
    if (typeof localStorage === 'undefined') return
    localStorage.setItem('taicalc_mortgage_inputs', JSON.stringify({
        amountWan: vals[0], years: vals[1], graceYears: vals[2],
        rate1: vals[3], rate2: vals[4], twoStageMode: vals[5]
    }))
})
</script>
