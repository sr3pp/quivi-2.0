<template lang="pug">
.quivi-chat-dashboard
  SrText(value="Lista de espera")
  ul
    li(v-for="user in users")
      SrText(:value="user.name")
    button(@click="sendMessage('Hello World')") Get Message
</template>

<script setup lang="ts">
const { $io } = useNuxtApp();

const currentUser = {
  name: "User 1",
};

const users: Ref<any[]> = ref([currentUser]);

onMounted(() => {
  $io.on("joined", (user) => {
    console.log("user", user);
    users.value.push(user);
  });

  $io.on("waitingList", (list) => {
    console.log(list);
  });

  $io.emit("userJoined", currentUser);
  $io.emit("getWaitingList");
});
</script>
