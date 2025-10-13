"use client";
import * as React from "react";
import { LabelSearchParams } from "@/services/labels/label.type";
import {
  DEFAULT_SEARCH,
  toQuery,
  getSearchParamsFromSearchParams,
} from "@/types/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DEFAULT_LABEL_SEARCH: LabelSearchParams = {
  ...DEFAULT_SEARCH,
  limit: 30,
  type: undefined,
  q: undefined,
};

export function normalizeSearch(p: LabelSearchParams = {}): LabelSearchParams {
  return {
    ...DEFAULT_LABEL_SEARCH,
    ...p,
    page:
      typeof p.page === "number" && p.page > 0
        ? p.page
        : DEFAULT_LABEL_SEARCH.page,
    limit:
      typeof p.limit === "number" && p.limit > 0 && p.limit <= 100
        ? p.limit
        : DEFAULT_LABEL_SEARCH.limit,
    type: p.type ?? DEFAULT_LABEL_SEARCH.type,
  };
}

export function useLabelSearchUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const params = React.useMemo<LabelSearchParams>(() => {
    return getSearchParamsFromSearchParams<LabelSearchParams>(sp);
  }, [sp]);

  const setParams = React.useCallback(
    (
      patch: Partial<LabelSearchParams>,
      opts?: { replace?: boolean; scroll?: boolean }
    ) => {
      const next: LabelSearchParams = { ...params, ...patch };
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
