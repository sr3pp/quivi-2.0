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
        div(class="space-y-2")
          div(
            class="flex items-center gap-2 border-b border-default pb-2"
            :class="collapsed ? 'justify-center' : ''"
          )
            UAvatar(
              icon="i-lucide-user"
              size="xs"
              :alt="userName"
            )
            div(v-if="!collapsed" class="min-w-0")
              p(class="truncate text-sm font-medium text-highlighted") {{ userName }}
              p(class="truncate text-xs text-muted") {{ userEmail }}

          UButton(
            to="/"
            icon="i-lucide-globe"
            :label="collapsed ? undefined : 'Sitio web'"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="!collapsed"
            :square="collapsed"
          )

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
          template(#right)
            div(class="flex items-center gap-3")
              div(class="hidden text-right md:block")
                p(class="max-w-[220px] truncate text-sm font-medium text-highlighted") {{ userName }}
                p(class="max-w-[220px] truncate text-xs text-muted") {{ userEmail }}
              UButton(
                to="/"
                icon="i-lucide-globe"
                label="Sitio web"
                variant="ghost"
                color="neutral"
              )
              UButton(
                to="/panel"
                icon="i-lucide-house"
                label="Inicio"
                variant="ghost"
                color="neutral"
              )
      template(#body)
        NuxtPage
</template>

<script lang="ts" setup>
import type { SessionPayload } from "~/types";

const route = useRoute();
const authHeaders = process.server ? useRequestHeaders(["cookie"]) : undefined;
const { data: sessionPayload } = await useAsyncData<SessionPayload>(
  "panel-session",
  () =>
    $fetch("/api/auth/get-session", {
      headers: authHeaders,
      credentials: "include",
    }),
  {
    default: () => null,
  },
);

const sections = [
  { label: "Inicio", to: "/panel", icon: "i-lucide-house" },
  { label: "Users", to: "/panel/users", icon: "i-lucide-users" },
  { label: "Productos", to: "/panel/products", icon: "i-lucide-package" },
  { label: "Ventas", to: "/panel/sales", icon: "i-lucide-receipt" },
  { label: "Envios", to: "/panel/shipping", icon: "i-lucide-truck" }
];

const navItems = computed(() =>
  sections.map((item) => ({
    ...item,
    active:
      route.path === item.to ||
      (item.to !== "/panel" && route.path.startsWith(`${item.to}/`)),
  })),
);

const sessionUser = computed(() => sessionPayload.value?.user);
const userName = computed(() => {
  const profile = sessionUser.value?.profile;
  const fromProfile = `${profile?.name ?? ""} ${profile?.lastname ?? ""}`.trim();
  return fromProfile || sessionUser.value?.name || "Usuario";
});
const userEmail = computed(() => sessionUser.value?.email || "sin-correo");

const logout = async () => {
  try {
    await useAuth().logout();
    await navigateTo("/");
  } catch (error) {
    console.error(error);
  }
};
</script>
