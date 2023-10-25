import mongoose, { Schema } from "mongoose";
import CarModel from "./CarModel";
import Motor from "./Motor";

const schema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true },
    hightlight: { type: Boolean, default: false },
    models: [{ type: Schema.Types.ObjectId, ref: CarModel }],
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("CarBrand", schema, "car_brand");
