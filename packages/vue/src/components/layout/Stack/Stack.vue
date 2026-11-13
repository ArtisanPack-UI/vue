<script setup lang="ts">
/**
 * @module Stack
 *
 * A layout primitive (#58): its children in a column or a row, with the gap
 * from the space scale, alignment and optional wrapping. Renders
 * `.apui-stack` from `@artisanpack-ui/css`; no Tailwind.
 */
import { computed } from 'vue';
import { flag } from '../../_shared/design-system';
import type { StackProps } from './types';

const props = withDefaults(defineProps<StackProps>(), {
  orientation: undefined,
  direction: undefined,
  gap: '2',
  align: 'stretch',
  justify: 'start',
  wrap: false,
});

/** `orientation`, else the deprecated `direction`. */
const orientation = computed(() => props.orientation ?? props.direction ?? 'vertical');
</script>

<template>
  <div
    class="apui-stack"
    :data-orientation="orientation"
    :data-gap="String(gap)"
    :data-align="align"
    :data-justify="justify"
    :data-wrap="flag(wrap)"
  >
    <slot />
  </div>
</template>
