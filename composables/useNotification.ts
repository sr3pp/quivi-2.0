import { ref } from "vue";

interface Alert {
  title: string;
  description: string;
  status: boolean;
  clickHandler: () => void;
}

const notifications = ref<Alert[]>([]);

export function useNotification() {
  function addNotification(notification: Alert) {
    notifications.value.push(notification);
  }

  function removeNotification(idx: number) {
    notifications.value.splice(idx, 1);
  }

  return { notifications, addNotification, removeNotification };
}
