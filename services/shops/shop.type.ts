import { SearchParams } from "@/types/pagination";

export type ShopStatus = "active" | "inactive" | undefined;

export interface Shop {
  id: string;
  agent_id: string;
  user_id: string;
  name: string;
  domain: string;
  status: ShopStatus;
  created_at: string;
}

export interface CreateShopDTO {
  agent_id: string;
  user_id?: string;
  name: string;
  status: ShopStatus;
}

export interface ShopSearchParams extends SearchParams {
  status?: ShopStatus;
}
