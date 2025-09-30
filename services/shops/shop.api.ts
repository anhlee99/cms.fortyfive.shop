import { createHttp } from "@/lib/http/http";
import { Shop,  CreateShopDTO, ShopSearchParams } from "./shop.type";
import { PaginatedResponse, toQuery } from "@/types/pagination";
const http = createHttp({});

export async function list(params?: ShopSearchParams): Promise<PaginatedResponse<Shop>> {
  try {
    return await http.get<PaginatedResponse<Shop>>(`/api/shops${toQuery(params)}`, {cache: "no-store"});
  } catch (error) {
      throw new Error("Failed to fetch shops");
  }
}

export async function create(data: CreateShopDTO): Promise<Shop> {
    try {
        const res = await http.post<{ data: Shop }>("/api/shops", data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to create shop");
    }
}

export async function getById(id: string): Promise<Shop> {
  try {
    const res = await http.get<{ data: Shop }>(`/api/shops/${id}`, { cache: "no-store" });
    return res.data;
  } catch (error) {
      throw new Error("Failed to fetch shop");
  }
}
