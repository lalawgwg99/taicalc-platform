/**
 * 財務知識庫核心引擎
 * 提供文章搜尋、推薦和學習路徑功能
 */

import {
  KnowledgeArticle,
  KnowledgeCategory,
  SearchQuery,
  SearchResult,
  ArticleRecommendation,
  LearningPath,
  UserProgress
} from './types';

export class KnowledgeBaseEngine {
  private articles: KnowledgeArticle[] = [];
  private learningPaths: LearningPath[] = [];

  constructor() {
    this.initializeKnowledgeBase();
  }

  /**
   * 初始化知識庫內容
   */
  private initializeKnowledgeBase(): void {
    this.articles = [
      {
        id: 'salary-basics',
        title: '薪資結構完全解析：勞保、健保、勞退一次搞懂',
        content: `
# 薪資結構完全解析：勞保、健保、勞退一次搞懂

> 作者：林志成｜TaiCalc 首席財務分析師｜20年薪資規劃經驗

每個月薪水入帳時，你是否曾經疑惑：「為什麼實領金額總是比預期少這麼多？」這些被扣除的項目到底是什麼？對你的未來又有什麼保障？

作為一名資深財務顧問，我經常遇到上班族對薪資結構的困惑。今天，我將用最淺顯易懂的方式，帶你完全理解台灣的薪資扣除制度。

## 薪資扣除的三大支柱

台灣的薪資扣除制度建立在「三層保障」的概念上：

### 第一層：勞工保險（勞保）
**這是你的基本安全網**

勞保就像是政府為所有勞工建立的大型互助會。當你面臨失業、傷病、生育、失能或老年時，這個制度會提供基本的經濟保障。

**2025年最新費率：11.5%**
- 雇主負擔：70%（約8.05%）
- 勞工負擔：20%（約2.3%）
- 政府負擔：10%（約1.15%）

**投保薪資上限：45,800元**

以月薪5萬元為例，你的勞保費約為：
45,800 × 11.5% × 20% = 1,053元

### 第二層：全民健康保險（健保）
**這是你的醫療保護傘**

健保讓你在生病時不用擔心醫療費用。這個制度的設計理念是「有錢出錢，有力出力」。

**2025年費率：5.17%**
- 雇主負擔：60%（約3.1%）
- 勞工負擔：30%（約1.55%）
- 政府負擔：10%（約0.52%）

**投保薪資上限：182,000元**

月薪5萬元的健保費：
50,000 × 5.17% × 30% = 776元

### 第三層：勞工退休金（勞退）
**這是你的退休保障**

新制勞退採用「個人專戶制」，就像是雇主每個月強制幫你存退休金。

**雇主提撥：6%（強制）**
**勞工自提：0-6%（自願）**

月薪5萬元的勞退：
- 雇主提撥：50,000 × 6% = 3,000元（不從薪水扣除）
- 如果你選擇自提6%：50,000 × 6% = 3,000元（從薪水扣除，但可節稅）

## 實際案例分析

讓我們以一位月薪5萬元的上班族小王為例：

**薪資總額：50,000元**

**扣除項目：**
- 勞保費：1,053元
- 健保費：776元
- 勞退自提（假設6%）：3,000元
- 所得稅（假設5%級距）：約500元

**實領金額：約44,671元**

## 專家建議：如何優化你的薪資結構

### 1. 善用勞退自提的節稅效果
勞退自提不僅能增加退休金，還能享受所得稅減免。以5%稅率計算，每月自提3,000元可節稅150元。

### 2. 了解投保薪資級距的重要性
確保你的投保薪資與實際薪資相符，這關係到你的保障額度和退休金累積。

### 3. 定期檢視薪資明細
每個月都要檢查薪資明細，確保扣除項目正確無誤。

## 常見迷思破解

**迷思一：「扣這麼多錢，根本沒有保障」**
事實上，這些扣除項目都會在你需要時提供保障。以勞保老年給付為例，工作35年的勞工平均可領取約200萬元的退休金。

**迷思二：「勞退自提不划算」**
勞退自提除了節稅效果外，政府還保證不低於2年期定存利率的收益，是相當穩健的投資工具。

## 結語

理解薪資結構不只是為了知道錢去哪了，更重要的是了解這些制度如何保護你的未來。每一筆扣除都是對未來的投資，善用這些制度，就能為自己建立更穩固的財務基礎。

記住：財務規劃不是有錢人的專利，而是每個人都應該具備的基本技能。從理解薪資結構開始，踏出你的理財第一步。

---
*本文僅供參考，實際狀況請以勞動部及相關機關最新公告為準。如有個人化財務規劃需求，建議諮詢專業財務顧問。*
        `,
        summary: '深度解析台灣薪資結構，從勞保、健保到勞退的完整說明，包含實際案例和專家建議。',
        category: 'salary',
        tags: ['薪資計算', '勞保', '健保', '勞退', '稅務', '財務規劃'],
        difficulty: 'beginner',
        readingTime: 12,
        author: '林志成｜TaiCalc 首席財務分析師',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['salary', 'tax'],
        relatedArticles: ['tax-planning-basics', 'retirement-planning'],
        views: 2850,
        rating: 4.9
      },
      {
        id: 'investment-basics',
        title: '投資理財入門：從零開始建立投資組合',
        content: `
# 投資理財入門：從零開始建立投資組合

> 作者：陳美玲｜TaiCalc 投資策略總監｜前外商銀行財富管理部門主管

「我想開始投資，但不知道從何開始。」這是我在財富管理生涯中最常聽到的問題。

經過15年的實務經驗，我發現許多人對投資的恐懼來自於不了解。今天，我要用最實用的角度，帶你建立正確的投資觀念和策略。

## 投資前的三大準備：地基要穩，房子才不會倒

### 1. 緊急預備金：你的財務安全網
**建議金額：3-6個月的生活費**

這不是投資，而是保險。想像一下，如果明天失業或生病，你能撐多久？

**實際案例：**
小張月支出3萬元，他準備了18萬元的緊急預備金。去年疫情期間被裁員，這筆錢讓他有充足時間找到更好的工作，而不用急著賣掉投資部位。

### 2. 清償高利率債務：別讓利息吃掉你的獲利
**優先順序：信用卡債 > 現金卡 > 信貸**

信用卡年利率通常超過15%，即使你的投資年報酬率有10%，扣掉15%的利息成本，你還是虧損5%。

### 3. 風險承受度評估：認識自己比認識市場更重要

**保守型（風險承受度20%以下）**
- 特徵：無法承受本金損失
- 適合工具：定存、債券、貨幣基金
- 預期報酬：2-4%

**穩健型（風險承受度20-60%）**
- 特徵：可承受短期波動，追求穩定成長
- 適合工具：平衡型基金、ETF組合
- 預期報酬：4-8%

**積極型（風險承受度60%以上）**
- 特徵：追求高報酬，可承受較大波動
- 適合工具：股票、股票型基金
- 預期報酬：8-12%（長期）

## 投資工具深度解析

### ETF：新手投資者的最佳選擇

**為什麼我推薦ETF？**
1. **分散風險**：一次買進數十或數百檔股票
2. **費用低廉**：管理費通常低於0.5%
3. **透明度高**：持股內容完全公開
4. **流動性佳**：隨時可以買賣

**推薦組合（穩健型投資者）：**
- 台灣50 ETF（0050）：40%
- 美國標普500 ETF：30%
- 債券ETF：20%
- 新興市場ETF：10%

### 定期定額：時間是你最好的朋友

**實際回測數據：**
假設從2010年開始，每月定期定額投資台灣50 ETF 1萬元：
- 總投入：168萬元（14年）
- 市值：約280萬元
- 年化報酬率：約8.5%

**成功關鍵：**
1. 選擇適當標的
2. 持續不間斷
3. 不要試圖擇時進出

## 資產配置：不要把雞蛋放在同一個籃子裡

### 年齡配置法則
**股票比例 = 100 - 年齡**

- 25歲：股票75%，債券25%
- 40歲：股票60%，債券40%
- 55歲：股票45%，債券55%

### 地區配置建議
- 台灣：40-50%（熟悉的市場）
- 美國：30-40%（全球最大市場）
- 其他已開發國家：10-15%
- 新興市場：5-10%

## 避開這些投資陷阱

### 陷阱一：追高殺低
**錯誤行為：**看到股市大漲才進場，看到大跌就恐慌賣出。

**正確做法：**建立紀律，定期定額投資，不受市場情緒影響。

### 陷阱二：過度集中投資
**錯誤行為：**把所有錢投入單一股票或產業。

**正確做法：**分散投資不同資產類別和地區。

### 陷阱三：忽略成本
**錯誤行為：**只看報酬率，不計算手續費和管理費。

**正確做法：**選擇低成本的投資工具，長期下來差異很大。

## 我的投資建議

### 新手投資者（資金50萬以下）
1. 建立緊急預備金
2. 選擇2-3檔ETF定期定額
3. 每年檢視一次配置

### 進階投資者（資金50-200萬）
1. 增加資產類別多樣性
2. 考慮加入債券和REITs
3. 每季檢視並再平衡

### 資深投資者（資金200萬以上）
1. 考慮個股投資
2. 加入另類投資
3. 尋求專業財務顧問協助

## 結語：投資是馬拉松，不是百米衝刺

記住，投資最重要的不是找到下一個飆股，而是建立一套適合自己的投資系統，並且持之以恆。

市場會有起伏，但時間站在投資者這一邊。開始行動，比完美的計劃更重要。

---
*投資有風險，過去績效不代表未來表現。本文僅供參考，投資前請詳閱公開說明書。*
        `,
        summary: '資深財富管理專家分享投資理財的完整入門指南，從基礎準備到實戰策略。',
        category: 'investment',
        tags: ['投資入門', '資產配置', 'ETF', '定期定額', '風險管理', '財富管理'],
        difficulty: 'beginner',
        readingTime: 15,
        author: '陳美玲｜TaiCalc 投資策略總監',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['capital', 'retirement'],
        relatedArticles: ['retirement-planning', 'house-buying-guide'],
        views: 3200,
        rating: 4.8
      },
      {
        id: 'house-buying-guide',
        title: '買房完全攻略：從頭期款到房貸規劃',
        content: `
# 買房完全攻略

## 買房前的財務準備

### 1. 頭期款準備
- 一般建議：房價的 20-30%
- 最低要求：房價的 10-15%
- 包含：簽約金、開工款、完工款

### 2. 其他費用
- 仲介費：房價的 1-2%
- 代書費：約 10-15 萬
- 裝潢費：依需求而定
- 搬家費用

### 3. 財務能力評估
- 房貸月付金不超過月收入 30%
- 保留緊急預備金
- 考慮未來收入變化

## 房貸選擇策略

### 利率類型
- 固定利率：利率不變，適合升息環境
- 機動利率：隨市場調整，適合降息環境
- 混合利率：前期固定，後期機動

### 還款方式
- 本息均攤：每月還款金額固定
- 本金均攤：每月本金固定，利息遞減
- 寬限期：前期只還利息

### 貸款年限
- 20年：總利息較少，月付金較高
- 30年：月付金較低，總利息較多
- 40年：月付金最低，總利息最多

## 購屋流程

1. 確定預算和需求
2. 選擇地段和物件
3. 實地看屋評估
4. 議價和簽約
5. 申請房貸
6. 完成過戶

## 注意事項

- 檢查房屋權狀
- 了解社區管理
- 評估增值潛力
- 考慮交通便利性
        `,
        summary: '完整的買房指南，涵蓋財務準備、房貸選擇和購屋流程。',
        category: 'mortgage',
        tags: ['買房', '房貸', '頭期款', '利率', '財務規劃'],
        difficulty: 'intermediate',
        readingTime: 15,
        author: 'TaiCalc 房產專家',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['mortgage', 'salary'],
        relatedArticles: ['salary-basics', 'investment-basics'],
        views: 1800,
        rating: 4.9
      },
      {
        id: 'retirement-planning',
        title: '退休規劃全攻略：提早準備，安心退休',
        content: `
# 退休規劃全攻略：提早準備，安心退休

> 作者：王建國｜TaiCalc 退休規劃專家｜協助超過1000位客戶成功退休

「我什麼時候可以退休？」「退休後需要多少錢？」這些問題在我20年的退休規劃顧問生涯中，被問過無數次。

今天，我要用最實務的角度，告訴你如何計算退休金需求，以及如何一步步實現財務自由的退休生活。

## 台灣退休金制度：三層保障架構

### 第一層：勞保老年給付（政府保障）
**這是你的基本退休保障**

**年金給付計算公式：**
平均月投保薪資 × 年資 × 0.775% + 3,000元

**實際案例：**
小李工作35年，平均月投保薪資4萬元：
40,000 × 35 × 0.775% + 3,000 = 13,850元/月

**一次給付 vs 年金給付選擇：**
- 年金：適合長壽家族，保障終身
- 一次給付：適合有其他投資規劃者

### 第二層：勞工退休金（雇主提撥）
**新制勞退的個人專戶制**

**累積金額估算：**
以月薪5萬元，工作30年為例：
- 雇主提撥：50,000 × 6% × 12 × 30 = 540萬元
- 加上投資收益（假設年報酬3%）：約750萬元

**自提的威力：**
如果同時自提6%，總金額可達1,500萬元！

### 第三層：個人退休準備（自己負責）
**這是決定退休生活品質的關鍵**

包含：
- 個人投資組合
- 商業保險
- 不動產投資
- 其他被動收入

## 退休金需求計算：你需要多少錢？

### 替代率概念
**退休後月收入 ÷ 退休前月收入 = 替代率**

**國際建議標準：**
- 基本生活：50-60%
- 舒適生活：70-80%
- 豐富生活：80-100%

### 實際計算範例

**假設條件：**
- 退休前月薪：8萬元
- 目標替代率：70%
- 退休後需求：56,000元/月
- 預期壽命：85歲
- 退休年齡：65歲

**第一、二層保障：**
- 勞保年金：約15,000元/月
- 勞退月退：約12,000元/月
- 小計：27,000元/月

**資金缺口：**
56,000 - 27,000 = 29,000元/月

**需要準備的退休金：**
29,000 × 12 × 20年 = 696萬元

## 不同年齡的退休投資策略

### 20-30歲：積極成長期
**投資配置：**
- 股票型基金/ETF：70-80%
- 債券型基金：20-30%

**策略重點：**
- 定期定額投資
- 善用時間複利
- 可承受較高風險

**實際建議：**
每月投資1萬元，年報酬8%，30年後可累積約1,200萬元

### 30-45歲：穩健累積期
**投資配置：**
- 股票型投資：60-70%
- 債券型投資：30-40%

**策略重點：**
- 增加投資金額
- 開始關注資產配置
- 定期檢視調整

### 45-60歲：保守轉換期
**投資配置：**
- 股票型投資：40-50%
- 債券型投資：50-60%

**策略重點：**
- 降低投資風險
- 增加固定收益投資
- 準備退休後現金流

### 60歲以上：收益保全期
**投資配置：**
- 股票型投資：20-30%
- 債券型投資：70-80%

**策略重點：**
- 保本為主
- 創造穩定現金流
- 考慮年金保險

## 退休規劃的五大迷思

### 迷思一：「退休還很遠，不用急」
**事實：**越早開始，需要的月投資金額越少。

25歲開始每月投資5,000元 vs 35歲開始每月投資10,000元，
最終累積金額相近，但總投入金額差很多。

### 迷思二：「勞保勞退就夠了」
**事實：**第一、二層保障只能維持基本生活。

以目前制度，替代率約40-50%，距離舒適退休還有一段距離。

### 迷思三：「退休後花費會減少」
**事實：**醫療費用和休閒支出可能增加。

根據統計，退休後前10年的支出通常不會明顯減少。

### 迷思四：「房子就是最好的退休保障」
**事實：**房子無法直接產生現金流。

除非出售或出租，否則房子只是資產，不是收入。

### 迷思五：「退休金越多越好」
**事實：**適度就好，過度儲蓄會犧牲現在的生活品質。

## 我的退休規劃建議

### 立即行動清單

**第一步：計算退休金需求**
1. 估算退休後月支出
2. 計算勞保勞退給付
3. 找出資金缺口

**第二步：制定投資計劃**
1. 評估風險承受度
2. 選擇適當投資工具
3. 設定定期定額投資

**第三步：定期檢視調整**
1. 每年檢視一次
2. 根據人生階段調整
3. 考慮通膨影響

### 不同收入族群的建議

**月薪3-5萬：**
- 優先自提勞退6%
- 定期定額投資ETF
- 目標：每月投資5,000-8,000元

**月薪5-10萬：**
- 增加投資多樣性
- 考慮海外投資
- 目標：每月投資10,000-20,000元

**月薪10萬以上：**
- 尋求專業財務規劃
- 考慮稅務優化
- 多元化投資組合

## 結語：退休規劃是人生最重要的投資

退休不是人生的終點，而是另一個開始。透過適當的規劃，你可以在退休後過著有尊嚴、有品質的生活。

記住：退休規劃沒有標準答案，只有最適合你的方案。開始行動，永遠不嫌晚，但越早開始，選擇越多。

---
*本文僅供參考，實際退休規劃應考慮個人狀況。建議諮詢專業財務顧問。*
        `,
        summary: '退休規劃專家20年經驗分享，完整的退休金計算方法和投資策略指南。',
        category: 'retirement',
        tags: ['退休規劃', '勞保', '勞退', '替代率', '投資策略', '財務自由'],
        difficulty: 'intermediate',
        readingTime: 20,
        author: '王建國｜TaiCalc 退休規劃專家',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['retirement', 'capital', 'salary'],
        relatedArticles: ['salary-basics', 'investment-basics'],
        views: 2650,
        rating: 4.9
      },
      {
        id: 'tax-planning-basics',
        title: '個人稅務規劃：合法節稅策略大公開',
        content: `
# 個人稅務規劃指南

## 綜合所得稅基礎

### 稅率級距（2025年）
- 5%：0-59萬
- 12%：59-133萬
- 20%：133-266萬
- 30%：266-498萬
- 40%：498萬以上

### 免稅額
- 個人：44.6萬
- 配偶：44.6萬
- 扶養親屬：13.2萬/人

## 合法節稅策略

### 1. 善用扣除額
- 標準扣除額 vs 列舉扣除額
- 特別扣除額：薪資、身心障礙等
- 幼兒學前扣除額

### 2. 投資節稅
- 勞退自提：最高 10.8萬/年
- 保險費扣除額：2.4萬/年
- 捐贈扣除額：所得 20%

### 3. 時機規劃
- 所得分年認列
- 費用集中扣除
- 投資損益實現時點

## 常見節稅工具

### 勞退自提
- 節稅效果：依稅率級距
- 投資報酬：不低於 2年期定存
- 提領方式：月退或一次領

### 商業保險
- 人身保險：2.4萬/年
- 健康醫療險：2.4萬/年
- 投資型保險：注意相關規定

### 教育支出
- 子女教育費：2.5萬/人
- 幼兒學前：12萬/人
- 身心障礙：20萬/人

## 申報注意事項

1. 保留相關憑證
2. 選擇有利申報方式
3. 注意申報期限
4. 善用網路申報
5. 定期檢視調整

## 風險提醒

- 避免逃漏稅行為
- 注意查核重點
- 保持誠實申報
- 尋求專業協助
        `,
        summary: '個人稅務規劃的基礎知識和合法節稅策略分享。',
        category: 'tax',
        tags: ['稅務規劃', '節稅', '綜合所得稅', '扣除額', '勞退自提'],
        difficulty: 'intermediate',
        readingTime: 14,
        author: 'TaiCalc 稅務專家',
        publishDate: '2025-01-01',
        lastUpdated: '2025-01-01',
        relatedCalculators: ['tax', 'salary'],
        relatedArticles: ['salary-basics', 'retirement-planning'],
        views: 1400,
        rating: 4.6
      }
    ];

    this.learningPaths = [
      {
        id: 'financial-basics',
        title: '理財基礎入門',
        description: '從零開始學習個人理財，建立正確的財務觀念和基礎知識。',
        category: 'financial_planning',
        difficulty: 'beginner',
        estimatedTime: 6,
        articles: ['salary-basics', 'investment-basics', 'tax-planning-basics'],
        prerequisites: [],
        objectives: [
          '了解薪資結構和相關扣除項目',
          '建立基本投資理財概念',
          '掌握個人稅務規劃基礎'
        ]
      },
      {
        id: 'home-ownership',
        title: '購屋置產規劃',
        description: '完整的購屋規劃指南，從財務準備到房貸選擇。',
        category: 'mortgage',
        difficulty: 'intermediate',
        estimatedTime: 8,
        articles: ['house-buying-guide', 'salary-basics', 'investment-basics'],
        prerequisites: ['financial-basics'],
        objectives: [
          '評估購屋財務能力',
          '了解房貸產品和選擇策略',
          '制定購屋時程規劃'
        ]
      },
      {
        id: 'retirement-preparation',
        title: '退休準備規劃',
        description: '全面的退休規劃指南，確保退休生活無憂。',
        category: 'retirement',
        difficulty: 'intermediate',
        estimatedTime: 10,
        articles: ['retirement-planning', 'investment-basics', 'salary-basics', 'tax-planning-basics'],
        prerequisites: ['financial-basics'],
        objectives: [
          '計算退休金需求',
          '制定退休投資策略',
          '優化退休稅務規劃'
        ]
      }
    ];
  }

