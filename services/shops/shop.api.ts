import { createHttp } from "@/lib/http/http";
import { Shop,  CreateShopDTO, ShopSearchParams } from "./shop.type";
import { PaginatedResponse } from "@/types/pagination";

const http = createHttp({});

function toQuery(params: ShopSearchParams = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) qs.set(k, JSON.stringify(v));
    else if (typeof v === "object") qs.set(k, JSON.stringify(v));
    else qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export async function fetchShops(params?: ShopSearchParams): Promise<PaginatedResponse<Shop>> {
  try {
    return await http.get<PaginatedResponse<Shop>>(`/api/shops${toQuery(params)}`, {cache: "no-store"});
  } catch (error) {
      throw new Error("Failed to fetch shops");
  }
}

export async function createShop(data: CreateShopDTO): Promise<Shop> {
    try {
        const res = await http.post<{ data: Shop }>("/api/shops", data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to create shop");
    }
}

export async function fetchShopById(id: string): Promise<Shop> {
  try {
    const res = await http.get<{ data: Shop }>(`/api/shops/${id}`, { cache: "no-store" });
    return res.data;
  } catch (error) {
      throw new Error("Failed to fetch shop");
  }
}
