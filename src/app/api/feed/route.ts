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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, Number(searchParams.get("page"))  || 1);
  const limit  = Math.min(Number(searchParams.get("limit")) || 10, 50);
  const tab    = searchParams.get("tab") ?? "geral";
  const offset = (page - 1) * limit;

  const session   = await auth();
  const userEmail = session?.user?.email ?? null;
  const db        = createAdminClient();

  // "seguindo": só posts de utilizadores que o user segue
  let followingEmails: string[] | null = null;
  if (tab === "seguindo" && userEmail) {
    const { data: followData } = await db
      .from("follows")
      .select("following_email")
      .eq("follower_email", userEmail);
    followingEmails = (followData ?? []).map((f) => f.following_email);
    if (followingEmails.length === 0) {
      return NextResponse.json({ posts: [], hasMore: false });
    }
  }

  // Passo 1: obter posts (sem join — evita erro de FK em falta)
  let query = db
    .from("feed_posts")
    .select("id, author_email, type, content, tags, image_url, reactions, comments, published_at", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (followingEmails) query = query.in("author_email", followingEmails);

  const { data: posts, count, error: postsError } = await query;

  if (postsError) {
    console.error("[feed GET]", postsError.message);
    return NextResponse.json({ posts: [], hasMore: false });
  }

  // Passo 2: obter perfis dos autores (batch, sem join)
  const authorEmails = [...new Set((posts ?? []).map((p) => p.author_email))];
  const profileMap: Record<string, { name: string; username: string; fandoms: string[]; avatar_url: string | null }> = {};

  if (authorEmails.length > 0) {
    const { data: profiles } = await db
      .from("profiles")
      .select("email, name, username, fandoms, avatar_url")
      .in("email", authorEmails);

    for (const p of profiles ?? []) {
      profileMap[p.email] = { name: p.name, username: p.username, fandoms: p.fandoms, avatar_url: p.avatar_url ?? null };
    }
  }

  // Passo 3: likes do utilizador actual
  let likedIds = new Set<string>();
  if (userEmail && posts && posts.length > 0) {
    const { data: likes } = await db
      .from("post_likes")
      .select("post_id")
      .eq("user_email", userEmail)
      .in("post_id", posts.map((p) => p.id));
    likedIds = new Set((likes ?? []).map((l) => l.post_id));
  }

  const mapped = (posts ?? []).map((p) => {
    const profile = profileMap[p.author_email];
    const fandom: string = profile?.fandoms?.[0] ?? "";
    return {
      id:          p.id,
      type:        p.type,
      author: {
        name:      profile?.name       ?? "Utilizador",
        username:  profile?.username   ?? "@utilizador",
        email:     p.author_email,
        initials:  initials(profile?.name ?? "KM"),
        avatarBg:  FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
        avatarUrl: profile?.avatar_url ?? null,
        fandom:    fandom || undefined,
      },
      publishedAt: p.published_at,
      content:     p.content || undefined,
      tags:        p.tags ?? [],
      reactions:   [{ emoji: "❤️", count: p.reactions }],
      comments:    p.comments,
      imageUrl:    p.image_url ?? undefined,
      likedByMe:   likedIds.has(p.id),
    };
  });

  const hasMore = count !== null && offset + limit < count;
  return NextResponse.json({ posts: mapped, hasMore });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { content, tags, type = "post", image_url } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "Conteúdo vazio" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("feed_posts")
    .insert({
      author_email: session.user.email,
      type,
      content:   content.trim(),
      tags:      tags      ?? [],
      image_url: image_url ?? null,
    })
    .select("id, published_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
