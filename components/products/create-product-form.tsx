"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconLoader } from "@tabler/icons-react";
import {
  ProductCreateDTO,
  GalleryItem,
} from "@/services/products/product.type";
import { Textarea } from "../ui/textarea";
import { ImageManyUploads } from "../widgets/ImageManyUploads";
import { LabelSelect } from "../labels/label-select";
import { formatPrice } from "@/hooks/utils/formatPrice";
import { ImageUpload } from "../widgets/ImageUpload";

interface CreateProductFormProps {
  onCreate: (product: ProductCreateDTO) => void;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onAttemptClose: (isDirty: boolean) => void;
}

export default function CreateProductForm({
  onCreate,
  onClose,
  onSuccess,
  onError,
  onAttemptClose,
}: CreateProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductCreateDTO>({
    defaultValues: {
      product_code: "",
      name: "",
      short_description: "",
      description: "",
      thumbnail: "",
      gallery: [],
      import_price: 0,
      vat: undefined,
      sell_price: 0,
      label_ids: [],
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
      if (isNaN(data.import_price) || data.import_price <= 0)
        errors.import_price = { message: "Giá nhập phải là số hợp lệ." };
      if (isNaN(data.vat) || data.vat < 0 || data.vat > 100)
        errors.vat = { message: "VAT phải là số từ 0 đến 100." };
      if (isNaN(data.sell_price) || data.sell_price <= 0)
        errors.sell_price = { message: "Giá bán phải là số hợp lệ." };
      if (data.label_ids.length === 0)
        errors.label_ids = { message: "Vui lòng chọn ít nhất một thẻ." };
      const hasErrors = Object.keys(errors).length > 0;
      return {
        values: hasErrors ? {} : data,
        errors,
      };
    },
  });

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [galleryPreviews, setGalleryPreviews] = useState<GalleryItem[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // watch values (stable references from react-hook-form)
  const sellPrice = watch("sell_price");
  const importPrice = watch("import_price");

  // use watch values in state initializers
  const [displayImportPrice, setDisplayImportPrice] = useState<string>(
    formatPrice(importPrice || 0)
  );
  const [displaySellPrice, setDisplaySellPrice] = useState<string>(
    formatPrice(sellPrice || 0)
  );

  useEffect(() => {
    setDisplayImportPrice(formatPrice(importPrice || 0));
    setDisplaySellPrice(formatPrice(sellPrice || 0));
  }, [importPrice, sellPrice]);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "import_price" | "sell_price"
  ) => {
    const rawValue = e.target.value.replace(/,/g, "");
    setValue(field, rawValue ? parseFloat(rawValue) : 0);
    if (field === "import_price") {
      setDisplayImportPrice(formatPrice(rawValue));
    } else {
      setDisplaySellPrice(formatPrice(rawValue));
    }
  };

  const margin =
    importPrice > 0
      ? (((sellPrice - importPrice) / importPrice) * 100).toFixed(2)
      : "0.00";

  const handleGalleryFilesSelect = (files: File[]) => {
    const newGalleryItems: GalleryItem[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          newGalleryItems.push({
            url: reader.result as string,
            name: file.name,
            mimeType: file.type,
          });
          if (newGalleryItems.length === files.length) {
            const updatedGallery = [...galleryPreviews, ...newGalleryItems];
            setGalleryPreviews(updatedGallery);
            setValue("gallery", updatedGallery);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setThumbnailPreview(reader.result as string);
        setValue("thumbnail", reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview(null);
    setValue("thumbnail", "");
  };

  const handleRemoveGalleryItem = (index: number) => {
    const updatedGallery = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(updatedGallery);
    setValue("gallery", updatedGallery);
  };

  const onSubmit = async (data: ProductCreateDTO) => {
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onAttemptClose(isDirty);
  };

  return (
    <Card className="w-full bg-transparent border-0 shadow-none py-0 gap-0">
      <CardHeader className="bg-transparent p-0" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8 pt-0 pb-5 max-h-[70vh] overflow-y-auto">
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
              <div className="col-span-full">
                <Label
                  htmlFor="short_description"
                  className="text-gray-800 font-medium pb-2"
                >
                  Mô tả ngắn <span className="text-red-600">*</span>
                </Label>
                <Textarea
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
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Nhập mô tả chi tiết"
                  className={`text-gray-800 h-[100px] border-gray-300 focus:ring-orange-500 focus:ring-2 ${
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
                  type="text"
                  value={displayImportPrice}
                  onChange={(e) => handlePriceChange(e, "import_price")}
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
                <Label
                  htmlFor="sell_price"
                  className="text-gray-800 font-medium pb-2"
                >
                  Giá bán <span className="text-red-600">*</span>
                </Label>
                {sellPrice > 0 && importPrice > 0 && (
                  <span
                    className={`text-xs ml-1 ${
                      Number(margin) > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    Tỷ lệ chênh: {margin}%
                  </span>
                )}

                <Input
                  id="sell_price"
                  type="text"
                  value={displaySellPrice}
                  onChange={(e) => handlePriceChange(e, "sell_price")}
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
                <Label htmlFor="vat" className="text-gray-800 font-medium pb-2">
                  VAT (%) <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="vat"
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("vat", { valueAsNumber: true })}
                  placeholder="Nhập VAT"
                  className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-gray-800 h-11 border-gray-300 focus:ring-orange-500 focus:ring-2 ${
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
                <Label htmlFor="vat" className="text-gray-800 font-medium pb-2">
                  Thẻ <span className="text-red-600">*</span>
                </Label>
                <LabelSelect
                  value={watch("label_ids")}
                  onValueChange={(value) => setValue("label_ids", value)}
                  placeholder="Chọn thẻ"
                  className="w-full"
                />
                {errors.label_ids && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.label_ids.message}
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
                onImageSelect={handleThumbnailSelect}
                label="Hình ảnh thumbnail"
                dragText="Kéo và thả hoặc nhấn để chọn hình ảnh thumbnail"
              />
            </div>
            <div>
              <ImageManyUploads
                fieldName="gallery"
                previews={galleryPreviews}
                isDragging={isDraggingGallery}
                setIsDragging={setIsDraggingGallery}
                onFilesSelect={handleGalleryFilesSelect}
                onRemove={handleRemoveGalleryItem}
                fileInputRef={galleryInputRef}
                label="Thư viện ảnh và video"
                dragText="Kéo và thả hoặc nhấn để chọn ảnh hoặc video"
              />
            </div>
          </div>
        </CardContent>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 rounded-md border-gray-300 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant={"default"}
            disabled={isLoading}
            className="px-6 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:from-[var(--color-primary)]/90 hover:to-[var(--color-accent)]/90 transition-all duration-200 flex items-center gap-2"
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
