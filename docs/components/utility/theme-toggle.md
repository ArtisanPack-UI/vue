---
title: ThemeToggle
menu_order: 60
meta_description: The Vue ThemeToggle and ThemeScript components. Light, dark, high contrast or system, as a segmented control, icon button or menu, stored without a flash.
---

# ThemeToggle

Lets people choose light, dark, high contrast or system. A choice sets `data-theme` on `<html>`, which the design tokens switch on, is stored in `localStorage`, and follows the operating system live while it's system. It renders a segmented radio group, a single icon button or a menu. Pair it with `ThemeScript` in `<head>` so the stored choice applies before the first paint. For how themes work, see [Theming](../../theming.md).

```ts
import { ThemeScript, ThemeToggle } from '@artisanpack-ui/vue/utility';
// or
import { ThemeScript, ThemeToggle } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ThemeToggle } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <ThemeToggle />
</template>
```

Without `v-model`, the toggle starts on the stored choice, else the one `ThemeScript` applied, else `system`. A pick applies the theme, stores it and emits `update:modelValue`. Every unbound toggle on the page, and in other tabs, follows the choice.

### Variants

| Variant               | What it renders                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `segmented` (default) | A radio group of the choices, on the segmented Tabs track.                                                                |
| `icon`                | One ghost icon button that switches between light and dark.                                                               |
| `menu`                | An outline button showing the current choice's icon, opening a menu of radio items. System comes last, after a separator. |

```vue
<template>
  <ThemeToggle />
  <ThemeToggle variant="icon" />
  <ThemeToggle variant="menu" size="sm" />
</template>
```

### Choices

`choices` limits the choices the segmented control and the menu offer, in the order given. `iconOnly` shows only the segmented control's icons, keeping the names for screen readers.

```vue
<template>
  <ThemeToggle icon-only :choices="['light', 'dark', 'system']" />
</template>
```

### Binding the choice

With `v-model`, the toggle shows only the bound value. A pick only emits `update:modelValue`; the toggle applies and stores a value when the bound value changes to it. It doesn't apply the value it mounts with, since `ThemeScript` already did.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ThemeToggle, type ThemeChoice } from '@artisanpack-ui/vue/utility';

const theme = ref<ThemeChoice>('system');
</script>

<template>
  <ThemeToggle v-model="theme" variant="menu" />
</template>
```

A bound toggle doesn't follow choices made in other tabs. To set the theme from code, call `applyTheme()` from `@artisanpack-ui/behavior`: every unbound toggle follows it, and a bound one keeps showing its value, so update that value too.

### Storage

The choice is stored under the `apui-theme` key. Set `:persist="false"` to skip storage, such as for a preview, and `storage-key` to use another key. Use the same key on `ThemeScript`. When storage is blocked, such as in a private window, the toggle falls back to the default without errors.

### Translating the text

Every label is a prop:

```vue
<template>
  <ThemeToggle
    label="Tema"
    light-label="Claro"
    dark-label="Oscuro"
    high-contrast-label="Alto contraste"
    system-label="Sistema"
  />
