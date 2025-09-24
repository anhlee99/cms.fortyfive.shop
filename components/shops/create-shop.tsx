"use client";

import * as React from "react";
import { useShops } from "@/hooks/useShops";

export default function CreateShop() {
    const { newShop } = useShops(); // uses SWR key /api/shops
    const [name, setName] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await newShop({ 
                name,
                status: "active",
             });
            setName("");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tw-flex tw-flex-col tw-gap-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shop Name"
                className="tw-border tw-p-2 tw-rounded"
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="tw-bg-blue-500 tw-text-white tw-py-2 tw-rounded disabled:tw-bg-gray-400"
            >
                {loading ? "Creating..." : "Create Shop"}
            </button>

            {error && <p className="tw-text-red-500">{error}</p>}
        </form>
    );
}