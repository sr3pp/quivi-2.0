import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("Subcategory", schema, "subcategory");
