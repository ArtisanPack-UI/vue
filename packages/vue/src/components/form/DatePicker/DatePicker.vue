<script setup lang="ts">
/**
 * @module DatePicker
 *
 * A text field with a calendar popover for a single date or a range; with
 * `time` it's DateTime (date and time in one field). Renders the
 * design-system DatePicker markup contract (`.apui-date-picker`, #55) on the
 * shared Zag date-picker machine (`useDatePicker`): a `role=grid` month whose
 * arrow keys follow the text direction, Intl month and weekday names, and a
 * time listbox. Values are ISO 8601 strings.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useId, useSlots } from 'vue';
import { timeOptions, toIso, useDatePicker } from '@artisanpack-ui/behavior/vue';
import Button from '../Button/Button.vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { DatePickerEmits, DatePickerProps, DatePickerValue } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: undefined,
  mode: 'single',
  time: false,
  step: 30,
  timeZone: undefined,
  locale: 'en-US',
  min: undefined,
  max: undefined,
  disabledDates: undefined,
  weekStartsOn: undefined,
  format: undefined,
  size: 'md',
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  readonly: false,
  required: false,
  placeholder: undefined,
  name: undefined,
  open: false,
  portal: true,
  footer: undefined,
  triggerLabel: undefined,
  previousLabel: 'Previous month',
  nextLabel: 'Next month',
  calendarLabel: 'Calendar',
  timeLabel: 'Time',
  endLabel: 'End date',
  timeZoneLabel: 'Time zone: {zone}',
  classes: undefined,
});

const emit = defineEmits<DatePickerEmits>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const autoId = useId();

/** Whether the parent passes a prop (`v-model` or `:prop`): then it's controlled. */
function isBound(name: 'modelValue' | 'open'): boolean {
  const raw = instance?.vnode.props;
  return !!raw && (name in raw || (name === 'modelValue' && 'model-value' in raw));
}

const localValue = ref<DatePickerValue>(props.modelValue ?? null);
const localOpen = ref(props.open);

function fieldId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

const isRange = computed(() => props.mode === 'range');
const hasTime = computed(() => props.time && !isRange.value);
const isInvalid = computed(() => props.invalid || (!!props.error && props.error !== ''));
const zoneText = computed(() =>
  hasTime.value && props.timeZone
    ? props.timeZoneLabel.replace('{zone}', props.timeZone)
    : undefined,
);

const machine = useDatePicker(() => {
  const id = fieldId();
  return {
    id,
    ids: {
      root: `${id}-root`,
      control: `${id}-box`,
      trigger: `${id}-trigger`,
      positioner: `${id}-positioner`,
      content: `${id}-content`,
      input: (index: number) => (index ? `${id}-${index}` : id),
      label: () => `${id}-label`,
      prevTrigger: () => `${id}-prev-trigger`,
      nextTrigger: () => `${id}-next-trigger`,
      table: () => `${id}-table`,
    },
    value: isBound('modelValue') ? props.modelValue : localValue.value,
    open: isBound('open') ? props.open : localOpen.value,
    onValueChange: ({ value }) => {
      if (!isBound('modelValue')) localValue.value = value;
      emit('update:modelValue', value);
    },
    onOpenChange: ({ open }) => {
      if (!isBound('open')) localOpen.value = open;
      emit('update:open', open);
    },
    mode: props.mode,
    time: hasTime.value,
    locale: props.locale,
    timeZone: props.timeZone,
    min: props.min,
    max: props.max,
    disabledDates: props.disabledDates,
    weekStartsOn: props.weekStartsOn,
    format: props.format,
    disabled: props.disabled,
    readOnly: props.readonly,
    required: props.required,
    invalid: isInvalid.value,
    placeholder: props.placeholder,
    labels: {
      trigger: props.triggerLabel ?? (hasTime.value ? 'Choose date and time' : 'Choose date'),
      previous: props.previousLabel,
      next: props.nextLabel,
      calendar: props.calendarLabel,
    },
  };
});

/**
 * The machine's API, re-wrapped in this package's `computed`: the
 * composable's ref is typed by the design system's copy of Vue, which the
 * template type-check wouldn't unwrap.
 */
const api = computed(() => machine.value);

const times = computed(() => (hasTime.value ? timeOptions(props.step) : []));
const iso = computed(() => api.value.value.map((date) => toIso(date, hasTime.value)));

function hasLabel(): boolean {
  return !!slots.label || (!!props.label && props.label !== '');
}

function hasHint(): boolean {
  return !!slots.hint || (!!props.hint && props.hint !== '');
}

function hasError(): boolean {
  return !!props.error && props.error !== '';
}

function hasFooter(): boolean {
  return !!slots.footer || (!!props.footer && props.footer !== '');
}

function describedBy(): string | undefined {
  const id = fieldId();
  const own = attrs['aria-describedby'];
  const ids = [
    hasHint() ? `${id}-hint` : undefined,
    zoneText.value ? `${id}-time-zone` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof own === 'string' && own !== '' ? own : undefined,
  ].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(api.value.getRootProps() as Record<string, unknown>, {
    class: ['apui-date-picker', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-mode': props.mode,
    'data-time': flag(hasTime.value),
    'data-invalid': flag(isInvalid.value),
    'data-disabled': flag(props.disabled),
    'data-readonly': flag(props.readonly),
  });
}

/** The first input: the machine's props plus every attribute but `class` and `id`. */
function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': _describedBy, ...rest } = attrs;
  return mergeProps(rest, api.value.getInputProps({ index: 0 }) as Record<string, unknown>, {
    class: props.classes?.control,
    'aria-describedby': describedBy(),
  });
}

