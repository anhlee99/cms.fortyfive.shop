"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/services/products/product.type";
import { FilterOption, PaginatedResponse } from "@/types/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LabelSelect } from "../labels/label-select-2";
import { useProductSearchUrl } from "@/hooks/products/useProductsSearch";
import { ArrowUpDown } from "lucide-react";

interface ProductCardProps {
  data?: PaginatedResponse<Product>;
  onCreateClick?: () => void;
  onRowClick: (product: Product) => void;
}

const fallbackData: PaginatedResponse<Product> = {
  data: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

export default function ProductCard({
  data = fallbackData,
  onCreateClick,
  onRowClick,
}: ProductCardProps) {
  const [products, setProducts] = useState<Product[]>(data.data);
  const [page, setPage] = useState(data.pagination.page);
  const [pageSize, setPageSize] = useState(data.pagination.pageSize);
  const { params, setParams } = useProductSearchUrl();

  const [searchTerm, setSearchTerm] = useState(params.q || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setParams({ q: searchTerm, page: 1 });
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    setProducts(data.data);
    setPage(data.pagination.page);
  }, [data]);

  const calculateProfitPercent = (importPrice: number, sellPrice: number) => {
    if (!importPrice || isNaN(importPrice)) return 0;
    const profitPercent = ((sellPrice - importPrice) / importPrice) * 100;
    return profitPercent;
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  const currentImportPriceSort = params.sort?.find(
    (s) => s.field === "import_price"
  )?.dir;

  const currenSellPricetSort = params.sort?.find(
    (s) => s.field === "sell_price"
  )?.dir;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 w-full">
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm..."
            className="max-w-sm flex-1 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                filters = filters.filter((f) => f.field !== "labels");
                filters.push({
                  field: "labels",
                  operator: "in",
                  value: newLabels.join(","),
                } as FilterOption);
              } else {
                filters = filters.filter((f) => f.field !== "labels");
              }

              setParams?.({ page: 1, filters: filters });
            }}
            placeholder="Tìm kiếm theo thẻ"
          />
          <div className="flex space-x-4">
            {" "}
            <Button
              variant="outline"
              onClick={() => {
                const newDir =
                  currentImportPriceSort === "asc" ? "desc" : "asc";
                setParams({
                  sort: [{ field: "import_price", dir: newDir }],
                  page: 1,
                });
              }}
            >
              Giá nhập
              <ArrowUpDown />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const newDir = currenSellPricetSort === "asc" ? "desc" : "asc";
                setParams({
                  sort: [{ field: "sell_price", dir: newDir }],
                  page: 1,
                });
              }}
            >
              Giá bán
              <ArrowUpDown />
            </Button>
          </div>
          <Button className="ml-auto mt-auto" onClick={onCreateClick}>
            Tạo sản phẩm
          </Button>
        </div>
      </div>
      {paginatedProducts.length > 0 ? (
        paginatedProducts.map((product, index) => {
          const profitPercent = calculateProfitPercent(
            product.import_price,
            product.sell_price
          );
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    ${product.sell_price.toFixed(2)}
                  </h3>
                  <p className="text-sm text-gray-500">Giá bán</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profitPercent >= 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {profitPercent.toFixed(2)}%
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Mã sản phẩm:</span>{" "}
                  {product.product_code}
                </p>
                <p>
                  <span className="font-medium">Tên:</span> {product.name}
                </p>
                <p className="max-w-xs truncate">
                  <span className="font-medium">Mô tả:</span>{" "}
                  {product.short_description}
                </p>
                <p>
                  <span className="font-medium">Giá nhập:</span> $
                  {product.import_price.toFixed(2)}
                </p>
              </div>
              <Button
                variant={"default"}
                className="w-full mt-4"
                onClick={() => onRowClick(product)}
              >
                Xem chi tiết sản phẩm
              </Button>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">
          Không có sản phẩm nào để hiển thị.
        </p>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Số sản phẩm/trang:
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(v: string) => {
              setPageSize(Number(v));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100, 200].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            Đầu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground font-semibold">
            Trang {page} /{" "}
            {data.pagination.totalPages > 0 ? data.pagination.totalPages : 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.totalPages}
          >
            Sau
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(data.pagination.totalPages)}
            disabled={page === data.pagination.totalPages}
          >
            Cuối
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Tổng cộng: {data.pagination.totalItems} sản phẩm
        </div>
      </div>
    </div>
  );
}
