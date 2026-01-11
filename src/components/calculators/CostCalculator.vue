<template>
  <div class="space-y-6">
    <!-- 輸入區 -->
    <div class="card bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="material" class="block text-xs font-semibold text-stone-500 mb-2">材料成本</label>
          <div class="relative">
            <input
              id="material"
              type="number"
              v-model.number="material"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label for="labor" class="block text-xs font-semibold text-stone-500 mb-2">人工成本</label>
          <div class="relative">
            <input
              id="labor"
              type="number"
              v-model.number="labor"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="overhead" class="block text-xs font-semibold text-stone-500 mb-2">其他費用</label>
          <div class="relative">
            <input
              id="overhead"
              type="number"
              v-model.number="overhead"
              class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label for="quantity" class="block text-xs font-semibold text-stone-500 mb-2">預計數量</label>
          <input
            id="quantity"
            type="number"
            v-model.number="quantity"
            min="1"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label for="price" class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
          預計售價
        </label>
        <div class="relative">
          <input
            id="price"
            type="number"
            v-model.number="price"
            class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>
    </div>

    <!-- 結果區 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-stone-50 rounded-xl p-4 border border-stone-200 text-center">
        <p class="text-xs text-stone-500 mb-1">總成本</p>
        <p class="text-xl font-bold font-mono text-stone-700">${{ fmt(totalCost) }}</p>
      </div>
      <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
        <p class="text-xs text-emerald-600 mb-1">單位成本</p>
        <p class="text-xl font-bold font-mono text-emerald-600">${{ fmt(unitCost) }}</p>
      </div>
      <div class="bg-stone-50 rounded-xl p-4 border border-stone-200 text-center">
        <p class="text-xs text-stone-500 mb-1">毛利率</p>
        <p class="text-xl font-bold font-mono" :class="margin >= 0 ? 'text-emerald-600' : 'text-rose-500'">
          {{ margin.toFixed(1) }}%
        </p>
      </div>
      <div class="bg-stone-50 rounded-xl p-4 border border-stone-200 text-center">
        <p class="text-xs text-stone-500 mb-1">損益兩平</p>
        <p class="text-xl font-bold font-mono text-blue-600">
          {{ breakeven > 0 ? breakeven + ' 件' : '—' }}
        </p>
      </div>
    </div>

    <!-- 判斷提示 -->
    <div class="text-sm text-center py-3 rounded-lg border" :class="verdictClass">
      {{ verdict }}
    </div>

    <!-- 複製按鈕 -->
    <button
      @click="copyResult"
      class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
    >
      <svg
        v-if="!copied"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      {{ copied ? '已複製結果！' : '複製結果' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const material = ref(1000);
const labor = ref(500);
const overhead = ref(200);
const quantity = ref(10);
const price = ref(250);
const copied = ref(false);

const fmt = (n) => n.toLocaleString('zh-TW');

const totalCost = computed(() => (material.value || 0) + (labor.value || 0) + (overhead.value || 0));

const unitCost = computed(() => {
  const q = quantity.value || 1;
  return Math.round((totalCost.value / q) * 100) / 100;
});

const margin = computed(() => {
  const p = price.value || 0;
  if (p <= 0) return 0;
  return ((p - unitCost.value) / p) * 100;
});

const breakeven = computed(() => {
  const p = price.value || 0;
  if (unitCost.value <= 0 || p <= unitCost.value) return 0;
  return Math.ceil(totalCost.value / (p - unitCost.value));
});

const verdict = computed(() => {
  if (margin.value >= 20) return '✅ 利潤空間健康，可考慮執行';
  if (margin.value >= 0) return '⚠️ 利潤偏低，建議重新評估定價或成本';
  return '❌ 目前定價會虧損，請調整';
});

const verdictClass = computed(() => {
  if (margin.value >= 20) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (margin.value >= 0) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
});

const copyResult = async () => {
  const text = `成本分析：總成本 $${fmt(totalCost.value)}，單位成本 $${fmt(unitCost.value)}，毛利率 ${margin.value.toFixed(
    1
  )}%，損益兩平 ${breakeven.value} 件`;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (e) {
    alert('Copy failed');
  }
};
</script>
