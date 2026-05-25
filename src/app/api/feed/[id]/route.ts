import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

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
