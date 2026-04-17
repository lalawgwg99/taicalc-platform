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
        <div class="note-box">
            <p>月付金佔稅前月薪比例建議不超過 <strong>30~40%</strong>。</p>
            <p class="mt-1">採本息平均攤還法計算。新青安試算：前 {{ stage1Months }} 個月利率較低，之後回復一般利率。</p>
        </div>

        <!-- 分享列 -->
        <div class="flex gap-2">
            <button @click="copyShareLink"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {{ shareCopied ? '已複製連結 ✓' : '複製分享連結' }}
            </button>
            <button @click="downloadCard"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-paper-300 bg-white text-sm text-ink-100 hover:border-brand-200 hover:text-brand-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                下載試算圖卡
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Decimal from 'decimal.js';
import { calculateMortgageResults } from '../../utils/calculators/mortgage';

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

// ── 核心計算 ───────────────────────────────────────────────────
const results = computed(() => calculateMortgageResults({
    amountWan: amountWan.value,
    years: years.value,
    graceYears: graceYears.value,
    rate1: rate1.value,
    rate2: rate2.value,
    twoStageMode: twoStageMode.value,
    stage1Months: stage1Months.value,
    prepaymentMode: prepaymentMode.value,
    extraMonthly: extraMonthly.value,
    extraLump: extraLump.value,
    lumpYear: lumpYear.value,
}))

// ── 驗證 ───────────────────────────────────────────────────────
const validate = () => {
    if (amountWan.value < 0)           amountWan.value = 0
    if (years.value < 1)               years.value = 1
    if (years.value > 50)              years.value = 50
    if (graceYears.value < 0)          graceYears.value = 0
    if (graceYears.value >= years.value) graceYears.value = years.value - 1
    if (rate1.value < 0)               rate1.value = 0
    if (rate2.value < 0)               rate2.value = 0
    if (stage1Months.value < 1)        stage1Months.value = 1
    const maxStageMonths = Math.max(1, years.value * 12 - 1)
    if (stage1Months.value > maxStageMonths) stage1Months.value = maxStageMonths
    if (extraMonthly.value < 0)        extraMonthly.value = 0
    if (extraLump.value < 0)           extraLump.value = 0
    if (lumpYear.value < 1)            lumpYear.value = 1
    if (lumpYear.value > Math.max(1, years.value - 1)) lumpYear.value = Math.max(1, years.value - 1)
}
watch([amountWan, years, graceYears, rate1, rate2, stage1Months, extraMonthly, extraLump, lumpYear], validate)

// ── Dashboard 儲存 ─────────────────────────────────────────────
watch(results, (v) => {
    if (typeof localStorage === 'undefined') return
    const val = v.afterGracePay || v.basePay
    if (val > 0) localStorage.setItem('taicalc_mortgage_monthly', Math.floor(val))
    else         localStorage.removeItem('taicalc_mortgage_monthly')
}, { deep: true, immediate: true })

// ── 分享連結 ───────────────────────────────────────────────────
const shareCopied = ref(false)

const buildShareURL = () => {
    if (typeof window === 'undefined') return ''
    const p = new URLSearchParams({
        amount: String(amountWan.value),
        years:  String(years.value),
        grace:  String(graceYears.value),
        r1:     String(rate1.value),
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
    const conditionText = `貸款 ${amountWan.value} 萬 · ${years.value} 年期 · 利率 ${rate1.value}%${graceYears.value > 0 ? ` · 寬限 ${graceYears.value} 年` : ''}`
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
    const mainLabel = graceYears.value > 0 ? `寬限期月付（${graceYears.value} 年）` : '每月還款'
    ctx.fillStyle = '#9B9890'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillText(mainLabel, 64, 184)
    ctx.fillStyle = '#059669'
    ctx.font = 'bold 44px -apple-system, sans-serif'
    ctx.fillText(`$ ${fmt(mainPay)}`, 64, 236)

    // 次要數字
    if (graceYears.value > 0) {
        ctx.fillStyle = '#9B9890'
        ctx.font = '12px -apple-system, sans-serif'
        ctx.fillText('寬限期後月付', 64, 266)
        ctx.fillStyle = '#1A1A1A'
        ctx.font = 'bold 24px -apple-system, sans-serif'
        ctx.fillText(`$ ${fmt(results.value.afterGracePay)}`, 64, 293)
    }

    // 右側統計
    const rightX = 500
    ctx.fillStyle = '#9B9890'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillText('利息總支出', rightX, 184)
    ctx.fillStyle = '#1A1A1A'
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillText(`$ ${fmt(results.value.totalInterest)}`, rightX, 210)

    ctx.fillStyle = '#9B9890'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.fillText('本息總額', rightX, 240)
    ctx.fillStyle = '#1A1A1A'
    ctx.font = 'bold 20px -apple-system, sans-serif'
    ctx.fillText(`$ ${fmt(results.value.totalPayment)}`, rightX, 266)

    // 底部網址
    ctx.fillStyle = '#C4C0B6'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.fillText('taicalc.com  ·  本地計算，資料不上傳', 64, H - 44)

    // 下載
    const a = document.createElement('a')
    a.download = `TaiCalc-房貸試算-${amountWan.value}萬.png`
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

    // 1. URL 參數優先（分享連結）
    if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search)
        if (p.has('amount'))  amountWan.value    = parseFloat(p.get('amount')) || amountWan.value
        if (p.has('years'))   years.value        = parseInt(p.get('years'))    || years.value
        if (p.has('grace'))   graceYears.value   = parseInt(p.get('grace'))    ?? graceYears.value
        if (p.has('r1'))      rate1.value        = parseFloat(p.get('r1'))     || rate1.value
        if (p.has('r2'))      rate2.value        = parseFloat(p.get('r2'))     || rate2.value
        if (p.has('ts'))      twoStageMode.value = p.get('ts') === '1'
        if (p.has('sm'))      stage1Months.value = parseInt(p.get('sm'))       || stage1Months.value
        // 有 URL 參數時不再讀 localStorage，直接返回
        if (p.has('amount') || p.has('r1')) return
    }

    // 2. localStorage 備份
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
            if (d.stage1Months)            stage1Months.value = d.stage1Months
            if (d.twoStageMode !== undefined) twoStageMode.value = d.twoStageMode
        }
    } catch (e) {}
})

watch([amountWan, years, graceYears, rate1, rate2, twoStageMode, stage1Months], (vals) => {
    validate()
    if (typeof localStorage === 'undefined') return
    localStorage.setItem('taicalc_mortgage_inputs', JSON.stringify({
        amountWan: vals[0], years: vals[1], graceYears: vals[2],
        rate1: vals[3], rate2: vals[4], twoStageMode: vals[5], stage1Months: vals[6]
    }))
})
</script>
