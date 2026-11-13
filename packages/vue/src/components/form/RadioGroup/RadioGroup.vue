<script setup lang="ts">
/**
 * @module RadioGroup
 *
 * Chooses exactly one option from a small set: native radios in a fieldset
 * that share one name, so the platform supplies roving focus and arrow keys
 * (which follow the text direction). Renders the design-system RadioGroup
 * markup contract (`.apui-radio-group`, #53). Replaces the deprecated Radio.
 */
import { computed, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { normalizeChoices, type ChoiceValue } from '../../_shared/choice';
import type { RadioGroupProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioGroupProps>(), {
  options: () => [],
  modelValue: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  orientation: 'vertical',
  variant: 'default',
  classes: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: ChoiceValue];
}>();

const attrs = useAttrs();
const autoId = useId();

/** Follows the prop, and the user's choices when unbound. */
const current = ref(props.modelValue);
watch(
  () => props.modelValue,
  (value) => {
    current.value = value;
  },
);

const choices = computed(() => normalizeChoices(props.options));

function groupId(): string {
  return typeof attrs.id === 'string' && attrs.id !== '' ? attrs.id : autoId;
}

function groupName(): string {
  return typeof attrs.name === 'string' && attrs.name !== '' ? attrs.name : groupId();
}

const hasHint = () => props.hint !== undefined && props.hint !== '';
const hasError = () => props.error !== undefined && props.error !== '';
const isInvalid = () => props.invalid || hasError();

function rootAttrs(): Record<string, unknown> {
  const {
    class: className,
    name: _name,
    id: _id,
    'aria-describedby': describedBy,
    ...rest
  } = attrs;
  const ids = [
    hasHint() ? `${groupId()}-hint` : undefined,
    hasError() ? `${groupId()}-error` : undefined,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  return {
    ...rest,
    id: groupId(),
    class: ['apui-radio-group', className, props.classes?.root],
    'data-orientation': props.orientation,
    'data-variant': props.variant,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    disabled: props.disabled || undefined,
    'aria-describedby': ids.length ? ids.join(' ') : undefined,
  };
}

function isChecked(key: string): boolean {
  return current.value !== undefined && current.value !== null && String(current.value) === key;
}

function onChange(event: Event): void {
  const choice = choices.value.find(
    (option) => option.key === (event.target as HTMLInputElement).value,
  );
  if (!choice) return;
  current.value = choice.value;
  emit('update:modelValue', choice.value);
}
</script>

<template>
  <fieldset v-bind="rootAttrs()">
    <legend v-if="label" v-bind="part('radio-group', 'label', classes?.label)">
      {{ label
      }}<span
        v-if="required"
        v-bind="part('radio-group', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      >
    </legend>
    <div v-bind="part('radio-group', 'items', classes?.items)">
      <label
        v-for="(choice, index) in choices"
        :key="choice.key"
        v-bind="
          part('radio-group', 'item', classes?.item, {
            'data-disabled': flag(disabled || choice.disabled),
          })
        "
      >
        <span v-bind="part('radio-group', 'box', classes?.box)">
          <input
            v-bind="part('radio-group', 'control', classes?.control)"
            :id="`${groupId()}-${index}`"
            type="radio"
            :name="groupName()"
            :value="choice.key"
            :checked="isChecked(choice.key)"
            :disabled="disabled || choice.disabled || undefined"
            :required="required || undefined"
            :aria-invalid="isInvalid() ? 'true' : undefined"
            :aria-describedby="
              choice.description && variant !== 'segmented'
                ? `${groupId()}-${index}-description`
                : undefined
            "
            @change="onChange"
          />
          <span
            v-bind="part('radio-group', 'indicator', classes?.indicator, { 'aria-hidden': 'true' })"
          />
        </span>
        <span v-bind="part('radio-group', 'item-text', classes?.itemText)">{{ choice.label }}</span>
        <span
          v-if="choice.description && variant !== 'segmented'"
          v-bind="part('radio-group', 'item-description', classes?.itemDescription)"
          :id="`${groupId()}-${index}-description`"
          >{{ choice.description }}</span
        >
        <span
          v-if="choice.meta && variant !== 'segmented'"
          v-bind="part('radio-group', 'item-meta', classes?.itemMeta)"
          >{{ choice.meta }}</span
        >
      </label>
    </div>
    <p
      v-if="hasHint()"
      v-bind="part('radio-group', 'hint', classes?.hint)"
      :id="`${groupId()}-hint`"
    >
      {{ hint }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('radio-group', 'error', classes?.error)"
      :id="`${groupId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </fieldset>
</template>
