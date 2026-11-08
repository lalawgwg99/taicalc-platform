<template>
  <div class="calculator-shell">
    <!-- Main Calculator Card -->
    <div class="calculator-card">
      
      <!-- Tabs -->
      <div class="seg-control mb-6">
        <button 
          @click="activeTab = 'basic'"
          :class="['seg-btn', activeTab === 'basic' ? 'seg-btn-active' : '']"
        >
          試算
        </button>
        <button 
          @click="activeTab = 'subsidy'"
          :class="['seg-btn', activeTab === 'subsidy' ? 'seg-btn-active' : '']"
        >
          補貼查詢
        </button>
      </div>

      <!-- Tab: Basic Calculator -->
      <div v-if="activeTab === 'basic'">
        <div>
          <label for="monthlyRent" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
            每個月租金 (NT$)
          </label>
          <div class="relative">
            <input
              id="monthlyRent"
              type="text" inputmode="decimal"
              v-model.number="monthlyRent"
              class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="depositMonths" class="block text-xs font-semibold text-ink-400 mb-2">押金 (月)</label>
            <input
              id="depositMonths"
              type="text" inputmode="decimal"
              v-model.number="depositMonths"
              class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label for="leaseMonths" class="block text-xs font-semibold text-ink-400 mb-2">預計租期 (月)</label>
            <input
              id="leaseMonths"
              type="text" inputmode="decimal"
              v-model.number="leaseMonths"
              class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="managementFee" class="block text-xs font-semibold text-ink-400 mb-2">管理費 (月)</label>
            <div class="relative">
              <input
                id="managementFee"
                type="text" inputmode="decimal"
                v-model.number="managementFee"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
          <div>
            <label for="electricityFee" class="block text-xs font-semibold text-ink-400 mb-2">預估水電 (月)</label>
            <div class="relative">
              <input
                id="electricityFee"
                type="text" inputmode="decimal"
                v-model.number="electricityFee"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <!-- 結果 -->
        <div class="calculator-subcard md:p-6">
          <div class="text-center mb-6">
            <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">實際每月支出</p>
            <p class="text-4xl sm:text-5xl font-bold text-ink-800 font-mono tracking-tight">
              <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ actualMonthly }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-center pt-6 border-t border-ink-100">
            <div>
              <p class="text-xs text-ink-400 mb-1">押金總額（會退回）</p>
              <p class="text-lg font-bold text-ink-600 font-mono whitespace-nowrap">${{ depositTotal }}</p>
            </div>
            <div>
              <p class="text-xs text-ink-400 mb-1">押金少賺的利息</p>
              <p class="text-lg font-bold text-amber-600 font-mono whitespace-nowrap">
                ${{ depositCost }}<span class="text-xs text-ink-400 font-normal">/年</span>
              </p>
            </div>
          </div>

          <div class="text-center pt-6 mt-6 border-t border-ink-100">
            <p class="text-xs text-ink-400 mb-2">整個租期總支出 ({{ leaseMonths }}個月)</p>
            <p class="text-2xl font-bold text-ink-800 font-mono whitespace-nowrap">NT${{ totalCost }}</p>
          </div>

          <div class="text-center pt-4 mt-4 border-t border-ink-100">
            <p class="text-xs text-ink-400 mb-2">入住首月總支出（當月支出＋押金）</p>
            <p class="text-2xl font-bold text-ink-800 font-mono whitespace-nowrap">NT${{ firstMonthTotal }}</p>
          </div>
        </div>

        <div class="text-center bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p class="text-sm text-amber-800 font-medium">小知識：押金少賺的利息以年化 1.7% 計算</p>
          <p class="text-xs text-amber-600/70 mt-1">這筆錢如果拿去定存或投資，每年本應產生的收益。</p>
        </div>
      </div>

      <!-- Tab: Subsidy Checker -->
      <div v-else-if="activeTab === 'subsidy'">
         <div class="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-r-xl">
             <div class="flex">
                 <div class="flex-shrink-0">
                     <svg class="h-5 w-5 text-brand-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                         <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                     </svg>
                 </div>
                 <div class="ml-3">
                     <p class="text-sm text-brand-700">
                         依 2026 年 300 億租金補貼專案第 3 級上限估算，金額以政府核定為準。
                     </p>
                     <details class="mt-2">
                         <summary class="text-xs text-brand-700 cursor-pointer">116 年度新制</summary>
                         <p class="text-sm text-brand-700 mt-1">新戶受理期間為 2027/1/1 09:00 至 12/31 17:00（預計 74 萬戶）；115/8/31 前已核定之舊戶自動帶入；租約異動請於 3 個月內補件。金額以國土管理署最新公告為準。</p>
                     </details>
                 </div>
             </div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                 <label for="fld-dcb95277" class="block text-xs font-semibold text-ink-400 mb-2">居住縣市</label>
                 <select id="fld-dcb95277" v-model="subsidyLocation" class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                     <option value="Taipei">台北市</option>
                     <option value="NewTaipei">新北市</option>
                     <option value="Taoyuan">桃園市</option>
                     <option value="Taichung">台中市主要行政區</option>
                     <option value="Tainan">台南市主要行政區</option>
                     <option value="Kaohsiung">高雄市主要行政區</option>
                     <option value="Hsinchu">新竹縣市</option>
                     <option value="Other">其他縣市</option>
                 </select>
             </div>
             <div>
                 <label for="fld-90c33dda" class="block text-xs font-semibold text-ink-400 mb-2">身分條件 (加碼倍數)</label>
                 <select id="fld-90c33dda" v-model="subsidyStatus" class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                     <option value="SingleL40">單身未滿 40 歲・1.2 倍</option>
                     <option value="Single">單身 40 歲以上・無加碼</option>
                     <option value="Newlywed">2025 年底前結婚・1.3 倍</option>
                     <option value="Newlywed2026">2026 年起結婚・1.5 倍</option>
                     <option value="Child1">未成年子女 1 人・1.4 倍</option>
                     <option value="Child2">未成年子女 2 人・1.6 倍</option>
                     <option value="Child3">未成年子女 3 人以上・1.8 倍</option>
                     <option value="Baby2026_1">2026 年起新生兒 1 人・2 倍</option>
                     <option value="Baby2026_2">2026 年起新生兒 2 人・2.5 倍</option>
                     <option value="Baby2026_3">2026 年起新生兒 3 人・3 倍</option>
                     <option value="LowIncome">中低收入戶・1.4 倍</option>
                 </select>
             </div>
         </div>

         <div v-if="hasValidRent" class="calculator-card-dark text-center">
             <div class="absolute top-0 right-0 p-4 opacity-10">
                 <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <p class="text-base text-paper-200 mb-2">預估每月領取補貼</p>
             <p class="text-4xl font-bold text-brand-400 font-mono mb-2 whitespace-nowrap">NT${{ estimatedSubsidy }}</p>
             <p class="text-sm text-paper-200 whitespace-nowrap">補貼後實付房租：NT${{ (monthlyRent - parseInt(estimatedSubsidy.replace(/,/g,'')) > 0 ? monthlyRent - parseInt(estimatedSubsidy.replace(/,/g,'')) : 0).toLocaleString() }}</p>
         </div>
         <div v-else class="text-center bg-paper-50 border border-ink-100 rounded-xl p-6">
             
             <p class="text-sm text-ink-600 font-medium">還沒輸入月租</p>
             <p class="text-xs text-ink-400 mt-1">先到「租金試算」分頁填入每月租金，就能看到預估補貼金額。</p>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const activeTab = ref('basic');
