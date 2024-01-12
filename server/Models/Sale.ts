import mongoose from "mongoose";
import Bill from "./Bill";
import Product from "./Product";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: Product },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 },
        discount: { type: Number, required: true, default: 0 },
      },
    ],
    order_no: { type: String, required: true, unique: true },
    sae_order: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true, default: false },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },
    payment: {
      transaction: { type: String, required: true, unique: true },
      method: {
        type: String,
        required: true,
        enum: ["card", "cash", "transfer"],
      },
      status: { type: Boolean, required: true, default: false },
      installments: { type: Number, required: true, default: 1 },
    },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Bill,
      default: null,
      required: false,
    },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("Sale", schema, "sale");
