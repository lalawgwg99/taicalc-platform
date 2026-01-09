<template>
  <div class="card bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
    <!-- Tabs -->
    <div class="flex border-b border-stone-200">
      <button
        @click="mode = 'irr'"
        class="flex-1 py-3 text-sm font-bold text-center transition-colors relative"
        :class="mode === 'irr' ? 'text-amber-600 bg-amber-50/50' : 'text-stone-500 hover:bg-stone-50'"
      >
        儲蓄險 IRR 試算
        <div v-if="mode === 'irr'" class="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600"></div>
      </button>
      <button
        @click="mode = 'needs'"
        class="flex-1 py-3 text-sm font-bold text-center transition-colors relative"
        :class="mode === 'needs' ? 'text-blue-600 bg-blue-50/50' : 'text-stone-500 hover:bg-stone-50'"
      >
        壽險需求分析
        <div v-if="mode === 'needs'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
      </button>
    </div>

    <div class="p-6 space-y-6">
      <!-- Tab 1: IRR Calculator -->
      <div v-if="mode === 'irr'" class="space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-stone-500 mb-1">繳費年期 (年)</label>
              <input
                type="number"
                v-model.number="irr.years"
                aria-label="繳費年期"
                placeholder="6"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-500 mb-1">年繳保費</label>
              <input
                type="number"
                v-model.number="irr.premium"
                aria-label="年繳保費"
                placeholder="100000"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-500 mb-1">期滿解約/領回金額 (第N年末)</label>
            <div class="flex gap-2">
              <input
                type="number"
                v-model.number="irr.endYear"
                aria-label="領回年度"
                placeholder="第幾年領回? (如: 6)"
                class="w-24 bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <input
                type="number"
                v-model.number="irr.cashValue"
                aria-label="領回金額"
                placeholder="解約金金額"
                class="flex-1 bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <p class="text-[10px] text-stone-400 mt-1">請輸入您預計在哪一年解約或滿期領回，以及當時的「年度末解約金」。</p>
          </div>
        </div>

        <!-- Result -->
        <div class="pt-4 border-t border-stone-100">
          <div
            class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 text-center border border-amber-100"
          >
            <p class="text-xs text-amber-700 uppercase tracking-wide mb-1">內部報酬率 (IRR)</p>
            <div class="flex items-baseline justify-center gap-2">
              <span class="text-4xl font-bold font-mono text-amber-700">{{ irrResult }}</span>
              <span class="text-sm font-bold text-amber-700">%</span>
            </div>
            <p class="text-xs text-amber-600/70 mt-2">
              比起定存 (約1.7%)：
              <span v-if="irrValue > 1.7" class="font-bold text-green-600">優於定存</span>
              <span v-else class="font-bold text-red-500">低於定存</span>
            </p>
          </div>
          <div class="mt-4 text-xs text-stone-400">
            <p>計算說明：假設保費於每年年初繳納，解約金於該年度末領回。</p>
          </div>
        </div>
      </div>

      <!-- Tab 2: Needs Analysis -->
      <div v-if="mode === 'needs'" class="space-y-6">
        <!-- Liabilities -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-stone-700 border-l-4 border-blue-500 pl-2">1. 家庭責任 (負債與開銷)</h3>
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-xs font-semibold text-stone-500 mb-1">房貸與其他負債餘額</label>
              <input
                type="number"
                v-model.number="needs.debt"
                aria-label="負債餘額"
                class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-stone-500 mb-1">家庭年支出 (不含房貸)</label>
                <input
                  type="number"
                  v-model.number="needs.expenses"
                  aria-label="家庭年支出"
                  class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-stone-500 mb-1">預留年數</label>
                <select
                  v-model.number="needs.years"
                  aria-label="預留年數"
                  class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="5">5年 (緩衝期)</option>
                  <option value="10">10年 (子女成年前)</option>
                  <option value="20">20年 (長期照顧)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Assets -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-stone-700 border-l-4 border-green-500 pl-2">2. 現有資產</h3>
          <div>
            <label class="block text-xs font-semibold text-stone-500 mb-1">存款與投資總額</label>
            <input
              type="number"
              v-model.number="needs.assets"
              aria-label="現有資產"
              class="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        <!-- Result -->
        <div class="pt-4 border-t border-stone-100">
          <div class="bg-stone-50 rounded-xl p-6 border border-stone-200 text-center">
            <p class="text-xs text-stone-500 uppercase tracking-wide mb-1">建議壽險保額 (責任缺口)</p>
            <p
              class="text-3xl font-bold font-mono tracking-tight"
              :class="needsResult > 0 ? 'text-blue-600' : 'text-green-600'"
            >
              {{ needsResult > 0 ? '$' + fmt(needsResult) : '資產已足夠' }}
            </p>
            <p class="text-sm text-stone-500 mt-2" v-if="needsResult > 0">
              (負債 + 家庭支出) - 現有資產 = 需補足的保障
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const mode = ref('irr');

// IRR Data
const irr = ref({
  years: 6,
  premium: 100000,
  endYear: 6,
  cashValue: 610000,
});

// Needs Data
const needs = ref({
  debt: 5000000,
  expenses: 600000,
  years: 10,
  assets: 2000000,
});

const fmt = (n) => (n ? Math.round(n).toLocaleString('zh-TW') : '0');

// Logic: IRR Calculation (Newton-Raphson)
const calculateIRR = (cashFlows) => {
  let guess = 0.01; // Start with 1%
  const maxIter = 50;
  const tolerance = 0.00001;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let derivative = 0;

    for (let cf of cashFlows) {
      npv += cf.amount / Math.pow(1 + guess, cf.year);
      derivative += -cf.year * cf.amount * Math.pow(1 + guess, -cf.year - 1);
    }

    if (Math.abs(npv) < tolerance) return guess;

    if (derivative === 0) return null;
    const newGuess = guess - npv / derivative;
    if (Math.abs(newGuess - guess) < tolerance) return newGuess;
    guess = newGuess;
  }
  return guess;
};

const irrValue = computed(() => {
  const flows = [];
  const p = irr.value.premium || 0;
  const payYears = irr.value.years || 0;
  const endY = irr.value.endYear || 0;
  const val = irr.value.cashValue || 0;

  if (p <= 0 || val <= 0 || endY <= 0) return 0;

  // Outflows (Premiums)
  for (let t = 0; t < payYears; t++) {
    if (t < endY) {
      flows.push({ year: t, amount: -p });
    }
  }

  // Inflow (Surrender Value)
  flows.push({ year: endY, amount: val });

  const r = calculateIRR(flows);
  return r ? r * 100 : 0;
});

const irrResult = computed(() => {
  const v = irrValue.value;
  if (v === null || isNaN(v) || !isFinite(v)) return '---';
  return v.toFixed(2);
});

// Logic: Needs
const needsResult = computed(() => {
  const totalLiability = (needs.value.debt || 0) + (needs.value.expenses || 0) * (needs.value.years || 0);
  const assets = needs.value.assets || 0;
  const gap = totalLiability - assets;
  return gap > 0 ? gap : 0;
});
</script>
