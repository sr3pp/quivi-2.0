import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createFieldAttribute } from "better-auth/db";
import { MongoClient } from "mongodb";

import type { Auth } from "better-auth";

let authPromise: Promise<Auth> | null = null;

const buildAuth = async () => {
  const config = useRuntimeConfig();
  const secret = config.betterAuth?.secret;
  const mongoUrl = config.public.mongo.url;
  const baseURL =
    config.betterAuth?.baseURL ||
    process.env.BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : undefined);
  if (!secret) {
    throw new Error("Better Auth secret is missing. Set BETTER_AUTH_SECRET.");
  }

  const client = new MongoClient(mongoUrl);
  const db = (await client.connect()).db();

  return betterAuth({
    baseURL,
    secret,
    database: mongodbAdapter(db, {
      // Most standalone Mongo deployments don't support multi-op transactions
      transaction: false,
      usePlural: true,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    user: {
      additionalFields: {
        admin_level: createFieldAttribute("number", { defaultValue: 0 }),
        profile: createFieldAttribute("json", { required: true }),
      },
    },
    session: {
      cookieCache: {
        enabled: true,
      },
    },
  });
};

export const getAuth = async () => {
  if (!authPromise) {
    authPromise = buildAuth();
  }
  return authPromise;
};
