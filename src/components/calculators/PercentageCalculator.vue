<template>
  <div class="card rounded-2xl overflow-hidden">
    <!-- Tab Navigation -->
    <div class="flex border-b border-stone-200 overflow-x-auto scrollbar-hide">
      <button
        v-for="m in modes"
        :key="m.id"
        @click="currentMode = m.id"
        class="flex-1 min-w-[80px] py-4 px-2 text-sm font-medium text-center tab-btn hover:bg-stone-50 whitespace-nowrap"
        :class="currentMode === m.id ? 'text-purple-700 active font-bold bg-purple-50/50' : 'text-stone-500'"
      >
        {{ m.label }}
      </button>
    </div>

    <div class="p-6 sm:p-8">
      <!-- Mode Description & Visual -->
      <div class="mb-8 flex items-start gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
        <div class="text-2xl p-2 bg-white rounded-lg shadow-sm border border-stone-100 hidden sm:block">
          {{ currentModeData.icon }}
        </div>
        <div>
          <h3 class="font-bold text-stone-700 mb-1 flex items-center gap-2">
            <span class="sm:hidden">{{ currentModeData.icon }}</span>
            {{ currentModeData.title }}
          </h3>
          <p class="text-sm text-stone-500 leading-relaxed">{{ currentModeData.desc }}</p>
        </div>
      </div>

      <!-- Input Area -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            :for="'inputA-' + currentMode"
            class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >
            {{ currentModeData.labels.a }}
          </label>
          <input
            :id="'inputA-' + currentMode"
            type="number"
            v-model.number="inputA"
            placeholder="0"
            class="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder-stone-300"
          />
        </div>
        <div>
          <label
            :for="'inputB-' + currentMode"
            class="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide"
          >
            {{ currentModeData.labels.b }}
          </label>
          <div class="relative">
            <input
              :id="'inputB-' + currentMode"
              type="number"
              v-model.number="inputB"
              placeholder="0"
              class="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder-stone-300"
            />
            <span
              v-if="currentMode === 'discount'"
              class="absolute right-4 top-3.5 text-stone-400 font-bold text-sm"
            >
              折
            </span>
            <span
              v-if="currentMode === 'findValue' || currentMode === 'findOriginal'"
              class="absolute right-4 top-3.5 text-stone-400 font-bold text-sm"
            >
              %
            </span>
          </div>
        </div>
      </div>

      <!-- Result Area -->
      <div
        class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 text-center relative overflow-hidden transition-all duration-300"
      >
        <p class="text-xs font-semibold text-purple-600/70 mb-2 uppercase tracking-wider">計算結果</p>

        <Transition name="fade" mode="out-in">
          <div :key="resultText">
            <p class="text-3xl sm:text-4xl font-bold text-purple-900 tracking-tight font-mono mb-2">
              {{ resultValue }}
            </p>
            <p class="text-sm text-purple-600 font-medium">
              {{ resultText }}
            </p>
          </div>
        </Transition>

        <!-- Simple Visual Bar -->
        <div
          v-if="currentMode === 'discount' || currentMode === 'findPercentage'"
          class="mt-6 h-2 bg-purple-200/50 rounded-full overflow-hidden flex justify-start"
        >
          <div
            class="h-full bg-purple-500 transition-all duration-500"
            :style="{ width: Math.min(100, Math.max(0, visualPercent)) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const currentMode = ref('discount');
const inputA = ref(1000);
const inputB = ref(85);

const modes = [
  { id: 'discount', label: '折扣計算' },
  { id: 'change', label: '變化率 (漲跌)' },
  { id: 'findOriginal', label: '求原值' },
  { id: 'findPercentage', label: '求佔比' }
];

const modeInfo = {
  discount: {
    title: '折扣後價格',
    desc: '輸入原價和折數，計算打折後的金額。例如：原價 1000 元打 85 折。',
    icon: '🏷️',
    labels: { a: '原價 ($)', b: '折數 (ex: 85折填85)' }
  },
  change: {
    title: '變化率 (漲跌幅)',
    desc: '計算新舊數值之間的變化百分比。例如：營收從 100 萬變 150 萬，成長了多少？',
    icon: '📈',
    labels: { a: '原始數值 (舊)', b: '新數值 (新)' }
  },
  findOriginal: {
    title: '反推原值',
    desc: '已知某數是原值的百分之幾，求原值。例如：200 是原價的 20%，求原價？',
    icon: '🔙',
    labels: { a: '現有數值', b: '佔原值百分比 (%)' }
  },
  findPercentage: {
    title: '計算佔比',
    desc: '計算部分值佔整體的百分比。例如：50 是 200 的百分之幾？',
    icon: '🍰',
    labels: { a: '部分值', b: '整體值' }
  }
};

const currentModeData = computed(() => modeInfo[currentMode.value]);

watch(currentMode, (newVal) => {
  switch (newVal) {
    case 'discount': inputA.value = 1000; inputB.value = 85; break;
    case 'change': inputA.value = 100; inputB.value = 150; break;
    case 'findOriginal': inputA.value = 200; inputB.value = 20; break;
    case 'findPercentage': inputA.value = 50; inputB.value = 200; break;
  }
});

const visualPercent = computed(() => {
  if (currentMode.value === 'discount') return inputB.value || 0;
  if (currentMode.value === 'findPercentage') {
    if (!inputB.value) return 0;
    return (inputA.value / inputB.value) * 100;
  }
  return 0;
});

const calculation = computed(() => {
  const a = inputA.value || 0;
  const b = inputB.value || 0;

  if (currentMode.value === 'discount') {
    const discountRate = b / 100;
    const finalPrice = a * discountRate;
    const saved = a - finalPrice;
    return {
      val: finalPrice,
      text: `原價 $${a} 打 ${b / 10} 折，省下 $${Math.round(saved)}`
    };
  } else if (currentMode.value === 'change') {
    if (a === 0) return { val: 0, text: '原值不能為 0' };
    const change = ((b - a) / a) * 100;
    const sign = change > 0 ? '+' : '';
    return {
      val: `${sign}${change.toFixed(2)}%`,
      text: `${change > 0 ? '成長' : '衰退'}了 ${Math.abs(change).toFixed(2)}%`
    };
  } else if (currentMode.value === 'findOriginal') {
    if (b === 0) return { val: 0, text: '百分比不能為 0' };
    const original = a / (b / 100);
    return {
      val: parseFloat(original.toFixed(2)),
      text: `${a} 是 ${original} 的 ${b}%`
    };
  } else { // findPercentage
    if (b === 0) return { val: 0, text: '整體值不能為 0' };
    const pct = (a / b) * 100;
    return {
      val: `${pct.toFixed(2)}%`,
      text: `${a} 佔 ${b} 的 ${pct.toFixed(2)}%`
    };
  }
});

const resultValue = computed(() => calculation.value.val);
const resultText = computed(() => calculation.value.text);
</script>

<style scoped>
.tab-btn {
  position: relative;
  transition: all 0.3s ease;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #9333ea;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
