<script setup lang="ts">
/** @module Clipboard */
import { computed, ref, onUnmounted } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ClipboardProps } from './types';

const colorMap: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  info: 'btn-info',
  neutral: 'btn-neutral',
};

const sizeMap: Record<string, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const props = withDefaults(defineProps<ClipboardProps>(), {
  label: 'Copy',
  successLabel: 'Copied!',
  successDuration: 2000,
  size: 'md',
});

const emit = defineEmits<{
  copy: [];
  error: [error: unknown];
}>();

const copied = ref(false);
let copyTimeout: ReturnType<typeof setTimeout> | null = null;

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout);
});

const buttonClasses = computed(() =>
  cn('btn', props.color && colorMap[props.color], sizeMap[props.size], props.className),
);

async function handleCopy() {
  if (!navigator.clipboard?.writeText) {
    if (copyTimeout) clearTimeout(copyTimeout);
    copied.value = false;
    emit('error', new Error('Clipboard API not available'));
    return;
  }
  try {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    emit('copy');
    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copied.value = false;
    }, props.successDuration);
  } catch (error) {
    if (copyTimeout) clearTimeout(copyTimeout);
    copied.value = false;
    emit('error', error);
  }
}
</script>

<template>
  <button
    type="button"
    :class="buttonClasses"
    :aria-label="copied ? successLabel : label"
    @click="handleCopy"
  >
    <slot v-if="!copied" name="default">
      {{ label }}
    </slot>
    <slot v-else name="success">
      {{ successLabel }}
    </slot>
  </button>
</template>
