import type { Order, OrderCreateDTO, OrderSearchParams, OrderUpdateDTO} from "./orders.type";
import { createClient } from "@/lib/supabase/server";
import { PaginatedResponse, OP_MAP, FilterOption, FilterOperator, FilterNotOperator } from "@/types/pagination";

type Buckets = {
  labelFilters: FilterOption[];
  ftsFilters: FilterOption[];
  jsonArrayFilters: FilterOption[];
  notFilters: FilterOption[];
  baseFilters: FilterOption[];
};

function bucketize(filters: FilterOption[] = []): Buckets {
  const B: Buckets = {
    labelFilters: [],
    ftsFilters: [],
    jsonArrayFilters: [],
    notFilters: [],
    baseFilters: [],
  };

  for (const f of filters) {
    const op = (f.operator ?? "eq") as FilterOperator;
    if (f.field === "labels") B.labelFilters.push(f);
    else if (op === "fts" || op === "plfts" || op === "phfts") B.ftsFilters.push(f);
    // else if (op === "cs" || op === "cd" || op === "ov") B.jsonArrayFilters.push(f);
    else if (f.notOp) B.notFilters.push(f);
    else B.baseFilters.push(f);
  }
  return B;
}

function normalizeValue(val: any, op?: FilterOperator | FilterNotOperator) {
  if (op === "in") {
    if (Array.isArray(val)) return val;
    return String(val).split(",").map(s => s.trim()).filter(Boolean);
  }
  if (op === "is") {
    if (val === "null" || val === null) return null;
    if (val === "true") return true;
    if (val === "false") return false;
  }
  // cố gắng parse number
  if (typeof val === "string" && /^-?\d+(\.\d+)?$/.test(val)) return Number(val);
  // cố gắng parse JSON array/object nếu trông giống
  if (typeof val === "string" && /^[\[\{].*[\]\}]$/.test(val)) {
    try { return JSON.parse(val); } catch {}
  }
  return val;
}

function applyFilter(q: any, f: FilterOption) {
  const op = (f.operator ?? "eq") as keyof typeof OP_MAP;
  const v  = normalizeValue(f.value, op);

  // operator chính
  const handler = (OP_MAP as any)[op];
  if (handler) q = handler(q, f.field, v);

  // phủ định (notOp) nếu có
  if (f.notOp) {
    const notV = normalizeValue(f.value, f.notOp);
    q = q.not(f.field, f.notOp, notV);
  }
  return q;
}

export async function list(params: OrderSearchParams): Promise<PaginatedResponse<Order>> {
  const supabase = await createClient();
  const B = bucketize(params.filters);

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 && params.limit <= 100 ? params.limit : 20;
  const offset = (page - 1) * limit;

  // SELECT string: LEFT by default
  let selectLeft = `
    *,
    orders_labels ( label_id ),
    labels:orders_labels ( labels ( * ) )
  `;
  let selectInner = `
    *,
    orders_labels!inner ( label_id ),
    labels:orders_labels ( labels ( * ) )
  `;

  // Chọn LEFT hay INNER tuỳ có label filter
  let q = supabase.from("orders").select(
    B.labelFilters.length ? selectInner : selectLeft,
    { count: "exact" }
  );

  // 3.1) labelFilters: ánh xạ sang bảng join
  for (const f of B.labelFilters) {
    const op = (f.operator ?? "eq") as FilterOperator;
    const v = normalizeValue(f.value, op);

    if (op === "in") {
      q = q.in("orders_labels.label_id", Array.isArray(v) ? v : [String(v)]);
    } else if (f.notOp) {
      q = q.not("orders_labels.label_id", f.notOp as any, normalizeValue(f.value, f.notOp));
    } else {
      q = q.eq("orders_labels.label_id", v);
    }
  }

  // 3.2) base filters (eq/neq/lt/lte/gt/gte/like/ilike/is/in…)
  for (const f of B.baseFilters) {
    q = applyFilter(q, f);
  }

  // 3.3) json/array (cs/cd/ov)
  for (const f of B.jsonArrayFilters) {
    q = applyFilter(q, f);
  }

  // 3.4) full-text
  for (const f of B.ftsFilters) {
    q = applyFilter(q, f);
  }

   // 3.5) not-only filters (nếu bạn muốn xử lý riêng các filter chỉ có notOp, không có operator)
  for (const f of B.notFilters) {
    if (!f.operator) {
      const notV = normalizeValue(f.value, f.notOp);
      q = q.not(f.field, f.notOp as any, notV);
    }
  }


    // basic text search
  if (params.q && params.q.trim()) {
    const search = params.q.trim();
    q = q.ilike("name", `%${search}%`).or(`order_code.ilike.%${search}%`);
  }

  if (params.status) {
    q = q.eq("status", params.status);
  }


  // sorting
  if (params.sort && params.sort.length > 0) {
    params.sort.forEach(s => {
      if (s.field) {
        q = q.order(s.field, { ascending: s.dir === "asc" });
      }
    });
  }

  const { data, error, count } = await q.range(offset, offset + limit - 1);
  if (error) throw error;
  
  return {
    data: data.map((item: any) => ({
      ...item,
      labels: item.labels ?? []
    })) as Order[],
    pagination: {
      page,
      pageSize: limit,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  }
}

export async function create(input: OrderCreateDTO & {user_id: string}): Promise<Order> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_order", { p_order: input});
    if (error) throw error;
    return data as Order;
}

export async function update(input: Partial<OrderUpdateDTO>): Promise<Order> {
    const supabase = await createClient();
    // sử dụng RPC để gọi hàm cập nhật
    const { data, error } = await supabase.rpc("update_order", { p_order: input });
    if (error) throw error;
    return data as Order;
}

export async function del(id: string): Promise<void> {
    const supabase = await createClient();

    // Thực hiện xoá mềm (soft delete) bằng cách cập nhật trường deleted_at
    // khi đơn hàng được tạo không quá 45 ngày
    const nowIso = new Date().toISOString();
    const cutoffIso = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
        .from("orders")
        .update({ deleted_at: nowIso })
        .eq("id", id)
        .is("deleted_at", null)    // chưa bị xóa
        .gte("created_at", cutoffIso)
        .select("id, deleted_at");  // cần select để nhận về error nếu không có hàng nào bị ảnh hưởng
    
    if (error) throw error;
    if (!data || data.length === 0) {
        throw new Error("Order not found or cannot be deleted (older than 45 days)");
    }
    return;
}

export async function getById(id: string): Promise<Order | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();
        
    if (error) throw error;
    return data as Order;
}

export async function addLabel(orderId: string, labelId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("orders_labels")
        .upsert(
          { order_id: orderId, label_id: labelId },
          { onConflict: 'order_id,label_id', ignoreDuplicates: true }
        );
    if (error) throw error;
}

export async function removeLabel(orderId: string, labelId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("orders_labels")
        .delete()
        .eq("order_id", orderId)
        .eq("label_id", labelId);
        
    if (error) throw error;
}