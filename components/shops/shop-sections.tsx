"use client";

import * as React from "react";
import { useShops } from "@/hooks/shops/useShops";
import {type Shop } from "@/services/shops/shop.type";
import ShopFilter from "./shop-filter";
import ShopsTable from "./shops-table";

export default function ShopSections() {
    const { data, isLoading } = useShops(); // uses SWR key /api/shops?params
    return (
        <div>
            <ShopFilter/>
            <ShopsTable shops={data?.data as Shop[] || []}
                isLoading={isLoading}
            />
        </div>
    );
}
