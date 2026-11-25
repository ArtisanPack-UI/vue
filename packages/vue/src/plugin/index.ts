/**
 * @module plugin
 *
 * Vue plugin for global registration of all ArtisanPack UI components.
 * Provides a `createArtisanPackUI()` factory that returns a Vue plugin
 * which can be installed via `app.use()`.
 *
 * @packageDocumentation
 */

import type { App, Component, MaybeRefOrGetter, Plugin } from 'vue';
import { DefaultColorSchemeKey, type ColorScheme } from '../types/theme';
import { createTranslatorRef, TranslatorKey, type TranslationMessages } from '../i18n/translator';

export { DefaultColorSchemeKey };
export type { ColorScheme } from '../types/theme';

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

  /**
   * The locale for the components' built-in text, as a BCP 47 tag or a
   * Laravel locale (`pt_BR`). A ref or getter switches language at runtime.
   * Without it the components render English.
   */
  locale?: MaybeRefOrGetter<string>;

  /**
   * The catalogue for `locale`, keyed by the English text. Spread a shipped
   * one and add overrides: `{ ...es, Close: 'Salir' }`. Strings missing from
   * it render in English.
   */
  messages?: MaybeRefOrGetter<TranslationMessages | undefined>;
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
 * // Install with translations for the components' built-in text
 * import es from '@artisanpack-ui/vue/lang/es.json';
 *
 * app.use(createArtisanPackUI({ locale: 'es', messages: es }));
 *
 * app.mount('#app');
 * ```
 */
export function createArtisanPackUI(options: ArtisanPackUIOptions = {}): Plugin {
  const {
    prefix = 'Ap',
    defaultColorScheme = 'system',
    components = {},
    locale,
    messages,
  } = options;

  return {
    install(app: App) {
      // Store config for composables to access
      app.provide(DefaultColorSchemeKey, defaultColorScheme);

      if (locale !== undefined) {
        app.provide(TranslatorKey, createTranslatorRef({ locale, messages }));
      }

      // Register components globally with prefix
      for (const [name, component] of Object.entries(components)) {
        app.component(`${prefix}${name}`, component);
      }
    },
  };
}
