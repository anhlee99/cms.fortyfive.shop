import { NextResponse } from "next/server";
import { create } from "@/services/uploads/upload.service";
import { withAuth } from "@/lib/api/with-auth";

export const POST = withAuth(async (request: Request, _ctx, { user }) => {
  try {
    const data = await request.formData();
    if (!data) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // Assuming UploadFileDTO has fields: file (File), user_id (string)
    const file = data.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const newUpload = await create({ file: file, path: filePath });
    return NextResponse.json(
      {
        data: {
          ...newUpload,
          url: `${process.env.STORE_URL}/${newUpload.fullPath}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
