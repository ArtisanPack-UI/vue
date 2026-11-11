<script setup lang="ts">
/**
 * @module Toggle
 *
 * A switch for settings that take effect immediately: a native checkbox with
 * `role="switch"` in Checkbox's field anatomy. Renders the design-system
 * Toggle markup contract (`.apui-toggle`, #53).
 */
import { mergeProps, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { ToggleEmits, ToggleProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleProps>(), {
  checked: false,
  size: 'md',
  color: 'primary',
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  classes: undefined,
});

const emit = defineEmits<ToggleEmits>();

const attrs = useAttrs();
const autoId = useId();

/** The rendered state: follows the prop, and the user's toggles when uncontrolled. */
const isChecked = ref(props.checked);
watch(
  () => props.checked,
  (checked) => {
    isChecked.value = checked;
  },
);

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
    class: ['apui-toggle', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-color': props.color,
    'data-state': isChecked.value ? 'checked' : 'unchecked',
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
  };
}

function onChange(event: Event): void {
  const element = event.target as HTMLInputElement;
  isChecked.value = element.checked;
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
    ...part('toggle', 'control', props.classes?.control),
    type: 'checkbox',
    role: 'switch',
    id,
    checked: isChecked.value || undefined,
    disabled: props.disabled || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    onChange,
  };
  if (isInvalid()) own['aria-invalid'] = 'true';
  return mergeProps(rest, own);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <span v-bind="part('toggle', 'track', classes?.track)">
      <input v-bind="controlAttrs()" />
      <span v-bind="part('toggle', 'thumb', classes?.thumb, { 'aria-hidden': 'true' })" />
    </span>
    <label v-if="label" v-bind="part('toggle', 'label', classes?.label)" :for="fieldId()">
      {{ label }}
    </label>
    <p
      v-if="hasDescription()"
      v-bind="part('toggle', 'description', classes?.description)"
      :id="`${fieldId()}-description`"
    >
      {{ description }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('toggle', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
