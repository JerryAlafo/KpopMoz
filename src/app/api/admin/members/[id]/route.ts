import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin && !session.user.isBanned ? session : null;
}

async function deleteWhere(db: ReturnType<typeof createAdminClient>, table: string, column: string, value: string) {
  const { error } = await db.from(table).delete().eq(column, value);
  if (error) throw error;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (session.user.id === id) {
    return NextResponse.json({ error: "Nao podes apagar a tua propria conta." }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: target, error: targetError } = await db
    .from("profiles")
    .select("id, email, username")
    .eq("id", id)
    .maybeSingle();

  if (targetError) return NextResponse.json({ error: targetError.message }, { status: 500 });
  if (!target) return NextResponse.json({ error: "Utilizador nao encontrado." }, { status: 404 });

  try {
    await Promise.all([
      deleteWhere(db, "post_likes", "user_email", target.email),
      deleteWhere(db, "post_comments", "user_email", target.email),
      deleteWhere(db, "notifications", "user_email", target.email),
      deleteWhere(db, "notifications", "from_email", target.email),
      deleteWhere(db, "follows", "follower_email", target.email),
      deleteWhere(db, "follows", "following_email", target.email),
      deleteWhere(db, "event_registrations", "user_email", target.email),
      deleteWhere(db, "reports", "author_username", target.username),
      deleteWhere(db, "reports", "reporter_username", target.username),
      deleteWhere(db, "banned_users", "user_id", id),
    ]);

    const { error: postsError } = await db
      .from("feed_posts")
      .delete()
      .eq("author_email", target.email);
    if (postsError) throw postsError;

    const { error: profileError } = await db
      .from("profiles")
      .delete()
      .eq("id", id);
    if (profileError) throw profileError;

    const { error: authDeleteError } = await db.auth.admin.deleteUser(id);
    if (authDeleteError) {
      const { data: usersData } = await db.auth.admin.listUsers();
      const authUser = usersData?.users.find(
        (u) => u.email?.toLowerCase() === target.email.toLowerCase()
      );

      if (authUser) {
        const { error: fallbackDeleteError } = await db.auth.admin.deleteUser(authUser.id);
        if (fallbackDeleteError) throw fallbackDeleteError;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Erro ao apagar conta." },
      { status: 500 }
    );
  }
}
