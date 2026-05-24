import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createAdminClient, supabase } from "@/lib/supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        });
        if (error || !data.user) return null;
        return { id: data.user.id, email: data.user.email! };
      },
    }),
  ],

  pages: {
    signIn: "/entrar",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;
      if (account?.provider !== "google" || !user.email) return true;

      const db = createAdminClient();
      const { data } = await db
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (!data) {
        const base = user.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
        await db.from("profiles").insert({
          email: user.email,
          name: user.name ?? "Utilizador",
          username: `@${base}`,
          avatar_url: user.image ?? null,
        });
      }
      return true;
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      const db = createAdminClient();
      const { data: profile } = await db
        .from("profiles")
        .select("id, name, username, city, bio, fandoms, is_admin, avatar_url")
        .eq("email", session.user.email)
        .maybeSingle();

      if (profile) {
        session.user.id       = profile.id;
        session.user.name     = profile.name;
        session.user.username = profile.username;
        session.user.city     = profile.city;
        session.user.bio      = profile.bio;
        session.user.fandoms  = profile.fandoms ?? [];
        session.user.isAdmin  = profile.is_admin;
        session.user.image    = profile.avatar_url ?? session.user.image;
      }
      return session;
    },
  },
});
