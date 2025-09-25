import type { Shop, CreateShopDTO, ShopSearchParams } from "./shop.type";
import { createClient } from "@/lib/supabase/server";
import { PaginatedResponse } from "@/types/pagination";

export async function listShops(): Promise<Shop[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ;
}

export async function listShopsWithQuery(params: ShopSearchParams): Promise<PaginatedResponse<Shop>> {
  const supabase = await createClient();
  
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 && params.limit <= 100 ? params.limit : 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("shops")
    .select("*", { count: 'exact' }) // returns { data, count }
    // .order(params.sort ?? "created_at", { ascending: (params.dir ?? "desc") === "asc" })
    // .ilike("status", params.status ?? "%")
    // .range(offset, offset + limit - 1);

    // basic text search
  if (params.q && params.q.trim()) {
    const q = params.q.trim();
    // simple: ILIKE on name
    query = query.ilike("name", `%${q}%`);
    // (optional) if you have a tsvector column 'tsv', do:
    // query = query.textSearch("tsv", q, { type: "websearch" });
  }

  if( params.status && params.status.trim()) {
    query = query.eq("status", params.status.trim());
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);
  if (error) throw error;
  
  return {
    data: data as Shop[],
    pagination: {
      page,
      pageSize: limit,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  }
}

export async function createShop(input: CreateShopDTO): Promise<Shop> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("shops")
        .insert({ ...input})
        .select("*")
        .single();

    if (error) throw error;
    return data as Shop;        
}

export async function getShopById(id: string): Promise<Shop | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("id", id)
        .single();
        
    if (error) throw error;
    return data as Shop;        
}