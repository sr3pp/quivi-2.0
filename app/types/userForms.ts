import type { User } from "./user";

export interface UserFormInput {
  email: string;
  admin_level: number;
  profile: User["profile"];
  password?: string;
  password_confirmation?: string;
}

export interface UserPasswordInput {
  password: string;
  password_confirmation?: string;
}
