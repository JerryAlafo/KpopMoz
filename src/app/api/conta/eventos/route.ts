import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  const db = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await db
    .from("event_registrations")
    .select("event_id, events!event_id(id, slug, title, date, start_time, end_time, location, city, is_free, price, cover_bg)")
    .eq("user_email", session.user.email)
    .order("created_at", { ascending: false });

  const past = (data ?? [])
    .map((r) => {
      const e = Array.isArray(r.events) ? r.events[0] : r.events;
      if (!e) return null;
      return {
        id: e.id,
        slug: e.slug,
        title: e.title,
        date: e.date,
        startTime: e.start_time,
        endTime: e.end_time ?? undefined,
        location: e.location,
        city: e.city,
        free: e.is_free,
        price: e.price,
        coverBg: e.cover_bg,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null && e.date < today);

  return NextResponse.json(past);
}
