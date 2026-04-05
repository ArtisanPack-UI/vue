<script setup lang="ts">
/** @module Badge */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { BadgeProps } from './types';

const props = withDefaults(defineProps<BadgeProps>(), {
  size: 'md',
  outline: false,
  ghost: false,
});

const colorMap: Record<string, string> = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  neutral: 'badge-neutral',
};

const sizeMap: Record<string, string> = {
  xs: 'badge-xs',
  sm: 'badge-sm',
  md: 'badge-md',
  lg: 'badge-lg',
};

const badgeClasses = computed(() =>
  cn(
    'badge',
    props.color && colorMap[props.color],
    sizeMap[props.size],
    props.outline && 'badge-outline',
    props.ghost && 'badge-ghost',
    props.className,
  ),
);
</script>

<template>
  <span :class="badgeClasses">
    <template v-if="value !== undefined">{{ value }}</template>
    <slot v-else />
  </span>
</template>
