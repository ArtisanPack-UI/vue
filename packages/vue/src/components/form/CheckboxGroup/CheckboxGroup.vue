<script setup lang="ts">
/**
 * @module CheckboxGroup
 *
 * A labeled set of related checkboxes whose value is the array of checked
 * values, with select all (mixed state), columns and cards. Each option is
 * the design-system Checkbox. Renders the CheckboxGroup markup contract
 * (`.apui-checkbox-group`, #53).
 */
import { computed, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { normalizeChoices, type ChoiceValue } from '../../_shared/choice';
import Checkbox from '../Checkbox/Checkbox.vue';
import type { CheckboxGroupProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  options: () => [],
  modelValue: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  orientation: 'vertical',
  variant: 'default',
  columns: 1,
  selectAll: false,
  selectAllLabel: 'Select all',
  classes: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: ChoiceValue[]];
}>();

const attrs = useAttrs();
const autoId = useId();

/** Follows the prop, and the user's toggles when unbound. */
const current = ref<ChoiceValue[]>(props.modelValue ?? []);
watch(
  () => props.modelValue,
  (value) => {
    current.value = value ?? [];
  },
);

const choices = computed(() => normalizeChoices(props.options));
const checkedKeys = computed(() => new Set(current.value.map(String)));
/** Select all reflects the options that aren't disabled on their own, also while the group is. */
const enabled = computed(() => choices.value.filter((choice) => !choice.disabled));
const enabledChecked = computed(
  () => enabled.value.filter((choice) => checkedKeys.value.has(choice.key)).length,
);

function groupId(): string {
  return typeof attrs.id === 'string' && attrs.id !== '' ? attrs.id : autoId;
}

function optionName(): string | undefined {
  return typeof attrs.name === 'string' && attrs.name !== '' ? attrs.name : undefined;
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
    class: ['apui-checkbox-group', className, props.classes?.root],
    'data-orientation': props.orientation,
    'data-variant': props.variant,
    'data-columns': props.columns,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    disabled: props.disabled || undefined,
    'aria-describedby': ids.length ? ids.join(' ') : undefined,
  };
}

function commit(keys: Set<string>): void {
  // Values that no option stands for (set by the owner) are kept, after the options'.
  const known = new Set(choices.value.map((choice) => choice.key));
  const next = [
    ...choices.value.filter((choice) => keys.has(choice.key)).map((choice) => choice.value),
    ...current.value.filter((item) => !known.has(String(item))),
  ];
  current.value = next;
  emit('update:modelValue', next);
}

function toggle(key: string, on: boolean): void {
  const keys = new Set(checkedKeys.value);
  if (on) keys.add(key);
  else keys.delete(key);
  commit(keys);
}

function toggleAll(on: boolean): void {
  const keys = new Set(checkedKeys.value);
  for (const choice of enabled.value) {
    if (on) keys.add(choice.key);
    else keys.delete(choice.key);
  }
  commit(keys);
}
</script>

<template>
  <fieldset v-bind="rootAttrs()">
    <legend v-if="label" v-bind="part('checkbox-group', 'label', classes?.label)">
      {{ label }}
    </legend>
    <div v-if="selectAll" v-bind="part('checkbox-group', 'select-all', classes?.selectAll)">
      <Checkbox
        :id="`${groupId()}-all`"
        :label="selectAllLabel"
        :checked="enabled.length > 0 && enabledChecked === enabled.length"
        :indeterminate="enabledChecked > 0 && enabledChecked < enabled.length"
        :disabled="disabled"
        @update:checked="toggleAll"
      />
    </div>
    <div v-bind="part('checkbox-group', 'items', classes?.items)">
      <Checkbox
        v-for="(choice, index) in choices"
        :id="`${groupId()}-${index}`"
        :key="choice.key"
        :name="optionName()"
        :value="choice.key"
        :label="choice.label"
        :description="choice.description"
        :checked="checkedKeys.has(choice.key)"
        :invalid="isInvalid()"
        :disabled="disabled || choice.disabled"
        @update:checked="(on: boolean) => toggle(choice.key, on)"
      />
    </div>
    <p
      v-if="hasHint()"
      v-bind="part('checkbox-group', 'hint', classes?.hint)"
      :id="`${groupId()}-hint`"
    >
      {{ hint }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('checkbox-group', 'error', classes?.error)"
      :id="`${groupId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </fieldset>
</template>
