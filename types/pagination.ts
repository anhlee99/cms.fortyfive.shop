
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
type FilterOperator =
  | "eq" | "neq" | "lt" | "lte" | "gt" | "gte"
  | "like" | "ilike" | "in" | "is" | "fts" | "plfts" | "phfts";


export interface SortOption {
  field?: string;
  dir?: SortDir;
}

export interface FilterOption {
    value: string;
    field: string;
    operator?: FilterOperator;
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
export type NormalizedSearchParams =
  Omit<SearchParams, "page" | "limit" | "sort" | "filters"> & {
    page: number;
    limit: number;
    sort: Required<SortOption>[];
    filters: Required<FilterOption>[];
  };

export const DEFAULT_SEARCH: NormalizedSearchParams = {
  page: 1,
  limit: 10,
  sort: [{field:"created_at",dir:"desc"}],
  filters: [],
};

export function getSearchParamsFromUrl<T extends object = {}>(
  url: string,
  parseExtras?: (sp: URLSearchParams) => T
): SearchParams & T {
  const sp = new URL(url).searchParams;

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
  // Supports: sort[field]=asc and ignores other keys.
  sp.forEach((value, key) => {
    const sortMatch = key.match(/^sort\[(.+?)\]$/);
    if (sortMatch) {
      const field = sortMatch[1];
      const dir = value.toLowerCase() as SortDir;
      if (dir === "asc" || dir === "desc") {
        (params.sort ??= []).push({ field, dir });
      }
    }
  });

  // --- Robust filter parsing ---
  // Supports:
  //   filter[field]=value
  //   filter[field][value]=value
  //   filter[field][operator]=eq|neq|...
  // We aggregate via a map so order doesn't matter.
  const filterMap = new Map<
    string,
    { value?: string; operator?: FilterOperator }
  >();

  sp.forEach((value, key) => {
    // filter[field]=value   OR   filter[field][value]=value
    let m = key.match(/^filter\[(.+?)\](?:\[value\])?$/);
    if (m) {
      const field = m[1];
      const f = filterMap.get(field) ?? {};
      f.value = value;
      filterMap.set(field, f);
      return;
    }
    // filter[field][operator]=op
    m = key.match(/^filter\[(.+?)\]\[operator\]$/);
    if (m) {
      const field = m[1];
      const f = filterMap.get(field) ?? {};
      const op = value as FilterOperator;
      f.operator = op;
      filterMap.set(field, f);
    }
  });

  for (const [field, f] of filterMap) {
    if (typeof f.value === "string" && f.value.length > 0) {
      (params.filters ??= []).push({ field, value: f.value, operator: f.operator });
    }
  }

  // --- Optional extras ---
  const extras = (parseExtras ? parseExtras(sp) : {}) as T;

  // Intersection return
  return { ...params, ...extras } as SearchParams & T;
}