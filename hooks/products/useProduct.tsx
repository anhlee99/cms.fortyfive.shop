"use client";
import useSWR from "swr";
import { PaginatedResponse } from "@/types/pagination";
import {
  Product,
  ProductCreateDTO,
  ProductSearchParams,
} from "@/services/products/product.type";
import { list, create, getById } from "@/services/products/product.api";
import { useProductSearchUrl, normalizeSearch } from "./useProductsSearch";

function keyFromParams(params?: ProductSearchParams) {
  const p = normalizeSearch(params);
  // stable key: SWR will re-fetch only when p changes (i.e., on Apply)
  return ["/api/products", p] as const;
}

export function useProducts(initialData?: PaginatedResponse<Product>) {
  const { params } = useProductSearchUrl();
  const swrKey = keyFromParams(params);
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    swrKey,
    () => list(params),
    {
      fallbackData: initialData,
      // Enable revalidation on focus, mount, and reconnect
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  const newProduct = async (payload: ProductCreateDTO) => {
    const newProduct = await create(payload);
    await mutate();
    return newProduct;
  };

  const getProduct = async (id: string): Promise<Product> => {
    const product = await getById(id);
    return product;
  };

  return {
    data,
    isLoading,
    error,
    mutate,
    newProduct,
    getProduct,
  };
}
