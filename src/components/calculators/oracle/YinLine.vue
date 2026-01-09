<template>
  <div class="relative w-full h-4 sm:h-5 flex items-center my-1">
      <div class="h-full basis-5/12 rounded-sm transition-colors" :class="changing ? 'bg-amber-600 animate-pulse' : 'bg-neutral-200'"></div>
      <div class="h-full basis-2/12 flex items-center justify-center">
          <span v-if="changing" class="text-[10px] text-amber-300 font-mono animate-bounce">✕</span>
      </div>
      <div class="h-full basis-5/12 rounded-sm transition-colors" :class="changing ? 'bg-amber-600 animate-pulse' : 'bg-neutral-200'"></div>
      <span v-if="label" class="absolute -left-6 text-xs text-neutral-500 font-mono hidden sm:block w-4 text-right">{{ label }}</span>
  </div>
</template>

<script setup>
const props = defineProps(['changing', 'label']);
</script>