  /**
   * 搜尋文章
   */
  searchArticles(query: SearchQuery): SearchResult {
    let filteredArticles = [...this.articles];

    // 關鍵字搜尋
    if (query.query) {
      const searchTerm = query.query.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // 分類篩選
    if (query.category) {
      filteredArticles = filteredArticles.filter(article =>
        article.category === query.category
      );
    }

    // 難度篩選
    if (query.difficulty) {
      filteredArticles = filteredArticles.filter(article =>
        article.difficulty === query.difficulty
      );
    }

    // 標籤篩選
    if (query.tags && query.tags.length > 0) {
      filteredArticles = filteredArticles.filter(article =>
        query.tags!.some(tag => article.tags.includes(tag))
      );
    }

    // 按相關性和評分排序
    filteredArticles.sort((a, b) => {
      // 簡單的相關性評分
      let scoreA = a.rating * a.views;
      let scoreB = b.rating * b.views;

      if (query.query) {
        const searchTerm = query.query.toLowerCase();
        if (a.title.toLowerCase().includes(searchTerm)) scoreA += 1000;
        if (b.title.toLowerCase().includes(searchTerm)) scoreB += 1000;
      }

      return scoreB - scoreA;
    });

    // 限制結果數量
    const limit = query.limit || 10;
    const results = filteredArticles.slice(0, limit);

    // 生成搜尋建議
    const suggestions = this.generateSearchSuggestions(query.query || '');
    const relatedTopics = this.getRelatedTopics(results);

    return {
      articles: results,
      totalCount: filteredArticles.length,
      suggestions,
      relatedTopics
    };
  }

  /**
   * 獲取文章推薦
   */
  getArticleRecommendations(
    articleId: string, 
    userProgress?: UserProgress,
    limit: number = 5
  ): ArticleRecommendation[] {
    const currentArticle = this.articles.find(a => a.id === articleId);
    if (!currentArticle) return [];

    const recommendations: ArticleRecommendation[] = [];

    // 1. 相關文章推薦
    currentArticle.relatedArticles.forEach(relatedId => {
      const relatedArticle = this.articles.find(a => a.id === relatedId);
      if (relatedArticle) {
        recommendations.push({
          article: relatedArticle,
          reason: '相關主題文章',
          relevanceScore: 0.9
        });
      }
    });

    // 2. 同分類文章推薦
    const sameCategory = this.articles.filter(a => 
      a.id !== articleId && 
      a.category === currentArticle.category &&
      !currentArticle.relatedArticles.includes(a.id)
    );

    sameCategory.forEach(article => {
      recommendations.push({
        article,
        reason: `${this.getCategoryName(article.category)}相關文章`,
        relevanceScore: 0.7
      });
    });

    // 3. 相似標籤文章推薦
    const similarTags = this.articles.filter(a => 
      a.id !== articleId &&
      a.tags.some(tag => currentArticle.tags.includes(tag)) &&
      !recommendations.some(r => r.article.id === a.id)
    );

    similarTags.forEach(article => {
      const commonTags = article.tags.filter(tag => currentArticle.tags.includes(tag));
      recommendations.push({
        article,
        reason: `相似主題：${commonTags.join('、')}`,
        relevanceScore: 0.6
      });
    });

    // 4. 基於用戶偏好推薦
    if (userProgress) {
      const userPreferredCategories = userProgress.preferences.categories;
      const userPreferredDifficulty = userProgress.preferences.difficulty;

      const personalizedArticles = this.articles.filter(a =>
        a.id !== articleId &&
        !recommendations.some(r => r.article.id === a.id) &&
        (userPreferredCategories.includes(a.category) || a.difficulty === userPreferredDifficulty)
      );

      personalizedArticles.forEach(article => {
        recommendations.push({
          article,
          reason: '基於您的偏好推薦',
          relevanceScore: 0.5
        });
      });
    }

    // 按相關性評分排序並限制數量
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * 獲取學習路徑
   */
  getLearningPaths(category?: KnowledgeCategory): LearningPath[] {
    if (category) {
      return this.learningPaths.filter(path => path.category === category);
    }
    return [...this.learningPaths];
  }

  /**
   * 獲取熱門文章
   */
  getPopularArticles(limit: number = 5): KnowledgeArticle[] {
    return [...this.articles]
      .sort((a, b) => (b.views * b.rating) - (a.views * a.rating))
      .slice(0, limit);
  }

  /**
   * 獲取最新文章
   */
  getLatestArticles(limit: number = 5): KnowledgeArticle[] {
    return [...this.articles]
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }

  /**
   * 根據計算器推薦相關文章
   */
  getArticlesByCalculator(calculatorType: string, limit: number = 3): KnowledgeArticle[] {
    return this.articles
      .filter(article => article.relatedCalculators.includes(calculatorType))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * 生成搜尋建議
   */
  private generateSearchSuggestions(query: string): string[] {
    if (!query) return [];

    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    // 基於文章標題和標籤生成建議
    this.articles.forEach(article => {
      // 標題建議
      if (article.title.toLowerCase().includes(lowerQuery)) {
        suggestions.push(article.title);
      }

      // 標籤建議
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery) && !suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
    });

    return suggestions.slice(0, 5);
  }

  /**
   * 獲取相關主題
   */
  private getRelatedTopics(articles: KnowledgeArticle[]): string[] {
    const topics = new Set<string>();

    articles.forEach(article => {
      article.tags.forEach(tag => topics.add(tag));
    });

    return Array.from(topics).slice(0, 8);
  }

  /**
   * 獲取分類名稱
   */
  private getCategoryName(category: KnowledgeCategory): string {
    const categoryNames: Record<KnowledgeCategory, string> = {
      salary: '薪資計算',
      tax: '稅務規劃',
      investment: '投資理財',
      insurance: '保險規劃',
      mortgage: '房貸規劃',
      retirement: '退休規劃',
      budgeting: '預算管理',
      debt_management: '債務管理',
      financial_planning: '財務規劃',
      career_development: '職涯發展'
    };

    return categoryNames[category] || category;
  }
}

// 單例模式
export const knowledgeEngine = new KnowledgeBaseEngine();