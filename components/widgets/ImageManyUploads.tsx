"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GalleryItem {
  url: string;
  name: string;
  mimeType: string;
}

interface ImageManyUploadsProps {
  fieldName: string;
  previews: GalleryItem[];
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  onFilesSelect: (files: File[]) => void;
  onRemove: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  label?: string;
  dragText?: string;
}

export function ImageManyUploads({
  fieldName,
  previews,
  isDragging,
  setIsDragging,
  onFilesSelect,
  onRemove,
  fileInputRef,
  label,
  dragText = "Kéo thả hoặc nhấn để chọn hình ảnh hoặc video",
}: ImageManyUploadsProps) {
  const VALID_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ];
  const isMobile = useIsMobile();

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
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        if (!VALID_TYPES.includes(file.type)) {
          toast.error(
            `File ${file.name} không hợp lệ. Chỉ chấp nhận JPG, PNG, JPEG, MP4, MOV, WEBM.`,
            { duration: 3000 }
          );
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} vượt quá 10MB.`, { duration: 3000 });
          return false;
        }
        return true;
      });
      onFilesSelect(validFiles);
    } else {
      toast.error("Vui lòng chọn file hợp lệ.", { duration: 3000 });
    }

    // ✅ Optional: reset file input (helps when user drops same file again)
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        if (!VALID_TYPES.includes(file.type)) {
          toast.error(
            `File ${file.name} không hợp lệ. Chỉ chấp nhận JPG, PNG, JPEG, MP4, MOV, WEBM.`,
            { duration: 3000 }
          );
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} vượt quá 10MB.`, { duration: 3000 });
          return false;
        }
        return true;
      });

      onFilesSelect(validFiles);

      // ✅ Reset input value so user can reselect same file type later
      e.target.value = "";
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
      <div
        className={cn(
          "flex",
          isMobile ? "flex-col space-y-4" : "flex-row space-x-4",
          "min-h-[300px]"
        )}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-colors h-auto text-center",
            isMobile ? "min-w-0 w-full" : "min-w-[300px] w-auto",
            isDragging ? "border-primary bg-primary/10" : "border-border",
            "hover:border-primary hover:bg-primary/5 cursor-pointer"
          )}
        >
          <Input
            type="file"
            name={fieldName}
            accept="image/*,video/*"
            multiple
            onChange={handleChange}
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
            {isDragging ? "Thả file vào đây" : dragText}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Hỗ trợ JPG, PNG, MP4, MOV, WEBM, tối đa 10MB mỗi file)
          </p>
        </div>
        <AnimatePresence>
          {previews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              {previews.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-border shadow-sm"
                >
                  {item.mimeType.startsWith("image/") ? (
                    <Image
                      src={item.url}
                      alt={`${item.name} preview`}
                      fill
                      className="object-cover"
                    />
                  ) : item.mimeType.startsWith("video/") ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                    />
                  ) : null}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 p-1 rounded-full w-5 h-5 bg-destructive/80 text-white hover:bg-destructive"
                    onClick={() => onRemove(index)}
                  >
                    <IconX className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
