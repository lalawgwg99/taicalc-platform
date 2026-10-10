<template>
  <div class="calculator-shell">
    <section class="calculator-card">
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button
          @click="isSummer = true"
          :class="['py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border',
          isSummer ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200' : 'bg-paper-50 text-ink-400 border-ink-100 hover:bg-paper-100']"
        >
          <span>🌞</span> 夏月 (6-9月)
        </button>
        <button
          @click="isSummer = false"
          :class="['py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border',
          !isSummer ? 'bg-brand-500 text-white border-brand-600 shadow-md shadow-brand-200' : 'bg-paper-50 text-ink-400 border-ink-100 hover:bg-paper-100']"
        >
          <span>❄️</span> 非夏月
        </button>
      </div>

      <div>
        <label for="kwhInput" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
          每月用電度數 (度)
        </label>
        <div class="relative">
          <input
            id="kwhInput"
            type="text" inputmode="decimal"
            v-model.number="kwh"
            class="w-full bg-white border border-ink-100 rounded-xl py-3 px-4 text-gray-900 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-ink-300"
          />
          <span class="absolute right-4 top-4 text-ink-400 font-medium">kWh</span>
        </div>

        <label for="kwhRange" class="sr-only">調整度數</label>
        <input
          id="kwhRange"
          type="range"
          v-model.number="kwh"
          min="0"
          max="2000"
          step="10"
          class="w-full mt-6 accent-amber-500 cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-ink-400 mt-1 font-mono">
          <span>0</span><span>500</span><span>1000</span><span>1500</span><span>2000</span>
        </div>
      </div>
    </section>

    <section class="receipt-card">
      <div class="receipt-head">
        <p class="receipt-title">預估電費</p>
        <span class="data-pill !px-2.5 !py-1 text-brand-700 bg-brand-50 border-brand-200">越用越貴</span>
      </div>
      <hr class="receipt-divider" />
      <div class="flex items-end justify-between mb-6 pb-6 border-b border-paper-100">
        <div>
          <p class="text-xs text-ink-400 font-semibold uppercase tracking-wider mb-1">預估電費</p>
          <p
            class="text-4xl sm:text-5xl font-bold font-mono tracking-tight"
            :class="isSummer ? 'text-orange-600' : 'text-brand-600'"
          >
            <span class="text-2xl text-ink-400 mr-1">$</span>{{ totalCost.toLocaleString() }}
          </p>
          <p v-if="minimumChargeApplied > 0" class="mt-2 text-xs text-ink-400">
            已經含每月最低收 100 元，補了 ${{ minimumChargeApplied }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-ink-400 mb-1">平均一度</p>
          <p class="text-xl font-bold text-ink-600 font-mono">${{ avgRate }}</p>
        </div>
      </div>

      <div class="space-y-3 mb-6">
        <div v-for="(tier, i) in breakdown" :key="i" class="relative">
          <div class="flex justify-between text-xs text-ink-400 mb-1 font-medium">
            <span>{{ tier.label }}</span>
            <span>
              {{ trimNum(tier.kwh) }}度 × ${{ tier.rate }} = <span class="font-bold text-ink-600">${{ tier.cost }}</span>
            </span>
          </div>
          <div class="h-2.5 bg-paper-100 rounded-full overflow-hidden border border-ink-100">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="i === breakdown.length - 1 && breakdown.length > 1 ? 'bg-red-500' : (isSummer ? 'bg-orange-400' : 'bg-brand-400')"
              :style="{ width: (tier.cost / Math.max(1, energyCharge) * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div v-if="minimumChargeApplied > 0" class="flex justify-between text-xs text-ink-400 pt-2 border-t border-paper-100">
          <span>每月最低消費補的</span>
          <span class="font-bold text-ink-600">+$ {{ minimumChargeApplied }}</span>
        </div>
      </div>

      <div
        v-if="breakdown.length > 2"
        class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm text-rose-700 font-medium flex gap-2 items-start"
      >
        <span>⚠️</span>
        <span>
          貴的級距佔了 <span class="font-bold">{{ highTierPercent }}%</span>，最後一級一度 ${{ breakdown[breakdown.length - 1].rate }}，是第一級的 {{ highTierMultiple }} 倍。
        </span>
      </div>
    </section>

    <section class="calculator-card">
      <h2 class="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
        <span class="text-lg">⚡</span> 一度電多少錢？六段費率速查表
      </h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-ink-400 text-xs border-b border-ink-100">
              <th class="text-left font-medium py-2 pr-2">每月用電級距</th>
              <th class="text-right font-medium py-2 pr-2">夏月（6~9月）</th>
              <th class="text-right font-medium py-2">非夏月</th>
            </tr>
          </thead>
          <tbody class="text-ink-700">
            <tr class="border-b border-paper-100"><td class="py-2 pr-2">120 度以下</td><td class="text-right tabular-nums pr-2">$1.78</td><td class="text-right tabular-nums">$1.78</td></tr>
            <tr class="border-b border-paper-100"><td class="py-2 pr-2">121~330 度</td><td class="text-right tabular-nums pr-2">$2.55</td><td class="text-right tabular-nums">$2.26</td></tr>
            <tr class="border-b border-paper-100"><td class="py-2 pr-2">331~500 度</td><td class="text-right tabular-nums pr-2">$3.80</td><td class="text-right tabular-nums">$3.13</td></tr>
            <tr class="border-b border-paper-100"><td class="py-2 pr-2">501~700 度</td><td class="text-right tabular-nums pr-2">$5.14</td><td class="text-right tabular-nums">$4.24</td></tr>
            <tr class="border-b border-paper-100"><td class="py-2 pr-2">701~1000 度</td><td class="text-right tabular-nums pr-2">$6.44</td><td class="text-right tabular-nums">$5.27</td></tr>
            <tr><td class="py-2 pr-2">1001 度以上</td><td class="text-right tabular-nums pr-2">$8.86</td><td class="text-right tabular-nums">$7.03</td></tr>
          </tbody>
        </table>
      </div>
      <p class="text-sm text-ink-600 leading-relaxed mt-4">
        舉例：每月用 <span class="font-bold text-ink-800">300 度</span>，夏月約繳 <span class="font-bold text-orange-600 tabular-nums">$673</span>、非夏月約繳 <span class="font-bold text-brand-600 tabular-nums">$621</span>。
      </p>
      <p class="text-xs text-ink-400 mt-2">費率為台電 2026-04-01 起實施之住宅用電價，單位元/度。</p>
    </section>

    <section class="calculator-card">
      <h2 class="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
        <span class="text-lg">💡</span> 省電模擬
        <span class="text-ink-400 font-normal text-xs ml-auto">如果每月少用...</span>
      </h2>

      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="n in [30, 50, 100]"
          :key="n"
          @click="simulateSave(n)"
          class="bg-paper-50 hover:bg-paper-100 border border-ink-100 rounded-xl p-3 text-center transition-all group active:scale-95"
        >
          <p class="text-lg font-bold text-ink-600 group-hover:text-brand-600">-{{ n }} 度</p>
          <p class="text-xs text-ink-400 mt-1">省 ${{ getSaving(n) }}</p>
        </button>
      </div>

      <div
        v-if="simulatedSave > 0"
        class="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl text-center"
      >
        <p class="text-brand-800 text-sm font-medium">
          省下 {{ simulatedSave }} 度，每月可省 <span class="text-xl font-bold text-brand-600">${{ simulatedSaving }}</span>
        </p>
        <p class="text-xs text-brand-600/70 mt-1">
          一年約可省下 ${{ (simulatedSaving * 12).toLocaleString() }}
        </p>
      </div>
    </section>

    <section class="calculator-card">
      <h2 class="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
        <span class="text-lg">👻</span> 耗電怪獸分析
      </h2>

      <div class="bg-paper-50 rounded-xl p-4 mb-6 border border-ink-100">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-1">
            <label for="fld-81abd225" class="block text-xs font-semibold text-ink-400 mb-1">選擇電器</label>
            <select id="fld-81abd225"
              v-model="newAppliance.preset"
              @change="applyPreset"
              title="選擇電器"
              class="w-full bg-white border border-ink-100 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="" disabled>--- 請選擇 ---</option>
              <optgroup v-for="group in presetGroups" :key="group" :label="group">
                <option v-for="item in appliancePresets.filter(p => p.cat === group)" :key="item.name" :value="item">{{ item.name }}</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label for="fld-90f35e5f" class="block text-xs font-semibold text-ink-400 mb-1">功率 (瓦特 W)</label>
            <input id="fld-90f35e5f"
              type="text" inputmode="decimal"
              v-model.number="newAppliance.watts"
              placeholder="W"
              class="w-full bg-white border border-ink-100 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label for="fld-25753b79" class="block text-xs font-semibold text-ink-400 mb-1">每日時數 (hr)</label>
            <input id="fld-25753b79"
              type="text" inputmode="decimal"
              v-model.number="newAppliance.hours"
              placeholder="hr"
              min="0"
              max="24"
              class="w-full bg-white border border-ink-100 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
        <button
          @click="addAppliance"
          class="mt-3 w-full py-2 bg-brand-700 text-white rounded-lg text-sm font-bold hover:bg-brand-800 transition-colors"
        >
          + 加入清單
        </button>
        <button
          @click="addQuickSet"
          class="mt-2 w-full py-2 bg-paper-100 border border-ink-100 text-ink-600 rounded-lg text-sm font-semibold hover:border-brand-300 transition-colors"
        >
          ⚡ 一鍵加入小家庭基本盤（冰箱＋洗衣機＋電視＋電燈＋熱水瓶）
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="userAppliances.length > 0">
        <div class="space-y-3">
          <div
            v-for="(app, idx) in userAppliances"
            :key="idx"
            class="flex items-center justify-between p-3 bg-paper-50 rounded-xl border border-paper-100"
          >
            <div>
              <p class="font-bold text-ink-600 text-sm flex items-center gap-1.5">
                {{ app.name }}
                <span v-if="idx === topMonsterIdx" class="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">👻 頭號怪獸</span>
              </p>
              <p class="text-xs text-ink-400">{{ app.watts }}W × {{ app.hours }}hr/日</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="font-bold text-ink-800 text-sm">{{ Math.round(app.monthlyKwh) }}度 <span class="font-normal text-ink-400 text-xs">({{ monsterShare(app) }}%)</span></p>
                <p class="text-xs text-ink-400">約 ${{ Math.round(app.monthlyCost) }}</p>
              </div>
              <button
                @click="removeAppliance(idx)"
                class="text-ink-200 hover:text-red-500"
                title="移除"
                aria-label="移除電器"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <div class="pt-3 border-t border-paper-100 flex justify-between items-center text-sm">
            <span class="text-ink-400">分析總計</span>
            <span class="font-bold text-ink-800">{{ totalGhostKwh }} 度 ({{ ghostCoverage }}%)</span>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center bg-paper-50 rounded-xl p-4 border border-paper-100">
          <div class="w-full h-[200px] relative">
            <canvas id="ghostChart"></canvas>
          </div>
          <p class="text-xs text-ink-400 mt-2 text-center" v-if="ghostCoverage < 100">
            還有 {{ 100 - ghostCoverage }}% 用電未被分析到
          </p>
        </div>
      </div>
      <div v-else class="text-center py-6 text-sm text-ink-400">
        👻 還沒有怪獸現形。選個電器按「加入清單」，或一鍵加入小家庭基本盤，看看誰在偷吃你的電。
      </div>
      <p class="mt-3 text-[11px] text-ink-400">預設值參考台電節電資訊與能源局能效分級資料（變頻冰箱月耗約 27–36 度、儲熱式電熱水器日均約 2–3 度），實際耗電以電器銘板為準，可自行調整功率與時數。</p>
    </section>

    <section class="calculator-card">
      <h2 class="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
        <span class="text-lg">🌡️</span> 冷氣耗電估算
      </h2>

      <div class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="mode in acModes"
          :key="mode.id"
          @click="acInputMode = mode.id"
          :class="[
            'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
            acInputMode === mode.id
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-ink-100 bg-paper-50 text-ink-400 hover:bg-paper-100'
          ]"
        >
          {{ mode.label }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="acInputMode === 'kw'">
          <label for="acPower" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
            電功率
          </label>
          <input
            id="acPower"
            type="text" inputmode="decimal"
            v-model.number="acPower"
            min="0.1"
            max="20"
            step="0.1"
            aria-label="冷氣電功率"
            class="w-full bg-white border border-ink-100 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acPowerPresets"
              :key="preset"
              type="button"
              @click="acPower = preset"
              class="px-2.5 py-1 rounded-full border border-ink-100 bg-paper-50 text-xs text-ink-500 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              {{ preset }} kW
            </button>
          </div>
          <p class="mt-2 text-[11px] text-ink-400">直接輸入銘板上的消耗功率，適合已知實際耗電規格時使用。</p>
        </div>

        <div v-else-if="acInputMode === 'btu'">
          <label for="acBtu" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
            冷房能力
          </label>
          <input
            id="acBtu"
            type="text" inputmode="decimal"
            v-model.number="acBtu"
            min="3000"
            max="120000"
            step="500"
            aria-label="冷房能力 BTU/h"
            class="w-full bg-white border border-ink-100 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acBtuPresets"
              :key="preset"
              type="button"
              @click="acBtu = preset"
              class="px-2.5 py-1 rounded-full border border-ink-100 bg-paper-50 text-xs text-ink-500 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              {{ preset.toLocaleString() }}
            </button>
          </div>
          <p class="mt-2 text-[11px] text-ink-400">BTU/h 是冷房能力，不是耗電功率，仍需搭配 COP 或 CSPF 估算輸入功率。</p>
        </div>

        <div v-else>
          <label for="acCapacityKw" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
            冷房能力
          </label>
          <input
            id="acCapacityKw"
            type="text" inputmode="decimal"
            v-model.number="acCapacityKw"
            min="0.8"
            max="35"
            step="0.1"
            aria-label="冷房能力 kW"
            class="w-full bg-white border border-ink-100 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acCapacityPresets"
              :key="preset"
              type="button"
              @click="acCapacityKw = preset"
              class="px-2.5 py-1 rounded-full border border-ink-100 bg-paper-50 text-xs text-ink-500 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              {{ preset }} kW
            </button>
          </div>
          <p class="mt-2 text-[11px] text-ink-400">若銘板標示為冷房能力 kW，可在這裡直接搭配 COP 或 CSPF 換算。</p>
        </div>

        <div>
          <label for="acHours" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
            每日時數
          </label>
          <input
            id="acHours"
            type="text" inputmode="decimal"
            v-model.number="acHours"
            min="0"
            max="24"
            class="w-full bg-white border border-ink-100 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <p class="mt-2 text-[11px] text-ink-400">依每天平均運轉時數估算，變頻機實際耗電仍會受室外溫度與設定溫度影響。</p>
        </div>
      </div>

      <div v-if="acInputMode !== 'kw'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">效能指標</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="acEfficiencyType = 'cop'"
              :class="[
                'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                acEfficiencyType === 'cop'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-ink-100 bg-paper-50 text-ink-400 hover:bg-paper-100'
              ]"
            >
              COP
            </button>
            <button
              @click="acEfficiencyType = 'cspf'"
              :class="[
                'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                acEfficiencyType === 'cspf'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-ink-100 bg-paper-50 text-ink-400 hover:bg-paper-100'
              ]"
            >
              CSPF
            </button>
          </div>
          <p class="mt-2 text-[11px] text-ink-400">
            COP 可近似即時效率；CSPF 是季節效率，本工具以平均值粗估輸入功率。
          </p>
        </div>
        <div>
          <label for="acEfficiencyValue" class="block text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
            {{ acEfficiencyType.toUpperCase() }} 數值
          </label>
          <input
            id="acEfficiencyValue"
            type="text" inputmode="decimal"
            v-model.number="acEfficiencyValue"
            min="1"
            max="8"
            step="0.1"
            aria-label="效能值"
            class="w-full bg-white border border-ink-100 rounded-xl py-2.5 px-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="preset in acEfficiencyPresets"
              :key="preset"
              type="button"
              @click="acEfficiencyValue = preset"
              class="px-2.5 py-1 rounded-full border border-ink-100 bg-paper-50 text-xs text-ink-500 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              {{ preset }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4 p-4 bg-paper-100/50 rounded-xl border border-paper-100">
        <div class="flex flex-col gap-1 text-center">
          <p class="text-ink-400 text-xs font-medium">冷氣每月預估</p>
          <div class="flex items-center justify-center gap-2 mt-1">
            <p class="text-2xl font-bold text-ink-800 font-mono">
              {{ acMonthlyKwh }} <span class="text-sm font-sans text-ink-400 font-normal">度</span>
            </p>
            <span class="text-ink-200">|</span>
            <p class="text-sm text-ink-400">約 ${{ acMonthlyCost }}</p>
          </div>
          <p class="text-xs text-ink-400 mt-1">
            {{ acEstimateLabel }}
          </p>
          <p v-if="acInputMode !== 'kw'" class="text-[11px] text-ink-400">
            冷房能力 {{ acCoolingCapacityKw.toFixed(2) }} kW
            <span class="mx-1">≈</span>
            {{ acCoolingCapacityBtu.toLocaleString() }} BTU/h
            <span class="mx-1">→</span>
            推估輸入功率 {{ acEstimatedInputKw.toFixed(2) }} kW
          </p>
          <button @click="addAcToGhost" class="mt-2 text-xs text-brand-600 hover:underline">
            + 加入到耗電怪獸分析
          </button>
        </div>
      </div>
    </section>

    <footer class="bg-paper-50 border border-ink-100 rounded-xl p-4 text-xs text-ink-400">
      <p class="font-bold text-ink-500 mb-2">📌 資料版本與說明</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-ink-400">
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span> 夏月：6~9月</div>
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-brand-400"></span> 非夏月：其他月份</div>
        <div class="md:col-span-2">家用電價用台電 2026-04-01 起實施的費率：夏月一度 $1.78–$8.86、其他月份 $1.78–$7.03。</div>
        <div class="md:col-span-2">已經算進 2025-09-12 公告的每月最低收 100 元規則；冷氣 BTU/h、CSPF 換算只是大概估的，以機器上的銘板跟實際帳單為準。</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import {
  BTU_PER_KW,
  NON_SUMMER_ELECTRICITY_RATES,
  SUMMER_ELECTRICITY_RATES,
  calcElectricityCostSummary,
  convertKwToBtu,
  estimateAcInputKw,
  estimateAcMonthlyKwh
} from '../../utils/calculators/electricity';

