---
title: FAQ
menu_order: 95
meta_description: Short answers to common questions about ArtisanPack UI Vue, from Tailwind and DaisyUI to Nuxt, v-model, global registration and bundle size.
---

# FAQ

## Do I need Tailwind CSS?

No. The components are styled by `@artisanpack-ui/css`, which is plain CSS in cascade layers. If your app uses Tailwind CSS 4, import the design system from your Tailwind stylesheet after the `@layer` line. See [Load the CSS](installation.md#load-the-css).

## Does it still use DaisyUI?

No. Since 2.0 nothing depends on DaisyUI. Remove it if nothing else in your app uses it. See [Upgrading](upgrading.md).

## Where are the props for each component?

On the component's own page under [Components](components.md). Each page lists every prop, slot, event, `v-model` binding and part, with examples and keyboard behavior. The design-system documentation has the same component with live examples and its anatomy; each page links to it.

## Does it work with Nuxt?

Yes. The components render on the server and hydrate in the browser. Load the CSS from `nuxt.config.ts` and add `themeScript()` to the head with `useHead`. See [Nuxt and Server Rendering](nuxt-and-server-rendering.md).

## Do I have to register the components?

No. Import each component where you use it, like any other Vue component. The [Vue plugin](getting-started.md#the-vue-plugin-optional) is only for registering some globally under a prefix (`<ApButton>`), and it registers only the components you pass to it.

## Why doesn't my dialog close when I set `open` without `v-model`?

A component with an open state follows the value you bind with `v-model:open`. Bound one way (`:open="…"`), it reports changes through `update:open` but waits for you to change the value, so it stays where you put it. Use `v-model:open`, or leave `open` unbound and let the component keep its own state. See [v-model](components.md#v-model).

## Do I need `@artisanpack-ui/vue-laravel`?

Only for a Laravel app built with Inertia. It adds form fields bound to validation errors, Inertia navigation, layouts, the signed-in user and flash messages. The components work in any Vue app without it. See [Laravel and Inertia](laravel-inertia.md).

## Can I upgrade from 1.x one page at a time?

No. 1.x and 2.0 can't be mixed in one app, because the new CSS replaces DaisyUI. Upgrade the whole app at once, on a branch. The codemod rewrites most of the changes for you. See [Upgrading](upgrading.md).

## Why doesn't `provideTheme()` change the theme?

`provideTheme()` and `useTheme()` only hold a light, dark or system preference for a component tree. They don't set `data-theme` on `<html>`. Use [ThemeToggle](components/utility/theme-toggle.md), or `applyTheme()` from `@artisanpack-ui/behavior`, to change the theme. See [Composables](composables.md#providetheme-and-usetheme).

## How do I keep the bundle small?

Every component is a named export and the packages are free of side effects, so a tree-shaking bundler keeps only what you import. Category subpaths such as `@artisanpack-ui/vue/form` give the bundler less to read. The AI components are only on `@artisanpack-ui/vue/ai`, so they never reach your bundle unless you import them. See [Bundle Size](bundle-size.md).

## Can I use the behavior without the styles?

Yes. Load `@artisanpack-ui/css/headless` to keep the markup and behavior and write the visual styles yourself. To build your own markup on the same state machines, use the composables in `@artisanpack-ui/behavior/vue`. See [Composables](composables.md).

## How do I change the components' built-in text?

Every built-in string has a prop: the `…Label` props on components such as `ThemeToggle`, `Password` and `Pagination`, and the `labels` prop on the AI components. Each component page lists them.

## Does it look the same as the Livewire and React libraries?

Yes. All three render the same components, with the same props, parts, keyboard behavior and markup, styled by the same CSS, so themes and presets carry across stacks.

## What license is it under?

Both packages are MIT licensed.
