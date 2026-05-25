import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createAdminClient, supabase } from "@/lib/supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId:     process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email:    { label: "Email",         type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email:    credentials.email    as string,
            password: credentials.password as string,
          });
          if (error || !data.user) return null;
          return { id: data.user.id, email: data.user.email! };
        } catch {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/entrar",
  },

  callbacks: {
    async signIn({ user, account }) {
      // Credentials: validação já feita no authorize()
      if (account?.provider === "credentials") return true;
      // Outros providers sem email: deixa passar
      if (!user.email) return true;

      // Google: criar perfil se não existir
      if (account?.provider === "google") {
        try {
          const db = createAdminClient();
          const { data } = await db
            .from("profiles")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();

          if (!data) {
            const base = user.email
              .split("@")[0]
              .replace(/[^a-z0-9]/gi, "")
              .toLowerCase();
            await db.from("profiles").insert({
              email:               user.email,
              name:                user.name  ?? "Utilizador",
              username:            `@${base}`,
              avatar_url:          user.image ?? null,
              onboarding_complete: false,
            });
          }
        } catch (err) {
          // Regista o erro mas não bloqueia o login
          console.error("[auth] signIn callback error:", err);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // Na primeira chamada (login), `user` está presente
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (!session.user) return session;

      // Garante que o email vem do token JWT
      if (token.email) {
        session.user.email = token.email;
      }

      // Enriquece com dados do perfil Supabase
      if (session.user.email) {
        try {
          const db = createAdminClient();
          const { data: profile } = await db
            .from("profiles")
            .select("id, name, username, city, bio, fandoms, is_admin, onboarding_complete, avatar_url")
            .eq("email", session.user.email)
            .maybeSingle();

          if (profile) {
            session.user.id                 = profile.id;
            session.user.name               = profile.name;
            session.user.username           = profile.username;
            session.user.city               = profile.city;
            session.user.bio                = profile.bio;
            session.user.fandoms            = profile.fandoms ?? [];
            session.user.isAdmin            = profile.is_admin;
            session.user.onboardingComplete = profile.onboarding_complete;
            session.user.image              = profile.avatar_url ?? session.user.image;
          }
        } catch (err) {
          console.error("[auth] session callback error:", err);
        }
      }
      return session;
    },
  },
});
