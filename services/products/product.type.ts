import { SearchParams } from "@/types/pagination";

export type Product = {
    id: string;
    user_id: string;
    created_at: string;
    product_code: string;
    name: string;
    short_description: string;
    description: string;
    thumbnail: string;
    gallery?: Record<string, any>[];
    import_price: number;
    vat: number; // percentage
    sell_price: number;
    display_price: number; 
}

export type ProductCreateDTO = {
    product_code: string;
    name: string;
    short_description: string;
    description: string;
    thumbnail: string;
    gallery?: Record<string, any>[];
    import_price: number;
    vat: number; // percentage
    sell_price: number;
    display_price: number; 
}

export type ProductUpdateDTO = Partial<ProductCreateDTO> & {
    id: string;
}

export interface ProductSearchParams extends SearchParams {}
