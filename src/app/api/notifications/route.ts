import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json([]);

  const db = createAdminClient();
  const { data: notifs } = await db
    .from("notifications")
    .select("id, type, from_email, post_id, read, created_at")
    .eq("user_email", session.user.email)
    .order("created_at", { ascending: false })
    .limit(30);

  if (!notifs?.length) return NextResponse.json([]);

  // Enriquecer com nome/username do remetente
  const emails = [...new Set(notifs.map((n) => n.from_email).filter(Boolean))];
  const profileMap: Record<string, { name: string; username: string }> = {};
  if (emails.length > 0) {
    const { data: profiles } = await db
      .from("profiles")
      .select("email, name, username")
      .in("email", emails);
    for (const p of profiles ?? []) {
      profileMap[p.email] = { name: p.name, username: p.username };
    }
  }

  const result = notifs.map((n) => ({
    id:         n.id,
    type:       n.type,
    fromEmail:  n.from_email,
    fromName:   profileMap[n.from_email]?.name ?? "Alguém",
    fromUser:   profileMap[n.from_email]?.username ?? "",
    postId:     n.post_id,
    read:       n.read,
    createdAt:  n.created_at,
  }));

  return NextResponse.json(result);
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
