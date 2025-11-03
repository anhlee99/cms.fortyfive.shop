import { createHttp } from "@/lib/http/http";
import {
  Product,
  ProductSearchParams,
  ProductUpdateDTO,
  ProductCreateDTO,
} from "./product.type";
import { PaginatedResponse, toQuery } from "@/types/pagination";
const http = createHttp({});

export async function list(
  params?: ProductSearchParams
): Promise<PaginatedResponse<Product>> {
  try {
    return await http.get<PaginatedResponse<Product>>(
      `/api/products${toQuery(params)}`,
      { cache: "no-store" }
    );
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
}

export async function create(data: ProductCreateDTO): Promise<Product> {
  try {
    const res = await http.post<{ data: Product }>("/api/products", data);
    return res.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create product"
    );
  }
}

export async function update(
  id: string,
  data: ProductUpdateDTO
): Promise<Product> {
  try {
    const res = await http.put<{ data: Product }>(`/api/products/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to update product");
  }
}

export async function del(id: string): Promise<void> {
  try {
    await http.del(`/api/products/${id}`);
  } catch (error) {
    throw new Error("Failed to delete product");
  }
}

export async function getById(id: string): Promise<Product> {
  try {
    const res = await http.get<{ data: Product }>(`/api/products/${id}`, {
      cache: "no-store",
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch product");
  }
}

export async function addLabel(
  productId: string,
  labelId: string
): Promise<Product> {
  try {
    const res = await http.post<{ data: Product }>(
      `/api/products/${productId}/labels`,
      { label_id: labelId }
    );
    return res.data;
  } catch (error) {
    throw new Error("Failed to add labels to product");
  }
}

export async function removeLabel(
  productId: string,
  labelId: string
): Promise<Product> {
  try {
    const res = await http.del<{ data: Product }>(
      `/api/products/${productId}/labels?label_id=${labelId}`
    );
    return res.data;
  } catch (error) {
    throw new Error("Failed to remove label from product");
  }
}
