import { SearchParams } from "@/types/pagination";
import { Label } from "../labels/label.type";

export type Product = {
  id: string;
  user_id: string;
  created_at: string;
  product_code: string;
  name: string;
  short_description: string;
  description: string;
  thumbnail: string;
  gallery?: GalleryItem[];
  import_price: number;
  vat: number; // percentage
  sell_price: number;
  display_price: number;
  labels?: Label[]; // Array of label objects
};

export interface GalleryItem {
  url: string;
  name: string;
  mimeType: string;
}

export interface GalleryItemFile {
  id: string;
  file: File;
  previewUrl: string;
}

export type ProductCreateDTO = {
  agent_id?: string;
  product_code: string;
  name: string;
  short_description: string;
  description: string;
  thumbnail: string;
  gallery?: GalleryItem[];
  import_price: number;
  vat: number; // percentage
  sell_price: number;
  display_price: number;
  label_ids: string[]; // Array of label IDs
};

export interface ProductFormType
  extends Omit<ProductCreateDTO, "thumbnail" | "gallery"> {
  // Ghi đè kiểu dữ liệu cho các trường hình ảnh
  thumbnail: File | null;
  gallery: File[] | null;
}

export type ProductUpdateDTO = Required<ProductCreateDTO> & {
  id: string;
};

export interface ProductSearchParams extends SearchParams {}
