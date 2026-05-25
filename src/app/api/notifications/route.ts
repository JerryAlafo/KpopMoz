import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json([]);

  const db = createAdminClient();
  const { data } = await db
    .from("notifications")
    .select("id, type, from_email, post_id, read, created_at")
    .eq("user_email", session.user.email)
    .order("created_at", { ascending: false })
    .limit(30);

  return NextResponse.json(data ?? []);
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const db = createAdminClient();
  await db
    .from("notifications")
    .update({ read: true })
    .eq("user_email", session.user.email)
    .eq("read", false);

  return NextResponse.json({ ok: true });
}
