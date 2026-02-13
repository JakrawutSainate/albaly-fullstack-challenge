
import { PrismaClient, Role, Region, InventoryStatus } from '@prisma/client'
import { hashSync } from 'bcryptjs'

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
    const passwordHash = hashSync('password123', 10)

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
    const products = [
        { name: 'Ergonomic Chair', price: 250, category: 'Furniture', imageUrl: 'https://picsum.photos/seed/chair/400/300' },
        { name: 'Standing Desk', price: 450, category: 'Furniture', imageUrl: 'https://picsum.photos/seed/desk/400/300' },
        { name: 'Monitor Arm', price: 80, category: 'Accessories', imageUrl: 'https://picsum.photos/seed/monitor/400/300' },
        { name: 'Desk Lamp', price: 45, category: 'Lighting', imageUrl: 'https://picsum.photos/seed/lamp/400/300' },
        { name: 'Cable Tray', price: 25, category: 'Accessories', imageUrl: 'https://picsum.photos/seed/cable/400/300' },
        { name: 'Mechanical Keyboard', price: 120, category: 'Electronics', imageUrl: 'https://picsum.photos/seed/keyboard/400/300' },
    ]

    const createdProducts = []
    for (const p of products) {
        const product = await prisma.product.create({ data: p })
        createdProducts.push(product)

        // Inventory Snapshot
        await prisma.inventorySnapshot.create({
            data: {
                productId: product.id,
                status: Math.random() > 0.8 ? InventoryStatus.LOW : InventoryStatus.OK,
                onHand: Math.floor(Math.random() * 50) + 5,
            },
        })
    }

    // 4. Customers
    const customers = []
    const regions = [Region.NA, Region.EU, Region.APAC]
    for (let i = 0; i < 30; i++) {
        const customer = await prisma.customer.create({
            data: {
                region: regions[Math.floor(Math.random() * regions.length)],
                isActive: Math.random() > 0.1, // 90% active
            },
        })
        customers.push(customer)
    }

    // 5. Sales (50+ records over 3 months)
    const now = new Date()
    for (let i = 0; i < 80; i++) {
        const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)]
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
        // Ensure strictly weekly dates
        date.setHours(0, 0, 0, 0)

        await prisma.funnelWeekly.create({
            data: {
                weekStart: date,
                visitors: 1200 + Math.floor(Math.random() * 300),
                productViews: 800 + Math.floor(Math.random() * 200),
                addToCart: 350 + Math.floor(Math.random() * 100),
                purchases: 120 + Math.floor(Math.random() * 50),
            },
        })
    }

    // 7. Activity Log
    const logDescriptions = [
        'New order received',
        'Product updated',
        'New user registered',
        'Inventory check completed',
        'System backup successful'
    ]
    const statuses = ['success', 'success', 'info', 'warning', 'error']

    for (let i = 0; i < 15; i++) {
        await prisma.activityLog.create({
            data: {
                status: statuses[Math.floor(Math.random() * statuses.length)],
                description: logDescriptions[Math.floor(Math.random() * logDescriptions.length)] + ` #${i + 100}`,
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
