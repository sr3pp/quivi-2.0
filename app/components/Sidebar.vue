<template lang="pug">
aside(class="relative z-3 flex h-screen w-[3.125rem] items-center bg-[var(--color-quivi-darkest-red)] text-[var(--color-white)]")
  nav(class="absolute left-1/4 top-1/2 -translate-y-1/2")
    ul(class="flex flex-col")
      li(
        v-for="(item, i) in items"
        :key="i"
        class="group flex h-[3.125rem] items-center"
      )
        NuxtLink(
          :to="item.url"
          class="flex items-center bg-transparent text-current"
        )
          SvgIcon(class="mr-1 h-[1.5625rem] w-[1.5625rem] shrink-0 max-w-none")
          span(
            class="relative ml-2.5 max-w-0 overflow-hidden rounded-[0.3125rem] bg-[var(--color-quivi-light-red)] text-[var(--color-white)] transition-[max-width,padding] duration-300 ease-in-out group-hover:max-w-[12.5rem] group-hover:overflow-visible group-hover:p-2.5 before:absolute before:right-full before:top-1/2 before:h-2.5 before:w-2.5 before:translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-[var(--color-quivi-light-red)] before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out group-hover:before:opacity-100"
          ) {{ item.label }}
      li(class="group flex h-[3.125rem] items-center")
        button(
          @click="logout"
          class="flex items-center border-0 bg-transparent text-current"
        )
          SvgIcon(name="logout-o" class="mr-1 h-[1.5625rem] w-[1.5625rem] shrink-0 max-w-none")
          span(
            class="relative ml-2.5 max-w-0 overflow-hidden rounded-[0.3125rem] bg-[var(--color-quivi-light-red)] text-[var(--color-white)] transition-[max-width,padding] duration-300 ease-in-out group-hover:max-w-[12.5rem] group-hover:overflow-visible group-hover:p-2.5 before:absolute before:right-full before:top-1/2 before:h-2.5 before:w-2.5 before:translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-[var(--color-quivi-light-red)] before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out group-hover:before:opacity-100"
          ) Logout
</template>

<script lang="ts" setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const logout = async () => {
  try {
    await useAuth().logout();
    useRouter().push("/");
  } catch (error) {
    console.error(error);
  }
};
</script>
