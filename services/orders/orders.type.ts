import { SearchParams } from "@/types/pagination";
export type OrderStatus = "draft" | "wait_for_confirmation" | "in_processing" | "in_delivery" | "completed" | "canceled" | "canceled_by_customer";

export type Order = {
    id: string;
    user_id: string;
    created_at: string;
    deleted_at: string | null;
    shop_id: string;
    customer_id: string;
    order_code: string;
    delivery_info: Record<string, any>[];
    status: OrderStatus;
    draft_amount: number;
    discount_pre_tax: number;   
    vat_oder_amount: number;
    delivery_fee: number; 
    vat_delivery: number; 
    vat_delivery_amount: number; 
    discount_after_tax: number;
    amount_payable: number; 
    extra_info: Record<string, any>[];
}

export type OrderProduct = {
    id: string;
    order_id: string;
    product_id: string;
    product_info: Record<string, any>;
    import_price: number;
    quantity: number;
    sell_price: number;
    draft_amount: number;
    vat: number;   
    vat_amount: number;
    amount_payable: number;
}

export type OrderProductCreateDTO = {
    product_id: string;
    import_price: number;
    sell_price: number;
    quantity: number;
    vat: number;
}

export type OrderCreateDTO = {
    shop_id: string;
    customer_id: string;
    order_code: string;
    delivery_info: Record<string, any>[];
    status?: OrderStatus;
    draft_amount: number;
    discount_pre_tax: number;   
    vat_oder_amount: number;
    delivery_fee: number; 
    vat_delivery: number; 
    vat_delivery_amount: number; 
    discount_after_tax: number;
    amount_payable: number; 
    extra_info: Record<string, any>[];
    products: OrderProductCreateDTO[];
}

export type OrderUpdateDTO = Partial<OrderCreateDTO> & {
    id: string;
}

export interface OrderSearchParams extends SearchParams {
    status?: OrderStatus;
}
