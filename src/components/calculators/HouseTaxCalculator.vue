<script setup lang="ts">
import { computed, ref } from 'vue';
import SnapshotButton from '../SnapshotButton.vue';
import ThousandsInput from '../ThousandsInput.vue';
import { vSyncChange } from '../../utils/vueSyncChange';

const formatTWD = (n: number) => 'NT$' + Math.round(Number(n) || 0).toLocaleString('zh-TW');

type CityGroup = 'metro' | 'nonmetro';
type Usage = 'self' | 'single' | 'rental' | 'nonowner';

const ASSESSED_CAP = 1000000000;

const assessedValue = ref<number | null>(1000000);
const group = ref<CityGroup>('metro');
const usage = ref<Usage>('self');
const households = ref(2);

// 評定現值防呆：0／留空／負數為無效（結果區隱藏、不靜默算 $0）；
// 超過 10 億只警告、按上限計算、結果照常顯示
const assessedError = computed(() => {
  const v = assessedValue.value;
  if (v === null || v === undefined || v === 0) return '請輸入房屋評定現值';
  if (v < 0) return '評定現值不可為負數';
  if (v > ASSESSED_CAP) return '評定現值上限 10 億元，請確認數字';
  return '';
});
const assessedInvalid = computed(
  () => assessedValue.value === null || assessedValue.value === undefined || assessedValue.value <= 0,
);

// 輸入欄的 min/max 只是 HTML 屬性，打字可越過：計算一律用箝制值（現值 ≥0 且 ≤10 億、戶數 ≥1 且取整）；
// 無效現值時內部算 0，但結果區已隱藏、不會把 $0 當成試算結果顯示
const safeAssessed = computed(() => {
  const v = assessedValue.value;
  if (v === null || v === undefined || v <= 0) return 0;
  return Math.min(v, ASSESSED_CAP);
});
const safeCount = computed(() => Math.max(1, Math.round(Number(households.value) || 1)));

const usages: { value: Usage; label: string }[] = [
  { value: 'self', label: '自住' },
  { value: 'single', label: '單一自住' },
  { value: 'rental', label: '出租達標' },
  { value: 'nonowner', label: '非自住' },
];

// 其他住家用差別稅率：財政部公告範本，六都（直轄市組）與臺北市政府公告一致。
function nonownerRate(g: CityGroup, count: number): number {
  if (g === 'metro') {
    if (count <= 2) return 3.2;
    if (count <= 4) return 3.8;
    if (count <= 6) return 4.2;
    return 4.8;
  }
  if (count <= 1) return 2.6;
  if (count <= 4) return 3.2;
  if (count <= 6) return 3.8;
  return 4.8;
}

// 出租申報達標／繼承共有：全國同類戶數級距（不分縣市組）。
function rentalRate(count: number): number {
  if (count <= 4) return 1.5;
  if (count <= 6) return 2.0;
  return 2.4;
}

const needsCount = computed(() => usage.value === 'rental' || usage.value === 'nonowner');

const rate = computed(() => {
  if (usage.value === 'self') return 1.2;
  if (usage.value === 'single') return 1.0;
  if (usage.value === 'rental') return rentalRate(safeCount.value);
  return nonownerRate(group.value, safeCount.value);
});

const tax = computed(() => Math.round(safeAssessed.value * rate.value / 100));
const selfTax = computed(() => Math.round(safeAssessed.value * 1.2 / 100));
const singleTax = computed(() => Math.round(safeAssessed.value * 1.0 / 100));
const extraVsSelf = computed(() => tax.value - selfTax.value);

const usageLabel = computed(() => usages.find((u) => u.value === usage.value)?.label ?? '');
const groupLabel = computed(() => group.value === 'metro' ? '直轄市（六都）' : '其他縣市（非直轄市組）');

// 要件只留重點：短句條列，不寫成段落
const notes = computed((): string[] => {
  if (usage.value === 'self') return ['無出租、無營業使用', '本人／配偶／直系親屬實際居住＋設籍', '本人＋配偶＋未成年子女全國 ≤3 戶', '超過 3 戶改按非自住稅率'];
  if (usage.value === 'single') return ['全國僅 1 戶自住', '完成戶籍登記', '現值低於各縣市公告金額', '門檻各縣市不同，洽稅捐處確認'];
  if (usage.value === 'rental') return ['申報租賃所得達一般租金標準，或繼承共有', '稅率 1.5%～2.4%：4 戶以內 1.5%、5～6 戶 2.0%、7 戶以上 2.4%', '不併入非自住戶數', '公益出租／社宅包租代管 1.2%'];
  return ['全數累進：落在哪級，全部房屋都按該級', '戶數＝本人＋配偶＋未成年子女全國合計'];
});
</script>

