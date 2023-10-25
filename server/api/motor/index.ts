import Motor from "~/server/Models/Motor";

export default defineEventHandler(async (event) => {
  const motors = await Motor.find().populate("models");
  return motors;
});
