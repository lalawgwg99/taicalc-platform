// TaiCalc：信貸地雷檢測器
// 輸入銀行開出的貸款條件，逐項檢查：總費用年百分率揭露、開辦費、利率話術、綁約期、違約金、搭售保險、聯徵查詢。
<template>
    <div class="calculator-shell space-y-4">

        <div class="card-surface p-5">
            <p class="text-sm font-bold text-ink-700 mb-1">把銀行開給你的條件輸進來，我幫你檢查有沒有地雷</p>
            <p class="text-[11px] text-ink-400">銀行不會自己說自己的壞話。以下檢查基準來自市場常見行情與金管會揭露規範，實際以契約為準。</p>
        </div>

        <!-- 輸入 -->
        <div class="card-surface p-5 space-y-4">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">貸款金額（萬元）</label>
                    <input type="text" inputmode="decimal" v-model.number="amount" aria-label="貸款金額萬元" placeholder="例：50" class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">期數（月）</label>
                    <input type="text" inputmode="numeric" v-model.number="termMonths" aria-label="期數月" placeholder="例：84" class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">廣告年利率（%）</label>
                    <input type="text" inputmode="decimal" v-model.number="adRate" aria-label="廣告年利率" placeholder="例：2.99" class="input-clean text-lg font-semibold tabular-nums">
                    <p class="mt-1 text-[10px] text-ink-400">DM 上寫的「X%起」那個數字</p>
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">總費用年百分率（%，選填）</label>
                    <input type="text" inputmode="decimal" v-model.number="apr" aria-label="總費用年百分率" placeholder="例：3.45" class="input-clean text-lg font-semibold tabular-nums">
                    <p class="mt-1 text-[10px] text-ink-400">銀行依法應揭露，沒給就是警訊</p>
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">開辦費／手續費（元）</label>
                    <input type="text" inputmode="decimal" v-model.number="fee" aria-label="開辦費" placeholder="例：3000" class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">綁約期（月，0＝無）</label>
                    <input type="text" inputmode="numeric" v-model.number="lockMonths" aria-label="綁約期月" placeholder="例：12" class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">提前清償違約金（%，選填）</label>
                    <input type="text" inputmode="decimal" v-model.number="penalty" aria-label="提前清償違約金" placeholder="例：2" class="input-clean text-lg font-semibold tabular-nums">
                </div>
                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">近 3 個月聯徵查詢次數</label>
                    <input type="text" inputmode="numeric" v-model.number="inquiries" aria-label="聯徵查詢次數" placeholder="例：1" class="input-clean text-lg font-semibold tabular-nums">
                </div>
            </div>
            <label class="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="bundled" class="mt-1 w-4 h-4 accent-red-600">
                <span class="text-sm text-ink-600">銀行要求同時買保險／理財商品才給這個利率（搭售）</span>
            </label>
        </div>

        <!-- 檢測結果 -->
        <div v-if="hasInput" class="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm space-y-3">
            <div class="flex items-center gap-3">
                <span class="text-3xl">{{ verdict.emoji }}</span>
                <div>
                    <p class="text-base font-bold text-ink-700">{{ verdict.title }}</p>
                    <p class="text-xs text-ink-400">{{ verdict.desc }}</p>
                </div>
            </div>

            <div v-if="estimatedApr" class="rounded-xl bg-brand-50 border border-brand-200 p-3.5">
                <p class="text-xs font-bold text-brand-700 mb-1">💡 你沒填總費用年百分率，我幫你估算</p>
                <p class="text-sm text-ink-600">貸款 {{ amount }} 萬、開辦費 {{ fmt(fee) }} 元、廣告利率 {{ adRate }}%，<strong>實質年利率約 {{ estimatedApr }}%</strong>（已把開辦費攤入）。拿這個數字去跟別家比，不要比廣告利率。</p>
            </div>

            <div class="space-y-2.5">
                <div v-for="(c, i) in checks" :key="i" class="flex gap-3 rounded-xl border p-3.5"
                    :class="c.level === 'red' ? 'border-red-200 bg-red-50' : c.level === 'yellow' ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'">
                    <span class="text-xl shrink-0">{{ c.level === 'red' ? '🔴' : c.level === 'yellow' ? '🟡' : '🟢' }}</span>
                    <div>
                        <p class="text-sm font-bold text-ink-700">{{ c.title }}</p>
                        <p class="text-[13px] leading-relaxed text-ink-600 mt-0.5">{{ c.desc }}</p>
                    </div>
                </div>
            </div>

            <div v-if="talkPoints.length" class="rounded-xl bg-paper-100 p-4">
                <p class="text-xs font-bold text-ink-400 mb-2">拿去跟銀行談的話術</p>
                <ul class="space-y-1.5">
                    <li v-for="(t, i) in talkPoints" :key="i" class="text-[13px] leading-relaxed text-ink-600">💬 {{ t }}</li>
                </ul>
            </div>
            <p class="text-[10px] text-ink-400">檢查基準：廣告利率 2.1%~3% 為 2026 年市場常見「起」利率；開辦費常見 0~3,000 元；綁約期常見 12 個月；提前清償違約金常見 1%~3%；聯徵 3 個月內新業務查詢建議 ≤2 次。實際核貸條件依個人信用而定，本工具為提醒性質，簽約前務必詳閱契約。</p>
        </div>
        <div v-else class="rounded-2xl border border-dashed border-paper-300 p-6 text-center">
            <p class="text-sm text-ink-400">輸入銀行開的條件，就會開始逐項檢測。</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const amount = ref(null);       // 萬元
