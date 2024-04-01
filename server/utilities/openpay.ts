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
    this.headers.Authorization = `Basic ${btoa(`${this.key}:`)}`;
  }

  charge = async (data: any) => {
    const endpoint = `${this.baseUrl}/charges`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      return response;
    } catch (error) {
      return error;
    }
  };

  getBarcode = async (reference: string) => {
    const endpoint = `${this.baseUrl}/${reference}`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
      });

      return response;
    } catch (error) {
      return error;
    }
  };

  verifyCharge = async (transactionId: string) => {
    const endpoint = `${this.baseUrl}/charges/${transactionId}`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: this.headers,
      });

      return response;
    } catch (error) {
      return error;
    }
  };
}
