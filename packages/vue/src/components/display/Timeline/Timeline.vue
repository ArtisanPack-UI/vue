<script setup lang="ts">
/**
 * @module Timeline
 *
 * Events in order. Renders the design-system Timeline markup contract
 * (`ol.apui-timeline`, #61): TimelineItem children, after the same items
 * from `items` (D-023).
 */
import { provide } from 'vue';
import { TIMELINE_KEY } from './keys';
import TimelineItem from './TimelineItem.vue';
import type { TimelinePart, TimelineProps } from './types';

const props = withDefaults(defineProps<TimelineProps>(), {
  items: undefined,
  variant: 'icon',
  label: undefined,
  classes: undefined,
});

provide(TIMELINE_KEY, { classOf: (name: TimelinePart) => props.classes?.[name] });
</script>

<template>
  <ol
    :class="['apui-timeline', classes?.root]"
    :data-variant="variant === 'dot' ? 'dot' : 'icon'"
    :aria-label="label"
  >
    <TimelineItem
      v-for="(item, index) in items ?? []"
      :key="`apui-timeline-${index}`"
      v-bind="item"
    />
    <slot />
  </ol>
</template>
