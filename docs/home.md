---
title: ArtisanPack UI Vue Documentation Home
menu_order: 1
---

# ArtisanPack UI for Vue

`@artisanpack-ui/vue` 2.0 renders the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home) for Vue. Styling comes from `@artisanpack-ui/css` (design tokens in cascade layers, Tailwind optional), interaction from `@artisanpack-ui/behavior` (Zag state machines through `@zag-js/vue`), and every component shares its props, parts, events and keyboard behavior with the React and Livewire packages.

| Package                       | What it is                                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@artisanpack-ui/vue`         | The components, the composables, the Vue plugin and the AI admin components (`/ai`)                                               |
| `@artisanpack-ui/vue-laravel` | Inertia.js wrappers for Laravel: form fields bound to validation errors, pagination, menus, flash messages and the signed-in user |

Each component has its own page in the design-system documentation, with a Vue tab, live examples and tables of its props, parts, slots and events. These pages cover what is specific to Vue.

## Requirements

- Vue 3.5 or later
- `@artisanpack-ui/css` for the styles
- `@inertiajs/vue3` 2.0 or later, for `@artisanpack-ui/vue-laravel` only

Coming from 1.x? DaisyUI is no longer used. See [Upgrading from 1.x](Upgrading).

## Table of Contents

- [Getting Started](Getting-Started)
- [Components](Components)
- [Theming](Theming)
- [Composables](Composables)
- [Laravel and Inertia](Laravel-Inertia)
- [Nuxt and Server Rendering](Nuxt-And-Server-Rendering)
- [TypeScript](Typescript)
- [Bundle Size](Bundle-Size)
- [AI Components](Ai-Components)
- [Upgrading from 1.x](Upgrading)

## Getting help

- **Issues:** [GitHub](https://github.com/ArtisanPack-UI/vue/issues)
- **Source:** [ArtisanPack-UI/vue](https://github.com/ArtisanPack-UI/vue)

The packages are MIT licensed.
