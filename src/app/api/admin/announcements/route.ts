import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("announcements")
    .select("id, title, audience, status, is_pinned")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      audience: row.audience,
      status: row.status,
      pinned: row.is_pinned,
    }))
  );
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const db = createAdminClient();

  const { data, error } = await db
    .from("announcements")
    .insert({
      title: body.title,
      body: body.body ?? "",
      audience: body.audience ?? "Geral",
      is_pinned: body.pinned ?? false,
      status: "Publicado",
    })
    .select("id, title, audience, status, is_pinned")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      audience: data.audience,
      status: data.status,
      pinned: data.is_pinned,
    },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  const db = createAdminClient();

  const { error } = await db.from("announcements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
