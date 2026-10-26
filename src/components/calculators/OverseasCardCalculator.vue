<script setup lang="ts">
import { computed, ref } from 'vue';
import SnapshotButton from '../SnapshotButton.vue';

const formatTWD = (n: number) => 'NT$ ' + Math.round(Number(n) || 0).toLocaleString('zh-TW');

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
  { name: 'Richart 卡（玩旅刷）', bank: '台新銀行', scopes: ['global'], rate: 3.3, note: '最高 3.3%：切換「玩旅刷」並設定台新帳戶自動扣繳（Level 2）；未完成扣繳任務為 1.3%' },
  { name: 'CUBE 卡（趣旅行）', bank: '國泰世華', scopes: ['global'], rate: 3.0, note: 'Level 2（國泰帳戶自扣或 App 繳卡費）3%；財富管理貴賓 Level 3 為 3.3%；未達 Level 2 為 2%' },
  { name: '賴點卡', bank: '聯邦銀行', scopes: ['global'], rate: 3.0, note: '國外消費 3% 回饋無上限' },
  { name: 'M 卡（商務卡）', bank: '聯邦銀行', scopes: ['global'], rate: 3.0, note: '國外實體商店 3% 無上限，需申辦電子化帳單；歐洲實體商店不適用' },
  { name: 'LINE Pay 卡', bank: '中國信託', scopes: ['global'], rate: 2.8, note: '國外實體消費 2.8% 無上限；指定國家登錄加碼（上限 450 點）不計入' },
  { name: '幣倍卡', bank: '永豐銀行', scopes: ['global'], rate: 2.0, note: '國外消費 2% 回饋無上限；精選通路加碼 4%（上限 800 元／期）不計入' },
  { name: '一卡通聯名卡', bank: '第一銀行', scopes: ['jp', 'kr'], rate: 3.5, note: '日韓實體消費 3.5% 無上限（一般 1%＋加碼 2.5%），需電子帳單及一銀帳戶自動扣繳' },
  { name: 'J 卡', bank: '台北富邦', scopes: ['jp', 'kr', 'th'], rate: 3.0, note: '日韓泰一般消費 3% 無上限，需電子帳單或富邦帳戶自扣；其他國家 1%。實體加碼 3%（登錄、上限 1,000 元／季）不計入' },
  { name: '吉鶴卡', bank: '聯邦銀行', scopes: ['jp'], rate: 2.5, note: '日幣消費 2.5% 回饋無上限；日本實體與指定商店加碼不計入' },
  { name: '熊本熊日圓雙幣卡', bank: '玉山銀行', scopes: ['jp'], rate: 2.5, note: '日本消費 2.5% 回饋無上限；指定日本商店加碼 6%（每期上限 500 元）不計入' },
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
          <p>淨回饋 = 卡片回饋 − 海外交易手續費。回饋率取各卡常態可達的水準，限時登錄加碼與新戶加碼不計入。</p>
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
        <p class="mt-1 text-xs leading-5 text-amber-700">刷卡機問你要不要用台幣結帳時，選「當地貨幣」。選台幣就是啟動 DCC 動態貨幣轉換，匯率由當地收單行決定、加價常達 4% 以上，足以吃掉上面全部淨回饋。</p>
      </div>

      <div class="calculator-grid">
        <label class="field field--result">
          <span>海外消費金額（新台幣）</span>
          <input v-model.number="amount" type="number" min="0" step="1000" inputmode="numeric" />
          <small>請以帳單台幣金額輸入；帳單若是外幣金額，請先換算成台幣再填。</small>
        </label>
        <label class="field">
          <span>海外交易手續費率（%）</span>
          <input v-model.number="feeRate" type="number" min="0" max="5" step="0.1" inputmode="decimal" />
          <small>多數銀行收 1.5%（國際發卡組織 1%＋銀行 0.5%）；部分卡別或幣別不同，可自行修改。</small>
        </label>
        <div class="field" style="grid-column: 1 / -1;">
          <span>目的地</span>
          <div class="flex flex-wrap gap-2" role="group" aria-label="目的地">
            <button v-for="d in destinations" :key="d.value" type="button" class="seg-btn" :class="{ 'seg-btn--active': destination === d.value }" @click="destination = d.value">{{ d.label }}</button>
          </div>
        </div>
      </div>

      <div v-if="best && amount > 0" class="summary-strip" aria-live="polite">
        <span>淨回饋最高 <strong>{{ best.bank }} {{ best.name }}</strong></span>
        <span>回饋 {{ formatTWD(best.rebate) }} − 手續費 {{ formatTWD(best.fee) }}</span>
        <span v-if="best.net >= 0">淨拿回 <strong>{{ formatTWD(best.net) }}</strong>（淨回饋率 {{ best.netRate.toFixed(1) }}%）</span>
        <span v-else>最少虧損 <strong>{{ formatTWD(-best.net) }}</strong>（淨回饋率 {{ best.netRate.toFixed(1) }}%）</span>
      </div>

      <p v-if="globalOnly" class="mt-4 rounded-lg bg-[#EDF5EF] px-4 py-3 text-sm leading-6 text-[#25231F]">此目的地只列不限國家的卡片；日韓泰專屬卡（J 卡、一卡通聯名卡、吉鶴卡、熊本熊卡）在其他國家不適用表列回饋率。</p>

      <div class="overflow-x-auto">
        <table class="calc-table">
          <caption>海外刷卡淨回饋排行（依淨回饋金額排序）</caption>
          <thead>
            <tr><th scope="col">卡片</th><th scope="col">回饋率</th><th scope="col">回饋金額</th><th scope="col">手續費</th><th scope="col">淨回饋</th><th scope="col">條件摘要</th></tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="row.name" :class="{ 'row-total': i === 0 }">
              <td><strong>{{ row.bank }} {{ row.name }}</strong><br /><span class="text-xs">{{ row.scopes.includes('global') ? '不限國家' : '限定國家專屬' }}</span></td>
              <td>{{ row.rate.toFixed(1) }}%</td>
              <td>{{ formatTWD(row.rebate) }}</td>
              <td>−{{ formatTWD(row.fee) }}</td>
              <td><strong>{{ formatTWD(row.net) }}</strong><br /><span class="text-xs">淨 {{ row.netRate.toFixed(1) }}%</span></td>
              <td class="text-xs leading-5">{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-sm leading-6 text-[var(--color-muted)]">
        回饋率資料日期：2026 年 10 月 22 日，來源為各銀行公開權益公告與新聞稿彙整（卡優新聞網 2026 海外信用卡彙整、袋鼠金融依富邦官網查核、台新與聯邦銀行新聞稿）。信用卡權益每季調整，回饋率、上限與適用通路以各銀行官網最新公告為準；點數型回饋（台新 Point、小樹點、LINE Points）以 1 點約等於 1 元估算，實際價值依各銀行折抵規則。
      </p>
    </section>
  </div>
</template>

<style scoped>
.seg-btn { border: 1px solid #d7e3da; background: #fff; color: #25231F; border-radius: 999px; padding: 0.45rem 0.9rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.seg-btn--active { background: #245F40; border-color: #245F40; color: #fff; }
</style>
