import { m } from "framer-motion";
import type { UploadFileDTO } from "./upload.type";
import { createClient } from "@/lib/supabase/server";

export async function create(input: UploadFileDTO): Promise<any> {
  const supabase = await createClient();
  let filePath = input.path || "";

  const { data, error } = await supabase.storage
    .from("user-uploads")
    .upload(filePath, input.file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return {
    ...data,
    size: input.file.size,
    mimeType: input.file.type,
    originalName: input.file.name,
  };
}
