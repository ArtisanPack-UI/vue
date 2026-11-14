/**
 * Composable that reads Inertia flash page props and shows them as
 * design-system toasts.
 *
 * @module composables/useFlashMessages
 */
import { inject, watch, type InjectionKey } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { toast as defaultToast } from '@artisanpack-ui/vue';
import type { ToasterInstance, ToastInput } from '@artisanpack-ui/vue';
import type { FlashMessages, SharedPageProps } from '../types';

/** A toast color: `primary`, `secondary`, `accent`, `neutral`, `success`, `warning`, `error` or `info`. */
export type FlashToastColor = NonNullable<ToastInput['color']>;

/** Map from Laravel flash key to toast color. Keys it doesn't list show as `info`. */
const DEFAULT_COLOR_MAP: Record<string, FlashToastColor> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  message: 'info',
};

/**
 * The app-wide flash color map, provided by `createArtisanPackUILaravel({ flashColorMap })`.
 *
 * @internal
 */
export const FLASH_COLOR_MAP_KEY: InjectionKey<Record<string, FlashToastColor>> =
  Symbol('apui-flash-color-map');

export interface UseFlashMessagesOptions {
  /**
   * Map of flash keys to toast colors, merged over the plugin's
   * `flashColorMap` and the defaults. Keys none of them list show as `info`.
   *
   * @defaultValue `{ success: 'success', error: 'error', warning: 'warning', info: 'info', message: 'info' }`
   */
  colorMap?: Record<string, FlashToastColor>;

  /**
   * Milliseconds before each flash toast dismisses itself. `0` keeps it.
   *
   * @defaultValue `5000`
   */
  duration?: number;

  /**
   * The toaster to show the toasts in, from `createToaster()`. Defaults to
   * the page's `toast`, which a `<Toaster>` renders.
   */
  toaster?: ToasterInstance;
}

/**
 * Watches Inertia page props for flash messages and shows each one as a toast
 * with `toast.create()`. Render a `<Toaster>` on the page (or `FlashToasts`,
 * which renders one) to show them.
 *
 * The colors come from `options.colorMap`, then the plugin's `flashColorMap`,
 * then the defaults.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { Toaster } from '@artisanpack-ui/vue';
 * import { useFlashMessages } from '@artisanpack-ui/vue-laravel';
 *
 * useFlashMessages();
 * </script>
 *
 * <template>
 *   <slot />
 *   <Toaster />
 * </template>
 * ```
 */
export function useFlashMessages(options: UseFlashMessagesOptions = {}) {
  const { duration = 5000 } = options;
  const toast = options.toaster ?? defaultToast;
  const colorMap: Record<string, FlashToastColor> = {
    ...DEFAULT_COLOR_MAP,
    ...inject(FLASH_COLOR_MAP_KEY, {}),
    ...options.colorMap,
  };

  const page = usePage<SharedPageProps>();

  watch(
    () => page.props.flash as FlashMessages | undefined,
    (flash) => {
      if (!flash) return;

      for (const [key, message] of Object.entries(flash)) {
        if (!message) continue;

        toast.create({ title: message, color: colorMap[key] ?? 'info', duration });
      }
    },
    { immediate: true },
  );

  return { toast };
}
