/**
 * Represents a single searchable command/action in the spotlight.
 */
export interface SpotlightItem {
  /** Unique identifier for the item. */
  id: string;
  /** Display label for the item. */
  label: string;
  /** Optional description shown below the label. */
  description?: string;
  /** Optional group name for categorization. */
  group?: string;
  /** Whether the item is disabled. @defaultValue `false` */
  disabled?: boolean;
}

/**
 * Props for the SpotlightSearch component.
 *
 * A command palette / search overlay triggered by Cmd+K (Mac) or Ctrl+K (Windows).
 * Provides keyboard navigation, fuzzy filtering, and grouped results.
 */
export interface SpotlightSearchProps {
  /** Whether the spotlight is open. Use with `v-model:open`. */
  open?: boolean;
  /** Array of searchable items. */
  items: SpotlightItem[];
  /** Placeholder text for the search input. @defaultValue `'Search…'` */
  placeholder?: string;
  /** Label for screen readers. @defaultValue `'Search'` */
  ariaLabel?: string;
  /** Additional CSS classes for the modal container. */
  className?: string;
}
