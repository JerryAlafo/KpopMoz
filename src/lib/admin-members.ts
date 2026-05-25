import type { createAdminClient } from "@/lib/supabase";
import { isActiveBan } from "@/lib/bans";

type Db = ReturnType<typeof createAdminClient>;

export interface AdminProfileRow {
  id: string;
  email: string;
  name: string;
  username: string;
  is_admin: boolean;
  joined_at: string;
}

export async function getPostCountsByEmail(db: Db, emails: string[]) {
  if (emails.length === 0) return new Map<string, number>();

  const { data } = await db
    .from("feed_posts")
    .select("author_email")
    .in("author_email", emails);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.author_email, (counts.get(row.author_email) ?? 0) + 1);
  }
  return counts;
}

export async function getActiveBannedProfileIds(db: Db, profileIds: string[]) {
  const bannedIds = new Set<string>();
  if (profileIds.length === 0) return bannedIds;

  const { data } = await db
    .from("banned_users")
    .select("user_id, expires_at")
    .in("user_id", profileIds);

  for (const ban of data ?? []) {
    if (isActiveBan(ban)) bannedIds.add(ban.user_id);
  }
  return bannedIds;
}

export function toMemberRow(row: AdminProfileRow, posts: number, banned: boolean) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    role: row.is_admin ? "admin" : "member",
    posts,
    joined: new Date(row.joined_at).toLocaleDateString("pt", {
      month: "short",
      year: "numeric",
    }),
    online: false,
    banned,
  };
}

export async function getAdminMemberById(db: Db, id: string) {
  const { data, error } = await db
    .from("profiles")
    .select("id, email, name, username, is_admin, joined_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [postCounts, bannedIds] = await Promise.all([
    getPostCountsByEmail(db, [data.email]),
    getActiveBannedProfileIds(db, [data.id]),
  ]);

  return toMemberRow(data, postCounts.get(data.email) ?? 0, bannedIds.has(data.id));
}
