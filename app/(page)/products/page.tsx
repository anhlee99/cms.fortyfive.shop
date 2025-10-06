"use client";

import CreateProductForm from "@/components/products/create-product-form";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  SidePanel,
  SidePanelContent,
  SidePanelDescription,
  SidePanelHeader,
  SidePanelTitle,
  SidePanelTrigger,
} from "@/components/ui/side_panel";
import { DataTable } from "@/components/widgets/data_table";
import { Product } from "@/services/products/product.type";
import { ArrowUpDown } from "lucide-react";

import { useState } from "react";

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

const data: Product[] = [
  {
    id: "prod-001",
    user_id: "user-123",
    created_at: "2023-10-01T10:00:00Z",
    product_code: "PC-001",
    name: "Wireless Headphones",
    short_description: "Noise-cancelling over-ear headphones",
    description:
      "High-quality wireless headphones with 30-hour battery life and Bluetooth 5.0.",
    thumbnail: "https://example.com/images/headphones-thumb.jpg",
    gallery: [
      { url: "https://example.com/images/headphones-1.jpg", alt: "Side view" },
      { url: "https://example.com/images/headphones-2.jpg", alt: "Top view" },
    ],
    import_price: 150.0,
    vat: 10,
    sell_price: 200.0,
    display_price: 220.0,
  },
  {
    id: "prod-002",
    user_id: "user-123",
    created_at: "2023-10-02T12:00:00Z",
    product_code: "PC-002",
    name: "Smartphone Case",
    short_description: "Protective case for iPhone 14",
    description: "Durable TPU case with shock absorption and raised edges.",
    thumbnail: "https://example.com/images/case-thumb.jpg",
    gallery: [
      { url: "https://example.com/images/case-1.jpg", alt: "Front view" },
    ],
    import_price: 10.0,
    vat: 8,
    sell_price: 15.0,
    display_price: 16.2,
  },
  {
    id: "prod-003",
    user_id: "user-456",
    created_at: "2023-10-03T14:00:00Z",
    product_code: "PC-003",
    name: "Laptop Stand",
    short_description: "Adjustable aluminum stand for better ergonomics",
    description:
      "Folds flat, supports up to 15kg, compatible with 10-17 inch laptops.",
    thumbnail: "https://example.com/images/stand-thumb.jpg",
    // gallery omitted (optional)
    import_price: 25.0,
    vat: 10,
    sell_price: 35.0,
    display_price: 38.5,
  },
  {
    id: "prod-004",
    user_id: "user-456",
    created_at: "2023-10-04T16:00:00Z",
    product_code: "PC-004",
    name: "USB-C Hub",
    short_description: "7-in-1 multi-port adapter",
    description:
      "Includes HDMI, SD card reader, Ethernet, and USB ports for MacBook.",
    thumbnail: "https://example.com/images/hub-thumb.jpg",
    gallery: [
      { url: "https://example.com/images/hub-1.jpg", alt: "Ports view" },
      { url: "https://example.com/images/hub-2.jpg", alt: "Connected view" },
    ],
    import_price: 20.0,
    vat: 5,
    sell_price: 30.0,
    display_price: 31.5,
  },
  {
    id: "prod-005",
    user_id: "user-123",
    created_at: "2023-10-05T18:00:00Z",
    product_code: "PC-005",
    name: "Wireless Mouse",
    short_description: "Ergonomic mouse with customizable buttons",
    description:
      "Bluetooth connectivity, rechargeable battery, DPI up to 8000.",
    thumbnail: "https://example.com/images/mouse-thumb.jpg",
    import_price: 18.0,
    vat: 10,
    sell_price: 25.0,
    display_price: 27.5,
  },
];

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalVendor = data.length;
  const totalPages = Math.ceil(totalVendor / pageSize);
  const loading = false;
  return (
    <div className="@container/main p-10">
      <SidePanel>
        <div>
          <DataTable
            data={data}
            columns={columns}
            initialColumns={["select", "status", "email", "actions"]}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalVendor={totalVendor}
            loading={loading}
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

        {/* Button to open the panel */}

        {/* Panel content */}
        <SidePanelContent>
          <SidePanelHeader>
            <SidePanelTitle>Tạo sản phẩm mới</SidePanelTitle>
            <SidePanelDescription>
              Nhập thông tin cho sản phẩm
            </SidePanelDescription>
          </SidePanelHeader>

          <CreateProductForm
            onClose={() => {}}
            onSuccess={() => {}}
            onError={() => {}}
          />
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
