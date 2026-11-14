---
title: Theming
menu_order: 4
---

# Theming

Everything visual is a design token, exposed as a `--apui-*` CSS custom property by `@artisanpack-ui/css`. Theme, density and preset are attributes that reassign those tokens, on `<html>` or on any element for everything inside it:

```html
<html data-theme="dark" data-preset="ledger">
  <aside data-theme="light" data-density="compact">…</aside>
</html>
```

Components read tokens and never check the attributes, so theming works the same in Vue as in every other stack. The design-system documentation covers it in full:

- [Theming overview](https://docs.artisanpackui.dev/documentation/design-system/theming): themes, presets, brands, tokens and the visual layer.
- [Themes](https://docs.artisanpackui.dev/documentation/design-system/theming/themes): light, dark and high contrast.
- [Presets](https://docs.artisanpackui.dev/documentation/design-system/theming/presets) and [Brand Presets](https://docs.artisanpackui.dev/documentation/design-system/theming/brand-presets): a whole look from one attribute, or generated from your brand colors.
- [Customizing Tokens](https://docs.artisanpackui.dev/documentation/design-system/theming/customizing-tokens): one token, for the app, a region or a component.
- [Foundations](https://docs.artisanpackui.dev/documentation/design-system/foundations) and [Design Tokens](https://docs.artisanpackui.dev/documentation/design-system/foundations/design-tokens): every token and its role.
- [Headless](https://docs.artisanpackui.dev/documentation/design-system/theming/headless): the same markup and behavior with your own styles.

This page covers the two Vue components for the visitor's theme choice.

## ThemeToggle

`ThemeToggle` lets people choose light, dark, high contrast or system. A choice sets `data-theme` on `<html>`, is stored in `localStorage`, and follows the operating system live while it's `system`.

```vue
<script setup lang="ts">
import { ThemeToggle } from '@artisanpack-ui/vue';
</script>

<template>
  <ThemeToggle />
  <ThemeToggle variant="icon" />
  <ThemeToggle variant="menu" :choices="['light', 'dark', 'system']" />
</template>
```

| Variant               | What it renders                                 |
| --------------------- | ----------------------------------------------- |
| `segmented` (default) | A radio group of the choices                    |
| `icon`                | One button that switches between light and dark |
| `menu`                | A menu button with the choices as radio items   |

Without `v-model`, the toggle starts on the stored choice, else the one `ThemeScript` applied, else `system`. Under `provideTheme()` with nothing stored, the provider's preference comes before `ThemeScript`'s choice, and the toggle applies it after mount. With `v-model`, a pick only emits `update:modelValue`; the toggle applies and stores a value when the bound value changes to it. Set `:persist="false"` to skip storage, and `storage-key` to change the `localStorage` key (use the same key on `ThemeScript`). Every label is a prop, so you can translate them. See [ThemeToggle](https://docs.artisanpackui.dev/documentation/design-system/components/theme-toggle) for all props.

To set the theme from code, use `applyTheme()` from `@artisanpack-ui/behavior`; every unbound toggle on the page follows it. A toggle bound with `v-model` keeps showing its bound value, so update that value too.

## ThemeScript

The stored choice has to be applied before the page paints, or the page flashes the wrong theme. `ThemeScript` renders the blocking `<script>` that does it, the same script every stack uses. Put it first in `<head>`, before any stylesheet, in a server-rendered app:

```vue
<ThemeScript nonce="…" />
```

| Prop           | Description                                          |
| -------------- | ---------------------------------------------------- |
| `storageKey`   | The `localStorage` key; the same one the toggles use |
| `defaultValue` | The choice to apply when nothing is stored           |
| `nonce`        | A CSP nonce for the inline script                    |

In a client-only app with a static `index.html`, `ThemeScript` would run only after the app mounts, too late. Inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `index.html` instead. With Nuxt, pass `themeScript()` to `useHead`; see [Nuxt and Server Rendering](Nuxt-And-Server-Rendering).

## The 1.x theme provider

`provideTheme()` and `useTheme()` still exist for code that reads a light or dark preference; see [Composables](Composables). They don't apply a theme themselves.
