import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const [{ count: members }, { count: events }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
  ]);
  return NextResponse.json({ members: members ?? 0, events: events ?? 0 });
}
