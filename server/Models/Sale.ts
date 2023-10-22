import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    order_no: { type: String, required: true, unique: true },
    sae_order: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true, default: false },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
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
      ref: "Bill",
      default: null,
      required: false,
    },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("Sale", schema, "sale");
