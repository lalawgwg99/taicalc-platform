<template>
  <div class="max-w-4xl mx-auto space-y-8">
    
    <!-- 1. 客戶資料頭 -->
    <div class="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-stone-200">
         <div class="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
            <h1 class="text-2xl font-bold text-stone-900">冷氣安裝估價單</h1>
            <div class="text-right">
                <span class="block text-xs uppercase text-stone-400 font-bold tracking-wider">估價日期</span>
                <span class="text-lg font-mono text-stone-600 font-bold">{{ today }}</span>
            </div>
         </div>
         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                 <label class="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">客戶名稱</label>
                 <input 
                    v-model="customerName" 
                    type="text" 
                    placeholder="例如：陳先生 / 新北中和"
                    class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                 />
             </div>
             <div>
                 <label class="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">基本安裝費 (台)</label>
                 <div class="relative">
                     <span class="absolute left-4 top-3.5 text-stone-400 font-bold">$</span>
                     <input 
                        v-model.number="baseInstallFee" 
                        type="number" 
                        class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pl-9 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                     />
                 </div>
             </div>
         </div>
    </div>

    <!-- 2. 材料明細 -->
    <div class="card bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div class="bg-stone-50 px-8 py-4 border-b border-stone-200 flex justify-between items-center">
            <h2 class="font-bold text-stone-800 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                材料與施工明細
            </h2>
             <span class="text-xs text-stone-500 bg-white px-2 py-1 rounded border border-stone-200">自動計算耗損</span>
        </div>
        
        <div class="p-4 md:p-8 space-y-8">
            <!-- 銅管 -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div class="md:col-span-4">
                     <label class="block text-xs font-bold text-stone-500 mb-2">銅管規格</label>
                     <select v-model="specPair" class="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-stone-800 font-bold focus:border-emerald-500 outline-none">
                        <option value="2-3">2 分 / 3 分</option>
                        <option value="2-4">2 分 / 4 分</option>
                        <option value="2-5">2 分 / 5 分</option>
                        <option value="3-5">3 分 / 5 分</option>
                        <option value="3-6">3 分 / 6 分</option>
                        <option value="4-6">4 分 / 6 分</option>
                    </select>
                </div>
                 <div class="md:col-span-4">
                     <label class="block text-xs font-bold text-stone-500 mb-2">拉線長度 (米)</label>
                     <div class="flex items-center gap-2">
                         <button @click="pathM = Math.max(0, pathM - 1)" class="w-10 h-10 rounded-lg border border-stone-200 hover:bg-stone-50 font-bold text-stone-600">-</button>
                         <input v-model.number="pathM" type="number" class="w-full text-center font-bold text-lg border-b-2 border-stone-100 focus:border-emerald-500 outline-none py-1" />
                         <button @click="pathM++" class="w-10 h-10 rounded-lg border border-stone-200 hover:bg-stone-50 font-bold text-stone-600">+</button>
                     </div>
                </div>
                <div class="md:col-span-4 text-right">
                     <label class="block text-xs font-bold text-stone-400 mb-1">銅管小計</label>
                     <div class="text-xl font-mono font-bold text-stone-800">${{ copperCost.toLocaleString() }}</div>
                     <div class="text-[10px] text-stone-400">含彎頭耗損 {{ displayTotalLen }}m</div>
                </div>
            </div>

            <div class="h-px bg-stone-100"></div>

             <!-- 線材與其他 -->
             <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div>
                    <label class="block text-xs font-bold text-stone-500 mb-2">訊號線 (式/米)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2.5 text-stone-400 text-xs">$</span>
                        <input v-model.number="priceSig" type="number" class="w-full bg-stone-50 rounded-lg pl-6 pr-3 py-2 text-sm font-bold border-transparent focus:bg-white focus:border-emerald-500 border transition-all" />
                    </div>
                 </div>
                 <div>
                    <label class="block text-xs font-bold text-stone-500 mb-2">電源線 (式/米)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2.5 text-stone-400 text-xs">$</span>
                        <input v-model.number="pricePwr" type="number" class="w-full bg-stone-50 rounded-lg pl-6 pr-3 py-2 text-sm font-bold border-transparent focus:bg-white focus:border-emerald-500 border transition-all" />
                    </div>
                 </div>
                 <div>
                    <label class="block text-xs font-bold text-stone-500 mb-2">排水/保溫 (式)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2.5 text-stone-400 text-xs">$</span>
                        <input v-model.number="priceInsu" type="number" class="w-full bg-stone-50 rounded-lg pl-6 pr-3 py-2 text-sm font-bold border-transparent focus:bg-white focus:border-emerald-500 border transition-all" />
                    </div>
                 </div>
             </div>

             <!-- 特殊項目 -->
              <div v-if="gasAdded" class="bg-amber-50 rounded-xl p-4 border border-amber-100 flex justify-between items-center">
                  <div class="flex items-center gap-3">
                      <span class="bg-amber-200 text-amber-800 text-[10px] font-bold px-2 py-1 rounded">超長追加</span>
                      <span class="text-sm text-amber-900 font-medium">冷媒補重 {{ gasExtraG }}g</span>
                  </div>
                  <span class="font-mono font-bold text-amber-700">+${{ gasCost.toLocaleString() }}</span>
              </div>
        </div>
    </div>
    
    <!-- 3. 危險施工與其他 -->
    <div class="card bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-stone-200">
        <button @click="showExtra = !showExtra" class="flex items-center justify-between w-full group">
            <h2 class="font-bold text-stone-800 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-emerald-500 transition-colors"></span>
                其他費用 (危險施工/洗洞/架子)
            </h2>
            <span class="text-stone-400 text-sm group-hover:text-stone-600 transition-colors">{{ showExtra ? '收起' : '展開' }}</span>
        </button>
        
        <div v-show="showExtra" class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div v-for="(item, idx) in extraItems" :key="idx" class="flex gap-2">
                 <input v-model="item.name" type="text" placeholder="項目名稱" class="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
                 <input v-model.number="item.price" type="number" placeholder="$" class="w-24 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-right font-mono" />
                 <button @click="removeExtraItem(idx)" class="text-stone-400 hover:text-rose-500 px-2">×</button>
             </div>
             <button @click="addExtraItem" class="text-sm text-emerald-600 font-bold border border-dashed border-emerald-200 rounded-lg py-2 hover:bg-emerald-50 transition-colors">
                 + 新增項目
             </button>
        </div>
    </div>

    <!-- 總計與操作 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 md:static md:shadow-none md:border-0 md:bg-transparent md:p-0">
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             <div class="text-center md:text-left">
                 <div class="text-xs text-stone-500 font-bold uppercase tracking-wider mb-1">預估總報價</div>
                 <div class="text-3xl font-bold text-stone-900 font-mono tracking-tight">${{ totalQuote.toLocaleString() }}</div>
             </div>
             
             <div class="flex gap-3 w-full md:w-auto">
                 <button @click="resetForm" class="flex-1 md:flex-none px-6 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors">
                     重置為預設
                 </button>
                 <button @click="copyQuote" class="flex-1 md:flex-none px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                     <span v-if="copyStatus === 'idle'">📋 複製報價單</span>
                     <span v-else>✓ 已複製！</span>
                 </button>
             </div>
        </div>
    </div>
    <div class="h-20 md:h-0"></div><!-- Spacer for fixed bottom -->

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const today = new Date().toLocaleDateString('zh-TW');
const customerName = ref('');
const baseInstallFee = ref(3500);

