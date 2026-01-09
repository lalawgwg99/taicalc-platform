<template>
  <div class="relative w-full h-4 sm:h-5 flex items-center justify-center my-1">
      <div class="h-full w-full rounded-sm transition-colors" :class="changing ? 'bg-amber-600 animate-pulse' : 'bg-neutral-200'"></div>
      <span v-if="changing" class="absolute text-[10px] text-amber-200 font-mono bg-neutral-900 px-1 rounded animate-pulse">○</span>
      <span v-if="label" class="absolute -left-6 text-xs text-neutral-500 font-mono hidden sm:block w-4 text-right">{{ label }}</span>
  </div>
</template>

<script setup>
const props = defineProps(['changing', 'label']);
</script>
