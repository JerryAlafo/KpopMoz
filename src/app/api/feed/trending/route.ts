import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const db = createAdminClient();

  // Últimos 30 dias
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await db
    .from("feed_posts")
    .select("tags")
    .gte("published_at", since)
    .not("tags", "eq", "{}");

  if (error || !data) return NextResponse.json([]);

  // Contar ocorrências de cada tag
  const counts: Record<string, number> = {};
  for (const row of data) {
    for (const tag of row.tags ?? []) {
      if (tag?.trim()) counts[tag.trim()] = (counts[tag.trim()] ?? 0) + 1;
    }
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  return NextResponse.json(sorted);
}
