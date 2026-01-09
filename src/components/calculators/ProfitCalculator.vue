<template>
  <div class="card bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label for="sellingPrice" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >售價</label
        >
        <input
          id="sellingPrice"
          type="number"
          v-model.number="sellingPrice"
          class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>
      <div>
        <label for="costPrice" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >進貨成本</label
        >
        <input
          id="costPrice"
          type="number"
          v-model.number="costPrice"
          class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>
      <div>
        <label for="quantity" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >銷售數量</label
        >
        <input
          id="quantity"
          type="number"
          v-model.number="quantity"
          class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>
    </div>

    <!-- 結果 -->
    <div class="bg-stone-50 rounded-2xl p-6 border border-stone-200 relative overflow-hidden">
      <div class="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1">總營收</p>
          <p class="text-lg font-bold text-stone-800 font-mono tracking-tight">{{ revenue }}</p>
        </div>
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1">總成本</p>
          <p class="text-lg font-bold text-stone-600 font-mono tracking-tight">{{ totalCost }}</p>
        </div>
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1">總毛利</p>
          <p
            :class="[
              'text-lg font-bold font-mono tracking-tight',
              grossProfit >= 0 ? 'text-emerald-600' : 'text-rose-500',
            ]"
          >
            {{ grossProfitDisplay }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 pt-5 border-t border-stone-200 text-center">
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1 uppercase tracking-wide">利潤率 (Margin)</p>
          <p class="text-3xl font-bold text-emerald-600 tracking-tight">{{ profitMargin }}%</p>
          <p class="text-[10px] text-stone-400 mt-1">毛利 ÷ 營收</p>
        </div>
        <div>
          <p class="text-stone-500 text-xs font-medium mb-1 uppercase tracking-wide">加價率 (Markup)</p>
          <p class="text-3xl font-bold text-blue-600 tracking-tight">{{ markup }}%</p>
          <p class="text-[10px] text-stone-400 mt-1">利潤 ÷ 成本</p>
        </div>
      </div>
    </div>

    <div class="text-center text-xs text-stone-500 font-medium">
      💡 小知識：一般零售商品利潤率 20% 以上算健康，餐飲業通常需要 60% 以上。
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const sellingPrice = ref(1000);
const costPrice = ref(600);
const quantity = ref(100);

const revenue = computed(() => ((sellingPrice.value || 0) * (quantity.value || 0)).toLocaleString());
const totalCost = computed(() => ((costPrice.value || 0) * (quantity.value || 0)).toLocaleString());
const grossProfit = computed(() => ((sellingPrice.value || 0) - (costPrice.value || 0)) * (quantity.value || 0));
const grossProfitDisplay = computed(() => grossProfit.value.toLocaleString());

const profitMargin = computed(() => {
  const rev = (sellingPrice.value || 0) * (quantity.value || 0);
  return rev > 0 ? Math.round((grossProfit.value / rev) * 1000) / 10 : 0;
});

const markup = computed(() => {
  const cost = costPrice.value || 0;
  return cost > 0 ? Math.round(((sellingPrice.value - cost) / cost) * 1000) / 10 : 0;
});
</script>
