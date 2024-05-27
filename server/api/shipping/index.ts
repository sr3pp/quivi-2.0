import { modelPagination } from "~/server/utilities";
import { Shipment } from "../../Models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { search, filters, limit = 10, perPage = 10 }: any = query;
  const data = await modelPagination(
    Shipment,
    {},
    [],
    [
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
    "shipping",
    query,
    "",
  );

  data.shipping = data.shipping.map((el: any) => {
    if (el.sale.length) {
      el.order = el.sale.at(0).sae_order;
    }
    return el;
  });

  return data;
});
