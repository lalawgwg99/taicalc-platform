// TaiCalc：家電耗電比一比
// 輸入能源效率標示的「每年耗電量」（或功率＋時數換算），比較最多 3 台家電的年電費與 10 年總持有成本。
<template>
    <div class="calculator-shell space-y-4">

        <!-- 標章圖解 -->
        <details class="card-surface p-5">
            <summary class="text-sm font-bold text-ink-700 cursor-pointer">標章看不懂？點開圖解，30 秒找到要填的數字</summary>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-4">
                    <p class="text-[11px] font-bold text-ink-400 mb-2">能源效率標示長這樣（重點只有 2 個）</p>
                    <div class="rounded-lg bg-white border border-paper-300 p-3 space-y-2 text-sm">
                        <div class="rounded-lg bg-amber-100 border-2 border-amber-400 p-2.5 relative">
                            <p class="text-xs text-ink-400">每年耗電量</p>
                            <p class="text-xl font-black text-ink-700">約 <span class="text-brand-700">XXX</span> 度</p>
                            <span class="absolute -top-2.5 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                        </div>
                        <p class="text-[11px] text-ink-500"><strong>① 這個數字填進來</strong>，就是比電費用的年耗電量</p>
                        <div class="rounded-lg bg-paper-100 p-2.5 relative">
                            <p class="text-xs text-ink-400">能源效率等級</p>
                            <p class="text-lg font-black text-ink-700">第 <span class="text-brand-700">1</span> 級 <span class="text-xs font-normal text-ink-400">（1 最省 → 5 最耗電）</span></p>
                            <span class="absolute -top-2.5 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                        </div>
                        <p class="text-[11px] text-ink-500"><strong>② 等級只看排名</strong>，同級之間還是要比 ① 的數字才準</p>
                    </div>
                </div>
                <div class="text-sm space-y-2.5">
                    <p class="text-[11px] font-bold text-ink-400">名詞白話翻譯</p>
                    <div class="space-y-2 text-[13px] leading-relaxed text-ink-600">
                        <p><strong>CSPF</strong>（冷氣）：一整季平均多省電，數字越大越省。不用背，拿來比較兩台冷氣誰省電很好用。</p>
                        <p><strong>EER</strong>（冷氣）：瞬間效率，看看就好，買冷氣以 CSPF 和年耗電量為主。</p>
                        <p><strong>EF 值</strong>（冰箱／除濕機）：每用 1 度電能產生多少效果（冰箱是保冷公升數、除濕機是除濕公升數），越大越省。</p>
                        <p><strong>每年耗電量</strong>：實驗室標準條件測出來的全年用電度數。拿來<strong>比較兩台誰省電</strong>最公平；估自家電費則要再乘上你的使用習慣。</p>
                    </div>
                </div>
            </div>
        </details>

        <!-- 共用：電價 -->
        <div class="card-surface p-5">
            <label for="fld-price" class="block text-xs font-medium text-ink-400 mb-1.5">平均每度電價（元/度）</label>
            <input id="fld-price" type="text" inputmode="decimal" v-model.number="pricePerKwh" aria-label="平均每度電價"
                class="input-clean text-xl font-semibold tabular-nums" placeholder="4.0">
            <p class="mt-2 text-[11px] text-ink-400">不知道填多少？看自家電費帳單「總金額 ÷ 總度數」，一般家庭約 3～5 元。想精算可用<a href="/tools/electricity-calculator" class="underline">電費計算機</a>。</p>
        </div>

        <!-- 三台輸入 -->
        <div class="grid gap-3 lg:grid-cols-3">
            <div v-for="(app, i) in apps" :key="i" class="card-surface p-5 space-y-3"
                :class="{ 'ring-2 ring-brand-500': championIdx === i && hasResult }">
                <div class="flex items-center justify-between">
                    <input v-model="app.name" :aria-label="`家電${i + 1}名稱`"
                        class="input-clean text-base font-bold w-2/3" :placeholder="`A款家電`">
                    <span v-if="championIdx === i && hasResult"
                        class="text-[11px] font-bold text-white bg-brand-600 rounded-full px-2.5 py-1">最省</span>
                </div>

                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">這台是什麼家電？</label>
                    <div class="grid grid-cols-3 gap-1.5">
                        <button v-for="t in appTypes" :key="t.id" type="button" @click="app.type = t.id"
                            :aria-pressed="app.type === t.id"
                            class="py-2 px-1 rounded-xl border text-xs font-semibold transition-all"
                            :class="app.type === t.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-paper-300 bg-white text-ink-500'">
                            {{ t.label }}
                        </button>
                    </div>
                    <div v-if="typeGuide(app.type)" class="mt-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5">
                        <p class="text-[12px] leading-relaxed text-ink-600">{{ typeGuide(app.type) }}</p>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">能源效率等級（選填）</label>
                    <select v-model="app.level" class="input-clean text-sm" :aria-label="`家電${i + 1}能源效率等級`">
                        <option value="">未標示 / 不知道</option>
                        <option value="1">第 1 級（最省電）</option>
                        <option value="2">第 2 級</option>
                        <option value="3">第 3 級</option>
                        <option value="4">第 4 級</option>
                        <option value="5">第 5 級（最耗電）</option>
                    </select>
                </div>

                <div>
                    <div class="flex rounded-xl border border-paper-300 overflow-hidden mb-2">
                        <button @click="app.mode = 'label'" :aria-pressed="app.mode === 'label'"
                            class="flex-1 py-2 text-xs font-semibold transition-all"
                            :class="app.mode === 'label' ? 'bg-brand-600 text-white' : 'bg-white text-ink-400'">標示年耗電量</button>
                        <button @click="app.mode = 'power'" :aria-pressed="app.mode === 'power'"
                            class="flex-1 py-2 text-xs font-semibold transition-all"
                            :class="app.mode === 'power' ? 'bg-brand-600 text-white' : 'bg-white text-ink-400'">功率換算</button>
                    </div>
                    <div v-if="app.mode === 'label'">
                        <label class="block text-xs font-medium text-ink-400 mb-1.5">每年耗電量（度/年）</label>
                        <input type="text" inputmode="decimal" v-model.number="app.labelKwh"
                            :aria-label="`家電${i + 1}每年耗電量`" placeholder="例：900"
                            class="input-clean text-lg font-semibold tabular-nums">
                        <p class="mt-1 text-[10px] text-ink-400">標示左上角「每年耗電量 約XXX度」那個數字</p>
                    </div>
                    <div v-else class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs font-medium text-ink-400 mb-1.5">額定功率（W）</label>
                            <input type="text" inputmode="decimal" v-model.number="app.watts"
                                :aria-label="`家電${i + 1}額定功率`" placeholder="例：800"
                                class="input-clean text-lg font-semibold tabular-nums">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-ink-400 mb-1.5">每天用幾小時</label>
                            <input type="text" inputmode="decimal" v-model.number="app.hours"
                                :aria-label="`家電${i + 1}每天使用時數`" placeholder="例：8"
                                class="input-clean text-lg font-semibold tabular-nums">
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-medium text-ink-400 mb-1.5">售價（元，選填）</label>
                    <input type="text" inputmode="decimal" v-model.number="app.price"
                        :aria-label="`家電${i + 1}售價`" placeholder="例：32000"
                        class="input-clean text-lg font-semibold tabular-nums">
                    <p class="mt-1 text-[10px] text-ink-400">填了才能比「10 年總持有成本」</p>
                </div>
            </div>
        </div>

        <!-- 比較結果 -->
        <div v-if="hasResult" class="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm space-y-4">
            <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider">比較結果</p>
            <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse min-w-[520px]">
                    <thead>
                        <tr class="border-b border-paper-300 text-left text-ink-400">
                            <th class="py-2 pr-3 font-medium">項目</th>
                            <th v-for="(app, i) in validApps" :key="i" class="py-2 pr-3 font-semibold text-ink-700">
                                {{ app.name || `第${i + 1}台` }}{{ app.level ? `（${app.level}級）` : '' }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-paper-200 text-ink-600 tabular-nums">
                        <tr>
                            <td class="py-2 pr-3 text-ink-400">年耗電量</td>
                            <td v-for="(r, i) in results" :key="i" class="py-2 pr-3">{{ fmt(r.kwh) }} 度</td>
                        </tr>
                        <tr>
                            <td class="py-2 pr-3 text-ink-400">年電費</td>
                            <td v-for="(r, i) in results" :key="i" class="py-2 pr-3 font-bold text-ink-700">$ {{ fmt(r.yearCost) }}</td>
                        </tr>
                        <tr>
                            <td class="py-2 pr-3 text-ink-400">10 年電費</td>
                            <td v-for="(r, i) in results" :key="i" class="py-2 pr-3">$ {{ fmt(r.tenYearCost) }}</td>
                        </tr>
                        <tr v-if="anyPrice">
                            <td class="py-2 pr-3 text-ink-400">10 年總成本（含售價）</td>
                            <td v-for="(r, i) in results" :key="i" class="py-2 pr-3 font-bold"
                                :class="totalChampionIdx === i ? 'text-brand-700' : ''">
                                {{ r.hasPrice ? `$ ${fmt(r.totalCost)}` : '—' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="rounded-xl bg-paper-100 p-4 space-y-1.5">
                <p v-for="(line, i) in insights" :key="i" class="text-sm leading-relaxed text-ink-600">{{ line }}</p>
            </div>
            <p class="text-[10px] text-ink-400">估算說明：年耗電量來自標示值或功率換算；電費＝年耗電 × 平均每度電價，未計入台電累進級距與夏月加價，實際以帳單為準。</p>
        </div>
        <div v-else class="rounded-2xl border border-dashed border-paper-300 p-6 text-center">
            <p class="text-sm text-ink-400">在上方輸入至少一台家電的年耗電量（或功率＋時數），就會自動開始比較。</p>
        </div>

        <!-- 相關工具 -->
        <div class="flex gap-2">
            <a href="/tools/electricity-calculator"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-brand-100">
                精算整戶電費：電費計算機
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const pricePerKwh = ref(4.0);

const appTypes = [
    { id: 'ac', label: '冷氣' },
    { id: 'fridge', label: '冰箱' },
    { id: 'dehumid', label: '除濕機' },
    { id: 'tv', label: '電視' },
    { id: 'washer', label: '洗衣機' },
    { id: 'other', label: '其他' },
];

const typeGuides = {
    ac: '看標章左上角「每年耗電量 約XXX度」，把 XXX 填進下面。只看到 CSPF？數字越大越省，兩台都填年耗電量來比最準。',
    fridge: '看標章左上角「每年耗電量 約XXX度」，把 XXX 填進下面。冰箱 24 小時運轉，這個數字直接比最公平。',
    dehumid: '看標章的「能源因數值（EF）」，是每度電能除幾公升水，越大越省。下方直接填年耗電量來比電費也行。',
    tv: '看標章左上角「每年耗電量 約XXX度」，把 XXX 填進下面。',
    washer: '看標章左上角「每年耗電量 約XXX度」，把 XXX 填進下面。',
    other: '找標章或銘板上的「每年耗電量」或「消耗功率（W）」，填進下面對應欄位。',
};
const typeGuide = (type) => typeGuides[type] || '';

const blankApp = (name) => ({ name, type: '', level: '', mode: 'label', labelKwh: null, watts: null, hours: null, price: null });
const apps = ref([
    Object.assign(blankApp('A款：變頻冷氣'), { type: 'ac', level: '1', labelKwh: 900, price: 35000 }),
    Object.assign(blankApp('B款：定頻冷氣'), { type: 'ac', level: '3', labelKwh: 1500, price: 26000 }),
    blankApp('C款'),
]);

const yearlyKwh = (app) => {
    if (app.mode === 'power') {
        const w = Math.max(0, app.watts || 0), h = Math.max(0, app.hours || 0);
        return w * h * 365 / 1000;
    }
    return Math.max(0, app.labelKwh || 0);
};

const results = computed(() => apps.value.map((app) => {
    const kwh = yearlyKwh(app);
    const yearCost = kwh * Math.max(0, pricePerKwh.value || 0);
    const tenYearCost = yearCost * 10;
    const hasPrice = (app.price || 0) > 0;
    return { kwh, yearCost, tenYearCost, hasPrice, totalCost: hasPrice ? (app.price || 0) + tenYearCost : null };
}));

const validApps = computed(() => apps.value.filter((_, i) => results.value[i].kwh > 0));
const validResults = computed(() => results.value.filter((r) => r.kwh > 0));
const hasResult = computed(() => validResults.value.length > 0);
const anyPrice = computed(() => validResults.value.some((r) => r.hasPrice));

const championIdx = computed(() => {
    if (!hasResult.value) return -1;
    let bi = 0;
    validResults.value.forEach((r, i) => { if (r.yearCost < validResults.value[bi].yearCost) bi = i; });
    // 映射回 apps 索引
    const validIdx = apps.value.map((_, i) => i).filter((i) => results.value[i].kwh > 0);
    return validIdx[bi];
});

const totalChampionIdx = computed(() => {
    const priced = validResults.value.map((r, i) => ({ r, i })).filter(({ r }) => r.hasPrice);
    if (priced.length < 2) return -1;
    let best = priced[0];
    priced.forEach(({ r, i }) => { if (r.totalCost < best.r.totalCost) best = { r, i }; });
    const validIdx = apps.value.map((_, i) => i).filter((i) => results.value[i].kwh > 0);
    return validIdx[best.i];
});

const insights = computed(() => {
    const lines = [];
    const vs = validResults.value;
    if (vs.length === 0) return lines;
    const names = apps.value.filter((_, i) => results.value[i].kwh > 0).map((a, i) => a.name || `第${i + 1}台`);
    if (vs.length >= 2) {
        const costs = vs.map((r) => r.yearCost);
        const diff = Math.max(...costs) - Math.min(...costs);
        lines.push(`一年電費最多差 $ ${fmt(diff)} 元，10 年就差 $ ${fmt(diff * 10)} 元——買的時候多比一下，長期差很多。`);
    }
    // 回本分析：找「買得貴但用得省」vs「買得便宜但用得貴」的組合
    const priced = vs.map((r, i) => ({ r, i })).filter(({ r }) => r.hasPrice);
    if (priced.length >= 2) {
        const sorted = [...priced].sort((a, b) => a.r.totalCost - b.r.totalCost);
        const win = sorted[0], lose = sorted[sorted.length - 1];
        if (win.r.totalCost < lose.r.totalCost) {
            const wName = names[win.i], lName = names[lose.i];
            const priceDiff = (apps.value.filter((_, ai) => results.value[ai].kwh > 0)[lose.i].price || 0)
                - (apps.value.filter((_, ai) => results.value[ai].kwh > 0)[win.i].price || 0);
            const yearSave = lose.r.yearCost - win.r.yearCost;
            if (yearSave > 0 && priceDiff > 0) {
                const payback = priceDiff / yearSave;
                lines.push(`${wName}雖然當初貴 $ ${fmt(priceDiff)} 元，但每年電費省 $ ${fmt(yearSave)} 元，約 ${payback.toFixed(1)} 年回本，10 年總成本反而少 $ ${fmt(lose.r.totalCost - win.r.totalCost)} 元。`);
            } else if (yearSave > 0) {
                lines.push(`${wName}買得便宜、用得又省，10 年總成本比${lName}少 $ ${fmt(lose.r.totalCost - win.r.totalCost)} 元，不用猶豫。`);
            }
        }
    }
    const maxKwh = Math.max(...vs.map((r) => r.kwh));
    if (maxKwh > 0) {
        const idx = vs.findIndex((r) => r.kwh === maxKwh);
        lines.push(`${names[idx]}一年用 ${fmt(maxKwh)} 度電，約占小家庭年用電（約 3,600 度）的 ${Math.round(maxKwh / 3600 * 100)}%。`);
    }
    return lines;
});

const fmt = (n) => {
    if (n == null || isNaN(n)) return '0';
    return Math.round(n).toLocaleString('zh-TW');
};

const clampNum = (v, min, max) => {
    if (v == null || isNaN(v)) return v;
    return Math.min(max, Math.max(min, v));
};
watch(pricePerKwh, (v) => { pricePerKwh.value = clampNum(v, 0, 15) ?? 4.0; });
watch(apps, () => {
    apps.value.forEach((app) => {
        app.labelKwh = clampNum(app.labelKwh, 0, 100000);
        app.watts = clampNum(app.watts, 0, 100000);
        app.hours = clampNum(app.hours, 0, 24);
        app.price = clampNum(app.price, 0, 10000000);
    });
}, { deep: true });
</script>
