import { checkSchema, type SchemaCheckResult } from "./schema";
import { checkPii, type PiiCheckResult } from "./pii";
import { checkInjection, type InjectionCheckResult } from "./injection";

export type GuardRequest = {
  text: string;
  schema?: object;
  mode?: "report" | "redact";
  checks?: Array<"schema" | "pii" | "injection">;
};

export type GuardResponse = {
  ok: boolean;
  mode: "report" | "redact";
  checks: {
    schema?: SchemaCheckResult;
    pii?: PiiCheckResult;
    injection?: InjectionCheckResult;
  };
  text_out?: string;
  disclaimer: string;
};

const MAX_TEXT = 100_000;

export async function runGuard(req: GuardRequest): Promise<GuardResponse> {
  if (typeof req.text !== "string") {
    throw Object.assign(new Error("text must be a string"), { status: 400, code: "invalid_request" });
  }
  if (req.text.length === 0) {
    throw Object.assign(new Error("text must not be empty"), { status: 400, code: "invalid_request" });
  }
  if (req.text.length > MAX_TEXT) {
    throw Object.assign(new Error(`text exceeds ${MAX_TEXT} characters`), {
      status: 413,
      code: "payload_too_large",
    });
  }

  const mode = req.mode === "redact" ? "redact" : "report";
  const wanted = new Set(
    req.checks?.length ? req.checks : (["schema", "pii", "injection"] as const)
  );

  const checks: GuardResponse["checks"] = {};

  if (wanted.has("schema")) {
    checks.schema = checkSchema(req.text, req.schema);
  }
  if (wanted.has("pii")) {
    checks.pii = checkPii(req.text);
  }
  if (wanted.has("injection")) {
    checks.injection = await checkInjection(req.text);
  }

  const ok = Object.values(checks).every((c) => c && c.pass);

  let text_out: string | undefined;
  if (mode === "redact") {
    text_out = checks.pii?.redacted_text ?? req.text;
  }

  return {
    ok,
    mode,
    checks,
    text_out,
    disclaimer:
      "AgentGuard assists automated checks; it does not provide legal, medical, or financial advice. " +
      "Injection and semantic PII detection are probabilistic — verify critical decisions with a qualified human.",
  };
}
