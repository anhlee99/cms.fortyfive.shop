import { createClient, createAdminClient } from "@/lib/supabase/server";
import type {
  AgentUser,
  AgentUserCreateDTO,
  AgentUserSearchParams,
  AgentUserUpdateDTO,
} from "@/services/agent-users/agent-user.type";
import { User } from "../auth/auth.type";
import { PaginatedResponse } from "@/types/pagination";

export async function list(
  user: User,
  params: AgentUserSearchParams
): Promise<PaginatedResponse<AgentUser>> {
  const supabase = await createClient();

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 && params.limit <= 100 ? params.limit : 20;
  const offset = (page - 1) * limit;

  console.log("user.agentId   ", user.agentId);
  let query = supabase
    .from("agent_users")
    .select("*", { count: "exact" }) // returns { data, count }
    .eq("agent_id", user.agentId);

  // sorting
  if (params.sort && params.sort.length > 0) {
    params.sort.forEach((s) => {
      if (s.field) {
        query = query.order(s.field, { ascending: s.dir === "asc" });
      }
    });
  }

  // basic text search
  if (params.q && params.q.trim()) {
    const q = params.q.trim();
    // simple: ILIKE on name
    query = query.ilike("full_name", `%${q}%`);
    // (optional) if you have a tsvector column 'tsv', do:
    // query = query.textSearch("tsv", q, { type: "websearch" });
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);
  if (error) throw error;

  return {
    data: data as AgentUser[],
    pagination: {
      page,
      pageSize: limit,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function create(input: AgentUserCreateDTO): Promise<AgentUser> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email: input.username,
    password: input.password,
    app_metadata: { role: input.role, agent_id: input.agentId },
    user_metadata: {
      full_name: input.full_name,
      avatar_url: input.avatar_url,
    },
    email_confirm: true,
  });

  if (error) throw error;
  return getById(data.user?.id!) as Promise<AgentUser>;
}

export async function update(
  id: string,
  input: Partial<AgentUserUpdateDTO>
): Promise<AgentUser> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.updateUserById(id, {
    password: input.password,
    app_metadata: {
      role: input.role,
      agent_id: input.agentId,
    },
    user_metadata: {
      full_name: input.full_name,
      avatar_url: input.avatar_url,
    },
  });

  if (error) throw error;
  return getById(data.user?.id!) as Promise<AgentUser>;
}

export async function del(id: string): Promise<void> {
  const supabase = await createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
}

export async function getById(id: string): Promise<AgentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agent_users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  console.log("data", data);
  return data as AgentUser;
}
