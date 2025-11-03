"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  value,
  placeholder,
  searchPlaceholder = "Tìm kiếm...",
  className,
  disabled,
}: LabelSelectProps) {
  const { data } = useLabels();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const labels: Label[] = useMemo(() => data?.data ?? [], [data]);

  const filteredLabels = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return labels;
    return labels.filter((l) => l.display_name.toLowerCase().includes(q));
  }, [labels, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (labelId: string) => {
    // Nếu thẻ đã được chọn (tồn tại trong value), thì bỏ chọn
    if (value.includes(labelId)) {
      onValueChange(value.filter((id) => id !== labelId));
    } else {
      // Nếu chưa được chọn, thì thêm vào (chọn)
      onValueChange([...value, labelId]);
    }
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const removeLabel = (labelId: string) => {
    onValueChange(value.filter((id) => id !== labelId));
  };

  return (
    <div className={cn("relative text-sm text-gray-800", className)}>
      {/* Input area */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 px-3 py-2 cursor-text overflow-y-auto bg-white",
          "rounded-md border border-gray-300 min-h-[44px] max-h-[150px]",
          "focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition",
          "shadow-sm"
        )}
        onClick={() => {
          if (!disabled) {
            // Đơn giản hóa thành toggle
            setIsOpen((prev) => !prev);
            // Focus vào input sau khi toggle mở
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }}
      >
        {value.length === 0 && (
          <span className="text-gray-500">{placeholder}</span>
        )}
        {value.map((id) => {
          const label = labels.find((l) => l.id === id);
          return label ? (
            <div
              key={id}
              // className="flex items-center px-2 py-1 rounded-md text-xs"
              className="flex items-center px-2 py-1 rounded-md text-xs font-semibold border border-gray-300"
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
                  removeLabel(id);
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

      {/* Dropdown section */}
      {isOpen && (
        <div
          ref={dropdownRef}
          // className="w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
          className="w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 absolute left-0 right-0 top-full"
        >
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
            {filteredLabels.length > 0 ? (
              filteredLabels.map((label) => (
                <div
                  key={label.id}
                  className={cn(
                    "flex items-center px-2 py-1 mx-2 my-1 rounded-md cursor-pointer hover:bg-gray-100",
                    value.includes(label.id) &&
                      "bg-gray-100 font-medium border border-gray-500"
                  )}
                  onClick={() => handleSelect(label.id)}
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
            ) : (
              <div className="px-3 py-2 text-gray-500">Không tìm thấy thẻ</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
