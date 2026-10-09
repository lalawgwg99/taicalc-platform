<template>
  <div class="calculator-shell">
    <!-- Main Calculator Card -->
    <div class="calculator-card">
      
      <!-- Tabs -->
      <div class="seg-control mb-6">
        <button 
          @click="activeTab = 'basic'"
          :class="['seg-btn', activeTab === 'basic' ? 'seg-btn-active' : '']"
        >
          租金試算
        </button>
        <button 
          @click="activeTab = 'subsidy'"
          :class="['seg-btn', activeTab === 'subsidy' ? 'seg-btn-active' : '']"
        >
          租金補貼查詢
        </button>
      </div>

      <!-- Tab: Basic Calculator -->
      <div v-if="activeTab === 'basic'" class="calculator-shell">
        <div>
          <label for="monthlyRent" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
            每個月租金 (NT$)
          </label>
          <div class="relative">
            <input
              id="monthlyRent"
              type="text" inputmode="decimal"
              v-model.number="monthlyRent"
              class="w-full bg-paper-50 border border-ink-100 rounded-xl py-3 px-4 text-ink-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="depositMonths" class="block text-xs font-semibold text-ink-400 mb-2">押金 (月)</label>
            <input
              id="depositMonths"
              type="text" inputmode="decimal"
              v-model.number="depositMonths"
              class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label for="leaseMonths" class="block text-xs font-semibold text-ink-400 mb-2">預計租期 (月)</label>
            <input
              id="leaseMonths"
              type="text" inputmode="decimal"
              v-model.number="leaseMonths"
              class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="managementFee" class="block text-xs font-semibold text-ink-400 mb-2">管理費 (月)</label>
            <div class="relative">
              <input
                id="managementFee"
                type="text" inputmode="decimal"
                v-model.number="managementFee"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
          <div>
            <label for="electricityFee" class="block text-xs font-semibold text-ink-400 mb-2">預估水電 (月)</label>
            <div class="relative">
              <input
                id="electricityFee"
                type="text" inputmode="decimal"
                v-model.number="electricityFee"
                class="w-full bg-paper-50 border border-ink-100 rounded-xl py-2.5 px-3 text-ink-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <!-- 結果 -->
        <div class="calculator-subcard md:p-6">
          <div class="text-center mb-6">
            <p class="text-xs text-ink-400 font-bold uppercase tracking-wider mb-2">實際每月支出</p>
            <p class="text-4xl sm:text-5xl font-bold text-ink-800 font-mono tracking-tight">
              <span class="text-2xl text-ink-400 align-top mr-1">$</span>{{ actualMonthly }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-center pt-6 border-t border-ink-100">
            <div>
              <p class="text-xs text-ink-400 mb-1">押金總額（會退回）</p>
              <p class="text-lg font-bold text-ink-600 font-mono">${{ depositTotal }}</p>
            </div>
            <div>
              <p class="text-xs text-ink-400 mb-1">押金少賺的利息</p>
              <p class="text-lg font-bold text-amber-600 font-mono">
                ${{ depositCost }}<span class="text-xs text-ink-400 font-normal">/年</span>
              </p>
            </div>
          </div>

          <div class="text-center pt-6 mt-6 border-t border-ink-100">
            <p class="text-xs text-ink-400 mb-2">整個租期總支出 ({{ leaseMonths }}個月)</p>
            <p class="text-2xl font-bold text-ink-800 font-mono">NT$ {{ totalCost }}</p>
          </div>
        </div>

        <div class="text-center bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p class="text-sm text-amber-800 font-medium">💡 小知識：押金少賺的利息以年化 2% 計算</p>
          <p class="text-xs text-amber-600/70 mt-1">這筆錢如果拿去定存或投資，每年本應產生的收益。</p>
        </div>
      </div>

      <!-- Tab: Subsidy Checker -->
      <div v-else-if="activeTab === 'subsidy'" class="calculator-shell">
        <!-- 資格檢查：4 題都答「是」才能領 -->
        <div>
          <h3 class="text-xl font-semibold text-ink-800 mb-1">先確認你符合資格</h3>
          <p class="text-sm text-ink-500 leading-relaxed mb-5">4 個問題，有一題答「否」就先處理那個問題，不用往下算。</p>
          <div class="space-y-5">
            <div v-for="q in eligQuestions" :key="q.key">
              <p class="block text-base font-medium text-ink-800 mb-2">{{ q.label }}</p>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" @click="elig[q.key] = true"
                  :class="['h-12 rounded-xl text-base font-semibold border transition-all', elig[q.key] === true ? 'bg-brand-600 text-paper-50 border-brand-600' : 'bg-paper-50 text-ink-700 border-ink-200']">是</button>
                <button type="button" @click="elig[q.key] = false"
                  :class="['h-12 rounded-xl text-base font-semibold border transition-all', elig[q.key] === false ? 'bg-red-600 text-paper-50 border-red-600' : 'bg-paper-50 text-ink-700 border-ink-200']">否</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡關：紅字告知原因＋解法 -->
        <div v-if="eligibilityBlocker" class="rounded-xl border-l-4 border-red-600 bg-red-50 p-4">
          <p class="text-base font-semibold text-red-800 mb-1">這題卡住了：{{ eligibilityBlocker.reason }}</p>
          <p class="text-sm text-red-700 leading-relaxed">{{ eligibilityBlocker.fix }}</p>
        </div>

        <!-- 還沒答完的空狀態 -->
        <div v-else-if="!eligibilityDone" class="text-center py-4">
          <p class="text-sm text-ink-500">上面 4 題都回答後，開始幫你試算。</p>
        </div>

        <!-- 試算 -->
        <div v-else class="space-y-5">
          <div>
            <label for="sub-rent" class="block text-base font-medium text-ink-800 mb-2">每個月租金多少？</label>
            <div class="relative">
              <input id="sub-rent" type="text" inputmode="decimal" v-model.number="monthlyRent" placeholder="例如：15000"
                class="w-full h-12 bg-paper-50 border border-ink-200 rounded-xl pl-4 pr-12 text-ink-800 text-base font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-base text-ink-500">元</span>
            </div>
            <p class="text-sm text-ink-500 mt-1.5">補貼不會超過你的實付租金。</p>
          </div>

          <div>
            <label for="sub-loc" class="block text-base font-medium text-ink-800 mb-2">房子在哪個縣市？</label>
            <select id="sub-loc" v-model="subsidyLocation"
              class="w-full h-12 bg-paper-50 border border-ink-200 rounded-xl px-3 text-ink-800 text-base font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
              <option value="Taipei">台北市</option>
              <option value="NewTaipei">新北市</option>
              <option value="Taoyuan">桃園市</option>
              <option value="Taichung">台中市主要行政區</option>
              <option value="Tainan">台南市主要行政區</option>
              <option value="Kaohsiung">高雄市主要行政區</option>
              <option value="Hsinchu">新竹縣市</option>
              <option value="Other">其他縣市</option>
            </select>
          </div>

          <div>
            <p class="block text-base font-medium text-ink-800 mb-2">符合下面哪些身分？<span class="font-normal text-sm text-ink-500">可複選，自動用最高的加碼</span></p>
            <div class="flex flex-wrap gap-2">
              <button v-for="opt in identityOptions" :key="opt.key" type="button"
                @click="identityChecks[opt.key] = !identityChecks[opt.key]"
                :class="['h-10 px-4 rounded-full text-base font-medium border transition-all', identityChecks[opt.key] ? 'bg-brand-600 text-paper-50 border-brand-600' : 'bg-paper-50 text-ink-700 border-ink-200']">{{ opt.label }}</button>
            </div>
            <div v-if="identityChecks.newlywed" class="mt-3">
              <p class="text-sm text-ink-500 mb-2">什麼時候結婚的？</p>
              <div class="flex flex-wrap gap-2">
                <button type="button" @click="identityChecks.newlywedYear = '2025'"
                  :class="['h-10 px-4 rounded-full text-base font-medium border transition-all', identityChecks.newlywedYear === '2025' ? 'bg-brand-600 text-paper-50 border-brand-600' : 'bg-paper-50 text-ink-700 border-ink-200']">2025 年底前（1.3 倍）</button>
                <button type="button" @click="identityChecks.newlywedYear = '2026'"
                  :class="['h-10 px-4 rounded-full text-base font-medium border transition-all', identityChecks.newlywedYear === '2026' ? 'bg-brand-600 text-paper-50 border-brand-600' : 'bg-paper-50 text-ink-700 border-ink-200']">2026 年起（1.5 倍）</button>
              </div>
            </div>
            <div v-if="identityChecks.hasChildren" class="mt-3">
              <p class="text-sm text-ink-500 mb-2">未成年子女幾人？</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="n in [1, 2, 3]" :key="n" type="button" @click="identityChecks.childCount = n"
                  :class="['h-10 px-4 rounded-full text-base font-medium border transition-all', identityChecks.childCount === n ? 'bg-brand-600 text-paper-50 border-brand-600' : 'bg-paper-50 text-ink-700 border-ink-200']">{{ n === 3 ? '3 人以上' : n + ' 人' }}（{{ n === 3 ? '1.8' : n === 2 ? '1.6' : '1.4' }} 倍）</button>
              </div>
            </div>
            <div v-if="identityChecks.newborn2026" class="mt-3">
              <p class="text-sm text-ink-500 mb-2">2026 年起出生的寶寶幾人？</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="n in [1, 2, 3]" :key="n" type="button" @click="identityChecks.newbornCount = n"
                  :class="['h-10 px-4 rounded-full text-base font-medium border transition-all', identityChecks.newbornCount === n ? 'bg-brand-600 text-paper-50 border-brand-600' : 'bg-paper-50 text-ink-700 border-ink-200']">{{ n === 3 ? '3 人以上' : n + ' 人' }}（{{ n === 3 ? '3' : n === 2 ? '2.5' : '2' }} 倍）</button>
              </div>
            </div>
            <p v-if="appliedMultiplier.multi > 1" class="text-sm text-brand-700 font-medium mt-3">已自動選用最高加碼：{{ appliedMultiplier.label }}（{{ appliedMultiplier.multi }} 倍）</p>
          </div>

          <!-- 結果：結論先行，深色卡 -->
          <div class="calculator-card-dark">
            <p class="text-base font-semibold text-paper-50 mb-3">試算結果：你每月約可領下面這個金額</p>
            <p class="text-4xl font-bold text-paper-50 tabular-nums mb-1">NT$ {{ estimatedSubsidyText }}</p>
            <p class="text-sm text-paper-200 mb-4">實付房租從 NT$ {{ rentText }} 降到 NT$ {{ afterText }}</p>
            <div class="border-t border-paper-200/20 pt-3 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-paper-200">基本額（{{ locationLabel }}）</span>
                <span class="text-paper-50 tabular-nums font-medium">NT$ {{ baseText }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-paper-200">加碼倍數（{{ appliedMultiplier.label }}）</span>
                <span class="text-paper-50 tabular-nums font-medium">× {{ appliedMultiplier.multi }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-paper-200">補貼不超過實付租金</span>
                <span class="text-paper-50 tabular-nums font-medium">NT$ {{ rentText }}</span>
              </div>
            </div>
            <p class="text-sm text-paper-200 leading-relaxed mt-4">實際資格與金額以政府核定為準。依據 300 億元中央擴大租金補貼專案估算。</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const activeTab = ref('basic');
const monthlyRent = ref(15000);
const depositMonths = ref(2); 
const leaseMonths = ref(12); // Default 1 year
const managementFee = ref(1000);
const electricityFee = ref(1000);

// ---- 租金補貼：資格檢查（4 題都「是」才能領） ----
const eligQuestions = [
  { key: 'age', label: '你滿 18 歲，而且有中華民國戶籍嗎？' },
  { key: 'noHouse', label: '你和家人（配偶、未成年子女）名下都沒有房子嗎？' },
  { key: 'noOtherSubsidy', label: '你沒有領其他住宅補助（社會住宅、包租代管等）嗎？' },
  { key: 'legalHouse', label: '你租的是合法住宅（不是頂加、違建）嗎？' },
];
const elig = ref({ age: null, noHouse: null, noOtherSubsidy: null, legalHouse: null });

const eligibilityBlocker = computed(() => {
  const e = elig.value;
  if (e.age === false) return { reason: '年齡或戶籍不符', fix: '要年滿 18 歲且設有戶籍才能申請。' };
  if (e.noHouse === false) return { reason: '名下有自有住宅', fix: '家庭成員名下不能有自有住宅，先處理這題再來算。' };
  if (e.noOtherSubsidy === false) return { reason: '已領其他住宅補助', fix: '同一個家庭不能同時領兩種住宅補助。' };
  if (e.legalHouse === false) return { reason: '租的不是合法住宅', fix: '新申請戶要租合法住宅（有房屋稅籍或保存登記）才行；頂加違建無法申請，建議先換合法租屋再試算。' };
  return null;
});
const eligibilityDone = computed(() => Object.values(elig.value).every((v) => v !== null));

// ---- 租金補貼：身分加碼（可複選，自動擇高） ----
const subsidyLocation = ref('Taipei');

const baseSubsidyMap = {
    Taipei: 3000,
    NewTaipei: 2400,
    Taoyuan: 2400,
    Taichung: 2400,
    Tainan: 2200,
    Kaohsiung: 2200,
    Hsinchu: 2400,
    Other: 2000
};
const locationLabels = {
    Taipei: '台北市',
    NewTaipei: '新北市',
    Taoyuan: '桃園市',
    Taichung: '台中市主要行政區',
    Tainan: '台南市主要行政區',
    Kaohsiung: '高雄市主要行政區',
    Hsinchu: '新竹縣市',
    Other: '其他縣市'
};

const identityChecks = ref({
  singleU40: false,
  newlywed: false,
  newlywedYear: '2025',
  hasChildren: false,
  childCount: 1,
  newborn2026: false,
  newbornCount: 1,
  lowIncome: false,
});
const identityOptions = [
  { key: 'singleU40', label: '單身未滿 40 歲' },
  { key: 'newlywed', label: '2 年內結婚' },
  { key: 'hasChildren', label: '有未成年子女' },
  { key: 'newborn2026', label: '2026 年起有新生兒' },
  { key: 'lowIncome', label: '中低收入戶' },
];

const appliedMultiplier = computed(() => {
  const c = identityChecks.value;
  let best = { multi: 1, label: '無加碼' };
  const consider = (multi, label) => { if (multi > best.multi) best = { multi, label }; };
  if (c.singleU40) consider(1.2, '單身未滿 40 歲');
  if (c.newlywed) consider(c.newlywedYear === '2026' ? 1.5 : 1.3, c.newlywedYear === '2026' ? '2026 年起結婚' : '2025 年底前結婚');
  if (c.hasChildren) consider(c.childCount >= 3 ? 1.8 : c.childCount === 2 ? 1.6 : 1.4, c.childCount >= 3 ? '3 名以上未成年子女' : c.childCount + ' 名未成年子女');
  if (c.newborn2026) consider(c.newbornCount >= 3 ? 3 : c.newbornCount === 2 ? 2.5 : 2, c.newbornCount >= 3 ? '3 名以上新生兒' : c.newbornCount + ' 名新生兒');
  if (c.lowIncome) consider(1.4, '中低收入戶');
  return best;
});

const locationLabel = computed(() => locationLabels[subsidyLocation.value] || '其他縣市');
const baseText = computed(() => (baseSubsidyMap[subsidyLocation.value] || 2000).toLocaleString());
const rawSubsidy = computed(() => Math.round((baseSubsidyMap[subsidyLocation.value] || 2000) * appliedMultiplier.value.multi));
// 115 年規則：補貼不得超過當月實付租金
const estimatedSubsidyNum = computed(() => Math.min(rawSubsidy.value, monthlyRent.value || 0));
const estimatedSubsidyText = computed(() => estimatedSubsidyNum.value.toLocaleString());
const rentText = computed(() => (monthlyRent.value || 0).toLocaleString());
const afterText = computed(() => Math.max((monthlyRent.value || 0) - estimatedSubsidyNum.value, 0).toLocaleString());

// Basic Calcs
const actualMonthly = computed(() =>
  ((monthlyRent.value || 0) + (managementFee.value || 0) + (electricityFee.value || 0)).toLocaleString()
);
const depositTotal = computed(() => ((monthlyRent.value || 0) * (depositMonths.value || 0)).toLocaleString());
const depositCost = computed(() => {
  const deposit = (monthlyRent.value || 0) * (depositMonths.value || 0);
  return Math.round(deposit * 0.02).toLocaleString();
});
const totalCost = computed(() => {
  const monthly = (monthlyRent.value || 0) + (managementFee.value || 0) + (electricityFee.value || 0);
  return (monthly * (leaseMonths.value || 0)).toLocaleString();
});

// Auto-save for Dashboard
watch(actualMonthly, (newVal) => {
  const val = parseInt(newVal.replace(/,/g, ''));
  if (val > 0) {
    localStorage.setItem('taicalc_rent_monthly', val);
  } else {
    localStorage.removeItem('taicalc_rent_monthly');
  }
});

// Persistence
onMounted(() => {
  const saved = localStorage.getItem('taicalc_rent_inputs');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.monthlyRent) monthlyRent.value = data.monthlyRent;
      if (data.depositMonths) depositMonths.value = data.depositMonths;
      if (data.leaseMonths) leaseMonths.value = data.leaseMonths;
      if (data.managementFee) managementFee.value = data.managementFee;
      if (data.electricityFee) electricityFee.value = data.electricityFee;
    } catch (e) {}
  }
});

watch(
  [monthlyRent, depositMonths, leaseMonths, managementFee, electricityFee],
  (vals) => {
    localStorage.setItem(
      'taicalc_rent_inputs',
      JSON.stringify({
        monthlyRent: vals[0],
        depositMonths: vals[1],
        leaseMonths: vals[2],
        managementFee: vals[3],
        electricityFee: vals[4],
      })
    );
  }
);
</script>
