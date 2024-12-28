export interface Env {
	my_notes_extension: KVNamespace;
	AUTH_PASSWORD: string; // 環境變數中的密碼
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// 處理 OPTIONS 請求以支持 CORS 預檢
		if (request.method === "OPTIONS") {
			return handleOptionsRequest();
		}

		// 使用環境變數中的 AUTH_PASSWORD
		const AUTH_PASSWORD = env.AUTH_PASSWORD;

		// 檢查 Header 中的 jerry-auth
		const authHeader = request.headers.get("jerry-auth");
		if (!authHeader || authHeader !== AUTH_PASSWORD) {
			return jsonResponse(403, false, "Forbidden: Invalid or missing jerry-auth header");
		}

		// 解析 JSON body
		let body: any;
		try {
			body = await request.json();
		} catch (err) {
			return jsonResponse(400, false, "Invalid JSON body");
		}

		const { action, key, content, cursor, limit } = body;

		// 驗證 action 是否存在於允許名單
		const allowedActions = ["read", "put", "delete", "list"];
		if (!allowedActions.includes(action)) {
			return jsonResponse(404, false, "Action not found");
		}

		try {
			let response: Response;
			switch (action) {
				case "read": {
					// Read 操作
					if (!key) {
						return jsonResponse(400, false, "Key is required for read action");
					}
					const value = await env.my_notes_extension.get(key);
					if (value === null) {
						return jsonResponse(404, false, "Value not found");
					}
					response = jsonResponse(200, true, value);
					break;
				}
				case "put": {
					// Put 操作
					if (!key || !content) {
						return jsonResponse(400, false, "Key and content are required for put action");
					}

					const existingValue = await env.my_notes_extension.get(key);
					if (existingValue === content) {
						return jsonResponse(200, false, "Content is identical to the existing value, no update performed");
					}

					await env.my_notes_extension.put(key, content);
					const resultMessage = existingValue === null ? "create action completed" : "update action completed";
					response = jsonResponse(200, true, resultMessage);
					break;
				}
				case "delete": {
					// Delete 操作
					if (!key) {
						return jsonResponse(400, false, "Key is required for delete action");
					}
					await env.my_notes_extension.delete(key);
					response = jsonResponse(200, true, "Value deleted");
					break;
				}
				case "list": {
					// List 操作
					const options: KVNamespaceListOptions = {};
					if (cursor) {
						options.cursor = cursor;
					}
					if (limit) {
						options.limit = limit;
					}

					const listResult = await env.my_notes_extension.list(options);

					// 過濾鍵名（根據 content 搜尋）
					const filteredKeys = content
						? listResult.keys.filter(async (keyObj) => {
							const value = await env.my_notes_extension.get(keyObj.name);
							return value && value.includes(content);
						})
						: listResult.keys;

					response = jsonResponse(200, true, {
						keys: filteredKeys.map((keyObj) => keyObj.name),
						cursor: listResult.list_complete ? null : listResult.cursor,
					});
					break;
				}
				default: {
					response = jsonResponse(500, false, "Unhandled action");
					break;
				}
			}

			// 附加 CORS 標頭到回應
			return appendCorsHeaders(response);
		} catch (err) {
			console.error(`KV operation error: ${err}`);
			return appendCorsHeaders(jsonResponse(500, false, "Internal Server Error"));
		}
	},
} satisfies ExportedHandler<Env>;

// 處理 OPTIONS 請求的函式
function handleOptionsRequest(): Response {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, jerry-auth",
		},
	});
}

// 附加 CORS 標頭到回應的函式
function appendCorsHeaders(response: Response): Response {
	const newHeaders = new Headers(response.headers);
	newHeaders.set("Access-Control-Allow-Origin", "*");
	newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	newHeaders.set("Access-Control-Allow-Headers", "Content-Type, jerry-auth");
	return new Response(response.body, { ...response, headers: newHeaders });
}

// 通用的 JSON 回應生成函式
function jsonResponse(status: number, isSuccess: boolean, result: any): Response {
	return new Response(
		JSON.stringify({
			status,
			isSuccess,
			result,
		}),
		{
			status,
			headers: { "Content-Type": "application/json" },
		}
	);
}
