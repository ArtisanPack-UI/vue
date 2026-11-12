<script setup lang="ts">
/**
 * @module Pin
 *
 * A row of single-character cells for one-time codes. One native input lies
 * transparent over the cells and holds the whole code; the cells mirror it.
 * Renders the design-system Pin markup contract (`.apui-pin`, #53).
 */
import { computed, mergeProps, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { filterPin, useFormReset } from '../../_shared/form-text';
import type { PinEmits, PinProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PinProps>(), {
  length: 6,
  type: 'numeric',
  mask: false,
  groupSize: undefined,
  size: 'md',
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  modelValue: undefined,
  classes: undefined,
});

const emit = defineEmits<PinEmits>();

const attrs = useAttrs();
const autoId = useId();

const current = ref(props.modelValue ?? '');
watch(
  () => props.modelValue,
  (value) => {
    current.value = value ?? '';
  },
);

/** The native control; an uncontrolled one follows its form's reset. */
const control = ref<HTMLInputElement | null>(null);
useFormReset(
  control,
  () => props.modelValue === undefined || props.modelValue === null,
  (value) => {
    current.value = value;
  },
);

/** Each cell's character (or a dot when masked), and whether a separator follows it. */
const cells = computed(() =>
  Array.from({ length: props.length }, (_, index) => {
    const char = current.value[index] ?? '';
    const group = props.groupSize ?? 0;
    return {
      index,
      filled: char !== '',
      text: char !== '' && props.mask ? '•' : char,
      active: index === Math.min(current.value.length, props.length - 1),
      separator: group > 0 && (index + 1) % group === 0 && index < props.length - 1,
    };
  }),
);

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
    class: ['apui-pin', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
  };
}

/** Applies a typed or pasted value: filtered, written back to the input, emitted. */
function commit(element: HTMLInputElement, raw: string): void {
  const value = filterPin(raw, props.type, props.length);
  if (element.value !== value) element.value = value;
  const changed = value !== current.value;
  current.value = value;
  if (!changed) return;
  emit('update:modelValue', value);
  if (value.length === props.length) emit('complete', value);
}

function onInput(event: Event): void {
  const element = event.target as HTMLInputElement;
  commit(element, element.value);
}

function onPaste(event: ClipboardEvent): void {
  const text = event.clipboardData?.getData('text') ?? '';
  event.preventDefault();
  commit(event.target as HTMLInputElement, text);
}

function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': describedBy, ...rest } = attrs;
  const id = fieldId();
  const describedByIds = [
    hasHint() ? `${id}-hint` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  const numeric = props.type === 'numeric';
  const own: Record<string, unknown> = {
    ...part('pin', 'control', props.classes?.control),
    id,
    type: props.mask ? 'password' : 'text',
    inputmode: numeric ? 'numeric' : 'text',
    pattern: numeric ? '[0-9]*' : undefined,
    autocomplete: 'one-time-code',
    autocapitalize: 'off',
    spellcheck: 'false',
    maxlength: props.length,
    disabled: props.disabled || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    onInput,
    onPaste,
  };
  if (isInvalid()) own['aria-invalid'] = 'true';
  if (props.modelValue !== undefined && props.modelValue !== null) own.value = props.modelValue;
  return mergeProps(rest, own);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label v-if="label" v-bind="part('pin', 'label', classes?.label)" :for="fieldId()"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('pin', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="part('pin', 'cells', classes?.cells)">
      <input ref="control" v-bind="controlAttrs()" />
      <template v-for="cell in cells" :key="cell.index">
        <span
          v-bind="
            part('pin', 'cell', classes?.cell, {
              'aria-hidden': 'true',
              'data-filled': flag(cell.filled),
              'data-active': flag(cell.active),
            })
          "
          >{{ cell.text }}</span
        >
        <span
          v-if="cell.separator"
          v-bind="part('pin', 'separator', classes?.separator, { 'aria-hidden': 'true' })"
        />
      </template>
    </div>
    <p v-if="hasHint()" v-bind="part('pin', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
      {{ hint }}
    </p>
    <p v-if="hasError()" v-bind="part('pin', 'error', classes?.error)" :id="`${fieldId()}-error`">
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
