/** The tabs' visual treatment. Emitted as `data-variant`. */
export type TabsVariant = 'segmented' | 'underline';

/** The triggers' size. Emitted as `data-size`. */
export type TabsSize = 'sm' | 'md';

/** Lays the tablist out in a row or a column. Emitted as `data-orientation`. */
export type TabsOrientation = 'horizontal' | 'vertical';

/** How the keyboard selects a tab. Emitted as `data-activation-mode`. */
export type TabsActivationMode = 'automatic' | 'manual';

/** The parts of Tabs that accept extra classes. */
export type TabsPart = 'root' | 'list' | 'trigger' | 'icon' | 'count' | 'content';

/** A tab as data, for the `tabs` prop: renders the same trigger and panel as a `Tab`. */
export interface TabData {
  /** The tab's value, unique in the tabs. */
  value: string;
  /** The trigger's text. */
  label: string;
  /** An icon name from the registry, before the label. */
  icon?: string;
  /** A count at the end of the trigger, such as unread items. */
  count?: string | number;
  /** Disables the tab; the arrow keys skip it. */
  disabled?: boolean;
  /** The panel's text. */
  content?: string;
}

/** Props for the Tabs component. */
export interface TabsProps {
  /** The selected tab's value (`v-model`). Without it, the first enabled tab is selected. */
  modelValue?: string;
  /** The tabs as data, rendered before the `Tab` children. */
  tabs?: TabData[];
  /** @defaultValue `'segmented'` */
  variant?: TabsVariant;
  /** @defaultValue `'md'` */
  size?: TabsSize;
  /** @defaultValue `'horizontal'` */
  orientation?: TabsOrientation;
  /** Automatic selects as the arrow keys move; manual waits for Enter or Space. @defaultValue `'automatic'` */
  activationMode?: TabsActivationMode;
  /** Names the tablist for assistive technology. */
  label?: string;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<TabsPart, string>>;
}

/** Props for the Tab component: one tab of a Tabs. The default slot is its panel. */
export interface TabProps {
  /** The tab's value, unique in the tabs. */
  value: string;
  /** The trigger's text. */
  label?: string;
  /** An icon name from the registry, before the label. */
  icon?: string;
  /** A count at the end of the trigger. */
  count?: string | number;
  /** Disables the tab. */
  disabled?: boolean;
}

/** @deprecated Use {@link TabData}. */
export type TabItem = TabData;
