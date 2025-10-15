import { createHttp } from "@/lib/http/http";
import {
  AgentUser,
  AgentUserCreateDTO,
  AgentUserSearchParams,
  AgentUserUpdateDTO,
} from "./agent-user.type";
import { PaginatedResponse, toQuery } from "@/types/pagination";
const http = createHttp({});

export async function list(
  params?: AgentUserSearchParams
): Promise<PaginatedResponse<AgentUser>> {
  try {
    return await http.get<PaginatedResponse<AgentUser>>(
      `/api/agent-users${toQuery(params)}`,
      { cache: "no-store" }
    );
  } catch (error) {
    throw new Error("Failed to fetch agent users");
  }
}

export async function create(data: AgentUserCreateDTO): Promise<AgentUser> {
  try {
    const res = await http.post<{ data: AgentUser }>("/api/agent-users", data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to create agent user");
  }
}

export async function update(
  id: string,
  data: AgentUserUpdateDTO
): Promise<AgentUser> {
  try {
    const res = await http.put<{ data: AgentUser }>(
      `/api/agent-users/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    throw new Error("Failed to update agent user");
  }
}

export async function del(id: string): Promise<void> {
  try {
    await http.del(`/api/agent-users/${id}`);
  } catch (error) {
    throw new Error("Failed to delete customer");
  }
}
