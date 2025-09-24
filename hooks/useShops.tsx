"use client";
import useSWR from "swr";
import { Shop, CreateShopDTO } from "@/services/shops/shop.type";
import { fetchShops, createShop, fetchShopById } from "@/services/shops/shop.api";

export function useShops(initialData?: Shop[]) {

    const { data, error, isLoading, mutate } = useSWR<Shop[]>("/api/shops", fetchShops, {
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
        shops: data ?? [],
        isLoading,
        isError: error,
        mutate,
        newShop,
        getShop,
    };
}