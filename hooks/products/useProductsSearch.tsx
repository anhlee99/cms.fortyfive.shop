"use client";
import * as React from "react";
import { ProductSearchParams } from "@/services/products/product.type";
import {
  DEFAULT_SEARCH,
  toQuery,
  getSearchParamsFromSearchParams,
} from "@/types/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DEFAULT_PRODUCT_SEARCH: Required<
  Pick<ProductSearchParams, "page" | "limit">
> &
  ProductSearchParams = {
  ...DEFAULT_SEARCH,
  q: undefined,
  status: undefined,
};

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
    return getSearchParamsFromSearchParams<ProductSearchParams>(sp);
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
