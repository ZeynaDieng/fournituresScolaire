<!-- components/NotificationContainer.vue -->
<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 pointer-events-none">
      <div
        class="flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end sm:p-6"
      >
        <div class="space-y-4">
          <PaymentAlert
            v-for="notification in notifications"
            :key="notification.id"
            :type="notification.type"
            :title="notification.title"
            :message="notification.message"
            :auto-close="notification.autoClose"
            :duration="notification.duration"
            @close="removeNotification(notification.id)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

// Store des notifications
const notifications = ref<Notification[]>([]);

// Méthodes
const addNotification = (notification: Omit<Notification, "id">) => {
  const id = `notification_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  notifications.value.push({
    id,
    ...notification,
    autoClose: notification.autoClose !== false,
    duration: notification.duration || 5000,
  });

  return id;
};

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const clearAllNotifications = () => {
  notifications.value = [];
};

// Exposer les méthodes
defineExpose({
  addNotification,
  removeNotification,
  clearAllNotifications,
});

// Fournir les méthodes globalement
provide("notifications", {
  add: addNotification,
  remove: removeNotification,
  clear: clearAllNotifications,
});
</script>