const APPLIANCE_PRESETS = [
  { name: '冷氣 (小型)', watts: 800, hours: 8, cat: '冷暖空調' },
  { name: '冷氣 (中型)', watts: 1200, hours: 8, cat: '冷暖空調' },
  { name: '除濕機', watts: 300, hours: 8, cat: '冷暖空調' },
  { name: '電熱水器 (儲熱式)', watts: 4000, hours: 0.75, cat: '廚房衛浴' },
  { name: '電磁爐', watts: 1400, hours: 0.5, cat: '廚房衛浴' },
  { name: '微波爐', watts: 1200, hours: 0.15, cat: '廚房衛浴' },
  { name: '氣炸鍋 / 烤箱', watts: 1500, hours: 0.3, cat: '廚房衛浴' },
  { name: '電熱水瓶 (保溫為主)', watts: 40, hours: 24, cat: '廚房衛浴' },
  { name: '冰箱 (變頻400L)', watts: 45, hours: 24, cat: '廚房衛浴' },
  { name: '電鍋 (保溫)', watts: 40, hours: 12, cat: '廚房衛浴' },
  { name: '洗衣機 (每週約2次)', watts: 500, hours: 0.3, cat: '清潔衣物' },
  { name: '烘衣機', watts: 1200, hours: 0.5, cat: '清潔衣物' },
  { name: '電視 (65吋)', watts: 150, hours: 4, cat: '娛樂影音' },
  { name: '電腦 (桌機)', watts: 150, hours: 6, cat: '娛樂影音' },
  { name: '電燈 (全家)', watts: 100, hours: 6, cat: '其他' },
  { name: '待機電力 (機上盒等)', watts: 30, hours: 24, cat: '其他' },
  { name: '吹風機', watts: 1200, hours: 0.2, cat: '其他' }
];
// 一鍵加入：小家庭基本盤
const QUICK_HOME_SET = ['冰箱 (變頻400L)', '洗衣機 (每週約2次)', '電視 (65吋)', '電燈 (全家)', '電熱水瓶 (保溫為主)'];

