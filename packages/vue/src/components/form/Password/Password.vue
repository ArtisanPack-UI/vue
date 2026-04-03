<script setup lang="ts">
/** @module Password */
import { computed, ref, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { PasswordProps } from './types';

const props = withDefaults(defineProps<PasswordProps>(), {
  inline: false,
  clearable: false,
  hideToggle: false,
});

const emit = defineEmits<{
  clear: [];
}>();

const model = defineModel<string>();

const visible = ref(false);

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
    <label :class="cn('input w-full', error && 'input-error')" :for="inputId">
      <span v-if="$slots.icon" class="opacity-50" aria-hidden="true"><slot name="icon" /></span>
      <input
        :id="inputId"
        v-model="model"
        :type="visible ? 'text' : 'password'"
        class="grow"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :aria-required="required || undefined"
        :required="required"
      />
      <span v-if="inline && label" class="label">{{ label }}</span>
      <button
        v-if="clearable"
        type="button"
        class="opacity-50 hover:opacity-100 cursor-pointer"
        aria-label="Clear password"
        :disabled="disabled"
        @click="
          () => {
            if (disabled) return;
            model = '';
            emit('clear');
          }
        "
      >
        &#x2715;
      </button>
      <button
        v-if="!hideToggle"
        type="button"
        class="opacity-50 hover:opacity-100 cursor-pointer"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        :disabled="disabled"
        @click="
          () => {
            if (disabled) return;
            visible = !visible;
          }
        "
      >
        <slot v-if="visible" name="visibleIcon">
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </slot>
        <slot v-else name="hiddenIcon">
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        </slot>
      </button>
    </label>
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
