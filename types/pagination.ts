
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

export interface SortOption {
  field?: string;
  dir?: 'asc' | 'desc';
}

export interface FilterOption {
    value: string;
    field: string;
    operator?: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'like' | 'ilike' | 'in' | 'is' | 'fts' | 'plfts' | 'phfts';
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
  limit: 20,
  sort: [{field:"created_at",dir:"desc"}],
  filters: [],
};

