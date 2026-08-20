import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "1.0.0",
    minSupportedVersion: "1.0.0",
    apkUrl: "/apk/kpop-moz.apk",
    releaseNotes: "Versao inicial da app KPOP.MZ.",
  });
}