</template>
```

### The 2.x theme provider

Under a 2.x `provideTheme()`, the toggle keeps driving the provider: it starts from the provider's `colorScheme`, calls `setColorScheme` on every pick and follows the provider when something else sets it. The provider only knows light, dark and system, so high contrast reaches it as `light`. See [Composables](../../composables.md).

## Props

| Prop                 | Type                                       | Default                               | Description                                                                                                                                                                                |
| -------------------- | ------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `modelValue`         | `ThemeChoice`                              | —                                     | The choice (`v-model`). A pick only emits it, and the toggle applies it once `modelValue` changes to it. Without it, the stored choice, else the one `ThemeScript` applied, else `system`. |
| `variant`            | `'segmented' \| 'icon' \| 'menu'`          | `'segmented'`                         | How the toggle shows the choices. Emitted as `data-variant`.                                                                                                                               |
| `size`               | `'sm' \| 'md'`                             | `'md'`                                | The track's, the button's or the trigger's size. Emitted as `data-size`.                                                                                                                   |
| `choices`            | `ThemeChoice[]`                            | All four                              | The choices segmented and menu offer.                                                                                                                                                      |
| `iconOnly`           | `boolean`                                  | `false`                               | Segmented shows only the icons; the names stay visually hidden.                                                                                                                            |
| `label`              | `string`                                   | `'Theme'`, translated                 | Names the radio group and the menu, and is the menu trigger's text.                                                                                                                        |
| `lightLabel`         | `string`                                   | `'Light'`, translated                 | The light choice's name.                                                                                                                                                                   |
| `darkLabel`          | `string`                                   | `'Dark'`, translated                  | The dark choice's name.                                                                                                                                                                    |
| `highContrastLabel`  | `string`                                   | `'High contrast'`, translated         | The high contrast choice's name.                                                                                                                                                           |
| `systemLabel`        | `string`                                   | `'System'`, translated                | The system choice's name in the segmented control.                                                                                                                                         |
| `matchSystemLabel`   | `string`                                   | `'Match system'`, translated          | The system choice's name in the menu.                                                                                                                                                      |
| `switchToLightLabel` | `string`                                   | `'Switch to light theme'`, translated | The icon button's name while it switches to light.                                                                                                                                         |
| `switchToDarkLabel`  | `string`                                   | `'Switch to dark theme'`, translated  | The icon button's name while it switches to dark.                                                                                                                                          |
| `persist`            | `boolean`                                  | `true`                                | Stores the choice in `localStorage`.                                                                                                                                                       |
| `storageKey`         | `string`                                   | `'apui-theme'`                        | The `localStorage` key. Pass the same one to `ThemeScript`.                                                                                                                                |
| `classes`            | `Partial<Record<ThemeTogglePart, string>>` | —                                     | Extra classes per [part](#parts). `classes.root` merges with `class`.                                                                                                                      |

ThemeToggle sets `inheritAttrs: false` and binds `class`, `style` and every other attribute on the root `<div>`. The root carries `data-value` with the current choice.

## v-model

| Binding   | Type          | Description                                                                                            |
| --------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `v-model` | `ThemeChoice` | The choice: `'light'`, `'dark'`, `'high-contrast'` or `'system'`. Emitted only when a pick changes it. |

## Slots

ThemeToggle has no slots.

## Events

| Event                | Payload              | Description                         |
| -------------------- | -------------------- | ----------------------------------- |
| `@update:modelValue` | `value: ThemeChoice` | The user picked a different choice. |

## Parts

Pass extra classes to a part with `classes`.

| Part      | Element  | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| `root`    | `div`    | The toggle, `.apui-theme-toggle`. Segmented also has `.apui-tabs`.       |
| `list`    | `div`    | Segmented: the `role="radiogroup"` track.                                |
| `option`  | `button` | Segmented: one `role="radio"` choice, with `data-value`.                 |
| `button`  | `button` | Icon: the ghost icon button.                                             |
| `trigger` | `button` | Menu: the outline trigger button.                                        |
| `menu`    | `div`    | Menu: the dropdown panel, `.apui-dropdown-menu`, teleported to `<body>`. |
| `item`    | `div`    | Menu: one radio item.                                                    |

The segmented parts reuse the Tabs markup, so they carry `data-scope="tabs"` with `data-part="list"`, `"trigger"` and `"icon"`.

## ThemeScript

Renders the blocking `<script>` that applies the stored choice to `<html data-theme>` before the first paint, so the page never flashes the wrong theme. It's the same script every stack uses. It also records the choice it applied as `<html data-theme-choice>`, so toggles with nothing stored start on `defaultValue`.

Put it first in `<head>`, before any stylesheet, in a server-rendered app:

```vue
<script setup lang="ts">
import { ThemeScript } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <ThemeScript storage-key="apui-theme" default-value="system" nonce="…" />
</template>
```

In a client-only app, Vue inserts the script only once the app mounts, after the first paint. Inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `index.html`'s `<head>` instead. With Nuxt, pass `themeScript()` to `useHead`; see [Nuxt and Server Rendering](../../nuxt-and-server-rendering.md).

### ThemeScript props

| Prop           | Type          | Default        | Description                                           |
| -------------- | ------------- | -------------- | ----------------------------------------------------- |
| `storageKey`   | `string`      | `'apui-theme'` | The `localStorage` key. The same one the toggles use. |
| `defaultValue` | `ThemeChoice` | `'system'`     | The choice to apply when nothing is stored.           |
| `nonce`        | `string`      | —              | A CSP nonce for the inline script.                    |

ThemeScript has no slots or events.

## Types

```ts
import type {
  Theme,
  ThemeChoice,
  ThemeScriptProps,
  ThemeTogglePart,
  ThemeToggleProps,
  ThemeToggleSize,
  ThemeToggleVariant,
} from '@artisanpack-ui/vue/utility';
```

| Type                 | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `ThemeToggleProps`   | ThemeToggle's props.                                                        |
| `ThemeScriptProps`   | ThemeScript's props.                                                        |
| `Theme`              | `'light' \| 'dark' \| 'high-contrast'`: an applied theme.                   |
| `ThemeChoice`        | `Theme \| 'system'`: what a visitor picks.                                  |
| `ThemeToggleVariant` | `'segmented' \| 'icon' \| 'menu'`                                           |
| `ThemeToggleSize`    | `'sm' \| 'md'`                                                              |
| `ThemeTogglePart`    | `'root' \| 'list' \| 'option' \| 'button' \| 'trigger' \| 'menu' \| 'item'` |

## Accessibility

| Keys                                              | Action                                                                                                                            |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`                                             | Segmented: moves to the checked choice, then out of the group.                                                                    |
| `ArrowRight`, `ArrowLeft`, `ArrowDown`, `ArrowUp` | Segmented: moves to the next or previous choice and applies it, wrapping. `ArrowLeft` and `ArrowRight` follow the text direction. |
| `Home`, `End`                                     | Segmented: moves to the first or last choice and applies it.                                                                      |
| `Enter`, `Space`                                  | Icon: switches the theme. Menu: opens the menu, then applies the focused choice.                                                  |
| `Escape`                                          | Menu: closes it and returns focus to the trigger.                                                                                 |

- Segmented is a `role="radiogroup"` named by `label`, with a `role="radio"` per choice, `aria-checked`, and only the checked one in the Tab order.
- Every radio and menu item keeps its name when only icons show: `iconOnly` keeps it visually hidden.
- The icon button's name says what it does ("Switch to dark theme") and changes with the theme.
- The menu's choices are `menuitemradio` with `aria-checked`, and the trigger shows the current choice's icon.
- The choice is applied before the first paint when `ThemeScript` is in `<head>`, so there's no flash.
- System follows `prefers-color-scheme` live.
- The checked choice is shown by surface and edge, not color alone.

## Related

- [ThemeToggle in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/theme-toggle): anatomy, tokens and live examples.
- [Theming](../../theming.md) for themes, presets and tokens.
- [Swap](swap.md) for your own two-state icon toggle.
- [Nuxt and Server Rendering](../../nuxt-and-server-rendering.md) for the head script with Nuxt.