const acModes = [
  { id: 'kw', label: 'kW 輸入' },
  { id: 'btu', label: 'BTU/h 輸入' },
  { id: 'capacity', label: '冷房能力 + 效能' }
];

const acPowerPresets = [0.6, 0.8, 1.2, 1.8, 2.5, 3.6, 5, 7.2, 10];
const acBtuPresets = [9000, 12000, 18000, 24000, 36000, 48000];
const acCapacityPresets = [2.6, 3.5, 5, 7.1, 10, 14];
const acEfficiencyPresets = [2.8, 3.2, 3.8, 4.5, 5.2, 6];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
// 去掉浮點數尾巴：3.450000000000003 → 3.45
const trimNum = (n) => {
  const r = Math.round(Number(n) * 100) / 100;
  return Number.isInteger(r) ? r.toString() : r.toFixed(2).replace(/0$/, '');
};
// 每日時數超過 24 自動收斂到 24，避免無聲封頂誤導
watch(() => newAppliance.value.hours, (v) => {
  if (typeof v === 'number' && v > 24) newAppliance.value.hours = 24;
  if (typeof v === 'number' && v < 0) newAppliance.value.hours = 0;
});

const kwh = ref(400);
const isSummer = ref(true);
const simulatedSave = ref(0);

const acInputMode = ref('kw');
const acPower = ref(1.2);
const acBtu = ref(12000);
const acCapacityKw = ref(3.5);
const acEfficiencyType = ref('cop');
const acEfficiencyValue = ref(3.8);
const acHours = ref(8);

