import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const events = (data ?? []).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    type: row.type as string,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: (row.end_time ?? undefined) as string | undefined,
    location: row.location as string,
    city: row.city as string,
    description: row.description as string,
    capacity: (row.capacity ?? undefined) as number | undefined,
    registered: row.registered as number,
    free: row.is_free as boolean,
    price: row.price as number,
    organizer: row.organizer as string,
    coverBg: row.cover_bg as string,
  }));

  return NextResponse.json(events);
}
