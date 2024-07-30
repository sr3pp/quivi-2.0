import type { CookieRef } from "#app";
import type { User } from "~/types";

export const useAuth = () => {
  const defaultLogin = {
    token: "",
    user: {
      id: "",
      name: "",
      email: "",
    },
  };

  const LoggedInCookie = useCookie("isLoggedIn", {
    default: () => false,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    sameSite: "strict",
  });

  const authCookie: CookieRef<typeof defaultLogin> = useCookie("auth", {
    default: () => defaultLogin,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    sameSite: "strict",
  });

  const login = async (user: User, token: string) => {
    authCookie.value = {
      token,
      user: user as any,
    };
    LoggedInCookie.value = true;
    useRouter().push("/panel");
  };

  const logout = async () => {
    authCookie.value = defaultLogin;
    LoggedInCookie.value = false;
  };

  const isLoggedIn = LoggedInCookie.value;

  return {
    login,
    logout,
    isLoggedIn,
  };
};
