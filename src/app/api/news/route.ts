import { NextResponse } from "next/server";
import { getDynamicNews } from "@/lib/news-feed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 12;
  const offset = Number(searchParams.get("offset")) || 0;
  const items = await getDynamicNews(Math.max(limit, 1), Math.max(offset, 0));

  return NextResponse.json(
    { items, hasMore: items.length >= Math.max(limit, 1) },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
