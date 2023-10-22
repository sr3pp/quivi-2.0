import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true },
    hightlight: { type: Boolean, default: false },
    motors: [{ type: Schema.Types.ObjectId, ref: "Motor" }],
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("CarBrand", schema, "car_brand");
