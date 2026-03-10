<template>
    <div class="space-y-4">

        <!-- 快速預設 -->
        <div class="seg-control">
            <button @click="applyPreset('newYouth')" :class="['seg-btn', preset === 'newYouth' ? 'seg-btn-active' : '']">🏠 新青安</button>
            <button @click="applyPreset('general')"  :class="['seg-btn', preset === 'general'  ? 'seg-btn-active' : '']">🏦 一般房貸</button>
        </div>

        <!-- 基本設定 -->
        <div class="card-surface p-5 space-y-4">
            <div>
                <label class="block text-xs font-medium text-ink-400 mb-1.5">貸款總額（萬）</label>
                <input type="number" v-model.number="amountWan" aria-label="貸款總額" placeholder="1000"
                    class="input-clean text-xl font-semibold tabular-nums">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">貸款年限</label>
                    <input type="number" v-model.number="years" aria-label="貸款年限"
                        class="input-clean font-semibold">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">寬限期（年）</label>
                    <select v-model.number="graceYears" aria-label="寬限期"
                        class="input-clean font-medium">
                        <option :value="0">無寬限期</option>
                        <option v-for="y in 5" :key="y" :value="y">{{ y }} 年</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- 利率設定 -->
        <div class="card-surface p-5 space-y-3">
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-ink-600">利率設定</p>
                <button @click="twoStageMode = !twoStageMode"
                    class="text-xs text-azure hover:underline transition-colors">
                    {{ twoStageMode ? '切換單一利率' : '啟用分段利率（補貼退場）' }}
                </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">
                        {{ twoStageMode ? '第一段利率（%）' : '年利率（%）' }}
                    </label>
                    <input type="number" v-model.number="rate1" step="0.005" aria-label="利率"
                        :class="['input-clean font-semibold tabular-nums transition-all', rateFlash ? 'border-azure shadow-input' : '']">
                </div>
                <div v-if="twoStageMode">
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">第二段利率（%）</label>
                    <input type="number" v-model.number="rate2" step="0.005" aria-label="第二段利率"
                        class="input-clean font-semibold tabular-nums">
                </div>
            </div>
            <!-- ⚡ 央行即時利率提示 -->
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

        <div v-if="twoStageMode" class="animate-fade-in-up">
                <label class="block text-xs font-medium text-ink-400 mb-1.5">第一段期間（月）</label>
                <div class="flex gap-2 items-center">
                    <input type="number" v-model.number="stage1Months" placeholder="7"
                        class="input-clean w-24 text-center font-semibold">
                    <span class="text-xs text-ink-400">個月後變更利率</span>
                </div>
            </div>
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
                        <label class="block text-xs font-medium text-ink-400 mb-1.5">每月多還（元）</label>
                        <input type="number" v-model.number="extraMonthly" placeholder="0"
                            class="input-clean tabular-nums">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-ink-400 mb-1.5">單筆大額還款（萬）</label>
                        <input type="number" v-model.number="extraLump" placeholder="0"
                            class="input-clean tabular-nums">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">大額還款時間（第 {{ lumpYear }} 年）</label>
                    <input type="range" v-model.number="lumpYear" min="1" :max="Math.max(1, years - 1)"
                        class="w-full h-2 bg-paper-200 rounded-lg appearance-none cursor-pointer accent-azure-500">
                </div>
            </div>
        </div>

        <!-- ── 結果 ── -->
        <div class="card-surface p-5">
            <p class="stat-label text-center mb-1">預估月付金</p>

            <!-- 有寬限期 -->
            <div v-if="graceYears > 0" class="text-center">
                <div class="mb-4">
                    <p class="text-xs text-ink-400 mb-1">寬限期內（{{ graceYears }} 年）</p>
                    <p class="stat-value-lg text-azure">$ {{ fmt(results.gracePay) }}</p>
                </div>
                <div class="h-px bg-paper-300 w-24 mx-auto my-4"></div>
                <div>
                    <p class="text-xs text-ink-400 mb-1">寬限期後</p>
                    <p class="stat-value-md text-ink-700">$ {{ fmt(results.afterGracePay) }}</p>
                    <p v-if="twoStageMode && results.stage2Pay !== results.afterGracePay"
                        class="text-xs text-ink-400 mt-1">
                        （利率變更後：$ {{ fmt(results.stage2Pay) }}）
                    </p>
                </div>
            </div>

            <!-- 無寬限期 -->
            <div v-else class="text-center">
                <p class="stat-value-lg text-azure">$ {{ fmt(results.basePay) }}</p>
                <p v-if="twoStageMode && results.stage2Pay !== results.basePay"
                    class="text-sm text-ink-400 mt-2">
                    第 {{ stage1Months + 1 }} 個月起：$ {{ fmt(results.stage2Pay) }}
                </p>
            </div>

            <!-- 摘要統計 -->
            <div class="grid grid-cols-2 gap-3 mt-5">
                <div class="bg-paper-200/60 rounded-xl p-3">
                    <p class="text-xs text-ink-400 mb-0.5">利息總支出</p>
                    <p class="text-base font-semibold text-ink-700 tabular-nums">$ {{ fmt(results.totalInterest) }}</p>
                </div>
                <div class="bg-paper-200/60 rounded-xl p-3">
                    <p class="text-xs text-ink-400 mb-0.5">本息總額</p>
                    <p class="text-base font-semibold text-ink-700 tabular-nums">$ {{ fmt(results.totalPayment) }}</p>
                </div>
            </div>

            <!-- 提前還款效益 -->
            <div v-if="prepaymentMode && (extraMonthly > 0 || extraLump > 0)"
                class="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100 animate-fade-in-up">
                <p class="text-xs font-medium text-amber-700 mb-3">🎉 提前還款效益</p>
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

        <!-- 月付房租比 -->
        <div v-if="monthlyIncomeRef > 0 || true" class="note-box">
            <p>月付金佔稅前月薪比例建議不超過 <strong>30~40%</strong>。</p>
            <p class="mt-1">採本息平均攤還法計算。新青安試算：前 {{ stage1Months }} 個月利率較低，之後回復一般利率。</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Decimal from 'decimal.js';

