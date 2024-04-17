<template lang="pug">
.users
  SrContainer(:with-padding="true")
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

    SrModal(ref="userModal")
      template(#body)
        .sr-modal-body
          SrText(text="Create user" class="title" alignment="center")
          ul(v-if="formErrors.length")
            li(v-for="error in formErrors" :key="error")
              SrText(:text="`${error.field}: ${error.message}`" class="error")
          SrForm(:fieldsets="userForm" @submit="saveUser")

    SrModal(ref="passwordModal")
      template(#body)
        ul(v-if="formErrors.length")
          li(v-for="error in formErrors" :key="error")
            SrText(:text="`${error.field}: ${error.message}`" class="error")
        SrForm(:fieldsets="passwordForm" @submit="savePassword") 
</template>

<script lang="ts" setup>
import { validateForm } from "sr-content-2/assets/ts/utilities";
import type { Component } from "sr-content-2/types";
import type { User } from "~/types";

definePageMeta({
  layout: "panel",
});

const { data: users } = await useFetch<User[]>("/api/users");

const userModal: Ref<Component | null> = ref(null);
const passwordModal: Ref<Component | null> = ref(null);

const currentUser: Ref<Object | null> = ref(null);

const userForm: any = ref([
  {
    fields: [
      {
        component: "SrFormInput",
        props: {
          label: "E-mail",
          type: "email",
          required: true,
          name: "email",
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Password",
          type: "password",
          required: true,
          name: "password",
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Password Confirm",
          type: "password",
          required: true,
          name: "password_confirmation",
          confirmation: "password",
        },
      },
      {
        component: "SrFormSelect",
        props: {
          label: "Admin Level",
          required: true,
          name: "admin_level",
          value: "0",
          options: [
            { name: "Usuario", value: "0" },
            { name: "Editor", value: "1" },
            { name: "Administrador", value: "3" },
          ],
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Nombre",
          type: "text",
          required: true,
          name: "profile.name",
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Apellido",
          type: "text",
          required: true,
          name: "profile.lastname",
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Tel:",
          type: "phone",
          required: true,
          name: "profile.phone",
        },
      },
    ],
  },
]);

const formErrors = ref([]);

const passwordForm: any = ref([
  {
    fields: [
      {
        component: "SrFormInput",
        props: {
          label: "Password",
          name: "password",
          type: "password",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Confirm password",
          name: "password_confirmation",
          confirmation: "password",
          type: "password",
          required: true,
        },
      },
    ],
  },
]);

const newUser = () => {
  userForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: Component) => {
      if (field.props.name?.includes("password")) {
        field.props.required = true;
        field.props.disabled = false;
        if (!field.props.css) field.props.css = { class: "", style: {} };
        (field.props.css as any).class = "";
      }
    });
  });
  (userModal.value as any).toggle();
};

const saveUser = async () => {
  formErrors.value = [];
  let _user: User | null = null;
  validateForm(userForm.value, (event: any) => {
    if ("errors" in event) {
      formErrors.value = event.errors;
      return;
    }

    _user = event;
  });

  if (currentUser.value) return updateUser(_user);

  if (!_user) return;

  try {
    const user = await $fetch<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(_user),
    });

    users.value?.push(user as User);

    (userModal.value as any).toggle();
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
  currentUser.value = user;

  userForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.props.name.includes(".")) {
        const [key, subkey]: [string, string] = field.props.name.split(".");
        field.props.value = (user as any)[key][subkey];
      } else if (field.props.name.includes("password")) {
        field.props.required = false;
        field.props.disabled = true;

        if (!field.props.css) field.props.css = { class: "", style: {} };

        field.props.css.class = "hidden";
      } else {
        field.props.value = user[field.props.name];
      }
    });
  });

  (userModal.value as any).toggle();
};

const updateUser = async (_user: any) => {
  formErrors.value = [];
  validateForm(userForm.value, (event: any) => {
    if ("errors" in event) {
      formErrors.value = event.errors;
      return;
    }

    _user = event;
  });

  if (formErrors.value.length) return;

  try {
    const user: User = await $fetch<User>(`/api/users`, {
      method: "PUT",
      body: {
        _id: (currentUser.value as User)._id,
        ..._user,
      },
    });

    users.value?.splice(
      users.value.findIndex(
        (u: User) => u._id === (currentUser.value as User)._id,
      ),
      1,
      user,
    );
    (userModal.value as any).toggle();
  } catch (error) {
    console.error(error);
  }
};

const changePassword = (user: User) => {
  currentUser.value = user;
  (passwordModal.value as any).toggle();
};

const savePassword = async (_password: any) => {
  formErrors.value = [];
  let _user: User | null = null;

  validateForm(passwordForm.value, (event: any) => {
    if ("errors" in event) {
      formErrors.value = event.errors;
      return;
    }

    _user = event;
  });

  if (formErrors.value.length) return;

  try {
    await $fetch(`/api/users/password`, {
      method: "PUT",
      body: {
        _id: (currentUser.value as User)._id,
        ..._password,
      },
    });

    (passwordModal.value as any).toggle();
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => userModal.value,
  (value) => {
    if (!value) {
      currentUser.value = null;
      userForm.value.forEach((fieldset: any) => {
        fieldset.fields.forEach((field: any) => {
          if (field.props.type === "select") {
            field.props.value = "0";
          } else {
            field.value = "";
          }
        });
      });
    }
  },
);
</script>

<style lang="scss" scoped>
.users {
}
</style>
