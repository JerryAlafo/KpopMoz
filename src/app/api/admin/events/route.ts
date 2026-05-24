import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-").map(Number);
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${String(day).padStart(2, "0")} ${months[(month ?? 1) - 1] ?? ""}`;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("events")
    .select("id, title, date, registered, capacity")
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      date: formatDate(row.date),
      registered: row.registered,
      capacity: row.capacity ?? 0,
    }))
  );
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const db = createAdminClient();

  const { data, error } = await db
    .from("events")
    .insert({
      slug: `${toSlug(body.title)}-${Date.now()}`,
      title: body.title,
      description: body.description ?? "",
      date: body.date,
      start_time: body.startTime ?? "00:00",
      end_time: body.endTime || null,
      location: body.location ?? "A definir",
      city: body.city ?? "Maputo",
      type: body.type ?? "encontro",
      is_free: body.free ?? true,
      price: body.free ? 0 : (Number(body.price) || 0),
      capacity: body.capacity ? Number(body.capacity) : null,
    })
    .select("id, title, date, registered, capacity")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      date: formatDate(data.date),
      registered: data.registered,
      capacity: data.capacity ?? 0,
    },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  const db = createAdminClient();

  const { error } = await db.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
