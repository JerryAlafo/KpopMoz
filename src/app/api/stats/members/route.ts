import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const FANDOM_BG: Record<string, string> = {
  ARMY:    "linear-gradient(135deg,#7B65C8,#ffd23f)",
  BLINK:   "linear-gradient(135deg,#3a5cff,#7B65C8)",
  STAY:    "linear-gradient(135deg,#0a0a0a,#3a5cff)",
  ONCE:    "linear-gradient(135deg,#ffd23f,#7af0c8)",
  MOA:     "linear-gradient(135deg,#3a5cff,#9580D6)",
  CARAT:   "linear-gradient(135deg,#ffd23f,#7B65C8)",
  ATINY:   "linear-gradient(135deg,#7af0c8,#3a5cff)",
  Bunnies: "linear-gradient(135deg,#7af0c8,#ffd23f)",
};

export async function GET() {
  const db = createAdminClient();
  const { data } = await db
    .from("profiles")
    .select("email, name, username, fandoms")
    .order("created_at", { ascending: false })
    .limit(5);

  const members = (data ?? []).map((p) => {
    const fandom: string = p.fandoms?.[0] ?? "";
    const inits = p.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
    return {
      email:    p.email,
      name:     p.name,
      username: p.username,
      fandom,
      initials: inits,
      bg:       FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
    };
  });

  return NextResponse.json(members);
}
