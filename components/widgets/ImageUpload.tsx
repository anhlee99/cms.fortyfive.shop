"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IconUpload, IconX } from "@tabler/icons-react";

interface ImageUploadProps {
  fieldName: string;
  previewImage: string | null;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  handleRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageSelect: (file: File) => void;
  label?: string;
  dragText?: string;
}

export function ImageUpload({
  fieldName,
  previewImage,
  isDragging,
  setIsDragging,
  handleRemoveImage,
  fileInputRef,
  onImageSelect,
  label,
  dragText = "Kéo thả hoặc nhấn để chọn hình ảnh",
}: ImageUploadProps) {
  const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        toast.error("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, JPEG).", {
          duration: 3000,
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Hình ảnh không được vượt quá 10MB.", { duration: 3000 });
        return;
      }
      onImageSelect(file);
    } else {
      toast.error("Vui lòng chọn một file hình ảnh hợp lệ.", {
        duration: 3000,
      });
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Label htmlFor={fieldName} className="text-foreground font-medium mb-2">
        {label}
      </Label>
      <AnimatePresence>
        {previewImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-60 rounded-lg overflow-hidden border-2 border-border shadow-sm"
          >
            <Image
              src={previewImage}
              alt={`${label} preview`}
              fill
              className="object-contain object-center"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 p-1 rounded-full bg-destructive/80 text-white hover:bg-destructive"
              onClick={handleRemoveImage}
            >
              <IconX className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
              "relative flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-colors h-60",
              isDragging ? "border-primary bg-primary/10" : "border-border",
              "hover:border-primary hover:bg-primary/5 cursor-pointer"
            )}
          >
            <Input
              type="file"
              name={fieldName}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onImageSelect(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
              ref={fileInputRef}
            />
            <IconUpload
              className={cn(
                "w-8 h-8 mb-2",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
            <p className="text-sm text-foreground font-medium">
              {isDragging ? "Thả hình ảnh vào đây" : dragText}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              (Hỗ trợ JPG, PNG, tối đa 10MB)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
