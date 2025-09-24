"use client";

import ShopsTable from "./shops-table";
import { useShops } from "@/hooks/useShops";
import type { Shop } from "@/services/shops/shop.type";

export default function ShopSections({ initial }: { initial: Shop[] }) {
    const { shops, isLoading } = useShops(); // uses SWR key /api/shops
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <ShopsTable shops={shops || initial} />;
}
