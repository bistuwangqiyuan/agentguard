/**
 * @deprecated Lemon Squeezy is not the primary MoR.
 * Mainland China sellers cannot use LS bank payouts; AgentGuard uses Paddle + Payoneer.
 * Kept only so old imports fail loudly at typecheck if reintroduced.
 */
export function lemonConfigured(): boolean {
  return false;
}

export function checkoutUrl(): string | null {
  return null;
}
