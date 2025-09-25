"use client";

import type { Shop } from "@/services/shops/shop.type";

export default function ShopsTable({ shops, isLoading }: { shops: Shop[]; isLoading: boolean }) {
    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                {isLoading ? (
                    <tbody>
                        <tr>
                            <td colSpan={2} className="tw-text-center">Loading...</td>
                        </tr>
                    </tbody>
                ) : shops.length === 0 ? (
                    <tbody>
                        <tr>
                            <td colSpan={2} className="tw-text-center">No shops found.</td>
                        </tr>
                    </tbody>
                ) : null}
                <tbody>
                    {shops.map((shop) => (
                        <tr key={shop.id}>
                            <td>{shop.id}</td>
                            <td>{shop.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}   