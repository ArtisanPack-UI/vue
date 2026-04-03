<script setup lang="ts">
/** @module ToastMessage */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ToastColor, ToastItem } from './types';

const props = defineProps<{
  /** The toast data object to render. */
  toast: ToastItem;
}>();

const emit = defineEmits<{
  dismiss: [id: string];
}>();

const toastColorMap: Record<ToastColor, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

const isUrgent = computed(
  () => props.toast.color === 'error' || props.toast.color === 'warning',
);

const toastClasses = computed(() =>
  cn('alert', props.toast.color && toastColorMap[props.toast.color]),
);
</script>

<template>
  <div :role="isUrgent ? 'alert' : 'status'" :aria-live="isUrgent ? 'assertive' : 'polite'" :class="toastClasses">
    <span>{{ toast.message }}</span>
    <button
      type="button"
      aria-label="Dismiss notification"
      class="btn btn-sm btn-ghost"
      @click="emit('dismiss', toast.id)"
    >
      &#x2715;
    </button>
  </div>
</template>
