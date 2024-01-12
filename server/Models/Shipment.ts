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
    address: {
      street: { type: String, required: true },
      ext_num: { type: String, required: true },
      int_num: { type: String, required: false },
      neighborhood: { type: String, required: true },
      zip: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
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
