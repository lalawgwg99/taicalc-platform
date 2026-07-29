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
          租金試算
        </button>
        <button 
          @click="activeTab = 'subsidy'"
          :class="['seg-btn', activeTab === 'subsidy' ? 'seg-btn-active' : '']"
        >
          租金補貼查詢
        </button>
      </div>

      <!-- Tab: Basic Calculator -->
      <div v-if="activeTab === 'basic'" class="calculator-shell">
        <div>
          <label for="monthlyRent" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            每個月租金 (NT$)
          </label>
          <div class="relative">
            <input
              id="monthlyRent"
              type="number"
              v-model.number="monthlyRent"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="depositMonths" class="block text-xs font-semibold text-stone-500 mb-2">押金 (月)</label>
            <input
              id="depositMonths"
              type="number"
              v-model.number="depositMonths"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label for="leaseMonths" class="block text-xs font-semibold text-stone-500 mb-2">預計租期 (月)</label>
            <input
              id="leaseMonths"
              type="number"
              v-model.number="leaseMonths"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="managementFee" class="block text-xs font-semibold text-stone-500 mb-2">管理費 (月)</label>
            <div class="relative">
              <input
                id="managementFee"
                type="number"
                v-model.number="managementFee"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
          <div>
            <label for="electricityFee" class="block text-xs font-semibold text-stone-500 mb-2">預估水電 (月)</label>
            <div class="relative">
              <input
                id="electricityFee"
                type="number"
                v-model.number="electricityFee"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <!-- 結果 -->
        <div class="calculator-subcard md:p-6">
          <div class="text-center mb-6">
            <p class="text-xs text-stone-500 font-bold uppercase tracking-wider mb-2">實際每月支出</p>
            <p class="text-4xl sm:text-5xl font-bold text-stone-800 font-mono tracking-tight">
              <span class="text-2xl text-stone-400 align-top mr-1">$</span>{{ actualMonthly }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-center pt-6 border-t border-stone-200">
            <div>
              <p class="text-xs text-stone-500 mb-1">押金總額 (暫存)</p>
              <p class="text-lg font-bold text-stone-700 font-mono">${{ depositTotal }}</p>
            </div>
            <div>
              <p class="text-xs text-stone-500 mb-1">押金機會成本</p>
              <p class="text-lg font-bold text-amber-600 font-mono">
                ${{ depositCost }}<span class="text-xs text-stone-400 font-normal">/年</span>
              </p>
            </div>
          </div>

          <div class="text-center pt-6 mt-6 border-t border-stone-200">
            <p class="text-xs text-stone-500 mb-2">整個租期總支出 ({{ leaseMonths }}個月)</p>
            <p class="text-2xl font-bold text-stone-800 font-mono">NT$ {{ totalCost }}</p>
          </div>
        </div>

        <div class="text-center bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p class="text-sm text-amber-800 font-medium">💡 知識點：押金機會成本以年化 2% 計算</p>
          <p class="text-xs text-amber-600/70 mt-1">這筆錢如果拿去定存或投資，每年本應產生的收益。</p>
        </div>
      </div>

      <!-- Tab: Subsidy Checker -->
      <div v-else-if="activeTab === 'subsidy'" class="calculator-shell">
         <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
             <div class="flex">
                 <div class="flex-shrink-0">
                     <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                         <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                     </svg>
                 </div>
                 <div class="ml-3">
                     <p class="text-sm text-blue-700">
                         根據 2026「300億元中央擴大租金補貼專案」第 3 級、主要行政區上限估算。實際資格與金額以政府核定為準。
                     </p>
                 </div>
             </div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                 <label class="block text-xs font-semibold text-stone-500 mb-2">居住縣市</label>
                 <select v-model="subsidyLocation" class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
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
                 <label class="block text-xs font-semibold text-stone-500 mb-2">身分條件 (加碼倍數)</label>
                 <select v-model="subsidyStatus" class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                     <option value="SingleL40">單身 (未滿40歲) [1.2倍]</option>
                     <option value="Single">單身 (40歲以上) [無加碼]</option>
                     <option value="Newlywed">2025 年底前結婚的新婚家庭 [1.3倍]</option>
                     <option value="Newlywed2026">2026 年起結婚的新婚家庭 [1.5倍]</option>
                     <option value="Child1">育有未成年子女 (1人) [1.4倍]</option>
                     <option value="Child2">育有未成年子女 (2人) [1.6倍]</option>
                     <option value="Child3">育有未成年子女 (3人+) [1.8倍]</option>
                     <option value="Baby2026_1">2026 年起新生兒 (1人) [2倍]</option>
                     <option value="Baby2026_2">2026 年起新生兒 (2人) [2.5倍]</option>
                     <option value="Baby2026_3">2026 年起新生兒 (3人) [3倍]</option>
                     <option value="LowIncome">中低收入戶 [1.4倍]</option>
                 </select>
             </div>
         </div>

         <div class="calculator-card-dark text-center">
             <div class="absolute top-0 right-0 p-4 opacity-10">
                 <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <p class="text-sm text-stone-400 mb-2">預估每月領取補貼</p>
             <p class="text-4xl font-bold text-brand-400 font-mono mb-2">NT$ {{ estimatedSubsidy }}</p>
             <p class="text-xs text-stone-500">補貼後實付房租：NT$ {{ (monthlyRent - parseInt(estimatedSubsidy.replace(/,/g,'')) > 0 ? monthlyRent - parseInt(estimatedSubsidy.replace(/,/g,'')) : 0).toLocaleString() }}</p>
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
    return Math.round(base * multi).toLocaleString();
});

// Basic Calcs
const actualMonthly = computed(() =>
  ((monthlyRent.value || 0) + (managementFee.value || 0) + (electricityFee.value || 0)).toLocaleString()
);
const depositTotal = computed(() => ((monthlyRent.value || 0) * (depositMonths.value || 0)).toLocaleString());
const depositCost = computed(() => {
  const deposit = (monthlyRent.value || 0) * (depositMonths.value || 0);
  return Math.round(deposit * 0.02).toLocaleString();
});
const totalCost = computed(() => {
  const monthly = (monthlyRent.value || 0) + (managementFee.value || 0) + (electricityFee.value || 0);
  return (monthly * (leaseMonths.value || 0)).toLocaleString();
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

// Persistence
onMounted(() => {
  const saved = localStorage.getItem('taicalc_rent_inputs');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.monthlyRent) monthlyRent.value = data.monthlyRent;
      if (data.depositMonths) depositMonths.value = data.depositMonths;
      if (data.leaseMonths) leaseMonths.value = data.leaseMonths;
      if (data.managementFee) managementFee.value = data.managementFee;
      if (data.electricityFee) electricityFee.value = data.electricityFee;
    } catch (e) {}
  }
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
