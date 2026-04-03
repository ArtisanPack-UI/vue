<script setup lang="ts">
/**
 * @module FlashToasts
 *
 * Headless component that watches for Inertia flash messages and triggers
 * toasts via the ArtisanPack UI Toast system. Renders no visible UI itself.
 *
 * Must be a descendant of `<ToastProvider>`.
 *
 * @example
 * ```vue
 * <template>
 *   <ToastProvider>
 *     <FlashToasts />
 *     <router-view />
 *   </ToastProvider>
 * </template>
 * ```
 */
import { useFlashMessages } from '../../composables/useFlashMessages';
import type { UseFlashMessagesOptions } from '../../composables/useFlashMessages';

const props = defineProps<UseFlashMessagesOptions>();

useFlashMessages(props);
</script>

<template>
  <slot />
</template>
