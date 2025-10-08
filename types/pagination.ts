export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

type SortDir = "asc" | "desc";

export type FilterOperator =
  | "eq"
  | "neq"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "like"
  | "ilike"
  | "in"
  | "is"
  | "fts"
  | "plfts"
  | "phfts";

export type FilterNotOperator =
  | "eq"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "like"
  | "ilike";

export const OP_MAP = {
  eq: (q: any, f: string, v: any) => q.eq(f, v),
  neq: (q: any, f: string, v: any) => q.neq(f, v),
  lt: (q: any, f: string, v: any) => q.lt(f, v),
  lte: (q: any, f: string, v: any) => q.lte(f, v),
  gt: (q: any, f: string, v: any) => q.gt(f, v),
  gte: (q: any, f: string, v: any) => q.gte(f, v),
  like: (q: any, f: string, v: any) => q.ilike(f, `%${v}%`),
  ilike: (q: any, f: string, v: any) => q.ilike(f, `%${v}%`),
  in: (q: any, f: string, v: any) => (Array.isArray(v) ? q.in(f, v) : q),
  // add more operators as needed
  is: (q: any, f: string, v: any) => q.is(f, v), // null | true | false
  // not:  (q:any,f:string,v:any,op?:string) => q.not(f, op ?? "eq", v),
  // cs:   (q:any,f:string,v:any) => q.contains(f, v),         // array/json contains
  // cd:   (q:any,f:string,v:any) => q.containedBy(f, v),
  // ov:   (q:any,f:string,v:any) => q.overlaps(f, v),
  fts: (q: any, f: string, v: any) => q.textSearch(f, v, { type: "websearch" }),
  plfts: (q: any, f: string, v: any) => q.textSearch(f, v, { type: "plain" }),
  phfts: (q: any, f: string, v: any) => q.textSearch(f, v, { type: "phrase" }),
} as const;

export interface SortOption {
  field?: string;
  dir?: SortDir;
}

export interface FilterOption {
  value: string;
  field: string;
  operator?: FilterOperator;
  notOp?: FilterNotOperator;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  sort?: SortOption[];
  filters?: FilterOption[];
  q?: string;
  [key: string]: any; // for additional filters
}

// concrete type with required defaults applied
export type NormalizedSearchParams = Omit<
  SearchParams,
  "page" | "limit" | "sort" | "filters"
> & {
  page: number;
  limit: number;
  sort: Required<SortOption>[];
  filters: Required<FilterOption>[];
};

export const DEFAULT_SEARCH: NormalizedSearchParams = {
  page: 1,
  limit: 10,
  sort: [{ field: "created_at", dir: "desc" }],
  filters: [],
};

export function getSearchParamsFromSearchParams<T extends object = {}>(
  sp: URLSearchParams,
  parseExtras?: (sp: URLSearchParams) => T
): SearchParams & T {
  const page = Math.max(parseInt(sp.get("page") || "1", 10), 1);
  const limit = Math.max(parseInt(sp.get("limit") || "10", 10), 1);

  const params: SearchParams = {
    page,
    limit,
    sort: [],
    filters: [],
    q: sp.get("q") || undefined,
  };

  // --- Robust sort parsing ---
  // Supports: sort["<field>"]=<direction>.
  sp.forEach((value, key) => {
    const m = key.match(/^sort\[(.+?)\]$/);
    if (m) {
      const field = m[1];
      const dir = value === "asc" || value === "desc" ? value : "asc";
      params.sort?.push({ field, dir });
    }
  });

  if (params.sort && params.sort.length === 0) {
    params.sort = undefined; // will apply default later
  }

  // --- Robust filter parsing ---
  // Supports:
  //   filter[field]=value
  //   filter[field][value]=value
  //   filter[field][operator]=eq|neq|...
  //   filter[field][notOp]=eq|lt|lte|gt|gte|like|ilike
  // We aggregate via a map so order doesn't matter.
  const filterMap = new Map<
    string,
    { value?: string; operator?: FilterOperator; notOp?: FilterNotOperator }
  >();
  sp.forEach((value, rawKey) => {
    // ^filter[FIELD]( [value|operator|notOp] )?$
    const m = rawKey.match(
      /^filter\[([^\]]+)\](?:\[(value|operator|notOp)\])?$/
    );
    if (!m) return;

    const field = m[1]; // ví dụ: "name" | "labels"
    const part = m[2] as "value" | "operator" | "notOp" | undefined;

    const f = filterMap.get(field) ?? {};
    if (!part || part === "value") {
      f.value = value;
    } else if (part === "operator") {
      f.operator = value as FilterOperator;
    } else if (part === "notOp") {
      f.notOp = value as FilterNotOperator;
    }
    filterMap.set(field, f);
  });

  // Kết quả cuối:
  const filters = Array.from(filterMap, ([field, f]) => ({
    field,
    value: f.value!,
    operator: f.operator,
    notOp: f.notOp,
  })).filter((x) => x.value !== undefined && x.value !== "");

  if (filters.length > 0) {
    params.filters = filters;
  }

  // --- Optional extras ---
  const extras = (parseExtras ? parseExtras(sp) : {}) as T;

  // Intersection return
  return { ...params, ...extras } as SearchParams & T;
}

export function getSearchParamsFromUrl<T extends object = {}>(
  url: string,
  parseExtras?: (sp: URLSearchParams) => T
): SearchParams & T {
  const sp = new URL(url).searchParams;
  return getSearchParamsFromSearchParams(sp, parseExtras);
}

//Supports:
//   sort["<field>"]=<direction>.
//   filter[field]=value
//   filter[field][value]=value
//   filter[field][operator]=eq|neq|...
//   filter[field][notOp]=eq|lt|lte|gt|gte|like|ilike
export function toQuery<T extends SearchParams>(params: T | undefined): string {
  if (!params) return "";

  const qs = new URLSearchParams();

  // Scalars (page, limit, q, etc.)
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.q) qs.set("q", params.q);

  // Sort array → sort[field]=dir
  if (params.sort && Array.isArray(params.sort)) {
    for (const s of params.sort) {
      if (s?.field) {
        qs.set(`sort[${s.field}]`, s.dir ?? "asc");
      }
    }
  }

  // Filters array → filter[field][value], filter[field][operator], filter[field][notOp]
  if (params.filters && Array.isArray(params.filters)) {
    for (const f of params.filters) {
      if (!f?.field) continue;
      if (f.value !== undefined && f.value !== null && f.value !== "") {
        qs.set(`filter[${f.field}][value]`, String(f.value));
      }
      if (f.operator) qs.set(`filter[${f.field}][operator]`, f.operator);
      if (f.notOp) qs.set(`filter[${f.field}][notOp]`, f.notOp);
    }
  }

  // Any other extra props (not in SearchParams)
  Object.entries(params).forEach(([k, v]) => {
    if (["page", "limit", "q", "sort", "filters"].includes(k)) return;
    if (v === undefined || v === null || v === "") return;

    if (Array.isArray(v)) {
      v.forEach((val) => qs.append(k, String(val)));
    } else {
      qs.set(k, String(v));
    }
  });

  const s = qs.toString();
  return s ? `?${s}` : "";
}