// ── 狀態 ───────────────────────────────────────────────────────
const amountWan    = ref(1000)
const years        = ref(40)
const graceYears   = ref(5)
const rate1        = ref(1.775)
const rate2        = ref(2.15)
const twoStageMode = ref(false)  // 預設關閉，避免初次用戶困惑
const stage1Months = ref(7)
const preset       = ref('newYouth')
const monthlyIncomeRef = ref(0)

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

// ── 快速預設 ───────────────────────────────────────────────────
const applyPreset = (type) => {
    preset.value = type
    if (type === 'newYouth') {
        amountWan.value    = 1000
        years.value        = 40
        graceYears.value   = 5
        rate1.value        = 1.775
        rate2.value        = 2.15
        twoStageMode.value = true
        stage1Months.value = 7
    } else {
        amountWan.value    = 1200
        years.value        = 30
        graceYears.value   = 0
        rate1.value        = 2.185
        twoStageMode.value = false
    }
}

// ── 工具 ───────────────────────────────────────────────────────
const fmt = (n) => n ? new Decimal(n).round().toNumber().toLocaleString('zh-TW') : '0'

const PMT = (rateYear, nMonths, pv) => {
    const ry   = new Decimal(rateYear)
    const nm   = new Decimal(nMonths)
    const pval = new Decimal(pv)
    if (ry.equals(0)) return pval.div(nm)
    const r      = ry.div(100).div(12)
    const pow    = r.plus(1).pow(nm)
    return pval.mul(r).mul(pow).div(pow.minus(1))
}

