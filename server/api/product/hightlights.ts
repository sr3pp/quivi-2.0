import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { brand } = getQuery(event);
  const products: Product[] = await ProductModel.find({
    hightlight: true,
    brand,
  });

  console.log(products);

  return [
    {
      name: "producto 1",
    },
    {
      name: "producto 2",
    },
    {
      name: "producto 3",
    },
    {
      name: "producto 4",
    },
    {
      name: "producto 5",
    },
  ];
});
