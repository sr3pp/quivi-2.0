import { modelPagination } from "~/server/utilities";
import { Shipment } from "../../Models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { search, filters, limit = 10, perPage = 10 }: any = query;
  const data = modelPagination(
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

  return data;
});
