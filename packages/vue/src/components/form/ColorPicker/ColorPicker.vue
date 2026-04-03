<script setup lang="ts">
/** @module ColorPicker */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ColorPickerProps } from './types';

const props = withDefaults(defineProps<ColorPickerProps>(), {
  clearable: false,
  random: false,
  defaultValue: '#000000',
});

const emit = defineEmits<{
  clear: [];
  randomColor: [color: string];
}>();

const model = defineModel<string>();
if (model.value === undefined) {
  model.value = props.defaultValue;
}

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const hintId = computed(() => (props.hint && !props.error ? `${inputId.value}-hint` : undefined));
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
);

function generateRandomHex(): string {
  return (
    '#' +
    Math.floor(Math.random() * 16777216)
      .toString(16)
      .padStart(6, '0')
  );
}

function handleRandomClick() {
  if (props.disabled) return;
  const color = generateRandomHex();
  model.value = color;
  emit('randomColor', color);
}

function handleClear() {
  if (props.disabled) return;
  model.value = props.defaultValue;
  emit('clear');
}
</script>

<template>
  <fieldset class="fieldset">
    <legend v-if="label" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <label
      :class="cn('input w-full', error && 'input-error')"
      :for="inputId"
      :style="{ paddingInlineStart: 0, overflow: 'hidden' }"
    >
      <input
        :id="inputId"
        v-model="model"
        type="color"
        class="cursor-pointer shrink-0"
        :style="{
          WebkitAppearance: 'none',
          appearance: 'none',
          width: '2.5rem',
          height: 'calc(100% + var(--border) * 2)',
          border: 'none',
          padding: 0,
          marginBlock: 'calc(var(--border) * -1)',
          marginInlineStart: 'calc(var(--border) * -1)',
          borderStartStartRadius: 'calc(var(--radius-field) - var(--border))',
          borderEndStartRadius: 'calc(var(--radius-field) - var(--border))',
          backgroundColor: model,
        }"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :aria-label="label ?? 'Color picker'"
        :disabled="disabled"
        :required="required"
        :aria-required="required || undefined"
      />
      <span v-if="$slots.icon" class="opacity-50" aria-hidden="true"><slot name="icon" /></span>
      <span class="grow font-mono text-sm">{{ model }}</span>
      <button
        v-if="random"
        type="button"
        class="opacity-50 hover:opacity-100 cursor-pointer"
        aria-label="Generate random color"
        :disabled="disabled"
        @click="handleRandomClick"
      >
        <slot name="randomIcon">
          <svg class="w-4 h-4" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
            <path
              d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 .1 0 .1 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1l17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-111.5 0c-.1 0-.3 0-.4 0c-5.8-.1-11.9 1.6-17.1 4.3z"
            />
          </svg>
        </slot>
      </button>
      <button
        v-if="clearable"
        type="button"
        class="opacity-50 hover:opacity-100 cursor-pointer"
        aria-label="Clear color"
        :disabled="disabled"
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
