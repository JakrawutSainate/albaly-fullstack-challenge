# 1. ใช้ Node 20 เพื่อรองรับ Next.js 16 และ Prisma 7 
FROM node:20-alpine AS base

# --- Stage: Dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage: Builder ---
FROM base AS builder
WORKDIR /app
# คัดลอก node_modules จาก deps stage 
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 🔥 จุดสำคัญ: ต้องวาง ENV ไว้ใน stage builder เพื่อให้ npx prisma generate มองเห็น
# แก้ไขเป็นรูปแบบ key=value เพื่อลบ Warning [cite: 100]
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# สร้าง Prisma Client และ Build โปรเจกต์ 
RUN npx prisma db push
RUN npx prisma generate
RUN npm run build

# --- Stage: Runner (Final Image) ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ตั้งค่า User เพื่อความปลอดภัย (Security Best Practice) [cite: 92]
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# ตั้งค่า Permission สำหรับ Cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# คัดลอกเฉพาะไฟล์ที่จำเป็น (Standalone mode) เพื่อลดขนาด Image 
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]