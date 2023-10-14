import mongoose from "mongoose";
const { public: config } = useRuntimeConfig();
export default async () => {
  try {
    await mongoose.connect(config.mongo.url);
    console.log("DB connection established.");
  } catch (err) {
    console.log("DB connection failed.", err);
  }
};
