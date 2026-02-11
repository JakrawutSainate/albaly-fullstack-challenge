# 1. ใช้ Node 20-slim (เสถียรกว่า Alpine สำหรับ Prisma)
FROM node:20-slim AS base

# --- Stage: Dependencies ---
FROM base AS deps
# ติดตั้ง openssl สำหรับ Prisma
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage: Builder ---
FROM base AS builder
# ติดตั้ง openssl ใน stage builder ด้วย
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# รับค่า DATABASE_URL สำหรับ Prerendering
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# สร้าง Prisma Client
RUN npx prisma generate

# Build โปรเจกต์ (Next.js 20+ จะยอมให้รันแล้ว)
RUN npm run build

# --- Stage: Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ตั้งค่า User (Debian ใช้คำสั่งต่างจาก Alpine เล็กน้อย)
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]