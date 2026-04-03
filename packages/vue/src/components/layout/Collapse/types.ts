/**
 * Props for the Collapse component.
 *
 * An expandable/collapsible content section with a clickable title.
 * Supports controlled (`v-model`) and uncontrolled modes.
 */
export interface CollapseProps {
  /** Clickable heading text for the collapse trigger. */
  title: string;
  /** Icon style for the expand/collapse indicator. @defaultValue `'arrow'` */
  icon?: 'arrow' | 'plus' | 'none';
  /** Whether the panel is open. Used for controlled mode via `v-model:open`. */
  open?: boolean;
  /** Initial open state for uncontrolled mode. @defaultValue `false` */
  defaultOpen?: boolean;
  /** Radio input name for semantic grouping (only one open at a time within the same name group). */
  name?: string;
  /** When true, adds a border around the collapse. @defaultValue `false` */
  bordered?: boolean;
  /** When true, disables interaction. @defaultValue `false` */
  disabled?: boolean;
}
