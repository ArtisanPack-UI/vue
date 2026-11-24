/**
 * TypeScript types for Inertia.js + Laravel integration.
 *
 * @module types
 */
import type { FlashToastColor } from '../composables/useFlashMessages';

// ---------------------------------------------------------------------------
// Laravel Pagination
// ---------------------------------------------------------------------------

/** A single link entry returned by Laravel's paginator JSON. */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
  /**
   * The page number this link goes to, or null for an ellipsis or a disabled
   * previous/next link. Sent by Laravel 12.23 and later.
   */
  page?: number | null;
}

/**
 * Shape of Laravel's `LengthAwarePaginator::toArray()` response.
 *
 * Generic over the row type `T`.
 */
export interface LaravelPaginator<T = Record<string, unknown>> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

/** Shape of Laravel's `SimplePaginator::toArray()` (no total/last_page). */
export interface LaravelSimplePaginator<T = Record<string, unknown>> {
  current_page: number;
  /** The current page's URL. Sent by Laravel 12.15 and later. */
  current_page_url?: string;
  data: T[];
  first_page_url: string;
  from: number | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
}

/** Shape of Laravel's `CursorPaginator::toArray()`, from `->cursorPaginate()`. */
export interface LaravelCursorPaginator<T = Record<string, unknown>> {
  data: T[];
  path: string;
  per_page: number;
  next_cursor: string | null;
  next_page_url: string | null;
  prev_cursor: string | null;
  prev_page_url: string | null;
}

/**
 * The shape of a paginated API resource collection, such as
 * `UserResource::collection( $users->paginate() )` passed as an Inertia prop.
 * The rows are in `data`, the page URLs in `links` and the rest in `meta`.
 */
export interface LaravelResourcePaginator<T = Record<string, unknown>> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: Omit<
    LaravelPaginator<T>,
    'data' | 'first_page_url' | 'last_page_url' | 'next_page_url' | 'prev_page_url'
  >;
}

// ---------------------------------------------------------------------------
// Flash Messages
// ---------------------------------------------------------------------------

/** Standard flash message keys used by Laravel's `redirect()->with()`. */
export interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  message?: string;
  [key: string]: string | undefined;
}

// ---------------------------------------------------------------------------
// Auth / Shared Props
// ---------------------------------------------------------------------------

/** Minimal authenticated user shape exposed via `usePage().props.auth`. */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  [key: string]: unknown;
}

/** The `auth` object typically shared via `HandleInertiaRequests` middleware. */
export interface AuthProps {
  user: AuthUser | null;
}

/**
 * Base shape for Inertia shared page props in a Laravel application.
 *
 * Extend this interface in your application to add custom shared props:
 *
 * ```ts
 * interface MyPageProps extends SharedPageProps {
 *   appName: string;
 *   permissions: string[];
 * }
 * ```
 */
export interface SharedPageProps {
  auth?: AuthProps;
  flash?: FlashMessages;
  errors?: Record<string, string>;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Inertia Form Helpers
// ---------------------------------------------------------------------------

/** Options accepted by `useInertiaForm`. */
export interface InertiaFormOptions {
  /**
   * When true, automatically resets the form after a successful submission.
   *
   * @defaultValue `true`
   */
  resetOnSuccess?: boolean;
}

// ---------------------------------------------------------------------------
// Plugin Options
// ---------------------------------------------------------------------------

/**
 * Options for the `createArtisanPackUILaravel` Vue plugin.
 */
export interface ArtisanPackUILaravelOptions {
  /**
   * Component name prefix for globally registered adapter components.
   *
   * @defaultValue `'Ap'`
   */
  prefix?: string;

  /**
   * Map of flash message keys to toast colors for `useFlashMessages()` and
   * `FlashToasts` across the app, merged over the defaults. A component's
   * own `colorMap` wins over it.
   *
   * @defaultValue `{ success: 'success', error: 'error', warning: 'warning', info: 'info', message: 'info' }`
   */
  flashColorMap?: Record<string, FlashToastColor>;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

/** Props for the persistent AppLayout wrapper. */
export interface AppLayoutProps {
  /** Page title rendered inside the layout. */
  title?: string;
  /** Additional CSS classes for the layout root element. */
  className?: string;
}

/** Props for the AuthLayout wrapper. */
export interface AuthLayoutProps {
  /** Page title. */
  title?: string;
  /** Additional CSS classes. */
  className?: string;
}

/** Props for the GuestLayout wrapper. */
export interface GuestLayoutProps {
  /** Page title. */
  title?: string;
  /** Additional CSS classes. */
  className?: string;
}
