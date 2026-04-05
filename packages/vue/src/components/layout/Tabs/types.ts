import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Represents a single tab with its label, content, and optional configuration.
 */
export interface TabItem {
  /** Unique identifier for the tab. */
  name: string;
  /** Display label shown in the tab button. */
  label: string;
  /** Whether the tab is disabled. @defaultValue `false` */
  disabled?: boolean;
}

/**
 * Props for the Tabs component.
 *
 * A tabbed interface supporting controlled (`v-model`) and uncontrolled modes,
 * with full keyboard navigation and ARIA semantics.
 */
export interface TabsProps {
  /** Array of tab definitions. */
  tabs: TabItem[];
  /** Active tab name for controlled mode. Use with `v-model:activeTab`. */
  activeTab?: string;
  /** Initial active tab name for uncontrolled mode. */
  defaultTab?: string;
  /** DaisyUI tab styling variant. @defaultValue `'bordered'` */
  variant?: 'bordered' | 'lifted' | 'boxed';
  /** Tab size using DaisyUI size modifiers. */
  size?: Size;
  /** When true, renders tabs vertically on the left. @defaultValue `false` */
  vertical?: boolean;
  /** When true, renders tabs vertically on the right. @defaultValue `false` */
  verticalRight?: boolean;
  /** DaisyUI color applied to the active tab. */
  color?: DaisyColor;
  /** Additional CSS classes for the tab list. */
  tabListClassName?: string;
  /** Additional CSS classes for the tab panel. */
  panelClassName?: string;
  /** Additional CSS classes for the active tab button. */
  activeTabClassName?: string;
}
