"use client";
import useSWR from "swr";
import { Shop, CreateShopDTO, ShopSearchParams } from "@/services/shops/shop.type";
import { fetchShops, createShop, fetchShopById } from "@/services/shops/shop.api";
import { useShopSearchUrl, normalizeSearch } from "./useShopsSearch";
import { PaginatedResponse } from "@/types/pagination";

function keyFromParams(params?: ShopSearchParams) {
  const p = normalizeSearch(params);
  // stable key: SWR will re-fetch only when p changes (i.e., on Apply)
  return ["/api/shops", p] as const;
}

export function useShops(initialData?: PaginatedResponse<Shop>) {
    const { params } = useShopSearchUrl();
    const swrKey = keyFromParams(params);

    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Shop>>(swrKey, () => fetchShops(params), {
        fallbackData: initialData,
        // Enable revalidation on focus, mount, and reconnect
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
    });

    const newShop = async (payload: CreateShopDTO) => {
        const newShop = await createShop(payload);
        await mutate();
        return newShop;
    };

    const getShop = async (id: string): Promise<Shop> => {
        const shop = await fetchShopById(id);
        return shop;
    }

    return {
        data,
        isLoading,
        isError: error,
        mutate,
        newShop,
        getShop,
    };
}