// Spec
const specPair = ref('2-3');
const pathM = ref(5);
const bends = ref(2); // hidden simplified logic? No, keep logic but maybe simplify UI. Let's keep internal vars.
const perBendCm = 10;
const wasteRate = 0.1;

// Costs
// Unit price per meter for copper
const copperPricePerM = 300; // Simplified default. Or keep advanced? User wanted "Quote Style". Let's assume standard pricing to keep UI clean, or allow edit?
// Let's stick to previous logic but better default UX.
const boxLen = ref(30);
const priceKit = ref(6000); // 2026 inflation?

const priceSig = ref(500);
const pricePwr = ref(800);
const priceInsu = ref(300);

// Gas
const gasLimit = ref(7);
const gasRate = ref(20);
const gasPrice = ref(3);

// Extras
const showExtra = ref(false);
const extraItems = ref([
    { name: '室外機安裝架 (A架)', price: 1500 },
    { name: '危險施工加給', price: 0 }
]);

const copyStatus = ref('idle');

// Calculations
const displayTotalLen = computed(() => {
    // Hidden logic for bends (default 2 bends usually)
    const len = pathM.value * (1 + wasteRate) + (2 * 0.1) + (2 * 0.2); // + bends + ends
    return len.toFixed(1);
});

const copperCost = computed(() => {
    // Cost = (TotalLen / BoxLen) * BoxPrice
    if (!boxLen.value) return 0;
    const factor = parseFloat(displayTotalLen.value) / boxLen.value;
    return Math.round(factor * priceKit.value);
});

