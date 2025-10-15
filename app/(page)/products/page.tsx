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
import DetailAndUpdateProductForm from "@/components/products/detail-update-product-form";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "@/components/products/product-card";

export default function Page() {
  const { data, isLoading, newProduct, updateProduct } = useProducts({
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
  const isFormDirtyRef = useRef<boolean>(false);
  const isMobile = useIsMobile();

  const setFormDirty = (isDirty: boolean) => {
    isFormDirtyRef.current = isDirty;
  };

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
    isFormDirtyRef.current = false;
  };

  const handleCancelDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
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

  const renderForms = () => {
    if (selectedProduct) {
      return (
        <DetailAndUpdateProductForm
          product={selectedProduct}
          onUpdate={(p) => {
            updateProduct(selectedProduct.id, p)
              .then(() => {
                console.log("Product updated:", p);
                setSelectedProduct({ ...selectedProduct, ...p });
              })
              .catch((error) => {
                console.error("Error updating product:", error);
              });
          }}
          onClose={handleCancelEdit}
          onSuccess={() => {
            console.log("Product updated successfully!");
          }}
          onError={(message) => {
            console.error(message);
          }}
        />
      );
    } else {
      return (
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
          setFormDirty={setFormDirty}
        />
      );
    }
  };

  const renderHeader = () => (
    <>
      <SidePanelTitle>
        {selectedProduct ? "Chi tiết sản phẩm" : "Tạo sản phẩm mới"}
      </SidePanelTitle>
      <SidePanelDescription>
        {selectedProduct
          ? "Xem và cập nhật thông tin sản phẩm"
          : "Nhập thông tin cho sản phẩm"}
      </SidePanelDescription>
    </>
  );

  return (
    <div className="@container/main p-10">
      {/* Desktop: SidePanel */}
      {!isMobile ? (
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
          {isSidePanelOpen && (
            <SidePanelContent>
              <SidePanelHeader>{renderHeader()}</SidePanelHeader>
              {renderForms()}
            </SidePanelContent>
          )}
        </SidePanel>
      ) : (
        /* Mobile: Product Cards */
        <ProductCard
          data={data}
          onRowClick={handleRowClick}
          onCreateClick={handleCreateClick}
        />
      )}

      {isMobile && isSidePanelOpen && (
        <DialogPrimitive.Root
          open={true}
          onOpenChange={() => setIsSidePanelOpen(false)}
        >
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
              className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
              onClick={() => setIsSidePanelOpen(false)}
            />
            <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col max-h-full">
              <div className="bg-white rounded-t-lg flex flex-col h-full max-h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedProduct
                        ? "Chi tiết sản phẩm"
                        : "Tạo sản phẩm mới"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedProduct
                        ? "Xem và cập nhật thông tin sản phẩm"
                        : "Nhập thông tin cho sản phẩm"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAttemptClose(isFormDirtyRef.current)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>

                <div className="flex-1 overflow-auto p-4">{renderForms()}</div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}

      <DialogPrimitive.Root
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 max-w-[400px] w-full bg-white p-6 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
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
