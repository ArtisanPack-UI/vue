/**
 * Color variants available for toast notifications.
 */
export type ToastColor = 'info' | 'success' | 'warning' | 'error';

/**
 * DaisyUI position classes for the toast container.
 */
export type ToastPosition =
  | 'toast-start'
  | 'toast-center'
  | 'toast-end'
  | 'toast-top'
  | 'toast-middle'
  | 'toast-bottom';

/**
 * Represents a single toast notification in the queue.
 */
export interface ToastItem {
  /** Unique identifier for this toast instance. */
  id: string;
  /** The content to display inside the toast. */
  message: string;
  /** Color variant that determines the visual style. */
  color?: ToastColor;
  /** Auto-dismiss duration in milliseconds. Set to `0` to disable auto-dismiss. */
  duration?: number;
}

/**
 * Options for showing a toast via the imperative API.
 */
export type ToastOptions = Omit<ToastItem, 'id'>;

/**
 * Imperative API returned by useToast for showing and dismissing toasts.
 */
export interface ToastAPI {
  /** Show a toast with full options. Returns the generated toast ID. */
  show: (options: ToastOptions) => string;
  /** Show a success toast. Returns the generated toast ID. */
  success: (message: string, duration?: number) => string;
  /** Show an error toast. Returns the generated toast ID. */
  error: (message: string, duration?: number) => string;
  /** Show a warning toast. Returns the generated toast ID. */
  warning: (message: string, duration?: number) => string;
  /** Show an info toast. Returns the generated toast ID. */
  info: (message: string, duration?: number) => string;
  /** Dismiss a specific toast by its ID. */
  dismiss: (id: string) => void;
  /** Dismiss all currently visible toasts. */
  dismissAll: () => void;
}

/**
 * Props for the ToastProvider component.
 */
export interface ToastProviderProps {
  /** Default auto-dismiss duration in milliseconds. @defaultValue `5000` */
  defaultDuration?: number;
  /** Maximum number of simultaneously visible toasts. @defaultValue `5` */
  max?: number;
  /** DaisyUI position classes applied to the toast container. @defaultValue `['toast-end', 'toast-bottom']` */
  position?: ToastPosition[];
}
