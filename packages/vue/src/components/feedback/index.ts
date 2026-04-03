/**
 * @module feedback
 *
 * Feedback components for communicating status, progress, and errors
 * to users. Includes alerts, loading indicators, skeletons, empty
 * states, error displays, and a toast notification system.
 *
 * @example
 * ```vue
 * import { Alert, Loading, Skeleton, EmptyState, ErrorDisplay, ToastProvider, useToast } from '@artisanpack-ui/vue';
 * ```
 *
 * @packageDocumentation
 */

export { default as Alert } from './Alert/Alert.vue';
export type { AlertProps, AlertColor } from './Alert/types';

export { default as Loading } from './Loading/Loading.vue';
export type { LoadingProps, LoadingVariant } from './Loading/types';

export { default as Skeleton } from './Skeleton/Skeleton.vue';
export type { SkeletonProps } from './Skeleton/types';

export { default as EmptyState } from './EmptyState/EmptyState.vue';
export type { EmptyStateProps } from './EmptyState/types';

export { default as ErrorDisplay } from './Error/Error.vue';
export type { ErrorDisplayProps } from './Error/types';

export { default as ToastProvider } from './Toast/ToastProvider.vue';
export { default as ToastMessage } from './Toast/ToastMessage.vue';
export { useToast } from './Toast/use-toast';
export { TOAST_KEY } from './Toast/keys';
export type {
  ToastProviderProps,
  ToastItem,
  ToastAPI,
  ToastOptions,
  ToastColor,
  ToastPosition,
} from './Toast/types';
