<script setup lang="ts">
/**
 * @module ToastProvider
 *
 * @deprecated Use Toaster and `toast.create()`, the design-system
 * replacement (#51). ToastProvider is a thin alias: it renders its default
 * slot and a design-system `Toaster` with its own toaster, and provides the
 * 2.x `useToast()` API on top of it (also the default slot's `toast` prop).
 * `defaultDuration` is the toaster's `duration`, `max` its `max` (toasts
 * past it queue instead of evicting the oldest) and the 2.x `position`
 * classes map to a `placement` (`toast-middle` has no equivalent and sits at
 * the bottom). Every other attribute, including Toaster's own props, passes
 * through to the Toaster.
 */
import { provide } from 'vue';
import { createToaster, type ToasterOptions } from '@artisanpack-ui/behavior/vue';
import Toaster from '../Toast/Toaster.vue';
import { warnOnce } from '../../_shared/design-system';
import { TOAST_KEY } from './keys';
import type { ToastAPI, ToastOptions, ToastPosition, ToastProviderProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToastProviderProps>(), {
  defaultDuration: 5000,
  max: 5,
  position: () => ['toast-end', 'toast-bottom'],
});

warnOnce('ToastProvider', 'ToastProvider is deprecated; use Toaster and toast.create().');

/** The Toaster placement for the 2.x DaisyUI position classes. */
function placementFor(position: ToastPosition[]): NonNullable<ToasterOptions['placement']> {
  const vertical = position.includes('toast-top') ? 'top' : 'bottom';
  if (position.includes('toast-start')) return `${vertical}-start`;
  if (position.includes('toast-center')) return vertical;
  return `${vertical}-end`;
}

/**
 * This provider's own toaster, read once at setup like a Toaster's options,
 * so `useToast()` below it never reaches the page's `toast`.
 */
const toaster = createToaster({
  placement: placementFor(props.position),
  max: props.max,
  duration: props.defaultDuration,
});

function show(options: ToastOptions): string {
  return toaster.create({
    title: options.message,
    color: options.color,
    duration: options.duration,
  });
}

const api: ToastAPI = {
  show,
  success: (message, duration?) => show({ message, color: 'success', duration }),
  error: (message, duration?) => show({ message, color: 'error', duration }),
  warning: (message, duration?) => show({ message, color: 'warning', duration }),
  info: (message, duration?) => show({ message, color: 'info', duration }),
  dismiss: (id) => toaster.dismiss(id),
  dismissAll: () => toaster.dismiss(),
};

provide(TOAST_KEY, api);
</script>

<template>
  <slot :toast="api" />
  <Toaster v-bind="$attrs" :toaster="toaster" />
</template>
