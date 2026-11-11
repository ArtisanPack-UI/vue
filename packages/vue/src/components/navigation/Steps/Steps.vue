<script setup lang="ts">
/**
 * @module Steps
 *
 * Shows progress through a sequence. Renders the design-system Steps markup
 * contract (`.apui-steps`, #56): an ordered list of Step children, or the
 * same children from `steps`.
 */
import { computed, provide } from 'vue';
import { STEPS_KEY } from './keys';
import StepsChildren from './StepsChildren';
import type { StepsPart, StepsProps } from './types';

const props = withDefaults(defineProps<StepsProps>(), {
  steps: undefined,
  modelValue: undefined,
  orientation: 'horizontal',
  clickable: false,
  label: undefined,
  completeLabel: 'Completed',
  errorLabel: 'Error',
  classes: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

provide(STEPS_KEY, {
  value: computed(() => props.modelValue),
  clickable: computed(() => props.clickable),
  completeLabel: computed(() => props.completeLabel),
  errorLabel: computed(() => props.errorLabel),
  classOf: (name: StepsPart) => props.classes?.[name],
  select: (step: number) => emit('update:modelValue', step),
});
</script>

<template>
  <ol
    :class="['apui-steps', classes?.root]"
    :data-orientation="orientation === 'vertical' ? 'vertical' : 'horizontal'"
    :aria-label="label"
  >
    <StepsChildren :steps="steps"><slot /></StepsChildren>
  </ol>
</template>
