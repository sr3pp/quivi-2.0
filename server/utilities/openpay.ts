export class Openpay {
  merchantId = "";
  key = "";

  baseUrl = "";

  headers = {
    "Content-Type": "application/json",
    Authorization: ``,
  };

  constructor(merchantId: string, key: string, url: string) {
    this.merchantId = merchantId;
    this.key = key;

    this.baseUrl = `${url}/${this.merchantId}`;
    // Build Basic auth header without relying on browser-only btoa
    const token = Buffer.from(`${this.key}:`).toString("base64");
    this.headers.Authorization = `Basic ${token}`;
  }

  charge = async (data: any) => {
    const endpoint = `${this.baseUrl}/charges`;
    try {
      const response = await $fetch(endpoint, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getBarcode = async (reference: string) => {
    const endpoint = `${this.baseUrl}/${reference}`;
    try {
      const response = await $fetch(endpoint, { method: "GET" });
      return response;
    } catch (error) {
      throw error;
    }
  };

  verifyCharge = async (transactionId: string) => {
    const endpoint = `${this.baseUrl}/charges/${transactionId}`;
    try {
      const response = await $fetch(endpoint, {
        method: "GET",
        headers: this.headers,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  createWebhook = async (data: any) => {
    const endpoint = `${this.baseUrl}/webhooks`;

    try {
      const response = await $fetch(endpoint, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      return response;
    } catch (error) {
      return error;
    }
  };
}
