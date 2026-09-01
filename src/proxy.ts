import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rafraîchit la session Supabase sur chaque requête et protège les routes privées.
// Next.js 16 a renommé middleware.ts -> proxy.ts (même API, autre nom de fichier/fonction).
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getClaims() vérifie le JWT (localement si possible) plutôt que de faire confiance aveuglément au cookie.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = !!data?.claims;

  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");

  if (!isAuthenticated && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Exclut les assets statiques, l'optimisation d'images, et les routes d'icône/manifest
    // générées par Next (icon, apple-icon, manifest.webmanifest) — elles ne sont pas
    // sensibles, et le navigateur/OS peut les demander sans cookie de session
    // (ex: onglet du navigateur sur /login, installation "Ajouter à l'écran d'accueil").
    "/((?!_next/static|_next/image|favicon.ico|icon$|apple-icon$|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)",
  ],
};
