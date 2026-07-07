import { NextResponse } from "next/server";
import { getStripe, priceIdFor, stripeEnabled } from "@/lib/billing";

export async function POST(req: Request) {
  if (!stripeEnabled()) {
    return NextResponse.json(
      { error: "Payments are not configured on this deployment." },
      { status: 501 }
    );
  }
  let tier: "pro" | "premium";
  try {
    const body = await req.json();
    if (body.tier !== "pro" && body.tier !== "premium") {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }
    tier = body.tier;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceIdFor(tier), quantity: 1 }],
      success_url: `${origin}/app/settings?checkout=success&tier=${tier}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout session failed", e);
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }
}
