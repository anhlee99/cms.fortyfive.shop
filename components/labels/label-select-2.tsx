import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Label } from "@/services/labels/label.type";
import { useLabels as useLabelsMock } from "@/hooks/labels/useLabel";

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
  value = [],
  placeholder,
  searchPlaceholder = "Tìm kiếm...",
  className,
  disabled,
  labelPosition = "top",
}: LabelSelectProps) {
  // use your real hook (useLabels) instead of useLabelsMock
  const { data, isLoading } = useLabelsMock();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // derive labels from data, update when data changes
  const labels: Label[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  // filtered labels by searchTerm
  const filteredLabels = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return labels;
    return labels.filter((l) => l.display_name.toLowerCase().includes(q));
  }, [labels, searchTerm]);

  // open dropdown and focus input
  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    // focus after render
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const close = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  // click outside to close
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

  // toggle select/deselect label id (multi-select)
  const toggle = (id: string) => {
    const exists = (value || []).includes(id);
    const next = exists
      ? (value || []).filter((i) => i !== id)
      : [...(value || []), id];
    onValueChange(next);
  };

  // keyboard handling: Esc closes, Backspace clears search when empty
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {labelPosition === "top" && placeholder && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {placeholder}
        </label>
      )}

      <button
        type="button"
        className={cn(
          "w-full text-left border rounded px-3 py-2 flex items-center justify-between",
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-white hover:shadow-sm"
        )}
        onClick={() => (isOpen ? close() : open())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {value && value.length > 0 ? (
            // show selected labels
            value
              .map((id) => labels.find((l) => l.id === id))
              .filter(Boolean)
              .map((l) => (
                <span
                  key={l!.id}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                  title={l!.display_name}
                >
                  {l!.display_name}
                </span>
              ))
          ) : (
            <span className="text-gray-400">{placeholder ?? "Chọn thẻ"}</span>
          )}
        </div>
        <div className="ml-2 text-gray-500">▾</div>
      </button>

      {isOpen && (
        <div
          ref={inputRef as any}
          className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-64 overflow-auto"
        >
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500">Đang tải...</div>
            ) : filteredLabels.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">
                Không tìm thấy thẻ
              </div>
            ) : (
              <ul role="listbox" aria-multiselectable className="divide-y">
                {filteredLabels.map((label) => {
                  const checked = (value || []).includes(label.id);
                  return (
                    <li
                      key={label.id}
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggle(label.id)}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(label.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm">{label.display_name}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
