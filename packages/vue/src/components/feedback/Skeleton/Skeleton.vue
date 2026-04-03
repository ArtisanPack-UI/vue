<script setup lang="ts">
/** @module Skeleton */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { SkeletonProps } from './types';

const props = withDefaults(defineProps<SkeletonProps>(), {
  circle: false,
});

const skeletonClasses = computed(() =>
  cn('skeleton', props.circle && 'rounded-full', props.className),
);

const skeletonStyle = computed(() => ({
  width: props.circle ? (props.width ?? props.height) : props.width,
  height: props.circle ? (props.height ?? props.width) : props.height,
}));
</script>

<template>
  <div aria-hidden="true" :class="skeletonClasses" :style="skeletonStyle" />
</template>
