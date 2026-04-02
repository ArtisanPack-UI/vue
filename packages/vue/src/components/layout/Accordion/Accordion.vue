<script setup lang="ts">
/** @module Accordion */
import { computed, provide, ref } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { AccordionProps } from './types';
import { ACCORDION_KEY } from './keys';

const props = withDefaults(defineProps<AccordionProps>(), {
  multiple: false,
  join: true,
});

const emit = defineEmits<{
  'update:openIndices': [value: number[]];
}>();

const isControlled = computed(() => props.openIndices !== undefined);

// Normalize initial indices: single mode allows at most one open panel
const normalizeIndices = (indices: number[]): number[] =>
  props.multiple ? indices : indices.slice(0, 1);

const internalIndices = ref<number[]>(normalizeIndices(props.defaultOpenIndices ?? []));

const currentIndices = computed(() =>
  isControlled.value ? normalizeIndices(props.openIndices ?? []) : internalIndices.value,
);

function toggleIndex(index: number) {
  let next: number[];
  if (currentIndices.value.includes(index)) {
    next = currentIndices.value.filter((i) => i !== index);
  } else {
    next = props.multiple ? [...currentIndices.value, index] : [index];
  }

  if (isControlled.value) {
    emit('update:openIndices', next);
  } else {
    internalIndices.value = next;
  }
}

provide(ACCORDION_KEY, { currentIndices, toggleIndex });

const accordionClasses = computed(() => cn(props.join && 'join join-vertical w-full'));
</script>

<template>
  <div :class="accordionClasses">
    <slot />
  </div>
</template>
