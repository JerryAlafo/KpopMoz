import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("profiles")
    .select("id, name, username, is_admin, joined_at")
    .order("joined_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      username: row.username,
      role: row.is_admin ? "mod" : "member",
      posts: 0,
      joined: new Date(row.joined_at).toLocaleDateString("pt", {
        month: "short",
        year: "numeric",
      }),
      online: false,
    }))
  );
}
