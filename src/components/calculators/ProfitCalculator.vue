<template>
  <div class="card rounded-2xl p-6 md:p-8 space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="sellingPrice" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >商品售價</label
        >
        <div class="relative">
             <input
              id="sellingPrice"
              type="number"
              v-model.number="sellingPrice"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
        </div>
      </div>
      <div>
        <label for="costPrice" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >進貨成本</label
        >
        <div class="relative">
            <input
              id="costPrice"
              type="number"
              v-model.number="costPrice"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
         <label for="quantity" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >預估銷量</label
        >
        <input
          id="quantity"
          type="number"
          v-model.number="quantity"
          class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>
      <div>
         <label for="marketingCost" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >行銷廣告費 (總額)</label
        >
        <div class="relative">
            <input
              id="marketingCost"
              type="number"
              v-model.number="marketingCost"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
        </div>
      </div>
       <div>
         <label for="otherCost" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >其他雜支 (運費/手續費)</label
        >
        <div class="relative">
            <input
              id="otherCost"
              type="number"
              v-model.number="otherCost"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
        </div>
      </div>
    </div>

    <!-- 結果 -->
    <div class="bg-stone-50 rounded-2xl p-6 border border-stone-200 relative overflow-hidden">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1">總營收 (Revenue)</p>
          <p class="text-lg font-bold text-stone-800 font-mono tracking-tight">{{ revenue }}</p>
        </div>
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1">總成本 (COGS+Exp)</p>
          <p class="text-lg font-bold text-stone-600 font-mono tracking-tight">{{ totalCostDisplay }}</p>
        </div>
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1">淨利 (Net Profit)</p>
          <p
            :class="[
              'text-lg font-bold font-mono tracking-tight',
              netProfit >= 0 ? 'text-emerald-600' : 'text-rose-500',
            ]"
          >
            {{ netProfitDisplay }}
          </p>
        </div>
         <div>
          <p class="text-stone-500 text-xs font-medium mb-1">投資報酬率 (ROI)</p>
          <p
            :class="[
              'text-lg font-bold font-mono tracking-tight',
              roi >= 0 ? 'text-blue-600' : 'text-rose-500',
            ]"
          >
            {{ roi }}%
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 pt-5 border-t border-stone-200 text-center">
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1 uppercase tracking-wide">淨利率 (Profit Margin)</p>
          <p class="text-3xl font-bold text-emerald-600 tracking-tight">{{ profitMargin }}%</p>
          <p class="text-[10px] text-stone-400 mt-1">淨利 ÷ 營收</p>
        </div>
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1 uppercase tracking-wide">損益平衡銷量 (BEP)</p>
          <p class="text-3xl font-bold text-stone-600 tracking-tight">{{ breakEvenQty }}</p>
          <p class="text-[10px] text-stone-400 mt-1">至少要賣出這麼多</p>
        </div>
      </div>
    </div>

    <div class="text-center text-xs text-stone-500 font-medium">
      💡 小知識：行銷費用佔比 (ROAS) 控制在營收的 20-30% 以內較為健康。
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const sellingPrice = ref(1000);
const costPrice = ref(600);
const quantity = ref(100);
const marketingCost = ref(5000);
const otherCost = ref(1000); // Shipping, Platform fee etc.

const revenue = computed(() => ((sellingPrice.value || 0) * (quantity.value || 0)).toLocaleString());

const totalProductCost = computed(() => (costPrice.value || 0) * (quantity.value || 0));
const totalExpense = computed(() => (marketingCost.value || 0) + (otherCost.value || 0));
const totalCostVal = computed(() => totalProductCost.value + totalExpense.value);
const totalCostDisplay = computed(() => totalCostVal.value.toLocaleString());

const netProfit = computed(() => ((sellingPrice.value || 0) * (quantity.value || 0)) - totalCostVal.value);
const netProfitDisplay = computed(() => netProfit.value.toLocaleString());

const profitMargin = computed(() => {
  const rev = (sellingPrice.value || 0) * (quantity.value || 0);
  return rev > 0 ? Math.round((netProfit.value / rev) * 1000) / 10 : 0;
});

const roi = computed(() => {
    const investment = totalCostVal.value;
    return investment > 0 ? Math.round((netProfit.value / investment) * 1000) / 10 : 0;
});

const breakEvenQty = computed(() => {
    // Fixed Costs = Marketing + Other (Assumed fixed for this batch)
    // Contribution Margin per unit = Selling - Cost
    const cm = (sellingPrice.value || 0) - (costPrice.value || 0);
    if (cm <= 0) return '∞';
    const fc = totalExpense.value;
    return Math.ceil(fc / cm).toLocaleString();
});
</script>
