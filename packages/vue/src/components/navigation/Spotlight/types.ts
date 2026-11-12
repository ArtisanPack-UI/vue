import type { SpotlightGroup, SpotlightItem } from '@artisanpack-ui/behavior/vue';

export type { SpotlightGroup };

/**
 * One result in a SpotlightGroup: `label`, and optionally `value`,
 * `description`, `href`, `icon`, `color`, `shortcut`, `keywords` and
 * `disabled`. Named `SpotlightResult` because `SpotlightItem` stays the
 * deprecated SpotlightSearch's item type.
 */
export type SpotlightResult = SpotlightItem;

/** The parts of a Spotlight that accept extra classes. `root` and `content` are the panel. */
export type SpotlightPart =
  | 'root'
  | 'content'
  | 'trigger'
  | 'backdrop'
  | 'positioner'
  | 'search'
  | 'icon'
  | 'query'
  | 'closeTrigger'
  | 'results'
  | 'itemGroup'
  | 'itemGroupLabel'
  | 'item'
  | 'tile'
  | 'itemText'
  | 'itemDescription'
  | 'shortcut'
  | 'itemIndicator'
  | 'empty'
  | 'loading'
  | 'footer';

/** Props for the Spotlight command palette. */
export interface SpotlightProps {
  /** Whether it's open. Bind it with `v-model:open`. Emitted as `data-state` on every part. */
  open?: boolean;
  /**
   * The results, in groups. Each item takes `label`, and optionally `value`
   * (defaults to `href`, then `label`), `description`, `href`, `icon`,
   * `color`, `shortcut`, `keywords` and `disabled`. Unless `remote`, items
   * are filtered as the user types, by every word.
   */
  groups?: SpotlightGroup[];
  /** The query text (controlled). Pair it with `search-change`. */
  search?: string;
  /** The page searches: `groups` are the results for `search` and aren't filtered here. */
  remote?: boolean;
  /** Shows the loading row and marks the results busy. */
  loading?: boolean;
  /** The global shortcut: modifiers and a key joined with `+`; `mod` is ⌘ on Apple platforms and Ctrl elsewhere. Empty turns it off. */
  shortcut?: string;
  /** Lists recent choices first, in a Recent group, while the query is empty. Off by default: they're kept in the browser's localStorage. */
  recent?: boolean;
  /** The palette's accessible name. Translate it. */
  label?: string;
  /** The query's placeholder. Translate it. */
  placeholder?: string;
  /** Shown when nothing matches. Translate it. The `empty` slot overrides it. */
  emptyLabel?: string;
  /** Shown while loading. Translate it. */
  loadingLabel?: string;
  /** The Recent group's label. Translate it. */
  recentLabel?: string;
  /** The Esc button's accessible name. Translate it. */
  closeLabel?: string;
  /** The footer's hint beside the arrow keys. Translate it. */
  navigateLabel?: string;
  /** The footer's hint beside the Enter key. Translate it. */
  selectLabel?: string;
  /** Content for a trigger button that opens the palette, shown with the shortcut's keys. The `trigger` slot overrides it. */
  trigger?: string;
  /** Replaces the footer's key hints. The `footer` slot overrides it. */
  footer?: string;
  /** Traps focus, locks scroll and hides the page from assistive technology. */
  modal?: boolean;
  /** Renders the palette at the end of the body (Teleport). Off renders it in place. */
  portal?: boolean;
  /** Extra classes per part. */
  classes?: Partial<Record<SpotlightPart, string>>;
}
