<template lang="pug">
ul.quivi-notification-stack
    li.quivi-notification-stack-item(v-for="(notification, i) in notifications" :key="i")
        Notification(:status="notification.status" :title="notification.title" :description="notification.description" @close="removeNotification(notification, i)")
</template>

<script lang="ts" setup>
const notifications = useState("notifications", () => []);

const removeNotification = (el: any, idx: number) => {
  el.status = false;
  setTimeout(() => {
    notifications.value.splice(idx, 1);
  }, 350);
};
</script>

<style lang="scss" scoped>
.quivi-notification-stack {
  position: fixed;
  bottom: pxToRem(20);
  right: pxToRem(20);
  z-index: 22;

  &-item {
    &:not(:last-child) {
      margin-bottom: pxToRem(20);
    }
  }
}
</style>