const monthlyRent = ref(15000);
const depositMonths = ref(2); 
const leaseMonths = ref(12); // Default 1 year
const managementFee = ref(1000);
const electricityFee = ref(1000);

// Subsidy Logic
const subsidyLocation = ref('Taipei');
const subsidyStatus = ref('SingleL40');

const baseSubsidyMap = {
    Taipei: 3000,
    NewTaipei: 2400,
    Taoyuan: 2400,
    Taichung: 2400,
    Tainan: 2200,
    Kaohsiung: 2200,
    Hsinchu: 2400,
    Other: 2000
};

const multiplierMap = {
    SingleL40: 1.2,
    Single: 1,
    Newlywed: 1.3,
    Newlywed2026: 1.5,
    Child1: 1.4,
    Child2: 1.6,
    Child3: 1.8,
    Baby2026_1: 2,
    Baby2026_2: 2.5,
    Baby2026_3: 3,
    LowIncome: 1.4
};

const estimatedSubsidy = computed(() => {
    const base = baseSubsidyMap[subsidyLocation.value] || 2000;
    const multi = multiplierMap[subsidyStatus.value] || 1;
    const raw = Math.round(base * multi);
    // 補貼金額以實際租金為上限（核實補貼原則）；未填月租時不顯示（見 hasValidRent）
    const rent = Number(monthlyRent.value);
    const capped = Number.isFinite(rent) && rent > 0 ? Math.min(raw, rent) : raw;
    return capped.toLocaleString();
});

