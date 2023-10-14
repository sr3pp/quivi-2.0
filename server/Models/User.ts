import mongoose, { Schema } from "mongoose";
import bcrypt from "mongoose-bcrypt";
import { User } from "~/types";

const schema: Schema<User> = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, bcrypt: true, select: false },
    admin_level: { type: Number, default: 0 },
    profile: {
      name: { type: String, required: true },
      lastname: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
schema.plugin(bcrypt);
export default mongoose.model("User", schema, "user");