const gasAdded = computed(() => pathM.value > gasLimit.value);
const gasExtraG = computed(() => {
    if (!gasAdded.value) return 0;
    return Math.ceil((pathM.value - gasLimit.value) * gasRate.value);
});
const gasCost = computed(() => gasExtraG.value * gasPrice.value);

const extraTotal = computed(() => extraItems.value.reduce((sum, item) => sum + (item.price || 0), 0));

const totalQuote = computed(() => {
    return (baseInstallFee.value || 0) + 
           copperCost.value + 
           (priceSig.value || 0) + 
           (pricePwr.value || 0) + 
           (priceInsu.value || 0) + 
           gasCost.value + 
           extraTotal.value;
});

// Actions
const addExtraItem = () => extraItems.value.push({ name: '', price: 0 });
const removeExtraItem = (idx) => extraItems.value.splice(idx, 1);

const resetForm = () => {
    if(!confirm('清空所有欄位？')) return;
    customerName.value = '';
    pathM.value = 5;
    priceKit.value = 6000;
    baseInstallFee.value = 3500;
    extraItems.value = [{ name: '室外機安裝架 (A架)', price: 1500 }];
};

const copyQuote = async () => {
    const lines = [
        `【冷氣安裝報價單】`,
        `日期: ${today}`,
        `客戶: ${customerName.value || '未填寫'}`,
        `----------------`,
        `1. 基本安裝費: $${baseInstallFee.value.toLocaleString()}`,
        `2. 材料費 (銅管 ${pathM.value}米): $${(copperCost.value + (priceSig.value||0) + (pricePwr.value||0) + (priceInsu.value||0)).toLocaleString()}`,
        gasAdded.value ? `3. 冷媒追加: $${gasCost.value}` : null,
        `4. 其他項目:`,
        ...extraItems.value.filter(i => i.price > 0).map(i => `   - ${i.name}: $${i.price.toLocaleString()}`),
        `----------------`,
        `總報價: $${totalQuote.value.toLocaleString()}`
    ].filter(Boolean).join('\n');

    try {
        await navigator.clipboard.writeText(lines);
        copyStatus.value = 'copied';
        setTimeout(() => copyStatus.value = 'idle', 2000);
    } catch(e) {
        alert('複製失敗，請手動截圖');
    }
};

// Persistence
const STORAGE_KEY = 'taicalc_ac_quote_v2';
watch([customerName, baseInstallFee, pathM, priceKit, extraItems], () => {
   localStorage.setItem(STORAGE_KEY, JSON.stringify({
       customerName: customerName.value,
       baseInstallFee: baseInstallFee.value,
       pathM: pathM.value,
       extraItems: extraItems.value
   }));
}, { deep: true });

onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) {
        try {
            const data = JSON.parse(saved);
            if(data.customerName) customerName.value = data.customerName;
            if(data.baseInstallFee) baseInstallFee.value = data.baseInstallFee;
            if(data.pathM) pathM.value = data.pathM;
            if(data.extraItems) extraItems.value = data.extraItems;
        } catch(e) {}
    }
});
</script>
