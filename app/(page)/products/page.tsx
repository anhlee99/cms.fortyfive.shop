"use client";

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

export default function Page() {
  const { data, isLoading, newProduct } = useProducts();
  return (
    <div className="@container/main p-10">
      <SidePanel>
        {/* Button to open the panel */}
        <ProductsTable data={data} isLoading={isLoading} />

        {/* Panel content */}
        <SidePanelContent>
          <SidePanelHeader>
            <SidePanelTitle>Tạo sản phẩm mới</SidePanelTitle>
            <SidePanelDescription>
              Nhập thông tin cho sản phẩm
            </SidePanelDescription>
          </SidePanelHeader>

          <CreateProductForm
            onCreate={(e) => newProduct(e)}
            onClose={() => {}}
            onSuccess={() => {}}
            onError={() => {}}
          />
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
