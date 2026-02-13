FROM node:20-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG STRIPE_SECRET_KEY
ARG STRIPE_PRICE_STANDARD_MONTHLY
ARG STRIPE_PRICE_STANDARD_YEARLY
ARG STRIPE_PRICE_PRO_MONTHLY
ARG STRIPE_PRICE_PRO_YEARLY
RUN npx prisma generate
RUN npm run build

FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=build /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=build /app/package.json ./

RUN mkdir -p /app/data

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD npx prisma migrate deploy && node server.js
