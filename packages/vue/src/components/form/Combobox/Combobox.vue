<script setup lang="ts">
/**
 * @module Combobox
 *
 * A text input that filters a listbox: one value, or several shown as
 * removable chips, and optionally a value that isn't listed. Renders the
 * design-system Combobox markup contract (`.apui-combobox`, #54) on the
 * shared Zag combobox machine (`useCombobox`). `multiple` + `allowCreate` is
 * the tags input. Replaces Choices and Tags.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useId, watch } from 'vue';
import {
  type ComboboxItem,
  formatLabel,
  highlight,
  useCombobox,
} from '@artisanpack-ui/behavior/vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { ComboboxPart, ComboboxProps, ComboboxValue } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ComboboxProps>(), {
  size: 'md',
  options: () => [],
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  placeholder: 'Search…',
  modelValue: undefined,
  multiple: false,
  max: undefined,
  allowCreate: false,
  remote: false,
  search: undefined,
  loading: false,
  clearable: false,
  open: false,
  portal: true,
  leadingIcon: undefined,
  emptyLabel: 'No matches for “{search}”.',
  loadingLabel: 'Loading…',
  createLabel: 'Create “{value}”',
  removeLabel: 'Remove {label}',
  removedLabel: 'Removed {label}.',
  clearLabel: 'Clear',
  triggerLabel: 'Show options',
  classes: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: ComboboxValue];
  'search-change': [search: string];
  'update:open': [open: boolean];
  create: [value: string];
}>();

const attrs = useAttrs();
const autoId = useId();
const instance = getCurrentInstance();

/** Whether the parent passes a prop (`v-model` or a static value), so the combobox follows it. */
function isBound(name: string): boolean {
  const raw = instance?.vnode.props;
  return !!raw && (name in raw || name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`) in raw);
}

/** A value as an array of strings. */
function toArray(value: ComboboxValue | undefined): string[] {
  if (Array.isArray(value)) return value.map(String);
  return value === null || value === undefined || value === '' ? [] : [String(value)];
}

/** The options' own values by their string form, so a number comes back as a number. */
const originals = computed(
  () =>
    new Map(
      props.options.map((option) => {
        const value = typeof option === 'object' && option !== null ? option.value : option;
        return [String(value), value] as const;
      }),
    ),
);

/** The value in the shape `multiple` asks for, with the options' own values: an array, or one value or null. */
function shaped(values: string[]): ComboboxValue {
  const original = values.map((value) => originals.value.get(value) ?? value);
  return props.multiple ? original : (original[0] ?? null);
}

/** The value when unbound. */
const localValue = ref<string[]>(toArray(props.modelValue));
const localOpen = ref(props.open);

/** The values shown: the prop's when bound, else the local ones. */
const values = computed(() =>
  isBound('modelValue') ? toArray(props.modelValue) : localValue.value,
);
const shownValues = computed(() => (props.multiple ? values.value : values.value.slice(0, 1)));
const shownOpen = () => (isBound('open') ? props.open : localOpen.value);

/** Options created here that the parent's options don't list (yet). */
const created = ref<ComboboxItem[]>([]);

const listed = computed<ComboboxItem[]>(() =>
  props.options.map((option) =>
    typeof option === 'object' && option !== null
      ? {
          value: String(option.value),
          label: option.label ?? String(option.value),
          description: option.description,
          icon: option.icon,
          color: option.color,
          disabled: !!option.disabled,
        }
      : { value: String(option), label: String(option) },
  ),
);

const items = computed<ComboboxItem[]>(() => [
  ...listed.value,
  ...created.value.filter((item) => !listed.value.some((entry) => entry.value === item.value)),
]);

/** Every known option by value, for chip and input labels. */
const known = computed(() => new Map(items.value.map((item) => [item.value, item])));

const labelOf = (value: string) => known.value.get(value)?.label ?? value;

/** The typed text the options are filtered and marked by; empty after a choice. */
const query = ref(props.search ?? '');

/** The input's text: typed, or the chosen option's label. */
const inputText = ref(
  props.search ?? (props.multiple ? '' : shownValues.value[0] ? labelOf(shownValues.value[0]) : ''),
);

/** The status region's text: the last removed chip. */
const status = ref('');

function fieldId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

/** The input's id, which the label's `for` and the hint and error ids build on. */
const controlId = () => `${fieldId()}-control`;

function isInvalid(): boolean {
  return props.invalid || hasError();
}

function hasHint(): boolean {
  return props.hint !== undefined && props.hint !== '';
}

function hasError(): boolean {
  return props.error !== undefined && props.error !== '';
}

function setValues(next: string[]): void {
  if (!isBound('modelValue')) localValue.value = next;
  emit('update:modelValue', shaped(next));
}

const machine = useCombobox(() => ({
  id: fieldId(),
  ids: { input: controlId(), label: `${fieldId()}-label` },
  items: items.value,
  value: props.multiple ? shownValues.value : (shownValues.value[0] ?? null),
  open: shownOpen(),
  inputValue: inputText.value,
  multiple: props.multiple,
  disabled: props.disabled,
  invalid: isInvalid(),
  required: props.required,
  loading: props.loading,
  placeholder: props.placeholder,
  remote: props.remote,
  allowCreate: props.allowCreate,
  max: props.max,
  defaultInputValue: props.search,
  translations: { triggerLabel: props.triggerLabel, clearTriggerLabel: props.clearLabel },
  onValueChange: ({ value }) => setValues(toArray(value)),
  onCreate: ({ value }) => {
    created.value = [...created.value, { value, label: value }];
    emit('create', value);
  },
  onOpenChange: ({ open }) => {
    if (!isBound('open')) localOpen.value = open;
    if (!open) query.value = '';
    emit('update:open', open);
  },
  onInputValueChange: ({ inputValue, reason }) => {
    inputText.value = inputValue;
    query.value = reason === 'input-change' ? inputValue : '';
    if (reason === 'input-change') emit('search-change', inputValue);
  },
}));

/**
 * The machine's API, re-wrapped in this package's `computed`: the
 * composable's ref is typed by the design system's copy of Vue, which the
 * template type-check wouldn't unwrap.
 */
const combo = computed(() => machine.value);

/** A value set from outside shows its label in the input while nobody types. */
watch(
  () => [shownValues.value[0], known.value],
  () => {
    if (props.multiple || query.value !== '') return;
    const value = shownValues.value[0];
    inputText.value = value === undefined ? '' : labelOf(value);
  },
);

function classOf(name: ComboboxPart): string | undefined {
  return props.classes?.[name];
}

/** Zag's props for a part, plus its extra class. */
function withClass(zagProps: unknown, name: ComboboxPart): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  const className = classOf(name);
  return className ? mergeProps(own, { class: className }) : own;
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, combo.value.getRootProps() as Record<string, unknown>, {
    class: ['apui-combobox', props.classes?.root],
    id: undefined,
    'data-size': props.size,
    'data-multiple': flag(props.multiple),
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    'data-loading': flag(props.loading),
  });
}

/** Removes one chosen value and announces it. */
function remove(value: string): void {
  if (props.disabled) return;
  const current = shownValues.value;
  if (!current.includes(value)) return;
  setValues(current.filter((entry) => entry !== value));
  status.value = formatLabel(props.removedLabel, { label: labelOf(value) });
}

/** Backspace in the empty input removes the last chip. */
function onKeydown(event: KeyboardEvent): void {
  if (!props.multiple || event.key !== 'Backspace') return;
  if ((event.target as HTMLInputElement).value !== '') return;
  const last = shownValues.value.at(-1);
  if (last !== undefined) remove(last);
}

function controlAttrs(): Record<string, unknown> {
  const describedBy = [
    hasHint() ? `${controlId()}-hint` : undefined,
    hasError() ? `${controlId()}-error` : undefined,
  ].filter(Boolean);
  return mergeProps(withClass(combo.value.getInputProps(), 'control'), {
    'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
    onKeydown,
  });
}

function itemAttrs(item: ComboboxItem): Record<string, unknown> {
  return mergeProps(withClass(combo.value.getItemProps({ item }), 'item'), {
    'data-create': flag(item.create),
  });
}

/** The chips: the chosen values with their labels and colors. */
const chips = computed(() =>
  props.multiple
    ? shownValues.value.map((value) => ({
        value,
        label: labelOf(value),
        color: known.value.get(value)?.color,
      }))
    : [],
);

const emptyText = () =>
  props.loading ? props.loadingLabel : formatLabel(props.emptyLabel, { search: query.value });
</script>

<template>
  <div v-bind="rootAttrs()">
    <template v-if="name">
      <input v-for="entry in shownValues" :key="entry" type="hidden" :name="name" :value="entry" />
    </template>
    <label v-if="label" v-bind="withClass(combo.getLabelProps(), 'label')"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('combobox', 'required', classOf('required'), { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="withClass(combo.getControlProps(), 'box')">
      <span
        v-if="$slots.icon || leadingIcon"
        v-bind="part('combobox', 'icon', classOf('icon'), { 'aria-hidden': 'true' })"
      >
        <slot name="icon"><DsIcon :name="leadingIcon" /></slot>
      </span>
      <span
        v-for="chip in chips"
        :key="chip.value"
        v-bind="
          part('combobox', 'chip', classOf('chip'), {
            'data-value': chip.value,
            'data-color': chip.color,
          })
        "
        >{{ chip.label
        }}<button
          type="button"
          v-bind="
            part('combobox', 'chip-remove', classOf('chipRemove'), {
              'aria-label': formatLabel(removeLabel, { label: chip.label }),
              disabled: disabled || undefined,
            })
          "
          @click="remove(chip.value)"
        >
          <DsIcon name="x" /></button
      ></span>
      <input v-bind="controlAttrs()" />
      <span
        v-if="loading"
        v-bind="part('combobox', 'spinner', classOf('spinner'), { 'aria-hidden': 'true' })"
      ></span>
      <button v-if="clearable" v-bind="withClass(combo.getClearTriggerProps(), 'clearTrigger')">
        <DsIcon name="x" />
      </button>
      <button v-bind="withClass(combo.getTriggerProps(), 'trigger')">
        <DsIcon name="chevron-down" />
      </button>
    </div>
    <p
      v-if="hasHint()"
      v-bind="part('combobox', 'hint', classOf('hint'))"
      :id="`${controlId()}-hint`"
    >
      {{ hint }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('combobox', 'error', classOf('error'))"
      :id="`${controlId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
    <Teleport to="body" :disabled="!portal">
      <div v-bind="withClass(combo.getPositionerProps(), 'positioner')">
        <div v-bind="withClass(combo.getContentProps(), 'content')">
          <div v-for="item in combo.items" :key="item.value" v-bind="itemAttrs(item)">
            <span
              v-if="multiple && !item.create"
              v-bind="withClass(combo.getItemIndicatorProps({ item }), 'itemIndicator')"
            >
              <DsIcon name="check" />
            </span>
            <span
              v-if="item.create || item.icon"
              v-bind="part('combobox', 'icon', classOf('icon'), { 'aria-hidden': 'true' })"
            >
              <DsIcon :name="item.create ? 'plus' : item.icon" />
            </span>
            <span v-bind="withClass(combo.getItemTextProps({ item }), 'itemText')">
              <template v-if="item.create">{{
                formatLabel(createLabel, { value: item.label })
              }}</template>
              <slot v-else name="item" :option="item"
                ><template v-for="(segment, index) in highlight(item.label, query)" :key="index"
                  ><mark v-if="segment.match" v-bind="part('combobox', 'mark', classOf('mark'))">{{
                    segment.text
                  }}</mark
                  ><template v-else>{{ segment.text }}</template></template
                ><span
                  v-if="item.description"
                  v-bind="part('combobox', 'item-description', classOf('itemDescription'))"
                  >{{ item.description }}</span
                ></slot
              >
            </span>
          </div>
          <div v-bind="withClass(combo.getEmptyProps(), 'empty')">
            <template v-if="loading">{{ loadingLabel }}</template>
            <slot v-else name="empty">{{ emptyText() }}</slot>
          </div>
        </div>
      </div>
    </Teleport>
    <span
      v-bind="
        part('combobox', 'status', classOf('status'), { role: 'status', 'aria-live': 'polite' })
      "
      >{{ status }}</span
    >
  </div>
</template>
