import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
}

function relativeTime(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("reports")
    .select("id, reason, post_content, author_username, reporter_username, status, created_at")
    .eq("status", "pendente")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((row) => ({
      id: row.id,
      reason: row.reason,
      post: row.post_content,
      author: row.author_username,
      reporter: row.reporter_username,
      ago: relativeTime(row.created_at),
    }))
  );
}

export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, status } = await req.json();
  const db = createAdminClient();

  const { error } = await db
    .from("reports")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
