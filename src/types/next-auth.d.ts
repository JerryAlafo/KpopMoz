import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      city: string;
      bio: string;
      fandoms: string[];
      isAdmin: boolean;
      onboardingComplete: boolean;
    } & DefaultSession["user"];
  }
}
