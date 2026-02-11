# ใช้ Bullseye-slim เพราะมี Library ครบกว่าสำหรับ Prisma
FROM node:20-bullseye-slim AS base

# --- Stage: Dependencies ---
FROM base AS deps
# ติดตั้ง openssl 1.1 ที่ Prisma 5 ต้องการ
RUN apt-get update && apt-get install -y openssl libssl1.1 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage: Builder ---
FROM base AS builder
# ติดตั้ง openssl ในขั้นตอนนี้ด้วย
RUN apt-get update && apt-get install -y openssl libssl1.1 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ใช้ค่า Dummy สำหรับ Build
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/db"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# --- Stage: Runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]