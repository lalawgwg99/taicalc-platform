<script setup lang="ts">
import { computed, ref } from 'vue';
import SnapshotButton from '../SnapshotButton.vue';

const formatTWD = (n: number) => 'NT$' + Math.round(Number(n) || 0).toLocaleString('zh-TW');

type Scope = 'global' | 'jp' | 'kr' | 'th';
interface CardInfo {
  name: string;
  bank: string;
  scopes: Scope[]; // 適用目的地；global 代表不限國家
  rate: number; // 標題回饋率（%，達成備註條件時）
  note: string;
}

// 回饋率資料日期：2026-10-22。取各卡「常態可達」回饋率，限時登錄加碼、新戶加碼不計入。
const CARDS: CardInfo[] = [
  { name: 'Richart 卡（玩旅刷）', bank: '台新銀行', scopes: ['global'], rate: 3.3, note: '最高 3.3%：切換「玩旅刷」＋台新帳戶自動扣繳；未扣繳 1.3%' },
  { name: 'CUBE 卡（趣旅行）', bank: '國泰世華', scopes: ['global'], rate: 3.0, note: 'Level 2（帳戶自扣或 App 繳費）3%；貴賓 3.3%；未達 2%' },
  { name: '賴點卡', bank: '聯邦銀行', scopes: ['global'], rate: 3.0, note: '國外消費 3% 回饋無上限' },
  { name: 'M 卡（商務卡）', bank: '聯邦銀行', scopes: ['global'], rate: 3.0, note: '國外實體商店 3% 無上限，需電子帳單；歐洲實體不適用' },
  { name: 'LINE Pay 卡', bank: '中國信託', scopes: ['global'], rate: 2.8, note: '國外實體消費 2.8% 無上限' },
  { name: '幣倍卡', bank: '永豐銀行', scopes: ['global'], rate: 2.0, note: '國外消費 2% 回饋無上限' },
  { name: '一卡通聯名卡', bank: '第一銀行', scopes: ['jp', 'kr'], rate: 3.5, note: '日韓實體 3.5% 無上限，需電子帳單＋一銀帳戶自扣' },
  { name: 'J 卡', bank: '台北富邦', scopes: ['jp', 'kr', 'th'], rate: 3.0, note: '日韓泰一般消費 3% 無上限，需電子帳單或富邦帳戶自扣；其他國家 1%' },
  { name: '吉鶴卡', bank: '聯邦銀行', scopes: ['jp'], rate: 2.5, note: '日幣消費 2.5% 回饋無上限' },
  { name: '熊本熊日圓雙幣卡', bank: '玉山銀行', scopes: ['jp'], rate: 2.5, note: '日本消費 2.5% 回饋無上限' },
];

const destinations: { value: Scope | 'other'; label: string }[] = [
  { value: 'jp', label: '日本' },
  { value: 'kr', label: '韓國' },
  { value: 'th', label: '泰國' },
  { value: 'other', label: '其他國家' },
];

const amount = ref(50000);
const destination = ref<Scope | 'other'>('jp');
const feeRate = ref(1.5);

const rows = computed(() => CARDS
  .filter((c) => c.scopes.includes('global') || (destination.value !== 'other' && c.scopes.includes(destination.value as Scope)))
  .map((c) => {
    // 金額與費率欄的 min/max 只是 HTML 屬性，打字可越過：計算一律箝制 ≥0，負費率不再灌水淨回饋
    const amt = Math.max(Number(amount.value) || 0, 0);
    const fr = Math.max(Number(feeRate.value) || 0, 0);
    const rebate = Math.round(amt * c.rate / 100);
    const fee = Math.round(amt * fr / 100);
    return { ...c, rebate, fee, net: rebate - fee, netRate: c.rate - fr };
  })
  .sort((a, b) => b.net - a.net));

const best = computed(() => rows.value[0]);
const globalOnly = computed(() => destination.value === 'other');
</script>

