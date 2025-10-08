import type {
  Label,
  CreateLabelDTO,
  LabelSearchParams,
  LabelType,
} from "./label.type";
import { createClient } from "@/lib/supabase/server";
import { PaginatedResponse } from "@/types/pagination";

export async function list(
  params: LabelSearchParams
): Promise<PaginatedResponse<Label>> {
  const supabase = await createClient();

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 && params.limit <= 100 ? params.limit : 20;
  const offset = (page - 1) * limit;

  let query = supabase.from("labels").select("*", { count: "exact" }); // returns { data, count }

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
    query = query.ilike("display_name", `%${q}%`);
    // (optional) if you have a tsvector column 'tsv', do:
    // query = query.textSearch("tsv", q, { type: "websearch" });
  }
  if (params.type && params.type.trim()) {
    query = query.eq("type", params.type.trim());
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);
  if (error) throw error;

  return {
    data: data as Label[],
    pagination: {
      page,
      pageSize: limit,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function listAllLabelsByType(
  labelType: LabelType
): Promise<Label[]> {
  const supabase = await createClient();

  let query = supabase.from("labels").select("*").eq("type", labelType);

  const { data, error } = await query;
  if (error) throw error;

  return data as Label[];
}

export async function create(input: CreateLabelDTO): Promise<Label> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("labels")
    .insert({ ...input })
    .select("*")
    .single();

  if (error) throw error;
  return data as Label;
}

export async function update(
  id: string,
  input: Partial<CreateLabelDTO>
): Promise<Label> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("labels")
    .update({ ...input })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as Label;
}

export async function del(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("labels").delete().eq("id", id);

  if (error) throw error;
}

export async function getById(id: string): Promise<Label | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("labels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Label;
}
