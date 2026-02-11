import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@albaly.com' },
        update: {},
        create: {
            email: 'admin@albaly.com',
            name: 'Admin User',
            password: hashedPassword, // Note: Schema might need password field if we use real auth, but user request didn't strictly ask for it in schema, but implied in seed. Adding it now would require schema change. I will assume simpler auth for now or just mock it. Wait, the user asked for hashed passwords in seed, so I should probably add password field to schema or just use a placeholder if schema is fixed. 
            // ACTUALLY: The user's schema didn't have password. I will add it to the schema in a separate step or just assume for now we seed it but maybe it's not in the model I defined earlier. 
            // LET'S CHECK: I defined User with id, email, name, role. NO PASSWORD. 
            // I will add password to the schema in the next step to be safe, but for now let's write the seed as if it exists or use a field I can map to? 
            // Re-reading: "2 Users (Admin & Viewer) with hashed passwords". 
            // I MUST UPDATE THE SCHEMA. I will write this seed assuming 'password' field exists.
            role: Role.ADMIN,
        },
    })

    const viewer = await prisma.user.upsert({
        where: { email: 'viewer@albaly.com' },
        update: {},
        create: {
            email: 'viewer@albaly.com',
            name: 'Viewer User',
            password: hashedPassword,
            role: Role.VIEWER,
        },
    })

    // 2. Products
    const products = await Promise.all([
        prisma.product.create({ data: { name: 'Premium Analytics Plan', price: 99.00, category: 'Subscription' } }),
        prisma.product.create({ data: { name: 'Basic Analytics Plan', price: 29.00, category: 'Subscription' } }),
        prisma.product.create({ data: { name: 'Enterprise License', price: 499.00, category: 'License' } }),
        prisma.product.create({ data: { name: 'Consulting Hour', price: 150.00, category: 'Service' } }),
    ])

    // 3. Customers & Sales (Past 3 Months)
    const customers = []
    for (let i = 0; i < 20; i++) {
        const customer = await prisma.customer.create({
            data: {
                name: `Customer ${i + 1}`,
                email: `customer${i + 1}@example.com`,
            },
        })
        customers.push(customer)
    }

    // Generate 50+ sales
    const salesData = []
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

    for (let i = 0; i < 60; i++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)]

        // Random date between 3 months ago and now
        const randomTime = threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())
        const saleDate = new Date(randomTime)

        salesData.push({
            amount: randomProduct.price,
            customerId: randomCustomer.id,
            productId: randomProduct.id,
            createdAt: saleDate
        })
    }

    await prisma.sale.createMany({ data: salesData })

    // 4. Inventory Snapshots (Mocked as we don't have real inventory logic yet, just snapshots)
    // Create snapshots for last 30 days
    const inventorySnapshots = []
    for (let i = 0; i < 30; i++) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
        for (const product of products) {
            inventorySnapshots.push({
                productId: product.id,
                quantity: Math.floor(Math.random() * 100) + 10, // Random quantity
                snapshotDate: date
            })
        }
    }
    await prisma.inventorySnapshot.createMany({ data: inventorySnapshots })


    // 5. Funnel Data (4 Weeks)
    // Week 1 (Oldest) -> Week 4 (Newest)
    const funnelWeeks = [
        { weekOffset: 3, visitors: 4000, views: 3000, cart: 1500, purchase: 800 },
        { weekOffset: 2, visitors: 4200, views: 3100, cart: 1600, purchase: 900 },
        { weekOffset: 1, visitors: 4500, views: 3300, cart: 1800, purchase: 1100 },
        { weekOffset: 0, visitors: 5000, views: 3500, cart: 2000, purchase: 1245 },
    ]

    for (const week of funnelWeeks) {
        const weekStart = new Date(now.getTime() - (week.weekOffset * 7 * 24 * 60 * 60 * 1000))
        await prisma.funnelWeekly.create({
            data: {
                weekStart: weekStart,
                visitors: week.visitors,
                views: week.views,
                cart: week.cart,
                purchase: week.purchase
            }
        })
    }

    // 6. Activity Logs
    const actions = ['LOGIN', 'VIEW_REPORT', 'EXPORT_DATA', 'UPDATE_SETTINGS']
    const logs = []
    for (let i = 0; i < 20; i++) {
        const time = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
        logs.push({
            action: actions[Math.floor(Math.random() * actions.length)],
            details: `User performed action`,
            createdAt: time
        })
    }
    await prisma.activityLog.createMany({ data: logs })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
