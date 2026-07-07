import Stripe from "stripe";

// Server-side Stripe helper. Everything is driven by env vars so the app
// builds and runs with zero Stripe configuration (v0.1 demo mode intact).
// Drop in real keys and the checkout goes live — no code changes.
//
// Required env vars (see STRIPE.md):
//   STRIPE_SECRET_KEY            sk_test_... / sk_live_...
//   STRIPE_WEBHOOK_SECRET        whsec_...
//   STRIPE_PRICE_PRO             price id for Pro $9/mo
//   STRIPE_PRICE_PREMIUM         price id for Premium $19/mo
//   NEXT_PUBLIC_STRIPE_ENABLED   "true" to show live checkout buttons

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export function priceIdFor(tier: "pro" | "premium"): string {
  const id =
    tier === "pro"
      ? process.env.STRIPE_PRICE_PRO
      : process.env.STRIPE_PRICE_PREMIUM;
  if (!id) throw new Error(`Missing price id env var for tier: ${tier}`);
  return id;
}
