# Changelog

All notable changes to the ArtisanPack UI Vue monorepo will be documented in this file.

Per-package changelogs are generated automatically by [Changesets](https://github.com/changesets/changesets) and live alongside each package. This root changelog provides a high-level overview across the monorepo.

## [Unreleased]

## [2.0.0] - 2026-11-14

### Added

- `@artisanpack-ui/vue` - The components are rebuilt on the ArtisanPack UI design system: one API shared with Livewire UI Components 3.0 and `@artisanpack-ui/react` 2.0, styled by `@artisanpack-ui/css` and driven by `@artisanpack-ui/behavior`
- `@artisanpack-ui/vue` - Design-system Dialog, DropdownMenu, Toast and Toaster (design-system #49 to #51), followed by the Form, Navigation, Layout, Feedback, Data Display, Chart, Calendar and Utility waves
- `@artisanpack-ui/vue` - The `/ai` subpath, rebuilt on the design-system components; the AI components take `labels` for their text
- `@artisanpack-ui/vue-laravel` - Flash toasts on `Toaster` and `toast.create()`, `flashColorMap` wired through, `InertiaRadioGroup` registered, InertiaBreadcrumbs and the layouts on the design system

### Changed

- `@artisanpack-ui/vue` - The deprecated Modal, Dropdown, SpotlightSearch, Sidebar, Radio, Editor, ToastProvider and ToastMessage are aliases of their design-system replacements
- Both packages - Type declarations resolve under `moduleResolution` `node16` and `nodenext` as well as `bundler`, and both packages declare `"sideEffects": false`
- Both packages - Depend on the published design-system packages instead of a local checkout

### Removed

- `@artisanpack-ui/vue` - DaisyUI, and the 1.x `DaisyColor`, `Size`, `GlassProps`, `ColorProps` and `FormFieldProps` types
- Both packages - The `@artisanpack-ui/tokens` 1.x dependency; the design tokens ship with `@artisanpack-ui/css`

## [1.0.1] - 2026-11-13

### Changed

- Both packages - Pin `@artisanpack-ui/tokens` to `^1.0.1`, so 1.x installs stay on tokens 1.x when tokens 2.0 ships

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
