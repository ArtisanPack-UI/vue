---
title: Overview
menu_order: 0
---

# Overview

`@artisanpack-ui/vue` 2.0 is the Vue library of the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home). It renders the same components as the Livewire and React libraries, with the same props, parts, keyboard behavior and markup.

| Package                       | What it is                                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@artisanpack-ui/vue`         | The components, the composables, the Vue plugin and the AI admin components on the `/ai` subpath.                                 |
| `@artisanpack-ui/vue-laravel` | Inertia.js wrappers for Laravel: form fields bound to validation errors, pagination, menus, layouts, flash messages and the user. |

## Features

- **Styling** comes from `@artisanpack-ui/css`: plain CSS in cascade layers, driven by design tokens. Tailwind is optional, and nothing depends on DaisyUI.
- **Interaction** (focus, keyboard and ARIA for dialogs, menus, comboboxes, tabs and the rest) comes from `@artisanpack-ui/behavior`, built on Zag state machines through `@zag-js/vue`.
- **Theming** is attributes and tokens: light, dark and high contrast themes, density and presets, with no props on the components.
- **Vue conventions**: `v-model` on every value and open state, named slots for rich content, attribute fall-through, and `class` plus `classes` for styling individual parts.
- **Server rendering** with Vue's SSR renderer and Nuxt. Generated IDs come from `useId()`, so they match on hydration.
- **TypeScript** declarations for every entry point, and category subpaths for smaller bundles.
- **Laravel and Inertia** wrappers for forms, navigation, layouts, auth and flash messages, and AI admin screens for the `artisanpack-ui/ai` package.

## Requirements

Vue 3.5 or later, and a bundler that reads the `exports` field of `package.json` (Vite, Nuxt, webpack 5, Rollup or esbuild). `@artisanpack-ui/vue-laravel` also needs `@inertiajs/vue3` 2 or 3. See [Installation](installation.md#requirements).

## Quick install

```bash
npm install @artisanpack-ui/vue @artisanpack-ui/css
```

Then load `@artisanpack-ui/css` once in your app's entry and apply the stored theme before the first paint. See [Getting Started](getting-started.md).

## Next steps

- [Getting Started](getting-started.md): a working component in five minutes.
- [Installation](installation.md): requirements, the CSS with or without Tailwind, and the theme script.
- [Components](components.md): a page for every component, with all of its props, slots, events and parts.
- [Theming](theming.md), [Composables](composables.md) and [TypeScript](typescript.md).
- [Laravel and Inertia](laravel-inertia.md), [AI Components](components/ai.md) and [Nuxt and Server Rendering](nuxt-and-server-rendering.md).
- [Reference](reference.md): every function, composable and constant the packages export.
- [Upgrading](upgrading.md), the [FAQ](faq.md) and [Troubleshooting](troubleshooting.md).

## Design system documentation

These pages cover the Vue packages. The design-system documentation covers everything shared by the three stacks:

- [Getting started with Vue](https://docs.artisanpackui.dev/documentation/design-system/getting-started/vue)
- [Foundations](https://docs.artisanpackui.dev/documentation/design-system/foundations): tokens, color, type, spacing, motion and icons
- [Theming](https://docs.artisanpackui.dev/documentation/design-system/theming): themes, presets, brand presets and custom tokens
- [Components](https://docs.artisanpackui.dev/documentation/design-system/components): anatomy, tokens and live examples for each component
- [Accessibility](https://docs.artisanpackui.dev/documentation/design-system/accessibility)

## Getting help

Report bugs and ask questions in [GitHub issues](https://github.com/ArtisanPack-UI/vue/issues). Both packages are MIT licensed.
