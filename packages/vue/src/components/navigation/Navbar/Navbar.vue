<script setup lang="ts">
/** @module Navbar */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import type { NavbarProps } from './types';

const props = withDefaults(defineProps<NavbarProps>(), {
  glass: false,
});

const colorMap: Record<DaisyColor, string> = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  success: 'bg-success text-success-content',
  warning: 'bg-warning text-warning-content',
  error: 'bg-error text-error-content',
  info: 'bg-info text-info-content',
  neutral: 'bg-neutral text-neutral-content',
};

const navbarClasses = computed(() =>
  cn('navbar', props.color && colorMap[props.color], props.glass && 'glass', props.className),
);
</script>

<template>
  <nav :class="navbarClasses" role="navigation" aria-label="Main navigation">
    <div v-if="$slots.start" class="navbar-start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="navbar-center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="navbar-end">
      <slot name="end" />
    </div>
    <slot />
  </nav>
</template>
