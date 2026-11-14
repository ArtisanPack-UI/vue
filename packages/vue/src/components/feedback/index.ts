/**
 * @module feedback
 *
 * Feedback components for communicating status, progress, and errors
 * to users. Includes alerts, loading indicators, skeletons, empty
 * states, error displays, and a toast notification system.
 *
 * @example
 * ```vue
 * import { Alert, Loading, Skeleton, EmptyState, ErrorState, Toast, Toaster, toast } from '@artisanpack-ui/vue';
 * ```
 *
 * @packageDocumentation
 */

export { default as Alert } from './Alert/Alert.vue';
export type { AlertProps, AlertColor, AlertEmits, AlertPart } from './Alert/types';

export { default as Loading } from './Loading/Loading.vue';
export type { LoadingProps, LoadingVariant, LoadingPart } from './Loading/types';

export { default as Skeleton } from './Skeleton/Skeleton.vue';
export type { SkeletonProps } from './Skeleton/types';

export { default as EmptyState } from './EmptyState/EmptyState.vue';
export type { EmptyStateProps, EmptyStatePart } from './EmptyState/types';

export { default as ErrorState } from './ErrorState/ErrorState.vue';
export type { ErrorStateProps, ErrorStatePart } from './ErrorState/types';

/** @deprecated Use ErrorState (#60). */
export { default as ErrorDisplay } from './Error/Error.vue';
export type { ErrorDisplayProps } from './Error/types';

export { default as Toast } from './Toast/Toast.vue';
export { default as Toaster } from './Toast/Toaster.vue';
export { toast } from './Toast/toaster';
export { createToaster } from '@artisanpack-ui/behavior/vue';
export type {
  ToasterInstance,
  ToasterInstanceOptions,
  ToasterProps,
  ToastEmits,
  ToastInput,
  ToastPart,
  ToastProps,
} from './Toast/types';

// Deprecated: replaced by Toast, Toaster and toast.create() (#51).
// ToastProvider and ToastMessage are aliases on them; removed in a later major.
export { default as ToastProvider } from './ToastProvider/ToastProvider.vue';
export { default as ToastMessage } from './ToastProvider/ToastMessage.vue';
export { useToast } from './ToastProvider/use-toast';
export { TOAST_KEY } from './ToastProvider/keys';
export type {
  ToastProviderProps,
  ToastItem,
  ToastAPI,
  ToastOptions,
  ToastColor,
  ToastPosition,
} from './ToastProvider/types';
