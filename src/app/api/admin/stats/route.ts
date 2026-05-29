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

function shortLabel(dateKey: string) {
  return `${dateKey.slice(8)}/${dateKey.slice(5, 7)}`;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const todayStart = mozDayStart(new Date());
  const tomorrowStart = new Date(todayStart.getTime() + DAY_MS);
  const firstActivityDay = new Date(todayStart.getTime() - 6 * DAY_MS);
  const firstMonthDay = new Date(todayStart.getTime() - 29 * DAY_MS);
  const firstWeekDay = new Date(todayStart.getTime() - 55 * DAY_MS); // 8 semanas

  const [
    { count: members },
    { count: postsToday },
    { count: activeReports },
    { count: activeEvents },
    { data: activityRows },
    { data: monthlyRows },
    { data: memberRows },
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
    db.from("feed_posts").select("published_at")
      .gte("published_at", firstMonthDay.toISOString())
      .lt("published_at", tomorrowStart.toISOString()),
    db.from("profiles").select("created_at")
      .gte("created_at", firstWeekDay.toISOString()),
  ]);

  // 7 dias
  const weekBuckets = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    weekBuckets.set(mozDayKey(new Date(firstActivityDay.getTime() + i * DAY_MS)), 0);
  }
  for (const row of activityRows ?? []) {
    const k = mozDayKey(new Date(row.published_at));
    weekBuckets.set(k, (weekBuckets.get(k) ?? 0) + 1);
  }
  const activity = [...weekBuckets.entries()].map(([k, posts]) => ({
    day: DAY_LABELS[new Date(`${k}T00:00:00.000Z`).getUTCDay()] ?? k.slice(5),
    posts,
  }));

  // 30 dias
  const monthBuckets = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    monthBuckets.set(mozDayKey(new Date(firstMonthDay.getTime() + i * DAY_MS)), 0);
  }
  for (const row of monthlyRows ?? []) {
    const k = mozDayKey(new Date(row.published_at));
    monthBuckets.set(k, (monthBuckets.get(k) ?? 0) + 1);
  }
  const monthlyActivity = [...monthBuckets.entries()].map(([k, posts]) => ({
    day: shortLabel(k),
    posts,
  }));

  // 8 semanas — novos membros
  const membersByWeek: { week: string; count: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const weekStart = new Date(firstWeekDay.getTime() + i * 7 * DAY_MS);
    const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS);
    const count = (memberRows ?? []).filter((r) => {
      const d = new Date(r.created_at);
      return d >= weekStart && d < weekEnd;
    }).length;
    membersByWeek.push({ week: shortLabel(mozDayKey(weekStart)), count });
  }

  return NextResponse.json({
    members: members ?? 0,
    postsToday: postsToday ?? 0,
    activeReports: activeReports ?? 0,
    activeEvents: activeEvents ?? 0,
    activity,
    monthlyActivity,
    membersByWeek,
  });
}
