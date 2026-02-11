import type { User } from "./user";

export interface AuthMeta {
  required?: boolean;
  minAdminLevel?: number;
}

export type SessionPayload = {
  session: Record<string, any>;
  user: User;
} | null;
