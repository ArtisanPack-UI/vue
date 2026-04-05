<script setup lang="ts">
/** @module Loading */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';
import type { LoadingProps, LoadingVariant } from './types';

const props = withDefaults(defineProps<LoadingProps>(), {
  variant: 'spinner',
  ariaLabel: 'Loading',
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
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
};

const variantMap: Record<LoadingVariant, string> = {
  spinner: 'loading-spinner',
  dots: 'loading-dots',
  ring: 'loading-ring',
  ball: 'loading-ball',
  bars: 'loading-bars',
  infinity: 'loading-infinity',
};

const loadingClasses = computed(() =>
  cn(
    'loading',
    variantMap[props.variant],
    props.color && colorMap[props.color],
    props.size && sizeMap[props.size],
    props.className,
  ),
);
</script>

<template>
  <span role="status" :aria-label="ariaLabel" :class="loadingClasses" />
</template>
