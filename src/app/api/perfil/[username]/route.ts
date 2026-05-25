import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const usernameWithAt = username.startsWith("@") ? username : `@${username}`;

  const db = createAdminClient();

  const { data: profile } = await db
    .from("profiles")
    .select("email, name, username, city, bio, fandoms, avatar_url, joined_at")
    .eq("username", usernameWithAt)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  const targetEmail = profile.email;

  const [
    { count: followers },
    { count: following },
    { count: posts },
  ] = await Promise.all([
    db.from("follows").select("*", { count: "exact", head: true }).eq("following_email", targetEmail),
    db.from("follows").select("*", { count: "exact", head: true }).eq("follower_email", targetEmail),
    db.from("feed_posts").select("*", { count: "exact", head: true }).eq("author_email", targetEmail),
  ]);

  // Verifica se o utilizador actual segue este perfil
  const session = await auth();
  let isFollowing = false;
  let isOwnProfile = false;
  if (session?.user?.email) {
    isOwnProfile = session.user.email === targetEmail;
    if (!isOwnProfile) {
      const { data: follow } = await db
        .from("follows")
        .select("id")
        .eq("follower_email", session.user.email)
        .eq("following_email", targetEmail)
        .maybeSingle();
      isFollowing = !!follow;
    }
  }

  // Posts recentes (últimos 6)
  const { data: recentPosts } = await db
    .from("feed_posts")
    .select("id, content, image_url, reactions, comments, tags, published_at, type")
    .eq("author_email", targetEmail)
    .order("published_at", { ascending: false })
    .limit(6);

  return NextResponse.json({
    profile: {
      name:      profile.name,
      username:  profile.username,
      city:      profile.city,
      bio:       profile.bio,
      fandoms:   profile.fandoms ?? [],
      avatarUrl: profile.avatar_url ?? null,
      joinedAt:  profile.joined_at,
      email:     targetEmail,
    },
    stats: {
      followers: followers ?? 0,
      following: following ?? 0,
      posts:     posts     ?? 0,
    },
    isFollowing,
    isOwnProfile,
    recentPosts: recentPosts ?? [],
  });
}
