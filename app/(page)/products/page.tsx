// app/page.tsx
"use client";

import { useState, useRef } from "react";
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
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const isFormDirtyRef = useRef<boolean>(false); // Track form dirty state

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

  const handleAttemptClose = (isDirty: boolean) => {
    isFormDirtyRef.current = isDirty;
    if (isDirty && !selectedProduct) {
      // Only show dialog for create form with changes
      setIsConfirmDialogOpen(true);
    } else {
      setIsSidePanelOpen(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleConfirmClose = () => {
    setIsSidePanelOpen(false);
    setIsConfirmDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleCancelDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleSidePanelOpenChange = (open: boolean) => {
    if (!open && isFormDirtyRef.current && !selectedProduct) {
      setIsConfirmDialogOpen(true);
    } else {
      setIsSidePanelOpen(open);
      if (!open) {
        setSelectedProduct(null);
        isFormDirtyRef.current = false;
      }
    }
  };

  return (
    <div className="@container/main p-10">
      <SidePanel
        onOpenChange={handleSidePanelOpenChange}
        open={isSidePanelOpen}
      >
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
              onClose={() => handleAttemptClose(isFormDirtyRef.current)}
              onAttemptClose={handleAttemptClose}
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

      <DialogPrimitive.Root
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 max-w-[400px] w-full bg-white p-6 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <DialogPrimitive.Title className="text-lg font-semibold">
              Xác nhận đóng
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-gray-500 mt-2">
              Bạn có chắc muốn đóng? Mọi thay đổi chưa lưu sẽ bị mất.
            </DialogPrimitive.Description>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleCancelDialog}
                className="px-4 py-2 rounded-md border-gray-300 text-gray-800 hover:bg-gray-200"
              >
                Hủy
              </Button>
              <Button
                variant="default"
                onClick={handleConfirmClose}
                className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
              >
                Xác nhận
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
