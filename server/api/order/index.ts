import { Bill, Shipment, Sale } from "../../Models/index";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  // separete the data from the request in bill, shipment and sale
  const { billing, shipping, user } = data;

  const sale = { ...data };
  delete sale.shipping;

  if ("billing" in sale) {
    delete sale.billing;
    // create the bill
    billing.address.country = "MX";
    console.log("------------ the bill ------------", billing);
    const billed: any = await Bill.create(billing);
    sale.bill = billed._id;
  }

  console.log("------------ the shipment ------------", shipping);
  console.log("------------ the sale ------------", sale);
  console.log("------------ the user ------------", user);

  shipping.address.country = "MX";
  shipping.cost = 0;
  shipping.status = "pending";

  // create the shipment
  const shipped: any = await Shipment.create(shipping);
  // create the sale
  sale.shipment = shipped._id;
  if (user) {
    sale.user = user._id;
  }

  const sold = Sale.create(sale);
  // return the sale
  return sold;
});
