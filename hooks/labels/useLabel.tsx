"use client";
import useSWR from "swr";
import { PaginatedResponse } from "@/types/pagination";
import {
  Label,
  LabelSearchParams,
  CreateLabelDTO,
} from "@/services/labels/label.type";
import { list, create, getById } from "@/services/labels/label.api";
import { useLabelSearchUrl, normalizeSearch } from "./useLabelSearch";

function keyFromParams(params?: LabelSearchParams) {
  const p = normalizeSearch(params);
  // stable key: SWR will re-fetch only when p changes (i.e., on Apply)
  return ["/api/labels", p] as const;
}

export function useLabels(initialData?: PaginatedResponse<Label>) {
  const { params } = useLabelSearchUrl();
  const swrKey = keyFromParams(params);
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Label>>(
    swrKey,
    () => list(params),
    {
      fallbackData: initialData,
      // Enable revalidation on focus, mount, and reconnect
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  const newLabel = async (payload: CreateLabelDTO) => {
    const newLabel = await create(payload);
    await mutate();
    return newLabel;
  };

  const getLabel = async (id: string): Promise<Label> => {
    const label = await getById(id);
    return label;
  };

  return {
    data,
    isLoading,
    error,
    mutate,
    newLabel,
    getLabel,
  };
}
