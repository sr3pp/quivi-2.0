<script lang="ts" setup>
import { toPrice, processDiscount } from "~/assets/ts/utilities";

const { params } = useRoute();
const { _id } = params;

const product: any = await $fetch(`/api/product/${_id}`);
const relatedProducts = await $fetch(
  `/api/product/hightlights?brand=${product.brand.name}`,
);

const notifications: any = useState("notifications", () => []);

const detailExcludes = [
  "__v",
  "discount",
  "description",
  "_id",
  "name",
  "price",
  "thumbs",
  "web",
  "priority",
  "sae",
  "createdAt",
  "updatedAt",
];

const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
  subtotal: 0,
  shipping: {
    costo: 0,
    limite: 0,
  },
});

const addToCart = () => {
  const productExists = cart.value.products.find(
    (p: any) => p.web === product.value.web,
  );

  if (productExists) {
    productExists.qty++;
  } else {
    product.value.qty = 1;
    cart.value.products.push(product.value);
  }

  notifications.value.push({
    title: "Producto agregado",
    description: `El producto <b>${product.value.name}</b> se ha agregado al carrito`,
    status: true,
  });
};

const sliderOptions = {
  slidesPerView: 4,
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: true,
  loop: true,
  creative: {
    prev: {
      shadow: false,
      translate: ["-20%", 0, -1],
    },
    next: {
      translate: ["100%", 0, 0],
    },
  },
};

const printValue = (value: any) => {
  if (Array.isArray(value)) {
    if (typeof value[0] === "object") {
      return value.map((v: any) => v.name).join(", ");
    } else {
      return value.join(", ");
    }
  } else if (typeof value === "object") {
    return value.name;
  } else {
    return String(value);
  }
};
</script>

<template lang="pug">
.product-detail

    SrContainer(:with-padding="true")
        SrGrid
            SrGridColumn(:size="{mobile: '1', sm: '2/5'}")
              ProductThumbs(:thumbs="product.thumbs" :productName="product.name" :productId="product.web")
            SrGridColumn(:size="{mobile: '1', sm: '3/5'}")
                .product-detail-info(v-if="product")
                    SrText(:text="product.name" class="title")
                    SrText(:text="`Refaccion: ${product.web}`" class="subtitle")
                    SrText(:text="product.extra")

                    .product-detail-price
                        .price-container
                          SrText(:text="processDiscount(product)" class="title" v-if="product.discount")
                          SrText.discount(:text="toPrice(product.price)" class="subtitle")
                        SrText(text="Solicitar informacion")
                    .product-detail-actions
                        QuiviButton(@click="addToCart(product)" label="Agregar al carrito")
                        QuiviButton(href="/" label="Ir a la tienda")
            SrGridColumn(:size="{mobile: '1', sm: '1/2'}" class="column")
                SrText(text="ESPECIFICACIONES DEL PRODUCTO" class="title")
                ul.product-detail-details
                    template(v-for="([key, value], i) in Object.entries(product)")
                        li.product-detail-detail(v-if="!detailExcludes.includes(key)" :key="i")
                            SrText.label(:text="`${key}:`")
                            SrText(:text="printValue(value)")
            SrGridColumn(:size="{mobile: '1', sm: '1/2'}" class="column")
                SrText(text="DESCRIPCION DEL PRODUCTO" class="title")
                SrText(:text="product.description")

    SrContainer(:with-padding="true")
        SrText(value="PRODUCTOS RELACIONADOS" class="title")
    SliderProducts(:options="sliderOptions" :products="relatedProducts")
</template>

<style lang="scss" scoped>
.product-detail {
  &-info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    > * {
      &:not(:last-child) {
        margin-bottom: pxToRem(20);
      }
    }
  }

  &-price {
    display: flex;
    justify-content: space-between;

    .price-container {
      width: 100%;
    }

    .discount {
      color: $color-quivi-red;
      text-decoration: line-through;
    }
  }

  &-actions {
    display: flex;
  }

  &-detail {
    display: flex;

    &:not(:last-child) {
      margin-bottom: pxToRem(10);
    }

    .label {
      margin-right: pxToRem(6);
      font-weight: bold;
      text-transform: capitalize;
    }
  }
}
</style>
