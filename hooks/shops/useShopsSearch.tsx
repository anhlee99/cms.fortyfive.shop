"use client";
import * as React from "react";
import { ShopSearchParams, ShopStatus } from "@/services/shops/shop.type";
import { DEFAULT_SEARCH, toQuery } from "@/types/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DEFAULT_SHOP_SEARCH: Required<Pick<ShopSearchParams, "page"|"limit">> & ShopSearchParams = {
  ...DEFAULT_SEARCH,
  q: undefined,
  status: undefined,
};

function oneOf<T extends string|undefined>(v: string | null, allowed: readonly T[], fallback: T): T {
  return (v && (allowed as readonly string[]).includes(v)) ? (v as T) : fallback;
}

function coerceInt(v: string | null, fb: number) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fb;
}

function parseJson<T>(v: string | null): T | undefined {
  if (!v) return undefined;
  try { return JSON.parse(v) as T; } catch { return undefined; }
}

export function normalizeSearch(p: ShopSearchParams = {}): ShopSearchParams {
  return {
    ...DEFAULT_SHOP_SEARCH,
    ...p,
    page: typeof p.page === "number" && p.page > 0 ? p.page : DEFAULT_SHOP_SEARCH.page,
    limit: typeof p.limit === "number" && p.limit > 0 && p.limit <= 100 ? p.limit : DEFAULT_SHOP_SEARCH.limit,
    status: p.status ?? DEFAULT_SHOP_SEARCH.status,
  };
}

export function useShopSearchUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const params = React.useMemo<ShopSearchParams>(() => {
    return {
      q: (sp.get("q") || undefined)?.trim(),
      page: coerceInt(sp.get("page"), DEFAULT_SHOP_SEARCH.page),
      limit: coerceInt(sp.get("limit"), DEFAULT_SHOP_SEARCH.limit),
      sort: parseJson<ShopSearchParams["sort"]>(sp.get("sort")) ?? DEFAULT_SHOP_SEARCH.sort,
      filters: parseJson<ShopSearchParams["filters"]>(sp.get("filters")) ?? DEFAULT_SHOP_SEARCH.filters,
      status: oneOf(sp.get("status"), ["active", "inactive"], undefined ) as ShopStatus,
    };
  }, [sp]);

  const setParams = React.useCallback(
    (patch: Partial<ShopSearchParams>, opts?: { replace?: boolean; scroll?: boolean }) => {
      const next: ShopSearchParams = { ...params, ...patch };
      const url = `${pathname}${toQuery(next)}`;
      (opts?.replace ?? true)
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