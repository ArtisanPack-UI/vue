<script setup lang="ts">
/** @module Divider */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import type { DividerProps } from './types';

const props = withDefaults(defineProps<DividerProps>(), {
  vertical: false,
  labelPosition: 'center',
});

const colorMap: Record<DaisyColor, string> = {
  primary: 'divider-primary',
  secondary: 'divider-secondary',
  accent: 'divider-accent',
  success: 'divider-success',
  warning: 'divider-warning',
  error: 'divider-error',
  info: 'divider-info',
  neutral: 'divider-neutral',
};

const labelPositionMap: Record<string, string> = {
  start: 'divider-start',
  center: '',
  end: 'divider-end',
};

const dividerClasses = computed(() =>
  cn(
    'divider',
    props.vertical && 'divider-horizontal',
    props.color && colorMap[props.color],
    props.labelPosition && labelPositionMap[props.labelPosition],
  ),
);
</script>

<template>
  <div
    :class="dividerClasses"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    {{ label }}
  </div>
</template>
