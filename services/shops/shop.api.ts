import { createHttp } from "@/lib/http/http";
import { Shop,  CreateShopDTO } from "./shop.type";

const http = createHttp({});


export async function fetchShops(): Promise<Shop[]> {
  try {
    const res = await http.get<{ data: Shop[] }>("/api/shops", {cache: "no-store"});

    return res.data;
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
