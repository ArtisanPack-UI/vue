<script setup lang="ts">
/**
 * @module Skeleton
 *
 * A placeholder shape that matches the layout while content loads, rendering
 * the design-system Skeleton markup contract (`.apui-skeleton`, #60). It is
 * `aria-hidden`; the loading container sets `aria-busy`.
 */
import { mergeProps, useAttrs } from 'vue';
import type { SkeletonProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'block',
  width: undefined,
  height: undefined,
});

const attrs = useAttrs();

function length(value: string | number | undefined): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function rootAttrs(): Record<string, unknown> {
  const style: Record<string, string> = {};
  const width = length(props.width);
  const height = length(props.height);
  if (width) style.width = width;
  if (height) style.height = height;
  return mergeProps(
    {
      class: 'apui-skeleton',
      'data-scope': 'skeleton',
      'data-part': 'root',
      'data-shape': props.shape,
      'aria-hidden': 'true',
      style: Object.keys(style).length ? style : undefined,
    },
    attrs,
  );
}
</script>

<template>
  <span v-bind="rootAttrs()" />
</template>
