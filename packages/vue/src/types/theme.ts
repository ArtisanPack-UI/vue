/**
 * @module theme
 *
 * Shared theme types and injection keys used by both the plugin and
 * composables. Extracted to avoid circular dependencies between
 * `plugin/index.ts` and `composables/use-theme.ts`.
 *
 * @packageDocumentation
 */

import type { InjectionKey } from 'vue';

/**
 * Supported color scheme modes.
 *
 * - `'light'` -- Force light mode.
 * - `'dark'` -- Force dark mode.
 * - `'system'` -- Follow the operating system preference.
 */
export type ColorScheme = 'light' | 'dark' | 'system';

/** Injection key for the plugin-level default color scheme. */
export const DefaultColorSchemeKey: InjectionKey<ColorScheme> = Symbol(
  'artisanpack-default-color-scheme',
);
