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
  const session = await auth();
  const userEmail = session?.user?.email ?? null;
  const db = createAdminClient();

  const { data: post, error } = await db
    .from("feed_posts")
    .select("id, author_email, type, content, tags, image_url, reactions, comments, published_at")
    .eq("id", postId)
    .maybeSingle();

  if (error || !post) {
    return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
  }

  const { data: profile } = await db
    .from("profiles")
    .select("email, name, username, fandoms, avatar_url")
    .eq("email", post.author_email)
    .maybeSingle();

  let likedByMe = false;
  if (userEmail) {
    const { data: like } = await db
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_email", userEmail)
      .maybeSingle();
    likedByMe = !!like;
  }

  const fandom: string = profile?.fandoms?.[0] ?? "";

  return NextResponse.json({
    post: {
      id:          post.id,
      type:        post.type,
      author: {
        name:      profile?.name       ?? "Utilizador",
        username:  profile?.username   ?? "@utilizador",
        email:     post.author_email,
        initials:  initials(profile?.name ?? "KM"),
        avatarBg:  FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
        avatarUrl: profile?.avatar_url ?? null,
        fandom:    fandom || undefined,
      },
      publishedAt: post.published_at,
      content:     post.content || undefined,
      tags:        post.tags ?? [],
      reactions:   [{ emoji: "❤️", count: post.reactions }],
      comments:    post.comments,
      imageUrl:    post.image_url ?? undefined,
      likedByMe,
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: postId } = await params;
  const db = createAdminClient();

  // Verifica que o post existe e pertence ao utilizador
  const { data: post } = await db
    .from("feed_posts")
    .select("id, author_email, image_url")
    .eq("id", postId)
    .maybeSingle();

  if (!post) {
    return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
  }
  if (post.author_email !== session.user.email) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  // Apaga o post (post_likes e post_comments em cascata via FK)
  const { error } = await db.from("feed_posts").delete().eq("id", postId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
