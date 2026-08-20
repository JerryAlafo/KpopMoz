import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apkPath = join(process.cwd(), "public", "apk", "kpop-moz.apk");
    const fileBuffer = await readFile(apkPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="kpop-moz.apk"',
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "APK nao encontrado." },
      { status: 404 }
    );
  }
}
