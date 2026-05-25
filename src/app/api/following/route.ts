import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json([]);

  const db = createAdminClient();
  const { data } = await db
    .from("follows")
    .select("following_email")
    .eq("follower_email", session.user.email);

  return NextResponse.json((data ?? []).map((f) => f.following_email));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { email: targetEmail } = await req.json();
  if (!targetEmail || targetEmail === session.user.email) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const followerEmail = session.user.email;
  const db = createAdminClient();

  const { data: existing } = await db
    .from("follows")
    .select("id")
    .eq("follower_email", followerEmail)
    .eq("following_email", targetEmail)
    .maybeSingle();

  if (existing) {
    await db.from("follows").delete().eq("id", existing.id);
    return NextResponse.json({ following: false });
  }

  await db.from("follows").insert({ follower_email: followerEmail, following_email: targetEmail });
  await db.from("notifications").insert({
    user_email: targetEmail,
    type: "follow",
    from_email: followerEmail,
  });

  return NextResponse.json({ following: true });
}
