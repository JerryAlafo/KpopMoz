import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: postId } = await params;
  const userEmail = session.user.email;
  const db = createAdminClient();

  const [{ data: existing }, { data: post }] = await Promise.all([
    db.from("post_likes").select("id").eq("post_id", postId).eq("user_email", userEmail).maybeSingle(),
    db.from("feed_posts").select("reactions, author_email").eq("id", postId).maybeSingle(),
  ]);

  if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

  if (existing) {
    await db.from("post_likes").delete().eq("id", existing.id);
    const newCount = Math.max(0, post.reactions - 1);
    await db.from("feed_posts").update({ reactions: newCount }).eq("id", postId);
    return NextResponse.json({ liked: false, count: newCount });
  }

  await db.from("post_likes").insert({ post_id: postId, user_email: userEmail });
  const newCount = post.reactions + 1;
  await db.from("feed_posts").update({ reactions: newCount }).eq("id", postId);

  if (post.author_email !== userEmail) {
    await db.from("notifications").insert({
      user_email: post.author_email,
      type: "like",
      from_email: userEmail,
      post_id: postId,
    });
  }

  return NextResponse.json({ liked: true, count: newCount });
}
