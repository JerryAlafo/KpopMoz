import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin && !session.user.isBanned ? session : null;
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

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  const db = createAdminClient();

  const { data: report, error: reportError } = await db
    .from("reports")
    .select("id, post_content, author_username")
    .eq("id", id)
    .maybeSingle();

  if (reportError) return NextResponse.json({ error: reportError.message }, { status: 500 });
  if (!report) return NextResponse.json({ error: "Denuncia nao encontrada" }, { status: 404 });

  const usernames = report.author_username.startsWith("@")
    ? [report.author_username]
    : [report.author_username, `@${report.author_username}`];

  const { data: profiles, error: profileError } = await db
    .from("profiles")
    .select("email")
    .in("username", usernames);

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
  const authorEmail = profiles?.[0]?.email;
  if (!authorEmail) return NextResponse.json({ error: "Autor do post nao encontrado" }, { status: 404 });

  const { data: posts, error: postsError } = await db
    .from("feed_posts")
    .select("id")
    .eq("author_email", authorEmail)
    .eq("content", report.post_content)
    .limit(1);

  if (postsError) return NextResponse.json({ error: postsError.message }, { status: 500 });
  const postId = posts?.[0]?.id;
  if (!postId) return NextResponse.json({ error: "Post nao encontrado" }, { status: 404 });

  const { error: deleteError } = await db.from("feed_posts").delete().eq("id", postId);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  const { error: updateError } = await db
    .from("reports")
    .update({ status: "apagado" })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
