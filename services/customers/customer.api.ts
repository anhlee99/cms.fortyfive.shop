import { createHttp } from "@/lib/http/http";
import { Customer, CustomerSearchParams, CustomerCreateDTO, CustomerUpdateDTO } from "./customer.type";
import { PaginatedResponse, toQuery } from "@/types/pagination";
import { Product } from "../products/product.type";
const http = createHttp({});



export async function list(params?: CustomerSearchParams): Promise<PaginatedResponse<Customer>> {
  try {
    return await http.get<PaginatedResponse<Customer>>(`/api/customers${toQuery(params)}`, {cache: "no-store"});
  } catch (error) {
      throw new Error("Failed to fetch customers");
  }
}

export async function create(data: CustomerCreateDTO): Promise<Customer> {
    try {
        const res = await http.post<{ data: Customer }>("/api/customers", data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to create customer");
    }
}

export async function update(id: string, data: CustomerUpdateDTO): Promise<Customer> {
    try {
        const res = await http.put<{ data: Customer }>(`/api/customers/${id}`, data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to update customer");
    }
}

export async function del(id: string): Promise<void> {
    try {
        await http.del(`/api/customers/${id}`);
    } catch (error) {
        throw new Error("Failed to delete customer");
    }
}

export async function getById(id: string): Promise<Customer> {
  try {
    const res = await http.get<{ data: Customer }>(`/api/customers/${id}`, { cache: "no-store" });
    return res.data;
  } catch (error) {
      throw new Error("Failed to fetch customer");
  }
}


export async function addLabel(customerId: string, labelId: string): Promise<Customer> {
    try {
        const res = await http.post<{ data: Customer }>(`/api/customers/${customerId}/labels`, { label_id: labelId });
        return res.data;
    } catch (error) {
        throw new Error("Failed to add labels to customer");
    }
}

export async function removeLabel(customerId: string, labelId: string): Promise<Customer> {
    try {
        const res = await http.del<{ data: Customer }>(`/api/customers/${customerId}/labels?label_id=${labelId}`);
        return res.data;
    } catch (error) {
        throw new Error("Failed to remove label from customer");
    }
}