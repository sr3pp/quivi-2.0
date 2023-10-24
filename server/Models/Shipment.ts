import mongoose from "mongoose";
import Sale from "./Sale";

const schema = new mongoose.Schema(
  {
    sale: { type: mongoose.Schema.Types.ObjectId, ref: Sale },
    tracking: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "shipping", "delivered"],
    },
    address: { type: String, required: true },
    deliver_to: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    cost: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("Shipment", schema, "shipment");
