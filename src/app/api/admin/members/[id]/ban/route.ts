import { auth } from "@/auth";
import { getAdminMemberById } from "@/lib/admin-members";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin && !session.user.isBanned ? session : null;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (session.user.id === id) {
    return NextResponse.json({ error: "Nao podes banir-te a ti mesmo." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const durationDays = Number(body.durationDays ?? body.duration_days ?? 0);
  const expiresAt = durationDays > 0
    ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const db = createAdminClient();
  const { error } = await db
    .from("banned_users")
    .insert({
      user_id: id,
      reason: body.reason || null,
      banned_by: session.user.id,
      expires_at: expiresAt,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const member = await getAdminMemberById(db, id);
  if (!member) return NextResponse.json({ error: "Utilizador nao encontrado." }, { status: 404 });

  return NextResponse.json(member);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = createAdminClient();
  const { error } = await db
    .from("banned_users")
    .delete()
    .eq("user_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const member = await getAdminMemberById(db, id);
  if (!member) return NextResponse.json({ error: "Utilizador nao encontrado." }, { status: 404 });

  return NextResponse.json(member);
}
