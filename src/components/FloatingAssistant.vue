<template>
  <div class="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
    <!-- 聊天面板 -->
    <transition name="pop">
      <div
        v-if="open"
        class="w-[calc(100vw-2.5rem)] max-w-[380px] h-[min(540px,70vh)] bg-paper-50 border border-ink-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-label="小算 AI 助手"
      >
        <!-- 標題列 -->
        <div class="flex items-center justify-between px-4 py-3 bg-brand-700 text-white shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-lg">✨</span>
            <div>
              <p class="text-sm font-bold leading-tight">小算 AI 助手</p>
              <p class="text-[11px] opacity-80 leading-tight">問理財、問工具怎麼用都可以</p>
            </div>
          </div>
          <button @click="open = false" aria-label="關閉" class="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- 訊息區 -->
        <div ref="msgBox" class="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-paper-100/50">
          <div
            v-for="(m, i) in messages"
            :key="i"
            class="flex"
            :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
              :class="m.role === 'user'
                ? 'bg-brand-700 text-white rounded-br-md'
                : 'bg-white text-ink-800 border border-ink-100 rounded-bl-md shadow-sm'"
            >{{ m.content }}</div>
          </div>
          <div v-if="loading" class="flex justify-start">
            <div class="bg-white border border-ink-100 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
              <span class="typing"><i></i><i></i><i></i></span>
            </div>
          </div>
          <div v-if="error" class="flex justify-start">
            <div class="bg-white border border-red-200 rounded-2xl px-3 py-2 text-xs text-red-500">
              {{ error }}
              <button @click="retry" class="ml-1 underline underline-offset-2 text-brand-700">重試</button>
            </div>
          </div>
        </div>

        <!-- 快速問句 -->
        <div v-if="messages.length <= 1" class="px-3 pb-1 pt-2 flex gap-1.5 overflow-x-auto shrink-0 bg-paper-100/50">
          <button
            v-for="q in quickAsks"
            :key="q"
            @click="ask(q)"
            class="shrink-0 text-xs px-2.5 py-1.5 rounded-full border border-brand-200 text-brand-700 bg-white hover:bg-brand-50 transition-colors"
          >{{ q }}</button>
        </div>

        <!-- 輸入列 -->
        <div class="p-3 border-t border-ink-100 bg-paper-50 shrink-0">
          <div class="flex gap-2">
            <input
              v-model="input"
              @keydown.enter="send"
              type="text"
              maxlength="500"
              placeholder="輸入你的問題…"
              aria-label="輸入問題"
              class="flex-1 bg-white border border-ink-100 rounded-xl py-2.5 px-3 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            <button
              @click="send"
              :disabled="loading || !input.trim()"
              aria-label="送出"
              class="w-11 h-11 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0 transition-all"
              :class="loading || !input.trim() ? 'opacity-40 cursor-not-allowed' : 'hover:bg-brand-800'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12l18-9-6 18-3.5-7.5L3 12z" fill="currentColor"/></svg>
            </button>
          </div>
          <p class="mt-1.5 text-[10px] text-ink-300 text-center">AI 回答僅供參考，重要決策請再查證</p>
        </div>
      </div>
    </transition>

    <!-- 首次提示泡泡 -->
    <transition name="fade">
      <button
        v-if="!open && showHint"
        @click="openChat"
        class="bg-white border border-ink-100 shadow-lg rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm text-ink-700 text-left max-w-[220px] hover:shadow-xl transition-shadow"
      >
        👋 有問題嗎？問小算 ✨
      </button>
    </transition>

    <!-- 懸浮按鈕 -->
    <button
      @click="openChat"
      :aria-label="open ? '關閉 AI 助手' : '開啟 AI 助手'"
      class="w-14 h-14 rounded-full bg-brand-700 text-white shadow-xl flex items-center justify-center text-2xl transition-transform hover:scale-105 active:scale-95"
    >
      <transition name="fade" mode="out-in">
        <span v-if="!open" key="sparkle">✨</span>
        <svg v-else key="close" width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </transition>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';

const open = ref(false);
const input = ref('');
const loading = ref(false);
const error = ref('');
const messages = ref([
  { role: 'assistant', content: '嗨，我是小算 ✨\n理財問題、工具怎麼用，都可以直接問我。' },
]);
const msgBox = ref(null);
const showHint = ref(false);
const quickAsks = ['冷氣電費怎麼省？', '房貸怎麼算？', '0050 定期定額好嗎？'];

const API = 'https://ai.taicalc.com/api/ai';
let lastUserMsg = '';

function openChat() {
  open.value = true;
  showHint.value = false;
  try { localStorage.setItem('taicalc-assistant-seen', '1'); } catch {}
  scrollDown();
}

function scrollDown() {
  nextTick(() => {
    if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight;
  });
}

async function ask(text) {
  input.value = text;
  await send();
}

async function send() {
  const text = input.value.trim();
  if (!text || loading.value) return;
  lastUserMsg = text;
  messages.value.push({ role: 'user', content: text });
  input.value = '';
  error.value = '';
  loading.value = true;
  scrollDown();
  try {
    const history = messages.value.slice(-6).map((m) => ({ role: m.role, content: m.content }));
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'chat', payload: { messages: history } }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '查詢失敗');
    messages.value.push({ role: 'assistant', content: data.text || '抱歉，我現在有點忙，請稍後再試。' });
  } catch (e) {
    error.value = '連線有點不穩。';
  } finally {
    loading.value = false;
    scrollDown();
  }
}

async function retry() {
  if (!lastUserMsg) return;
  input.value = lastUserMsg;
  await send();
}

onMounted(() => {
  try {
    if (!localStorage.getItem('taicalc-assistant-seen')) {
      setTimeout(() => { if (!open.value) showHint.value = true; }, 2500);
      setTimeout(() => { showHint.value = false; }, 12000);
    }
  } catch {}
});
</script>

<style scoped>
.typing { display: inline-flex; gap: 4px; }
.typing i {
  width: 6px; height: 6px; border-radius: 50%;
  background: #9aa393; animation: blink 1.2s infinite;
}
.typing i:nth-child(2) { animation-delay: 0.2s; }
.typing i:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 60%, 100% { opacity: 0.25; } 30% { opacity: 1; } }
.pop-enter-active, .pop-leave-active { transition: all 0.22s ease; transform-origin: bottom right; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9) translateY(10px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
