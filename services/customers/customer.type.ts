import { SearchParams } from "@/types/pagination";

export type Customer = {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
}

export type CustomerCreateDTO = {
    user_id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    birthday?: string;
}

export type CustomerUpdateDTO = Partial<CustomerCreateDTO> & {
    id: string;
}

export interface CustomerSearchParams extends SearchParams {}
