import { createHttp } from "@/lib/http/http";
import { DashboardStats, DashboardStatsSearchParams } from "./dashboards.type";
import { PaginatedResponse, toQuery } from "@/types/pagination";
const http = createHttp({});


export async function stats(params?: DashboardStatsSearchParams): Promise<PaginatedResponse<DashboardStats>> {
  try {
    return await http.get<PaginatedResponse<DashboardStats>>(`/api/dashboards/stats${toQuery(params)}`, {cache: "no-store"});
  } catch (error) {
      throw new Error("Failed to fetch dashboard stats");
  }
}
