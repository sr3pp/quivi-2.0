import { processDiscount } from "~/assets/ts/utilities";
import type { Cart, Product } from "~/types";

const cart = ref<Cart>({
  products: [],
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
    return (
      cart.value.subtotal +
      (cart.value.shipping.isFree ? 0 : Number(cart.value.shipping.costo))
    );
  }),
  shipping: {
    costo: 0,
    limite: 0,
    isFree: computed((): boolean => {
      return cart.value.subtotal > cart.value.shipping.limite;
    }),
  },
});

const active: Ref<boolean> = ref(false);

export function useCart() {
  const { addNotification } = useNotification();
  function addToCart(product: Product, qty: number) {
    const productExists: Product | undefined = cart.value.products.find(
      (p: any) => p.web === product.web,
    );

    if (productExists) {
      if ((productExists.qty as number) + (qty as number) > product.existences)
        return;
      (productExists.qty as number) += qty as number;
    } else {
      product.qty = qty;
      cart.value.products.push(product);
    }

    addNotification({
      title: "Producto agregado",
      description: `El producto <b>${product.name}</b> se ha agregado al carrito`,
      status: true,
      clickHandler: () => {
        toggleCart();
      },
    });
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
  }

  function updateQty(product: Product, value: number) {
    const qty = (product.qty as number) + value;
    if (qty > product.existences) {
      return;
    }
    product.qty = qty;
  }

  function syncLocalStorage() {
    localStorage.setItem("cart-products", JSON.stringify(cart.value.products));
    localStorage.setItem(
      "cart-shipping",
      JSON.stringify({
        costo: cart.value.shipping.costo,
        limite: cart.value.shipping.limite,
      }),
    );
  }

  function getCart() {
    if (process.client) {
      const products = localStorage.getItem("cart-products");
      if (products) {
        cart.value.products = JSON.parse(products);
      }
      const shipping = localStorage.getItem("cart-shipping");
      if (shipping) {
        const { costo, limite } = JSON.parse(shipping);
        setShippingConfig({ costo, limite });
      }
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
