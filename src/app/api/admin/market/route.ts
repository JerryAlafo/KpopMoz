import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin && !session.user.isBanned ? session : null;
}

const categoryBg: Record<string, string> = {
  "Photocards":  "linear-gradient(135deg, #ffd23f 0%, #7B65C8 100%)",
  "Lightsticks": "linear-gradient(135deg, #7B65C8 0%, #ff5a82 100%)",
  "Álbuns":      "linear-gradient(135deg, #0a0a0a 0%, #3a5cff 100%)",
  "Posters":     "linear-gradient(135deg, #ff5a82 0%, #ffdc66 100%)",
  "Roupa":       "linear-gradient(135deg, #7af0c8 0%, #3a5cff 100%)",
  "Acessórios":  "linear-gradient(135deg, #ffd23f 0%, #7af0c8 100%)",
};

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("market_items")
    .select("id, title, category, price, condition, seller, city, image_url")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      price: String(row.price),
      condition: row.condition,
      seller: row.seller,
      city: row.city,
      imageUrl: row.image_url,
    }))
  );
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const db = createAdminClient();

  const { data, error } = await db
    .from("market_items")
    .insert({
      title: body.title,
      category: body.category ?? "Photocards",
      condition: body.condition ?? "Novo",
      price: Number(body.price) || 0,
      seller: body.seller ?? "",
      city: body.city ?? "Maputo",
      image_url: body.imageUrl ?? null,
      bg: categoryBg[body.category] ?? "linear-gradient(135deg, #1c1c1c, #0a0a0a)",
      is_active: true,
    })
    .select("id, title, category, price, condition, seller, city, image_url")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      category: data.category,
      price: String(data.price),
      condition: data.condition,
      seller: data.seller,
      city: data.city,
      imageUrl: data.image_url,
    },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  const db = createAdminClient();

  const { error } = await db.from("market_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
