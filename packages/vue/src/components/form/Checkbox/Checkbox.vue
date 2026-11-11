<script setup lang="ts">
/**
 * @module Checkbox
 *
 * Turns one option on or off, with an indeterminate (mixed) state. Renders
 * the design-system Checkbox markup contract (`.apui-checkbox`, #47).
 */
import {
  mergeProps,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useAttrs,
  useId,
  watch,
  watchEffect,
} from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { CheckboxProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxProps>(), {
  checked: false,
  indeterminate: false,
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  classes: undefined,
});

const emit = defineEmits<{
  'update:checked': [checked: boolean];
}>();

const attrs = useAttrs();
const autoId = useId();
const control = ref<HTMLInputElement | null>(null);

/** The rendered state: follows the prop, and the user's toggles when uncontrolled. */
const isChecked = ref(props.checked);
watch(
  () => props.checked,
  (checked) => {
    isChecked.value = checked;
  },
);

/** The native indeterminate property has no attribute, so it's set on the element. */
watchEffect(
  () => {
    if (control.value) control.value.indeterminate = props.indeterminate;
  },
  { flush: 'post' },
);

/** Re-asserts the native property after every render, which a toggle may have cleared. */
onUpdated(() => {
  if (control.value) control.value.indeterminate = props.indeterminate;
});

/**
 * A form reset puts the native checkbox back to its default. Resync to the
 * `checked` prop: for an uncontrolled checkbox that's its initial value, for
 * a controlled one the owner's current value.
 */
let resetForm: HTMLFormElement | null = null;

function onFormReset(): void {
  // The reset event fires before the form resets its controls (a reset button
  // does it after microtasks), so read the state after a task, not a tick.
  setTimeout(() => {
    isChecked.value = props.checked;
    if (control.value) {
      control.value.checked = props.checked;
      control.value.indeterminate = props.indeterminate;
    }
  }, 0);
}

onMounted(() => {
  resetForm = control.value?.form ?? null;
  resetForm?.addEventListener('reset', onFormReset);
});

onBeforeUnmount(() => {
  resetForm?.removeEventListener('reset', onFormReset);
});

function state(): 'checked' | 'indeterminate' | 'unchecked' {
  if (props.indeterminate) return 'indeterminate';
  return isChecked.value ? 'checked' : 'unchecked';
}

function fieldId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

function isInvalid(): boolean {
  return props.invalid || (props.error !== undefined && props.error !== '');
}

function hasDescription(): boolean {
  return props.description !== undefined && props.description !== '';
}

function hasError(): boolean {
  return props.error !== undefined && props.error !== '';
}

function rootAttrs(): Record<string, unknown> {
  return {
    class: ['apui-checkbox', attrs.class, props.classes?.root],
    'data-state': state(),
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
  };
}

function onChange(event: Event): void {
  const element = event.target as HTMLInputElement;
  isChecked.value = element.checked;
  // The browser clears `indeterminate` on toggle; clearing it is up to the owner.
  element.indeterminate = props.indeterminate;
  emit('update:checked', element.checked);
}

function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': describedBy, ...rest } = attrs;
  const id = fieldId();
  const describedByIds = [
    hasDescription() ? `${id}-description` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  const own: Record<string, unknown> = {
    ...part('checkbox', 'control', props.classes?.control),
    type: 'checkbox',
    id,
    checked: isChecked.value || undefined,
    disabled: props.disabled || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    onChange,
  };
  // Only when invalid, so a consumer's own aria-invalid survives otherwise.
  if (isInvalid()) own['aria-invalid'] = 'true';
  return mergeProps(rest, own);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <span v-bind="part('checkbox', 'box', classes?.box)">
      <input ref="control" v-bind="controlAttrs()" />
      <span v-bind="part('checkbox', 'indicator', classes?.indicator, { 'aria-hidden': 'true' })">
        <DsIcon name="check" data-icon="check" /><DsIcon name="minus" data-icon="minus" />
      </span>
    </span>
    <label v-if="label" v-bind="part('checkbox', 'label', classes?.label)" :for="fieldId()">
      {{ label }}
    </label>
    <p
      v-if="hasDescription()"
      v-bind="part('checkbox', 'description', classes?.description)"
      :id="`${fieldId()}-description`"
    >
      {{ description }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('checkbox', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
