import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { verifyPaddleSignature } from "../lib/paddle";

describe("paddle signature", () => {
  it("accepts valid ts:body HMAC", () => {
    const secret = "test_webhook_secret";
    process.env.PADDLE_WEBHOOK_SECRET = secret;
    const rawBody = JSON.stringify({ event_type: "subscription.created", event_id: "evt_1" });
    const ts = String(Math.floor(Date.now() / 1000));
    const h1 = createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");
    assert.equal(verifyPaddleSignature(rawBody, `ts=${ts};h1=${h1}`), true);
  });

  it("rejects bad signature", () => {
    process.env.PADDLE_WEBHOOK_SECRET = "test_webhook_secret";
    assert.equal(verifyPaddleSignature("{}", "ts=1;h1=deadbeef"), false);
  });
});
