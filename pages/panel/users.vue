<template lang="pug">
.users
  SrContainer(:with_space="true")
    SrText(value="Panel users" class="title" alignment="center")

    button(@click="userModal = true") Create user

    table
      tbody
        tr(v-for="(user, i) in users" :key="i")
          td {{ user.profile.name }}
          td {{ user.email }}
          td {{ user.admin_level }}
          td {{ user.created_at }}
          td {{ user.updated_at }}
          td
            button(@click="changePassword(user._id)") Change password
            button(@click="editUser(user)") edit
            button(@click="deleteUser(user._id, i)") Delete

    SrModal(:active="userModal" @close="userModal = false")
      template(#body)
        SrText(value="Create user" class="title" alignment="center")
        SrForm(:form="userForm" @submit="saveUser")

    SrModal(:active="passwordModal" @close="passwordModal = false")
      template(#body)
        SrForm(:form="passwordForm" @submit="savePassword") 
</template>

<script lang="ts" setup>
import type { User } from "~/types";

definePageMeta({
  layout: "panel",
});

const { data: users } = await useFetch<User[]>("/api/users");

const userModal: Ref<boolean> = ref(false);
const passwordModal: Ref<boolean> = ref(false);

const currentUser: Ref<string> = ref("");

const userForm: any = {
  email: "",
  password: "",
  password_confirm: "",
  admin_level_select: {
    value: 0,
    options: [
      { value: "0", name: "User" },
      { value: "1", name: "Manager" },
      { value: "2", name: "Sales Manager" },
      { value: "3", name: "Admin" },
    ],
  },
  profile: {
    name: "",
    lastname: "",
    phone: "",
  },
};

const passwordForm: any = {
  password: "",
  password_confirm: "",
};

const saveUser = async (_user: User) => {
  if (currentUser) return updateUser(_user);

  try {
    const { data: user } = await useFetch<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(_user),
    });

    users.value?.push(user.value as User);

    userModal.value = false;
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = (id: string, idx: number) => {
  try {
    useFetch(`/api/users`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    users.value?.splice(idx, 1);
  } catch (error) {
    console.error(error);
  }
};

const editUser = (user: User) => {
  currentUser.value = user._id as string;
  Object.keys(userForm).forEach((key: string) => {
    if (key === "profile") {
      Object.keys(userForm.profile).forEach((k: string) => {
        userForm.profile[k] = user.profile[k];
      });
    } else if (key === "admin_level_select") {
      userForm.admin_level_select = {
        value: user.admin_level,
        options: [
          { value: "0", name: "User" },
          { value: "1", name: "Manager" },
          { value: "2", name: "Sales Manager" },
          { value: "3", name: "Admin" },
        ],
      };
    } else {
      userForm[key] = user[key];
    }
  });

  userModal.value = true;
};

const updateUser = async (_user: any) => {
  try {
    const { data: user } = await useFetch<User>(`/api/users`, {
      method: "PUT",
      body: JSON.stringify({
        _id: currentUser.value,
        ..._user,
        admin_level: _user.admin,
      }),
    });

    userModal.value = false;
    users.value?.splice(
      users.value.findIndex((u: User) => u._id === currentUser.value),
      1,
      user.value as User,
    );
  } catch (error) {
    console.error(error);
  }
};

const changePassword = (id: string) => {
  currentUser.value = id;
  passwordModal.value = true;
};

const savePassword = async (_password: any) => {
  try {
    await useFetch(`/api/users/password`, {
      method: "PUT",
      body: JSON.stringify({
        _id: currentUser.value,
        ..._password,
      }),
    });

    passwordModal.value = false;
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => userModal.value,
  (value) => {
    if (!value) {
      currentUser.value = "";
      Object.keys(userForm).forEach((key: string) => {
        if (key === "profile") {
          Object.keys(userForm.profile).forEach((k: string) => {
            userForm.profile[k] = "";
          });
        } else if (key === "admin_level_select") {
          userForm.admin_level_select = {
            value: 0,
            options: [
              { value: "0", name: "User" },
              { value: "1", name: "Manager" },
              { value: "2", name: "Sales Manager" },
              { value: "3", name: "Admin" },
            ],
          };
        } else {
          userForm[key] = "";
        }
      });
    }
  },
);
</script>

<style lang="scss" scoped>
.users {
}
</style>
