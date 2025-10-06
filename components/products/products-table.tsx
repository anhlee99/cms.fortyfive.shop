"use client";

import type { Product } from "@/services/products/product.type";
import { DataTable } from "@/components/widgets/data_table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidePanelTrigger } from "@/components/ui/side_panel";
import { PaginatedResponse } from "@/types/pagination";
import { useProductSearchUrl } from "@/hooks/products/useProductsSearch";
import { useState } from "react";
import React from "react";

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
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "product_code",
    header: "Mã Sản Phẩm",
    cell: ({ row }: any) => <div>{row.getValue("product_code")}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }: any) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "short_description",
    header: "Mô Tả",
    cell: ({ row }: any) => (
      <div className="max-w-xs truncate">
        {row.getValue("short_description")}
      </div>
    ),
  },
  {
    accessorKey: "import_price",
    header: () => {
      return (
        <Button variant="ghost" className="px-0" onClick={() => {}}>
          Giá nhập
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }: any) => (
      <div>${row.getValue("import_price").toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "sell_price",
    header: () => {
      return (
        <Button variant="ghost" className="px-0" onClick={() => {}}>
          Giá bán
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }: any) => <div>${row.getValue("sell_price").toFixed(2)}</div>,
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

      return <div className={color}>{profitPercent.toFixed(2)}%</div>;
    },
  },

  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Mở menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Sao chép mã ID thanh toán
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Xem khách hàng</DropdownMenuItem>
  //           <DropdownMenuItem>Xem chi tiết thanh toán</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export default function ProductsTable({
  data,
  isLoading,
}: {
  data: PaginatedResponse<Product> | undefined;
  isLoading: boolean;
}) {
  const [page, setPage] = useState(data?.pagination.page || 1);
  const [pageSize, setPageSize] = useState(data?.pagination.pageSize || 10);
  const { setParams } = useProductSearchUrl();

  // Sau đó xử lý logic điều kiện bằng effect hoặc if dùng giá trị state
  React.useEffect(() => {
    if (!data) return;
    setPage(data.pagination.page ?? 1);
  }, [data]);

  // tạo skeleton khi loading
  if (!data || isLoading) return <div className="skeleton-card"></div>;

  return (
    <div>
      <DataTable
        data={data.data}
        columns={columns}
        initialColumns={["select", "status", "email", "actions"]}
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
        customToolbar={() => (
          <div className="flex items-center gap-2 w-full">
            <Input placeholder="Tìm kiếm..." className="max-w-sm flex-1" />
            <SidePanelTrigger asChild>
              <Button className="ml-auto">Tạo sản phẩm</Button>
            </SidePanelTrigger>
          </div>
        )}
      />
    </div>
  );
}
