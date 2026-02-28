import type { OpenpayChargeResponse, OpenpayPayInput } from "~/types";
import { buildOrderId } from "./index";

export class openpayHandler {
  constructor() {}

  async pay(
    data: OpenpayPayInput,
    callback?: (orderId: string, extra?: string) => Promise<void> | void,
  ) {
    const orderId = buildOrderId();
    const {
      paymentMethod,
      total,
      shipmentData,
      shippmentData,
      paymentPlan,
    } = data;
    const shippingData = shipmentData ?? shippmentData;

    if (!shippingData) {
      throw new Error("Missing shipment data");
    }

    const dataObj: Record<string, unknown> = {
      method: paymentMethod.value.includes("card")
        ? "card"
        : paymentMethod.value === "spei"
          ? "bank_account"
          : "store", // switch to store if cash
      amount: total,
      description: `Compra en Quivi.mx. Orden: ${orderId}`,
      order_id: orderId,
      customer: {
        name: shippingData.name,
        last_name: shippingData.last_name,
        phone_number: shippingData.phone,
        email: shippingData.email,
      },
      confirm: "false",
      send_email: "false",
      // Use full origin to avoid protocol/host mismatches in redirects
      redirect_url: `${window.location.origin}/tienda/checkout?order_id=${orderId}`,
    };

    //TODO add payment plan (MSI)
    /*
      if(paymentPlan){
        dataObj.payment_plan = {
          "payments": paymentPlan
        }
      }
    */

    if (paymentMethod.value.includes("cash")) {
      dataObj.due_date = new Date().setDate(new Date().getDate() + 3);
    }

    const response = await $fetch<OpenpayChargeResponse>(
      "/api/payment/openpay",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: dataObj,
      },
    );
    const { payment_method, id } = response;

    // Ensure order persistence callbacks finish before redirect/opening payment pages.
    if (payment_method.url) {
      if (callback) {
        await callback(orderId, id);
      }
      window.location.href = payment_method.url;
    } else if (payment_method.url_spei && callback) {
      await callback(orderId);
      window.open(payment_method.url_spei, "_blank");
    } else if (payment_method.type == "store" && callback) {
      await callback(orderId, payment_method.reference);
    }
  }
}
