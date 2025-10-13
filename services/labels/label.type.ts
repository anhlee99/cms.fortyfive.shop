import { SearchParams } from "@/types/pagination";

export type LabelType =
  | "product_attribute"
  | "promotion_attribute"
  | "order_attribute"
  | undefined;

export interface Label {
  id: string;
  created_at: string;
  user_id: string;
  display_name: string;
  description: string;
  type: LabelType;
  extra_info?: Record<string, any>;
}

export interface CreateLabelDTO {
  agent_id: string;
  display_name: string;
  description?: string;
  type: LabelType;
  extra_info?: Record<string, any>;
}

export interface LabelSearchParams extends SearchParams {
  type?: LabelType;
}
