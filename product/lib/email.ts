/** Optional Resend outbound. Without RESEND_API_KEY, logs to console (ops still has DB rows). */
export async function sendOpsEmail(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OPS_EMAIL || process.env.CONTACT_TO;
  if (!key || !to) {
    console.info("[ops-email]", subject, text.slice(0, 200));
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "AgentGuard <onboarding@resend.dev>",
        to: [to],
        subject: `[AgentGuard] ${subject}`,
        text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
