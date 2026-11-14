---
title: Getting Started
menu_order: 2
---

# Getting Started

## Install

```bash
npm install @artisanpack-ui/vue@^2 @artisanpack-ui/css
```

Vue 3.5 or later is a peer dependency. The behavior engine (`@artisanpack-ui/behavior`) and `@zag-js/vue` are installed with the package.

## Load the CSS

Load the CSS once, in your app's entry:

```ts
// main.ts
import '@artisanpack-ui/css';
```

With Tailwind v4, import it from your Tailwind entry stylesheet instead, after declaring the layer order, so Preflight never restyles a component and your utilities still win:

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind';
```

The last line is optional: it adds utilities generated from the tokens, such as `bg-surface-page` and `text-muted`. See [With Tailwind](https://docs.artisanpackui.dev/documentation/design-system/getting-started/tailwind). To bring your own component styles, import `@artisanpack-ui/css/headless` instead; see [Headless](https://docs.artisanpackui.dev/documentation/design-system/theming/headless).

## Apply the theme before the first paint

A stored theme choice (light, dark, high contrast or system) has to be applied before the page paints, or the page flashes the wrong theme.

In a single-page app with a static `index.html`, inline the output of `themeScript()` from `@artisanpack-ui/behavior` in a `<script>` first in `<head>`, before any stylesheet. The `ThemeScript` component doesn't help here: in a client-rendered app it only runs once the app mounts, after the first paint.

`@artisanpack-ui/behavior` is a dependency of `@artisanpack-ui/vue`. If you import from it yourself, add it to your own `package.json` too, so strict package managers such as pnpm resolve it.

With server rendering, render the `ThemeScript` component in `<head>` instead. With Nuxt, pass `themeScript()` to `useHead`. See [Nuxt and Server Rendering](Nuxt-And-Server-Rendering) and [Theming](Theming).

## Your first component

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input } from '@artisanpack-ui/vue';

const email = ref('');
</script>

<template>
  <form>
    <Input v-model="email" label="Email" type="email" name="email" />
    <Button type="submit" color="primary">Sign in</Button>
  </form>
</template>
```

Import components where you use them. Every component is a named export of `@artisanpack-ui/vue` and of one category subpath; see [Components](Components).

## The Vue plugin (optional)

`createArtisanPackUI()` returns a Vue plugin. It does two things, both optional:

- registers the components you pass globally, with a prefix (`Ap` by default), and
- sets the default color scheme for [`provideTheme()`](Composables).

```ts
// main.ts
import { createApp } from 'vue';
import { Button, Card, Input, createArtisanPackUI } from '@artisanpack-ui/vue';
import '@artisanpack-ui/css';
import App from './App.vue';

const app = createApp(App);

app.use(
  createArtisanPackUI({
    components: { Button, Card, Input }, // <ApButton>, <ApCard>, <ApInput>
  }),
);

app.mount('#app');
```

| Option               | Type                            | Default    | Description                                                                |
| -------------------- | ------------------------------- | ---------- | -------------------------------------------------------------------------- |
| `components`         | `Record<string, Component>`     | `{}`       | Components to register globally. Nothing is registered unless you pass it. |
| `prefix`             | `string`                        | `'Ap'`     | Prefix for the registered names.                                           |
| `defaultColorScheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Default for `provideTheme()`.                                              |

Only the components you pass are registered, so the rest still tree-shake. Without global registration you don't need the plugin at all.

## Next steps

- [Components](Components): every component, with links to its full reference.
- [Theming](Theming): the theme toggle, presets and your own brand.
- [Laravel and Inertia](Laravel-Inertia): the Inertia wrappers.
