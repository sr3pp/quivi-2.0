export function useCheckout() {
  const { cart } = useCart();

  function handlePayment(kind: string, data: any) {
    console.log(kind, data);
  }

  return {
    handlePayment,
  };
}
