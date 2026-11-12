<script setup lang="ts">
/**
 * @module Select
 *
 * Chooses one value from a short list with the native select element.
 * Renders the design-system Select markup contract (`.apui-select`, #46).
 */
import { computed, mergeProps, onMounted, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { SelectOption, SelectOptionGroup, SelectProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectProps>(), {
  size: 'md',
  options: () => [],
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  placeholder: 'Select…',
  modelValue: undefined,
  leadingIcon: undefined,
  classes: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const attrs = useAttrs();
const autoId = useId();
const control = ref<HTMLSelectElement | null>(null);

function normalizeOption(option: SelectOption) {
  return typeof option === 'object' && option !== null
    ? {
        value: String(option.value),
        original: option.value,
        label: option.label ?? String(option.value),
        disabled: !!option.disabled,
      }
    : { value: String(option), original: option, label: String(option), disabled: false };
}

function isGroup(entry: SelectOption | SelectOptionGroup): entry is SelectOptionGroup {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    Array.isArray((entry as SelectOptionGroup).options)
  );
}

/** Options and `{ label, options }` groups (native optgroups, #53), in order. */
const normalizedEntries = computed(() =>
  props.options.map((entry) =>
    isGroup(entry)
      ? {
          group: entry.label,
          key: `group-${entry.label}`,
          options: entry.options.map(normalizeOption),
        }
      : { group: undefined, key: undefined, options: [normalizeOption(entry)] },
  ),
);

const normalizedOptions = computed(() => normalizedEntries.value.flatMap((entry) => entry.options));

function selectedValue(): string | undefined {
  return props.modelValue === undefined || props.modelValue === null
    ? undefined
    : String(props.modelValue);
}

/** No value: the placeholder option is selected, even when it's disabled (required). */
function isEmpty(): boolean {
  const value = selectedValue();
  return value === undefined || value === '';
}

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
    class: ['apui-select', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
  };
}

/**
 * Emits the matching option's original value, so numbers stay numbers;
 * option children (and the placeholder) give the string.
 */
function onChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  const match = normalizedOptions.value.find((option) => option.value === value);
  emit('update:modelValue', match ? match.original : value);
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
    ...part('select', 'control', props.classes?.control),
    id,
    disabled: props.disabled || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    onChange,
  };
  // Only when invalid, so a consumer's own aria-invalid survives otherwise.
  if (isInvalid()) own['aria-invalid'] = 'true';
  return mergeProps(rest, own);
}

/**
 * Selects the bound value in the DOM, so option children from the default
 * slot are selected too (the `options` are marked `selected` in the markup),
 * and an empty value selects the placeholder even when it's disabled.
 */
function syncSelection(): void {
  const element = control.value;
  const value = selectedValue() ?? '';
  if (!element) return;
  if ([...element.options].some((option) => option.value === value)) element.value = value;
}

onMounted(syncSelection);
watch(() => [props.modelValue, props.options], syncSelection, { flush: 'post', deep: true });
</script>

<template>
  <div v-bind="rootAttrs()">
    <label v-if="label" v-bind="part('select', 'label', classes?.label)" :for="fieldId()"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('select', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="part('select', 'box', classes?.box)">
      <span
        v-if="$slots.icon || leadingIcon"
        v-bind="part('select', 'icon', classes?.icon, { 'aria-hidden': 'true' })"
      >
        <slot name="icon"><DsIcon :name="leadingIcon" /></slot>
      </span>
      <select ref="control" v-bind="controlAttrs()">
        <option
          v-if="placeholder !== ''"
          value=""
          :selected="isEmpty() || undefined"
          :disabled="required || undefined"
        >
          {{ placeholder }}
        </option>
        <template v-for="entry in normalizedEntries" :key="entry.key ?? entry.options[0]?.value">
          <optgroup v-if="entry.group !== undefined" :label="entry.group">
            <option
              v-for="option in entry.options"
              :key="option.value"
              :value="option.value"
              :selected="option.value === selectedValue() || undefined"
              :disabled="option.disabled || undefined"
            >
              {{ option.label }}
            </option>
          </optgroup>
          <option
            v-else
            :value="entry.options[0]!.value"
            :selected="entry.options[0]!.value === selectedValue() || undefined"
            :disabled="entry.options[0]!.disabled || undefined"
          >
            {{ entry.options[0]!.label }}
          </option>
        </template>
        <slot />
      </select>
      <span v-bind="part('select', 'indicator', classes?.indicator, { 'aria-hidden': 'true' })">
        <DsIcon name="chevron-down" />
      </span>
    </div>
    <p v-if="hasHint()" v-bind="part('select', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
      {{ hint }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('select', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
