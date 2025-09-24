"use client";

import type { Shop } from "@/services/shops/shop.type";

export default function ShopsTable({ shops }: { shops: Shop[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
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