<script setup lang="ts">
/** @module Grid */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ColCount, GapSize, GridProps } from './types';

const props = withDefaults(defineProps<GridProps>(), {
  gap: 4,
});

const COL_COUNTS: ColCount[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const GAP_SIZES: GapSize[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

function makeColsMap(prefix: string): Record<ColCount, string> {
  return Object.fromEntries(COL_COUNTS.map((n) => [n, `${prefix}grid-cols-${n}`])) as Record<
    ColCount,
    string
  >;
}

function makeGapMap(prefix: string): Record<GapSize, string> {
  return Object.fromEntries(GAP_SIZES.map((n) => [n, `${prefix}${n}`])) as Record<GapSize, string>;
}

const colsMap = makeColsMap('');
const smColsMap = makeColsMap('sm:');
const mdColsMap = makeColsMap('md:');
const lgColsMap = makeColsMap('lg:');
const xlColsMap = makeColsMap('xl:');

const gapMap = makeGapMap('gap-');
const gapXMap = makeGapMap('gap-x-');
const gapYMap = makeGapMap('gap-y-');

const gridClasses = computed(() => {
  const hasAxisGap = props.gapX !== undefined || props.gapY !== undefined;

  return cn(
    'grid',
    props.cols && colsMap[props.cols],
    props.colsSm && smColsMap[props.colsSm],
    props.colsMd && mdColsMap[props.colsMd],
    props.colsLg && lgColsMap[props.colsLg],
    props.colsXl && xlColsMap[props.colsXl],
    !hasAxisGap && gapMap[props.gap],
    props.gapX !== undefined && gapXMap[props.gapX],
    props.gapY !== undefined && gapYMap[props.gapY],
  );
});
</script>

<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>
