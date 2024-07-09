import { buildOrderId } from "./index";

export class openpayHandler {
  constructor() {}

  async pay(data: any, callback?: Function) {
    const orderId = buildOrderId();
    const { paymentMethod, total, shippmentData, paymentPlan } = data;
    const dataObj: any = {
      method: paymentMethod.value.includes("card") ? "card" : "store", // switch to store if cash
      amount: total,
      description: `Compra en Quivi.mx. Orden: ${orderId}`,
      order_id: orderId,
      customer: {
        name: shippmentData.name,
        last_name: shippmentData.last_name,
        phone_number: shippmentData.phone,
        email: shippmentData.email,
      },
      confirm: "false",
      send_email: "false",
      redirect_url: `${window.location.host}/tienda/checkout?order_id=${orderId}`,
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

    const response = await $fetch("/api/payment/openpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: dataObj,
    });
    const { payment_method, status, id }: any = response;

    if (payment_method.url) {
      window.location.href = payment_method.url;
    } else if (payment_method.type == "store" && callback) {
      callback(orderId, payment_method.reference);
    }
  }
}
