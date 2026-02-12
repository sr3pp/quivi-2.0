import { Openpay } from "~~/server/utils/openpay";

type OpenpayMethod = "card" | "bank_account" | "store";

interface OpenpayChargePayload {
  method: OpenpayMethod;
  amount: number;
  order_id: string;
  customer: {
    name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  due_date?: number | string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<Partial<OpenpayChargePayload>>(event);

  if (!body || typeof body !== "object") {
    throw createError({ statusCode: 400, statusMessage: "Invalid payload" });
  }

  if (!["card", "bank_account", "store"].includes(String(body.method))) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid payment method",
    });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: "Invalid amount" });
  }

  const orderId = String(body.order_id || "").trim();
  if (!/^[a-zA-Z0-9_-]{6,80}$/.test(orderId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid order id" });
  }

  const customer = body.customer;
  if (
    !customer ||
    typeof customer.name !== "string" ||
    typeof customer.last_name !== "string" ||
    typeof customer.phone_number !== "string" ||
    typeof customer.email !== "string"
  ) {
    throw createError({ statusCode: 400, statusMessage: "Invalid customer" });
  }

  // Force redirect URL and description server-side to prevent tampering.
  const protocol = getRequestProtocol(event, { xForwardedProto: true });
  const host = getRequestHost(event, { xForwardedHost: true });
  const redirectUrl = `${protocol}://${host}/tienda/checkout?order_id=${orderId}`;

  const payload: Record<string, unknown> = {
    method: body.method,
    amount,
    description: `Compra en Quivi.mx. Orden: ${orderId}`,
    order_id: orderId,
    customer: {
      name: customer.name.trim(),
      last_name: customer.last_name.trim(),
      phone_number: customer.phone_number.trim(),
      email: customer.email.trim().toLowerCase(),
    },
    confirm: "false",
    send_email: "false",
    redirect_url: redirectUrl,
  };

  if (body.method === "store" && body.due_date) {
    payload.due_date = body.due_date;
  }

  try {
    const openpay = new Openpay(
      config.openpay.merchantId,
      config.openpay.key,
      config.openpay.url,
    );
    const response = await openpay.charge(payload);
    return response;
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: "Openpay charge failed",
    });
  }
});
