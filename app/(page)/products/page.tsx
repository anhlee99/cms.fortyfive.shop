// app/page.tsx
"use client";

import { useState } from "react";
import CreateProductForm from "@/components/products/create-product-form";

import {
  SidePanel,
  SidePanelContent,
  SidePanelDescription,
  SidePanelHeader,
  SidePanelTitle,
} from "@/components/ui/side_panel";
import { useProducts } from "@/hooks/products/useProduct";
import ProductsTable from "@/components/products/products-table";
import { Product } from "@/services/products/product.type";
import DetailAndUpdateProductForm from "@/components/products/DetailAndUpdateProductForm";

export default function Page() {
  const { data, isLoading, newProduct } = useProducts({
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setIsSidePanelOpen(true);
    console.log(product);
  };

  const handleCreateClick = () => {
    setSelectedProduct(null);
    setIsSidePanelOpen(true);
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="@container/main p-10">
      <SidePanel onOpenChange={setIsSidePanelOpen} open={isSidePanelOpen}>
        <ProductsTable
          data={data}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          onCreateClick={handleCreateClick}
        />

        <SidePanelContent>
          <SidePanelHeader>
            <SidePanelTitle>
              {selectedProduct ? "Chi tiết sản phẩm" : "Tạo sản phẩm mới"}
            </SidePanelTitle>
            <SidePanelDescription>
              {selectedProduct
                ? "Xem và cập nhật thông tin sản phẩm"
                : "Nhập thông tin cho sản phẩm"}
            </SidePanelDescription>
          </SidePanelHeader>

          {selectedProduct ? (
            <DetailAndUpdateProductForm
              product={selectedProduct}
              onUpdate={() => {}}
              onClose={handleCancelEdit}
              onSuccess={() => {
                console.log("Product updated successfully!");
              }}
              onError={(message) => {
                console.error(message);
              }}
            />
          ) : (
            <CreateProductForm
              onCreate={(product) => newProduct(product)}
              onClose={() => setIsSidePanelOpen(false)}
              onSuccess={() => {
                console.log("Product created successfully!");
              }}
              onError={(message) => {
                console.error(message);
              }}
            />
          )}
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
