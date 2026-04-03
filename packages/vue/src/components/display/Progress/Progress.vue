<script setup lang="ts">
/** @module Progress */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ProgressProps } from './types';

const props = withDefaults(defineProps<ProgressProps>(), {
  max: 100,
  showValue: false,
});

const colorMap: Record<string, string> = {
  primary: 'progress-primary',
  secondary: 'progress-secondary',
  accent: 'progress-accent',
  success: 'progress-success',
  warning: 'progress-warning',
  error: 'progress-error',
  info: 'progress-info',
  neutral: 'progress-neutral',
};

const progressClasses = computed(() =>
  cn('progress', props.color && colorMap[props.color], props.className),
);

const percentage = computed(() => {
  if (props.value === undefined || props.max === 0) return 0;
  return Math.round((props.value / props.max) * 100);
});
</script>

<template>
  <div class="flex items-center gap-2">
    <progress
      :class="progressClasses"
      :value="value"
      :max="max"
      role="progressbar"
      :aria-valuenow="value ?? 0"
      :aria-valuemin="0"
      :aria-valuemax="max"
    />
    <span v-if="showValue" class="text-sm text-base-content/70">{{ percentage }}%</span>
  </div>
</template>
