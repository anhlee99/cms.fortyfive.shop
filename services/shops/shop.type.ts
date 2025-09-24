import { SearchParams } from "@/types/pagination";

export type ShopStatus = "active" | "inactive";

export interface Shop {
    id: string;
    user_id: string;
    name: string;
    domain: string;
    status: ShopStatus;
    created_at: string;
}

export interface ShopSearchParams extends SearchParams {
    status?: ShopStatus;
};

export interface CreateShopDTO {
    user_id: string;
    name: string;
    status: ShopStatus;
}

