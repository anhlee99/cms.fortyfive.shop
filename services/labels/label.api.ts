import { createHttp } from "@/lib/http/http";
import { Label,  CreateLabelDTO, LabelSearchParams } from "./label.type";
import { PaginatedResponse, toQuery } from "@/types/pagination";

const http = createHttp({});


export async function list(params?: LabelSearchParams): Promise<PaginatedResponse<Label>> {
  try {
    return await http.get<PaginatedResponse<Label>>(`/api/labels${toQuery(params)}`, {cache: "no-store"});
  } catch (error) {
      throw new Error("Failed to fetch labels");
  }
}

export async function create(data: CreateLabelDTO): Promise<Label> {
    try {
        const res = await http.post<{ data: Label }>("/api/labels", data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to create label");
    }
}

export async function update(id: string, data: Partial<CreateLabelDTO>): Promise<Label> {  
    try {
        const res = await http.put<{ data: Label }>(`/api/labels/${id}`, data);
        return res.data;
    } catch (error) {
        throw new Error("Failed to update label");
    }
}

export async function del(id: string): Promise<void> {  
    try {
        await http.del(`/api/labels/${id}`);
    } catch (error) {
        throw new Error("Failed to delete label");
    }
}

export async function getById(id: string): Promise<Label> {
  try {
    const res = await http.get<{ data: Label }>(`/api/labels/${id}`, { cache: "no-store" });
    return res.data;
  } catch (error) {
      throw new Error("Failed to fetch label");
  }
}

