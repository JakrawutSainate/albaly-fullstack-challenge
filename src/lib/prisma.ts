import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient({
        // เพิ่มการตั้งค่าเพื่อไม่ให้มันค้างตอนพยายามต่อ DB
        log: ['error'],
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

// ทริค: ถ้าเจอ Error เรื่องการต่อ DB ในช่วง Build ให้ข้ามไป
if (process.env.NEXT_PHASE === 'phase-production-build') {
    prisma.$connect = () => Promise.resolve()
}

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma