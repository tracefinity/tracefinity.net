import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function main() {
  // standard plan
  const standard = await stripe.products.create({
    name: "Tracefinity Standard",
    description: "50 tools, unlimited bins",
  });

  const standardMonthly = await stripe.prices.create({
    product: standard.id,
    unit_amount: 700,
    currency: "eur",
    recurring: { interval: "month" },
  });

  const standardYearly = await stripe.prices.create({
    product: standard.id,
    unit_amount: 6000,
    currency: "eur",
    recurring: { interval: "year" },
  });

  // pro plan
  const pro = await stripe.products.create({
    name: "Tracefinity Pro",
    description: "200 tools, unlimited bins",
  });

  const proMonthly = await stripe.prices.create({
    product: pro.id,
    unit_amount: 1200,
    currency: "eur",
    recurring: { interval: "month" },
  });

  const proYearly = await stripe.prices.create({
    product: pro.id,
    unit_amount: 10000,
    currency: "eur",
    recurring: { interval: "year" },
  });

  console.log("Products created. Add these to .env.local:\n");
  console.log(`STRIPE_PRICE_STANDARD_MONTHLY=${standardMonthly.id}`);
  console.log(`STRIPE_PRICE_STANDARD_YEARLY=${standardYearly.id}`);
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${proMonthly.id}`);
  console.log(`STRIPE_PRICE_PRO_YEARLY=${proYearly.id}`);
}

main().catch(console.error);
