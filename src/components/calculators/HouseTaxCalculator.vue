<script setup lang="ts">
import { computed, ref } from 'vue';
import SnapshotButton from '../SnapshotButton.vue';

const formatTWD = (n: number) => 'NT$ ' + Math.round(Number(n) || 0).toLocaleString('zh-TW');

type CityGroup = 'metro' | 'nonmetro';
type Usage = 'self' | 'single' | 'rental' | 'nonowner';

const assessedValue = ref(1000000);
const group = ref<CityGroup>('metro');
const usage = ref<Usage>('self');
const households = ref(2);

// 輸入欄的 min/max 只是 HTML 屬性，打字可越過：計算一律用箝制值（現值 ≥0、戶數 ≥1 且取整）
const safeAssessed = computed(() => Math.max(Number(assessedValue.value) || 0, 0));
const safeCount = computed(() => Math.max(1, Math.round(Number(households.value) || 1)));

const usages: { value: Usage; label: string }[] = [
  { value: 'self', label: '自住（全國 3 戶以內）' },
  { value: 'single', label: '全國單一自住' },
  { value: 'rental', label: '出租申報達標／繼承共有' },
  { value: 'nonowner', label: '非自住（其他住家用）' },
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

const notes = computed(() => {
  if (usage.value === 'self') return '自住要件：無出租、無供營業使用；本人、配偶或直系親屬實際居住並辦竣戶籍登記；本人＋配偶＋未成年子女全國合計 3 戶以內。超過 3 戶的部分改按非自住稅率。';
  if (usage.value === 'single') return '全國單一自住要件：本人、配偶及未成年子女全國僅持有 1 戶自住房屋、完成戶籍登記，且房屋現值低於各縣市公告的一定金額。現值門檻各縣市不同，請向房屋所在地稅捐稽徵處確認。';
  if (usage.value === 'rental') return '出租房屋須申報租賃所得且達到當地一般租金標準，或屬繼承取得的共有房屋，才適用 1.5%～2.4%；這類房屋不併入非自住的戶數計算。公益出租人與社會住宅包租代管另適用 1.2%。';
  return '非自住採「全數累進」：全國戶數落在某個級距，全部房屋都按該級距稅率課徵，不是分段計算。戶數以本人＋配偶＋未成年子女全國持有合計。';
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
          <input v-model.number="assessedValue" type="number" min="0" step="10000" inputmode="numeric" />
        </label>
        <div class="field">
          <span>房屋所在縣市</span>
          <div class="flex flex-wrap gap-2" role="group" aria-label="縣市組別">
            <button type="button" class="seg-btn" :class="{ 'seg-btn--active': group === 'metro' }" @click="group = 'metro'">六都（臺北／新北／桃園／臺中／臺南／高雄）</button>
            <button type="button" class="seg-btn" :class="{ 'seg-btn--active': group === 'nonmetro' }" @click="group = 'nonmetro'">其他縣市</button>
          </div>
        </div>
        <div class="field" style="grid-column: 1 / -1;">
          <span>使用類別</span>
          <div class="flex flex-wrap gap-2" role="group" aria-label="使用類別">
            <button v-for="u in usages" :key="u.value" type="button" class="seg-btn" :class="{ 'seg-btn--active': usage === u.value }" @click="usage = u.value">{{ u.label }}</button>
          </div>
        </div>
        <label v-if="needsCount" class="field">
          <span>{{ usage === 'rental' ? '全國出租達標／繼承共有戶數' : '全國非自住住家戶數' }}（本人＋配偶＋未成年子女合計）</span>
          <input v-model.number="households" type="number" min="1" max="99" step="1" inputmode="numeric" />
        </label>
      </div>

      <p class="mt-4 rounded-lg bg-[#EDF5EF] px-4 py-3 text-sm leading-6 text-[#25231F]">{{ notes }}</p>

      <div class="summary-strip" aria-live="polite">
        <span>適用稅率 <strong>{{ rate }}%</strong></span>
        <span>預估年稅額 <strong>{{ formatTWD(tax) }}</strong></span>
        <span v-if="usage !== 'self'">同現值自住（1.2%）<strong>{{ formatTWD(selfTax) }}</strong></span>
        <span v-if="extraVsSelf > 0">比自住多繳 <strong>{{ formatTWD(extraVsSelf) }}／年</strong></span>
      </div>

      <div class="overflow-x-auto">
        <table class="calc-table">
          <caption>同一個房屋現值，四種使用類別的年稅額對照</caption>
          <thead>
            <tr><th scope="col">使用類別</th><th scope="col">稅率</th><th scope="col">年稅額</th></tr>
          </thead>
          <tbody>
            <tr :class="{ 'row-total': usage === 'single' }"><td>全國單一自住</td><td>1.0%</td><td>{{ formatTWD(singleTax) }}</td></tr>
            <tr :class="{ 'row-total': usage === 'self' }"><td>自住（3 戶以內）</td><td>1.2%</td><td>{{ formatTWD(selfTax) }}</td></tr>
            <tr :class="{ 'row-total': usage === 'rental' }"><td>出租申報達標／繼承共有（目前戶數）</td><td>{{ rentalRate(safeCount) }}%</td><td>{{ formatTWD(Math.round(safeAssessed * rentalRate(safeCount) / 100)) }}</td></tr>
            <tr :class="{ 'row-total': usage === 'nonowner' }"><td>非自住（目前縣市組與戶數）</td><td>{{ nonownerRate(group, safeCount) }}%</td><td>{{ formatTWD(Math.round(safeAssessed * nonownerRate(group, safeCount) / 100)) }}</td></tr>
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-sm leading-6 text-[var(--color-muted)]">
        稅率採財政部公告的差別稅率範本（房屋稅 2.0，113 年 7 月 1 日施行；直轄市組級距經臺北市政府公告稅率表交叉核對）。各縣市實際徵收率由自治條例訂定，可能與範本不同，實際稅額以房屋所在地稅捐稽徵處核定的稅單為準。年度中取得或拆除者按月比例計課，本工具以全年計。資料日期：2026 年 10 月。
      </p>
    </section>
  </div>
</template>

<style scoped>
.seg-btn { border: 1px solid #d7e3da; background: #fff; color: #25231F; border-radius: 999px; padding: 0.45rem 0.9rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.seg-btn--active { background: #245F40; border-color: #245F40; color: #fff; }
</style>
