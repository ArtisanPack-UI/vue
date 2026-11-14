/**
 * A searchable item of the deprecated SpotlightSearch.
 *
 * @deprecated Use Spotlight's `groups` of `SpotlightResult` items (#57).
 */
export interface SpotlightItem {
  /** Unique identifier for the item. Spotlight's `value`. */
  id: string;
  /** Display label for the item. */
  label: string;
  /** Optional description shown below the label. */
  description?: string;
  /** Optional group name: items with the same name share a Spotlight group. */
  group?: string;
  /** Whether the item is disabled. @defaultValue `false` */
  disabled?: boolean;
}

/**
 * Props for the deprecated SpotlightSearch component.
 *
 * @deprecated Use `Spotlight` (#57). SpotlightSearch renders a Spotlight:
 * `items` become its `groups` and `ariaLabel` its `label`. Spotlight's own
 * props pass through.
 */
export interface SpotlightSearchProps {
  /** Whether the spotlight is open. Use with `v-model:open`. */
  open?: boolean;
  /** Array of searchable items. */
  items: SpotlightItem[];
  /** Placeholder text for the search input. @defaultValue `'Search…'` */
  placeholder?: string;
  /** The palette's accessible name. Spotlight's `label`. @defaultValue `'Search'` */
  ariaLabel?: string;
  /** Additional CSS classes for the panel. */
  className?: string;
}
