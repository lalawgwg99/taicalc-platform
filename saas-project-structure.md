# SaaS 專案結構範例

## 建議的目錄結構

```
your-saas-app/
├── frontend/                    # React + TypeScript 前端
│   ├── src/
│   │   ├── features/           # 功能導向結構
│   │   │   ├── auth/          # 身份驗證
│   │   │   ├── billing/       # 計費管理
│   │   │   └── tenants/       # 租戶管理
│   │   ├── components/        # 共用 UI 元件
│   │   ├── hooks/             # 自定義 React hooks
│   │   └── utils/             # 工具函數
│   ├── package.json
│   └── tailwind.config.js
├── backend/                     # 無伺服器後端
│   ├── functions/              # Lambda 函數
│   │   ├── authorizer/        # JWT 驗證器
│   │   ├── api/               # API 端點
│   │   └── billing/           # 計費相關
│   ├── lib/                   # 業務邏輯
│   │   ├── auth/              # RBAC 權限檢查
│   │   ├── tenants/           # 租戶隔離邏輯
│   │   └── usage/             # 使用量計量
│   └── infrastructure/        # 基礎設施即代碼
├── schema/                     # 共用 API 合約
│   ├── openapi.yaml           # API 規格（主要來源）
│   └── types/                 # 生成的類型定義
└── .kiro/                     # Kiro 配置
    └── settings/
        └── mcp.json           # MCP 伺服器配置
```

## 核心實作模式

### 1. 多租戶資料隔離
```typescript
// DynamoDB 鍵值模式
const userKey = `${tenantId}#User#${userId}`;
const orderKey = `${tenantId}#Order#${orderId}`;
```

### 2. Lambda 函數模式
```typescript
export const handler = async (event: APIGatewayEvent) => {
  // 1. 從授權器提取租戶上下文
  const tenantId = event.requestContext.authorizer.tenantId;
  const userRoles = event.requestContext.authorizer.roles;
  
  // 2. 驗證用戶角色
  if (!hasRequiredRole(userRoles, 'admin')) {
    return { statusCode: 403, body: 'Forbidden' };
  }
  
  // 3. 所有資料庫操作都使用租戶 ID 前綴
  const result = await dynamodb.get({
    Key: { pk: `${tenantId}#User#${userId}` }
  });
  
  return { statusCode: 200, body: JSON.stringify(result) };
};
```

### 3. 金錢處理
```typescript
// ✅ 正確：使用整數分
interface Price {
  amount_cents: number;  // 1999 = $19.99
  currency: string;      // "USD"
}

// ❌ 錯誤：使用浮點數
interface BadPrice {
  amount: number;  // 19.99 (浮點數精度問題)
}
```

### 4. React 租戶上下文
```typescript
// 租戶上下文提供者
const TenantContext = createContext<{
  tenantId: string;
  features: string[];
}>({
  tenantId: '',
  features: []
});

// 在元件中使用
const { tenantId, features } = useContext(TenantContext);
```