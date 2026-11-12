<script setup lang="ts">
/**
 * @module Progress
 *
 * Linear progress, rendering the design-system Progress markup contract
 * (`.apui-progress`, #60). The root is the `role="progressbar"`, named by its
 * label; indeterminate leaves `aria-valuenow` out.
 */
import { mergeProps, useAttrs, useId } from 'vue';
import { flag, part } from '../../_shared/design-system';
import { progressRange, type ProgressPart, type ProgressProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressProps>(), {
  value: undefined,
  modelValue: undefined,
  max: 100,
  indeterminate: false,
  segmented: false,
  size: 'md',
  color: 'primary',
  label: undefined,
  valueText: undefined,
  classes: undefined,
});

const attrs = useAttrs();

/** `value`, else `modelValue`, else 0. */
function current(): number {
  return props.value ?? props.modelValue ?? 0;
}
const id = useId();

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function range() {
  return progressRange(current(), props.max);
}

function valueShown(): string | undefined {
  if (filled(props.valueText)) return props.valueText;
  if (filled(props.label) && !props.indeterminate) return `${range().pct}%`;
  return undefined;
}

function cls(name: ProgressPart): string | undefined {
  return props.classes?.[name];
}

function rootAttrs(): Record<string, unknown> {
  const { value, max } = range();
  return mergeProps(
    {
      class: 'apui-progress',
      'data-scope': 'progress',
      'data-part': 'root',
      role: 'progressbar',
      'aria-valuemin': '0',
      'aria-valuemax': String(max),
      'aria-valuenow': props.indeterminate ? undefined : String(value),
      'aria-valuetext': filled(props.valueText) ? props.valueText : undefined,
      'aria-labelledby': filled(props.label) ? `${id}-label` : undefined,
      'data-size': props.size,
      'data-color': props.color,
      'data-indeterminate': flag(props.indeterminate),
      'data-segmented': flag(props.segmented),
    },
    attrs,
    { class: props.classes?.root },
  );
}

function segments(): boolean[] {
  const { value, max } = range();
  const count = Math.max(1, Math.round(max));
  const done = Math.round(value);
  return Array.from({ length: count }, (_, index) => index < done);
}

function barAttrs(): Record<string, unknown> {
  return part('progress', 'bar', cls('bar'), {
    style: props.indeterminate ? undefined : { '--apui-_v': `${range().pct}%` },
  });
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <div
      v-if="filled(label) || valueShown() !== undefined"
      v-bind="part('progress', 'head', cls('head'))"
    >
      <span
        v-if="filled(label)"
        v-bind="part('progress', 'label', cls('label'), { id: `${id}-label` })"
        >{{ label }}</span
      >
      <span v-if="valueShown() !== undefined" v-bind="part('progress', 'value', cls('value'))">{{
        valueShown()
      }}</span>
    </div>
    <div v-bind="part('progress', 'track', cls('track'))">
      <template v-if="segmented">
        <div
          v-for="(done, index) in segments()"
          :key="index"
          v-bind="part('progress', 'bar', cls('bar'), { 'data-done': flag(done) })"
        />
      </template>
      <div v-else v-bind="barAttrs()" />
    </div>
  </div>
</template>