const termMonths = ref(84);
const adRate = ref(null);       // 廣告年利率 %
const apr = ref(null);          // 總費用年百分率 %
const fee = ref(null);          // 開辦費 元
const lockMonths = ref(null);   // 綁約期 月
const penalty = ref(null);      // 違約金 %
const inquiries = ref(null);    // 聯徵查詢次數
const bundled = ref(false);     // 搭售

const hasInput = computed(() => (amount.value || 0) > 0 || (adRate.value || 0) > 0 || (fee.value || 0) > 0);

// 估算實質年利率（IRR）：實拿 = 貸款 - 開辦費，月付按廣告利率算
const estimatedApr = computed(() => {
    const L = (amount.value || 0) * 10000;
    const F = fee.value || 0;
    const r = (adRate.value || 0) / 100;
    const n = termMonths.value || 84;
    if (L <= 0 || r <= 0 || n <= 0 || (apr.value || 0) > 0) return null;
    const rm = r / 12;
    const pmt = L * rm / (1 - Math.pow(1 + rm, -n));
    const net = L - F;
    if (net <= 0) return null;
    let lo = 0, hi = 1;
    for (let k = 0; k < 80; k++) {
        const mid = (lo + hi) / 2;
        const im = mid / 12;
        const pv = im === 0 ? pmt * n : pmt * (1 - Math.pow(1 + im, -n)) / im;
        if (pv > net) lo = mid; else hi = mid;
    }
    return ((lo + hi) / 2 * 100).toFixed(2);
});

const checks = computed(() => {
    const list = [];
    const push = (level, title, desc) => list.push({ level, title, desc });

    // 1. APR 揭露
    if ((apr.value || 0) > 0) {
        push('green', '總費用年百分率有揭露', `銀行給了 ${apr.value}%，這是含所有費用的真實成本，拿這個數字去比價。`);
    } else {
        push('yellow', '沒填總費用年百分率', '銀行依法應揭露總費用年百分率（APR），這是含開辦費等所有成本的真實利率。沒給的話主動向銀行要，上面已幫你用開辦費估算。');
    }

    // 2. 開辦費
    const f = fee.value || 0;
    if (f <= 0) push('green', '開辦費 0 元', '零開辦費方案，直接省一筆。');
    else if (f <= 3000) push('green', `開辦費 ${fmt(f)} 元`, '在市場常見範圍（0~3,000 元）內，合理。');
    else if (f <= 6000) push('yellow', `開辦費 ${fmt(f)} 元偏高`, '市場常見 0~3,000 元，這個金額偏高，可以問銀行能不能減免或談成零開辦專案。');
    else push('red', `開辦費 ${fmt(f)} 元過高`, '明顯高於市場常見的 0~3,000 元。開辦費會直接墊高你的實質利率，建議換一家比價。');

    // 3. 利率話術
    const ar = adRate.value || 0;
    if (ar > 0 && ar < 2) {
        push('yellow', `廣告利率 ${ar}% 低得不尋常`, '這麼低通常是「首期優惠利率」，第 2 期起會跳回正常利率。務必問清楚：優惠幾期？之後利率多少？');
    }
    if ((apr.value || 0) > 0 && ar > 0) {
        const gap = apr.value - ar;
        if (gap <= 0.5) push('green', '廣告利率與實質成本接近', `只差 ${gap.toFixed(2)}%，費用灌水不多，廣告算誠實。`);
        else if (gap <= 1.5) push('yellow', '實質成本比廣告高一截', `總費用年百分率 ${apr.value}% 比廣告 ${ar}% 高了 ${gap.toFixed(2)}%，多出來的就是開辦費等費用的效果。`);
        else push('red', '廣告利率跟實際成本差太多', `差了 ${gap.toFixed(2)}%！廣告利率只是幌子，真正要付的是 ${apr.value}%。這種話術可以直接跳過。`);
    }

    // 4. 綁約期
    const lk = lockMonths.value;
    if (lk === 0) push('green', '無綁約', '隨時可提前清償不用付違約金，彈性最大。');
    else if (lk > 0 && lk <= 12) push('yellow', `綁約 ${lk} 個月`, '市場常見長度。綁約期內提前還款要付違約金，如果你預期一年內會有大筆資金可還款，要精算違約金划不划算。');
    else if (lk > 12) push('red', `綁約 ${lk} 個月太長`, '超過市場常見的 12 個月。這段期間你被鎖死，提前還款一定被收違約金，建議談短一點或換不綁約方案。');
    else push('yellow', '綁約期不明', '合約上一定有寫綁約期，沒問清楚不要簽。');

    // 5. 違約金
    if ((lk || 0) > 0) {
        const pn = penalty.value;
        if (pn == null) push('yellow', '違約金比例沒填', '綁約期內提前清償的違約金比例合約上一定有寫，常見 1%~3%。沒問清楚不要簽。');
        else if (pn <= 1) push('green', `違約金 ${pn}%`, '在合理範圍內。');
        else if (pn <= 3) push('yellow', `違約金 ${pn}%`, '常見範圍的上限。先算一下：如果提前還 50 萬，違約金就是 ' + fmt(500000 * pn / 100) + ' 元。');
        else push('red', `違約金 ${pn}% 過高`, '超過常見的 1%~3%。提前還 50 萬要被扣 ' + fmt(500000 * pn / 100) + ' 元，非常不划算。');
    }

    // 6. 搭售
    if (bundled.value) push('yellow', '有搭售保險／商品', '金管會規定銀行不能強制搭售。你可以拒絕，或要求把保險拆開單獨評估——通常拆開後會發現根本不需要買。');
    else push('green', '無搭售', '利率是乾淨的，沒有被綁其他商品。');

    // 7. 聯徵
    const iq = inquiries.value;
    if (iq == null) push('yellow', '聯徵查詢次數不明', '回想一下近 3 個月為了比價送了幾家。超過 2 次會開始傷信用評分。');
    else if (iq <= 2) push('green', `近 3 個月查詢 ${iq} 次`, '在安全範圍內。提醒：30 天內多家銀行的新授信查詢會被視為同一筆，比價盡量集中在 30 天內。');
    else push('red', `近 3 個月查詢 ${iq} 次過多`, '短期多次查詢會拉低信用評分，反而讓後面申請的利率更差。先暫停送件，等 3 個月再說。');

    return list;
});

