"use client";

import * as React from "react";
import ShopsTable from "./shops-table";
import { useShops } from "@/hooks/shops/useShops";
import {type Shop } from "@/services/shops/shop.type";
import ShopFilter from "./shop-filter";

export default function ShopSections({ initial }: { initial: Shop[] }) {
    const { data, isLoading } = useShops(); // uses SWR key /api/shops
    return (
        <div>
            <ShopFilter/>
            <ShopsTable shops={data?.data as Shop[] || initial}
                isLoading={isLoading}
            />
        </div>
    );
}
