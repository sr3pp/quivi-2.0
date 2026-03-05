<template lang="pug">
div.space-y-6
  UDashboardToolbar
    template(#left)
        p.text-sm.text-muted Administra usuarios, ventas, envios y contenido.
    template(#right)
      UButton(
        icon="i-lucide-send"
        label="Test Mail"
        variant="soft"
        :loading="sending"
        @click="testMail"
      )

  UPageGrid(class="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4")
    UCard(
      v-for="item in items"
      :key="item.to"
      :ui="{ body: 'space-y-4' }"
    )
      template(#header)
        .flex.items-center.gap-3
          UIcon(:name="item.icon" class="size-5 text-primary")
          p.font-medium {{ item.label }}
      p.text-sm.text-muted {{ item.description }}
      template(#footer)
        UButton(
          :to="item.to"
          trailing-icon="i-lucide-arrow-right"
          variant="ghost"
          block
          :label="'Ir a ' + item.label"
        )

  UCard
    template(#header)
      p.font-medium Acciones rapidas
    div(class="flex flex-col gap-2 sm:flex-row")
      UButton(
        to="/panel/products"
        icon="i-lucide-package-plus"
        label="Nuevo producto"
        variant="soft"
      )
      UButton(
        to="/panel/sales"
        icon="i-lucide-plus"
        label="Nueva venta"
        variant="soft"
      )
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});

const toast = useToast();
const sending = ref(false);

const items = [
  {
    label: "Users",
    to: "/panel/users",
    icon: "i-lucide-users",
    description: "Gestiona cuentas, permisos y accesos del panel.",
  },
  {
    label: "Ventas",
    to: "/panel/sales",
    icon: "i-lucide-receipt",
    description: "Revisa ventas, detalles de orden y estatus de pago.",
  },
  {
    label: "Envios",
    to: "/panel/shipping",
    icon: "i-lucide-truck",
    description: "Consulta rastreos, actualiza guias y notifica al cliente.",
  },
  {
    label: "Productos",
    to: "/panel/products",
    icon: "i-lucide-package",
    description: "Agrega, edita o elimina productos de tu tienda.",
  }
];

const { public: conf } = useRuntimeConfig();

const testMail = async () => {
  try {
    sending.value = true;
    await $fetch("/api/send-mail", {
      method: "POST",
      body: {
        to: (conf.email as any).testMail,
        subject: "Test",
        template: "test",
        context: {
          name: "Juan",
          description: "Test email",
        },
      },
    });
    toast.add({
      title: "Correo enviado",
      description: "El correo de prueba se envio correctamente.",
      color: "success",
    });
  } catch (error) {
    console.error(error);
    toast.add({
      title: "No se pudo enviar",
      description: "Revisa la configuracion de correo e intenta de nuevo.",
      color: "error",
    });
  } finally {
    sending.value = false;
  }
};
</script>
