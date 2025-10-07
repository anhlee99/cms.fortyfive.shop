"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Mock data for labels with icon as image URLs
const mockLabels: Label[] = [
  {
    id: "1",
    created_at: "2025-10-07",
    user_id: "user1",
    display_name: "Urgent",
    description: "High priority tasks",
    type: "SYSTEM",
    extra_info: {
      color: "#FF0000",
      icon: "https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png",
    },
  },
  {
    id: "2",
    created_at: "2025-10-07",
    user_id: "user1",
    display_name: "Bug",
    description: "Issues to fix",
    type: "SYSTEM",
    extra_info: {
      color: "#FFA500",
      icon: "https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png",
    },
  },
  {
    id: "3",
    created_at: "2025-10-07",
    user_id: "user1",
    display_name: "Feature",
    description: "New features",
    type: "CUSTOM",
    extra_info: {
      color: "#008000",
      icon: "https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png",
    },
  },
  {
    id: "4",
    created_at: "2025-10-07",
    user_id: "user1",
    display_name: "Urgent",
    description: "High priority tasks",
    type: "SYSTEM",
    extra_info: {
      color: "#FF0000",
      icon: "https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png",
    },
  },
  {
    id: "5",
    created_at: "2025-10-07",
    user_id: "user1",
    display_name: "Bug",
    description: "Issues to fix",
    type: "SYSTEM",
    extra_info: {
      color: "#FFA500",
      icon: "https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png",
    },
  },
  {
    id: "6",
    created_at: "2025-10-07",
    user_id: "user1",
    display_name: "Feature",
    description: "New features",
    type: "CUSTOM",
    extra_info: {
      color: "#008000",
      icon: "https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png",
    },
  },
];

interface Label {
  id: string;
  created_at: string;
  user_id: string;
  display_name: string;
  description: string;
  type: string;
  extra_info?: { color: string; icon: string };
}

interface LabelSelectProps {
  onValueChange: (value: string[]) => void;
  value: string[];
  placeholder: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  labelPosition?: "top" | "bottom";
}

export function LabelSelect({
  onValueChange,
  value,
  placeholder,
  searchPlaceholder = "Tìm kiếm...",
  className,
  disabled,
  labelPosition = "top",
}: LabelSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [labels] = useState<Label[]>(mockLabels);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter labels based on search term
  const filteredLabels = labels.filter((label) =>
    label.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
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

  // Handle item selection
  const handleSelect = (labelId: string) => {
    if (!value.includes(labelId)) {
      onValueChange([...value, labelId]);
    }
    setSearchTerm("");
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Handle remove label
  const removeLabel = (labelId: string) => {
    onValueChange(value.filter((id) => id !== labelId));
  };

  return (
    <div className={cn("relative w-[300px] text-sm text-gray-800", className)}>
      {labelPosition === "top" && (
        <div className="flex flex-wrap gap-2">
          {value.map((id) => {
            const label = labels.find((l) => l.id === id);
            return label ? (
              <div
                key={id}
                className="flex items-center px-2 py-1 mb-1 rounded-md"
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
                  onClick={() => removeLabel(id)}
                  className="ml-2 h-4 w-4 p-0"
                >
                  ×
                </Button>
              </div>
            ) : null;
          })}
        </div>
      )}

      <div>
        {/* Combobox Button */}
        <button
          type="button"
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
          disabled={disabled}
        >
          <span
            className={cn("truncate", value.length === 0 && "text-gray-500")}
          >
            {value.length > 0 ? `Đã chọn ${value.length} thẻ` : placeholder}
          </span>
          <IconChevronDown className="w-4 h-4 ml-2 text-gray-500" />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-85"
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
            <div ref={containerRef} className="max-h-60 pb-4 overflow-y-auto">
              {filteredLabels.length > 0 ? (
                filteredLabels.map((label) => (
                  <div
                    key={label.id}
                    className={cn(
                      "flex items-center px-2 py-1 ml-5 my-1 w-[80%] rounded-md cursor-pointer hover:bg-gray-100",
                      value.includes(label.id) && "bg-gray-100 font-medium"
                    )}
                    style={{
                      backgroundColor: label.extra_info?.color + "20",
                      color: label.extra_info?.color,
                    }}
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
                <div className="px-3 py-2 text-gray-500">
                  Không tìm thấy thẻ
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {labelPosition === "bottom" && (
        <div className="flex flex-wrap gap-2">
          {value.map((id) => {
            const label = labels.find((l) => l.id === id);
            return label ? (
              <div
                key={id}
                className="flex items-center px-2 py-1 mb-1 rounded-md"
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
                  onClick={() => removeLabel(id)}
                  className="ml-2 h-4 w-4 p-0"
                >
                  ×
                </Button>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
