"use client";
import * as React from "react";
import { ProductSearchParams } from "@/services/products/product.type";
import { DEFAULT_SEARCH, toQuery } from "@/types/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DEFAULT_PRODUCT_SEARCH: Required<
  Pick<ProductSearchParams, "page" | "limit">
> &
  ProductSearchParams = {
  ...DEFAULT_SEARCH,
  q: undefined,
  status: undefined,
};

function oneOf<T extends string | undefined>(
  v: string | null,
  allowed: readonly T[],
  fallback: T
): T {
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function coerceInt(v: string | null, fb: number) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fb;
}

function parseJson<T>(v: string | null): T | undefined {
  if (!v) return undefined;
  try {
    return JSON.parse(v) as T;
  } catch {
    return undefined;
  }
}

export function normalizeSearch(
  p: ProductSearchParams = {}
): ProductSearchParams {
  return {
    ...DEFAULT_PRODUCT_SEARCH,
    ...p,
    page:
      typeof p.page === "number" && p.page > 0
        ? p.page
        : DEFAULT_PRODUCT_SEARCH.page,
    limit:
      typeof p.limit === "number" && p.limit > 0 && p.limit <= 100
        ? p.limit
        : DEFAULT_PRODUCT_SEARCH.limit,
    status: p.status ?? DEFAULT_PRODUCT_SEARCH.status,
  };
}

export function useProductSearchUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const params = React.useMemo<ProductSearchParams>(() => {
    return {
      q: (sp.get("q") || undefined)?.trim(),
      page: coerceInt(sp.get("page"), DEFAULT_PRODUCT_SEARCH.page),
      limit: coerceInt(sp.get("limit"), DEFAULT_PRODUCT_SEARCH.limit),
      sort:
        parseJson<ProductSearchParams["sort"]>(sp.get("sort")) ??
        DEFAULT_PRODUCT_SEARCH.sort,
      filters:
        parseJson<ProductSearchParams["filters"]>(sp.get("filters")) ??
        DEFAULT_PRODUCT_SEARCH.filters,
    };
  }, [sp]);

  const setParams = React.useCallback(
    (
      patch: Partial<ProductSearchParams>,
      opts?: { replace?: boolean; scroll?: boolean }
    ) => {
      const next: ProductSearchParams = { ...params, ...patch };
      console.log(next);
      const url = `${pathname}${toQuery(next)}`;
      opts?.replace ?? true
        ? router.replace(url, { scroll: opts?.scroll ?? false })
        : router.push(url, { scroll: opts?.scroll ?? false });
    },
    [params, pathname, router]
  );

  const resetParams = React.useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { params, setParams, resetParams };
}
