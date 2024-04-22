import { Shipment } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const shipping = await Shipment.findByIdAndUpdate(data._id, data);
  return shipping;
});
