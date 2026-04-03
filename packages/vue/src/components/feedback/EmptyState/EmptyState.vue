<script setup lang="ts">
/** @module EmptyState */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { EmptyStateProps } from './types';

const props = withDefaults(defineProps<EmptyStateProps>(), {
  headingAs: 'h3',
});

const containerClasses = computed(() =>
  cn('flex flex-col items-center justify-center gap-4 py-12 text-center', props.className),
);
</script>

<template>
  <div :class="containerClasses">
    <div v-if="$slots.icon" class="text-base-content/40 text-6xl">
      <slot name="icon" />
    </div>
    <component :is="headingAs" v-if="heading" class="text-lg font-semibold">
      {{ heading }}
    </component>
    <p v-if="description" class="text-base-content/60 max-w-sm">{{ description }}</p>
    <slot />
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
