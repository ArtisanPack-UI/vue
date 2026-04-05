<script setup lang="ts">
/** @module Editor */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { EditorProps } from './types';

const props = withDefaults(defineProps<EditorProps>(), {
  rows: 12,
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
    <legend v-if="label" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <textarea
      :id="inputId"
      v-model="model"
      :class="cn('textarea w-full font-mono text-sm', error && 'textarea-error')"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      :aria-required="required || undefined"
      :required="required"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
    />
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
