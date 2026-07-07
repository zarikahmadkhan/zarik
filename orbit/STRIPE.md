# Stripe Setup

The integration is fully coded and dormant until you add keys. With no env vars set, the app behaves exactly as before (honest "Coming soon" buttons, demo mode intact).

## What's built

- `POST /api/checkout` — creates a subscription Checkout Session for `pro` or `premium`
- `POST /api/stripe-webhook` — signature-verified receiver for `checkout.session.completed` and subscription updates (logs now; writes to the user store when Supabase accounts land — the TODO marks the seam)
- `components/CheckoutButton.tsx` — live buttons on `/pricing` when enabled
- Entitlement: success redirect → `/app/settings?checkout=success&tier=...` sets `tier` in app data; all three gates (solo-plan limit, program week 2+, advanced review) honor it

## Go-live steps (~20 minutes, your side)

1. Create a Stripe account at dashboard.stripe.com (business verification is yours to complete).
2. **Products:** create "Orbit Pro" with a $9/month recurring price, and "Orbit Premium" with $19/month. Copy both price ids (`price_...`).
3. **Webhook:** add an endpoint `https://<your-domain>/api/stripe-webhook` for events `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the signing secret (`whsec_...`).
4. Set env vars on Netlify (Site settings → Environment variables):

```
STRIPE_SECRET_KEY=sk_test_...        # use test keys first
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_PREMIUM=price_...
NEXT_PUBLIC_STRIPE_ENABLED=true
NEXT_PUBLIC_SITE_URL=https://<your-domain>
```

5. Redeploy. Test with card `4242 4242 4242 4242` in test mode, then swap to live keys.

## Honest limitation (read this)

v0.1 has **no accounts** — data lives in each browser. So after a successful checkout, entitlement is set client-side from the redirect. That means:

- A technical user could set the flag without paying. Acceptable at this stage; the paying audience isn't doing that, and the free tier is generous anyway.
- Entitlement doesn't follow the user across devices.
- Cancellations don't automatically downgrade the client.

All three resolve the same way: Supabase accounts (already the planned next infrastructure step). The webhook handler is where subscription state will be persisted server-side — the code seam is marked. **Don't scale paid acquisition until accounts exist**; do use this to run the Phase-3 paid smoke test from the launch plan, which is exactly what it's for.
