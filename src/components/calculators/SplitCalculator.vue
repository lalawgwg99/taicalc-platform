<template>
  <div class="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
    <!-- 總金額 -->
    <div class="mb-6">
      <label class="block text-sm font-bold text-stone-700 mb-2">總金額 (Total)</label>
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">$</span>
        <input
          type="number"
          v-model.number="total"
          class="w-full bg-stone-50 border border-stone-200 rounded-xl py-4 pl-10 pr-4 text-stone-900 text-2xl font-bold font-mono focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all placeholder:text-stone-300"
          placeholder="1000"
        />
      </div>
    </div>

    <!-- 人數 -->
    <div class="mb-8">
      <label class="block text-sm font-bold text-stone-700 mb-2">人數 (People)</label>
      <div class="flex items-center gap-3">
        <button
          @click="people = Math.max(1, people - 1)"
          class="w-14 h-14 bg-white border border-stone-200 rounded-xl text-2xl text-stone-600 hover:bg-stone-50 hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
        >
          −
        </button>
        <input
          type="number"
          v-model.number="people"
          min="1"
          class="flex-1 bg-stone-50 border border-stone-200 rounded-xl py-4 text-center text-stone-900 text-2xl font-bold font-mono focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
        />
        <button
          @click="people++"
          class="w-14 h-14 bg-white border border-stone-200 rounded-xl text-2xl text-stone-600 hover:bg-stone-50 hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
        >
          +
        </button>
      </div>
    </div>

    <!-- 結果 -->
    <div class="bg-emerald-50 rounded-xl p-6 border border-emerald-100 mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-emerald-800">每人應付</span>
        <span class="text-xs uppercase tracking-wider text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full"
          >Results</span
        >
      </div>
      <div class="text-4xl font-bold text-emerald-600 font-mono tracking-tight flex items-baseline gap-1">
        <span class="text-2xl">$</span>{{ perPerson }}
      </div>
      <div
        v-if="remainder > 0"
        class="mt-2 text-sm text-amber-600 flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg inline-block border border-amber-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        無法整除，剩餘 <span class="font-bold">${{ remainder }}</span>
      </div>
    </div>

    <!-- 進階：指定付款 -->
    <div class="mt-6 border-t border-stone-100 pt-6">
      <button
        @click="showAdvanced = !showAdvanced"
        class="w-full text-left text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-2"
      >
        <span class="transition-transform duration-200" :class="{ 'rotate-90': showAdvanced }">▶</span>
        進階選項：有人需要多付？
      </button>

      <div v-if="showAdvanced" class="mt-4 space-y-2.5">
        <div
          v-for="(p, i) in peopleList"
          :key="i"
          class="flex items-center gap-3 bg-stone-50 rounded-xl p-2 pr-4 border border-stone-100"
        >
          <div
            class="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs text-stone-400 font-medium"
          >
            {{ i + 1 }}
          </div>
          <input
            v-model="p.name"
            class="flex-1 bg-transparent text-stone-800 text-sm font-medium focus:outline-none placeholder:text-stone-300"
            :placeholder="'人員 ' + (i + 1)"
          />
          <span class="text-stone-400 text-xs">多付</span>
          <input
            type="number"
            v-model.number="p.extra"
            class="w-24 bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-right font-mono text-sm focus:outline-none focus:border-emerald-500 text-stone-800"
          />
        </div>
        <div class="text-xs text-stone-400 mt-2 px-1">
          * 調整後每人基本應付: <span class="font-bold text-stone-600">${{ adjustedPerPerson }}</span> (+額外費用)
        </div>
      </div>
    </div>

    <!-- 複製按鈕 -->
    <button
      @click="copyResult"
      class="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-emerald-200 flex items-center justify-center gap-2 text-lg"
    >
      <span v-if="!copied" class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        複製分帳結果
      </span>
      <span v-else class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        已複製
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const total = ref(1000);
const people = ref(4);
const showAdvanced = ref(false);
const copied = ref(false);
const peopleList = ref([]);

watch(
  people,
  (n) => {
    while (peopleList.value.length < n) {
      peopleList.value.push({ name: '', extra: 0 });
    }
    while (peopleList.value.length > n) {
      peopleList.value.pop();
    }
  },
  { immediate: true }
);

const perPerson = computed(() => {
  if (!people.value || people.value < 1) return 0;
  return Math.floor((total.value || 0) / people.value);
});

const remainder = computed(() => {
  if (!people.value || people.value < 1) return 0;
  return (total.value || 0) % people.value;
});

const totalExtra = computed(() => {
  return peopleList.value.reduce((sum, p) => sum + (p.extra || 0), 0);
});

const adjustedPerPerson = computed(() => {
  const remaining = (total.value || 0) - totalExtra.value;
  return Math.floor(remaining / (people.value || 1));
});

const copyResult = async () => {
  const lines = [`分帳結果 (總額 $${total.value}，${people.value} 人)`];
  if (showAdvanced.value && totalExtra.value > 0) {
    peopleList.value.forEach((p, i) => {
      const name = p.name || `人員${i + 1}`;
      const amount = adjustedPerPerson.value + (p.extra || 0);
      lines.push(`• ${name}: $${amount}`);
    });
  } else {
    lines.push(`每人付 $${perPerson.value}`);
    if (remainder.value > 0) {
      lines.push(`(剩餘 $${remainder.value} 待處理)`);
    }
  }
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (e) {
    alert('複製失敗');
  }
};
</script>
