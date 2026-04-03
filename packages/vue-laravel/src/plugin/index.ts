/**
 * Vue plugin for global registration of ArtisanPack UI Laravel adapter components.
 *
 * @module plugin
 *
 * @example
 * ```ts
 * import { createApp } from 'vue';
 * import { createArtisanPackUILaravel } from '@artisanpack-ui/vue-laravel';
 *
 * const app = createApp(App);
 * app.use(createArtisanPackUILaravel({ prefix: 'Ap' }));
 * app.mount('#app');
 * ```
 */
import type { App, Plugin, Component } from 'vue';
import type { ArtisanPackUILaravelOptions } from '../types';

// Navigation
import InertiaMenu from '../components/navigation/InertiaMenu.vue';
import InertiaBreadcrumbs from '../components/navigation/InertiaBreadcrumbs.vue';
import InertiaPagination from '../components/navigation/InertiaPagination.vue';

// Form
import InertiaForm from '../components/form/InertiaForm.vue';
import InertiaInput from '../components/form/InertiaInput.vue';
import InertiaSelect from '../components/form/InertiaSelect.vue';
import InertiaTextarea from '../components/form/InertiaTextarea.vue';
import InertiaCheckbox from '../components/form/InertiaCheckbox.vue';
import InertiaToggle from '../components/form/InertiaToggle.vue';
import InertiaPassword from '../components/form/InertiaPassword.vue';
import InertiaRadio from '../components/form/InertiaRadio.vue';

// Layout
import AppLayout from '../components/layout/AppLayout.vue';
import AuthLayout from '../components/layout/AuthLayout.vue';
import GuestLayout from '../components/layout/GuestLayout.vue';

// Feedback
import FlashAlerts from '../components/feedback/FlashAlerts.vue';
import FlashToasts from '../components/feedback/FlashToasts.vue';

/** All adapter components keyed by their base name (without prefix). */
const components: Record<string, Component> = {
  InertiaMenu,
  InertiaBreadcrumbs,
  InertiaPagination,
  InertiaForm,
  InertiaInput,
  InertiaSelect,
  InertiaTextarea,
  InertiaCheckbox,
  InertiaToggle,
  InertiaPassword,
  InertiaRadio,
  AppLayout,
  AuthLayout,
  GuestLayout,
  FlashAlerts,
  FlashToasts,
};

/**
 * Creates the ArtisanPack UI Laravel Vue plugin.
 *
 * Registers all adapter components globally with an optional prefix.
 *
 * @param options - Plugin configuration options.
 * @returns A Vue plugin instance.
 *
 * @example
 * ```ts
 * // Default prefix 'Ap': <ApInertiaInput />, <ApFlashAlerts />, etc.
 * app.use(createArtisanPackUILaravel());
 *
 * // Custom prefix: <MyInertiaInput />, <MyFlashAlerts />, etc.
 * app.use(createArtisanPackUILaravel({ prefix: 'My' }));
 * ```
 */
export function createArtisanPackUILaravel(options: ArtisanPackUILaravelOptions = {}): Plugin {
  const { prefix = 'Ap' } = options;

  return {
    install(app: App) {
      for (const [name, component] of Object.entries(components)) {
        app.component(`${prefix}${name}`, component);
      }
    },
  };
}
