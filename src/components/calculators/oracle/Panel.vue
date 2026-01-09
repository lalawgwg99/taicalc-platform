<template>
  <div class="bg-neutral-900/30 border border-neutral-800 rounded-sm overflow-hidden">
    <button @click="open = !open" class="w-full px-4 py-3 flex items-center justify-between text-neutral-400 hover:text-white transition-colors">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono uppercase tracking-widest">{{ title }}</span>
        <span v-if="count !== undefined" class="text-xs text-neutral-600">({{ count }})</span>
      </div>
      <span class="text-xs transform transition-transform" :class="open ? 'rotate-180' : ''">▼</span>
    </button>
    <div class="transition-all duration-300 ease-out overflow-hidden" :class="open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
      <div class="border-t border-neutral-800">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['title', 'icon', 'count']);
const open = ref(false);
</script>
