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

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./

RUN npm install prisma @prisma/adapter-better-sqlite3 better-sqlite3 dotenv

RUN mkdir -p /app/data

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD npx prisma migrate deploy && node server.js
