/** @module Checkbox */
<script setup lang="ts">
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { CheckboxProps } from './types';

const props = withDefaults(defineProps<CheckboxProps>(), {
  right: false,
  card: false,
});

const model = defineModel<boolean>();

const colorMap: Record<string, string> = {
  primary: 'checkbox-primary',
  secondary: 'checkbox-secondary',
  accent: 'checkbox-accent',
  success: 'checkbox-success',
  warning: 'checkbox-warning',
  error: 'checkbox-error',
  info: 'checkbox-info',
  neutral: 'checkbox-neutral',
};

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
const hintId = computed(() => (props.hint && !props.error ? `${inputId.value}-hint` : undefined));
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
);
</script>

<template>
  <fieldset class="fieldset">
    <label
      v-if="card"
      :for="inputId"
      :class="
        cn(
          'flex items-center gap-3 p-4 border rounded-lg cursor-pointer',
          'hover:bg-base-200 transition-colors',
          'has-[:checked]:border-primary has-[:checked]:bg-primary/5',
          cardClass,
        )
      "
    >
      <input
        :id="inputId"
        v-model="model"
        type="checkbox"
        :class="cn('checkbox', color && colorMap[color])"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
      />
      <span v-if="label">
        {{ label }}
        <span v-if="required" class="text-error ml-1">*</span>
      </span>
    </label>
    <label
      v-else
      :for="inputId"
      :class="cn('flex items-center gap-2 cursor-pointer', right && 'flex-row-reverse')"
    >
      <input
        :id="inputId"
        v-model="model"
        type="checkbox"
        :class="cn('checkbox', color && colorMap[color])"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
      />
      <span v-if="label">
        {{ label }}
        <span v-if="required" class="text-error ml-1">*</span>
      </span>
    </label>
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
