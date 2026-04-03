<script setup lang="ts">
/** @module ErrorDisplay */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ErrorDisplayProps } from './types';

const props = withDefaults(defineProps<ErrorDisplayProps>(), {
  title: 'Something went wrong',
  retryLabel: 'Try again',
  retryable: false,
});

const emit = defineEmits<{
  retry: [];
}>();

const containerClasses = computed(() =>
  cn('flex flex-col items-center justify-center gap-4 py-12 text-center', props.className),
);
</script>

<template>
  <div role="alert" aria-live="assertive" :class="containerClasses">
    <div v-if="$slots.icon" class="text-error text-6xl">
      <slot name="icon" />
    </div>
    <h3 class="text-lg font-semibold text-error">{{ title }}</h3>
    <p v-if="message" class="text-base-content/60 max-w-sm">{{ message }}</p>
    <slot />
    <button v-if="retryable" type="button" class="btn btn-error btn-sm mt-2" @click="emit('retry')">
      {{ retryLabel }}
    </button>
  </div>
</template>
