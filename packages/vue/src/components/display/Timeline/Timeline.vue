<script setup lang="ts">
/** @module Timeline */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { TimelineProps } from './types';

const props = withDefaults(defineProps<TimelineProps>(), {
  vertical: true,
  snap: false,
  compact: false,
});

const colorMap: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  neutral: 'bg-neutral',
};

const timelineClasses = computed(() =>
  cn(
    'timeline',
    props.vertical && 'timeline-vertical',
    !props.vertical && 'timeline-horizontal',
    props.snap && 'timeline-snap-icon',
    props.compact && 'timeline-compact',
    props.className,
  ),
);
</script>

<template>
  <ul :class="timelineClasses" role="list" aria-label="Timeline">
    <li v-for="(item, index) in items" :key="item.id">
      <hr v-if="index > 0 && !item.start" />
      <div v-if="item.time" class="timeline-start">
        {{ item.time }}
      </div>
      <div class="timeline-middle">
        <slot name="marker" :item="item" :index="index">
          <div
            :class="
              cn(
                'w-3 h-3 rounded-full',
                item.color ? (colorMap[item.color] ?? 'bg-base-content') : 'bg-base-content',
              )
            "
          />
        </slot>
      </div>
      <div class="timeline-end timeline-box">
        <slot name="item" :item="item" :index="index">
          <h3 v-if="item.title" class="font-semibold">
            {{ item.title }}
          </h3>
          <p v-if="item.description" class="text-sm text-base-content/70">
            {{ item.description }}
          </p>
        </slot>
      </div>
      <hr v-if="index < items.length - 1 && !item.end" />
    </li>
  </ul>
</template>