const userAppliances = ref([]);
const newAppliance = ref({
  preset: '',
  watts: '',
  hours: ''
});

const appliancePresets = APPLIANCE_PRESETS;
let chartInstance = null;

const rates = computed(() => (isSummer.value ? SUMMER_ELECTRICITY_RATES : NON_SUMMER_ELECTRICITY_RATES));
const costSummary = computed(() => calcElectricityCostSummary(Number(kwh.value) || 0, rates.value));
const breakdown = computed(() => costSummary.value.tiers);
const energyCharge = computed(() => costSummary.value.energyCharge);
const minimumChargeApplied = computed(() => costSummary.value.minimumChargeApplied);
const totalCost = computed(() => costSummary.value.totalCost);
const avgRate = computed(() => (kwh.value > 0 ? (totalCost.value / kwh.value).toFixed(2) : '0.00'));

const highTierPercent = computed(() => {
  if (breakdown.value.length < 2 || totalCost.value <= 0) return 0;
  const last = breakdown.value[breakdown.value.length - 1];
  return Math.round(last.cost / totalCost.value * 100);
});

const highTierMultiple = computed(() => {
  if (breakdown.value.length < 2) return 1;
  return (breakdown.value[breakdown.value.length - 1].rate / breakdown.value[0].rate).toFixed(1);
});

