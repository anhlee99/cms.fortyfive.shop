"use client";
import useSWR from "swr";
import { PaginatedResponse } from "@/types/pagination";
import { Shop, CreateShopDTO, ShopSearchParams } from "@/services/shops/shop.type";
import {list, create, getById } from "@/services/shops/shop.api";
import { useShopSearchUrl, normalizeSearch } from "./useShopsSearch";

function keyFromParams(params?: ShopSearchParams) {
  const p = normalizeSearch(params);
  // stable key: SWR will re-fetch only when p changes (i.e., on Apply)
  return ["/api/shops", p] as const;
}

export function useShops(initialData?: PaginatedResponse<Shop>) {
    const { params } = useShopSearchUrl();
    const swrKey = keyFromParams(params);
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Shop>>(swrKey, () => list(params), {
        fallbackData: initialData,
        // Enable revalidation on focus, mount, and reconnect
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
    });

    const newShop = async (payload: CreateShopDTO) => {
        const newShop = await create(payload);
        await mutate();
        return newShop;
    };

    const getShop = async (id: string): Promise<Shop> => {
        const shop = await getById(id);
        return shop;
    }

    return {
        data,
        isLoading,
        error,
        mutate,
        newShop,
        getShop,
    };
}

