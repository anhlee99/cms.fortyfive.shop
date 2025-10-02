import { SearchParams } from "@/types/pagination";
export type TimeView = "day" | "week" | "month" | "year";
export type DashboardStats = {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
}

export interface DashboardStatsSearchParams extends SearchParams {
    timeView: TimeView; 
}
