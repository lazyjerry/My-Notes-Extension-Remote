# My Notes Extension

這是一個基於 Cloudflare Workers 的專案，使用 KV Namespace 提供鍵值存儲服務。本專案包含身份驗證功能，並支援多種操作，例如 `read`、`put`、`delete` 和 `list`。

---

## 目錄
- [如何呼叫服務](#如何呼叫服務)
- [本地開發](#本地開發)
- [部署](#部署)
	- [部署至新帳號](#部署至新帳號)
	- [部署至現有帳號](#部署至現有帳號)

---

## 如何呼叫服務

### 支援的操作與請求方式
此服務接受 `POST` 請求，並使用 JSON 格式的請求主體。每個請求都需要包含 `jerry-auth` 標頭以進行身份驗證。

### 操作範例
1. **讀取鍵值**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"read", "key":"exampleKey"}'
   ```

2. **新增或更新鍵值 (Put)**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"put", "key":"exampleKey", "content":"exampleValue"}'
   ```

3. **刪除鍵值**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"delete", "key":"exampleKey"}'
   ```

4. **列出鍵值**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"list", "cursor":null, "limit":100}'
   ```

---

## 本地開發

### 前置準備
1. 安裝 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)：
   ```bash
   npm install -g wrangler
   ```

2. 克隆本專案代碼：
   ```bash
   git clone https://github.com/your-repo/my-notes-extension.git
   cd my-notes-extension
   ```

3. 安裝依賴：
   ```bash
   npm install
   ```

### 開始本地開發
1. 使用 Wrangler 驗證你的 Cloudflare 帳號：
   ```bash
   npx wrangler login
   ```

2. 啟動本地開發伺服器：
   ```bash
   npx wrangler dev --env=development

   ```
   此命令將在 `http://localhost:8787` 運行本地 Worker。

3. 測試本地服務：
   ```bash
   curl -X POST "http://localhost:8787/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"read", "key":"exampleKey"}'
   ```

---

## 部署

### 部署至新帳號

1. **建立 Cloudflare 帳號**：
	- 前往 [Cloudflare 儀表板](https://dash.cloudflare.com/)註冊一個新帳號。

2. **使用 Wrangler 設定帳號**：
	- 使用以下命令登入 Cloudflare 帳號：
	  ```bash
	  npx wrangler login
	  ```

3. **設定 KV Namespace**：
	- 在 `wrangler.toml` 中更新 KV Namespace 綁定：
	  ```toml
	  [[kv_namespaces]]
	  binding = "my_notes_extension"
	  id = "your-kv-namespace-id"
	  ```

	- 如果需要創建新的 KV Namespace，執行以下命令：
	  ```bash
	  npx wrangler kv:namespace create "my_notes_extension"
	  ```

4. **部署 Worker**：
   ```bash
   npx wrangler deploy
   ```

---

### 部署至現有帳號

1. 確保你的 `wrangler.toml` 文件中包含正確的 KV Namespace ID：
   ```toml
   [[kv_namespaces]]
   binding = "my_notes_extension"
   id = "existing-kv-namespace-id"
   ```

2. 部署 Worker：
   ```bash
   npx wrangler deploy
   ```

---

### 驗證部署

部署完成後，可以測試線上 Worker URL 是否正常運作：

```bash
curl -X POST "https://your-worker-url.workers.dev/" \
-H "Content-Type: application/json" \
-H "jerry-auth: your-auth-password" \
-d '{"action":"read", "key":"exampleKey"}'
```

---

## 參考資料
- [Cloudflare Workers KV 快速開始](https://developers.cloudflare.com/kv/get-started/)
- [Wrangler 配置](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Cloudflare Workers API 文檔](https://developers.cloudflare.com/workers/runtime-apis/)
