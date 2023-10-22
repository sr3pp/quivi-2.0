import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    sale: { type: Schema.Types.ObjectId, ref: "Sale" },
    name: { type: String, required: true },
    address: { type: String, required: true },
    cfdi: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    regime: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.model("Bill", schema, "bill");
