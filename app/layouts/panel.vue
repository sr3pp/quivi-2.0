<template lang="pug">
UDashboardGroup
  div.flex.flex-1
    UDashboardSidebar(
      resizable
      collapsible
      :min-size="14"
      :default-size="18"
      :max-size="24"
      :ui="{ footer: 'border-t border-default' }"
    )
      template(#header="{ collapsed }")
        NuxtLink(
          to="/panel"
          class="flex w-full items-center truncate font-semibold text-highlighted"
          :class="collapsed ? 'justify-center' : 'justify-start'"
        )
          span(v-if="collapsed") Q
          span(v-else) Quivi Panel
        UDashboardSidebarCollapse

      template(#default="{ collapsed }")
        UNavigationMenu(
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
          class="w-full"
        )

      template(#footer="{ collapsed }")
        UButton(
          icon="i-lucide-log-out"
          :label="collapsed ? undefined : 'Logout'"
          color="neutral"
          variant="ghost"
          class="w-full"
          :block="!collapsed"
          :square="collapsed"
          @click="logout"
        )

    UDashboardPanel
      template(#header)
        UDashboardNavbar(title="Panel")
      template(#body)
        NuxtPage
</template>

<script lang="ts" setup>
const route = useRoute();

const sections = [
  { label: "Users", to: "/panel/users", icon: "i-lucide-users" },
  { label: "Productos", to: "/panel/products", icon: "i-lucide-package" },
  { label: "Ventas", to: "/panel/sales", icon: "i-lucide-receipt" },
  { label: "Envios", to: "/panel/shipping", icon: "i-lucide-truck" },
  {
    label: "Configuracion",
    to: "/panel/config",
    icon: "i-lucide-settings",
  },
  { label: "Negocio", to: "/panel/business", icon: "i-lucide-briefcase" },
];

const navItems = computed(() =>
  sections.map((item) => ({
    ...item,
    active:
      route.path === item.to ||
      (item.to !== "/panel" && route.path.startsWith(`${item.to}/`)),
  })),
);

const logout = async () => {
  try {
    await useAuth().logout();
    await navigateTo("/");
  } catch (error) {
    console.error(error);
  }
};
</script>
