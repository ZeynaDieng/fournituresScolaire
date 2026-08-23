<template>
  <div
    class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
  >
    <TransitionGroup name="notification-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-xl shadow-2xl border-l-4 pointer-events-auto transform transition-all duration-300',
          getTypeStyles(notification.type),
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Icon based on type -->
          <div class="flex-shrink-0 mt-0.5">
            <svg
              v-if="notification.type === 'success'"
              class="w-5 h-5 text-emerald-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="w-5 h-5 text-rose-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="w-5 h-5 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div class="flex-grow">
            <h4 class="text-sm font-bold text-slate-900">{{ notification.title }}</h4>
            <p v-if="notification.message" class="text-xs text-slate-600 mt-1">
              {{ notification.message }}
            </p>
          </div>

          <button
            @click="remove(notification.id)"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";

interface Notification {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

const notifications = ref<Notification[]>([]);
let count = 0;

const add = (options: Omit<Notification, "id">) => {
  const id = count++;
  const notification: Notification = {
    id,
    autoClose: true,
    duration: 5000,
    ...options,
  };

  notifications.value.push(notification);

  if (notification.autoClose) {
    setTimeout(() => {
      remove(id);
    }, notification.duration);
  }

  return id;
};

const remove = (id: number) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

const clear = () => {
  notifications.value = [];
};

// Styles based on notification type
const getTypeStyles = (type: string) => {
  switch (type) {
    case "success":
      return "bg-white border-emerald-500 text-emerald-800";
    case "error":
      return "bg-white border-rose-500 text-rose-800";
    case "warning":
      return "bg-white border-amber-500 text-amber-800";
    default:
      return "bg-white border-blue-500 text-blue-800";
  }
};

// Provide the service to all components
provide("notifications", {
  add,
  remove,
  clear,
});

// For debug purposes
if (process.client) {
  (window as any).__NOTIFICATIONS__ = { add, notifications };
}
</script>

<style scoped>
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.4s ease;
}
.notification-list-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.notification-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
