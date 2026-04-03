<script setup lang="ts">
/** @module Stat */
import { computed, useSlots } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { StatProps } from './types';

const props = withDefaults(defineProps<StatProps>(), {
  changeDirection: 'neutral',
});

const slots = useSlots();

const statClasses = computed(() => cn('stat', props.className));

const changeClasses = computed(() =>
  cn(
    'stat-desc',
    props.changeDirection === 'up' && 'text-success',
    props.changeDirection === 'down' && 'text-error',
  ),
);

const hasFigure = computed(() => !!slots.figure);
const hasActions = computed(() => !!slots.actions);
</script>

<template>
  <div :class="statClasses">
    <div v-if="hasFigure" class="stat-figure">
      <slot name="figure" />
    </div>
    <div class="stat-title">{{ title }}</div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="description && !change" class="stat-desc">{{ description }}</div>
    <div v-if="change" :class="changeClasses">{{ change }}</div>
    <div v-if="hasActions" class="stat-actions">
      <slot name="actions" />
    </div>
  </div>
</template>
