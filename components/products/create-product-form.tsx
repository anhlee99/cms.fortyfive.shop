"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconLoader } from "@tabler/icons-react";
import { ImageUpload } from "../widgets/ImageUpload";
import { toast } from "sonner";
import { ProductCreateDTO } from "@/services/products/product.type";

interface CreateProductFormProps {
  onCreate: (product: ProductCreateDTO) => void;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export default function CreateProductForm({
  onCreate,
  onClose,
  onSuccess,
  onError,
}: CreateProductFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductCreateDTO>({
    defaultValues: {
      product_code: "",
      name: "",
      short_description: "",
      description: "",
      thumbnail: "",
      gallery: [],
      import_price: 0,
      vat: 0,
      sell_price: 0,
      display_price: 0,
    },
    resolver: async (data) => {
      const errors: any = {};
      if (!data.product_code.trim())
        errors.product_code = { message: "Mã sản phẩm không được để trống." };
      if (!data.name.trim())
        errors.name = { message: "Tên sản phẩm không được để trống." };
      if (!data.short_description.trim())
        errors.short_description = {
          message: "Mô tả ngắn không được để trống.",
        };
      if (!data.description.trim())
        errors.description = { message: "Mô tả chi tiết không được để trống." };
      // if (!data.thumbnail)
      //   errors.thumbnail = { message: "Ảnh thumbnail không được để trống." };
      if (isNaN(data.import_price) || data.import_price < 0)
        errors.import_price = { message: "Giá nhập phải là số không âm." };
      if (isNaN(data.vat) || data.vat < 0 || data.vat > 100)
        errors.vat = { message: "VAT phải là số từ 0 đến 100." };
      if (isNaN(data.sell_price) || data.sell_price < 0)
        errors.sell_price = { message: "Giá bán phải là số không âm." };
      if (isNaN(data.display_price) || data.display_price < 0)
        errors.display_price = { message: "Giá hiển thị phải là số không âm." };
      return {
        values: Object.keys(errors).length ? {} : data,
        errors,
      };
    },
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

  const handleImageSelect = (file: File, fieldName: string) => {
    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận tệp JPG hoặc PNG.");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Hình ảnh không được vượt quá 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        if (fieldName === "thumbnail") {
          setValue("thumbnail", reader.result as string);
          setThumbnailPreview(reader.result as string);
        } else if (fieldName === "gallery") {
          setValue("gallery", [
            ...(control._formValues.gallery || []),
            { url: reader.result, name: file.name },
          ]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setValue("thumbnail", "");
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const onSubmit = async (data: ProductCreateDTO) => {
    setIsLoading(true);
    try {
      // Simulate API call to create product
      // Replace with actual API call
      console.log("Form data:", data);
      onCreate(data);
      if (onSuccess) {
        onSuccess("Tạo sản phẩm thành công!");
        onClose();
      }
    } catch (err) {
      console.error(err);
      if (onError) {
        onError("Có lỗi xảy ra khi tạo sản phẩm.");
      }
      // toast.error("Có lỗi xảy ra khi tạo sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Card className="w-full bg-transparent border-0 shadow-none py-0 gap-0">
      <CardHeader className="bg-transparent p-0" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8 py-0 max-h-[580px] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="product_code"
                  className="text-gray-800 font-medium pb-2"
                >
                  Mã sản phẩm <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="product_code"
                  {...register("product_code")}
                  placeholder="Nhập mã sản phẩm"
                  className={`text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.product_code ? "border-red-500" : ""
                  }`}
                />
                {errors.product_code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.product_code.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="name"
                  className="text-gray-800 font-medium pb-2"
                >
                  Tên sản phẩm <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Nhập tên sản phẩm"
                  className={`text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="short_description"
                  className="text-gray-800 font-medium pb-2"
                >
                  Mô tả ngắn <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="short_description"
                  {...register("short_description")}
                  placeholder="Nhập mô tả ngắn"
                  className={`text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.short_description ? "border-red-500" : ""
                  }`}
                />
                {errors.short_description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.short_description.message}
                  </p>
                )}
              </div>
              <div className="col-span-full">
                <Label
                  htmlFor="description"
                  className="text-gray-800 font-medium pb-2"
                >
                  Mô tả chi tiết <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Nhập mô tả chi tiết"
                  className={`text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="import_price"
                  className="text-gray-800 font-medium pb-2"
                >
                  Giá nhập <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="import_price"
                  type="number"
                  step="0.01"
                  {...register("import_price", { valueAsNumber: true })}
                  placeholder="Nhập giá nhập"
                  className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.import_price ? "border-red-500" : ""
                  }`}
                />
                {errors.import_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.import_price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="vat" className="text-gray-800 font-medium pb-2">
                  VAT (%) <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="vat"
                  type="number"
                  step="0.01"
                  {...register("vat", { valueAsNumber: true })}
                  placeholder="Nhập VAT"
                  className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.vat ? "border-red-500" : ""
                  }`}
                />
                {errors.vat && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vat.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="sell_price"
                  className="text-gray-800 font-medium pb-2"
                >
                  Giá bán <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="sell_price"
                  type="number"
                  step="0.01"
                  {...register("sell_price", { valueAsNumber: true })}
                  placeholder="Nhập giá bán"
                  className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.sell_price ? "border-red-500" : ""
                  }`}
                />
                {errors.sell_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sell_price.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="display_price"
                  className="text-gray-800 font-medium pb-2"
                >
                  Giá hiển thị <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="display_price"
                  type="number"
                  step="0.01"
                  {...register("display_price", { valueAsNumber: true })}
                  placeholder="Nhập giá hiển thị"
                  className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-gray-800 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
                    errors.display_price ? "border-red-500" : ""
                  }`}
                />
                {errors.display_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.display_price.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Hình ảnh sản phẩm
            </h3>
            <div>
              <ImageUpload
                fieldName="thumbnail"
                previewImage={thumbnailPreview}
                isDragging={isDraggingThumbnail}
                setIsDragging={setIsDraggingThumbnail}
                handleRemoveImage={handleRemoveThumbnail}
                fileInputRef={thumbnailInputRef}
                onImageSelect={(file) => handleImageSelect(file, "thumbnail")}
                label="Ảnh Thumbnail"
                dragText="Kéo và thả hoặc nhấn để chọn ảnh thumbnail"
              />
            </div>
          </div>
        </CardContent>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 rounded-md border-gray-300 text-gray-800 hover:bg-gray-200 transition-colors shadow-sm"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:from-[var(--color-primary)]/90 hover:to-[var(--color-accent)]/90 transition-all duration-200 flex items-center gap-2 shadow-md"
          >
            {isLoading && (
              <IconLoader className="h-5 w-5 animate-spin text-white" />
            )}
            Tạo mới
          </Button>
        </div>
      </form>
    </Card>
  );
}
