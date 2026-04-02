<script setup lang="ts">
/** @module Toggle */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ToggleProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleProps>(), {
  right: false,
});

const model = defineModel<boolean>();

const colorMap: Record<string, string> = {
  primary: 'toggle-primary',
  secondary: 'toggle-secondary',
  accent: 'toggle-accent',
  success: 'toggle-success',
  warning: 'toggle-warning',
  error: 'toggle-error',
  info: 'toggle-info',
  neutral: 'toggle-neutral',
};

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const hintId = computed(() => (props.hint && !props.error ? `${inputId.value}-hint` : undefined));
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
);
</script>

<template>
  <fieldset class="fieldset" role="group" :aria-label="label || undefined">
    <label
      :for="inputId"
      :class="cn('flex items-center gap-2 cursor-pointer', right && 'flex-row-reverse')"
    >
      <input
        :id="inputId"
        v-model="model"
        v-bind="$attrs"
        type="checkbox"
        :class="cn('toggle', color && colorMap[color])"
        role="switch"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :required="required"
        :disabled="disabled"
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
