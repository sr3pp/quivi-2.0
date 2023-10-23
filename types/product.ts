import { Schema } from "mongoose";

export interface Product {
  _id?: string;
  name: string | { type: StringConstructor; required: true };
  web: string | { type: StringConstructor; required: true };
  sae: string | { type: StringConstructor; required: true };
  qty: number | { type: NumberConstructor; required: true };
  priority: number | { type: NumberConstructor; required: true };
  price: number | { type: NumberConstructor; required: true };
  discount: number | { type: NumberConstructor; default: number };
  thumbs: string[] | [{ type: StringConstructor; required: true }];
  description: string | { type: StringConstructor; required: true };
  extra: string | { type: StringConstructor; required: true };
  meassure_unity: string | { type: StringConstructor; required: true };
  line: string | { type: StringConstructor; required: true };
  category: object | { type: typeof Schema.Types.ObjectId; ref: string };
  subcategory: object | { type: typeof Schema.Types.ObjectId; ref: string };
  years: number[] | { type: [Number]; ref: Number };
  car_brands: object[] | [{ type: typeof Schema.Types.ObjectId; ref: string }];
  brand: object | { type: typeof Schema.Types.ObjectId; ref: string };
  models: object[] | [{ type: typeof Schema.Types.ObjectId; ref: string }];
  segment: object | { type: typeof Schema.Types.ObjectId; ref: string };
  motors: object[] | [{ type: typeof Schema.Types.ObjectId; ref: string }];
}
