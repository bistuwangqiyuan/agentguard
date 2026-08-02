export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function llmConfigured(): boolean {
  return Boolean(process.env.LLM_API_KEY && process.env.LLM_BASE_URL);
}

export async function chatJson<T>(
  messages: ChatMessage[],
  opts?: { timeoutMs?: number }
): Promise<{ ok: true; data: T } | { ok: false; error: string; retryable: boolean }> {
  if (!llmConfigured()) {
    return { ok: false, error: "LLM not configured", retryable: false };
  }
  const base = process.env.LLM_BASE_URL!.replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "deepseek-chat";
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 8000);
  try {
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: `LLM HTTP ${res.status}: ${text.slice(0, 200)}`,
        retryable: res.status >= 500 || res.status === 429,
      };
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content || "{}";
    return { ok: true, data: JSON.parse(content) as T };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg, retryable: true };
  } finally {
    clearTimeout(t);
  }
}
