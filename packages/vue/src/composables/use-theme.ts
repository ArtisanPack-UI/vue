/**
 * @module use-theme
 *
 * Provides a Vue composable and plugin for managing application color
 * scheme (light, dark, or system). Tracks the operating system's color
 * scheme preference in real time and exposes both the raw preference
 * and the resolved value.
 *
 * @packageDocumentation
 */

import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  type InjectionKey,
  type Ref,
} from 'vue';
import { DefaultColorSchemeKey } from '../plugin';

/**
 * Supported color scheme modes.
 *
 * - `'light'` -- Force light mode.
 * - `'dark'` -- Force dark mode.
 * - `'system'` -- Follow the operating system preference.
 */
export type ColorScheme = 'light' | 'dark' | 'system';

/**
 * Values exposed by the theme composable via {@link useTheme}.
 */
export interface ThemeContextValue {
  /** The current user-selected color scheme preference. */
  colorScheme: Ref<ColorScheme>;
  /** The resolved mode after evaluating a `'system'` preference. Always `'light'` or `'dark'`. */
  resolvedColorScheme: Ref<'light' | 'dark'>;
  /** Update the color scheme preference. */
  setColorScheme: (scheme: ColorScheme) => void;
}

/** Injection key for the theme context. */
export const ThemeKey: InjectionKey<ThemeContextValue> = Symbol('artisanpack-theme');

/**
 * Reads the current OS-level color scheme preference.
 * Returns `'light'` on the server (SSR) or when `window` is unavailable.
 */
function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Provides theme context to descendant components.
 *
 * Call this composable in a root-level component (e.g., `App.vue`) to
 * track the operating system's `prefers-color-scheme` media query and
 * allow child components to consume or override the color scheme via
 * {@link useTheme}.
 *
 * @param defaultColorScheme - Initial color scheme preference. When omitted,
 *   reads the plugin-level default from `createArtisanPackUI()`, falling back to `'system'`.
 * @returns The theme context value.
 *
 * @example
 * ```vue
 * <script setup>
 * import { provideTheme } from '@artisanpack-ui/vue';
 *
 * // Uses plugin default or 'system' if no plugin installed
 * provideTheme();
 *
 * // Explicit override
 * provideTheme('dark');
 * </script>
 * ```
 */
export function provideTheme(defaultColorScheme?: ColorScheme): ThemeContextValue {
  // Resolve default: explicit arg > plugin config > 'system'
  const pluginDefault = inject(DefaultColorSchemeKey, undefined);
  const resolvedDefault = defaultColorScheme ?? pluginDefault ?? 'system';

  const colorScheme = ref<ColorScheme>(resolvedDefault);
  const systemPreference = ref<'light' | 'dark'>(getSystemPreference());

  let cleanup: (() => void) | undefined;

  onMounted(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      systemPreference.value = getSystemPreference();
    };
    mql.addEventListener('change', handler);
    cleanup = () => mql.removeEventListener('change', handler);
  });

  onUnmounted(() => {
    cleanup?.();
  });

  const resolvedColorScheme = computed<'light' | 'dark'>(() =>
    colorScheme.value === 'system' ? systemPreference.value : colorScheme.value,
  );

  const setColorScheme = (scheme: ColorScheme) => {
    colorScheme.value = scheme;
  };

  const value: ThemeContextValue = {
    colorScheme,
    resolvedColorScheme,
    setColorScheme,
  };

  provide(ThemeKey, value);

  return value;
}

/**
 * Composable that returns the current theme context value.
 *
 * Provides the raw `colorScheme` preference, the `resolvedColorScheme`
 * (always `'light'` or `'dark'`), and a `setColorScheme` setter.
 *
 * Must be called within a component tree where {@link provideTheme}
 * has been called.
 *
 * @returns The current theme context value.
 *
 * @throws Error if called outside a component tree with `provideTheme`.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTheme } from '@artisanpack-ui/vue';
 *
 * const { resolvedColorScheme, setColorScheme } = useTheme();
 * </script>
 *
 * <template>
 *   <header :data-theme="resolvedColorScheme">
 *     <button @click="setColorScheme('dark')">Dark</button>
 *   </header>
 * </template>
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = inject(ThemeKey);
  if (!context) {
    throw new Error(
      'useTheme() must be used within a component tree where provideTheme() has been called.',
    );
  }
  return context;
}
