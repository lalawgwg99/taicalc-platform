# 簡單服務 CDK 範例

這是一個使用 AWS CDK Python 建構的簡單服務範例，展示了 cloud-architect power 的最佳實踐。

## 專案結構

```
cdk-example/
├── app.py                    # CDK 應用程式入口點
├── stack.py                  # 主要堆疊定義
├── requirements.txt          # Python 依賴套件
├── cdk.json                 # CDK 配置檔案
├── tests/                   # 測試檔案
│   └── unit/
│       └── test_stack.py    # 單元測試
└── README.md               # 專案說明文件
```

## 功能特色

### 基礎設施元件

- **S3 儲存桶**: 具備版本控制、加密和安全設定
- **Lambda 函數**: Python 3.11 執行環境，具備適當的 IAM 權限
- **IAM 角色**: 遵循最小權限原則的安全設定

### 最佳實踐

- 使用 dataclass 定義堆疊屬性
- 單一堆疊設計保持部署原子性
- 環境特定配置透過堆疊屬性傳遞
- 完整的單元測試覆蓋
- 遵循 Python 命名慣例和程式碼風格

## 安裝需求

1. **Python 3.11+**
2. **AWS CDK CLI**: `npm install -g aws-cdk`
3. **uv/uvx**: Python 套件管理器 (用於 MCP 伺服器)
4. **AWS 認證**: 配置 AWS 憑證

## 快速開始

### 1. 安裝依賴套件

```bash
pip install -r requirements.txt
```

### 2. 配置 AWS 認證

```bash
aws configure
```

### 3. 初始化 CDK (首次使用)

```bash
cdk bootstrap
```

### 4. 合成 CloudFormation 模板

```bash
cdk synth
```

### 5. 部署到 AWS

```bash
# 部署開發環境
cdk deploy simple-service-dev

# 部署生產環境  
cdk deploy simple-service-prod
```

### 6. 執行測試

```bash
# 執行單元測試
pytest tests/unit/ -v

# 執行測試並產生覆蓋率報告
pytest tests/unit/ --cov=. --cov-report=html
```

## 環境配置

專案支援多環境部署，每個環境都有獨立的配置：

- **開發環境** (`simple-service-dev`): 較小的資源配置，適合開發和測試
- **生產環境** (`simple-service-prod`): 較大的資源配置，適合生產工作負載

## 安全特性

- S3 儲存桶完全阻止公開存取
- 啟用 S3 伺服器端加密
- Lambda 函數使用最小權限 IAM 角色
- 所有資源遵循 AWS Well-Architected 安全支柱

## 成本最佳化

- 使用適當的 Lambda 記憶體大小配置
- S3 儲存桶啟用生命週期管理 (可選)
- 開發環境資源可自動刪除

## 監控和日誌

- Lambda 函數整合 CloudWatch 日誌
- 可配置的日誌等級
- 結構化錯誤處理和回應

## 清理資源

```bash
# 刪除開發環境
cdk destroy simple-service-dev

# 刪除生產環境
cdk destroy simple-service-prod
```

## 進階使用

### 使用 cloud-architect Power

這個範例專案可以與 cloud-architect power 一起使用來：

1. **獲取 AWS 定價資訊**: 分析不同配置的成本
2. **查詢 AWS 最佳實踐**: 獲取服務配置建議
3. **存取文檔**: 查找 CDK 和 boto3 的使用範例
4. **執行 AWS CLI**: 驗證部署的資源

### 擴展專案

- 新增更多 AWS 服務 (DynamoDB, API Gateway, etc.)
- 實作 CI/CD 管道
- 新增整合測試
- 實作監控和警報

## 疑難排解

### 常見問題

1. **部署失敗**: 檢查 AWS 認證和權限
2. **測試失敗**: 確保所有依賴套件已安裝
3. **合成錯誤**: 檢查 CDK 版本相容性

### 取得協助

- 查看 AWS CDK 官方文檔
- 使用 cloud-architect power 的 context7 工具查詢範例
- 檢查 AWS CloudFormation 事件了解部署問題