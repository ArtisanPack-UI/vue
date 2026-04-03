<script setup lang="ts">
/**
 * @module ToastProvider
 *
 * Context provider that manages the toast notification queue and renders
 * the toast container. Wrap your application (or a subtree) with this
 * provider to enable the useToast composable.
 */
import { computed, onUnmounted, provide, ref } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import { TOAST_KEY } from './keys';
import ToastMessage from './ToastMessage.vue';
import type { ToastAPI, ToastItem, ToastOptions, ToastProviderProps } from './types';

const props = withDefaults(defineProps<ToastProviderProps>(), {
  defaultDuration: 5000,
  max: 5,
  position: () => ['toast-end', 'toast-bottom'],
});

const toasts = ref<ToastItem[]>([]);
const timers = new Map<string, ReturnType<typeof setTimeout>>();
let counter = 0;

function clearTimer(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
}

function dismiss(id: string) {
  clearTimer(id);
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function dismissAll() {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
  toasts.value = [];
}

function show(options: ToastOptions): string {
  const id = `toast-${++counter}`;
  const duration = options.duration ?? props.defaultDuration;

  toasts.value = [...toasts.value, { ...options, id }];

  // Evict oldest toasts if over max
  if (toasts.value.length > props.max) {
    const evictCount = toasts.value.length - props.max;
    const evicted = toasts.value.slice(0, evictCount);
    toasts.value = toasts.value.slice(evictCount);
    evicted.forEach((t) => clearTimer(t.id));
  }

  if (duration > 0) {
    const timer = setTimeout(() => dismiss(id), duration);
    timers.set(id, timer);
  }

  return id;
}

const api: ToastAPI = {
  show,
  success: (message, duration?) => show({ message, color: 'success', duration }),
  error: (message, duration?) => show({ message, color: 'error', duration }),
  warning: (message, duration?) => show({ message, color: 'warning', duration }),
  info: (message, duration?) => show({ message, color: 'info', duration }),
  dismiss,
  dismissAll,
};

provide(TOAST_KEY, api);

const containerClasses = computed(() => cn('toast z-50', ...props.position));

onUnmounted(() => {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
});
</script>

<template>
  <slot />
  <div
    v-if="toasts.length > 0"
    :class="containerClasses"
    aria-live="polite"
    aria-label="Notifications"
    role="log"
  >
    <ToastMessage
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @dismiss="dismiss"
    />
  </div>
</template>
