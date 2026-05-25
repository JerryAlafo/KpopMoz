import type { createAdminClient } from "@/lib/supabase";

type Db = ReturnType<typeof createAdminClient>;

interface BanRow {
  id?: string;
  reason?: string | null;
  expires_at: string | null;
}

export function isActiveBan(ban: BanRow) {
  return !ban.expires_at || new Date(ban.expires_at) > new Date();
}

export async function getActiveBanForProfile(db: Db, profileId: string) {
  const { data, error } = await db
    .from("banned_users")
    .select("id, reason, expires_at")
    .eq("user_id", profileId);

  if (error || !data) return null;
  return data.find(isActiveBan) ?? null;
}
