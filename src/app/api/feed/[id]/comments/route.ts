import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

const FANDOM_BG: Record<string, string> = {
  ARMY:    "linear-gradient(135deg,#7B65C8,#ffd23f)",
  BLINK:   "linear-gradient(135deg,#3a5cff,#7B65C8)",
  STAY:    "linear-gradient(135deg,#0a0a0a,#3a5cff)",
  ONCE:    "linear-gradient(135deg,#ffd23f,#7af0c8)",
  MOA:     "linear-gradient(135deg,#3a5cff,#9580D6)",
  CARAT:   "linear-gradient(135deg,#ffd23f,#7B65C8)",
  ATINY:   "linear-gradient(135deg,#7af0c8,#3a5cff)",
  Bunnies: "linear-gradient(135deg,#7af0c8,#ffd23f)",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const db = createAdminClient();

  const { data: comments, error } = await db
    .from("post_comments")
    .select("id, user_email, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json([], { status: 200 });

  // Batch-load profiles
  const emails = [...new Set((comments ?? []).map((c) => c.user_email))];
  const profileMap: Record<string, { name: string; username: string; fandoms: string[] }> = {};
  if (emails.length > 0) {
    const { data: profiles } = await db
      .from("profiles")
      .select("email, name, username, fandoms")
      .in("email", emails);
    for (const p of profiles ?? []) {
      profileMap[p.email] = { name: p.name, username: p.username, fandoms: p.fandoms };
    }
  }

  const result = (comments ?? []).map((c) => {
    const p = profileMap[c.user_email];
    const fandom = p?.fandoms?.[0] ?? "";
    return {
      id:         c.id,
      content:    c.content,
      createdAt:  c.created_at,
      author: {
        name:     p?.name     ?? "Utilizador",
        username: p?.username ?? "@utilizador",
        initials: initials(p?.name ?? "KM"),
        avatarBg: FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
      },
    };
  });

  return NextResponse.json(result);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: postId } = await params;
  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "Comentário vazio" }, { status: 400 });
  }

  const db = createAdminClient();

  // Verifica que o post existe
  const { data: post } = await db
    .from("feed_posts")
    .select("id, comments, author_email")
    .eq("id", postId)
    .maybeSingle();

  if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

  // Insere o comentário
  const { data: comment, error } = await db
    .from("post_comments")
    .insert({ post_id: postId, user_email: session.user.email, content: content.trim() })
    .select("id, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Incrementa o contador de comentários
  await db
    .from("feed_posts")
    .update({ comments: post.comments + 1 })
    .eq("id", postId);

  // Notifica o autor (se não for o próprio)
  if (post.author_email !== session.user.email) {
    await db.from("notifications").insert({
      user_email: post.author_email,
      type:       "comment",
      from_email: session.user.email,
      post_id:    postId,
    });
  }

  // Devolve o comentário enriquecido
  const { data: profile } = await db
    .from("profiles")
    .select("name, username, fandoms")
    .eq("email", session.user.email)
    .maybeSingle();

  const fandom = profile?.fandoms?.[0] ?? "";

  return NextResponse.json({
    id:        comment.id,
    content:   content.trim(),
    createdAt: comment.created_at,
    author: {
      name:     profile?.name     ?? "Utilizador",
      username: profile?.username ?? "@utilizador",
      initials: initials(profile?.name ?? "KM"),
      avatarBg: FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
    },
  }, { status: 201 });
}
