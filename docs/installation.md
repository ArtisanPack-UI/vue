---
title: Installation
menu_order: 20
meta_description: Requirements, the npm packages to install, loading the design system CSS and applying the theme before the first paint.
---

# Installation

Everything you need to add `@artisanpack-ui/vue` to a Vue app. For the shortest path to a working component, see [Getting Started](getting-started.md).

## Requirements

- **Vue 3.5 or later.** The components use `useId()` for the IDs that link labels, hints and errors to their controls.
- **A bundler that reads the `exports` field** of `package.json`: Vite, Nuxt, webpack 5, Rollup or esbuild. The packages ship ES modules only, with no CommonJS build.
- **TypeScript 5 or later**, if you use TypeScript, with Vue's language tools (`vue-tsc`) to type-check templates. See [TypeScript](typescript.md).
- **`@inertiajs/vue3` 2 or 3**, only for `@artisanpack-ui/vue-laravel`.

## Install the packages

```bash
npm install @artisanpack-ui/vue @artisanpack-ui/css
```

| Package                       | Why you need it                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `@artisanpack-ui/vue`         | The components, the composables, the Vue plugin and the AI admin components on the `/ai` subpath. |
| `@artisanpack-ui/css`         | The design system's styles. The components ship no CSS of their own.                              |
| `@artisanpack-ui/behavior`    | The behavior engine (focus, keyboard and ARIA). Installed for you as a dependency.                |
| `@zag-js/vue`                 | The Vue adapter for the behavior engine's state machines. Installed for you as a dependency.      |
| `@artisanpack-ui/vue-laravel` | Optional. Inertia wrappers for Laravel apps. See [Laravel and Inertia](#laravel-and-inertia).     |

`vue` is a peer dependency, so your app provides it. If you import from `@artisanpack-ui/behavior` yourself (for `themeScript()`, say), add it to your own `package.json` too, so strict package managers such as pnpm resolve it.

## Load the CSS

Load `@artisanpack-ui/css` once for the whole app.

### Without Tailwind

Import it in your app's entry:

```ts
// src/main.ts
import '@artisanpack-ui/css';
```

With Nuxt, add it to `css` in `nuxt.config.ts` instead. See [Nuxt and Server Rendering](nuxt-and-server-rendering.md).

### With Tailwind CSS 4

Import it from your Tailwind entry stylesheet instead, after a line that sets the layer order:

```css
/* src/app.css */
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind'; /* optional: utilities generated from the tokens */
```

The `@layer` line has to come first. It keeps Tailwind's Preflight from restyling the components while still letting a utility on a component win. See [With Tailwind](https://docs.artisanpackui.dev/documentation/design-system/getting-started/tailwind).

### Without the visual layer

To keep the markup and behavior but write every visual style yourself, import `@artisanpack-ui/css/headless` instead of the full CSS. See [Headless](https://docs.artisanpackui.dev/documentation/design-system/theming/headless).

## Apply the theme before the first paint

A stored dark or high contrast choice has to be applied before the page paints, or the page flashes the light theme first. Where the script goes depends on how the page is rendered:

| Your app                                 | Where the theme script goes                                                                                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client-rendered (a Vite single-page app) | Inline the output of `themeScript()` from `@artisanpack-ui/behavior` in a `<script>` first in `index.html`'s `<head>`. `ThemeScript` only runs once the app mounts, too late. |
| Nuxt                                     | Pass `themeScript()` to `useHead` in `app.vue`. See [Nuxt](nuxt-and-server-rendering.md#nuxt).                                                                                |
| Other server-rendered apps               | Render the `ThemeScript` component first in `<head>`, before any stylesheet.                                                                                                  |
| Laravel with Inertia                     | Put the script in your Blade root view's `<head>`. See [Laravel and Inertia](laravel-inertia.md).                                                                             |

For a Vite single-page app, a small plugin keeps `index.html` in step with the package:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { themeScript } from '@artisanpack-ui/behavior';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'artisanpack-theme-script',
      transformIndexHtml: () => [
        { tag: 'script', children: themeScript(), injectTo: 'head-prepend' },
      ],
    },
  ],
});
```

See [Theming](theming.md) for `ThemeScript`'s props and the [ThemeToggle](components/utility/theme-toggle.md) that stores the choice.

## Register components globally (optional)

Import components where you use them; nothing else is needed. To register some globally under a prefix (`<ApButton>`), install the plugin from `createArtisanPackUI()`. See [The Vue plugin](getting-started.md#the-vue-plugin-optional).

## Laravel and Inertia

For a Laravel app built with Inertia, add the Laravel wrappers and Inertia's Vue adapter:

```bash
npm install @artisanpack-ui/vue-laravel @inertiajs/vue3
```

They add form fields bound to Laravel validation errors, Inertia navigation for menus, breadcrumbs and pagination, app layouts, the signed-in user, and Laravel flash messages as alerts or toasts. See [Laravel and Inertia](laravel-inertia.md) and the [Inertia components](components/inertia.md).

## Upgrading from 1.x

Version 2.0 replaces DaisyUI with `@artisanpack-ui/css` and renames some components and props. A codemod does most of the work. See [Upgrading](upgrading.md).
