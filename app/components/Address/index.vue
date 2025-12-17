<script lang="ts" setup>
import type { Address } from "@/types";
defineProps({
  address: {
    type: Object,
    default: (): Address => ({
      street: "",
      ext_num: "",
      int_num: "",
      neighborhood: "",
      zip: "",
      city: "",
      state: "",
      country: "",
    }),
  },
});
</script>

<template lang="pug">
.address
  SrText(text="Direccion" class="subtitle" tag="h2")
  SrText(:text="`${address.street} ${address.ext_num} ${address.int_num}`")
  SrText(:text="`${address.neighborhood}`")
  SrText(:text="`${address.zip} ${address.city}, ${address.state}`")
  SrText(:text="`${address.country}`")

</template>

<style lang="scss"></style>
