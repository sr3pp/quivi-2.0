import type { Product } from "~/types";
import { buildOrderId } from "./index";

export class paypalHandler {
  constructor() {}

  async pay(products: Product[], total: number) {
    const productList = products.map((product: Product) => {
      return {
        reference_id: product._id,
        amount: {
          currency_code: "MXN",
          value:
            Number(product.price) -
            Number(
              Number(
                Number(product.price) * (Number(product.discount) / 100),
              ).toFixed(2),
            ),
        },
      };
    });

    const { links }: any = await $fetch("/api/payment/paypal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        order_id: buildOrderId(),
        products: productList,
        total: total,
      },
    });

    window.location = links[1].href;
  }

  async confirm(orderID: string) {
    const response = await $fetch("/api/payment/paypal/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        id: orderID,
      },
    });

    return response;
  }
}
