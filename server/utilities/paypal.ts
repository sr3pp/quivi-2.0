import { Product } from "~/types";

export class Paypal {
  baseUrl = "";
  client = "";
  secret = "";
  token = "";
  constructor(baseUrl: string, client: string, secret: string) {
    this.baseUrl = baseUrl;
    this.client = client;
    this.secret = secret;
  }

  async getToken() {
    const { access_token }: any = await $fetch(
      `${this.baseUrl}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${this.client}:${this.secret}`)}`,
        },
        body: "grant_type=client_credentials",
      },
    );
    this.token = access_token;
  }

  async createOrder(products: Product[], order_id: string, total: number) {
    const return_url = `${process.env.APP_URL}/tienda/checkout?order_id=${order_id}`;

    const order = {
      intent: "CAPTURE",
      purchase_units: products,
      payment_source: {
        paypal: {
          experience_context: {
            user_action: "PAY_NOW",
            return_url,
          },
        },
      },
    };

    try {
      const response = await $fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(order),
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async confirmOrder(paypal_order_id: string) {
    // test order id: 20C72244HS751980G
    const url = `${this.baseUrl}/v2/checkout/orders/${paypal_order_id}`;
    const response = await $fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    return response;
  }
}
