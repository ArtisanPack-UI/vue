<script setup lang="ts">
/**
 * @module FlashToasts
 *
 * Shows Inertia flash messages as design-system toasts: it calls
 * `useFlashMessages()` and renders a `Toaster` after its default slot. Set
 * `region` to false when the page already renders a `Toaster`. Every other
 * attribute, including Toaster's own props (`placement`, `label`,
 * `closeLabel`), goes to the Toaster.
 *
 * @example
 * ```vue
 * <template>
 *   <FlashToasts>
 *     <main>...</main>
 *   </FlashToasts>
 * </template>
 * ```
 */
import { Toaster } from '@artisanpack-ui/vue';
import { useFlashMessages } from '../../composables/useFlashMessages';
import type { UseFlashMessagesOptions } from '../../composables/useFlashMessages';

defineOptions({ inheritAttrs: false });

interface FlashToastsProps extends UseFlashMessagesOptions {
  /**
   * Renders a `Toaster` for the toasts. Off when the page already has one.
   *
   * @defaultValue `true`
   */
  region?: boolean;
}

const props = withDefaults(defineProps<FlashToastsProps>(), {
  colorMap: undefined,
  duration: undefined,
  toaster: undefined,
  region: true,
});

useFlashMessages({ colorMap: props.colorMap, duration: props.duration, toaster: props.toaster });
</script>

<template>
  <slot />
  <Toaster v-if="region" v-bind="$attrs" :toaster="toaster" />
</template>
