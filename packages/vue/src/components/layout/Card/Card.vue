<script setup lang="ts">
/** @module Card */
import { computed, useSlots } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { CardProps } from './types';

const props = withDefaults(defineProps<CardProps>(), {
  figurePosition: 'top',
  noShadow: false,
  bordered: false,
  compact: false,
  glass: false,
  external: false,
});

const slots = useSlots();

const tag = computed(() => (props.link ? 'a' : 'div'));

const cardClasses = computed(() =>
  cn(
    'card bg-base-100',
    !props.noShadow && 'shadow-xl',
    props.bordered && 'card-border',
    props.compact && 'card-compact',
    props.glass && 'glass',
    (props.figurePosition === 'left' || props.figurePosition === 'right') && 'card-side',
  ),
);

const linkAttrs = computed(() => {
  if (!props.link) return {};
  return {
    href: props.link,
    target: props.external ? '_blank' : undefined,
    rel: props.external ? 'noopener noreferrer' : undefined,
  };
});

const hasFigure = computed(() => !!slots.figure);
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);
const hasMenu = computed(() => !!slots.menu);
</script>

<template>
  <component :is="tag" :class="cardClasses" v-bind="linkAttrs">
    <figure v-if="hasFigure && (figurePosition === 'top' || figurePosition === 'left')">
      <slot name="figure" />
    </figure>
    <div class="card-body">
      <div v-if="hasHeader" class="card-header">
        <slot name="header" />
      </div>
      <template v-else-if="title || hasMenu">
        <div class="flex items-center justify-between">
          <div>
            <h2 v-if="title" class="card-title">{{ title }}</h2>
            <p v-if="subtitle" class="text-base-content/70">{{ subtitle }}</p>
          </div>
          <div v-if="hasMenu">
            <slot name="menu" />
          </div>
        </div>
      </template>
      <slot />
      <div v-if="hasFooter" class="card-actions justify-end">
        <slot name="footer" />
      </div>
    </div>
    <figure v-if="hasFigure && (figurePosition === 'bottom' || figurePosition === 'right')">
      <slot name="figure" />
    </figure>
  </component>
</template>
