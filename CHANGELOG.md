# Changelog

All notable changes to the ArtisanPack UI Vue monorepo will be documented in this file.

Per-package changelogs are generated automatically by [Changesets](https://github.com/changesets/changesets) and live alongside each package. This root changelog provides a high-level overview across the monorepo.

## [Unreleased]

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
- `@artisanpack-ui/vue` - Design-system Dialog, DropdownMenu, Toast and Toaster (design-system #49 to #51); Modal, Dropdown and ToastProvider are deprecated
- `@artisanpack-ui/vue` - The deprecated Modal, Dropdown, SpotlightSearch, Sidebar, Radio, Editor, ToastProvider and ToastMessage are aliases of their design-system replacements; the AI components take `labels`
- `@artisanpack-ui/vue-laravel` - Flash toasts on `Toaster` and `toast.create()`, `flashColorMap` wired through, `InertiaRadioGroup` registered, InertiaBreadcrumbs and the layouts on the design system

### Removed

- `@artisanpack-ui/vue` - DaisyUI, and the 1.x `DaisyColor`, `Size`, `GlassProps`, `ColorProps` and `FormFieldProps` types
