<script setup lang="ts">
/** @module Tooltip */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import type { TooltipPosition, TooltipProps } from './types';

const props = withDefaults(defineProps<TooltipProps>(), {
  position: 'top',
  forceOpen: false,
});

const tooltipId = useId();

const positionMap: Record<TooltipPosition, string> = {
  top: 'tooltip-top',
  bottom: 'tooltip-bottom',
  left: 'tooltip-left',
  right: 'tooltip-right',
};

const colorMap: Record<DaisyColor, string> = {
  primary: 'tooltip-primary',
  secondary: 'tooltip-secondary',
  accent: 'tooltip-accent',
  success: 'tooltip-success',
  warning: 'tooltip-warning',
  error: 'tooltip-error',
  info: 'tooltip-info',
  neutral: 'tooltip-neutral',
};

const tooltipClasses = computed(() =>
  cn(
    'tooltip',
    positionMap[props.position],
    props.color && colorMap[props.color],
    props.forceOpen && 'tooltip-open',
    props.className,
  ),
);
</script>

<template>
  <div :class="tooltipClasses" :data-tip="text">
    <slot :tooltip-id="tooltipId" />
    <span :id="tooltipId" role="tooltip" class="sr-only">{{ text }}</span>
  </div>
</template>
