/** @module Select */
<script setup lang="ts">
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { SelectProps } from './types';

const props = withDefaults(defineProps<SelectProps>(), {
  placeholderValue: '',
  inline: false,
  optionValue: 'id',
  optionLabel: 'name',
  options: () => [],
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
      :class="cn('select', 'w-full', error && 'select-error')"
      :for="!inline ? inputId : undefined"
    >
      <span v-if="$slots.icon" class="opacity-50" aria-hidden="true"><slot name="icon" /></span>
      <select
        :id="inputId"
        v-model="model"
        class="grow"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :aria-required="required || undefined"
        :required="required"
        :disabled="disabled"
      >
        <option v-if="placeholder" :value="placeholderValue" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="(option, index) in options"
          :key="String(option[optionValue] ?? index)"
          :value="String(option[optionValue] ?? '')"
          :disabled="option.disabled === true"
        >
          {{ String(option[optionLabel] ?? '') }}
        </option>
        <slot />
      </select>
      <span v-if="$slots.iconRight" class="opacity-50" aria-hidden="true">
        <slot name="iconRight" />
      </span>
    </label>
    <label v-if="inline && label" class="fieldset-label" :for="inputId">{{ label }}</label>
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