const getSaving = (savingKwh) => {
  const newKwh = Math.max(0, (kwh.value || 0) - savingKwh);
  const newCost = calcElectricityCostSummary(newKwh, rates.value).totalCost;
  return totalCost.value - newCost;
};

const simulatedSaving = computed(() => getSaving(simulatedSave.value));
const simulateSave = (savingKwh) => {
  simulatedSave.value = savingKwh;
};

const normalizedAcPower = computed(() => clamp(Number(acPower.value) || 0, 0.1, 20));
const normalizedAcBtu = computed(() => clamp(Number(acBtu.value) || 0, 3000, 120000));
const normalizedAcCapacityKw = computed(() => clamp(Number(acCapacityKw.value) || 0, 0.8, 35));
const normalizedAcEfficiencyValue = computed(() => clamp(Number(acEfficiencyValue.value) || 0, 1, 8));
const normalizedAcHours = computed(() => clamp(Number(acHours.value) || 0, 0, 24));

const acCoolingCapacityKw = computed(() => {
  if (acInputMode.value === 'btu') {
    return normalizedAcBtu.value / BTU_PER_KW;
  }
  if (acInputMode.value === 'capacity') {
    return normalizedAcCapacityKw.value;
  }
  return normalizedAcPower.value;
});

const acCoolingCapacityBtu = computed(() => convertKwToBtu(acCoolingCapacityKw.value));

