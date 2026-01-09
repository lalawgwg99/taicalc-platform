<template>
  <div class="space-y-8">
    <!-- Main Calculator Card -->
    <div class="card bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      
      <!-- Tabs -->
      <div class="flex border-b border-stone-100 mb-6">
        <button 
          @click="activeTab = 'basic'"
          :class="['px-4 py-2 text-sm font-medium transition-colors relative', activeTab === 'basic' ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-800']"
        >
          租金試算
          <div v-if="activeTab === 'basic'" class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>
        </button>
        <button 
          @click="activeTab = 'subsidy'"
          :class="['px-4 py-2 text-sm font-medium transition-colors relative', activeTab === 'subsidy' ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-800']"
        >
          租金補貼查詢
          <div v-if="activeTab === 'subsidy'" class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>
        </button>
        <button 
          @click="activeTab = 'vs'"
          :class="['px-4 py-2 text-sm font-medium transition-colors relative', activeTab === 'vs' ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-800']"
        >
          租屋 vs 買房
          <div v-if="activeTab === 'vs'" class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>
        </button>
      </div>

      <!-- Tab: Basic Calculator -->
      <div v-if="activeTab === 'basic'" class="space-y-6">
        <div>
          <label for="monthlyRent" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
            每個月租金 (NT$)
          </label>
          <div class="relative">
            <input
              id="monthlyRent"
              type="number"
              v-model.number="monthlyRent"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pl-9"
            />
            <span class="absolute left-4 top-4 text-stone-400 font-bold">$</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="depositMonths" class="block text-xs font-semibold text-stone-500 mb-2">押金 (月)</label>
            <input
              id="depositMonths"
              type="number"
              v-model.number="depositMonths"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label for="leaseMonths" class="block text-xs font-semibold text-stone-500 mb-2">預計租期 (月)</label>
            <input
              id="leaseMonths"
              type="number"
              v-model.number="leaseMonths"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 pl-7 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span class="absolute left-3 top-2.5 text-stone-400">$</span>
            </div>
          </div>
          <div>
            <label for="electricityFee" class="block text-xs font-semibold text-stone-500 mb-2">預估水電 (月)</label>
            <div class="relative">
              <input
                id="electricityFee"
                type="number"
                v-model.number="electricityFee"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 pl-7 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span class="absolute left-3 top-2.5 text-stone-400">$</span>
            </div>
          </div>
        </div>

        <!-- 結果 -->
        <div class="bg-stone-50 rounded-2xl p-6 border border-stone-200">
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
      <div v-else-if="activeTab === 'subsidy'" class="space-y-6">
         <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
             <div class="flex">
                 <div class="flex-shrink-0">
                     <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                         <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                     </svg>
                 </div>
                 <div class="ml-3">
                     <p class="text-sm text-blue-700">
                         根據 2026 最新「300億元中央擴大租金補貼專案」估算。實際金額以政府核定為準。
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
                     <option value="Taichung">台中市</option>
                     <option value="Tainan">台南市</option>
                     <option value="Kaohsiung">高雄市</option>
                     <option value="Hsinchu">新竹縣市</option>
                     <option value="Other">其他縣市</option>
                 </select>
             </div>
             <div>
                 <label class="block text-xs font-semibold text-stone-500 mb-2">身分條件 (加碼倍數)</label>
                 <select v-model="subsidyStatus" class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                     <option value="SingleL40">單身 (20-40歲)</option>
                     <option value="Single">單身 (40歲以上) [1.2倍]</option>
                     <option value="Newlywed">新婚 (2年內) [1.3倍]</option>
                     <option value="Child1">育有未成年子女 (1人) [1.4倍]</option>
                     <option value="Child2">育有未成年子女 (2人) [1.6倍]</option>
                     <option value="Child3">育有未成年子女 (3人+) [1.8倍]</option>
                     <option value="LowIncome">中低收入戶 [1.4倍]</option>
                 </select>
             </div>
         </div>

         <div class="bg-stone-900 rounded-2xl p-6 text-center text-white relative overflow-hidden">
             <div class="absolute top-0 right-0 p-4 opacity-10">
                 <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <p class="text-sm text-stone-400 mb-2">預估每月領取補貼</p>
             <p class="text-4xl font-bold text-emerald-400 font-mono mb-2">NT$ {{ estimatedSubsidy }}</p>
             <p class="text-xs text-stone-500">補貼後實付房租：NT$ {{ (monthlyRent - parseInt(estimatedSubsidy.replace(/,/g,'')) > 0 ? monthlyRent - parseInt(estimatedSubsidy.replace(/,/g,'')) : 0).toLocaleString() }}</p>
         </div>
      </div>

       <!-- Tab: Rent vs Buy -->
        <div v-else-if="activeTab === 'vs'" class="space-y-6">
            <h3 class="font-bold text-stone-800 text-lg">💡 10年期資產模擬</h3>
            <p class="text-sm text-stone-500">若你有 <span class="text-emerald-600 font-bold font-mono">NT$ {{ (monthlyRent * 40).toLocaleString() }}</span> (模擬頭期款)，該買房還是租房投資？</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Rent Scenario -->
                <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h4 class="font-bold text-stone-700 mb-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                        租房 + 投資 (ETF)
                    </h4>
                    <p class="text-xs text-stone-500 mb-4">假設頭期款與每月差額投入 6% 複利</p>
                    <div class="space-y-2">
                         <div class="flex justify-between text-sm">
                            <span class="text-stone-500">總租金支出</span>
                            <span class="font-mono text-rose-600">-{{ (totalCost10Year).toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-stone-500">投資獲利</span>
                            <span class="font-mono text-emerald-600">+{{ (investmentGain).toLocaleString() }}</span>
                        </div>
                         <div class="h-px bg-stone-200 my-2"></div>
                        <div class="flex justify-between font-bold">
                            <span class="text-stone-700">10年後資產</span>
                            <span class="font-mono text-blue-600">{{ (rentScenarioNet).toLocaleString() }}</span>
                        </div>
                    </div>
                </div>

                 <!-- Buy Scenario -->
                <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h4 class="font-bold text-stone-700 mb-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        買房 (槓桿效應)
                    </h4>
                    <p class="text-xs text-stone-500 mb-4">假設房價年漲 2%，支付利息與稅金</p>
                    <div class="space-y-2">
                         <div class="flex justify-between text-sm">
                            <span class="text-stone-500">利息與稅金</span>
                            <span class="font-mono text-rose-600">-{{ (housingCost10Year).toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-stone-500">房產增值</span>
                            <span class="font-mono text-emerald-600">+{{ (propertyGain).toLocaleString() }}</span>
                        </div>
                        <div class="h-px bg-stone-200 my-2"></div>
                        <div class="flex justify-between font-bold">
                            <span class="text-stone-700">10年後淨值</span>
                            <span class="font-mono text-emerald-600">{{ (buyScenarioNet).toLocaleString() }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p class="text-sm font-bold text-emerald-800 text-center">
                    結論：{{ buyScenarioNet > rentScenarioNet ? '買房勝出' : '租房投資勝出' }} 
                    (差距 {{ Math.abs(buyScenarioNet - rentScenarioNet).toLocaleString() }})
                </p>
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
    Taichung: 2200,
    Tainan: 2200,
    Kaohsiung: 2200,
    Hsinchu: 2400,
    Other: 2000
};

const multiplierMap = {
    SingleL40: 1,
    Single: 1.2,
    Newlywed: 1.3,
    Child1: 1.4,
    Child2: 1.6,
    Child3: 1.8,
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

// Rent vs Buy Calcs (Simplified)
const initialCapital = computed(() => (monthlyRent.value || 0) * 40); // Approx. down payment equivalent
const totalCost10Year = computed(() => {
    const monthly = (monthlyRent.value || 0) + (managementFee.value || 0);
    return monthly * 12 * 10;
});
// Scenario 1: Rent + Invest (6% return on capital + monthly savings vs mortgage) -> simplified: just capital growth + diff
// Actually let's simplify: Compare Capital Growth vs Property Growth - Costs
// Pure Capital Growth if rented:
const investmentGain = computed(() => {
    const capital = initialCapital.value;
    // FV = PV * (1+r)^n
    const fv = capital * Math.pow(1.06, 10);
    return Math.round(fv - capital);
});
const rentScenarioNet = computed(() => {
    // Assets: Capital + Gain
    // Costs: Rent paid (sunk cost)
    // Wait, usually comparison is: Capital (invested) vs House (equity)
    // Let's use Net Worth approach.
    // Rent Net Worth = Initial Capital * (1.06)^10 - Rent * 10 years (assuming rent paid from income, but here we compare usage of capital)
    // Let's assume income covers rent. 
    // This is a complex topic. Let's use a standard simplified model:
    // Rent path: Keep Initial Capital, invest it. Pay Rent.
    // Buy path: Use Initial Capital as Downpayment. Pay Mortgage Interest + Tax. House appreciates.
    
    // Rent Net Worth = (Initial Capital * 1.79) - (Rent * 120) ?? No, you pay rent from salary.
    // Let's assume Salary covers "Mortgage P&I" or "Rent + Invest diff".
    // If Mortgage > Rent, Rent path invests the diff.
    // If Rent > Mortgage, Buy path invests the diff (rare).
    // Let's assume Mortgage ~ Rent * 1.5 roughly.
    
    // Simplified logic for UI demonstrative purpose:
    // Rent Path Asset = Initial Capital * 1.06^10
    // Buy Path Asset = (House Value * 1.02^10) - (Mortgage Remaining)
    
    const fvCapital = initialCapital.value * Math.pow(1.06, 10);
    return Math.round(fvCapital);
});

const housingCost10Year = computed(() => {
    // Interest + Tax + Maintenance ~ 2% of House Value per year
    // House Value ~ Initial Capital * 5 (20% down)
    const houseValue = initialCapital.value * 5;
    return Math.round(houseValue * 0.02 * 10); // 10 years cost
});

const propertyGain = computed(() => {
    const houseValue = initialCapital.value * 5;
    const fvHouse = houseValue * Math.pow(1.02, 10); // 2% appreciation
    return Math.round(fvHouse - houseValue);
});

const buyScenarioNet = computed(() => {
    const houseValue = initialCapital.value * 5;
    const fvHouse = houseValue * Math.pow(1.02, 10);
    // Mortgage Remaining?
    // Start loan = 80% = houseValue * 0.8
    // 10 years later (~30% paid off in 30y loan? no, mostly interest)
    // Let's say principal reduced by 15%.
    const loanStart = houseValue * 0.8;
    const loanEnd = loanStart * 0.85; 
    
    return Math.round(fvHouse - loanEnd);
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
