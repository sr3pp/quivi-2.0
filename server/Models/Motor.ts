import mongoose from "mongoose";
import CarModel from "./CarModel";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    models: [{ type: mongoose.Schema.Types.ObjectId, ref: CarModel }],
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.models.Motor ||
  mongoose.model("Motor", schema, "motor");
