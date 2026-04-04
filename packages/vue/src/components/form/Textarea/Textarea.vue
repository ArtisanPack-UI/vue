<script setup lang="ts">
/** @module Textarea */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { TextareaProps } from './types';

const props = withDefaults(defineProps<TextareaProps>(), {
  inline: false,
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
    <legend v-if="label && !inline" :id="`${inputId}-legend`" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <textarea
      :id="inputId"
      v-model="model"
      :class="cn('textarea w-full', error && 'textarea-error', readonly && 'border-dashed')"
      :aria-labelledby="label && !inline ? `${inputId}-legend` : undefined"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      :aria-required="required || undefined"
      :aria-readonly="readonly || undefined"
      :required="required"
      :readonly="readonly"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
    />
    <label v-if="inline && label" class="fieldset-label" :for="inputId">{{ label }}</label>
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