const redCount = computed(() => checks.value.filter((c) => c.level === 'red').length);
const yellowCount = computed(() => checks.value.filter((c) => c.level === 'yellow').length);

const verdict = computed(() => {
    const r = redCount.value, y = yellowCount.value;
    if (r >= 3) return { emoji: '🔴', title: `地雷不少（紅燈 ${r} 個）`, desc: '這份條件不建議簽，換一家比價很可能更好。' };
    if (r >= 1) return { emoji: '🟡', title: `有 ${r} 個紅燈、${y} 個黃燈`, desc: '簽約前先把紅燈談掉，談不掉就換一家。' };
    if (y >= 1) return { emoji: '🟡', title: `零紅燈、${y} 個黃燈`, desc: '條件大致乾淨，把黃燈問清楚就可以考慮。' };
    return { emoji: '🟢', title: '條件乾淨', desc: '各項都在合理範圍，可以跟別家做最後比價。' };
});

const talkPoints = computed(() => {
    const pts = [];
    const f = fee.value || 0;
    if (f > 3000) pts.push(`「開辦費 ${fmt(f)} 元比市場常見的 3,000 高，能不能減免或給零開辦專案？」`);
    if ((lockMonths.value || 0) > 12) pts.push(`「綁約 ${lockMonths.value} 個月太長，能不能縮到 12 個月或改不綁約？」`);
    if ((penalty.value || 0) > 3) pts.push(`「違約金 ${penalty.value}% 太高，市場常見 1%~3%，能調嗎？」`);
    if (!(apr.value > 0)) pts.push('「請提供總費用年百分率（APR），我要拿這個數字跟別家比。」');
    if (bundled.value) pts.push('「保險我要拆開單獨考慮，不要綁在貸款條件裡。」');
    if ((adRate.value || 0) > 0 && (adRate.value || 0) < 2) pts.push('「這個利率是首期優惠嗎？第 2 期起利率多少？」');
    return pts;
});

const fmt = (n) => {
    if (n == null || isNaN(n)) return '0';
    return Math.round(n).toLocaleString('zh-TW');
};

const clampNum = (v, min, max) => {
    if (v == null || isNaN(v) || v === '') return v;
    return Math.min(max, Math.max(min, v));
};
watch([amount, termMonths, adRate, apr, fee, lockMonths, penalty, inquiries], () => {
    if (amount.value != null) amount.value = clampNum(amount.value, 0, 10000);
    if (termMonths.value != null) termMonths.value = clampNum(termMonths.value, 1, 360);
    if (adRate.value != null) adRate.value = clampNum(adRate.value, 0, 20);
    if (apr.value != null) apr.value = clampNum(apr.value, 0, 20);
    if (fee.value != null) fee.value = clampNum(fee.value, 0, 1000000);
    if (lockMonths.value != null) lockMonths.value = clampNum(lockMonths.value, 0, 84);
    if (penalty.value != null) penalty.value = clampNum(penalty.value, 0, 20);
    if (inquiries.value != null) inquiries.value = clampNum(inquiries.value, 0, 50);
});
</script>
