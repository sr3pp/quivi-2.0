<template lang="pug">
.quivi-chat-conversation
  ul
    li(v-for="message in messages") {{ message }}
  input(type="text" @keyup.enter="sendMessage($event.target.value)")
</template>

<script setup lang="ts">
import type { ChatMessage } from "~/types";

const { $io } = useNuxtApp();

const messages: Ref<string[]> = ref([]);

onMounted(() => {
  $io.on("broadcastMessage", (chatMessage: ChatMessage) => {
    appendMessage(chatMessage);
  });
});

const appendMessage = ({ message }: ChatMessage) => {
  messages.value.push(message);
};

const sendMessage = (msg: string) => {
  $io.emit("sendMessage", msg);
  appendMessage({ message: msg } as ChatMessage);
};
</script>

<style lang="scss" scoped></style>
