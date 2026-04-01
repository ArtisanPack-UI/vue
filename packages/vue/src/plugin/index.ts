/**
 * @module plugin
 *
 * Vue plugin for global registration of all ArtisanPack UI components.
 * Provides a `createArtisanPackUI()` factory that returns a Vue plugin
 * which can be installed via `app.use()`.
 *
 * @packageDocumentation
 */

import type { App, Component, Plugin, InjectionKey } from 'vue';
import type { ColorScheme } from '../composables/use-theme';

/** Injection key for the plugin-level default color scheme. */
export const DefaultColorSchemeKey: InjectionKey<ColorScheme> = Symbol(
  'artisanpack-default-color-scheme',
);

/**
 * Configuration options for the ArtisanPack UI plugin.
 */
export interface ArtisanPackUIOptions {
  /**
   * Prefix for globally registered component names.
   * Defaults to `'Ap'` (e.g., `<ApButton />`).
   */
  prefix?: string;

  /**
   * Initial color scheme preference for the theme provider.
   * Defaults to `'system'`.
   */
  defaultColorScheme?: ColorScheme;

  /**
   * Map of component names to component definitions for global registration.
   * When provided, only these components are globally registered.
   * When omitted, no components are globally registered (tree-shakeable imports are preferred).
   */
  components?: Record<string, Component>;
}

/**
 * Creates a Vue plugin for the ArtisanPack UI component library.
 *
 * The plugin optionally registers components globally with a configurable
 * prefix. For tree-shaking, prefer direct imports over global registration.
 *
 * @param options - Plugin configuration options.
 * @returns A Vue plugin that can be installed via `app.use()`.
 *
 * @example
 * ```ts
 * // main.ts
 * import { createApp } from 'vue';
 * import { createArtisanPackUI } from '@artisanpack-ui/vue';
 * import App from './App.vue';
 *
 * const app = createApp(App);
 *
 * // Install with defaults (no global components, system color scheme)
 * app.use(createArtisanPackUI());
 *
 * // Install with global component registration
 * import { Button, Card, Input } from '@artisanpack-ui/vue';
 *
 * app.use(createArtisanPackUI({
 *   prefix: 'Ap',
 *   defaultColorScheme: 'system',
 *   components: { Button, Card, Input },
 * }));
 * // Components available as <ApButton />, <ApCard />, <ApInput />
 *
 * app.mount('#app');
 * ```
 */
export function createArtisanPackUI(options: ArtisanPackUIOptions = {}): Plugin {
  const { prefix = 'Ap', defaultColorScheme = 'system', components = {} } = options;

  return {
    install(app: App) {
      // Store config for composables to access
      app.provide(DefaultColorSchemeKey, defaultColorScheme);

      // Register components globally with prefix
      for (const [name, component] of Object.entries(components)) {
        app.component(`${prefix}${name}`, component);
      }
    },
  };
}
