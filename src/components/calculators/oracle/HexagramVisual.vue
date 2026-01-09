<template>
  <div class="flex flex-col w-28 sm:w-32 mx-auto py-2 bg-neutral-900/50 p-3 rounded border border-neutral-800/60">
      <div v-for="(l, i) in displayLines" :key="i" :class="animate ? 'oracle-pop' : ''" :style="{ animationDelay: (i * 90) + 'ms' }">
           <YangLine v-if="l.isYang" :changing="l.isChanging" :label="l.label" />
           <YinLine v-else :changing="l.isChanging" :label="l.label" />
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import YinLine from './YinLine.vue';
import YangLine from './YangLine.vue';

const props = defineProps(['lines', 'bits', 'animate']);

const displayLines = computed(() => {
    if (props.lines) {
      // lines array: [line1, line2, ..., line6] (bottom to top)
      // map first, then reverse
      const mapped = props.lines.map((val, idx) => ({
           val,
           idx: idx + 1, // 1-based index (bottom is 1)
           isYang: val === 7 || val === 9,
           isChanging: val === 6 || val === 9
      }));
      return mapped.reverse().map(item => ({
          ...item,
          label: String(item.idx)
      }));
    }
    
    if (props.bits) {
       // bits array: ['1', '0', ...] (bottom to top)
       const mapped = props.bits.map((b, idx) => ({
           b,
           idx: idx + 1,
           isYang: b === '1',
           isChanging: false
       }));
       return mapped.reverse().map(item => ({
          ...item,
          label: '' 
       }));
    }
    return [];
});
</script>

<style scoped>
@keyframes oraclePop {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
    filter: blur(0.4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
.oracle-pop {
  opacity: 0;
  animation: oraclePop 420ms ease-out forwards;
}
</style>
