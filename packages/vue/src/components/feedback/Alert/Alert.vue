<script setup lang="ts">
/** @module Alert */
import { computed, ref } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { AlertColor, AlertProps } from './types';

const props = withDefaults(defineProps<AlertProps>(), {
  dismissible: false,
  visible: undefined,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const internalVisible = ref(true);

const isControlled = computed(() => props.visible !== undefined);
const isVisible = computed(() => (isControlled.value ? props.visible : internalVisible.value));

function handleDismiss() {
  if (!isControlled.value) {
    internalVisible.value = false;
  }
  emit('dismiss');
}

const colorMap: Record<AlertColor, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

const ariaLive = computed(() =>
  props.color === 'error' || props.color === 'warning' ? 'assertive' : 'polite',
);

const alertClasses = computed(() =>
  cn('alert', props.color && colorMap[props.color], props.className),
);
</script>

<template>
  <div v-if="isVisible" role="alert" :aria-live="ariaLive" :class="alertClasses">
    <span v-if="$slots.icon" class="alert-icon">
      <slot name="icon" />
    </span>
    <div class="flex-1">
      <slot />
    </div>
    <button
      v-if="dismissible"
      type="button"
      aria-label="Dismiss alert"
      class="btn btn-sm btn-ghost"
      @click="handleDismiss"
    >
      &#x2715;
    </button>
  </div>
</template>
