<template>
  <button
    type="button"
    @click="save"
    :disabled="saved"
    class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:cursor-default disabled:opacity-90"
  >
    <svg v-if="!saved" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
    {{ saved ? '已儲存 ✓' : '存下這次試算' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  toolName: string;
  metrics: Array<{ label: string; value: string }>;
}>();

const saved = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const KEY = 'taicalc-snapshots-v1';
const MAX = 30;

const save = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    const arr = Array.isArray(list) ? list : [];
    arr.unshift({
      toolName: props.toolName,
      date: new Date().toISOString(),
      metrics: props.metrics.slice(0, 6).map((m) => ({
        label: String(m.label).slice(0, 20),
        value: String(m.value).slice(0, 30),
      })),
    });
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, MAX)));
  } catch {
    // localStorage 不可用時靜默略過
  }
  saved.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { saved.value = false; }, 2500);
};
</script>
