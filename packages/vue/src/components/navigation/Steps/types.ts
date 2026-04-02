import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Represents a single step in a multi-step indicator.
 */
export interface StepItem {
  /** Display label for the step. */
  label: string;
  /** Optional content displayed below the step label. */
  content?: string;
  /** DaisyUI color override for this individual step. */
  color?: DaisyColor;
}

/**
 * Props for the Steps component.
 *
 * A multi-step progress indicator with color-coded completion states
 * and optional vertical layout.
 */
export interface StepsProps {
  /** Array of step definitions. */
  steps: StepItem[];
  /** Index of the current active step (0-based). Steps at or before this index are marked complete. */
  currentStep?: number;
  /** When true, renders steps vertically. @defaultValue `false` */
  vertical?: boolean;
  /** Default DaisyUI color applied to completed steps. @defaultValue `'primary'` */
  color?: DaisyColor;
  /** Additional CSS classes for the steps container. */
  className?: string;
}
