// hooks/useDebouncedCallback.ts
"use client";
import * as React from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  const ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  return React.useCallback((...args: Parameters<T>) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => fn(...args), delay) as any;
  }, [fn, delay]);
}