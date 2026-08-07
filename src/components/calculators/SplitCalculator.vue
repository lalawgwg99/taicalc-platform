<template>
  <div class="calculator-shell max-w-2xl mx-auto space-y-5">
    
    <!-- 快速預設情境 (Apple Chip Selector) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span class="text-xs font-semibold text-stone-400 flex-shrink-0">快速情境：</span>
      <button 
        v-for="p in presets" 
        :key="p.title"
        @click="applyPreset(p)"
        class="text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 px-3 py-1.5 rounded-full transition-all flex-shrink-0 active:scale-95 shadow-sm"
      >
        {{ p.title }} (${{ p.total.toLocaleString() }})
      </button>
    </div>

    <!-- 1. 總額設定與成員名單 (Apple Inset Grouped Form) -->
    <div class="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5">
      <div class="mb-6 text-center">
        <label class="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">總消費金額 (Total Amount)</label>
        <div class="relative max-w-xs mx-auto flex items-center justify-center">
          <span class="text-2xl font-semibold text-stone-400 mr-1">$</span>
          <input 
            v-model.number="totalAmount" 
            type="number" 
            class="w-full text-center text-4xl font-bold font-mono text-stone-900 border-b-2 border-stone-200 focus:border-blue-500 outline-none py-1.5 transition-colors bg-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <!-- 模式切換 (iOS Segmented Control) -->
      <div class="grid grid-cols-2 p-1 bg-[#EFEFF4] rounded-xl mb-6">
        <button 
          @click="mode = 'even'" 
          :class="['py-2 text-xs font-semibold rounded-lg transition-all', mode === 'even' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800']"
        >
          ⚖️ 平均分攤
        </button>
        <button 
          @click="mode = 'weighted'" 
          :class="['py-2 text-xs font-semibold rounded-lg transition-all', mode === 'weighted' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800']"
        >
          📊 權重 / 自訂
        </button>
      </div>

      <!-- 成員名單 -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">成員名單 ({{ members.length }} 人)</h3>
          <button @click="addMember" class="text-xs text-blue-600 font-semibold hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors active:scale-95">
            + 新增成員
          </button>
        </div>
        
        <div class="space-y-2.5">
          <div 
            v-for="(m, idx) in members" 
            :key="m.id" 
            class="flex items-center gap-3 p-2.5 bg-[#F9F9FB] rounded-xl border border-stone-200/60 transition-all hover:border-stone-300"
          >
            <div class="w-7 h-7 flex items-center justify-center bg-white rounded-full border border-stone-200 text-xs font-semibold text-stone-500 flex-shrink-0 shadow-2xs">
              {{ idx + 1 }}
            </div>
            <input 
              v-model="m.name" 
              class="flex-1 bg-transparent font-medium text-stone-900 text-sm outline-none placeholder-stone-400" 
              placeholder="名字"
            />
            
            <div class="flex items-center gap-2">
              <div class="flex flex-col items-end">
                <span class="text-[10px] text-stone-400 font-medium">已先付 (Paid)</span>
                <div class="flex items-center">
                  <span class="text-xs text-stone-400 mr-0.5">$</span>
                  <input 
                    v-model.number="m.paid" 
                    type="number" 
                    class="w-20 text-right text-xs font-semibold font-mono bg-white border border-stone-200 rounded-md px-2 py-1 outline-none focus:border-blue-500" 
                    placeholder="0"
                  />
                </div>
              </div>
              <div class="flex flex-col items-end" v-if="mode === 'weighted'">
                <span class="text-[10px] text-stone-400 font-medium">權重 (份)</span>
                <input 
                  v-model.number="m.weight" 
                  type="number" 
                  class="w-12 text-center text-xs font-semibold font-mono bg-white border border-stone-200 rounded-md px-1.5 py-1 outline-none focus:border-blue-500" 
                />
              </div>
            </div>
            
            <button @click="removeMember(idx)" class="text-stone-400 hover:text-red-500 px-1 text-sm transition-colors" v-if="members.length > 2" title="刪除">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 結算結果 (Apple Native Settlement Card) -->
    <div class="bg-gradient-to-b from-white to-[#F9F9FB] rounded-2xl border border-blue-500/20 shadow-[0_4px_20px_rgba(0,122,255,0.06)] p-5 relative overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span> 最佳轉帳清算建議
        </h2>
        <span class="text-xs text-stone-400 font-mono">Minimal Transfers</span>
      </div>

      <div v-if="transactions.length > 0" class="space-y-2.5">
        <div 
          v-for="(tx, i) in transactions" 
          :key="i" 
          class="flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200/80 shadow-2xs"
        >
          <div class="flex items-center gap-2 text-sm">
            <span class="font-bold text-stone-900">{{ tx.from }}</span>
            <span class="text-xs text-stone-400 font-medium">轉給</span>
            <span class="font-bold text-blue-600">{{ tx.to }}</span>
          </div>
          <div class="font-mono font-bold text-base text-stone-900">${{ tx.amount.toLocaleString() }}</div>
        </div>
      </div>
      <div v-else class="py-6 text-center text-stone-500 text-sm bg-white rounded-xl border border-stone-200/60">
        🎉 目前無人互欠 (完美結清)
      </div>

      <!-- 操作按鈕 -->
      <div class="mt-5 pt-4 border-t border-stone-200/60 flex flex-wrap items-center justify-center gap-3">
        <button 
          @click="copyResult" 
          class="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <span v-if="copyStatus === 'idle'">📋 複製分帳文字 (LINE/iMessage)</span>
          <span v-else>✓ 已複製到剪貼簿</span>
        </button>
        <button 
          @click="copyShareLink" 
          class="text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 active:scale-95 py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <span v-if="!shareCopied">🔗 複製分享連結</span>
          <span v-else>✓ 連結已複製</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const totalAmount = ref(1200);
