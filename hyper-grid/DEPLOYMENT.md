# HyperGrid 部署指南

## 🚀 快速部署到 Cloudflare Pages

### 前置準備

1. GitHub 帳號
2. Cloudflare 帳號（免費）
3. Gemini API Key

### 步驟一：準備專案

```bash
# 確保專案已建置成功
npm run build

# 初始化 Git（如果還沒）
git init
git add .
git commit -m "feat: 初始化 HyperGrid 專案"
```

### 步驟二：推送到 GitHub

```bash
# 建立 GitHub Repository
# 然後執行：
git remote add origin https://github.com/你的帳號/hyper-grid.git
git branch -M main
git push -u origin main
```

### 步驟三：連接 Cloudflare Pages

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 選擇 **Workers & Pages** → **Create Application** → **Pages**
3. 選擇 **Connect to Git**
4. 授權 GitHub 並選擇 `hyper-grid` Repository

### 步驟四：設定建置配置

```yaml
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
```

### 步驟五：設定環境變數

在 Cloudflare Pages 設定頁面，加入環境變數：

| 變數名稱 | 值 |
| --- | --- |
| `GEMINI_API_KEY` | 你的 Gemini API Key |

### 步驟六：部署

點擊 **Save and Deploy**，等待約 1-2 分鐘即可完成部署。

---

## 🌐 部署到其他平台

### Vercel

```bash
npm i -g vercel
vercel
```

按照提示設定環境變數 `GEMINI_API_KEY`。

### Netlify

1. 安裝 Netlify CLI

   ```bash
   npm i -g netlify-cli
   ```

2. 部署

   ```bash
   netlify deploy --prod
   ```

3. 在 Netlify Dashboard 設定環境變數

---

## 🔧 本地開發

```bash
# 1. 複製環境變數範例
cp .env.local.example .env.local

# 2. 編輯 .env.local 並加入你的 API Key
# GEMINI_API_KEY=your_api_key_here

# 3. 啟動開發伺服器
npm run dev
```

開啟 <http://localhost:3000>

---

## 📝 注意事項

1. **無 API Key 時**：系統會自動使用示範模式，返回預設範例資料
2. **API 用量**：建議在 Cloudflare 設定環境變數時啟用 Gemini API 配額監控
3. **自訂 Domain**：在 Cloudflare Pages → Custom domains 設定

---

## 🐛 常見問題

### Q: Build 失敗怎麼辦？

**A**: 確認 Node.js 版本 >= 18，並執行：

```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Q: API 沒有回應？

**A**: 檢查環境變數是否正確設定，Browser Console 是否有錯誤訊息。

### Q: 如何更換成 OpenAI？

**A**: 修改 `app/api/generate/route.ts`：

```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// 替換 Gemini 呼叫邏輯
```

---

## 🎯 生產環境優化建議

1. **啟用 Cloudflare Cache**：加速靜態資源載入
2. **設定 Rate Limiting**：防止 API 濫用
3. **加入 Analytics**：追蹤使用率（Cloudflare Web Analytics）
4. **備份機制**：使用 LocalStorage 儲存歷史生成記錄
