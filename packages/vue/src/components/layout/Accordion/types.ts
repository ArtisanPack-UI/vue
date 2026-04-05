/**
 * Props for the Accordion component.
 *
 * A container that manages the open/close state of child Collapse components.
 * Supports both single and multiple open panels.
 */
export interface AccordionProps {
  /** When true, allows multiple panels to be open simultaneously. @defaultValue `false` */
  multiple?: boolean;
  /** Controlled mode: indices of currently open panels. */
  openIndices?: number[];
  /** Uncontrolled mode: indices of initially open panels. */
  defaultOpenIndices?: number[];
  /** When true, applies DaisyUI join styling to visually group panels. @defaultValue `true` */
  join?: boolean;
}
