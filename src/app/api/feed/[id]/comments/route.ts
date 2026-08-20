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
    .select("id, user_email, content, reply_to, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json([], { status: 200 });

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

  const replyToIds = [...new Set(
    (comments ?? []).map((c) => c.reply_to).filter(Boolean)
  )] as string[];
  const replyToAuthorMap: Record<string, string> = {};
  if (replyToIds.length > 0) {
    const { data: parentComments } = await db
      .from("post_comments")
      .select("id, user_email")
      .in("id", replyToIds);
    for (const pc of parentComments ?? []) {
      const p = profileMap[pc.user_email];
      replyToAuthorMap[pc.id] = p?.username ?? "utilizador";
    }
  }

  const result = (comments ?? []).map((c) => {
    const p = profileMap[c.user_email];
    const fandom = p?.fandoms?.[0] ?? "";
    return {
      id:            c.id,
      content:       c.content,
      replyTo:       c.reply_to ?? null,
      replyToAuthor: c.reply_to ? (replyToAuthorMap[c.reply_to] ?? null) : null,
      createdAt:     c.created_at,
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
  const { content, replyTo } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "Comentário vazio" }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: post } = await db
    .from("feed_posts")
    .select("id, comments, author_email")
    .eq("id", postId)
    .maybeSingle();

  if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

  let replyToId: string | null = null;
  if (replyTo) {
    const { data: parentComment } = await db
      .from("post_comments")
      .select("id, user_email")
      .eq("id", replyTo)
      .eq("post_id", postId)
      .maybeSingle();
    if (parentComment) {
      replyToId = parentComment.id;
      if (parentComment.user_email !== session.user.email) {
        await db.from("notifications").insert({
          user_email: parentComment.user_email,
          type:       "reply",
          from_email: session.user.email,
          post_id:    postId,
        });
      }
    }
  }

  const insertData: Record<string, unknown> = {
    post_id: postId,
    user_email: session.user.email,
    content: content.trim(),
  };
  if (replyToId) {
    insertData.reply_to = replyToId;
  }

  const { data: comment, error } = await db
    .from("post_comments")
    .insert(insertData)
    .select("id, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db
    .from("feed_posts")
    .update({ comments: post.comments + 1 })
    .eq("id", postId);

  if (!replyToId && post.author_email !== session.user.email) {
    await db.from("notifications").insert({
      user_email: post.author_email,
      type:       "comment",
      from_email: session.user.email,
      post_id:    postId,
    });
  }

  const { data: profile } = await db
    .from("profiles")
    .select("name, username, fandoms")
    .eq("email", session.user.email)
    .maybeSingle();

  const fandom = profile?.fandoms?.[0] ?? "";

  let replyToAuthorName: string | null = null;
  if (replyToId) {
    const { data: parentComment } = await db
      .from("post_comments")
      .select("user_email")
      .eq("id", replyToId)
      .maybeSingle();
    if (parentComment) {
      const { data: parentProfile } = await db
        .from("profiles")
        .select("username")
        .eq("email", parentComment.user_email)
        .maybeSingle();
      replyToAuthorName = parentProfile?.username ?? null;
    }
  }

  return NextResponse.json({
    id:            comment.id,
    content:       content.trim(),
    replyTo:       replyToId,
    replyToAuthor: replyToAuthorName,
    createdAt:     comment.created_at,
    author: {
      name:     profile?.name     ?? "Utilizador",
      username: profile?.username ?? "@utilizador",
      initials: initials(profile?.name ?? "KM"),
      avatarBg: FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
    },
  }, { status: 201 });
}
