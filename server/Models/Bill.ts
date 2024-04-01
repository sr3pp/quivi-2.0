import mongoose, { Schema } from "mongoose";

const billSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
    cfdi: { type: String, required: false },
    rfc: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    regime: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, strict: true, strictQuery: true },
);
export default mongoose.models.Bill ||
  mongoose.model("Bill", billSchema, "bill");
