# Theming

ArtisanPack UI for Vue uses DaisyUI themes and a built-in theme provider for light/dark mode management.

## How Theming Works

Components are styled with DaisyUI utility classes, which read color values from the active DaisyUI theme. The active theme is controlled by the `data-theme` attribute on a parent element.

The `provideTheme()` composable manages the current color scheme preference and provides it to the component tree via Vue's dependency injection.

## Setting Up the Theme Provider

Call `provideTheme()` in your root component:

```vue
<!-- App.vue -->
<script setup lang="ts">
import { provideTheme } from '@artisanpack-ui/vue';

const { resolvedColorScheme } = provideTheme();
</script>

<template>
  <div :data-theme="resolvedColorScheme">
    <RouterView />
  </div>
</template>
```

### Default color scheme

Set the default via the plugin:

```ts
app.use(createArtisanPackUI({
  defaultColorScheme: 'dark', // 'light' | 'dark' | 'system'
}));
```

Or override directly:

```ts
provideTheme('dark');
```

Priority order: explicit `provideTheme()` argument > plugin config > `'system'`.

## Consuming the Theme

Any descendant component can read and update the theme:

```vue
<script setup lang="ts">
import { useTheme } from '@artisanpack-ui/vue';

const { colorScheme, resolvedColorScheme, setColorScheme } = useTheme();
</script>

<template>
  <p>Preference: {{ colorScheme }}</p>
  <p>Resolved: {{ resolvedColorScheme }}</p>

  <button @click="setColorScheme('light')">Light</button>
  <button @click="setColorScheme('dark')">Dark</button>
  <button @click="setColorScheme('system')">System</button>
</template>
```

### ThemeToggle component

For a ready-made toggle button:

```vue
<script setup lang="ts">
import { ThemeToggle } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <ThemeToggle />
</template>
```

## DaisyUI Themes

DaisyUI ships with 30+ built-in themes. Enable them in your CSS:

```css
@plugin "daisyui" {
  themes: light, dark, cupcake, dracula;
}
```

To use a specific DaisyUI theme name instead of `light`/`dark`, set the `data-theme` attribute directly:

```html
<div data-theme="cupcake">
  <!-- Components use cupcake colors -->
</div>
```

### Custom themes

Define custom themes using the `@plugin "daisyui/theme"` block following the [DaisyUI theme documentation](https://daisyui.com/docs/themes/):

```css
@plugin "daisyui" {
  themes: light, dark --default;
}

@plugin "daisyui/theme" {
  name: "custom-brand";
  --color-primary: oklch(0.72 0.11 178);
  --color-secondary: oklch(0.65 0.15 280);
  --color-accent: oklch(0.76 0.18 55);
}
```

## Color Variants

Most components accept a `color` prop using DaisyUI color names:

```vue
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="accent">Accent</Button>
<Button color="success">Success</Button>
<Button color="warning">Warning</Button>
<Button color="error">Error</Button>
<Button color="info">Info</Button>
<Button color="ghost">Ghost</Button>
```

The `DaisyColor` type includes: `'primary'`, `'secondary'`, `'accent'`, `'neutral'`, `'info'`, `'success'`, `'warning'`, `'error'`. Some components (like Button) also accept `'ghost'` and `'outline'` as additional color variants beyond the base `DaisyColor` type.

## System Preference Detection

When `colorScheme` is set to `'system'`, the theme provider listens to the `prefers-color-scheme` media query and reactively updates `resolvedColorScheme`. Changes to the OS setting are reflected immediately without a page reload.

## Server-Side Rendering

On the server (SSR), `resolvedColorScheme` defaults to `'light'` since `window.matchMedia` is unavailable. After hydration, it resolves to the actual system preference. To avoid a flash of incorrect theme, consider persisting the user's preference in a cookie and reading it server-side.
