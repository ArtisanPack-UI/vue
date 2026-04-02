/**
 * Props for the Modal component.
 *
 * A dialog overlay with focus trapping, keyboard dismissal, and Teleport rendering.
 * Use `v-model:open` to control visibility.
 */
export interface ModalProps {
  /** Whether the modal is visible. Use with `v-model:open`. */
  open: boolean;
  /** Title text rendered as an `<h3>` in the modal header. */
  title?: string;
  /** Subtitle text rendered below the title. */
  subtitle?: string;
  /** When true, prevents closing via Escape key or backdrop click. @defaultValue `false` */
  persistent?: boolean;
  /** When true, applies glass morphism styling. @defaultValue `false` */
  glass?: boolean;
  /** When true, renders as a bottom sheet on mobile. @defaultValue `false` */
  bottom?: boolean;
  /** Accessible label for the dialog when no title is provided. */
  ariaLabel?: string;
}
