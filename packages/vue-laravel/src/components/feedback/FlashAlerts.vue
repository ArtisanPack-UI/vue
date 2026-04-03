<script setup lang="ts">
/**
 * @module FlashAlerts
 *
 * Renders Inertia flash messages as ArtisanPack UI Alert components.
 * An alternative to the toast-based `useFlashMessages` composable for
 * applications that prefer inline alert banners.
 *
 * @example
 * ```vue
 * <template>
 *   <FlashAlerts dismissible />
 *   <main>...</main>
 * </template>
 * ```
 */
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Alert } from '@artisanpack-ui/vue';
import type { AlertColor } from '@artisanpack-ui/vue';
import type { FlashMessages, SharedPageProps } from '../../types';

interface FlashAlertsProps {
  /**
   * When true, each alert can be dismissed by the user.
   *
   * @defaultValue `true`
   */
  dismissible?: boolean;
  /** Additional CSS classes for the container. */
  className?: string;
}

withDefaults(defineProps<FlashAlertsProps>(), {
  dismissible: true,
  className: undefined,
});

const COLOR_MAP: Record<string, AlertColor> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  message: 'info',
};

const page = usePage<SharedPageProps>();

const alerts = computed(() => {
  const flash = page.props.flash as FlashMessages | undefined;
  if (!flash) return [];

  return Object.entries(flash)
    .filter(([, message]) => !!message)
    .map(([key, message]) => ({
      key,
      message: message!,
      color: COLOR_MAP[key] ?? 'info',
    }));
});
</script>

<template>
  <div v-if="alerts.length > 0" :class="className">
    <Alert v-for="alert in alerts" :key="alert.key" :color="alert.color" :dismissible="dismissible">
      {{ alert.message }}
    </Alert>
  </div>
</template>
