/**
 * Props for the File component.
 *
 * Supports both standard file input and drag-and-drop zone rendering modes.
 */
export interface FileProps {
  /** Text label displayed above the file input. */
  label?: string;
  /** Helper text displayed below the file input. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the input. Replaces `hint` when present. */
  error?: string;
  /** When true, renders a drag-and-drop zone instead of the standard file input. @defaultValue `false` */
  withDragDrop?: boolean;
  /** Custom text displayed inside the drag-and-drop zone. @defaultValue `'Drop files here or click to browse'` */
  dragDropText?: string;
  /** Additional CSS classes applied to the drag-and-drop zone container. */
  dragDropClass?: string;
  /** Upload progress percentage (0-100). When greater than 0, a progress bar is displayed. */
  progress?: number;
  /** When true, hides the upload progress bar even when `progress` is set. @defaultValue `false` */
  hideProgress?: boolean;
  /** Custom id for the input element. */
  id?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Accepted file types. */
  accept?: string;
  /** Whether multiple files can be selected. */
  multiple?: boolean;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Name attribute for native form submissions. */
  name?: string;
}
