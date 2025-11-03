"use client";
import useSWR from "swr";
import { PaginatedResponse } from "@/types/pagination";
import {
  Product,
  ProductCreateDTO,
  ProductFormType,
  ProductSearchParams,
  ProductUpdateDTO,
} from "@/services/products/product.type";
import { list, create, getById, update } from "@/services/products/product.api";
import { create as uploadFile } from "@/services/uploads/upload.api";
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

  const newProduct = async (payload: ProductFormType) => {
    const { thumbnail, gallery, ...restOfPayload } = payload;
    const finalPayload: Partial<ProductCreateDTO> = { ...restOfPayload };
    // handle upload file
    if (thumbnail instanceof File) {
      const uploadedImage = await uploadFile({ file: thumbnail });
      finalPayload.thumbnail = uploadedImage.url;
    }

    if (Array.isArray(gallery)) {
      const uploadedGallery = [];
      for (const file of gallery) {
        if (file instanceof File) {
          const uploadedImage = await uploadFile({ file });
          console.log("Uploaded gallery image:", uploadedImage);
          uploadedGallery.push(uploadedImage.url);
        } else if (typeof file === "string") {
          // Nếu đã là URL, giữ nguyên
          uploadedGallery.push(file);
        }
      }
      finalPayload.gallery = uploadedGallery;
    }

    const newProduct = await create(finalPayload as ProductCreateDTO);
    await mutate();
    return newProduct;
  };

  const getProduct = async (id: string): Promise<Product> => {
    const product = await getById(id);
    return product;
  };

  const updateProduct = async (id: string, payload: ProductUpdateDTO) => {
    const updatedProduct = await update(id, payload);
    await mutate();
    return updatedProduct;
  };

  return {
    data,
    isLoading,
    error,
    mutate,
    newProduct,
    updateProduct,
    getProduct,
  };
}
