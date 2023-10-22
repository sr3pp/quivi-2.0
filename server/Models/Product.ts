import mongoose, { Schema } from "mongoose";
import { Product } from "~/types";

const schema: Schema<Product> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    sae: { type: String, required: true },
    priority: { type: Number, required: true },
    price: { type: Number, required: true },
    thumbs: [{ type: String, required: true }],
    description: { type: String, required: true },
    extra: { type: String, required: true },
    meassure_unity: { type: String, required: true },
    hightlight: { type: Boolean, required: true },
    line: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    car_brands: [{ type: Schema.Types.ObjectId, ref: "CarBrand" }],
    brand: { type: Schema.Types.ObjectId, ref: "ProductBrand" },
    models: [{ type: Schema.Types.ObjectId, ref: "CarModel" }],
    segment: { type: Schema.Types.ObjectId, ref: "Segment" },
    motors: [{ type: Schema.Types.ObjectId, ref: "Motor" }],
  },
  { timestamps: true, strict: true, strictQuery: true },
);

export default mongoose.model("Product", schema, "product");
