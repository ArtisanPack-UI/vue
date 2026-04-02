/** @module DatePicker */
<script setup lang="ts">
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DatePickerProps } from './types';

const props = withDefaults(defineProps<DatePickerProps>(), {
  inline: false,
  dateType: 'date',
});

const model = defineModel<string>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const hintId = computed(() => (props.hint && !props.error ? `${inputId.value}-hint` : undefined));
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
);
</script>

<template>
  <fieldset class="fieldset">
    <legend v-if="label && !inline" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <label
      v-if="$slots.icon || $slots.iconRight || inline"
      :class="cn('input w-full', error && 'input-error')"
      :for="inputId"
    >
      <span v-if="$slots.icon" class="opacity-50" aria-hidden="true"><slot name="icon" /></span>
      <input
        :id="inputId"
        v-model="model"
        :type="dateType"
        class="grow"
        style="height: auto"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :aria-required="required || undefined"
        :required="required"
        :min="min"
        :max="max"
        :disabled="disabled"
      />
      <span v-if="inline && label" class="label">{{ label }}</span>
      <span v-if="$slots.iconRight" class="opacity-50" aria-hidden="true">
        <slot name="iconRight" />
      </span>
    </label>
    <input
      v-else
      :id="inputId"
      v-model="model"
      :type="dateType"
      :class="cn('input w-full', error && 'input-error')"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      :aria-required="required || undefined"
      :required="required"
      :min="min"
      :max="max"
      :disabled="disabled"
    />
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
