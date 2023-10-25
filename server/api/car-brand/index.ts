import CarBrand from "~/server/Models/CarBrand";

export default defineEventHandler(async (event) => {
  const carBrands = await CarBrand.find().populate("models");

  return carBrands;
});
