import type {
  Product,
  ProductCreateDTO,
  ProductSearchParams,
  ProductUpdateDTO,
} from "./product.type";
import { createClient } from "@/lib/supabase/server";
import {
  PaginatedResponse,
  OP_MAP,
  FilterOption,
  FilterOperator,
  FilterNotOperator,
} from "@/types/pagination";

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
    else if (op === "fts" || op === "plfts" || op === "phfts")
      B.ftsFilters.push(f);
    // else if (op === "cs" || op === "cd" || op === "ov") B.jsonArrayFilters.push(f);
    else if (f.notOp) B.notFilters.push(f);
    else B.baseFilters.push(f);
  }
  return B;
}

function normalizeValue(val: any, op?: FilterOperator | FilterNotOperator) {
  if (op === "in") {
    if (Array.isArray(val)) return val;
    return String(val)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (op === "is") {
    if (val === "null" || val === null) return null;
    if (val === "true") return true;
    if (val === "false") return false;
  }
  // cố gắng parse number
  if (typeof val === "string" && /^-?\d+(\.\d+)?$/.test(val))
    return Number(val);
  // cố gắng parse JSON array/object nếu trông giống
  if (typeof val === "string" && /^[\[\{].*[\]\}]$/.test(val)) {
    try {
      return JSON.parse(val);
    } catch {}
  }
  return val;
}

function applyFilter(q: any, f: FilterOption) {
  const op = (f.operator ?? "eq") as keyof typeof OP_MAP;
  const v = normalizeValue(f.value, op);

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

export async function list(
  params: ProductSearchParams
): Promise<PaginatedResponse<Product>> {
  const supabase = await createClient();
  const B = bucketize(params.filters);

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 && params.limit <= 100 ? params.limit : 20;
  const offset = (page - 1) * limit;

  // SELECT string: LEFT by default
  let selectLeft = `
    *,
    products_labels ( label_id ),
    labels:products_labels ( labels ( * ) )
  `;
  let selectInner = `
    *,
    products_labels!inner ( label_id ),
    labels:products_labels ( labels ( * ) )
  `;

  // Chọn LEFT hay INNER tuỳ có label filter
  let q = supabase
    .from("products")
    .select(B.labelFilters.length ? selectInner : selectLeft, {
      count: "exact",
    });

  // 3.1) labelFilters: ánh xạ sang bảng join
  for (const f of B.labelFilters) {
    const op = (f.operator ?? "eq") as FilterOperator;
    const v = normalizeValue(f.value, op);

    if (op === "in") {
      q = q.in("products_labels.label_id", Array.isArray(v) ? v : [String(v)]);
    } else if (f.notOp) {
      q = q.not(
        "products_labels.label_id",
        f.notOp as any,
        normalizeValue(f.value, f.notOp)
      );
    } else {
      q = q.eq("products_labels.label_id", v);
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
    q = q.ilike("name", `%${search}%`).or(`product_code.ilike.%${search}%`);
  }

  // sorting
  if (params.sort && params.sort.length > 0) {
    params.sort.forEach((s) => {
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
      labels: item.labels ?? [],
    })) as Product[],
    pagination: {
      page,
      pageSize: limit,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function create(input: ProductCreateDTO): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_product", {
    p_product: input,
  });
  if (error) throw error;
  return data as Product;
}

export async function update(
  id: string,
  input: Partial<ProductUpdateDTO>
): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_product", {
    p_product: { id, ...input },
  });
  if (error) throw error;
  return data as Product;
}

export async function del(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function getById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function addLabel(
  productId: string,
  labelId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products_labels")
    .upsert(
      { product_id: productId, label_id: labelId },
      { onConflict: "product_id,label_id", ignoreDuplicates: true }
    );
  if (error) throw error;
}

export async function removeLabel(
  productId: string,
  labelId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products_labels")
    .delete()
    .eq("product_id", productId)
    .eq("label_id", labelId);

  if (error) throw error;
}
