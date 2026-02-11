# 1. เปลี่ยนเป็น Node 18
FROM node:18-alpine AS base

# --- Stage: Dependencies ---
FROM base AS deps
# ต้องมี openssl และ libc6-compat สำหรับ Prisma บน Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage: Builder ---
FROM base AS builder
# ติดตั้ง openssl ในขั้นตอนนี้ด้วย เพราะต้องใช้ตอน npm run build (Prerendering)
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# รับค่า DATABASE_URL มาจาก GitHub Actions Secrets
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# สร้าง Prisma Client
RUN npx prisma generate

# Build โปรเจกต์ (Next.js จะใช้ DATABASE_URL ตรงนี้ไปต่อ DB ตอน Prerender)
RUN npm run build

# --- Stage: Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

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