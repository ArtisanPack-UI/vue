import type { Theme, ThemeChoice } from '@artisanpack-ui/behavior';

export type { Theme, ThemeChoice };

/** How the toggle shows the choices. */
export type ThemeToggleVariant = 'segmented' | 'icon' | 'menu';

/** The track's, the button's or the trigger's size. */
export type ThemeToggleSize = 'sm' | 'md';

/** The parts a ThemeToggle accepts extra classes for. */
export type ThemeTogglePart = 'root' | 'list' | 'option' | 'button' | 'trigger' | 'menu' | 'item';

/**
 * Props for the ThemeToggle component (#65): light, dark, high contrast or
 * system. Bind the choice with `v-model`; without it the stored choice shows.
 */
export interface ThemeToggleProps {
  /**
   * The choice (`v-model`): a pick only emits it, and the toggle applies it once
   * `modelValue` changes to it. Without it, the stored choice, else the one
   * ThemeScript applied, else `system`.
   */
  modelValue?: ThemeChoice;
  /** Emitted as `data-variant`. @defaultValue `'segmented'` */
  variant?: ThemeToggleVariant;
  /** Emitted as `data-size`. @defaultValue `'md'` */
  size?: ThemeToggleSize;
  /** The choices segmented and menu offer. @defaultValue all four */
  choices?: ThemeChoice[];
  /** Segmented shows only the icons; the names stay visually hidden. @defaultValue `false` */
  iconOnly?: boolean;
  /** Names the radio group and the menu; the menu trigger's text. Translate it. @defaultValue `'Theme'` */
  label?: string;
  /** @defaultValue `'Light'` */
  lightLabel?: string;
  /** @defaultValue `'Dark'` */
  darkLabel?: string;
  /** @defaultValue `'High contrast'` */
  highContrastLabel?: string;
  /** The system choice's name in the segmented control. @defaultValue `'System'` */
  systemLabel?: string;
  /** The system choice's name in the menu. @defaultValue `'Match system'` */
  matchSystemLabel?: string;
  /** The icon button's name while it switches to light. @defaultValue `'Switch to light theme'` */
  switchToLightLabel?: string;
  /** The icon button's name while it switches to dark. @defaultValue `'Switch to dark theme'` */
  switchToDarkLabel?: string;
  /** Stores the choice in localStorage. @defaultValue `true` */
  persist?: boolean;
  /** The localStorage key; pass the same one to the head snippet. @defaultValue `'apui-theme'` */
  storageKey?: string;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<ThemeTogglePart, string>>;
}

/** Props for the ThemeScript component. */
export interface ThemeScriptProps {
  /** The localStorage key; the same one the toggles use. @defaultValue `'apui-theme'` */
  storageKey?: string;
  /** The choice without a stored one. @defaultValue `'system'` */
  defaultValue?: ThemeChoice;
  /** A CSP nonce for the inline script. */
  nonce?: string;
}
