import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "followers" | "following"

  if (type !== "followers" && type !== "following") {
    return NextResponse.json({ error: "type deve ser followers ou following" }, { status: 400 });
  }

  const usernameWithAt = username.startsWith("@") ? username : `@${username}`;
  const db = createAdminClient();

  // Obter o email do perfil alvo
  const { data: profile } = await db
    .from("profiles")
    .select("email")
    .eq("username", usernameWithAt)
    .maybeSingle();

  if (!profile) return NextResponse.json([], { status: 200 });

  let emailList: string[] = [];

  if (type === "followers") {
    // Quem segue este utilizador
    const { data } = await db
      .from("follows")
      .select("follower_email")
      .eq("following_email", profile.email);
    emailList = (data ?? []).map((f) => f.follower_email);
  } else {
    // Quem este utilizador segue
    const { data } = await db
      .from("follows")
      .select("following_email")
      .eq("follower_email", profile.email);
    emailList = (data ?? []).map((f) => f.following_email);
  }

  if (emailList.length === 0) return NextResponse.json([]);

  // Obter perfis completos
  const { data: profiles } = await db
    .from("profiles")
    .select("name, username, city, fandoms, avatar_url")
    .in("email", emailList);

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

  const result = (profiles ?? []).map((p) => {
    const fandom = p.fandoms?.[0] ?? "";
    const inits  = p.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
    return {
      name:      p.name,
      username:  p.username,
      city:      p.city ?? "",
      avatarUrl: p.avatar_url ?? null,
      initials:  inits,
      avatarBg:  FANDOM_BG[fandom] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)",
      fandom,
    };
  });

  return NextResponse.json(result);
}
