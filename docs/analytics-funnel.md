# TaiCalc GA4 數據漏斗

## 漏斗版本

`tool_conversion_v1`

1. `search_entry`：Google、Bing、Yahoo、UTM 搜尋或廣告入口
2. `tool_view`：使用者開啟計算器
3. `calculation_start`：第一次操作輸入欄位
4. `calculation_complete`：結果在輸入後完成更新
5. `result_copy`：複製試算結果
6. `next_tool_click`：點擊工具頁的「下一步」推薦
7. `partner_click`：點擊標記過的合作連結

每個事件都會附帶：

- `funnel_name`
- `funnel_step`
- `funnel_step_name`
- `funnel_session_id`
- `page_path`
- `page_type`
- `tool_id`（工具頁）

不會傳送使用者輸入的薪資、貸款、資產或稅額。

## GA4 設定

Cloudflare Pages 建置環境需設定：

```text
PUBLIC_GA_ID=G-J6BM5DCBNN
```

若建置環境沒有設定，程式會使用專案原有的正式 Measurement ID
`G-J6BM5DCBNN`，避免部署後中斷收集。

在 GA4 的「探索 → 漏斗探索」依序加入上述七個事件。建議把
`calculation_complete`、`result_copy`、`partner_click` 標記為重要事件。

## 合作連結標記

未來合作連結加上以下屬性即可自動納入漏斗：

```html
<a
  href="https://partner.example/"
  data-partner-id="partner-name"
  data-partner-placement="result-aftercare"
  data-offer-type="mortgage"
>
  查看合作方案
</a>
```

請勿把佣金、個人財務數字或可識別身分資料放進追蹤參數。
