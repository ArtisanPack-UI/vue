/**
 * @artisanpack-ui/vue-laravel
 *
 * Inertia.js adapter wrappers for ArtisanPack UI Vue components.
 * Provides form helpers, navigation wrappers, layout components,
 * flash message integration, and auth-aware composables for
 * Laravel + Inertia.js applications.
 *
 * @packageDocumentation
 */

// Types
export type {
  LaravelPaginator,
  LaravelSimplePaginator,
  PaginationLink,
  FlashMessages,
  AuthUser,
  AuthProps,
  SharedPageProps,
  InertiaFormOptions,
  ArtisanPackUILaravelOptions,
  AppLayoutProps,
  AuthLayoutProps,
  GuestLayoutProps,
} from './types';

// Composables
export { useInertiaForm } from './composables/useInertiaForm';
export { useFlashMessages } from './composables/useFlashMessages';
export type { UseFlashMessagesOptions } from './composables/useFlashMessages';
export { useAuth } from './composables/useAuth';

// Components — Navigation
export { InertiaMenu, InertiaBreadcrumbs, InertiaPagination } from './components/navigation';

// Components — Form
export {
  InertiaForm,
  InertiaInput,
  InertiaSelect,
  InertiaTextarea,
  InertiaCheckbox,
  InertiaToggle,
  InertiaPassword,
  InertiaRadio,
  INERTIA_FORM_KEY,
} from './components/form';
export type { InertiaFormContext } from './components/form';

// Components — Layout
export { AppLayout, AuthLayout, GuestLayout } from './components/layout';

// Components — Feedback
export { FlashAlerts, FlashToasts } from './components/feedback';

// Plugin
export { createArtisanPackUILaravel } from './plugin';
