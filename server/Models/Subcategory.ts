import mongoose, { Schema } from "mongoose";
import Category from "./Category";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: Category },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.models.Subcategory ||
  mongoose.model("Subcategory", schema, "subcategory");
