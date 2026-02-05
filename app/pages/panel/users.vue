<template lang="pug">
.users
  UContainer(:with-padding="true")
    SrText(value="Panel users" class="title" alignment="center")

    button(@click="newUser") Create user

    table
      tbody
        tr(v-for="(user, i) in users" :key="i")
          td {{ user.profile.name }}
          td {{ user.email }}
          td {{ user.admin_level == 0 ? "Usuario" : user.admin_level == 1 ? "Editor" : "Administrador" }}
          td {{ user.created_at }}
          td {{ user.updated_at }}
          td
            button(@click="changePassword(user)") Change password
            button(@click="editUser(user)") edit
            button(@click="deleteUser(user._id, i)") Delete

    UModal(v-model:open="modalSw")
      template(#header)
        p.font-bebas.text-3xl {{ userModalTitle }}
      template(#body)
          PanelUserForm(:user="currentUser" :mode="currentUser ? 'edit' : 'create'" @submit="saveUser")

    SrModal(ref="passwordModal")
      template(#body)
        PanelUserPasswordForm(@submit="savePassword")
</template>

<script lang="ts" setup>
import type { Component } from "~/types/content";
import type { User } from "~/types";
import PanelUserForm from "~/components/Panel/UserForm.vue";
import PanelUserPasswordForm from "~/components/Panel/UserPasswordForm.vue";

definePageMeta({
  layout: "panel",
  auth: {
    required: true,
    minAdminLevel: 1,
  },
});

const { data: users, refresh } = await useFetch<User[]>("/api/users");

const modalSw = ref(false);
const passwordModal: Ref<Component | null> = ref(null);

const currentUser: Ref<User | null> = ref(null);
const userModalTitle = computed(() =>
  currentUser.value ? "Editar usuario" : "Crear usuario",
);

const newUser = () => {
  currentUser.value = null;
  modalSw.value = true;
};

const saveUser = async (_user: any) => {
  if (currentUser.value) return updateUser(_user);

  try {
    const payload: any = {
      name: `${(_user as any).profile?.name ?? ""} ${(_user as any).profile?.lastname ?? ""}`.trim(),
      email: (_user as any).email,
      password: (_user as any).password,
      admin_level: Number((_user as any).admin_level ?? 0),
      profile: (_user as any).profile,
    };

    delete payload.password_confirmation;
    if (payload.profile) {
      delete payload.profile?.password_confirmation;
    }

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

const updateUser = async (_user: any) => {
  try {
    const { password_confirmation, ...rest } = _user;
    const user: User = await $fetch<User>(`/api/users`, {
      method: "PUT",
      body: {
        id: (currentUser.value as any).id || (currentUser.value as any)._id,
        ...rest,
      },
    });

    users.value?.splice(
      users.value.findIndex(
        (u: any) =>
          (u.id || (u as any)._id) ===
          ((currentUser.value as any).id || (currentUser.value as any)._id),
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
  (passwordModal.value as any).toggle();
};

const savePassword = async (_password: any) => {
  try {
    const { password_confirmation, ...rest } = _password;
    await $fetch(`/api/users/password`, {
      method: "PUT",
      body: {
        id: (currentUser.value as any).id || (currentUser.value as any)._id,
        ...rest,
      },
    });

    (passwordModal.value as any).toggle();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.users {
}
</style>
