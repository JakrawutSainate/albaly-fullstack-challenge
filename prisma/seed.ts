
import { PrismaClient, Region, InventoryStatus, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Clean up existing data
    await prisma.sale.deleteMany()
    await prisma.inventorySnapshot.deleteMany()
    await prisma.product.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.user.deleteMany()
    await prisma.activityLog.deleteMany()
    await prisma.funnelWeekly.deleteMany()

    // 1. Create Users
    const passwordHash = await bcrypt.hash('password123', 10)

    await prisma.user.create({
        data: {
            email: 'admin@albaly.com',
            name: 'Admin User',
            passwordHash,
            role: Role.ADMIN,
        },
    })

    await prisma.user.create({
        data: {
            email: 'viewer@albaly.com',
            name: 'Viewer User',
            passwordHash,
            role: Role.VIEWER,
        },
    })

    console.log('Created Users')

    // 2. Create Customers (50+)
    const customers = []
    const regions = [Region.NA, Region.EU, Region.APAC]

    // High volume of customers for realistic data
    for (let i = 0; i < 60; i++) {
        const region = regions[Math.floor(Math.random() * regions.length)]
        const customer = await prisma.customer.create({
            data: {
                name: `Customer ${i + 1}`,
                email: `customer${i + 1}@example.com`,
                region: region,
                isActive: Math.random() > 0.1, // 90% active
            },
        })
        customers.push(customer)
    }
    console.log(`Created ${customers.length} Customers`)

    // 3. Create Products
    const products = []
    const productData = [
        { name: 'Quantum Laptop', price: 1200.0, category: 'Electronics' },
        { name: 'Ergo Chair', price: 350.0, category: 'Furniture' },
        { name: 'Wireless Buds', price: 150.0, category: 'Electronics' },
        { name: 'Smart Watch', price: 250.0, category: 'Electronics' },
        { name: 'Standing Desk', price: 500.0, category: 'Furniture' },
        { name: '4K Monitor', price: 400.0, category: 'Electronics' },
    ]

    for (const p of productData) {
        const product = await prisma.product.create({
            data: p,
        })
        products.push(product)
    }
    console.log(`Created ${products.length} Products`)

    // 4. Create Sales (Generate historic sales over last 30 days)
    const sales = []
    const now = new Date()

    // Generate ~150 sales
    for (let i = 0; i < 150; i++) {
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 5) + 1 // 1-5 items
        const amount = randomProduct.price * quantity

        // Random date within last 30 days
        const dateOffset = Math.floor(Math.random() * 30)
        const saleDate = new Date()
        saleDate.setDate(now.getDate() - dateOffset)

        const sale = await prisma.sale.create({
            data: {
                amount,
                quantity,
                customerId: randomCustomer.id,
                productId: randomProduct.id,
                createdAt: saleDate,
            },
        })
        sales.push(sale)
    }
    console.log(`Created ${sales.length} Sales`)

    // 5. Create Inventory Snapshots
    for (const product of products) {
        const onHand = Math.floor(Math.random() * 100)
        let status: InventoryStatus = InventoryStatus.OK
        if (onHand === 0) status = InventoryStatus.OUT
        else if (onHand < 20) status = InventoryStatus.LOW

        await prisma.inventorySnapshot.create({
            data: {
                productId: product.id,
                onHand,
                status,
                snapshotDate: new Date(),
            },
        })
    }
    console.log('Created Inventory Snapshots')

    // 6. Create Activity Logs
    const actions = ['USER_LOGIN', 'REPORT_DOWNLOAD', 'SETTINGS_UPDATE']
    const users = ['admin@albaly.com', 'viewer@albaly.com']

    for (let i = 0; i < 10; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomAction = actions[Math.floor(Math.random() * actions.length)]

        await prisma.activityLog.create({
            data: {
                user: randomUser,
                action: randomAction,
                details: 'Performed action via dashboard',
            },
        })
    }
    console.log('Created Activity Logs')

    // 7. Create Funnel Weekly Data (4 Weeks)
    for (let i = 0; i < 4; i++) {
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - (i * 7))

        // Make simpler funnel numbers
        const visitors = 1000 + Math.floor(Math.random() * 500)
        const views = Math.floor(visitors * 0.7) // 70%
        const cart = Math.floor(views * 0.4) // 40% of views
        const purchase = Math.floor(cart * 0.5) // 50% of cart

        await prisma.funnelWeekly.create({
            data: {
                weekStart,
                visitors,
                views,
                cart,
                purchase,
            },
        })
    }
    console.log('Created Funnel Data')

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
