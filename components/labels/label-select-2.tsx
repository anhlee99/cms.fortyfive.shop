"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { IconChevronDown } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Label } from "@/services/labels/label.type";
import { useLabels } from "@/hooks/labels/useLabel";

interface LabelSelectProps {
  onValueChange: (value: string[]) => void;
  value: string[];
  placeholder: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function LabelSelect({
  onValueChange,
  value = [],
  placeholder,
  searchPlaceholder = "Tìm kiếm...",
  className,
  disabled,
}: LabelSelectProps) {
  const { data, isLoading } = useLabels();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const labels: Label[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const filteredLabels = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return labels;
    return labels.filter((l) => l.display_name.toLowerCase().includes(q));
  }, [labels, searchTerm]);

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const close = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        close();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [isOpen]);

  const toggle = (id: string) => {
    const exists = (value || []).includes(id);
    const next = exists
      ? (value || []).filter((i) => i !== id)
      : [...(value || []), id];
    onValueChange(next);
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div
      className={cn("relative text-sm text-gray-800 min-w-[200px]", className)}
      ref={containerRef}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 px-3 py-2 cursor-text overflow-y-auto bg-white",
          "rounded-md border border-gray-200 min-h-[44px] max-h-[150px]",
          "focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition",
          "shadow-sm",
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        )}
        onClick={() => (isOpen ? close() : open())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value.length === 0 && (
          <span className="text-gray-500">{placeholder}</span>
        )}
        {value.map((id) => {
          const label = labels.find((l) => l.id === id);
          return label ? (
            <div
              key={id}
              className="flex items-center px-2 py-1 rounded-md text-xs"
              style={{
                backgroundColor: label.extra_info?.color + "20",
                color: label.extra_info?.color,
              }}
            >
              {label.extra_info?.icon && (
                <Image
                  src={label.extra_info.icon}
                  alt={`${label.display_name} icon`}
                  width={16}
                  height={16}
                  className="mr-1 h-4 w-4"
                  unoptimized
                />
              )}
              {label.display_name}
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(id);
                }}
                className="ml-2 h-4 w-4 p-0"
              >
                ×
              </Button>
            </div>
          ) : null;
        })}
        <IconChevronDown className="w-4 h-4 ml-auto text-gray-500" />
      </div>

      {isOpen && (
        <div className="w-full absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <div className="p-2">
            <Input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-2"
            />
          </div>
          <div className="max-h-60 pb-4 overflow-y-auto">
            {isLoading ? (
              <div className="px-3 py-2 text-gray-500">Đang tải...</div>
            ) : filteredLabels.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">Không tìm thấy thẻ</div>
            ) : (
              filteredLabels.map((label) => (
                <div
                  key={label.id}
                  className={cn(
                    "flex items-center px-2 py-1 mx-2 my-1 rounded-md cursor-pointer hover:bg-gray-100",
                    value.includes(label.id) && "bg-gray-100 font-medium"
                  )}
                  onClick={() => toggle(label.id)}
                >
                  {label.extra_info?.icon && (
                    <Image
                      src={label.extra_info.icon}
                      alt={`${label.display_name} icon`}
                      width={16}
                      height={16}
                      className="mr-1 h-4 w-4"
                      unoptimized
                    />
                  )}
                  <span>{label.display_name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
