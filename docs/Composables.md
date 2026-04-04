# Composables

ArtisanPack UI for Vue provides two composables for theme management and responsive design.

## useTheme

Provides reactive access to the current color scheme preference and a setter to change it.

### Usage

```vue
<script setup lang="ts">
import { useTheme } from '@artisanpack-ui/vue';

const { colorScheme, resolvedColorScheme, setColorScheme } = useTheme();
</script>
```

### Prerequisites

`useTheme()` must be called within a component tree where `provideTheme()` has been called (typically in `App.vue`). Calling it without a provider throws an error.

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `colorScheme` | `Ref<ColorScheme>` | The current user-selected preference: `'light'`, `'dark'`, or `'system'` |
| `resolvedColorScheme` | `ComputedRef<'light' \| 'dark'>` | The effective mode after evaluating a `'system'` preference. Always `'light'` or `'dark'`. |
| `setColorScheme` | `(scheme: ColorScheme) => void` | Updates the color scheme preference |

### Example

```vue
<template>
  <header :data-theme="resolvedColorScheme">
    <span>Mode: {{ resolvedColorScheme }}</span>
    <button @click="setColorScheme('light')">Light</button>
    <button @click="setColorScheme('dark')">Dark</button>
    <button @click="setColorScheme('system')">System</button>
  </header>
</template>
```

---

## provideTheme

Sets up the theme context for the component tree. Call this in a root-level component.

### Usage

```vue
<script setup lang="ts">
import { provideTheme } from '@artisanpack-ui/vue';

// Uses plugin default or 'system'
const themeDefault = provideTheme();
</script>
```

```vue
<script setup lang="ts">
import { provideTheme } from '@artisanpack-ui/vue';

// Explicit override
const themeDark = provideTheme('dark');
</script>
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `defaultColorScheme` | `ColorScheme` | Plugin default or `'system'` | Initial color scheme preference |

### Return Value

Returns the same `ThemeContextValue` as `useTheme()`.

### Priority

The default color scheme resolves in this order:
1. Explicit argument to `provideTheme()`
2. Plugin-level `defaultColorScheme` from `createArtisanPackUI()`
3. `'system'`

---

## useBreakpoint

Reactive viewport breakpoint detection using Tailwind CSS v4 default breakpoints.

### Usage

```vue
<script setup lang="ts">
import { useBreakpoint } from '@artisanpack-ui/vue';

const { current, isMd, isLg } = useBreakpoint();
</script>
```

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `current` | `Ref<Breakpoint>` | The currently active breakpoint name |
| `isSm` | `Ref<boolean>` | `true` when viewport >= 640px |
| `isMd` | `Ref<boolean>` | `true` when viewport >= 768px |
| `isLg` | `Ref<boolean>` | `true` when viewport >= 1024px |
| `isXl` | `Ref<boolean>` | `true` when viewport >= 1280px |
| `is2xl` | `Ref<boolean>` | `true` when viewport >= 1536px |

### Breakpoint Values

| Name | Min Width |
|------|-----------|
| `xs` | 0px |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### Example

```vue
<template>
  <div>
    <p>Current: {{ current }}</p>
    <SidebarNav v-if="isLg" />
    <MobileNav v-else />
  </div>
</template>
```

### SSR Behavior

On the server, `current` defaults to `'md'`. After hydration, it resolves to the actual viewport breakpoint.
