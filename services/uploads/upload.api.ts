import { createHttp } from "@/lib/http/http";
import { UploadFileDTO } from "./upload.type";
const http = createHttp({});

export async function create(data: UploadFileDTO): Promise<any> {
  try {
    const res = await http.post<{ data: any }>("/api/uploads", data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to upload file");
  }
}