// 月租未填／0／非數字時，補貼分頁不顯示幽靈投影
const hasValidRent = computed(() => {
    const rent = Number(monthlyRent.value);
    return Number.isFinite(rent) && rent > 0;
});

// Basic Calcs
const actualMonthly = computed(() =>
  ((monthlyRent.value || 0) + (managementFee.value || 0) + (electricityFee.value || 0)).toLocaleString()
);
const depositTotal = computed(() => ((monthlyRent.value || 0) * (depositMonths.value || 0)).toLocaleString());
const depositCost = computed(() => {
  const deposit = (monthlyRent.value || 0) * (depositMonths.value || 0);
  return Math.round(deposit * 0.017).toLocaleString();
});
const totalCost = computed(() => {
  const monthly = (monthlyRent.value || 0) + (managementFee.value || 0) + (electricityFee.value || 0);
  return (monthly * (leaseMonths.value || 0)).toLocaleString();
});
const firstMonthTotal = computed(() => {
  const monthly = (monthlyRent.value || 0) + (managementFee.value || 0) + (electricityFee.value || 0);
  const deposit = (monthlyRent.value || 0) * (depositMonths.value || 0);
  return (monthly + deposit).toLocaleString();
});

// Auto-save for Dashboard
watch(actualMonthly, (newVal) => {
  const val = parseInt(newVal.replace(/,/g, ''));
  if (val > 0) {
    localStorage.setItem('taicalc_rent_monthly', val);
  } else {
    localStorage.removeItem('taicalc_rent_monthly');
  }
});

// 輸入防呆：localStorage 可能殘留異常值（如 999999999 個月），
// 或使用者手打超大數字；租期、押金月數一律箝制在合理範圍。
const clampNum = (v, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
};

// Persistence
onMounted(() => {
  const saved = localStorage.getItem('taicalc_rent_inputs');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.monthlyRent) monthlyRent.value = clampNum(data.monthlyRent, 0, 100000000);
      if (data.depositMonths != null) depositMonths.value = clampNum(data.depositMonths, 0, 12);
      if (data.leaseMonths) leaseMonths.value = clampNum(data.leaseMonths, 1, 120);
      if (data.managementFee) managementFee.value = clampNum(data.managementFee, 0, 100000000);
      if (data.electricityFee) electricityFee.value = clampNum(data.electricityFee, 0, 100000000);
    } catch (e) {}
  }
});

// 手打超大數字即時箝制（清空欄位時不干預，讓使用者能重新輸入）
watch(leaseMonths, (v) => {
  if (v === '' || v == null) return;
  const n = Number(v);
  if (!Number.isFinite(n)) return;
  const c = Math.min(120, Math.max(1, Math.round(n)));
  if (c !== n) leaseMonths.value = c;
});
watch(depositMonths, (v) => {
  if (v === '' || v == null) return;
  const n = Number(v);
  if (!Number.isFinite(n)) return;
  const c = Math.min(12, Math.max(0, n));
  if (c !== n) depositMonths.value = c;
});

watch(
  [monthlyRent, depositMonths, leaseMonths, managementFee, electricityFee],
  (vals) => {
    localStorage.setItem(
      'taicalc_rent_inputs',
      JSON.stringify({
        monthlyRent: vals[0],
        depositMonths: vals[1],
        leaseMonths: vals[2],
        managementFee: vals[3],
        electricityFee: vals[4],
      })
    );
  }
);
</script>
