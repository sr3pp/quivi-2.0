export const buildOrderId = () =>
  Date.now().toString() + Math.floor(Math.random() * 10000).toString();
