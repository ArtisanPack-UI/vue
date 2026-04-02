<script setup lang="ts">
/** @module Stack */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { StackProps } from './types';

const props = withDefaults(defineProps<StackProps>(), {
  direction: 'vertical',
  gap: 2,
  wrap: false,
});

const gapMap: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
};

const alignMap: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyMap: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const stackClasses = computed(() =>
  cn(
    'flex',
    props.direction === 'vertical' ? 'flex-col' : 'flex-row',
    gapMap[props.gap],
    props.align && alignMap[props.align],
    props.justify && justifyMap[props.justify],
    props.wrap && 'flex-wrap',
  ),
);
</script>

<template>
  <div :class="stackClasses">
    <slot />
  </div>
</template>
