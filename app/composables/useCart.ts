import { processDiscount } from "~/assets/ts/utilities";
import type { Cart, Product } from "~/types";
import { useLocalStorage } from "@vueuse/core";

// Persistent cart state using useLocalStorage for SSR compatibility
const cartProducts = useLocalStorage<Product[]>("cart-products", []);
const cartShipping = useLocalStorage<{ costo: number; limite: number }>(
  "cart-shipping",
  { costo: 0, limite: 0 },
);

const cart = ref<Cart>({
  products: cartProducts.value,
  subtotal: computed((): number => {
    const subtotal = cart.value.products.reduce(
      (acc: number, product: Product) => {
        const price = processDiscount(product);
        return acc + (Number(price) as number) * (product.qty as number);
      },
      0,
    );
    return subtotal;
  }),
  total: computed((): number => {
    return parseFloat(
      (
        cart.value.subtotal +
        (cart.value.shipping.isFree ? 0 : Number(cart.value.shipping.costo))
      ).toFixed(2),
    );
  }),
  shipping: {
    costo: cartShipping.value.costo,
    limite: cartShipping.value.limite,
    isFree: computed((): boolean => {
      return cart.value.subtotal > cart.value.shipping.limite;
    }),
  },
});

const active: Ref<boolean> = ref(false);

export function useCart() {
  function addToCart(product: Product, qty: number) {
    const productExists: Product | undefined = cart.value.products.find(
      (p) => p.web === product.web,
    );

    if (productExists) {
      if ((productExists.qty as number) + (qty as number) > product.existences)
        return;
      (productExists.qty as number) += qty as number;
    } else {
      product.qty = qty;
      cart.value.products.push(product);
    }

    //Migrate to TOAST system
    /* addNotification({
      title: "Producto agregado",
      description: `El producto <b>${product.name}</b> se ha agregado al carrito`,
      status: true,
      clickHandler: () => {
        toggleCart();
      },
    }); */
  }

  function toggleCart() {
    if (active.value) {
      active.value = false;
    } else {
      active.value = true;
    }
  }

  function removeFromCart(product: Product) {
    cart.value.products = cart.value.products.filter(
      (p) => p._id !== product._id,
    );
  }

  function emptyCart() {
    cart.value.products = [];
  }

  function setShippingConfig({
    limite,
    costo,
  }: {
    limite: number;
    costo: number;
  }) {
    cart.value.shipping.limite = limite;
    cart.value.shipping.costo = costo;
    cartShipping.value = { costo, limite };
  }

  function updateQty(product: Product, value: number) {
    const qty = (product.qty as number) + value;
    if (qty > product.existences) {
      return;
    }
    product.qty = qty;
  }

  function syncLocalStorage() {
    cartProducts.value = cart.value.products;
    cartShipping.value = {
      costo: cart.value.shipping.costo,
      limite: cart.value.shipping.limite,
    };
  }

  function getCart() {
    // Cart is automatically loaded from localStorage via useLocalStorage
    cart.value.products = cartProducts.value;
    if (cartShipping.value.costo || cartShipping.value.limite) {
      cart.value.shipping.costo = cartShipping.value.costo;
      cart.value.shipping.limite = cartShipping.value.limite;
    }
  }

  function totalCartProducts() {
    return cart.value.products.reduce((acc, product) => {
      return acc + (product.qty as number);
    }, 0);
  }

  watch(
    () => cart.value.total,
    () => {
      syncLocalStorage();
    },
  );

  return {
    cart,
    active: readonly(active),
    toggleCart,
    addToCart,
    removeFromCart,
    setShippingConfig,
    emptyCart,
    updateQty,
    getCart,
    totalCartProducts: computed(() => totalCartProducts()),
  };
}
