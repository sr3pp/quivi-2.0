import { Bill, Shipment, Sale } from "~~/server/Models/index";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const { billing, shipping, user } = data;

    // separate data into bill, shipment and sale
    const sale: any = { ...data };
    delete sale.shipping;

    if (sale?.order_no) {
      const existing = await Sale.findOne({ order_no: sale.order_no });
      if (existing) {
        return existing;
      }
    }

    if ("billing" in sale) {
      delete sale.billing;
      billing.address.country = "MX";
      const billed: any = await Bill.create(billing);
      sale.bill = billed._id;
    }

    if (shipping?.address) {
      shipping.address.country = "MX";
    }
    shipping.cost = 0;
    shipping.status = "pending";

    // create the shipment
    const shipped: any = await Shipment.create(shipping);
    sale.shipment = shipped._id;
    if (user) {
      sale.user = user._id;
    }

    // Openpay flows must always start as unpaid. Payment completion is verified server-side.
    const paymentMethod = String(sale?.payment?.method || "");
    if (paymentMethod !== "PYP") {
      sale.status = false;
      if (sale.payment) {
        sale.payment.status = false;
        sale.payment.transaction = "";
      }
    }

    const sold = await Sale.create(sale);
    return sold;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Order creation failed",
    });
  }
});
