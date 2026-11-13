<script setup lang="ts">
/**
 * @module ProgressRadial
 *
 * Circular progress, built from Progress, rendering the design-system
 * ProgressRadial markup contract (`.apui-progress-radial`, #60). The root is
 * the `role="progressbar"`; the ring fills in the reading direction.
 */
import { mergeProps, useAttrs, useId } from 'vue';
import { flag, part } from '../../_shared/design-system';
import { progressRange } from '../Progress/types';
import type { ProgressRadialPart, ProgressRadialProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ProgressRadialProps>(), {
  value: undefined,
  modelValue: undefined,
  max: 100,
  indeterminate: false,
  size: 64,
  thickness: 6,
  color: 'primary',
  label: undefined,
  valueText: undefined,
  hideValue: false,
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

function cls(name: ProgressRadialPart): string | undefined {
  return props.classes?.[name];
}

function ring() {
  const { pct } = progressRange(current(), props.max);
  const center = props.size / 2;
  const radius = (props.size - props.thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = props.indeterminate ? circumference * 0.75 : circumference * (1 - pct / 100);
  return {
    c: center.toFixed(1),
    r: radius.toFixed(1),
    dasharray: circumference.toFixed(1),
    dashoffset: offset.toFixed(1),
  };
}

function valueShown(): string {
  if (filled(props.valueText)) return props.valueText!;
  return props.indeterminate ? '' : `${progressRange(current(), props.max).pct}%`;
}

function showsValue(): boolean {
  return !props.hideValue && (valueShown() !== '' || filled(props.label));
}

function rootAttrs(): Record<string, unknown> {
  const { value, max } = progressRange(current(), props.max);
  const labelled = filled(props.label);
  return mergeProps(
    {
      class: 'apui-progress-radial',
      'data-scope': 'progress-radial',
      'data-part': 'root',
      role: 'progressbar',
      'aria-valuemin': '0',
      'aria-valuemax': String(max),
      'aria-valuenow': props.indeterminate ? undefined : String(value),
      'aria-valuetext': filled(props.valueText) ? props.valueText : undefined,
      'aria-labelledby': labelled && !props.hideValue ? `${id}-label` : undefined,
      'aria-label': labelled && props.hideValue ? props.label : undefined,
      'data-color': props.color,
      'data-indeterminate': flag(props.indeterminate),
      style: { '--apui-_s': `${props.size}px` },
    },
    attrs,
    { class: props.classes?.root },
  );
}

function circleAttrs(name: 'track' | 'bar'): Record<string, unknown> {
  const { c, r, dasharray, dashoffset } = ring();
  return part('progress-radial', name, cls(name), {
    cx: c,
    cy: c,
    r,
    'stroke-width': props.thickness,
    'stroke-dasharray': name === 'bar' ? dasharray : undefined,
    'stroke-dashoffset': name === 'bar' ? dashoffset : undefined,
  });
}
</script>

<template>
  <span v-bind="rootAttrs()">
    <svg
      v-bind="
        part('progress-radial', 'svg', cls('svg'), {
          viewBox: `0 0 ${size} ${size}`,
          'aria-hidden': 'true',
        })
      "
    >
      <circle v-bind="circleAttrs('track')" />
      <circle v-bind="circleAttrs('bar')" />
    </svg>
    <span v-if="showsValue()" v-bind="part('progress-radial', 'value', cls('value'))"
      >{{ valueShown()
      }}<span
        v-if="filled(label)"
        v-bind="part('progress-radial', 'label', cls('label'), { id: `${id}-label` })"
        >{{ label }}</span
      ></span
    >
  </span>
</template>
