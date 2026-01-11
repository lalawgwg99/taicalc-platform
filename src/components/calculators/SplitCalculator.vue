<template>
  <div class="max-w-2xl mx-auto space-y-8">
    
    <!-- 1. 總額設定 -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
         <div class="mb-6 text-center">
             <label class="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wide">總消費金額 (Total)</label>
             <div class="relative max-w-xs mx-auto">

                 <input 
                    v-model.number="totalAmount" 
                    type="number" 
                    class="w-full text-center text-4xl font-bold font-mono text-stone-800 border-b-2 border-stone-100 focus:border-emerald-500 outline-none py-2"
                    placeholder="0"
                 />
             </div>
         </div>

         <!-- 人員設定 -->
         <div>
             <div class="flex justify-between items-center mb-4">
                 <h3 class="font-bold text-stone-700">成員名單 ({{ members.length }}人)</h3>
                 <button @click="addMember" class="text-sm text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-1 rounded-lg transition-colors">+ 新增成員</button>
             </div>
             
             <div class="space-y-3">
                 <div v-for="(m, idx) in members" :key="m.id" class="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-100">
                     <div class="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-stone-200 text-xs font-bold text-stone-400">
                        {{ idx + 1 }}
                     </div>
                     <input 
                        v-model="m.name" 
                        class="flex-1 bg-transparent font-medium text-stone-800 outline-none placeholder-stone-400" 
                        placeholder="名字"
                     />
                     
                     <!-- 切換模式開關 -->
                     <div class="flex items-center gap-2">
                         <div class="flex flex-col items-end">
                             <span class="text-[10px] text-stone-400 uppercase tracking-wide">先付 (Paid)</span>
                             <input 
                                v-model.number="m.paid" 
                                type="number" 
                                class="w-20 text-right text-sm font-mono bg-white border border-stone-200 rounded px-1.5 py-0.5" 
                                placeholder="0"
                            />
                         </div>
                         <div class="flex flex-col items-end" v-if="mode === 'weighted'">
                             <span class="text-[10px] text-stone-400 uppercase tracking-wide">權重 (份)</span>
                             <input 
                                v-model.number="m.weight" 
                                type="number" 
                                class="w-12 text-center text-sm font-bold bg-white border border-stone-200 rounded px-1 py-0.5" 
                            />
                         </div>
                     </div>
                     
                     <button @click="removeMember(idx)" class="text-stone-300 hover:text-rose-500 px-1" v-if="members.length > 2">×</button>
                 </div>
             </div>
         </div>
    </div>

    <!-- 模式切換 -->
    <div class="flex justify-center gap-4">
        <button 
            @click="mode = 'even'" 
            :class="['px-4 py-2 rounded-full text-sm font-bold transition-colors', mode === 'even' ? 'bg-stone-800 text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200']"
        >
            ⚖️ 平均分攤
        </button>
        <button 
             @click="mode = 'weighted'" 
             :class="['px-4 py-2 rounded-full text-sm font-bold transition-colors', mode === 'weighted' ? 'bg-stone-800 text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200']"
        >
            📊 權重分攤
        </button>
    </div>

    <!-- 結果 -->
    <div class="card bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden">
         <div class="absolute -right-6 -top-6 w-32 h-32 bg-emerald-200 rounded-full opacity-30 blur-2xl"></div>
         
         <h2 class="text-lg font-bold text-emerald-900 mb-4 text-center font-mono">結算清單 (Settlement)</h2>
         
         <!-- 轉帳建議 -->
         <div v-if="transactions.length > 0" class="space-y-3 relative z-10">
             <div v-for="(tx, i) in transactions" :key="i" class="flex items-center justify-between bg-white/80 backdrop-blur p-3 rounded-xl border border-emerald-100 shadow-sm">
                 <div class="flex items-center gap-2">
                     <span class="font-bold text-stone-700">{{ tx.from }}</span>
                     <span class="text-xs text-stone-400">給</span>
                     <span class="font-bold text-emerald-700">{{ tx.to }}</span>
                 </div>
                 <div class="font-mono font-bold text-lg text-emerald-600">${{ tx.amount }}</div>
             </div>
         </div>
         <div v-else class="text-center text-stone-400 py-4 text-sm">
             🎉 目前無人互欠 (完美平帳)
         </div>
         
         <div class="mt-6 pt-4 border-t border-emerald-200/50 text-center">
             <button @click="copyResult" class="text-sm font-bold text-emerald-700 flex items-center justify-center gap-2 hover:bg-emerald-100/50 py-2 px-4 rounded-full transition-colors mx-auto">
                 <span v-if="copyStatus === 'idle'">📋 複製分帳結果</span>
                 <span v-else>✓ 已複製</span>
             </button>
         </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const totalAmount = ref(1000);
