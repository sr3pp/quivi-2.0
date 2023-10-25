import CarModel from "~/server/Models/CarModel";

export default defineEventHandler(async (event) => {
  const CarModels = await CarModel.find();
  return CarModels;
});
