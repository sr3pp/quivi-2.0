import mongoose from "mongoose";

let dbConnectionPromise: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;

  if (!dbConnectionPromise) {
    const config = useRuntimeConfig();
    const mongoUrl = config.public.mongo.url;

    if (!mongoUrl) {
      throw new Error("Mongo URL is missing. Set MONGO_URL.");
    }

    dbConnectionPromise = mongoose.connect(mongoUrl).catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });
  }

  await dbConnectionPromise;
  return mongoose;
};

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    if (!event.path?.startsWith("/api/")) return;
    await connectToDatabase();
  });
});
