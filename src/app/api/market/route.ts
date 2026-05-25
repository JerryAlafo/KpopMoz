import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("market_items")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    category: row.category as string,
    price: row.price as number,
    currency: "MZN" as const,
    seller: row.seller as string,
    city: row.city as string,
    condition: row.condition as string,
    bg: row.bg as string,
    imageUrl: (row.image_url ?? undefined) as string | undefined,
  }));

  return NextResponse.json(items);
}
