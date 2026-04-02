<script setup lang="ts">
/** @module Steps */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import type { StepsProps } from './types';

const props = withDefaults(defineProps<StepsProps>(), {
  currentStep: 0,
  vertical: false,
  color: 'primary',
});

const colorMap: Record<DaisyColor, string> = {
  primary: 'step-primary',
  secondary: 'step-secondary',
  accent: 'step-accent',
  success: 'step-success',
  warning: 'step-warning',
  error: 'step-error',
  info: 'step-info',
  neutral: 'step-neutral',
};

const stepsClasses = computed(() =>
  cn('steps', props.vertical && 'steps-vertical', props.className),
);

function getStepClasses(index: number, step: { color?: DaisyColor }) {
  const isComplete = index <= props.currentStep;
  const stepColor = step.color ?? props.color;
  return cn('step', isComplete && colorMap[stepColor]);
}
</script>

<template>
  <ul
    :class="stepsClasses"
    role="list"
    :aria-label="($attrs['aria-label'] as string) || 'Progress steps'"
  >
    <li
      v-for="(step, index) in steps"
      :key="index"
      :class="getStepClasses(index, step)"
      role="listitem"
      :aria-current="index === currentStep ? 'step' : undefined"
    >
      <slot
        name="step"
        :step="step"
        :index="index"
        :is-active="index === currentStep"
        :is-complete="index <= currentStep"
      >
        {{ step.label }}
      </slot>
    </li>
  </ul>
</template>
