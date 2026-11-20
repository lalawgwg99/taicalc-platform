<template>
  <input
    :id="id"
    type="text"
    inputmode="decimal"
    :value="display"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="inputClass"
    @input="onInput"
    @change="onChange"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatThousands, parseThousands } from '../utils/formatNumber';

// 金額輸入框：失焦顯示千分位（1,000,000），聚焦恢復純數字；
// 計算一律用 emit 出去的解析後數值（number | null，留空／非法輸入為 null）。
// 同時監聽 input 與 change：程式化填值／自動填入只觸發 change 時，
// Vue v-model 只聽 input 會漏接、造成「欄位顯示新值、計算仍用舊值」的脫鉤，
// 這正是房地合一稅「再持有」首次顯示舊值的根因（實測：只發 change 時
// totalMonths 停在 18、再持有停在 7）。
const props = defineProps<{
  modelValue: number | null;
  id?: string;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  inputClass?: string | string[] | Record<string, boolean>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const display = ref(formatThousands(props.modelValue));
const focused = ref(false);

watch(
  () => props.modelValue,
  (v) => {
    if (!focused.value) display.value = formatThousands(v);
  },
);

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  display.value = raw;
  emit('update:modelValue', parseThousands(raw));
}

function onChange(e: Event) {
  // 只發 change 的填值（程式化／自動填入）也要同步進 modelValue
  const raw = (e.target as HTMLInputElement).value;
  const parsed = parseThousands(raw);
  if (parsed !== props.modelValue) {
    display.value = raw;
    emit('update:modelValue', parsed);
  }
}

function onFocus() {
  focused.value = true;
  const v = props.modelValue;
  display.value = v === null || v === undefined ? '' : String(v);
}

function onBlur() {
  focused.value = false;
  display.value = formatThousands(props.modelValue);
}
</script>
