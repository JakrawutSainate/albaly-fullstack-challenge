// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ============================================
// User & Auth Types
// ============================================
export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'VIEWER';
}

// ============================================
// Product Types
// ============================================
export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
}

export interface ProductWithStock extends Product {
    stock: number;
}

export interface ProductPerformance {
    id: string;
    name: string;
    sales: number;
}

// ============================================
// Cart Types
// ============================================
export interface CartItem extends Product {
    quantity: number;
}

export interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    getCartCount: () => number;
    getTotalPrice: () => number;
}

export interface CartModalHelpers {
    clearCart: () => void;
    addToast: (message: string, type: 'success' | 'error') => void;
    purchaseAction: (productId: string, quantity: number) => Promise<{ success: boolean; error?: { message: string } }>;
}

// ============================================
// Dashboard & KPI Types
// ============================================
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
    createdAt: Date;// ISO string
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

// ============================================
// Insights & Analytics Types
// ============================================
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

export interface TopProduct {
    id: string;
    name: string;
    sales: number;
}

export interface RegionalData {
    region: string;
    sales: number;
}

export interface DropOffItem {
    step: string;
    value: number;
}

// ============================================
// Toast/Notification Types
// ============================================
export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

export interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: Toast['type']) => void;
    removeToast: (id: string) => void;
}

// ============================================
// Component Props Types
// ============================================
export interface KPICardProps {
    title: string;
    value: string | number;
    growth?: number;
    icon: React.ReactNode;
}

export interface ActivityFeedProps {
    activities: ActivityLogDTO[];
}

export interface MonthlyPerformanceChartProps {
    data: MonthlyPerformanceData[];
}

export interface TopProductsChartProps {
    products: TopProduct[];
}

export interface RegionalPerformanceChartProps {
    data: RegionalData[];
}

export interface FunnelChartProps {
    data: FunnelData;
}

export interface SimpleFunnelProps {
    data: FunnelData;
}

export interface OverviewChartsProps {
    monthlyPerformance: MonthlyPerformanceData[];
}

export interface InsightsChartsProps {
    funnelData: FunnelData;
    regionalData: RegionalData[];
    topProducts: TopProduct[];
}

export interface SidebarProps {
    userEmail: string;
    userRole: 'ADMIN' | 'VIEWER';
}

export interface HasRoleProps {
    role: 'ADMIN' | 'VIEWER';
    children: React.ReactNode;
}

export interface ConfirmPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
    productPrice: number;
}

