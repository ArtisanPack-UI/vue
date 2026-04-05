/**
 * Composable that reads Inertia flash page props and integrates with
 * the ArtisanPack UI Toast system.
 *
 * @module composables/useFlashMessages
 */
import { watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useToast } from '@artisanpack-ui/vue';
import type { FlashMessages, SharedPageProps } from '../types';
import type { ToastColor } from '@artisanpack-ui/vue';

/** Map from Laravel flash key to DaisyUI toast color. */
const DEFAULT_COLOR_MAP: Record<string, ToastColor> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  message: 'info',
};

export interface UseFlashMessagesOptions {
  /**
   * Map of flash keys to toast colors.
   *
   * @defaultValue `{ success: 'success', error: 'error', warning: 'warning', info: 'info', message: 'info' }`
   */
  colorMap?: Record<string, ToastColor>;

  /**
   * Duration in milliseconds for each flash toast.
   *
   * @defaultValue `5000`
   */
  duration?: number;
}

/**
 * Watches Inertia page props for flash messages and automatically triggers
 * toasts via the ArtisanPack UI Toast system.
 *
 * Must be called inside a component that is a descendant of `<ToastProvider>`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useFlashMessages } from '@artisanpack-ui/vue-laravel';
 *
 * useFlashMessages();
 * </script>
 * ```
 */
export function useFlashMessages(options: UseFlashMessagesOptions = {}) {
  const { colorMap = DEFAULT_COLOR_MAP, duration = 5000 } = options;

  const page = usePage<SharedPageProps>();
  const toast = useToast();

  watch(
    () => page.props.flash as FlashMessages | undefined,
    (flash) => {
      if (!flash) return;

      for (const [key, message] of Object.entries(flash)) {
        if (!message) continue;

        const color: ToastColor = colorMap[key] ?? 'info';

        toast.show({ message, color, duration });
      }
    },
    { immediate: true },
  );

  return { toast };
}