const acEstimatedInputKw = computed(() => {
  return estimateAcInputKw({
    mode: acInputMode.value,
    powerKw: normalizedAcPower.value,
    btuPerHour: normalizedAcBtu.value,
    coolingCapacityKw: normalizedAcCapacityKw.value,
    efficiencyValue: normalizedAcEfficiencyValue.value
  });
});

const acEstimateLabel = computed(() => {
  if (acInputMode.value === 'kw') {
    return `以實際電功率 ${acEstimatedInputKw.value.toFixed(2)} kW 估算`;
  }

  const metric = acEfficiencyType.value.toUpperCase();
  return `以冷房能力 ÷ ${metric} 推估平均輸入功率 ${acEstimatedInputKw.value.toFixed(2)} kW`;
});

const acMonthlyKwh = computed(() => estimateAcMonthlyKwh(acEstimatedInputKw.value, normalizedAcHours.value));
const acMonthlyCost = computed(() => calcElectricityCostSummary(acMonthlyKwh.value, rates.value).totalCost);

const applyPreset = () => {
  if (newAppliance.value.preset) {
    newAppliance.value.watts = newAppliance.value.preset.watts;
    newAppliance.value.hours = newAppliance.value.preset.hours;
  }
};

const addAppliance = () => {
  const { preset, watts, hours } = newAppliance.value;
  const powerWatts = Number(watts) || 0;
  const dailyHours = clamp(Number(hours) || 0, 0, 24);
  const name = preset ? preset.name : (powerWatts ? `自訂電器 (${powerWatts}W)` : '未命名');

  if (powerWatts > 0 && dailyHours > 0) {
    userAppliances.value.push({
      name,
      watts: powerWatts,
      hours: dailyHours,
      monthlyKwh: (powerWatts * dailyHours * 30) / 1000,
      monthlyCost: 0
    });
    newAppliance.value = { preset: '', watts: '', hours: '' };
  }
};

