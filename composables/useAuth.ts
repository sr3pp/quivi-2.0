import type { CookieRef } from "#app";
import type { User } from "~/types";

export const useAuth = () => {
  const defaultLogin = {
    isLoggedIn: false,
    token: "",
    user: {
      id: "",
      name: "",
      email: "",
    },
  };

  const cookie: CookieRef<typeof defaultLogin> = useCookie("auth", {
    default: () => defaultLogin,
  });

  const login = async (user: User, token: string) => {
    cookie.value = {
      isLoggedIn: true,
      token,
      user: user as any,
    };

    useRouter().push("/panel");
  };

  const logout = async () => (cookie.value = defaultLogin);

  const isLoggedIn = cookie.value.isLoggedIn;

  return {
    cookie,
    login,
    logout,
    isLoggedIn,
  };
};
