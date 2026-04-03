import type { Size } from '@artisanpack-ui/tokens';

/**
 * Props for the ThemeToggle component.
 *
 * A toggle control that switches between light, dark, and system color schemes.
 * Integrates with the useTheme composable and persists the preference to localStorage.
 */
export interface ThemeToggleProps {
  /** The size of the toggle. @defaultValue `'md'` */
  size?: Size;
  /** Whether to persist the color scheme preference to localStorage. @defaultValue `true` */
  persist?: boolean;
  /** The localStorage key used for persistence. @defaultValue `'artisanpack-color-scheme'` */
  storageKey?: string;
  /** Additional CSS classes. */
  className?: string;
}
