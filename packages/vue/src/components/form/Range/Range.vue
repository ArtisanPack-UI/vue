<script setup lang="ts">
/**
 * @module Range
 *
 * A slider for one value, or two thumbs for a from–to range. Each thumb is a
 * native `<input type="range">` laid over the drawn track. Renders the
 * design-system Range markup contract (`.apui-range`, #53).
 */
import { computed, mergeProps, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { dualThumbAttrs, formatRangeValue, percentOf } from '../../_shared/form-text';
import type { RangeEmits, RangeProps, RangeValue } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RangeProps>(), {
  min: 0,
  max: 100,
  step: 1,
  modelValue: undefined,
  dual: false,
  showValue: 'focus',
  format: undefined,
  marks: undefined,
  color: 'primary',
  size: 'md',
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  thumbLabels: undefined,
  classes: undefined,
});

const emit = defineEmits<RangeEmits>();

const attrs = useAttrs();
const autoId = useId();

/** [from, to]: from is the min for a single thumb. */
function normalize(value: RangeValue | undefined): [number, number] {
  if (Array.isArray(value)) return [Number(value[0]), Number(value[1])];
  if (props.dual) return [props.min, props.max];
  const single =
    value === undefined || value === null ? props.min + (props.max - props.min) / 2 : Number(value);
  return [props.min, single];
}

const current = ref<[number, number]>(normalize(props.modelValue));
watch(
  () => [props.modelValue, props.dual, props.min, props.max],
  () => {
    current.value = normalize(props.modelValue);
  },
);

const names = computed(() => ({ start: 'Minimum', end: 'Maximum', ...props.thumbLabels }));

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
  const from = props.dual ? percentOf(current.value[0], props.min, props.max) : 0;
  const to = percentOf(current.value[1], props.min, props.max);
  return {
    class: ['apui-range', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-color': props.color,
    'data-show-value': props.showValue,
    'data-dual': flag(props.dual),
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    style: `--apui-_from: ${from}%; --apui-_to: ${to}%`,
  };
}

function onInput(thumb: 'start' | 'end', event: Event): void {
  const element = event.target as HTMLInputElement;
  let next = Number(element.value);
  const [from, to] = current.value;
  if (props.dual) {
    // The thumbs can't cross.
    if (thumb === 'start' && next > to) next = to;
    if (thumb === 'end' && next < from) next = from;
    if (String(next) !== element.value) element.value = String(next);
    current.value = thumb === 'start' ? [next, to] : [from, next];
    emit('update:modelValue', [...current.value] as [number, number]);
    return;
  }
  current.value = [props.min, next];
  emit('update:modelValue', next);
}

function controlAttrs(thumb: 'start' | 'end'): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': describedBy, ...rest } = attrs;
  const id = fieldId();
  const describedByIds = [
    hasHint() ? `${id}-hint` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  const value = thumb === 'start' ? current.value[0] : current.value[1];
  const own: Record<string, unknown> = {
    ...part('range', 'control', props.classes?.control, { 'data-thumb': thumb }),
    type: 'range',
    id: props.dual && thumb === 'end' ? `${id}-end` : id,
    min: props.min,
    max: props.max,
    step: props.step,
    disabled: props.disabled || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    'aria-valuetext': props.format ? formatRangeValue(value, props.format) : undefined,
    onInput: (event: Event) => onInput(thumb, event),
  };
  if (props.dual) {
    const callerLabelledBy =
      typeof rest['aria-labelledby'] === 'string' ? rest['aria-labelledby'] : undefined;
    const nameId = props.label
      ? `${id}-label`
      : (callerLabelledBy ??
        (typeof rest['aria-label'] === 'string' ? `${id}-aria-label` : undefined));
    own['aria-labelledby'] = [nameId, `${id}-${thumb}-label`].filter(Boolean).join(' ');
  }
  // The native default is the midpoint; render the value only when it's set.
  if (props.dual || (props.modelValue !== undefined && props.modelValue !== null)) {
    own.value = value;
  }
  if (isInvalid()) own['aria-invalid'] = 'true';
  return mergeProps(props.dual ? dualThumbAttrs(rest, thumb) : rest, own);
}

function thumbs(): ('start' | 'end')[] {
  return props.dual ? ['start', 'end'] : ['end'];
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label
      v-if="label"
      v-bind="part('range', 'label', classes?.label)"
      :id="dual ? `${fieldId()}-label` : undefined"
      :for="fieldId()"
      >{{ label }}</label
    >
    <div v-bind="part('range', 'track', classes?.track)">
      <div v-bind="part('range', 'fill', classes?.fill)" />
      <template v-for="thumb in thumbs()" :key="thumb">
        <span
          v-if="
            dual &&
            thumb === 'start' &&
            !label &&
            !$attrs['aria-labelledby'] &&
            $attrs['aria-label']
          "
          class="apui-sr-only"
          :id="`${fieldId()}-aria-label`"
          >{{ $attrs['aria-label'] }}</span
        >
        <span v-if="dual" class="apui-sr-only" :id="`${fieldId()}-${thumb}-label`">{{
          names[thumb]
        }}</span>
        <input v-bind="controlAttrs(thumb)" />
        <span
          v-bind="
            part('range', 'thumb', classes?.thumb, { 'data-thumb': thumb, 'aria-hidden': 'true' })
          "
          ><span v-if="showValue !== 'never'" v-bind="part('range', 'bubble', classes?.bubble)">{{
            formatRangeValue(thumb === 'start' ? current[0] : current[1], format)
          }}</span></span
        >
      </template>
    </div>
    <div
      v-if="marks && marks.length"
      v-bind="part('range', 'marks', classes?.marks, { 'aria-hidden': 'true' })"
    >
      <span
        v-for="mark in marks"
        :key="mark.value"
        v-bind="part('range', 'mark', classes?.mark)"
        :style="`--apui-_at: ${percentOf(mark.value, min, max)}%`"
        >{{ mark.label }}</span
      >
    </div>
    <p v-if="hasHint()" v-bind="part('range', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
      {{ hint }}
    </p>
    <p v-if="hasError()" v-bind="part('range', 'error', classes?.error)" :id="`${fieldId()}-error`">
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
