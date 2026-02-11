import prisma from "@/lib/prisma";

export class ProductService {
    async getTopSellingProducts() {
        // Mock: in realDB, aggregate Sales by ProductId
        return [
            { name: "Product A", sales: 1200, color: "bg-blue-500" },
            { name: "Product B", sales: 850, color: "bg-blue-300" }
        ];
    }

    async getRegionPerformance() {
        // Mock
        return [
            { region: "North America", percentage: 75 },
            { region: "Europe", percentage: 50 },
            { region: "APAC", percentage: 33 }
        ];
    }
}
