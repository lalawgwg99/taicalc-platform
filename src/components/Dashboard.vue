<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
    
    <!-- Action Bar -->
    <!-- Action Bar -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-2 rounded-2xl shadow-sm border border-stone-200/60 sticky top-24 z-40 backdrop-blur-xl bg-white/80">
      <div class="px-4">
        <h1 class="text-xl font-bold text-stone-900 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          生活儀表板
        </h1>
      </div>
      
      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0 no-scrollbar">
        <!-- Data Actions Group -->
        <div class="flex items-center bg-stone-100/50 p-1 rounded-xl mr-2">
            <input type="file" ref="fileInput" @change="importData" accept=".json" class="hidden">
            
            <button @click="$refs.fileInput.click()" class="p-2 text-stone-500 hover:text-stone-900 hover:bg-white rounded-lg transition-all" title="還原設定">
              <span class="material-symbols-outlined text-[20px]">upload</span>
            </button>

            <button @click="exportData" class="p-2 text-stone-500 hover:text-stone-900 hover:bg-white rounded-lg transition-all" title="備份數據">
              <span class="material-symbols-outlined text-[20px]">download</span>
            </button>
            
            <div class="w-[1px] h-4 bg-stone-200 mx-1"></div>

            <button @click="resetData" class="p-2 text-stone-500 hover:text-rose-600 hover:bg-white rounded-lg transition-all" title="重置數據">
              <span class="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
        </div>

        <button @click="showAnalysis = true" class="p-2.5 rounded-xl hover:bg-stone-100 text-stone-900 transition-colors" title="進階分析">
          <span class="material-symbols-outlined text-[20px]">add</span>
        </button>

        <button @click="togglePrivacy" class="p-2.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors" :title="privacyMode ? '顯示金額' : '隱藏金額'">
           <span class="material-symbols-outlined text-[20px]">{{ privacyMode ? 'visibility_off' : 'visibility' }}</span>
        </button>
      </div>
    </div>

    <!-- Welcome Status -->
    <div class="card rounded-2xl p-6 md:p-8 flex items-center justify-between">
      <div>
         <h2 class="text-xl font-bold text-stone-800 mb-1">Hi, 歡迎回來 👋</h2>
         <p class="text-stone-500">
             <span v-if="freedomScore > 0">目前您的財務自由度為 <b class="text-emerald-600">{{ freedomScore }}%</b> ({{ savingsStatus }})，繼續保持！</span>
             <span v-else>開始輸入您的 <b>薪資</b> 與 <b>支出</b>，計算您的財務健康度。</span>
         </p>
      </div>
      <div class="hidden md:block">
           <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 tracking-wide uppercase">
               System Online
           </span>
      </div>
    </div>

    <!-- Main Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Income -->
      <div class="card rounded-2xl p-6 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span class="material-symbols-outlined text-[120px] text-stone-900">payments</span>
        </div>
        <h3 class="text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">每月總收入 (預估)</h3>
        <div class="flex items-end gap-2">
            <div :class="{'blur-sm select-none': privacyMode}" class="text-3xl font-black text-stone-900 font-mono tracking-tight">{{ fmt(totalIncome) }}</div>
            <div v-if="trends.income !== 0" class="text-xs font-bold mb-1.5" :class="trends.income > 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ trends.income > 0 ? '▲' : '▼' }} {{ Math.abs(trends.income) }}%
            </div>
        </div>
        <div class="mt-4 text-xs font-medium text-stone-400 flex items-center gap-1">來源：薪資、副業</div>
      </div>

      <!-- Expense -->
      <div class="card rounded-2xl p-6 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span class="material-symbols-outlined text-[120px] text-rose-600">shopping_cart</span>
        </div>
        <h3 class="text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">每月總支出 (預估)</h3>
        <div class="flex items-end gap-2">
            <div :class="{'blur-sm select-none': privacyMode}" class="text-3xl font-black text-stone-900 font-mono tracking-tight">{{ fmt(totalExpense) }}</div>
            <div v-if="trends.expense !== 0" class="text-xs font-bold mb-1.5" :class="trends.expense < 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ trends.expense > 0 ? '▲' : '▼' }} {{ Math.abs(trends.expense) }}%
            </div>
        </div>
        <div class="mt-4 text-xs font-medium text-stone-400 flex items-center gap-1">來源：房貸、房租、生活費</div>
      </div>

      <!-- Net Cashflow -->
      <div class="card rounded-2xl p-6 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <span class="material-symbols-outlined text-[120px] text-blue-600">savings</span>
        </div>
        <h3 class="text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">每月淨現金流</h3>
        <div class="text-3xl font-black font-mono tracking-tight" :class="[{'blur-sm select-none': privacyMode}, netCashflow >= 0 ? 'text-blue-600' : 'text-rose-600']">
             {{ netCashflow > 0 ? '+' : '' }}{{ fmt(netCashflow) }}
        </div>
        <div class="mt-4 text-xs font-medium text-stone-400 flex items-center gap-1">可自由支配資金</div>
      </div>

      <!-- Freedom Score -->
      <!-- Freedom Score -->
      <div class="card rounded-2xl p-6 relative overflow-hidden group border-l-4 border-indigo-500">
         <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <span class="material-symbols-outlined text-[120px] text-indigo-600">rocket_launch</span>
         </div>
         <h3 class="text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">財務自由度 (儲蓄率)</h3>
         <div class="text-4xl font-black font-mono tracking-tight text-indigo-600">{{ freedomScore }}%</div>
         <div class="mt-4 text-xs font-medium text-stone-400">目標 > 30% (目前: <span class="font-bold text-indigo-600">{{ savingsStatus }}</span>)</div>
      </div>
    </div>

    <!-- Smart Tips -->
    <div v-if="activeTips.length > 0" class="transition-all">
       <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
          <h3 class="text-sm font-bold text-amber-800 mb-4 flex items-center gap-2">
             <span class="material-symbols-outlined text-[18px]">lightbulb</span>
             財務優化建議
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div v-for="(tip, index) in activeTips" :key="index" class="bg-white/60 p-4 rounded-xl text-sm font-medium text-stone-700 flex gap-3 shadow-sm border border-amber-100/50">
                 <span class="text-amber-500">💡</span>
                 <span>{{ tip }}</span>
             </div>
          </div>
       </div>
    </div>

    <!-- Net Worth & Goal Tracker -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <!-- Net Worth -->
       <!-- Net Worth -->
       <div class="card rounded-2xl p-8 relative overflow-hidden lg:col-span-1 shadow-lg border-l-4 border-emerald-500">
           <div class="absolute right-0 top-0 p-8 opacity-5 pointer-events-none">
               <span class="material-symbols-outlined text-[150px] text-stone-900">currency_exchange</span>
           </div>
           <h3 class="text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">淨資產 (Net Worth)</h3>
           <div :class="{'blur-sm select-none': privacyMode}" class="text-4xl font-black text-emerald-600 font-mono tracking-tight mb-8">{{ fmt(netWorth) }}</div>
           
           <div class="space-y-4">
               <div class="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                   <span class="text-stone-500 font-bold">總資產 (現金+股票)</span>
                   <span :class="{'blur-sm select-none': privacyMode}" class="font-mono font-bold text-stone-700">{{ fmt(totalAssets) }}</span>
               </div>
               <div class="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                   <span class="text-stone-500 font-bold">總負債 (貸款+欠款)</span>
                   <span :class="{'blur-sm select-none': privacyMode}" class="font-mono font-bold text-rose-500">-{{ fmt(totalLiabilities) }}</span>
               </div>
               
               <!-- Health Score -->
               <div class="pt-4 mt-2">
                   <div class="flex justify-between items-center mb-2">
                       <span class="text-xs font-bold text-stone-500 uppercase tracking-widest">財務健康分</span>
                       <span class="text-sm font-bold" :class="healthScore >= 80 ? 'text-emerald-600' : (healthScore >= 60 ? 'text-amber-500' : 'text-rose-500')">{{ healthScore }} / 100</span>
                   </div>
                   <div class="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                       <div class="h-full rounded-full transition-all duration-1000" :class="healthScore >= 80 ? 'bg-emerald-500' : (healthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500')" :style="{ width: healthScore + '%' }"></div>
                   </div>
               </div>
           </div>
       </div>

       <!-- Emergency Fund -->
       <div class="card rounded-2xl p-6 md:p-8 lg:col-span-2">
           <h3 class="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              財務安全目標：緊急預備金
           </h3>
           <p class="text-stone-500 text-sm mb-8 leading-relaxed">目標為 6 個月的總支出，以確保在無收入時仍能維持生活。這是財務自由的第一道防線。</p>
           
           <div class="relative">
               <div class="flex mb-3 items-center justify-between">
                   <span class="text-xs font-bold inline-block py-1 px-3 uppercase rounded-full text-emerald-700 bg-emerald-100">
                       進度 {{ emergencyFundProgress }}%
                   </span>
                   <span class="text-xs font-bold text-emerald-600 font-mono">
                       {{ fmt(totalLiquidAssets) }} / {{ fmt(emergencyFundGoal) }}
                   </span>
               </div>
               <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-stone-100">
                   <div :style="{ width: emergencyFundProgress + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000 ease-out"></div>
               </div>
               <div class="text-xs font-medium text-stone-400 text-center">
                   {{ emergencyFundProgress >= 100 ? '🎉 恭喜！您已達成緊急預備金目標！' : '加油！存滿預備金是財務自由的第一步。' }}
               </div>
           </div>
       </div>
    </div>

    <!-- Chart & Input Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <!-- Chart Analysis -->
       <div class="card rounded-2xl p-6 md:p-8">
           <h3 class="text-lg font-bold text-stone-800 mb-6 text-center">支出分佈分析</h3>
           <div class="h-[300px] flex justify-center items-center relative">
               <canvas ref="expenseChartRef"></canvas>
               <div v-if="totalExpense === 0" class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm text-stone-400 font-medium">
                   尚無支出資料
               </div>
           </div>
       </div>

       <!-- Manual Inputs -->
       <div class="card rounded-2xl p-6 md:p-8">
           <h3 class="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
               <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
               資產與負債盤點
           </h3>
           <div class="space-y-6">
               <div>
                   <label class="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">流動現金 (存款/定存)</label>
                   <div class="flex items-center gap-4">
                       <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                           <span class="material-symbols-outlined">account_balance_wallet</span>
                       </div>
                       <input type="number" v-model.number="savingsData.amount" @change="saveData('savings')" class="flex-1 bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="0">
                   </div>
               </div>

               <div>
                   <label class="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">負債總額 (信用卡/信貸/車貸)</label>
                   <div class="flex items-center gap-4">
                       <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                           <span class="material-symbols-outlined">credit_card_off</span>
                       </div>
                       <input type="number" v-model.number="debtData.amount" @change="saveData('debt')" class="flex-1 bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all" placeholder="0">
                   </div>
                   <p class="text-[10px] text-stone-400 mt-2 ml-16 font-medium">不含房貸總額</p>
               </div>
           </div>
       </div>
    </div>

    <!-- Income Categories Loop -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <!-- Income Sources -->
       <div class="card rounded-2xl p-6 md:p-8">
          <h3 class="text-lg font-bold text-stone-800 mb-6 flex items-center justify-between">
              收入來源
              <span class="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded-full uppercase tracking-wider">Monthly</span>
          </h3>
          <div class="space-y-4">
              <!-- Salary Item -->
              <div class="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                          <span class="material-symbols-outlined text-[20px]">work</span>
                      </div>
                      <div>
                          <div class="text-sm font-bold text-stone-800">薪資收入</div>
                          <a href="/tools/salary-calculator.html" class="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 mt-0.5">
                              前往設定 <span class="material-symbols-outlined text-[10px]">arrow_outward</span>
                          </a>
                      </div>
                  </div>
                  <div class="font-mono font-bold text-stone-700 text-lg" :class="{'text-stone-300': !salaryData.defined}">
                      {{ salaryData.defined ? fmt(salaryData.amount) : '未設定' }}
                  </div>
              </div>
              
              <!-- Delivery Item -->
              <div class="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                           <span class="material-symbols-outlined text-[20px]">two_wheeler</span>
                      </div>
                      <div>
                          <div class="text-sm font-bold text-stone-800">兼職/外送</div>
                          <a href="/tools/delivery-income-calculator.html" class="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 mt-0.5">
                              前往設定 <span class="material-symbols-outlined text-[10px]">arrow_outward</span>
                          </a>
                      </div>
                  </div>
                  <div class="font-mono font-bold text-stone-700 text-lg" :class="{'text-stone-300': !deliveryData.defined}">
                      {{ deliveryData.defined ? fmt(deliveryData.amount) : '未設定' }}
                  </div>
              </div>
          </div>
       </div>

       <!-- Expense Breakdowns -->
       <div class="card rounded-2xl p-6 md:p-8">
           <h3 class="text-lg font-bold text-stone-800 mb-6 flex items-center justify-between">
               支出明細
               <span class="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded-full uppercase tracking-wider">Monthly</span>
           </h3>
           <div class="space-y-4">
               <!-- Mortgage -->
               <div class="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                   <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                           <span class="material-symbols-outlined text-[20px]">home</span>
                       </div>
                       <div>
                           <div class="text-sm font-bold text-stone-800">房貸</div>
                           <a href="/tools/mortgage-calculator.html" class="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 mt-0.5">
                               前往設定 <span class="material-symbols-outlined text-[10px]">arrow_outward</span>
                           </a>
                       </div>
                   </div>
                   <div class="font-mono font-bold text-stone-700 text-lg" :class="{'text-stone-300': !mortgageData.defined}">
                       {{ mortgageData.defined ? fmt(mortgageData.amount) : '未設定' }}
                   </div>
               </div>

                <!-- Rent -->
               <div class="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                   <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100">
                           <span class="material-symbols-outlined text-[20px]">key</span>
                       </div>
                       <div>
                           <div class="text-sm font-bold text-stone-800">房租</div>
                           <a href="/tools/rent-cost-calculator.html" class="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 mt-0.5">
                               前往設定 <span class="material-symbols-outlined text-[10px]">arrow_outward</span>
                           </a>
                       </div>
                   </div>
                   <div class="font-mono font-bold text-stone-700 text-lg" :class="{'text-stone-300': !rentData.defined}">
                       {{ rentData.defined ? fmt(rentData.amount) : '未設定' }}
                   </div>
               </div>

               <!-- Electric -->
               <div class="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                   <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                           <span class="material-symbols-outlined text-[20px]">bolt</span>
                       </div>
                       <div>
                           <div class="text-sm font-bold text-stone-800">電費</div>
                           <a href="/tools/electricity-calculator.html" class="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 mt-0.5">
                               前往設定 <span class="material-symbols-outlined text-[10px]">arrow_outward</span>
                           </a>
                       </div>
                   </div>
                   <div class="font-mono font-bold text-stone-700 text-lg" :class="{'text-stone-300': !electricData.defined}">
                       {{ electricData.defined ? fmt(electricData.amount) : '未設定' }}
                   </div>
               </div>
           </div>
       </div>

       <!-- Assets -->
        <div class="card rounded-2xl p-6 md:p-8 md:col-span-2 relative overflow-hidden">
           <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
               <span class="material-symbols-outlined text-[200px] text-stone-400">monitoring</span>
           </div>
           
           <h3 class="text-lg font-bold text-stone-800 mb-6 flex items-center justify-between relative z-10">
               資產與投資
               <span class="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded-full uppercase tracking-wider">Current Value</span>
           </h3>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div class="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                   <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                            <span class="material-symbols-outlined text-[20px]">show_chart</span>
                       </div>
                       <div>
                           <div class="text-sm font-bold text-stone-800">股票現值</div>
                           <a href="/tools/stock-calculator.html" class="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 mt-0.5">
                               前往設定 <span class="material-symbols-outlined text-[10px]">arrow_outward</span>
                           </a>
                       </div>
                   </div>
                   <div class="font-mono font-bold text-stone-700 text-lg" :class="{'text-stone-300': !stockData.defined}">
                       {{ stockData.defined ? fmt(stockData.amount) : '未設定' }}
                   </div>
               </div>
           </div>
        </div>

        <!-- Manual Living Cost -->
        <div class="card rounded-2xl p-6 md:p-8 md:col-span-2">
            <h3 class="text-lg font-bold text-stone-800 mb-6">其他生活開銷 (手動預估)</h3>
            <div class="flex flex-col md:flex-row gap-8 items-center">
                <div class="w-full md:w-2/3 space-y-4">
                    <label class="block text-xs font-bold text-stone-500 uppercase tracking-wide">每月預估 (吃喝玩樂、交通、雜費)</label>
                    <input type="range" min="0" max="100000" step="1000" v-model.number="manualLivingCost" 
                           class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-600 hover:accent-emerald-500 transition-colors">
                    <div class="flex justify-between text-xs font-medium text-stone-400 font-mono">
                        <span>$0</span>
                        <span>$50,000</span>
                        <span>$100,000</span>
                    </div>
                </div>
                <div class="w-full md:w-1/3">
                    <div class="bg-stone-50 rounded-2xl p-6 border border-stone-200 text-center">
                        <div class="text-3xl font-black text-stone-800 font-mono tracking-tight">{{ fmt(manualLivingCost) }}</div>
                        <div class="text-xs font-bold text-stone-400 mt-1 uppercase tracking-widest">目前設定</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Analysis Modal -->
    <div v-if="showAnalysis" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm" @click.self="showAnalysis = false">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div class="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <h3 class="text-lg font-bold text-stone-800">財務情境模擬 (What-If Analysis)</h3>
                <button @click="showAnalysis = false" class="p-1 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div class="p-6 md:p-8 overflow-y-auto">
                 <div class="flex flex-col md:flex-row gap-8 mb-8">
                     <div class="space-y-6 w-full md:w-1/2">
                         <div>
                             <label class="block text-xs font-bold text-stone-500 mb-2 uppercase">模擬月儲蓄金額</label>
                             <input type="range" v-model.number="simMonthlySavings" :min="0" :max="totalIncome * 1.5" step="1000" class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                             <div class="flex justify-between items-center mt-2">
                                 <span class="text-xs text-stone-400">當前: {{ fmt(netCashflow) }}</span>
                                 <span class="font-mono font-bold text-emerald-600">{{ fmt(simMonthlySavings) }}</span>
                             </div>
                         </div>
                         <div>
                             <label class="block text-xs font-bold text-stone-500 mb-2 uppercase">預估年化報酬率 (%)</label>
                             <input type="number" v-model.number="simReturnRate" class="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" step="0.1">
                         </div>
                         <div>
                             <label class="block text-xs font-bold text-stone-500 mb-2 uppercase">模擬年限 (年)</label>
                             <input type="number" v-model.number="simYears" class="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" min="1" max="50">
                         </div>
                     </div>
                     
                     <div class="w-full md:w-1/2 bg-stone-900 rounded-2xl p-6 text-center flex flex-col justify-center relative overflow-hidden">
                         <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-stone-800 to-stone-900 z-0"></div>
                         <div class="relative z-10">
                             <h4 class="text-xs font-bold text-stone-400 uppercase mb-4 tracking-widest">{{ simYears }} 年後預估淨資產</h4>
                             <div class="text-4xl font-black text-emerald-400 font-mono tracking-tight mb-4">{{ fmt(simFutureValue) }}</div>
                             <div class="space-y-2 text-xs font-medium text-stone-500 border-t border-stone-800 pt-4">
                                 <div class="flex justify-between"><span>本金投入</span> <span class="text-stone-300">{{ fmt(simTotalPrincipal) }}</span></div>
                                 <div class="flex justify-between"><span>複利利息</span> <span class="text-emerald-500">+{{ fmt(simTotalInterest) }}</span></div>
                             </div>
                         </div>
                     </div>
                 </div>
                 
                 <div class="text-xs text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-100 italic">
                     * 計算假設：每月定期定額投入模擬儲蓄金額，現有淨資產與新增資金皆以設定之年化報酬率複利成長。此為簡易估算，不代表實際投資回報。
                 </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const loading = ref(false);
const showAnalysis = ref(false);
const privacyMode = ref(false);

// Refs for Chart
const expenseChartRef = ref(null);
let chartInstance = null;

// Data States
const salaryData = ref({ defined: false, amount: 0 });
const deliveryData = ref({ defined: false, amount: 0 });
const mortgageData = ref({ defined: false, amount: 0 });
const rentData = ref({ defined: false, amount: 0 });
const electricData = ref({ defined: false, amount: 0 });
const stockData = ref({ defined: false, amount: 0 });
const savingsData = ref({ defined: false, amount: 0 });
const debtData = ref({ defined: false, amount: 0 });

// Manual States
const manualLivingCost = ref(0);

// Format currency
const fmt = (n) => n ? '$' + Math.round(n).toLocaleString('zh-TW') : '$0';

// Toggle Privacy
const togglePrivacy = () => {
  privacyMode.value = !privacyMode.value;
  localStorage.setItem('taicalc_privacy', privacyMode.value);
};

// Load Data Function
const reloadData = () => {
    loading.value = true;
    setTimeout(() => {
        // Helpers
        const getVal = (key) => {
            const val = localStorage.getItem(key);
            return val ? { defined: true, amount: parseInt(val) } : { defined: false, amount: 0 };
        };

        salaryData.value = getVal('taicalc_salary_net');
        deliveryData.value = getVal('taicalc_delivery_net');
        mortgageData.value = getVal('taicalc_mortgage_monthly');
        rentData.value = getVal('taicalc_rent_monthly');
        electricData.value = getVal('taicalc_electricity_monthly');
        stockData.value = getVal('taicalc_stock_value');
        savingsData.value = getVal('taicalc_savings_total');
        debtData.value = getVal('taicalc_debt_total');
        
        loading.value = false;
    }, 100);
};

// Computed
const totalIncome = computed(() => (salaryData.value.amount || 0) + (deliveryData.value.amount || 0));
const totalExpense = computed(() => (mortgageData.value.amount || 0) + (rentData.value.amount || 0) + (electricData.value.amount || 0) + (manualLivingCost.value || 0));
const netCashflow = computed(() => totalIncome.value - totalExpense.value);

const totalLiquidAssets = computed(() => savingsData.value.amount || 0);
const totalAssets = computed(() => totalLiquidAssets.value + (stockData.value.amount || 0));
const totalLiabilities = computed(() => debtData.value.amount || 0);
const netWorth = computed(() => totalAssets.value - totalLiabilities.value);

const emergencyFundGoal = computed(() => totalExpense.value * 6);
const emergencyFundProgress = computed(() => {
    if (emergencyFundGoal.value === 0) return 0;
    return Math.min(100, Math.round((totalLiquidAssets.value / emergencyFundGoal.value) * 100));
});

const freedomScore = computed(() => {
    if (totalIncome.value <= 0) return 0;
    return Math.max(0, Math.round((netCashflow.value / totalIncome.value) * 100));
});

const savingsStatus = computed(() => {
    const s = freedomScore.value;
    if (s >= 50) return '優秀 🌟';
    if (s >= 30) return '良好 👍';
    if (s >= 10) return '普通 🙂';
    return '加油 💪';
});

// Health Score
const healthScore = computed(() => {
    let score = 0;
    score += Math.min(40, freedomScore.value); // Savings Rate (Max 40)
    score += Math.min(30, (emergencyFundProgress.value / 100) * 30); // E-Fund (Max 30)
    
    if (debtData.value.amount === 0) score += 20; // No Debt (Max 20)
    else score += Math.max(0, 20 - (debtData.value.amount / (totalAssets.value || 1)) * 50);
    
    if (stockData.value.amount > 0) score += 10; // Investing (Max 10)
    
    return Math.round(score);
});

// Tips
const activeTips = computed(() => {
    const tips = [];
    if (freedomScore.value < 20 && totalIncome.value > 0) tips.push(`您的儲蓄率僅 ${freedomScore.value}%，建議檢視「支出明細」找出可節省的開銷，目標設定在 30% 以上。`);
    if (emergencyFundProgress.value < 100 && totalExpense.value > 0) tips.push(`緊急預備金尚未存滿 (目前 ${emergencyFundProgress.value}%)，建議優先儲蓄，以備不時之需。`);
    if (debtData.value.amount > 0) tips.push(`您有 ${fmt(debtData.value.amount)} 的負債 (不含房貸)。如有高利率債務 (如信用卡循環)，請優先償還。`);
    if (manualLivingCost.value > totalExpense.value * 0.4 && totalExpense.value > 0) tips.push(`手動輸入的生活雜費佔比偏高 (${Math.round(manualLivingCost.value / totalExpense.value * 100)}%)，建議使用記帳詳列明細。`);
    if (stockData.value.amount === 0 && netCashflow.value > 10000 && emergencyFundProgress.value === 100) tips.push('您有穩定的正向現金流且預備金充足，建議開始研究 ETF 或股票投資，讓資產增值。');
    return tips;
});

// Trends (Mocked)
const trends = ref({ income: 0, expense: 0 });
const checkHistory = () => {
    // Mock history logic
    const historyStr = localStorage.getItem('taicalc_history');
    let history = historyStr ? JSON.parse(historyStr) : {};
    
    if (!historyStr && totalIncome.value > 0) {
        history = { 'last_month': { income: totalIncome.value * 0.95, expense: totalExpense.value * 1.05 } };
    }
    
    if (history['last_month']) {
        const last = history['last_month'];
        if (last.income > 0) trends.value.income = Math.round(((totalIncome.value - last.income) / last.income) * 100);
        if (last.expense > 0) trends.value.expense = Math.round(((totalExpense.value - last.expense) / last.expense) * 100);
    }
    
    history['current'] = { income: totalIncome.value, expense: totalExpense.value };
    localStorage.setItem('taicalc_history', JSON.stringify(history));
};

// Simulation Logic
const simReturnRate = ref(5);
const simYears = ref(10);
const simMonthlySavings = ref(0);

watch(showAnalysis, (val) => {
    if (val) simMonthlySavings.value = Math.max(0, netCashflow.value);
});

const simFutureValue = computed(() => {
    const r = simReturnRate.value / 100;
    const t = simYears.value;
    const P = totalAssets.value - totalLiabilities.value;
    const PMT = simMonthlySavings.value;
    const rm = r / 12;
    const N = t * 12;
    
    let fv_lump = P * Math.pow(1 + rm, N);
    let fv_annuity = (rm === 0) ? (PMT * N) : (PMT * ((Math.pow(1 + rm, N) - 1) / rm));
    
    return Math.round(fv_lump + fv_annuity);
});

const simTotalPrincipal = computed(() => (totalAssets.value - totalLiabilities.value) + (simMonthlySavings.value * 12 * simYears.value));
const simTotalInterest = computed(() => simFutureValue.value - simTotalPrincipal.value);

// Persistence & Actions
const fileInput = ref(null);

const resetData = () => {
    if (confirm('確定要清除所有紀錄並重置儀表板嗎？此動作無法復原。')) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('taicalc_')) localStorage.removeItem(key);
        });
        reloadData();
    }
};

