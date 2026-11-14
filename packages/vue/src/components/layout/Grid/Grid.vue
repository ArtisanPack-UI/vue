<script setup lang="ts">
/**
 * @module Grid
 *
 * A layout primitive (#58): its children in equal columns, with the gap from
 * the space scale. With `minItemWidth` the columns drop as the grid narrows,
 * down to one. Renders `.apui-grid` from `@artisanpack-ui/css`; no Tailwind.
 */
import { computed } from 'vue';
import type { GridProps } from './types';

const props = withDefaults(defineProps<GridProps>(), {
  columns: 1,
  minItemWidth: undefined,
  gap: '4',
  align: 'stretch',
  justify: 'stretch',
});

const columns = computed(() => Math.min(12, Math.max(1, Math.round(Number(props.columns) || 1))));
const style = computed(() =>
  props.minItemWidth ? { '--apui-grid-min-item-width': props.minItemWidth } : undefined,
);
</script>

<template>
  <div
    class="apui-grid"
    :data-columns="columns"
    :data-gap="String(gap)"
    :data-align="align"
    :data-justify="justify"
    :style="style"
  >
    <slot />
  </div>
</template>