function endAttrs(): Record<string, unknown> {
  return mergeProps(api.value.getInputProps({ index: 1 }) as Record<string, unknown>, {
    class: props.classes?.control,
    'aria-label': props.endLabel,
    'aria-describedby': describedBy(),
  });
}

/** Zag's props for a part, plus its extra class. */
function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label
      v-if="hasLabel()"
      v-bind="part('date-picker', 'label', classes?.label)"
      :id="`${fieldId()}-label`"
      :for="fieldId()"
      ><slot name="label">{{ label }}</slot
      ><span
        v-if="required"
        v-bind="part('date-picker', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="withClass(api.getControlProps(), classes?.box)">
      <button v-bind="withClass(api.getTriggerProps(), classes?.trigger)">
        <DsIcon :name="hasTime ? 'calendar-days' : 'calendar'" />
      </button>
      <input v-bind="controlAttrs()" />
      <template v-if="isRange">
        <span aria-hidden="true">–</span>
        <input v-bind="endAttrs()" />
      </template>
    </div>
    <template v-if="name">
      <template v-if="isRange">
        <input type="hidden" :name="`${name}[]`" :value="iso[0] ?? ''" />
        <input type="hidden" :name="`${name}[]`" :value="iso[1] ?? ''" />
      </template>
      <input v-else type="hidden" :name="name" :value="iso[0] ?? ''" />
    </template>
    <p
      v-if="hasHint()"
      v-bind="part('date-picker', 'hint', classes?.hint)"
      :id="`${fieldId()}-hint`"
    >
      <slot name="hint">{{ hint }}</slot>
    </p>
    <p
      v-if="zoneText"
      v-bind="part('date-picker', 'time-zone', classes?.timeZone)"
      :id="`${fieldId()}-time-zone`"
    >
      {{ zoneText }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('date-picker', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
    <Teleport to="body" :disabled="!portal">
      <div v-bind="withClass(api.getPositionerProps(), classes?.positioner)">
        <div v-bind="withClass(api.getContentProps(), classes?.content)" :data-time="flag(hasTime)">
          <div v-bind="withClass(api.getViewProps(), classes?.view)">
            <div v-bind="withClass(api.getViewControlProps(), classes?.viewControl)">
              <Button
                variant="ghost"
                color="neutral"
                size="sm"
                icon-only
                leading-icon="chevron-left"
                :aria-label="previousLabel"
                v-bind="withClass(api.getPrevTriggerProps(), classes?.prevTrigger)"
              />
              <span v-bind="withClass(api.getRangeTextProps(), classes?.rangeText)">{{
                api.visibleRangeText.start
              }}</span>
              <Button
                variant="ghost"
                color="neutral"
                size="sm"
                icon-only
                leading-icon="chevron-right"
                :aria-label="nextLabel"
                v-bind="withClass(api.getNextTriggerProps(), classes?.nextTrigger)"
              />
            </div>
            <table v-bind="withClass(api.getTableProps(), classes?.table)">
              <thead v-bind="withClass(api.getTableHeadProps(), classes?.tableHead)">
                <tr v-bind="withClass(api.getTableRowProps(), classes?.tableRow)">
                  <th
                    v-for="(weekDay, index) in api.weekDays"
                    :key="index"
                    v-bind="withClass(api.getTableHeaderProps(), classes?.tableHeader)"
                    scope="col"
                    :abbr="weekDay.long"
                  >
                    {{ weekDay.short }}
                  </th>
                </tr>
              </thead>
              <tbody v-bind="withClass(api.getTableBodyProps(), classes?.tableBody)">
                <tr
                  v-for="(week, row) in api.weeks"
                  :key="row"
                  v-bind="withClass(api.getTableRowProps(), classes?.tableRow)"
                >
                  <td
                    v-for="day in week"
                    :key="toIso(day)"
                    v-bind="withClass(api.getDayTableCellProps({ value: day }), classes?.tableCell)"
                  >
                    <div
                      v-bind="
                        withClass(
                          api.getDayTableCellTriggerProps({ value: day }),
                          classes?.tableCellTrigger,
                        )
                      "
                    >
                      {{ day.day }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="hasTime" v-bind="part('date-picker', 'time', classes?.time)">
            <span
              v-bind="
                part('date-picker', 'time-label', classes?.timeLabel, { 'aria-hidden': 'true' })
              "
              >{{ timeLabel }}</span
            >
            <div
              v-bind="
                withClass(
                  api.getTimeListProps({ label: timeLabel, id: `${fieldId()}-time-list` }),
                  classes?.timeList,
                )
              "
            >
              <div
                v-for="option in times"
                :key="option.value"
                v-bind="
                  withClass(
                    api.getTimeOptionProps({
                      value: option.value,
                      step,
                      id: `${fieldId()}-time-${option.value.replace(':', '')}`,
                    }),
                    classes?.timeOption,
                  )
                "
              >
                {{ option.label }}
              </div>
            </div>
          </div>
          <div v-if="hasFooter()" v-bind="part('date-picker', 'footer', classes?.footer)">
            <slot name="footer">{{ footer }}</slot>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
