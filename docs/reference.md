---
title: Reference
menu_order: 85
meta_description: Every function, composable, plugin, injection key and constant exported by @artisanpack-ui/vue and @artisanpack-ui/vue-laravel.
---

# Reference

Everything the two packages export besides the components and their types. Components are on their own pages under [Components](components.md), and the types are described in [TypeScript](typescript.md). Each entry below links to the page that covers it in depth.

## `@artisanpack-ui/vue`

Every export is available from the package root as well as the subpath shown.

### Plugin

| Export                  | Subpath | Description                                                                                                                                                               |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createArtisanPackUI()` | root    | Returns a Vue plugin that registers the components you pass globally and sets the default color scheme. See [The Vue plugin](getting-started.md#the-vue-plugin-optional). |
| `DefaultColorSchemeKey` | root    | The injection key the plugin provides its `defaultColorScheme` under. See [`DefaultColorSchemeKey`](#defaultcolorschemekey).                                              |

### Composables

| Export            | Subpath        | Description                                                                                                                                        |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useBreakpoint()` | `/composables` | Tracks the viewport width against the default breakpoints. See [useBreakpoint](composables.md#usebreakpoint).                                      |
| `provideTheme()`  | `/composables` | Keeps a light, dark or system preference for a component tree. See [provideTheme and useTheme](composables.md#providetheme-and-usetheme).          |
| `useTheme()`      | `/composables` | Reads the preference `provideTheme()` keeps. Throws without a provider. See [provideTheme and useTheme](composables.md#providetheme-and-usetheme). |
| `ThemeKey`        | `/composables` | The injection key `provideTheme()` provides under, for `inject(ThemeKey)` without throwing.                                                        |

### Toasts

| Export                    | Subpath     | Description                                                                                                         |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `toast`                   | `/feedback` | The default toaster: `create()`, `update()`, `dismiss()` and `remove()`. See [Toast](components/feedback/toast.md). |
| `createToaster()`         | `/feedback` | Makes a separate toaster for a second `Toaster` region. See [Toast](components/feedback/toast.md).                  |
| `useToast()`, `TOAST_KEY` | `/feedback` | Deprecated 1.x API for `ToastProvider`. See [Deprecated components](components/deprecated.md).                      |

### Icons

Re-exported from `@artisanpack-ui/behavior/icons`. See [Icon](components/utility/icon.md).

| Export                       | Subpath | Description                                                            |
| ---------------------------- | ------- | ---------------------------------------------------------------------- |
| `registerIcons()`            | root    | Adds or replaces named icons in the registry that the icon props read. |
| `registerDirectionalIcons()` | root    | Marks icon names that mirror in right-to-left text.                    |
| `isSafeIconBody()`           | root    | The check the registry applies to icon markup.                         |
| `UnsafeIconError`            | root    | The error `registerIcons()` throws for markup that fails the check.    |

### Helpers

#### `avatarInitials()`

Up to two letters from a name: the first letters of its first and last words, uppercased. This is what [Avatar](components/display/avatar.md) shows when it has a `name` and no image.

| Parameter | Type                  | Description        |
| --------- | --------------------- | ------------------ |
| `name`    | `string \| undefined` | The person's name. |

**Returns:** `string`, empty when there's no name.

**Since:** 2.0.0

```ts
import { avatarInitials } from '@artisanpack-ui/vue/display';

avatarInitials('Ada Lovelace'); // 'AL'
avatarInitials('Cher'); // 'C'
```

#### `avatarColor()`

The color a name hashes to, the same in every stack, so a person keeps one color across Livewire, React and Vue.

| Parameter | Type                  | Description        |
| --------- | --------------------- | ------------------ |
| `name`    | `string \| undefined` | The person's name. |

**Returns:** `AvatarColor`: one of the hash colors, or `'neutral'` without a name.

**Since:** 2.0.0

```ts
import { avatarColor } from '@artisanpack-ui/vue/display';

const color = avatarColor('Ada Lovelace');
```

#### `paginationRange()`

The page numbers [Pagination](components/navigation/pagination.md) shows between its previous and next buttons: the first and last pages, `siblings` pages around the current one, and `null` for each gap. The number of entries stays the same as the page moves.

| Parameter  | Type     | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `page`     | `number` | The current page, starting at 1.               |
| `count`    | `number` | The number of pages.                           |
| `siblings` | `number` | How many pages to show on each side of `page`. |

**Returns:** `(number | null)[]`, where `null` marks a gap.

**Since:** 2.0.0

```ts
import { paginationRange } from '@artisanpack-ui/vue/navigation';

paginationRange(6, 20, 1); // [1, null, 5, 6, 7, null, 20]
```

### Injection keys

#### `DefaultColorSchemeKey`

The key the [Vue plugin](getting-started.md#the-vue-plugin-optional) provides its `defaultColorScheme` under (`'light'`, `'dark'` or `'system'`). `provideTheme()` reads it when you don't pass a scheme. Provide it yourself to set the default without installing the plugin:

```ts
import { createApp } from 'vue';
import { DefaultColorSchemeKey } from '@artisanpack-ui/vue';
import App from './App.vue';

createApp(App).provide(DefaultColorSchemeKey, 'dark').mount('#app');
```

**Since:** 2.0.0

#### `MENU_LINK_KEY`

A router's link component (Inertia's `Link`, for example) for the [Menu](components/navigation/menu.md) items below it. An enabled item with an `href` renders that component in place of the `<a>`, with the same attributes and parts. The item passes `href`, not `to`, so a link component that needs `to` (such as Vue Router's `RouterLink`) needs a small wrapper. `InertiaMenu` from `@artisanpack-ui/vue-laravel` provides Inertia's `Link` this way. See [Router links](components/navigation/menu.md#router-links).

**Since:** 2.0.0

### AI

The `/ai` subpath exports `createAiApiClient()`, `AiApiError` and `useStreamingText()` alongside the components. See [AI Components](components/ai.md).

## `@artisanpack-ui/vue-laravel`

| Export                         | Description                                                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `createArtisanPackUILaravel()` | The plugin: app-wide options such as `flashColorMap`. See [Laravel and Inertia](laravel-inertia.md).             |
| `useInertiaForm()`             | Inertia's `useForm` with helpers for the Inertia form components. See [Laravel and Inertia](laravel-inertia.md). |
| `useFlashMessages()`           | Shows Laravel flash messages as toasts. See [Laravel and Inertia](laravel-inertia.md).                           |
| `useAuth()`                    | The signed-in user from Inertia's shared `auth` prop. See [Laravel and Inertia](laravel-inertia.md).             |
| `INERTIA_FORM_KEY`             | The injection key `InertiaForm` provides its form under. See [InertiaForm](components/inertia/inertia-form.md).  |

The components are on the [Inertia Components](components/inertia.md) pages.
