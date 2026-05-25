import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

const MAX_REASON_LENGTH = 240;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || session.user.isBanned) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  let body: { postId?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido invalido" }, { status: 400 });
  }

  const postId = body.postId?.trim();
  const reason = body.reason?.trim();

  if (!postId) {
    return NextResponse.json({ error: "Post invalido" }, { status: 400 });
  }
  if (!reason || reason.length < 3) {
    return NextResponse.json({ error: "Indica um motivo para a denuncia." }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: post, error: postError } = await db
    .from("feed_posts")
    .select("id, author_email, content")
    .eq("id", postId)
    .maybeSingle();

  if (postError) return NextResponse.json({ error: postError.message }, { status: 500 });
  if (!post) return NextResponse.json({ error: "Post nao encontrado" }, { status: 404 });
  if (post.author_email === session.user.email) {
    return NextResponse.json({ error: "Nao podes denunciar o teu proprio post." }, { status: 400 });
  }

  const [{ data: reporter, error: reporterError }, { data: author, error: authorError }] = await Promise.all([
    db
      .from("profiles")
      .select("username")
      .eq("email", session.user.email)
      .maybeSingle(),
    db
      .from("profiles")
      .select("username")
      .eq("email", post.author_email)
      .maybeSingle(),
  ]);

  if (reporterError) return NextResponse.json({ error: reporterError.message }, { status: 500 });
  if (authorError) return NextResponse.json({ error: authorError.message }, { status: 500 });
  if (!reporter || !author) {
    return NextResponse.json({ error: "Perfil nao encontrado" }, { status: 404 });
  }

  const normalizedReason = reason.slice(0, MAX_REASON_LENGTH);
  const { error: insertError } = await db.from("reports").insert({
    reason: normalizedReason,
    post_content: post.content ?? "",
    author_username: author.username,
    reporter_username: reporter.username,
    status: "pendente",
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ ok: true }, { status: 201 });
}
