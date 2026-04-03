<script setup lang="ts">
/** @module Radio */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { RadioOption, RadioProps } from './types';

const props = withDefaults(defineProps<RadioProps>(), {
  optionValue: 'id',
  optionLabel: 'name',
  optionHint: 'hint',
  options: () => [],
  inline: false,
  card: false,
});

const model = defineModel<string | number>();

const colorMap: Record<string, string> = {
  primary: 'radio-primary',
  secondary: 'radio-secondary',
  accent: 'radio-accent',
  success: 'radio-success',
  warning: 'radio-warning',
  error: 'radio-error',
  info: 'radio-info',
  neutral: 'radio-neutral',
};

const cardColorMap: Record<string, string> = {
  primary: 'has-[:checked]:border-primary has-[:checked]:bg-primary/5',
  secondary: 'has-[:checked]:border-secondary has-[:checked]:bg-secondary/5',
  accent: 'has-[:checked]:border-accent has-[:checked]:bg-accent/5',
  success: 'has-[:checked]:border-success has-[:checked]:bg-success/5',
  warning: 'has-[:checked]:border-warning has-[:checked]:bg-warning/5',
  error: 'has-[:checked]:border-error has-[:checked]:bg-error/5',
  info: 'has-[:checked]:border-info has-[:checked]:bg-info/5',
  neutral: 'has-[:checked]:border-neutral has-[:checked]:bg-neutral/5',
};

const autoId = useId();
const fieldsetId = computed(() => props.id ?? autoId);
const groupName = computed(() => props.name ?? fieldsetId.value);
const errorId = computed(() => (props.error ? `${fieldsetId.value}-error` : undefined));
const hintId = computed(() =>
  props.hint && !props.error ? `${fieldsetId.value}-hint` : undefined,
);

function getOptionValue(option: RadioOption, index: number): string | number {
  const val = option[props.optionValue];
  return val !== undefined && val !== null ? (val as string | number) : index;
}

function getOptionLabel(option: RadioOption): string {
  return String(option[props.optionLabel] ?? '');
}

function getOptionHint(option: RadioOption): string | undefined {
  return option[props.optionHint] ? String(option[props.optionHint]) : undefined;
}

function getOptionId(option: RadioOption, index: number): string {
  return `${fieldsetId.value}-${String(getOptionValue(option, index))}`;
}

function getOptionHintId(option: RadioOption, index: number): string | undefined {
  return getOptionHint(option) ? `${getOptionId(option, index)}-hint` : undefined;
}

const firstEnabledIndex = computed(() => props.options.findIndex((opt) => !opt.disabled));
</script>

<template>
  <fieldset
    class="fieldset"
    role="radiogroup"
    :aria-labelledby="label ? `${fieldsetId}-legend` : undefined"
    :aria-describedby="[hintId, errorId].filter(Boolean).join(' ') || undefined"
    :aria-invalid="error ? true : undefined"
  >
    <legend v-if="label" :id="`${fieldsetId}-legend`" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <div :class="cn(card ? 'grid gap-2' : 'flex gap-3', !card && !inline && 'flex-col')">
      <label
        v-for="(option, index) in options"
        :key="getOptionValue(option, index)"
        :for="getOptionId(option, index)"
        :class="
          card
            ? cn(
                'flex items-center gap-3 p-4 border rounded-lg cursor-pointer',
                'hover:bg-base-200 transition-colors',
                color && cardColorMap[color],
                option.disabled && 'opacity-50 cursor-not-allowed',
                cardClass,
              )
            : cn(
                'flex items-center gap-2 cursor-pointer',
                option.disabled && 'opacity-50 cursor-not-allowed',
              )
        "
      >
        <input
          :id="getOptionId(option, index)"
          v-model="model"
          type="radio"
          :name="groupName"
          :value="getOptionValue(option, index)"
          :disabled="option.disabled === true"
          :required="required && index === firstEnabledIndex"
          :class="cn('radio', color && colorMap[color])"
          :aria-describedby="getOptionHintId(option, index)"
        />
        <div>
          <span>{{ getOptionLabel(option) }}</span>
          <p
            v-if="getOptionHint(option)"
            :id="getOptionHintId(option, index)"
            class="text-xs opacity-60"
          >
            {{ getOptionHint(option) }}
          </p>
        </div>
      </label>
    </div>
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
