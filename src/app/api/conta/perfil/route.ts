import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const email = session.user.email;
  const db = createAdminClient();

  const [
    { count: followers },
    { count: following },
    { count: posts },
  ] = await Promise.all([
    db.from("follows").select("*", { count: "exact", head: true }).eq("following_email", email),
    db.from("follows").select("*", { count: "exact", head: true }).eq("follower_email", email),
    db.from("feed_posts").select("*", { count: "exact", head: true }).eq("author_email", email),
  ]);

  return NextResponse.json({
    followers: followers ?? 0,
    following: following ?? 0,
    posts:     posts     ?? 0,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { name, username, bio, city, fandoms } = await req.json();
  if (!name?.trim() || !username?.trim()) {
    return NextResponse.json({ error: "Nome e username são obrigatórios" }, { status: 400 });
  }

  const db = createAdminClient();

  // Verificar username único (excluindo o próprio utilizador)
  const { data: conflict } = await db
    .from("profiles")
    .select("email")
    .eq("username", username.trim())
    .neq("email", session.user.email)
    .maybeSingle();

  if (conflict) {
    return NextResponse.json({ error: "Username já está em uso" }, { status: 409 });
  }

  const { error } = await db
    .from("profiles")
    .update({
      name:     name.trim(),
      username: username.trim(),
      bio:      bio?.trim() ?? "",
      city:     city ?? "Maputo",
      fandoms:  fandoms ?? [],
    })
    .eq("email", session.user.email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
