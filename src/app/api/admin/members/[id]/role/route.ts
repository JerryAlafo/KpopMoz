import { auth } from "@/auth";
import { getAdminMemberById } from "@/lib/admin-members";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin && !session.user.isBanned ? session : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (session.user.id === id) {
    return NextResponse.json({ error: "Nao podes alterar a tua propria permissao." }, { status: 400 });
  }

  const { isAdmin } = await req.json();
  if (typeof isAdmin !== "boolean") {
    return NextResponse.json({ error: "isAdmin deve ser booleano." }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db
    .from("profiles")
    .update({ is_admin: isAdmin })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const member = await getAdminMemberById(db, id);
  if (!member) return NextResponse.json({ error: "Utilizador nao encontrado." }, { status: 404 });

  return NextResponse.json(member);
}