<template>
  <div class="calculator-shell">
    <section class="calculator-card" aria-label="海外刷卡淨回饋試算器">
      <div class="calculator-toolbar">
        <div>
          <h2>輸入消費金額與目的地</h2>
          <p>淨回饋＝回饋 − 手續費；回饋率取常態可達水準。</p>
        </div>
        <SnapshotButton
          tool-name="海外刷卡淨回饋試算"
          :metrics="[
            { label: '海外消費金額', value: formatTWD(amount) },
            { label: '淨回饋最高', value: best ? `${best.bank} ${best.name} ${formatTWD(best.net)}` : '—' },
          ]"
        />
      </div>

      <div class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-semibold text-amber-800">⚠️ 出國刷卡永遠選當地貨幣結帳</p>
        <p class="mt-1 text-xs leading-5 text-amber-700">選台幣就是 DCC：匯率由收單行決定，加價常達 4% 以上。</p>
      </div>

      <div class="calculator-grid">
        <label class="field field--result">
          <span>海外消費金額（新台幣）</span>
          <input v-model.number="amount" type="number" min="0" step="1000" inputmode="numeric" />
          <small>帳單若是外幣，請先換算成台幣。</small>
        </label>
        <label class="field">
          <span>海外交易手續費率（%）</span>
          <input v-model.number="feeRate" type="number" min="0" max="5" step="0.1" inputmode="decimal" />
          <small>多數銀行收 1.5%（發卡組織 1%＋銀行 0.5%）。</small>
        </label>
        <div class="field" style="grid-column: 1 / -1;">
          <span>目的地</span>
          <div class="flex flex-wrap gap-2" role="group" aria-label="目的地">
            <button v-for="d in destinations" :key="d.value" type="button" class="seg-btn" :class="{ 'seg-btn-active': destination === d.value }" @click="destination = d.value">{{ d.label }}</button>
          </div>
        </div>
      </div>

      <div v-if="best && amount > 0" class="summary-strip" aria-live="polite">
        <span class="summary-main">淨回饋最高：<strong>{{ best.bank }} {{ best.name }}</strong></span>
        <span>回饋 {{ formatTWD(best.rebate) }} − 手續費 {{ formatTWD(best.fee) }}<strong>{{ best.net >= 0 ? '淨拿回' : '最少虧損' }} {{ formatTWD(Math.abs(best.net)) }}（{{ best.netRate.toFixed(1) }}%）</strong></span>
      </div>

      <p v-if="globalOnly" class="mt-4 rounded-lg bg-[#EDF5EF] px-4 py-3 text-sm leading-6 text-[#25231F]">此目的地只列不限國家的卡片。</p>

      <div class="calc-cards" role="list">
        <article v-for="(row, i) in rows" :key="row.name" class="calc-card" :class="{ 'calc-card--best': i === 0 }" role="listitem">
          <div class="calc-card-head">
            <strong>{{ row.bank }} {{ row.name }}</strong>
            <span class="calc-card-scope">{{ row.scopes.includes('global') ? '不限國家' : '限定國家專屬' }}</span>
            <span v-if="i === 0" class="calc-card-badge">淨回饋最高</span>
          </div>
          <div class="calc-card-net">淨回饋 <strong>{{ formatTWD(row.net) }}</strong><span>淨 {{ row.netRate.toFixed(1) }}%</span></div>
          <div class="calc-card-math">回饋率 {{ row.rate.toFixed(1) }}%・回饋 {{ formatTWD(row.rebate) }}・手續費 −{{ formatTWD(row.fee) }}</div>
          <p class="calc-card-note">{{ row.note }}</p>
        </article>
      </div>

      <p class="mt-4 text-sm leading-6 text-[var(--color-muted)]">
        資料 2026-10-22，來源：各銀行官網與新聞稿彙整。權益每季調整，以官網最新公告為準；點數以 1 點 ≈ 1 元估算。
      </p>
    </section>
  </div>
</template>
