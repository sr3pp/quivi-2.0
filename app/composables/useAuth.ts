import type { SessionPayload } from "~/types";

export const useAuth = () => {
  const sessionState = useState<SessionPayload>("auth-session", () => null);
  const fetched = useState<boolean>("auth-session-fetched", () => false);

  const fetchSession = async () => {
    try {
      const data = await $fetch<SessionPayload>("/api/auth/get-session", {
        credentials: "include",
      });
      sessionState.value = data;
      fetched.value = true;
      return data;
    } catch (err) {
      sessionState.value = null;
      fetched.value = true;
      return null;
    }
  };

  const ensureSession = async () => {
    if (!fetched.value) {
      return await fetchSession();
    }
    return sessionState.value;
  };

  // Autofetch on client once
  if (process.client && !fetched.value) {
    fetchSession().catch(() => {});
  }

  const login = async (email: string, password: string) => {
    await $fetch("/api/auth/sign-in/email", {
      method: "POST",
      body: { email, password },
      credentials: "include",
    });
    await fetchSession();
    useRouter().push("/panel");
  };

  const logout = async () => {
    await $fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    sessionState.value = null;
    fetched.value = true;
  };

  const isLoggedIn = computed(() => !!sessionState.value);

  return {
    session: sessionState,
    isLoggedIn,
    login,
    logout,
    fetchSession,
    ensureSession,
  };
};
