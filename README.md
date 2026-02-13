# tracefinity.net

SaaS frontend and marketing site for [Tracefinity](https://tracefinity.net). Auth, billing, dashboard, and legal pages.

## Local dev

```bash
npm install
npx prisma generate
npm run dev
```

Runs on http://localhost:3000. Needs a `.env.local` with:

```
AUTH_SECRET=<random string>
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STANDARD_MONTHLY=price_...
STRIPE_PRICE_STANDARD_YEARLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...

APP_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

SQLite database is created automatically at `data/tracefinity.db`. Override with `DATABASE_PATH`.

## Deploy

From the [tracefinity-infra](https://github.com/tracefinity/tracefinity-infra) repo:

```bash
./scripts/deploy.sh 164.92.151.61
```

Pulls all three repos on the droplet, rebuilds Docker images, restarts services.

## Tech

Next.js, Auth.js (credentials), Stripe subscriptions, SQLite/Prisma, Tailwind CSS.
