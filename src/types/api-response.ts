export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'VIEWER';
}

export interface KpiData {
    totalSales: number;
    totalSalesGrowth: number;
    activeCustomers: number;
    activeCustomersGrowth: number;
    inventoryCount: number;
    inventoryGrowth: number;
}

export interface ActivityLogDTO {
    id: string;
    action: string;
    details?: string;
    timestamp: string; // ISO string
}

export interface MonthlyPerformanceData {
    month: string;
    value: number;
}

export interface DashboardData {
    kpi: KpiData;
    recentActivity: ActivityLogDTO[];
    monthlyPerformance: MonthlyPerformanceData[];
}

export interface FunnelData {
    visitors: number;
    views: number;
    cart: number;
    purchase: number;
}

export interface RegionPerformance {
    region: string;
    percentage: number;
}

export interface ProductPerformance {
    id: string;
    name: string;
    sales: number;
}
