<script setup lang="ts">
/** @module Icon */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';
import type { IconProps } from './types';

const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
});

const colorMap: Record<DaisyColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  neutral: 'text-neutral',
};

const sizeMap: Record<Size, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const iconClasses = computed(() =>
  cn('inline-flex shrink-0', sizeMap[props.size], props.color && colorMap[props.color], props.className),
);
</script>

<template>
  <span
    :class="iconClasses"
    :role="ariaLabel ? 'img' : 'presentation'"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : 'true'"
  >
    <slot />
  </span>
</template>
