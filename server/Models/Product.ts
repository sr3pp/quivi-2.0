import mongoose, { Schema } from "mongoose";
import { Product } from "~/types";
import ProductBrand from "./ProductBrand";
import Category from "./Category";
import Subcategory from "./Subcategory";
import CarBrand from "./CarBrand";
import CarModel from "./CarModel";
import Segment from "./Segment";
import Motor from "./Motor";

const schema: Schema<Product> = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 40 },
    web: { type: String, required: true, unique: true },
    sae: { type: String, required: true },
    priority: { type: Number, default: 99 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    thumbs: [{ type: String, required: false }],
    description: { type: String, default: "", maxlength: 200 },
    extra: { type: String, default: "" },
    meassure_unity: { type: String, default: "" },
    line: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: Category },
    subcategory: { type: Schema.Types.ObjectId, ref: Subcategory },
    years: { type: [Number], default: [] },
    car_brands: [{ type: Schema.Types.ObjectId, ref: CarBrand }],
    brand: { type: Schema.Types.ObjectId, ref: ProductBrand },
    models: [{ type: Schema.Types.ObjectId, ref: CarModel }],
    segment: { type: Schema.Types.ObjectId, ref: Segment },
    motors: [{ type: Schema.Types.ObjectId, ref: Motor }],
  },
  { timestamps: true, strict: true, strictQuery: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", schema, "product");
