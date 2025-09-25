"use client";
import * as React from "react";
import { ShopStatus } from "@/services/shops/shop.type";
import { useShopSearchUrl } from "@/hooks/shops/useShopsSearch";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";


export default function ShopFilter() {
  const { params, setParams, resetParams } = useShopSearchUrl();

  const [q, setQ] = React.useState(params.q ?? "");
  React.useEffect(() => setQ(params.q ?? ""), [params.q]);
  const applyQ = useDebouncedCallback((value: string) => {
    setParams({ q: value || undefined, page: 1 }); // reset page on new query
  }, 350);

  return (
    <div className="tw-flex tw-flex-wrap tw-items-end tw-gap-3">
      <div className="tw-flex tw-flex-col">
        <label className="tw-text-sm">Search</label>
        <input
          className="tw-rounded-xl tw-border tw-px-3 tw-py-2"
          placeholder="Shop name…"
          value={q}
          onChange={(e) => { const v = e.target.value; setQ(v); applyQ(v); }}
        />
      </div>

      <div className="tw-flex tw-flex-col">
        <label className="tw-text-sm">Status</label>
        <select
          className="tw-rounded-xl tw-border tw-px-3 tw-py-2"
          value={params.status ?? ""}
          onChange={(e) =>
            setParams({
              status: e.target.value as ShopStatus || undefined,
              page: 1,
            })
          }
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="tw-flex tw-flex-col">
        <label className="tw-text-sm">Limit</label>
        <input
          type="number"
          className="rounded-xl border px-3 py-2 w-28"
          value={params.limit ?? 20}
          min={1}
          max={100}
          onChange={(e) => setParams({ limit: Number(e.target.value) || 20, page: 1 })}

        />
      </div>
        <button
        className="rounded-2xl border px-4 py-2"
        onClick={() => resetParams()}
      >
        Reset
      </button>

      {/* <button onClick={apply} className="tw-rounded-2xl tw-border tw-px-4 tw-py-2 tw-shadow-sm">
        Apply
      </button>
      <button onClick={reset} className="tw-rounded-2xl tw-border tw-px-4 tw-py-2">
        Reset
      </button> */}
    </div>
  );
}