/** @module Range */
<script setup lang="ts">
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { RangeProps } from './types';

const props = withDefaults(defineProps<RangeProps>(), {
  min: 0,
  max: 100,
});

const model = defineModel<number>();

const colorMap: Record<string, string> = {
  primary: 'range-primary',
  secondary: 'range-secondary',
  accent: 'range-accent',
  success: 'range-success',
  warning: 'range-warning',
  error: 'range-error',
  info: 'range-info',
};

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const hintId = computed(() => (props.hint && !props.error ? `${inputId.value}-hint` : undefined));
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
</script>

<template>
  <fieldset class="fieldset">
    <legend v-if="label" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <input
      :id="inputId"
      v-model.number="model"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :class="cn('range w-full', color && colorMap[color])"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="[hintId, errorId].filter(Boolean).join(' ') || undefined"
      :aria-required="required || undefined"
      :required="required"
      :disabled="disabled"
    />
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
