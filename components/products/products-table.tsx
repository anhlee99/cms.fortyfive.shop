// @/components/products/products-table.tsx
"use client";

import type { Product } from "@/services/products/product.type";
import { DataTable } from "@/components/widgets/data_table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterOption, PaginatedResponse } from "@/types/pagination";
import { useProductSearchUrl } from "@/hooks/products/useProductsSearch";
import { useState, useEffect } from "react";
import { LabelSelect } from "../labels/label-select-2";

const columns = [
  {
    id: "select",
    header: ({ table }: any) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: any) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => {
          e.stopPropagation(); // prevent row click
          row.getToggleSelectedHandler()(e);
        }}
        onClick={(e) => e.stopPropagation()} // optional but safe
      />
    ),
  },
  {
    accessorKey: "product_code",
    header: "Mã Sản Phẩm",
    cell: ({ row }: any) => (
      <div className="cursor-pointer hover:underline">
        {row.getValue("product_code")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }: any) => (
      <div className="cursor-pointer hover:underline">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "short_description",
    header: "Mô Tả",
    cell: ({ row }: any) => (
      <div className="max-w-xs truncate cursor-pointer hover:underline">
        {row.getValue("short_description")}
      </div>
    ),
  },
  {
    accessorKey: "import_price",
    header: () => (
      <Button variant="ghost" className="px-0" onClick={() => {}}>
        Giá nhập
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }: any) => (
      <div className="cursor-pointer hover:underline">
        ${row.getValue("import_price").toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "sell_price",
    header: () => (
      <Button variant="ghost" className="px-0" onClick={() => {}}>
        Giá bán
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }: any) => (
      <div className="cursor-pointer hover:underline">
        ${row.getValue("sell_price").toFixed(2)}
      </div>
    ),
  },
  {
    id: "profit_percent",
    header: "Giá lời",
    cell: ({ row }: any) => {
      const importPrice = Number(row.getValue("import_price"));
      const sellPrice = Number(row.getValue("sell_price"));

      if (!importPrice || isNaN(importPrice)) return <div>-</div>;

      const profitPercent = ((sellPrice - importPrice) / importPrice) * 100;

      const color =
        profitPercent > 0
          ? "text-green-600"
          : profitPercent < 0
          ? "text-red-600"
          : "text-gray-500";

      return (
        <div className={`cursor-pointer hover:underline ${color}`}>
          {profitPercent.toFixed(2)}%
        </div>
      );
    },
  },
];

export default function ProductsTable({
  data,
  isLoading,
  onRowClick,
  onCreateClick,
}: {
  data: PaginatedResponse<Product> | undefined;
  isLoading: boolean;
  onRowClick: (product: Product) => void;
  onCreateClick: () => void;
}) {
  const [page, setPage] = useState(data?.pagination.page || 1);
  const [pageSize, setPageSize] = useState(data?.pagination.pageSize || 10);
  const { params, setParams } = useProductSearchUrl();
  useEffect(() => {
    if (!data) return;
    setPage(data.pagination.page ?? 1);
  }, [data]);

  if (!data) return <div className="skeleton-card"></div>;

  return (
    <div>
      <DataTable
        data={data.data}
        columns={columns}
        initialColumns={[
          "select",
          "product_code",
          "name",
          "short_description",
          "import_price",
          "sell_price",
          "profit_percent",
        ]}
        page={page}
        setPage={(e) => {
          setPage(e);
          setParams({ page: e as number });
        }}
        pageSize={pageSize}
        setPageSize={(e) => {
          setPageSize(e);
          setParams({ limit: e });
        }}
        totalPages={data.pagination.totalPages}
        totalVendor={data.pagination.totalItems}
        loading={isLoading}
        onRowClick={onRowClick}
        customToolbar={() => (
          <div className="flex items-center gap-2 w-full">
            <Input placeholder="Tìm kiếm..." className="max-w-sm flex-1" />
            <LabelSelect
              value={
                params.filters?.find((f) => f.field === "labels")?.value
                  ? (
                      params.filters?.find((f) => f.field === "labels")
                        ?.value as string
                    ).split(",")
                  : []
              }
              onValueChange={(newLabels) => {
                setPage(1);

                let filters = params.filters || [];
                if (newLabels.length > 0) {
                  // Remove existing label filter if any
                  filters = filters.filter((f) => f.field !== "labels");
                  // Add new label filter
                  filters.push({
                    field: "labels",
                    operator: "in",
                    value: newLabels.join(","),
                  } as FilterOption);
                } else {
                  // Clear label filter if none selected
                  filters = filters.filter((f) => f.field !== "labels");
                }

                setParams({ page: 1, filters: filters });
              }}
              placeholder="Tìm kiếm theo thẻ"
              className="flex gap-2 w-50"
              labelPosition="bottom"
            />

            <Button className="ml-auto" onClick={onCreateClick}>
              Tạo sản phẩm
            </Button>
          </div>
        )}
      />
    </div>
  );
}
