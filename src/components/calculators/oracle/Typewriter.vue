<template>
  <span>
    {{ shown }}
    <span 
      class="inline-block w-2 bg-current animate-caret h-3 align-middle ml-0.5" 
      :class="{ 'opacity-0': done }"
    ></span>
  </span>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 10
  }
});

const shown = ref('');
const done = ref(false);

watch(
  () => props.text,
  (newText) => {
    shown.value = '';
    done.value = false;
    let i = 0;
    let alive = true;
    
    const tick = () => {
      if (!alive) return;
      if (i >= newText.length) {
        done.value = true;
        return;
      }
      i++;
      shown.value = newText.slice(0, i);
      const ch = newText[i - 1];
      // Jitter logic: punctuation causes longer pause
      const jitter = ch === ' ' || ch === '.' || ch === ',' || ch === '，' || ch === '。' ? 80 : 0;
      setTimeout(tick, (props.speed || 10) + jitter);
    };
    setTimeout(tick, 20);
    return () => { alive = false; };
  },
  { immediate: true }
);
</script>

<style scoped>
@keyframes caretBlink {
  0%,
  49% {
    opacity: 0;
  }
  50%,
  100% {
    opacity: 1;
  }
}
.animate-caret {
  animation: caretBlink 800ms steps(1) infinite;
}
</style>