const getAcGhostName = () => {
  if (acInputMode.value === 'kw') {
    return `冷氣估算 (${acEstimatedInputKw.value.toFixed(1)}kW)`;
  }
  if (acInputMode.value === 'btu') {
    return `冷氣估算 (${normalizedAcBtu.value.toLocaleString()} BTU/h, ${acEfficiencyType.value.toUpperCase()} ${normalizedAcEfficiencyValue.value.toFixed(1)})`;
  }
  return `冷氣估算 (${acCoolingCapacityKw.value.toFixed(1)}kW 冷房, ${acEfficiencyType.value.toUpperCase()} ${normalizedAcEfficiencyValue.value.toFixed(1)})`;
};

const addAcToGhost = () => {
  userAppliances.value.push({
    name: getAcGhostName(),
    watts: Math.round(acEstimatedInputKw.value * 1000),
    hours: normalizedAcHours.value,
    monthlyKwh: acEstimatedInputKw.value * normalizedAcHours.value * 30,
    monthlyCost: 0
  });
};

const removeAppliance = (index) => {
  userAppliances.value.splice(index, 1);
};

watch([avgRate, userAppliances], () => {
  const averageRate = Number(avgRate.value) || 0;
  userAppliances.value.forEach((appliance) => {
    appliance.monthlyCost = appliance.monthlyKwh * averageRate;
  });
  updateChart();
}, { deep: true });

