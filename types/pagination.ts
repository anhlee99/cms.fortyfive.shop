
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
  label?: string;
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


