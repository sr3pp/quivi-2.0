import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    tracking: {
      store: { type: String, required: false },
      number: { type: String, required: false },
      url: { type: String, required: false },
    },
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
    cost: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.models.Shipment ||
  mongoose.model("Shipment", schema, "shipment");
