<script setup lang="ts">
/** @module Input */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { InputProps } from './types';

const props = withDefaults(defineProps<InputProps>(), {
  clearable: false,
  inline: false,
  type: 'text',
});

const emit = defineEmits<{
  clear: [];
}>();

const model = defineModel<string>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const hintId = computed(() => (props.hint && !props.error ? `${inputId.value}-hint` : undefined));
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
);

function handleClear() {
  if (props.readonly || props.disabled) return;
  model.value = '';
  emit('clear');
}
</script>

<template>
  <fieldset class="fieldset">
    <legend v-if="label && !inline" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <label
      :class="
        cn(
          'input',
          'w-full',
          ($slots.icon || $slots.iconRight || $slots.prefix || $slots.suffix || clearable) &&
            'input-bordered',
          error && 'input-error',
        )
      "
      :for="inputId"
    >
      <span v-if="$slots.icon" class="opacity-50" aria-hidden="true"><slot name="icon" /></span>
      <span v-if="$slots.prefix" class="opacity-50" aria-hidden="true">
        <slot name="prefix" />
      </span>
      <input
        :id="inputId"
        v-model="model"
        class="grow"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :aria-required="required || undefined"
        :required="required"
      />
      <span v-if="inline && label" class="label">{{ label }}</span>
      <span v-if="$slots.suffix" class="opacity-50" aria-hidden="true">
        <slot name="suffix" />
      </span>
      <button
        v-if="clearable"
        type="button"
        class="opacity-50 hover:opacity-100 cursor-pointer"
        aria-label="Clear input"
        :disabled="readonly || disabled"
        @click="handleClear"
      >
        &#x2715;
      </button>
      <span v-if="$slots.iconRight" class="opacity-50" aria-hidden="true">
        <slot name="iconRight" />
      </span>
    </label>
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
