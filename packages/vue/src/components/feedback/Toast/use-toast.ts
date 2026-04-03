/**
 * @module use-toast
 *
 * Composable that provides the imperative toast API for showing and
 * dismissing notifications. Must be called within a ToastProvider.
 *
 * @packageDocumentation
 */

import { inject } from 'vue';
import { TOAST_KEY } from './keys';
import type { ToastAPI } from './types';

/**
 * Hook that provides the imperative toast API for showing and dismissing
 * notifications. Must be called within a ToastProvider.
 *
 * @returns The ToastAPI object with `show`, `success`, `error`,
 *   `warning`, `info`, `dismiss`, and `dismissAll` methods.
 *
 * @throws Error if called outside a `ToastProvider`.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useToast } from '@artisanpack-ui/vue';
 * const toast = useToast();
 * function save() {
 *   toast.success('Saved!');
 * }
 * </script>
 * ```
 */
export function useToast(): ToastAPI {
  const context = inject(TOAST_KEY);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
