import mongoose from "mongoose";
import { Shipment, Sale } from "~/server/Models";
import { modelPagination } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { search, filters, limit = 10, perPage = 10 }: any = query;

  if (!search) {
    return await modelPagination(
      Shipment,
      {},
      [],
      [],
      limit,
      perPage,
      "shipment",
      query,
      "",
    );
  }

  const data = await Sale.find({
    $or: [
      { "shipment.tracking.number": { $regex: search, $options: "i" } },
      { order_no: { $regex: search, $options: "i" } },
      { sale_order: { $regex: search, $options: "i" } },
    ],
  });

  const shipment_ids = data.map(
    (sale: any) => new mongoose.Types.ObjectId(sale.shipment),
  );

  const _data = await modelPagination(
    Shipment,
    {},
    [],
    [
      {
        $match: { _id: { $in: shipment_ids } },
      },
      {
        $lookup: {
          from: "sale",
          localField: "_id",
          foreignField: "shipment",
          as: "sale",
        },
      },
    ],
    limit,
    perPage,
    "shipment",
    query,
    "",
  );

  _data.shipment = _data.shipment.map((el: any) => {
    if (el.sale.length) {
      el.order = el.sale.at(0).sae_order;
    }
    return el;
  });

  return _data;
});
