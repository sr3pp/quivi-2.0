<template lang="pug">
.users
  UContainer(:with-padding="true")
    p.font-bebas.text-3xl Panel users

    UButton(@click="newUser" label="Create user")

    UTable(:columns="columns" :data="users ?? []")

    UModal(v-model:open="modalSw" description="Create or edit user")
      template(#title)
        p.font-bebas.text-3xl {{ userModalTitle }}
      template(#body)
          PanelUserForm(:user="currentUser" :mode="currentUser ? 'edit' : 'create'" @submit="saveUser")

    UModal(v-model:open="passwordModalSw" description="Change user password")
      template(#title)
        p.font-bebas.text-3xl Change password for {{ currentUser?.email }}
      template(#body)
        PanelUserPasswordForm(@submit="savePassword")
</template>

<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { User, UserFormInput, UserPasswordInput } from "~/types";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "panel",
  auth: {
    required: true,
    minAdminLevel: 1,
  },
});

const { data: users, refresh } = await useFetch<User[]>("/api/users");

const modalSw = ref(false);
const passwordModalSw = ref(false);

const currentUser: Ref<User | null> = ref(null);
const userModalTitle = computed(() =>
  currentUser.value ? "Editar usuario" : "Crear usuario",
);
const getUserId = (user: User) => user.id || user._id || "";

const getAdminLevelLabel = (level: number | undefined): string => {
  if (level === undefined) return "Usuario";
  return level === 0 ? "Usuario" : level === 1 ? "Editor" : "Administrador";
};

const columns: TableColumn<User>[] = [
  {
    accessorKey: "profile.name",
    header: "Name",
    cell: ({ row }) => row.original.profile?.name || "",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "admin_level",
    header: "Role",
    cell: ({ row }) => getAdminLevelLabel(row.original.admin_level),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userIndex =
        users.value?.findIndex(
          (u) => getUserId(u) === getUserId(row.original),
        ) ?? -1;
      return h("div", { class: "flex items-center gap-2" }, [
        h(UButton, {
          label: "Password",
          color: "info",
          variant: "ghost",
          size: "sm",
          onClick: () => changePassword(row.original),
        }),
        h(UButton, {
          icon: "i-lucide-edit",
          color: "primary",
          variant: "ghost",
          size: "sm",
          "aria-label": "Edit",
          onClick: () => editUser(row.original),
        }),
        h(UButton, {
          icon: "i-lucide-trash",
          color: "error",
          variant: "ghost",
          size: "sm",
          "aria-label": "Delete",
          onClick: () => deleteUser(getUserId(row.original), userIndex),
        }),
      ]);
    },
    meta: {
      class: {
        td: "text-right",
      },
    },
  },
];

const newUser = () => {
  currentUser.value = null;
  modalSw.value = true;
};

const saveUser = async (_user: UserFormInput) => {
  if (currentUser.value) return updateUser(_user);

  try {
    const payload = {
      name: `${_user.profile?.name ?? ""} ${_user.profile?.lastname ?? ""}`.trim(),
      email: _user.email,
      password: _user.password,
      admin_level: Number(_user.admin_level ?? 0),
      profile: _user.profile,
    };

    const { user } = await $fetch<{ user: User }>("/api/auth/sign-up/email", {
      method: "POST",
      body: payload,
    });

    users.value?.push(user as User);
    modalSw.value = false;
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (id: string, idx: number) => {
  try {
    await $fetch(`/api/users`, {
      method: "DELETE",
      body: { id },
    });

    users.value?.splice(idx, 1);
  } catch (error) {
    console.error(error);
  }
};

const editUser = (user: User) => {
  currentUser.value = user;
  modalSw.value = true;
};

const updateUser = async (_user: UserFormInput) => {
  try {
    const { password_confirmation, ...rest } = _user;
    const user: User = await $fetch<User>(`/api/users`, {
      method: "PUT",
      body: {
        id: currentUser.value ? getUserId(currentUser.value) : "",
        ...rest,
      },
    });

    users.value?.splice(
      users.value.findIndex(
        (u) =>
          getUserId(u) ===
          (currentUser.value ? getUserId(currentUser.value) : ""),
      ),
      1,
      user,
    );
    modalSw.value = false;
  } catch (error) {
    console.error(error);
  }
};

const changePassword = (user: User) => {
  currentUser.value = user;
  passwordModalSw.value = true;
};

const savePassword = async (_password: UserPasswordInput) => {
  try {
    const { password_confirmation, ...rest } = _password;
    await $fetch(`/api/users/password`, {
      method: "PUT",
      body: {
        id: currentUser.value ? getUserId(currentUser.value) : "",
        ...rest,
      },
    });

    passwordModalSw.value = false;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.users {
}
</style>
