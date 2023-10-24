import mongoose, { Schema } from "mongoose";
import Motor from "./Motor";
import CarBrand from "./CarBrand";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    brand: { type: Schema.Types.ObjectId, ref: CarBrand },
    motors: [{ type: Schema.Types.ObjectId, ref: Motor }],
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("CarModel", schema, "car_model");
