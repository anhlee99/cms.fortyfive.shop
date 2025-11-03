import { createHttp } from "@/lib/http/http";
import { UploadFileDTO } from "./upload.type";
const http = createHttp({});

export async function create(data: UploadFileDTO): Promise<any> {
  try {
    // BƯỚC 1: TẠO ĐỐI TƯỢNG FormData
    const formData = new FormData();

    // BƯỚC 2: Thêm File vào FormData
    // Tên trường 'file' (hoặc tên mà backend mong đợi)
    formData.append("file", data.file, data.file.name);

    // BƯỚC 3: Thêm Path (nếu có)
    if (data.path) {
      // Tên trường 'path' (hoặc tên mà backend mong đợi)
      formData.append("path", data.path);
    }

    const res = await http.post<{ data: any }>("/api/uploads", formData);
    return res.data;
  } catch (error) {
    throw new Error("Failed to upload file");
  }
}