<template>
  <div class="calculator-shell">
    <section class="calculator-card" aria-label="房屋稅 2.0 試算器">
      <div class="calculator-toolbar">
        <div>
          <h2>輸入房屋資料</h2>
          <p>房屋評定現值不是市價，可在房屋稅稅單或房屋稅籍證明上查到。</p>
        </div>
        <SnapshotButton
          v-if="!assessedInvalid"
          tool-name="房屋稅 2.0 試算"
          :metrics="[
            { label: '房屋評定現值', value: formatTWD(safeAssessed) },
            { label: '縣市組別', value: groupLabel },
            { label: '使用類別', value: usageLabel },
            { label: '適用稅率', value: `${rate}%` },
            { label: '預估年稅額', value: formatTWD(tax) },
          ]"
        />
      </div>

      <div class="calculator-grid">
        <label class="field field--result">
          <span>房屋評定現值（元）</span>
          <ThousandsInput v-model="assessedValue" id="house-tax-assessed" aria-label="房屋評定現值" />
          <p v-if="assessedError" class="mt-1.5 text-xs font-medium text-[#B3261E]">{{ assessedError }}</p>
        </label>
        <div class="field">
          <span>房屋所在縣市</span>
          <div class="flex flex-wrap gap-2" role="group" aria-label="縣市組別">
            <button type="button" class="seg-btn" :class="{ 'seg-btn-active': group === 'metro' }" @click="group = 'metro'">六都</button>
            <button type="button" class="seg-btn" :class="{ 'seg-btn-active': group === 'nonmetro' }" @click="group = 'nonmetro'">其他縣市</button>
          </div>
          <small>六都：臺北、新北、桃園、臺中、臺南、高雄</small>
        </div>
        <div class="field" style="grid-column: 1 / -1;">
          <span>使用類別</span>
          <div class="flex flex-wrap gap-2" role="group" aria-label="使用類別">
            <button v-for="u in usages" :key="u.value" type="button" class="seg-btn" :class="{ 'seg-btn-active': usage === u.value }" @click="usage = u.value">{{ u.label }}</button>
          </div>
        </div>
        <label v-if="needsCount" class="field">
          <span>全國戶數（本人＋配偶＋未成年子女）</span>
          <input v-model.number="households" type="number" min="1" max="99" step="1" inputmode="numeric" v-sync-change />
        </label>
      </div>

      <ul class="mt-4 border-l-2 border-[#A58436] pl-4 py-1 text-sm leading-6 text-[#25231F]">
        <li v-for="n in notes" :key="n" class="flex gap-1.5"><span aria-hidden="true">・</span><span>{{ n }}</span></li>
      </ul>

      <template v-if="!assessedInvalid">
      <div class="summary-strip" aria-live="polite">
        <span class="summary-main">適用稅率 <strong>{{ rate }}%</strong>・年稅額 <strong>{{ formatTWD(tax) }}</strong></span>
        <span v-if="usage !== 'self'">同現值自住（1.2%）<strong>{{ formatTWD(selfTax) }}</strong></span>
        <span v-if="extraVsSelf > 0">比自住多繳 <strong>{{ formatTWD(extraVsSelf) }}／年</strong></span>
      </div>

      <div class="overflow-x-auto">
        <table class="calc-table">
          <caption>同現值，四種類別年稅額對照</caption>
          <thead>
            <tr><th scope="col">使用類別</th><th scope="col">稅率</th><th scope="col">年稅額</th></tr>
          </thead>
          <tbody>
            <tr :class="{ 'row-total': usage === 'single' }"><td>全國單一自住</td><td>1.0%</td><td>{{ formatTWD(singleTax) }}</td></tr>
            <tr :class="{ 'row-total': usage === 'self' }"><td>自住（3 戶以內）</td><td>1.2%</td><td>{{ formatTWD(selfTax) }}</td></tr>
            <tr :class="{ 'row-total': usage === 'rental' }"><td>出租達標／繼承共有</td><td>{{ rentalRate(safeCount) }}%</td><td>{{ formatTWD(Math.round(safeAssessed * rentalRate(safeCount) / 100)) }}</td></tr>
            <tr :class="{ 'row-total': usage === 'nonowner' }"><td>非自住</td><td>{{ nonownerRate(group, safeCount) }}%</td><td>{{ formatTWD(Math.round(safeAssessed * nonownerRate(group, safeCount) / 100)) }}</td></tr>
          </tbody>
        </table>
      </div>
      </template>
      <div v-else class="mt-4 border-l-2 border-[#A58436] pl-4 py-1">
        <p class="text-sm font-semibold text-[#25231F]">請先修正上方輸入再試算</p>
      </div>

      <p class="mt-4 text-sm leading-6 text-[var(--color-muted)]">
        稅率依財政部差別稅率範本（房屋稅 2.0，113/7/1 施行）；各縣市實際徵收率以自治條例為準，稅額以稅單為準。資料 2026-10。
      </p>
    </section>
  </div>
</template>

<style scoped>
/* 縣市／使用類別兩組 seg-btn：只在本元件覆寫 .book-tool 的底線式樣式（不動 global.css）。
   全站 .book-tool .seg-btn 用 padding .25rem 0 !important＋透明底、只靠底線區分選中；
   這裡以更高特異度（.book-tool .seg-btn[data-v-hash]）＋ !important 蓋過，觸控目標 ≥44px、選中有深綠底白字。 */
.book-tool .seg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.625rem 1rem !important;
  border: 1px solid #d8d2c2 !important;
  border-radius: 0.75rem !important;
  background: #fffdf7 !important;
  box-shadow: none !important;
}

.book-tool .seg-btn-active,
.book-tool .calculator-shell .seg-btn-active {
  background: #1d4b34 !important;
  color: #fffdf7 !important;
  border-color: #1d4b34 !important;
  border-bottom-color: #1d4b34 !important;
  font-weight: 700 !important;
  box-shadow: none !important;
}
</style>
