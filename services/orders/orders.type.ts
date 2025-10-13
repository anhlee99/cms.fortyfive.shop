import { SearchParams } from "@/types/pagination";
import { t } from "i18next";

export type OrderStatus = {
  id: string;
  name: string;
  index: number;
  is_completed: boolean;
  extra_info: Record<string, any>;
};

export type OrderStatusCreateDTO = {
  id?: string;
  name: string;
  index: number;
  is_completed: boolean;
  extra_info?: Record<string, any>;
};

export type Order = {
  id: string;
  user_id: string;
  agent_id: string;
  created_at: string;
  deleted_at: string | null;
  shop_id: string;
  customer_id: string;
  order_code: string;
  delivery_info: Record<string, any>[];
  status: OrderStatus;
  order_status_id: string;
  draft_amount: number;
  discount_pre_tax: number;
  vat_oder_amount: number;
  delivery_fee: number;
  vat_delivery: number;
  vat_delivery_amount: number;
  discount_after_tax: number;
  amount_payable: number;
  extra_info: Record<string, any>[];
};

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
};

export type OrderProductCreateDTO = {
  product_id: string;
  import_price: number;
  sell_price: number;
  quantity: number;
  vat: number;
};

export type OrderCreateDTO = {
  agent_id: string;
  shop_id: string;
  customer_id: string;
  order_code: string;
  delivery_info: Record<string, any>[];
  status?: OrderStatus;
  order_status_id: string;
  draft_amount: number;
  discount_pre_tax: number;
  vat_order_amount: number;
  delivery_fee: number;
  vat_delivery: number;
  vat_delivery_amount: number;
  discount_after_tax: number;
  amount_payable: number;
  extra_info: Record<string, any>[];
  products: OrderProductCreateDTO[];
};

export type OrderUpdateDTO = Partial<OrderCreateDTO> & {
  id: string;
};

export interface OrderSearchParams extends SearchParams {
  order_status_id?: string;
}