const mode = ref('even'); // 'even' | 'weighted'
const members = ref([
    { id: 1, name: '小明', paid: 1200, weight: 1 },
    { id: 2, name: '小華', paid: 0, weight: 1 },
    { id: 3, name: '小美', paid: 0, weight: 1 }
]);

const presets = [
  { title: '雙人約會', total: 1500, members: [{ name: '小明', paid: 1500 }, { name: '小華', paid: 0 }] },
  { title: '熱炒聚餐', total: 3200, members: [{ name: '小明', paid: 3200 }, { name: '小華', paid: 0 }, { name: '小美', paid: 0 }, { name: '阿強', paid: 0 }] },
  { title: '包車旅遊', total: 8000, members: [{ name: '小明', paid: 4000 }, { name: '小華', paid: 4000 }, { name: '小美', paid: 0 }, { name: '阿強', paid: 0 }] }
];

const applyPreset = (preset) => {
  totalAmount.value = preset.total;
  mode.value = 'even';
  members.value = preset.members.map((m, i) => ({
    id: Date.now() + i,
    name: m.name,
    paid: m.paid,
    weight: 1
  }));
};

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
        window.taicalcTrackEvent?.('result_copy', { copy_method: 'split_result' });
        copyStatus.value = 'copied';
        setTimeout(() => copyStatus.value = 'idle', 2000);
    } catch(e) {}
};

// ── 分享連結 ─────────────────────────────────────────────────
const shareCopied = ref(false);

const buildShareURL = () => {
    if (typeof window === 'undefined') return '';
    const p = new URLSearchParams({
        total: String(totalAmount.value),
        mode:  mode.value,
        m:     JSON.stringify(members.value.map(m => ({
            n: m.name || '',
            p: m.paid  || 0,
            w: m.weight || 1,
        }))),
    });
    return `${window.location.origin}/tools/split-calculator?${p.toString()}`;
};

const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(buildShareURL());
        shareCopied.value = true;
        setTimeout(() => { shareCopied.value = false; }, 2500);
    } catch(_) {}
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
    // 1. URL 參數優先（分享連結）
    if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search);
        if (p.has('total') || p.has('m')) {
            if (p.has('total'))  totalAmount.value = parseFloat(p.get('total')) || totalAmount.value;
            if (p.has('mode'))   mode.value        = p.get('mode') === 'weighted' ? 'weighted' : 'even';
            if (p.has('m')) {
                try {
                    const raw = JSON.parse(p.get('m'));
                    if (Array.isArray(raw) && raw.length > 0) {
                        members.value = raw.map((item, i) => ({
                            id: Date.now() + i,
                            name:   item.n || '',
                            paid:   item.p || 0,
                            weight: item.w || 1,
                        }));
                    }
                } catch(_) {}
            }
            return; // skip localStorage
        }
    }

    // 2. localStorage 備份
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
