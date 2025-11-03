"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconLoader } from "@tabler/icons-react";
import {
  Product,
  ProductFormType,
  GalleryItemFile,
} from "@/services/products/product.type";
import { Textarea } from "../ui/textarea";
import { ImageManyUploads } from "../widgets/ImageManyUploads";
import { LabelSelect } from "../labels/label-select";
import { formatPrice } from "@/hooks/utils/formatPrice";
import { ImageUpload } from "../widgets/ImageUpload";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface CreateProductFormProps {
  onCreate: (product: ProductFormType) => Promise<Product>;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onAttemptClose: (isDirty: boolean) => void;
  setFormDirty: (isDirty: boolean) => void;
}

export default interface ProductPayloadFile {
  thumbnail: File | null;
  gallery: File[] | null;
}

export default function CreateProductForm({
  onCreate,
  onSuccess,
  onError,
  onAttemptClose,
  setFormDirty,
}: CreateProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormType>({
    defaultValues: {
      product_code: "",
      name: "",
      short_description: "",
      description: "",
      thumbnail: null,
      gallery: null,
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
      // if (!data.short_description.trim())
      //   errors.short_description = {
      //     message: "Mô tả ngắn không được để trống.",
      //   };
      // if (!data.description.trim())
      //   errors.description = { message: "Mô tả chi tiết không được để trống." };
      if (isNaN(data.import_price))
        errors.import_price = { message: "Giá nhập phải là số hợp lệ." };
      if (isNaN(data.vat) || data.vat < 0 || data.vat > 100)
        errors.vat = { message: "VAT phải là số từ 0 đến 100." };
      if (isNaN(data.sell_price))
        errors.sell_price = { message: "Giá bán phải là số hợp lệ." };
      // if (data.label_ids.length === 0)
      //   errors.label_ids = { message: "Vui lòng chọn ít nhất một thẻ." };

      return {
        values: data,
        errors,
      };
    },
  });

  // Dùng useEffect để reset trạng thái dirty sau khi form mount
  useEffect(() => {
    // Gọi reset với các giá trị hiện tại, và đặt isDirty về false
    reset(watch(), { keepValues: true, keepDirty: false });
    // Dòng này chỉ chạy 1 lần sau khi mount
  }, [reset, watch]);

  useEffect(() => {
    setFormDirty(isDirty);
  }, [isDirty, setFormDirty]);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [galleryPreviews, setGalleryPreviews] = useState<GalleryItemFile[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [galleryFiles] = useState<File[]>([]);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

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
    const newItems: GalleryItemFile[] = [];
    const newFiles: File[] = [...galleryFiles]; // Bắt đầu với files cũ (nếu dùng state)

    files.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      const newItem: GalleryItemFile = {
        id: crypto.randomUUID(), // Tạo ID duy nhất cho mỗi item
        file: file,
        previewUrl: previewUrl,
      };
      newItems.push(newItem);
      newFiles.push(file); // Thêm file gốc
    });

    // 1. Cập nhật state preview
    setGalleryPreviews((prev) => [...prev, ...newItems]);

    // 2. Lưu MẢNG File gốc vào form
    setValue("gallery", newFiles);
    // setGalleryFiles(newFiles); // (Nếu dùng state)
  };

  const handleThumbnailSelect = (file: File | undefined) => {
    if (!file) {
      setThumbnailPreview(null);
      setValue("thumbnail", null); // Xóa File khỏi form
      // setThumbnailFile(null); // (Nếu dùng state)
      return;
    }

    // 1. Tạo URL xem trước tạm thời
    const newPreviewUrl = URL.createObjectURL(file);

    // 2. Lưu đối tượng File vào form (để upload sau này)
    setValue("thumbnail", file);

    // 3. Cập nhật state preview (để component hiển thị)
    setThumbnailPreview(newPreviewUrl);
    // setThumbnailFile(file); // (Nếu dùng state)
  };

  const handleRemoveThumbnail = () => {
    // 1. Thu hồi URL để tránh rò rỉ bộ nhớ
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    // 2. Xóa File khỏi form và reset preview
    setThumbnailPreview(null);
    setValue("thumbnail", null);
  };

  const handleRemoveGalleryItem = (itemId: string) => {
    setGalleryPreviews((prev) => {
      const itemToRemove = prev.find((item) => item.id === itemId);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl); // Thu hồi URL
      }
      const updatedPreviews = prev.filter((item) => item.id !== itemId);

      // 3. Cập nhật MẢNG File trong form/state sau khi xóa
      const updatedFiles = updatedPreviews.map((item) => item.file);
      setValue("gallery", updatedFiles);
      // setGalleryFiles(updatedFiles); // (Nếu dùng state)

      return updatedPreviews;
    });
  };

  const onSubmit = async (data: ProductFormType) => {
    setIsLoading(true);
    try {
      // Vì onCreate là hàm async/Promise, ta cần await nó
      await onCreate(data);

      // 2. Reset trạng thái form (BẮT BUỘC để isDirty = false)
      reset(data, {
        keepValues: true, // Giữ các giá trị đã nhập (hoặc reset về default nếu muốn)
        keepDirty: false, // <-- Đặt isDirty về false
      });

      if (onSuccess) {
        onSuccess("Tạo sản phẩm thành công!");
      }

      // Dùng toast cho thông báo thành công (tùy chọn)
      toast.success("Tạo sản phẩm thành công!", {
        duration: 3000,
        position: "top-right", // Đảm bảo Sonner được cấu hình để hỗ trợ vị trí này
      });
    } catch (err) {
      // --- PHẦN XỬ LÝ TOAST ERROR ---
      const errorMessage = getErrorMessage(err); // <-- Sử dụng hàm tiện ích

      // Hiển thị toast lỗi (rớt từ trên phải xuống)
      toast.error(errorMessage, {
        duration: 5000, // Hiển thị lâu hơn lỗi thành công
        position: "top-right", // Vị trí mong muốn: trên cùng bên phải
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    // Xử lý trường hợp đối tượng lỗi phức tạp từ fetch/http client
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return error.message;
    }
    return "Có lỗi không xác định xảy ra.";
  };

  const handleCancel = () => {
    onAttemptClose(isDirty);
  };

  return (
    <Card className="w-full bg-transparent border-0 shadow-none py-0 gap-0">
      <CardHeader className="bg-transparent p-0" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent
          className={cn(
            "space-y-8 pt-0 pb-5 overflow-y-auto",
            isMobile ? "max-h-[75vh]" : "max-h-[70vh]"
          )}
        >
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
                  Mô tả ngắn
                  {/* <span className="text-red-600">*</span> */}
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
                  Mô tả chi tiết
                  {/* <span className="text-red-600">*</span> */}
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
                  defaultValue={0}
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
                  Thẻ
                  {/* <span className="text-red-600">*</span> */}
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
