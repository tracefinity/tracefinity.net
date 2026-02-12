import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// stripe price IDs - set these in .env.local after creating products in the stripe dashboard
export const PRICE_IDS = {
  STANDARD_MONTHLY: process.env.STRIPE_PRICE_STANDARD_MONTHLY!,
  STANDARD_YEARLY: process.env.STRIPE_PRICE_STANDARD_YEARLY!,
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY!,
} as const;

export type PriceKey = keyof typeof PRICE_IDS;