const totalGhostKwh = computed(() => Math.round(userAppliances.value.reduce((sum, appliance) => sum + appliance.monthlyKwh, 0)));
// 預設選單的分類群組（照 APPLIANCE_PRESETS 出現順序）
const presetGroups = computed(() => {
  const groups = [];
  APPLIANCE_PRESETS.forEach(p => { if (!groups.includes(p.cat)) groups.push(p.cat); });
  return groups;
});
// 頭號怪獸：月耗電最高的電器
const topMonsterIdx = computed(() => {
  if (!userAppliances.value.length) return -1;
  let idx = 0;
  userAppliances.value.forEach((a, i) => { if (a.monthlyKwh > userAppliances.value[idx].monthlyKwh) idx = i; });
  return idx;
});
const monsterShare = (app) => totalGhostKwh.value > 0 ? Math.round(app.monthlyKwh / totalGhostKwh.value * 100) : 0;
// 一鍵加入小家庭基本盤（已在清單的不重複加）
const addQuickSet = () => {
  QUICK_HOME_SET.forEach(name => {
    const preset = APPLIANCE_PRESETS.find(p => p.name === name);
    if (preset && !userAppliances.value.some(a => a.name === name)) {
      userAppliances.value.push({
        name: preset.name,
        watts: preset.watts,
        hours: preset.hours,
        monthlyKwh: (preset.watts * preset.hours * 30) / 1000,
        monthlyCost: 0
      });
    }
  });
};
const ghostCoverage = computed(() => {
  const monthlyUsage = kwh.value || 1;
  return Math.min(100, Math.round(totalGhostKwh.value / monthlyUsage * 100));
});

function updateChart() {
  const ctx = document.getElementById('ghostChart');
  if (!ctx) return;

  if (userAppliances.value.length === 0) {
    if (chartInstance) chartInstance.destroy();
    return;
  }

  if (chartInstance) chartInstance.destroy();

  const labels = userAppliances.value.map((appliance) => appliance.name);
  const data = userAppliances.value.map((appliance) => appliance.monthlyKwh);
  const unknown = (kwh.value || 0) - totalGhostKwh.value;

  if (unknown > 0) {
    labels.push('其他/未知');
    data.push(unknown);
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#a78bfa', '#e879f9', '#f472b6',
          '#e5e7eb'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { font: { size: 10 }, boxWidth: 10 }
        }
      }
    }
  });
}

watch(totalCost, (newValue) => {
  const value = parseInt(newValue, 10);
  if (value > 0) {
    localStorage.setItem('taicalc_electricity_monthly', value);
  } else {
    localStorage.removeItem('taicalc_electricity_monthly');
  }
});

onMounted(() => {
  const saved = localStorage.getItem('taicalc_electricity_inputs');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.kwh) kwh.value = data.kwh;
      if (data.isSummer !== undefined) isSummer.value = data.isSummer;
      if (data.acInputMode) acInputMode.value = data.acInputMode;
      if (data.acPower) acPower.value = data.acPower;
      if (data.acBtu) acBtu.value = data.acBtu;
      if (data.acCapacityKw) acCapacityKw.value = data.acCapacityKw;
      if (data.acEfficiencyType) acEfficiencyType.value = data.acEfficiencyType;
      if (data.acEfficiencyValue) acEfficiencyValue.value = data.acEfficiencyValue;
      if (data.acHours) acHours.value = data.acHours;
      if (data.userAppliances) userAppliances.value = data.userAppliances;
    } catch (_) {}
  }

  nextTick(() => {
    updateChart();
  });
});

watch([kwh, isSummer, acInputMode, acPower, acBtu, acCapacityKw, acEfficiencyType, acEfficiencyValue, acHours, userAppliances], () => {
  localStorage.setItem('taicalc_electricity_inputs', JSON.stringify({
    kwh: kwh.value,
    isSummer: isSummer.value,
    acInputMode: acInputMode.value,
    acPower: acPower.value,
    acBtu: acBtu.value,
    acCapacityKw: acCapacityKw.value,
    acEfficiencyType: acEfficiencyType.value,
    acEfficiencyValue: acEfficiencyValue.value,
    acHours: acHours.value,
    userAppliances: userAppliances.value
  }));
}, { deep: true });
</script>