const mode = ref('even'); // 'even' | 'weighted'
const members = ref([
    { id: 1, name: 'Alice', paid: 1000, weight: 1 },
    { id: 2, name: 'Bob', paid: 0, weight: 1 },
    { id: 3, name: 'Charlie', paid: 0, weight: 1 }
]);

const copyStatus = ref('idle');

const addMember = () => {
    const id = Date.now();
    members.value.push({ id, name: '', paid: 0, weight: 1 });
};
const removeMember = (idx) => members.value.splice(idx, 1);

// Logic
const transactions = computed(() => {
    let list = members.value.map(m => ({ ...m, paid: m.paid || 0, weight: m.weight || 1, name: m.name || `成員${m.id}` }));
    
    // 1. Calculate Fair Share per person
    let totalPaid = list.reduce((sum, m) => sum + m.paid, 0);
    
    // User might input Total manually (override calculated total) or use Sum of Paid
    // Let's assume 'totalAmount' input matches 'totalPaid' if user enters it? 
    // Usually logic: Total Bill is X. Who paid what? 
    // If sum(paid) != totalAmount, assume 'totalAmount' is correct and difference is "Common Fund" or just error?
    // Let's simplify: Use 'totalAmount' as the bill. 'paid' is advance payment validation.
    // Actually, usually: Total Bill = 1000.  User A paid 1000. User B paid 0.
    
    // Auto-update Total if sum(paid) changes? No, user might type 1000 first.
    // Let's use sum(paid) as the "Money on Table" validation.
    // But most users just want: Bill $1000. I paid. Split 3 ways.
    
    // Core Logic:
    // Net Balance = Paid - ShouldPay
    
    // Calculate ShouldPay
    let grandTotal = totalAmount.value; 
    let totalWeight = list.reduce((sum, m) => sum + (mode.value === 'weighted' ? m.weight : 1), 0);
    
    let balances = list.map(m => {
        let share = mode.value === 'weighted' 
            ? (grandTotal * (m.weight / totalWeight)) 
            : (grandTotal / list.length);
        
        return {
            ...m,
            shouldPay: share,
            balance: m.paid - share // Positive = Owed money, Negative = Owes money
        };
    });
    
    // Sort creditors (+) and debtors (-)
    let debtors = balances.filter(b => b.balance < -0.1).sort((a,b) => a.balance - b.balance); // Ascending (most negative first)
    let creditors = balances.filter(b => b.balance > 0.1).sort((a,b) => b.balance - a.balance); // Descending (most positive first)
    
    let result = [];
    
    // Greedy match
    let d = 0;
    let c = 0;
    
    while(d < debtors.length && c < creditors.length) {
        let debtor = debtors[d];
        let creditor = creditors[c];
        
        let amount = Math.min(Math.abs(debtor.balance), creditor.balance);
        
        if (amount > 0) {
            result.push({
                from: debtor.name,
                to: creditor.name,
                amount: Math.round(amount)
            });
        }
        
        debtor.balance += amount;
        creditor.balance -= amount;
        
        if(Math.abs(debtor.balance) < 0.1) d++;
        if(creditor.balance < 0.1) c++;
    }
    
    return result;
});

const copyResult = async () => {
    let lines = [`【分帳結果】總額: $${totalAmount.value}`];
    transactions.value.forEach(tx => {
        lines.push(`${tx.from} \t→ ${tx.to} \t$${tx.amount}`);
    });
    
    if(transactions.value.length === 0) lines.push("無人互欠 (已結清)");
    
    try {
        await navigator.clipboard.writeText(lines.join('\n'));
        copyStatus.value = 'copied';
        setTimeout(() => copyStatus.value = 'idle', 2000);
    } catch(e) {}
};

// Persistence
const STORAGE_KEY = 'taicalc_split_v2';
watch([members, totalAmount, mode], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        members: members.value,
        totalAmount: totalAmount.value,
        mode: mode.value
    }));
}, { deep: true });

onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) {
        try {
            const d = JSON.parse(saved);
            if(d.members) members.value = d.members;
            if(d.totalAmount) totalAmount.value = d.totalAmount;
            if(d.mode) mode.value = d.mode;
        } catch(e) {}
    }
});
</script>
