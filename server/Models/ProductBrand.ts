import mongoose, { Schema } from "mongoose";
import Category from "./Category";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: Category },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.models.ProductBrand ||
  mongoose.model("ProductBrand", schema, "product_brand");
