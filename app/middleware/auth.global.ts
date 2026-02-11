import type { AuthMeta } from "~/types";

export default defineNuxtRouteMiddleware(async (to) => {
  const authMeta = (to.meta.auth || {}) as AuthMeta;

  const needsAuth = authMeta.required || to.path.startsWith("/panel");
  if (!needsAuth) return;

  // Server: validate via API with forwarded cookies before rendering to avoid hydration mismatch
  if (process.server) {
    const headers = useRequestHeaders(["cookie"]);
    const rawCookie = headers.cookie || "";
    const hasSessionToken = rawCookie.includes("better-auth.session_token");
    if (!hasSessionToken) {
      return navigateTo("/", { redirectCode: 302 });
    }
    try {
      const session = await $fetch("/api/auth/get-session", {
        headers,
        credentials: "include",
      });
      const requiredLevel = authMeta.minAdminLevel ?? 0;
      const userLevel = (session as any)?.user?.admin_level ?? 0;
      if (!session || requiredLevel > userLevel) {
        return navigateTo("/", { redirectCode: 302 });
      }
      return;
    } catch {
      return navigateTo("/", { redirectCode: 302 });
    }
  }

  // Client: reuse composable cache
  try {
    const { ensureSession, isLoggedIn, session } = useAuth();
    await ensureSession();
    if (!isLoggedIn.value) {
      return navigateTo("/");
    }
    const requiredLevel = authMeta.minAdminLevel ?? 0;
    const userLevel = (session.value as any)?.user?.admin_level ?? 0;
    if (requiredLevel > userLevel) {
      return navigateTo("/");
    }
  } catch {
    return navigateTo("/");
  }
});
