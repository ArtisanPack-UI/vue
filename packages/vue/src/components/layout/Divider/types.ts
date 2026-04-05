import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Divider component.
 *
 * A visual separator with optional label text and color variants.
 */
export interface DividerProps {
  /** When true, renders the divider vertically instead of horizontally. @defaultValue `false` */
  vertical?: boolean;
  /** DaisyUI color variant applied to the divider. */
  color?: DaisyColor;
  /** Optional inline label text displayed within the divider. */
  label?: string;
  /** Position of the label along the divider. @defaultValue `'center'` */
  labelPosition?: 'start' | 'center' | 'end';
}
