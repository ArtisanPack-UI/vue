---
title: Composables
menu_order: 5
---

# Composables

`@artisanpack-ui/vue/composables` exports `useBreakpoint`, `provideTheme`, `useTheme` and `ThemeKey`, with their types. All of them are also exported from the package root.

The widget composables behind the components (`useDialog`, `useCombobox`, `useTabs` and the rest) come from `@artisanpack-ui/behavior/vue`. Use them to build your own widgets on the same state machines; see [React and Vue](https://docs.artisanpackui.dev/documentation/design-system/behavior/react-and-vue).

## useBreakpoint

Tracks the viewport width against Tailwind's default breakpoints and updates on resize.

```vue
<script setup lang="ts">
import { useBreakpoint } from '@artisanpack-ui/vue/composables';

const { current, isLg } = useBreakpoint();
</script>

<template>
  <p>Breakpoint: {{ current }}</p>
  <DesktopNav v-if="isLg" />
  <MobileNav v-else />
</template>
```

| Returns   | Type              | Description                                       |
| --------- | ----------------- | ------------------------------------------------- |
| `current` | `Ref<Breakpoint>` | `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'` or `'2xl'` |
| `isSm`    | `Ref<boolean>`    | Width is at least 640px                           |
| `isMd`    | `Ref<boolean>`    | At least 768px                                    |
| `isLg`    | `Ref<boolean>`    | At least 1024px                                   |
| `isXl`    | `Ref<boolean>`    | At least 1280px                                   |
| `is2xl`   | `Ref<boolean>`    | At least 1536px                                   |

On the server there's no viewport, so `current` is `'md'` there.

## provideTheme and useTheme

`provideTheme()` keeps a light, dark or system color-scheme preference for a component tree, follows the operating system's setting while the preference is `'system'`, and shares it with `useTheme()` further down.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { provideTheme } from '@artisanpack-ui/vue/composables';

provideTheme(); // the plugin's defaultColorScheme, else 'system'
</script>
```

```vue
<script setup lang="ts">
import { useTheme } from '@artisanpack-ui/vue/composables';

const { colorScheme, resolvedColorScheme, setColorScheme } = useTheme();
</script>
```

| Returns               | Type                                 | Description                             |
| --------------------- | ------------------------------------ | --------------------------------------- |
| `colorScheme`         | `Ref<'light' \| 'dark' \| 'system'>` | The preference                          |
| `resolvedColorScheme` | `ComputedRef<'light' \| 'dark'>`     | The preference with `'system'` resolved |
| `setColorScheme`      | `(scheme) => void`                   | Changes the preference                  |

`useTheme()` throws when no ancestor called `provideTheme()`. `ThemeKey` is the injection key, for reading the context with `inject` without throwing.

These composables hold state only: they don't set `data-theme` on the page. The theme itself is applied by [ThemeToggle](Theming) (or `applyTheme()` from `@artisanpack-ui/behavior`). When a `ThemeToggle` renders under `provideTheme()`, it starts from the provider's preference and calls `setColorScheme` on every pick, so the two stay in step. The provider only knows light, dark and system, so a high-contrast choice reaches it as `'light'`.
