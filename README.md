# My Notes Extension

This is a Cloudflare Workers project that integrates KV Namespace to provide a key-value storage service. This project includes authentication and supports various actions such as `read`, `put`, `delete`, and `list`.

---

## Table of Contents
- [How to Call the Service](#how-to-call-the-service)
- [Local Development](#local-development)
- [Deploying](#deploying)
	- [Deploy to a New Account](#deploy-to-a-new-account)
	- [Deploy to an Existing Account](#deploy-to-an-existing-account)

---

## How to Call the Service

### Endpoints and Supported Actions
The service accepts `POST` requests with a JSON body. Each request requires the `jerry-auth` header for authentication.

### Example Actions
1. **Read a Key**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"read", "key":"exampleKey"}'
   ```

2. **Put a Key (Create/Update)**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"put", "key":"exampleKey", "content":"exampleValue"}'
   ```

3. **Delete a Key**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"delete", "key":"exampleKey"}'
   ```

4. **List Keys**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"list", "cursor":null, "limit":100}'
   ```

---

## Local Development

### Prerequisites
1. Install [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/):
   ```bash
   npm install -g wrangler
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/my-notes-extension.git
   cd my-notes-extension
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Start Local Development
1. Authenticate Wrangler with Cloudflare:
   ```bash
   wrangler login
   ```

2. Start the development server:
   ```bash
   wrangler dev
   ```
   This will run the Worker locally at `http://localhost:8787`.

3. Test the service locally:
   ```bash
   curl -X POST "http://localhost:8787/" \
   -H "Content-Type: application/json" \
   -H "jerry-auth: your-auth-password" \
   -d '{"action":"read", "key":"exampleKey"}'
   ```

---

## Deploying

### Deploy to a New Account

1. **Create a Cloudflare Account**:
	- Sign up for a Cloudflare account at [Cloudflare Dashboard](https://dash.cloudflare.com/).

2. **Set Up Wrangler with Your Account**:
	- Authenticate Wrangler with your new Cloudflare account:
	  ```bash
	  wrangler login
	  ```

3. **Configure KV Namespace**:
	- Update `wrangler.toml` with your KV Namespace binding:
	  ```toml
	  [[kv_namespaces]]
	  binding = "my_notes_extension"
	  id = "your-kv-namespace-id"
	  ```

	- To create a new KV Namespace, use:
	  ```bash
	  wrangler kv:namespace create "my_notes_extension"
	  ```

4. **Deploy the Worker**:
   ```bash
   wrangler deploy
   ```

---

### Deploy to an Existing Account

1. Ensure you have the correct KV Namespace ID in `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "my_notes_extension"
   id = "existing-kv-namespace-id"
   ```

2. Deploy the Worker:
   ```bash
   wrangler deploy
   ```

---

### Verify Deployment

After deploying, test the live Worker URL:

```bash
curl -X POST "https://your-worker-url.workers.dev/" \
-H "Content-Type: application/json" \
-H "jerry-auth: your-auth-password" \
-d '{"action":"read", "key":"exampleKey"}'
```

---

## References
- [Cloudflare Workers KV Get Started](https://developers.cloudflare.com/kv/get-started/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Cloudflare Workers API Documentation](https://developers.cloudflare.com/workers/runtime-apis/)
