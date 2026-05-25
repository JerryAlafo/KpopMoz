import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

const MOZ_OFFSET_MS = 2 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin && !session.user.isBanned ? session : null;
}

function mozDayStart(date: Date) {
  const local = new Date(date.getTime() + MOZ_OFFSET_MS);
  return new Date(
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - MOZ_OFFSET_MS
  );
}

function mozDayKey(date: Date) {
  const local = new Date(date.getTime() + MOZ_OFFSET_MS);
  const year = local.getUTCFullYear();
  const month = String(local.getUTCMonth() + 1).padStart(2, "0");
  const day = String(local.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const todayStart = mozDayStart(new Date());
  const tomorrowStart = new Date(todayStart.getTime() + DAY_MS);
  const firstActivityDay = new Date(todayStart.getTime() - 6 * DAY_MS);

  const [
    { count: members },
    { count: postsToday },
    { count: activeReports },
    { count: activeEvents },
    { data: activityRows },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("feed_posts").select("*", { count: "exact", head: true })
      .gte("published_at", todayStart.toISOString())
      .lt("published_at", tomorrowStart.toISOString()),
    db.from("reports").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    db.from("events").select("*", { count: "exact", head: true }).gte("date", todayStart.toISOString().slice(0, 10)),
    db.from("feed_posts").select("published_at")
      .gte("published_at", firstActivityDay.toISOString())
      .lt("published_at", tomorrowStart.toISOString()),
  ]);

  const buckets = new Map<string, number>();
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(firstActivityDay.getTime() + i * DAY_MS);
    buckets.set(mozDayKey(day), 0);
  }

  for (const row of activityRows ?? []) {
    const dayKey = mozDayKey(new Date(row.published_at));
    buckets.set(dayKey, (buckets.get(dayKey) ?? 0) + 1);
  }

  const activity = [...buckets.entries()].map(([dayKey, posts]) => {
    const date = new Date(`${dayKey}T00:00:00.000Z`);
    return {
      day: DAY_LABELS[date.getUTCDay()] ?? dayKey.slice(5),
      posts,
    };
  });

  return NextResponse.json({
    members: members ?? 0,
    postsToday: postsToday ?? 0,
    activeReports: activeReports ?? 0,
    activeEvents: activeEvents ?? 0,
    activity,
  });
}
