"use client";

import * as React from "react";
import { useShops } from "@/hooks/shops/useShops";
import { useTranslation } from "react-i18next";

export default function ShopCreate() {
    const { t } = useTranslation("common");
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
                placeholder={t("pages.shop/new.form.name")}
                className="tw-border tw-p-2 tw-rounded"
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="tw-bg-blue-500 tw-text-white tw-py-2 tw-rounded disabled:tw-bg-gray-400"
            >
                {loading ? t("pages.shop/new.form.creating") : t("pages.shop/new.form.btn_create")}
            </button>

            {error && <p className="tw-text-red-500">{error}</p>}
        </form>
    );
}