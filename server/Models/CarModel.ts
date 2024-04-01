import mongoose, { Schema } from "mongoose";
import Motor from "./Motor";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.models.CarModel ||
  mongoose.model("CarModel", schema, "car_model");
