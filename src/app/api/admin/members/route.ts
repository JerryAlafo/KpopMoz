import { auth } from "@/auth";
import { getActiveBannedProfileIds, getPostCountsByEmail, toMemberRow } from "@/lib/admin-members";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin && !session.user.isBanned ? session : null;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("profiles")
    .select("id, email, name, username, is_admin, joined_at")
    .order("joined_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const [postCounts, bannedIds] = await Promise.all([
    getPostCountsByEmail(db, rows.map((row) => row.email)),
    getActiveBannedProfileIds(db, rows.map((row) => row.id)),
  ]);

  return NextResponse.json(rows.map((row) => (
    toMemberRow(row, postCounts.get(row.email) ?? 0, bannedIds.has(row.id))
  )));
}
