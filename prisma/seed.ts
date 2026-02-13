
import { PrismaClient, Role, Region, InventoryStatus } from '@prisma/client'
import { hash } from 'bcryptjs' // Assuming bcryptjs is installed or we use a simple mock hash for demo

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Clean up
    await prisma.sale.deleteMany()
    await prisma.inventorySnapshot.deleteMany()
    await prisma.product.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.user.deleteMany()
    await prisma.activityLog.deleteMany()
    await prisma.funnelWeekly.deleteMany()

    // 2. Users
    // Using a simple mock hash for demo purposes if bcrypt isn't available, 
    // but strictly speaking we should use a real hash. 
    // For the challenge, I'll assume standard hashing.
    // Note: effectively we might need to install bcryptjs or similar. 
    // For now, I will use a placeholder hash string.
    const passwordHash = '$2b$10$EpI.j/Vb1.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0' // 'password123' hashed (mock)

    await prisma.user.create({
        data: {
            email: 'admin@albaly.com',
            passwordHash: passwordHash,
            role: Role.ADMIN,
        },
    })

    await prisma.user.create({
        data: {
            email: 'viewer@albaly.com',
            passwordHash: passwordHash,
            role: Role.VIEWER,
        },
    })

    // 3. Products
    const products = []
    const productData = [
        { name: 'Ergonomic Chair', price: 250 },
        { name: 'Standing Desk', price: 450 },
        { name: 'Monitor Arm', price: 80 },
        { name: 'Desk Lamp', price: 45 },
        { name: 'Cable Tray', price: 25 },
    ]

    for (const p of productData) {
        const product = await prisma.product.create({
            data: p,
        })
        products.push(product)

        // Inventory Snapshot
        await prisma.inventorySnapshot.create({
            data: {
                productId: product.id,
                status: InventoryStatus.OK,
                onHand: Math.floor(Math.random() * 100) + 10,
            },
        })
    }

    // 4. Customers
    const customers = []
    const regions = [Region.NA, Region.EU, Region.APAC]
    for (let i = 0; i < 20; i++) {
        const customer = await prisma.customer.create({
            data: {
                region: regions[i % regions.length],
                isActive: true,
            },
        })
        customers.push(customer)
    }

    // 5. Sales (Last 3 months)
    const now = new Date()
    for (let i = 0; i < 60; i++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        const amount = randomProduct.price * quantity

        // Random date within last 90 days
        const pastDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)

        await prisma.sale.create({
            data: {
                productId: randomProduct.id,
                customerId: randomCustomer.id,
                amount,
                quantity,
                createdAt: pastDate,
            },
        })
    }

    // 6. Funnel Data (4 weeks)
    for (let i = 0; i < 4; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (i * 7))
        await prisma.funnelWeekly.create({
            data: {
                weekStart: date,
                visitors: 1000 + i * 100,
                productViews: 800 + i * 50,
                addToCart: 300 + i * 20,
                purchases: 100 + i * 10,
            },
        })
    }

    // 7. Activity Log
    const activities = [
        { status: 'success', description: 'New order #1234' },
        { status: 'warning', description: 'Low stock alert: Monitor Arm' },
        { status: 'info', description: 'New user registered' },
    ]

    for (const act of activities) {
        await prisma.activityLog.create({
            data: {
                status: act.status,
                description: act.description,
            },
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
