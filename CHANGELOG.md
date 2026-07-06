# Changelog

All notable changes to the ArtisanPack UI Vue monorepo will be documented in this file.

Per-package changelogs are generated automatically by [Changesets](https://github.com/changesets/changesets) and live alongside each package. This root changelog provides a high-level overview across the monorepo.

## [Unreleased]

## [1.0.1] - 2026-07-06

### Added

- **`@artisanpack-ui/vue` — new `ai/` subpath** ([ArtisanPack-UI/ai#18](https://github.com/ArtisanPack-UI/ai/issues/18), [#33](https://github.com/ArtisanPack-UI/vue/pull/33)). Drop-in Vue 3 components + composables that consume the `artisanpack-ui/ai` JSON API without pulling in Livewire:
  - `SettingsPage` — provider credentials + per-feature model/instructions overrides backed by `GET/PUT /settings` with an inline `test-connection` probe. Handles Sanctum 422 validation errors and clears the typed key + last probe result on provider switch.
  - `UsageDashboard` — totals, per-feature breakdown, and daily buckets from `GET /usage`. Optional `refreshInterval` prop enables polling for live updates; sequence-guarded so out-of-order responses can't clobber fresher ones. Watches `from`/`to` props so a date-range picker just works.
  - `FeatureToggles` — optimistic per-feature enable/disable list backed by `GET /features` + `POST /features/{key}/toggle`, with rollback + error surfacing on API failure.
  - `createAiApiClient` — small `fetch` wrapper with `AiApiError` for 422 handling; omits `Content-Type` on GET so strict reverse-proxies don't 415.
  - `useStreamingText` — composable that consumes a `fetch` response body as a UTF-8 text stream via the Streams API + `AbortController`, for long-running agent-output surfaces.
  - Full Vitest coverage (20 new tests).

## [1.0.0] - 2026-04-05

### Added

- `@artisanpack-ui/vue` - 58 Vue 3 UI components across 7 categories (form, layout, navigation, data display, feedback, utility)
- `@artisanpack-ui/vue` - `createArtisanPackUI` plugin with theme provider and default color scheme option
- `@artisanpack-ui/vue` - `useTheme` and `useBreakpoint` composables
- `@artisanpack-ui/vue` - Tree-shakeable sub-path exports per category
- `@artisanpack-ui/vue` - Histoire stories for all components
- `@artisanpack-ui/vue-laravel` - Inertia.js adapter wrappers for form, navigation, layout, and feedback components
- `@artisanpack-ui/vue-laravel` - `useInertiaForm`, `useFlashMessages`, and `useAuth` composables
- `@artisanpack-ui/vue-laravel` - `createArtisanPackUILaravel` plugin
- Root documentation: README, CONTRIBUTING, LICENSE, and `docs/` directory
