<script setup lang="ts">
/**
 * @module Input
 *
 * Single-line text entry with a visible label, hint and error. Renders the
 * design-system Input markup contract (`.apui-input`, #45).
 */
import { mergeProps, useAttrs, useId } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { InputEmits, InputProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputProps>(), {
  size: 'md',
  type: 'text',
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  readonly: false,
  required: false,
  placeholder: undefined,
  modelValue: undefined,
  prefix: undefined,
  suffix: undefined,
  leadingIcon: undefined,
  trailingIcon: undefined,
  classes: undefined,
});

/** Emits the native string value; see `InputEmits`. */
const emit = defineEmits<InputEmits>();

const attrs = useAttrs();
const autoId = useId();

function fieldId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

function isInvalid(): boolean {
  return props.invalid || (props.error !== undefined && props.error !== '');
}

function hasHint(): boolean {
  return props.hint !== undefined && props.hint !== '';
}

function hasError(): boolean {
  return props.error !== undefined && props.error !== '';
}

function rootAttrs(): Record<string, unknown> {
  return {
    class: ['apui-input', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    'data-readonly': flag(props.readonly),
  };
}

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': describedBy, ...rest } = attrs;
  const id = fieldId();
  const describedByIds = [
    hasHint() ? `${id}-hint` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  const own: Record<string, unknown> = {
    ...part('input', 'control', props.classes?.control),
    id,
    type: props.type,
    placeholder: props.placeholder,
    disabled: props.disabled || undefined,
    readonly: props.readonly || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    onInput,
  };
  // Only when invalid, so a consumer's own aria-invalid survives otherwise.
  if (isInvalid()) own['aria-invalid'] = 'true';
  if (props.modelValue !== undefined && props.modelValue !== null) {
    own.value = props.modelValue;
  }
  return mergeProps(rest, own);
}

function iconAttrs(name: 'icon' | 'iconEnd') {
  return part('input', name, props.classes?.[name], { 'aria-hidden': 'true' });
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label v-if="label" v-bind="part('input', 'label', classes?.label)" :for="fieldId()"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('input', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="part('input', 'box', classes?.box)">
      <span v-if="$slots.icon || leadingIcon" v-bind="iconAttrs('icon')">
        <slot name="icon"><DsIcon :name="leadingIcon" /></slot>
      </span>
      <span v-if="$slots.prefix || prefix" v-bind="part('input', 'prefix', classes?.prefix)">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <input v-bind="controlAttrs()" />
      <span v-if="$slots.suffix || suffix" v-bind="part('input', 'suffix', classes?.suffix)">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
      <span v-if="$slots.iconEnd || trailingIcon" v-bind="iconAttrs('iconEnd')">
        <slot name="iconEnd"><DsIcon :name="trailingIcon" /></slot>
      </span>
    </div>
    <p v-if="hasHint()" v-bind="part('input', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
      {{ hint }}
    </p>
    <p v-if="hasError()" v-bind="part('input', 'error', classes?.error)" :id="`${fieldId()}-error`">
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
