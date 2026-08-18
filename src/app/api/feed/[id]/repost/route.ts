import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

const MAX_REPOST_TEXT = 240;

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

async function mapPost(row: any, profile: any) {
  const fandom: string = profile?.fandoms?.[0] ?? "";
  return {
    id:          row.id,
    type:        row.type,
    author: {
      name:      profile?.name       ?? "Utilizador",
      username:  profile?.username   ?? "@utilizador",
      email:     row.author_email,
      initials:  initials(profile?.name ?? "KM"),
      avatarBg:  FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
      avatarUrl: profile?.avatar_url ?? null,
      fandom:    fandom || undefined,
    },
    publishedAt:  row.published_at,
    content:      row.content || undefined,
    tags:         row.tags ?? [],
    reactions:    [{ emoji: "❤️", count: row.reactions }],
    comments:     row.comments,
    shares:       row.shares ?? 0,
    imageUrl:     row.image_url ?? undefined,
    repostOfId:   row.repost_of_id ?? undefined,
    likedByMe:    false,
  };
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (content.length > MAX_REPOST_TEXT) {
      return NextResponse.json(
        { error: `O repost pode ter no máximo ${MAX_REPOST_TEXT} caracteres.` },
        { status: 400 }
      );
    }

    const db = createAdminClient();
    const userEmail = session.user.email;

    // 1. Buscar o post original
    const { data: sourcePost, error: sourceError } = await db
      .from("feed_posts")
      .select("id, author_email, type, repost_of_id")
      .eq("id", id)
      .maybeSingle();

    if (sourceError || !sourcePost) {
      return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
    }

    // 2. Resolver o post raiz (se já é repost, pegar o original)
    const targetId = sourcePost.repost_of_id ?? sourcePost.id;
    const { data: targetPost, error: targetError } = await db
      .from("feed_posts")
      .select("id, author_email")
      .eq("id", targetId)
      .maybeSingle();

    if (targetError || !targetPost) {
      return NextResponse.json({ error: "Publicação original não encontrada." }, { status: 404 });
    }

    // 3. Não pode repostar a sua própria publicação
    if (targetPost.author_email === userEmail) {
      return NextResponse.json(
        { error: "Não podes repostar a tua própria publicação." },
        { status: 400 }
      );
    }

    // 4. Verificar se já repostou
    const { data: alreadyReposted } = await db
      .from("feed_posts")
      .select("id")
      .eq("author_email", userEmail)
      .eq("repost_of_id", targetPost.id)
      .maybeSingle();

    if (alreadyReposted) {
      return NextResponse.json(
        { error: "Já repostaste esta publicação." },
        { status: 409 }
      );
    }

    // 5. Criar o repost
    const { data: repost, error: insertError } = await db
      .from("feed_posts")
      .insert({
        author_email: userEmail,
        content,
        type: "post",
        repost_of_id: targetPost.id,
      })
      .select("id, author_email, type, content, tags, image_url, reactions, comments, shares, published_at, repost_of_id")
      .single();

    if (insertError || !repost) {
      return NextResponse.json(
        { error: insertError?.message || "Erro ao repostar publicação." },
        { status: 500 }
      );
    }

    // 6. Incrementar shares no post original
    await db.rpc("increment_shares", { post_id: targetPost.id });

    // 7. Notificar o autor original
    if (targetPost.author_email !== userEmail) {
      await db.from("notifications").insert({
        user_email: targetPost.author_email,
        type: "repost",
        from_email: userEmail,
        post_id: repost.id,
      });
    }

    // 8. Enriquecer com perfil do autor
    const { data: profile } = await db
      .from("profiles")
      .select("email, name, username, fandoms, avatar_url")
      .eq("email", userEmail)
      .maybeSingle();

    const mapped = await mapPost(repost, profile);

    // 9. Buscar o post original para embed
    const { data: origProfile } = await db
      .from("profiles")
      .select("email, name, username, fandoms, avatar_url")
      .eq("email", targetPost.author_email)
      .maybeSingle();

    const { data: origPost } = await db
      .from("feed_posts")
      .select("id, author_email, type, content, tags, image_url, reactions, comments, shares, published_at, repost_of_id")
      .eq("id", targetPost.id)
      .maybeSingle();

    const originalMapped = origPost ? await mapPost(origPost, origProfile) : null;

    return NextResponse.json({
      ...mapped,
      repostOf: originalMapped,
    }, { status: 201 });
  } catch (err) {
    console.error("POST /api/feed/[id]/repost error:", err);
    return NextResponse.json(
      { error: "Erro ao repostar publicação." },
      { status: 500 }
    );
  }
}
