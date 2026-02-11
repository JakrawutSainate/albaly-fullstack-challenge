import prisma from "@/lib/prisma";

export class ProductService {
    async getTopSellingProducts() {
        const topProducts = await prisma.sale.groupBy({
            by: ['productId'],
            _sum: { amount: true },
            orderBy: {
                _sum: { amount: 'desc' }
            },
            take: 5
        });

        const productIds = topProducts.map(p => p.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        return topProducts.map((p, index) => {
            const product = products.find(prod => prod.id === p.productId);
            const colors = ["bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500"];
            return {
                name: product?.name || 'Unknown Product',
                sales: p._sum.amount || 0,
                color: colors[index % colors.length]
            };
        });
    }

    async getRegionPerformance() {
        // Complex aggregation: Join Sale -> Customer -> Region
        // Prisma groupBy doesn't support relation columns directly.
        // We can find all customers, group by region, etc., or use raw query.

        const result = await prisma.$queryRaw`
            SELECT c.region, SUM(s.amount) as total_sales
            FROM "Sale" s
            JOIN "Customer" c ON s."customerId" = c.id
            GROUP BY c.region
        `;

        const resultTyped = result as any[];
        const total = resultTyped.reduce((acc, curr) => acc + Number(curr.total_sales), 0);

        return resultTyped.map(r => ({
            region: r.region,
            percentage: total > 0 ? Math.round((Number(r.total_sales) / total) * 100) : 0
        }));
    }
}