const saveData = (type) => {
    if (type === 'savings') localStorage.setItem('taicalc_savings_total', savingsData.value.amount || 0);
    else if (type === 'debt') localStorage.setItem('taicalc_debt_total', debtData.value.amount || 0);
};

const exportData = () => {
    const data = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('taicalc_')) data[key] = localStorage.getItem(key);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taicalc_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            let count = 0;
            Object.entries(data).forEach(([key, value]) => {
                if (key.startsWith('taicalc_')) {
                    localStorage.setItem(key, value);
                    count++;
                }
            });
            alert(`成功還原 ${count} 筆設定！`);
            reloadData();
        } catch (err) {
            alert('檔案格式錯誤，無法還原。');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
};

// Chart Logic
const initChart = () => {
    if (!expenseChartRef.value) return;
    const ctx = expenseChartRef.value.getContext('2d');
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['房貸', '房租', '電費', '生活雜支'],
            datasets: [{
                data: [
                    mortgageData.value.amount || 0,
                    rentData.value.amount || 0,
                    electricData.value.amount || 0,
                    manualLivingCost.value || 0
                ],
                backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#78716c'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } } }
        }
    });
};

watch(totalExpense, () => {
    if (chartInstance) {
        chartInstance.data.datasets[0].data = [
            mortgageData.value.amount || 0,
            rentData.value.amount || 0,
            electricData.value.amount || 0,
            manualLivingCost.value || 0
        ];
        chartInstance.update();
    }
});

// Lifecycle
onMounted(() => {
    const savedLiving = localStorage.getItem('taicalc_living_manual');
    if (savedLiving) manualLivingCost.value = parseInt(savedLiving);
    
    const savedPrivacy = localStorage.getItem('taicalc_privacy');
    if (savedPrivacy) privacyMode.value = (savedPrivacy === 'true');

    reloadData();
    window.addEventListener('storage', reloadData);
    
    setTimeout(() => {
        initChart();
        checkHistory();
    }, 500);
});

onUnmounted(() => {
    window.removeEventListener('storage', reloadData);
});

watch(manualLivingCost, (newVal) => {
    localStorage.setItem('taicalc_living_manual', newVal);
});

</script>
