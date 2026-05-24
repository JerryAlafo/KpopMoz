import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const { email, password, name, city } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Preenche todos os campos." }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (authError) {
    const msg = authError.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("already exists")) {
      return NextResponse.json({ error: "Este e-mail já está registado." }, { status: 409 });
    }
    return NextResponse.json({ error: "Não foi possível criar a conta." }, { status: 500 });
  }

  const base = email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
  await db.from("profiles").insert({
    id: authData.user.id,
    email,
    name,
    username: `@${base}`,
    ...(city ? { city } : {}),
  });

  return NextResponse.json({ success: true });
}
