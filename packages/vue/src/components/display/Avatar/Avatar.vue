<script setup lang="ts">
/** @module Avatar */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { AvatarProps } from './types';

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
  online: false,
  offline: false,
});

const sizeMap: Record<string, string> = {
  xs: 'w-8',
  sm: 'w-12',
  md: 'w-16',
  lg: 'w-24',
};

const maskMap: Record<string, string> = {
  circle: 'rounded-full',
  squircle: 'mask mask-squircle',
  hexagon: 'mask mask-hexagon',
  triangle: 'mask mask-triangle',
};

const containerClasses = computed(() =>
  cn(
    'avatar',
    props.offline ? 'avatar-offline' : props.online && 'avatar-online',
    !props.src && 'avatar-placeholder',
    props.className,
  ),
);

const ringMap: Record<string, string> = {
  primary: 'ring-primary ring ring-offset-2 ring-offset-base-100',
  secondary: 'ring-secondary ring ring-offset-2 ring-offset-base-100',
  accent: 'ring-accent ring ring-offset-2 ring-offset-base-100',
  success: 'ring-success ring ring-offset-2 ring-offset-base-100',
  warning: 'ring-warning ring ring-offset-2 ring-offset-base-100',
  error: 'ring-error ring ring-offset-2 ring-offset-base-100',
  info: 'ring-info ring ring-offset-2 ring-offset-base-100',
  neutral: 'ring-neutral ring ring-offset-2 ring-offset-base-100',
};

const bgMap: Record<string, string> = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  success: 'bg-success text-success-content',
  warning: 'bg-warning text-warning-content',
  error: 'bg-error text-error-content',
  info: 'bg-info text-info-content',
  neutral: 'bg-neutral text-neutral-content',
};

const innerClasses = computed(() =>
  cn(
    sizeMap[props.size],
    maskMap[props.shape],
    props.ring && ringMap[props.ring],
    !props.src && 'bg-neutral text-neutral-content',
    props.color && !props.src && bgMap[props.color],
  ),
);
</script>

<template>
  <div :class="containerClasses" role="img" :aria-label="alt || initials || 'Avatar'">
    <div v-if="src" :class="innerClasses">
      <img :src="src" :alt="alt || 'Avatar'" />
    </div>
    <div v-else :class="innerClasses">
      <span v-if="initials">{{ initials }}</span>
      <slot v-else />
    </div>
  </div>
</template>