// ── 核心計算 ───────────────────────────────────────────────────
const results = computed(() => {
    const loan         = new Decimal(amountWan.value || 0).mul(10000)
    const totalMonths  = (years.value || 0) * 12
    const graceMonths  = (graceYears.value || 0) * 12
    const changeMonth  = twoStageMode.value ? stage1Months.value : 99999

    if (totalMonths <= 0) return {}

    const getRate = (m) => {
        const rVal = (m <= changeMonth) ? rate1.value : (rate2.value || rate1.value)
        return new Decimal(rVal).div(100).div(12)
    }

    // Pass 1：標準攤還
    let bal1 = loan
    let totInt1 = new Decimal(0)
    let pmts = []
    let payGrace = new Decimal(0)
    let payStart = new Decimal(0)
    let payStage2 = new Decimal(0)
    let currentStdPMT = new Decimal(0)

    for (let m = 1; m <= totalMonths; m++) {
        const r   = getRate(m)
        const int = bal1.mul(r).round()
        totInt1   = totInt1.plus(int)

        let pmt = new Decimal(0)
        if (m <= graceMonths) {
            pmt = int
            if (m === 1) payGrace = pmt
        } else {
            if (m === graceMonths + 1 || m === changeMonth + 1) {
                const rem    = totalMonths - m + 1
                const ratePct = (m <= changeMonth ? rate1.value : (rate2.value || rate1.value))
                currentStdPMT = bal1.gt(0) ? PMT(ratePct, rem, bal1).round() : new Decimal(0)
            }
            pmt = currentStdPMT
            if (m === graceMonths + 1) payStart  = pmt
            if (m === changeMonth + 1) payStage2 = pmt
        }

        pmts.push(pmt)
        bal1 = bal1.minus(pmt.minus(int))
    }

    const totalPayment1 = loan.plus(totInt1)

    // Pass 2：提前還款
    let totInt2  = totInt1
    let realMonths = totalMonths

    if (prepaymentMode.value && (extraMonthly.value > 0 || extraLump.value > 0)) {
        let balPrepay = loan
        totInt2    = new Decimal(0)
        realMonths = 0
        const lumpM  = lumpYear.value * 12
        const exMon  = new Decimal(extraMonthly.value || 0)
        const exLump = new Decimal(extraLump.value || 0).mul(10000)

        for (let m = 1; m <= totalMonths; m++) {
            if (balPrepay.lte(10)) { if (!realMonths) realMonths = m - 1; break }
            realMonths = m
            const r    = getRate(m)
            const int  = balPrepay.mul(r).round()
            totInt2    = totInt2.plus(int)

            let basePmt   = pmts[m - 1] || new Decimal(0)
            let actualPay = m <= graceMonths ? int : basePmt
            let extra     = exMon
            if (m === lumpM) extra = extra.plus(exLump)
            let totalPay  = actualPay.plus(extra)
            if (totalPay.gt(balPrepay.plus(int))) totalPay = balPrepay.plus(int)
            balPrepay = balPrepay.minus(totalPay.minus(int))
        }
    }

    const interestSaved = totInt1.minus(totInt2)

    return {
        gracePay:      payGrace.toNumber(),
        afterGracePay: payStart.toNumber(),
        stage2Pay:     (payStage2.gt(0) ? payStage2 : payStart).toNumber(),
        basePay:       payStart.toNumber(),
        totalInterest: totInt1.toNumber(),
        totalPayment:  totalPayment1.toNumber(),
        interestSaved: interestSaved.toNumber(),
        monthsSaved:   totalMonths - realMonths,
        finalMonths:   realMonths,
    }
})

// ── 驗證 ───────────────────────────────────────────────────────
const validate = () => {
    if (amountWan.value < 0)           amountWan.value = 0
    if (years.value < 1)               years.value = 1
    if (years.value > 50)              years.value = 50
    if (graceYears.value < 0)          graceYears.value = 0
    if (graceYears.value >= years.value) graceYears.value = years.value - 1
    if (rate1.value < 0)               rate1.value = 0
    if (rate2.value < 0)               rate2.value = 0
}
watch([amountWan, years, graceYears, rate1, rate2], validate)

// ── Dashboard 儲存 ─────────────────────────────────────────────
watch(results, (v) => {
    if (typeof localStorage === 'undefined') return
    const val = v.afterGracePay || v.basePay
    if (val > 0) localStorage.setItem('taicalc_mortgage_monthly', Math.floor(val))
    else         localStorage.removeItem('taicalc_mortgage_monthly')
}, { deep: true, immediate: true })

// ── 持久化 ─────────────────────────────────────────────────────
onMounted(() => {
    fetchLiveRate()
    if (typeof localStorage === 'undefined') return
    try {
        const saved = localStorage.getItem('taicalc_mortgage_inputs')
        if (saved) {
            const d = JSON.parse(saved)
            if (d.amountWan)               amountWan.value    = d.amountWan
            if (d.years)                   years.value        = d.years
            if (d.graceYears !== undefined) graceYears.value  = d.graceYears
            if (d.rate1)                   rate1.value        = d.rate1
            if (d.rate2)                   rate2.value        = d.rate2
            if (d.twoStageMode !== undefined) twoStageMode.value = d.twoStageMode
        }
    } catch (e) {}
})

watch([amountWan, years, graceYears, rate1, rate2, twoStageMode], (vals) => {
    validate()
    if (typeof localStorage === 'undefined') return
    localStorage.setItem('taicalc_mortgage_inputs', JSON.stringify({
        amountWan: vals[0], years: vals[1], graceYears: vals[2],
        rate1: vals[3], rate2: vals[4], twoStageMode: vals[5]
    }))
})
</script>
