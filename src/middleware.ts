export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/feed",
    "/dashboard",
    "/eventos/:path*",
    "/noticias/:path*",
    "/artistas/:path*",
    "/aprender/:path*",
    "/marketplace",
    "/musicas",
    "/talentos/:path*",
    "/pesquisa",
    "/post/:path*",
    "/perfil/:path*",
    "/favoritos",
    "/admin/:path*",
  ],
};
