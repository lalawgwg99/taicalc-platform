<template>
  <span class="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
    <button
      type="button"
      @click="save"
      :disabled="saved"
      class="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#1D4B34] underline-offset-4 transition hover:underline disabled:cursor-default disabled:opacity-70"
    >
      <svg v-if="!saved" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      {{ saved ? '已儲存 ✓' : '存下這次試算' }}
    </button>
    <a
      v-if="hasStored"
      href="/track"
      class="text-xs font-medium text-ink-400 underline-offset-4 transition hover:text-brand-700 hover:underline"
    >查看已存試算 →</a>
  </span>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  toolName: string;
  metrics: Array<{ label: string; value: string }>;
}>();

const saved = ref(false);
// 只要 localStorage 裡有這個工具的任何一筆紀錄，就顯示「查看已存試算 →」
const hasStored = ref(false);

const KEY = 'taicalc-snapshots-v1';
const MAX = 30;

const signature = (metrics: Array<{ label: string; value: string }>) =>
  JSON.stringify((metrics || []).slice(0, 6).map((m) => [String(m.label), String(m.value)]));

const readStored = (): Array<{ toolName: string; metrics: Array<{ label: string; value: string }> }> => {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

// 重整後依 localStorage 還原：同一工具、同一組試算數字已存過，就顯示「已儲存 ✓」
// 而不是永遠跳回未存；數字一改就恢復可存狀態。
const restoreFromStored = () => {
  const list = readStored();
  hasStored.value = list.some((s) => s.toolName === props.toolName);
  saved.value = list.some(
    (s) => s.toolName === props.toolName && signature(s.metrics || []) === signature(props.metrics),
  );
};

onMounted(restoreFromStored);

// 數字變了＝不是同一筆已存試算，恢復成可存狀態
watch(
  () => props.metrics,
  () => {
    const list = readStored();
    hasStored.value = list.some((s) => s.toolName === props.toolName);
    saved.value = list.some(
      (s) => s.toolName === props.toolName && signature(s.metrics || []) === signature(props.metrics),
    );
  },
  { deep: true },
);

const save = () => {
  try {
    const arr = readStored();
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
  hasStored.value = true;
};
</script>
