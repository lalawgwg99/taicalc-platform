---
name: "git-best-practices"
displayName: "Git 最佳實踐指南"
description: "Git 版本控制的最佳實踐，包含提交規範、分支策略和協作流程"
keywords: ["git", "版本控制", "最佳實踐", "提交", "分支"]
author: "Kiro 示範"
---

# Git 最佳實踐指南

## 概覽

這個指南提供 Git 版本控制的最佳實踐，幫助開發團隊建立一致的工作流程。包含提交訊息規範、分支管理策略，以及有效的協作模式。

無論您是 Git 新手還是經驗豐富的開發者，這些實踐都能幫助您和團隊更有效地管理程式碼版本。

## 核心原則

### 1. 清晰的提交訊息
- 使用描述性的提交訊息
- 遵循一致的格式
- 說明「為什麼」而不只是「什麼」

### 2. 邏輯性的提交
- 每個提交應該是一個邏輯單元
- 避免混合不相關的變更
- 保持提交的原子性

### 3. 有效的分支策略
- 使用清楚的分支命名
- 保持主分支的穩定性
- 定期清理過期分支

## 提交訊息規範

### 格式
```
<類型>(<範圍>): <簡短描述>

<詳細描述>

<頁腳>
```

### 類型
- `feat`: 新功能
- `fix`: 錯誤修復
- `docs`: 文檔更新
- `style`: 程式碼格式調整
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 建置或輔助工具變更

### 範例
```bash
feat(auth): 新增使用者登入功能

實作 JWT 基礎的身份驗證系統，包含：
- 登入端點
- 密碼雜湊
- Token 驗證中介軟體

Closes #123
```

## 分支策略

### Git Flow 模式
```bash
# 主要分支
main        # 生產環境程式碼
develop     # 開發整合分支

# 支援分支
feature/*   # 功能開發
release/*   # 發布準備
hotfix/*    # 緊急修復
```

### 分支命名規範
```bash
# 功能分支
feature/user-authentication
feature/payment-integration

# 修復分支
fix/login-error
hotfix/security-patch

# 發布分支
release/v1.2.0
```

## 常見工作流程

### 功能開發流程
```bash
# 1. 從 develop 建立功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 開發並提交
git add .
git commit -m "feat: 實作新功能"

# 3. 推送並建立 Pull Request
git push origin feature/new-feature
```

### 程式碼審查流程
```bash
# 1. 更新本地分支
git checkout feature/new-feature
git rebase develop

# 2. 解決衝突（如有）
git add .
git rebase --continue

# 3. 強制推送更新
git push --force-with-lease origin feature/new-feature
```

## 最佳實踐

### 提交頻率
- 經常提交小的變更
- 每個功能完成時提交
- 在切換任務前提交

### 分支管理
- 保持分支的短生命週期
- 定期與主分支同步
- 完成後立即刪除功能分支

### 協作規範
- 使用 Pull Request 進行程式碼審查
- 不直接推送到主分支
- 保持提交歷史的清潔

## 常見問題解決

### 錯誤的提交訊息
```bash
# 修改最後一次提交訊息
git commit --amend -m "正確的提交訊息"
```

### 撤銷變更
```bash
# 撤銷工作目錄的變更
git checkout -- <檔案名>

# 撤銷暫存區的變更
git reset HEAD <檔案名>

# 撤銷最後一次提交
git reset --soft HEAD~1
```

### 解決合併衝突
```bash
# 1. 檢視衝突檔案
git status

# 2. 手動解決衝突
# 編輯衝突檔案，移除衝突標記

# 3. 標記為已解決
git add <解決的檔案>

# 4. 完成合併
git commit
```

## 工具推薦

### Git 別名設定
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

### 有用的 Git 指令
```bash
# 檢視提交歷史圖形化
git log --oneline --graph --all

# 檢視檔案變更統計
git diff --stat

# 檢視分支關係
git show-branch --all
```

## 參考資源

- [Git 官方文檔](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow 工作流程](https://nvie.com/posts/a-successful-git-branching-model/)

---

**工具**: Git
**類型**: 版本控制最佳實踐