import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { name, username, city, bio, fandoms } = await req.json();

  if (!name?.trim() || !username?.trim() || !city?.trim()) {
    return NextResponse.json(
      { error: "Nome, username e cidade são obrigatórios" },
      { status: 400 }
    );
  }

  const db = createAdminClient();

  // Verificar se o username já existe (noutro utilizador)
  const { data: conflict } = await db
    .from("profiles")
    .select("email")
    .eq("username", username.trim())
    .neq("email", session.user.email)
    .maybeSingle();

  if (conflict) {
    return NextResponse.json({ error: "Este username já está em uso" }, { status: 409 });
  }

  const { error } = await db
    .from("profiles")
    .update({
      name:                name.trim(),
      username:            username.trim(),
      city:                city.trim(),
      bio:                 bio?.trim() ?? "",
      fandoms:             fandoms     ?? [],
      onboarding_complete: true,
    })
    .eq("email", session.user.email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
