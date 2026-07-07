import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeEnabled } from "@/lib/billing";

// Stripe webhook receiver. Verifies signatures and logs the events that
// matter. NOTE: v0.1 has no server-side user store (data is client-local),
// so entitlement is applied client-side on the success redirect. When
// Supabase accounts land, this handler is where subscription state gets
// written to the user's row — the TODO below is the seam.

export async function POST(req: Request) {
  if (!stripeEnabled()) {
    return NextResponse.json({ error: "Not configured." }, { status: 501 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not set." },
      { status: 501 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO(supabase): look up/create the user from
      // event.data.object.customer_details.email and persist tier.
      console.log("checkout completed", event.data.object.id);
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // TODO(supabase): sync subscription status to the user's row.
      console.log(event.type, event.data.object.id);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
