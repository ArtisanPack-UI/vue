<script setup lang="ts">
/**
 * @module TimelineItem
 *
 * One event of a Timeline: the marker, the head (the default slot or
 * `title`, then the time), the body and the card.
 */
import { computed, inject, useSlots } from 'vue';
import { DsIcon, hasContent, part } from '../../_shared/design-system';
import { TIMELINE_KEY } from './keys';
import type { TimelineColor, TimelineItemProps, TimelinePart } from './types';

const props = withDefaults(defineProps<TimelineItemProps>(), {
  title: undefined,
  time: undefined,
  datetime: undefined,
  icon: undefined,
  color: undefined,
  description: undefined,
  card: undefined,
});

const timeline = inject(TIMELINE_KEY, null);
const slots = useSlots();

const COLORS: readonly TimelineColor[] = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'success',
  'warning',
  'error',
  'info',
];

const filled = (value: unknown): boolean => value !== undefined && value !== null && value !== '';
const classOf = (name: TimelinePart) => timeline?.classOf(name);
const markerColor = computed(() =>
  props.color !== undefined && COLORS.includes(props.color) ? props.color : undefined,
);
const hasHeadSlot = () => hasContent(slots.default?.());
const hasCard = () => !!slots.card || filled(props.card);
</script>

<template>
  <li :class="classOf('item')" data-scope="timeline" data-part="item">
    <span
      v-bind="
        part('timeline', 'marker', classOf('marker'), {
          'data-color': markerColor,
          'aria-hidden': 'true',
        })
      "
      ><DsIcon v-if="filled(icon)" :name="icon"
    /></span>
    <div v-bind="part('timeline', 'head', classOf('head'))">
      <slot v-if="hasHeadSlot()" /><template v-else>{{ title }}</template
      ><time
        v-if="filled(time)"
        v-bind="part('timeline', 'time', classOf('time'), { datetime: datetime || undefined })"
        >{{ time }}</time
      >
    </div>
    <div v-if="filled(description)" v-bind="part('timeline', 'body', classOf('body'))">
      {{ description }}
    </div>
    <div v-if="hasCard()" v-bind="part('timeline', 'card', classOf('card'))">
      <slot name="card">{{ card }}</slot>
    </div>
  </li>
</template>
