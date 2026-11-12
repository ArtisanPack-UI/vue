<script setup lang="ts">
/**
 * @module Textarea
 *
 * Multi-line text entry in Input's field anatomy, with an optional character
 * counter. Renders the design-system Textarea markup contract
 * (`.apui-textarea`, #53).
 */
import { computed, mergeProps, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { remainingAnnouncement, useFormReset } from '../../_shared/form-text';
import type { TextareaEmits, TextareaProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 4,
  maxLength: undefined,
  autoResize: false,
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  readonly: false,
  required: false,
  placeholder: undefined,
  modelValue: undefined,
  remainingLabel: 'Characters left: {count}',
  classes: undefined,
});

const emit = defineEmits<TextareaEmits>();

const attrs = useAttrs();
const autoId = useId();

/** The rendered value: follows `v-model`, and typing when uncontrolled. */
const current = ref(props.modelValue ?? '');
watch(
  () => props.modelValue,
  (value) => {
    current.value = value ?? '';
  },
);

/** The native control; an uncontrolled one follows its form's reset. */
const control = ref<HTMLTextAreaElement | null>(null);
useFormReset(
  control,
  () => props.modelValue === undefined || props.modelValue === null,
  (value) => {
    current.value = value;
  },
);

const hasCounter = computed(() => typeof props.maxLength === 'number' && props.maxLength > 0);

/** The live region's text: only near the limit, so it isn't announced on every keystroke. */
const announcement = computed(() =>
  hasCounter.value
    ? remainingAnnouncement(current.value.length, props.maxLength!, props.remainingLabel)
    : '',
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
    class: ['apui-textarea', attrs.class, props.classes?.root],
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    'data-readonly': flag(props.readonly),
    'data-auto-resize': flag(props.autoResize),
  };
}

function onInput(event: Event): void {
  const value = (event.target as HTMLTextAreaElement).value;
  current.value = value;
  emit('update:modelValue', value);
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
    ...part('textarea', 'control', props.classes?.control),
    id,
    rows: props.rows,
    maxlength: hasCounter.value ? props.maxLength : undefined,
    placeholder: props.placeholder,
    disabled: props.disabled || undefined,
    readonly: props.readonly || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    value: current.value,
    onInput,
  };
  if (isInvalid()) own['aria-invalid'] = 'true';
  return mergeProps(rest, own);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label v-if="label" v-bind="part('textarea', 'label', classes?.label)" :for="fieldId()"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('textarea', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="part('textarea', 'box', classes?.box)">
      <textarea ref="control" v-bind="controlAttrs()" />
      <template v-if="hasCounter">
        <span v-bind="part('textarea', 'count', classes?.count, { 'aria-hidden': 'true' })"
          >{{ current.length }} / {{ maxLength }}</span
        >
        <span class="apui-sr-only" aria-live="polite">{{ announcement }}</span>
      </template>
    </div>
    <p v-if="hasHint()" v-bind="part('textarea', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
      {{ hint }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('textarea', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
