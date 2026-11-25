---
title: Troubleshooting
menu_order: 99
meta_description: Fixes for unstyled components, theme flashes, hydration mismatches, unresolved subpaths, missing toasts and other common problems.
---

# Troubleshooting

## Components are unstyled

**Cause:** `@artisanpack-ui/css` isn't loaded. The components ship no CSS of their own.

**Fix:** Install `@artisanpack-ui/css` and import it once, in your app's entry, your Tailwind stylesheet or `nuxt.config.ts`. See [Load the CSS](installation.md#load-the-css).

## Tailwind restyles the components, or utilities don't override them

**Cause:** The layer order line is missing, or it comes after `@import 'tailwindcss';`. Without it, Tailwind's Preflight and the design system's layers apply in the wrong order.

**Fix:** Make `@layer theme, base, apui, components, utilities;` the first line of your Tailwind stylesheet, before any `@import`. See [With Tailwind CSS 4](installation.md#with-tailwind-css-4).

## Components look half-styled after upgrading from 1.x

**Cause:** DaisyUI is still loaded alongside the design system.

**Fix:** Remove `@plugin "daisyui";` and any `@plugin "daisyui/theme"` block from your stylesheet, and run `npm uninstall daisyui` if nothing else uses it. Then rebuild. See [Upgrading](upgrading.md).

## The page flashes the light theme before switching to dark

**Cause:** The theme script runs after the first paint. In a client-rendered app, the `ThemeScript` component only runs once the app mounts.

**Fix:** In a Vite single-page app, inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `index.html`'s `<head>`. With Nuxt, pass it to `useHead`. In an Inertia app, put the script in your Blade root view. See [Apply the theme before the first paint](installation.md#apply-the-theme-before-the-first-paint).

## Vue warns about a hydration mismatch

**Cause:** Markup on the server depends on something only the browser knows. `useBreakpoint()` reports `'md'` on the server, and `provideTheme()` resolves `'system'` to `'light'` there, so markup rendered from `current` or `resolvedColorScheme` can differ after hydration.

**Fix:** Use CSS media queries and the `data-theme` attribute for layout and theme differences, or render that markup only after mount. See [What runs only in the browser](nuxt-and-server-rendering.md#what-runs-only-in-the-browser).

## Dialogs, popovers and menus are missing from the server-rendered HTML

**Cause:** Overlays such as Dialog, Drawer, Popover, DropdownMenu and Spotlight teleport their panel to `<body>`. Vue's server renderer collects teleported content separately, in the SSR context's `teleports`, instead of inlining it.

**Fix:** Nuxt handles this for you. In your own server renderer, inject `ctx.teleports['body']` into the page. Or set `:portal="false"` on components that have the prop to render the panel in place.

## TypeScript can't find `@artisanpack-ui/vue/form` or another subpath

**Cause:** Your `moduleResolution` doesn't read the `exports` field of `package.json`.

**Fix:** Set `moduleResolution` to `bundler`, `node16` or `nodenext` in `tsconfig.json`. See [TypeScript](typescript.md).

## Globally registered components have no types in templates

**Cause:** The Vue plugin registers components at runtime, under names you choose, so it can't declare them.

**Fix:** Declare them in `GlobalComponents`. See [Globally registered components](typescript.md#globally-registered-components).

## Tests fail with "Cannot use import statement outside a module"

**Cause:** The packages ship ES modules only, and your test runner loads `node_modules` as CommonJS without transforming it. This is common with Jest.

**Fix:** Use a runner with native ES module support, such as Vitest, or configure Jest to transform the `@artisanpack-ui` packages (for example with `transformIgnorePatterns`).

## Toasts don't appear

**Cause:** No `Toaster` is mounted, or the toast was created on a different toaster from the one the `Toaster` renders. A `Toaster` only starts showing toasts once it has mounted, so toasts created during server rendering are dropped.

**Fix:** Render one `Toaster` near the root of your app. If you made a second toaster with `createToaster()`, pass it to a `Toaster` with the `toaster` prop and create toasts on it. See [Toast](components/feedback/toast.md).

## Toasts appear twice

**Cause:** Two `Toaster` regions render the same toaster. `FlashToasts` from `@artisanpack-ui/vue-laravel` renders its own `Toaster` by default.

**Fix:** Keep one region. If your layout already renders a `Toaster`, pass `:region="false"` to `FlashToasts`. See [FlashToasts](components/inertia/flash-toasts.md).

## Laravel flash messages don't show

**Cause:** The flash messages aren't shared with Inertia as `flash`, or nothing reads them.

**Fix:** Share them from Laravel's `HandleInertiaRequests` middleware as `flash`, and render `FlashToasts` or `FlashAlerts` in your layout, or call `useFlashMessages()` and render a `Toaster` yourself. See [Laravel and Inertia](laravel-inertia.md).

## `useAuth()` always returns a `null` user

**Cause:** The signed-in user isn't shared with Inertia as `auth.user`.

**Fix:** Share the user from `HandleInertiaRequests` as `auth.user`. See [Laravel and Inertia](laravel-inertia.md).

## `useTheme()` throws "must be used within a component tree where provideTheme() has been called"

**Cause:** No ancestor component called `provideTheme()`.

**Fix:** Call `provideTheme()` in `App.vue` or the layout. To read the context without throwing, use `inject(ThemeKey)`. See [Composables](composables.md#providetheme-and-usetheme).

## A dialog, drawer or popover won't open or close

**Cause:** `open` is bound one way (`:open="…"`). The component reports a change through `update:open` and waits for the bound value to change, so it stays where you put it.

**Fix:** Bind it with `v-model:open`, or handle `@update:open` and update the value yourself. See [v-model](components.md#v-model).

## An icon doesn't render

**Cause:** The name passed to `leadingIcon` or another icon prop isn't in the icon registry. In development, the console shows `Unknown icon "<name>". Register it with registerIcons() from @artisanpack-ui/vue.`

**Fix:** Use a name from the [default icon set](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons), add your own with `registerIcons()`, or pass your own SVG in the `icon` slot. See [Icon](components/utility/icon.md).

## A deprecated component warns in the console

**Cause:** The component is a 1.x alias kept so apps keep building. It warns once in development.

**Fix:** Replace it with its 2.0 component, or run the codemod. See [Deprecated components](components/deprecated.md).
