import type { PricingTier } from "@/lib/types";

export const tiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    pricePerMonth: 0,
    tagline: "Enough to leave the apartment.",
    features: [
      "Basic people tracking",
      "Add events manually",
      "3 Solo Night plans per month",
      "Basic social rep tracking",
      "One 7-day plan",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    pricePerMonth: 9,
    tagline: "Every week: 3 realistic outings, 2 follow-ups, 1 rep assignment.",
    features: [
      "Unlimited Solo Night plans",
      "Full 30-Day Social Rebuild",
      "Follow-up drafts for everyone in your orbit",
      "Weekly reviews",
      "Event scoring",
      "Calendar export",
      "Advanced people tracking",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    pricePerMonth: 19,
    tagline: "See where your social life is actually stalling.",
    features: [
      "Advanced accountability",
      "Deeper weekly review",
      "More direct avoidance mirror",
      "Persona-specific plans",
      "City packs",
      "Exportable personal social strategy",
    ],
  },
];
