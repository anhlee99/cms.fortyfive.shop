import { createHttp } from "@/lib/http/http";
import { Order, OrderSearchParams, OrderCreateDTO, OrderUpdateDTO } from "./orders.type";
import { PaginatedResponse, toQuery } from "@/types/pagination";
const http = createHttp({});



export async function list(params?: OrderSearchParams): Promise<PaginatedResponse<Order>> {
  try {
    return await http.get<PaginatedResponse<Order>>(`/api/orders${toQuery(params)}`, {cache: "no-store"});
  } catch (error) {
      throw new Error("Failed to fetch orders");
  }
}

export async function create(data: OrderCreateDTO): Promise<Order> {
    try {
        const res = await http.post<{ data: Order }>("/api/orders", data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to create order");
    }
}

export async function update(id: string, data: OrderUpdateDTO): Promise<Order> {
    try {
        const res = await http.put<{ data: Order }>(`/api/orders/${id}`, data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to update order");
    }
}

export async function del(id: string): Promise<void> {
    try {
        await http.del(`/api/orders/${id}`);
    } catch (error) {
        throw new Error("Failed to delete order");
    }
}

export async function getById(id: string): Promise<Order> {
  try {
    const res = await http.get<{ data: Order }>(`/api/orders/${id}`, { cache: "no-store" });
    return res.data;
  } catch (error) {
      throw new Error("Failed to fetch order by id");
  }
}
