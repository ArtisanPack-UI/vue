---
title: Laravel and Inertia
menu_order: 6
---

# Laravel and Inertia

`@artisanpack-ui/vue-laravel` connects the components to a Laravel app running Inertia.js: form fields that show Laravel's validation errors, pagination from a Laravel paginator, a menu that navigates with Inertia links, flash messages and the signed-in user.

## Install

```bash
npm install @artisanpack-ui/vue-laravel @artisanpack-ui/css
```

It depends on `@artisanpack-ui/vue`, and needs `vue` 3.5+ and `@inertiajs/vue3` 2.0+ as peer dependencies. Load the CSS as in [Getting Started](Getting-Started).

## Set up Inertia

Nothing has to be registered: import the components where you use them.

```ts
// resources/js/app.ts
import '@artisanpack-ui/css';
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
    return pages[`./Pages/${name}.vue`];
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el);
  },
});
```

To register the adapter components globally, add `app.use(createArtisanPackUILaravel())`. It registers them with a prefix (`Ap` by default, so `<ApInertiaInput>`), set with the `prefix` option. It registers every component on this page. Pass `flashColorMap` to set the flash toast colors app-wide; see [As toasts](#as-toasts).

The `<head>` of an Inertia app is in the Blade root template, so apply the stored theme choice there: inline the output of `themeScript()` from `@artisanpack-ui/behavior` first in `<head>` of `app.blade.php`. If the app also has Livewire UI Components, its `@apuiThemeScript` directive renders the same script. See [Theming](Theming).

## Share the props

The helpers read `auth.user`, `flash` and `errors` from the shared page props. Share them in `HandleInertiaRequests`:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
            'warning' => fn () => $request->session()->get('warning'),
            'info' => fn () => $request->session()->get('info'),
        ],
    ];
}
```

Inertia shares `errors` itself.

## Forms

### InertiaForm and the field wrappers

`InertiaForm` creates an Inertia form from `data` and submits it to `action` with `method` (`post` by default). The field wrappers inside it show the error for their `name`:

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaInput, InertiaPassword } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm v-slot="{ form }" :data="{ email: '', password: '' }" action="/login">
    <InertiaInput v-model="form.email" name="email" label="Email" type="email" />
    <InertiaPassword v-model="form.password" name="password" label="Password" />
    <Button type="submit" color="primary" :loading="form.processing">Sign in</Button>
  </InertiaForm>
</template>
```

| Prop      | Type                                              | Default  | Description                                               |
| --------- | ------------------------------------------------- | -------- | --------------------------------------------------------- |
| `data`    | `Record<string, unknown>`                         |          | The form's initial data                                   |
| `action`  | `string`                                          |          | The URL to submit to. Without it, submitting does nothing |
| `method`  | `'get' \| 'post' \| 'put' \| 'patch' \| 'delete'` | `'post'` | The HTTP method                                           |
| `options` | `{ resetOnSuccess?: boolean }`                    |          | `resetOnSuccess` defaults to `true`                       |

It emits `success` and `error` after a submission. Its default slot receives `form` (the Inertia form), `getError`, `clearErrors`, `processing`, `recentlySuccessful`, `isDirty` and `submit`, and the same are exposed on a template ref. `processing`, `recentlySuccessful` and `isDirty` arrive as plain booleans, so `:loading="processing"` follows the submission.

| Wrapper             | Wraps              | Binding                            |
| ------------------- | ------------------ | ---------------------------------- |
| `InertiaInput`      | Input              | `v-model`                          |
| `InertiaPassword`   | Password           | `v-model`                          |
| `InertiaTextarea`   | Textarea           | `v-model`                          |
| `InertiaSelect`     | Select             | `v-model`                          |
| `InertiaCheckbox`   | Checkbox           | `v-model` (the checked state)      |
| `InertiaToggle`     | Toggle             | `v-model` (the checked state)      |
| `InertiaRadioGroup` | RadioGroup         | `v-model`                          |
| `InertiaRadio`      | Radio (deprecated) | `v-model`. Use `InertiaRadioGroup` |

Each wrapper takes a required `name` and passes every other prop and attribute to the component it wraps. Its error is, in order: the `error` prop you pass, the enclosing `InertiaForm`'s error for `name`, or `errors[name]` from the page props. So the wrappers also work without `InertiaForm`, with a form you submit yourself.

### useInertiaForm

`useInertiaForm(data, options)` wraps Inertia's `useForm()` for use without `InertiaForm`:

```vue
<script setup lang="ts">
import { Button, Input } from '@artisanpack-ui/vue';
import { useInertiaForm } from '@artisanpack-ui/vue-laravel';

const { form, getError, post, processing } = useInertiaForm({ name: '', email: '' });
</script>

<template>
  <form @submit.prevent="post('/users')">
    <Input v-model="form.name" name="name" label="Name" :error="getError('name')" />
    <Input
      v-model="form.email"
      name="email"
      label="Email"
      type="email"
      :error="getError('email')"
    />
    <Button type="submit" color="primary" :loading="processing">Save</Button>
  </form>
</template>
```

| Returns                                                 | Description                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| `form`                                                  | The Inertia form                                               |
| `errors`, `processing`, `recentlySuccessful`, `isDirty` | Computed refs of the form's state                              |
| `getError(field)`                                       | The field's error, for a component's `error` prop              |
| `submit(method, url, options?)`                         | Submits the form                                               |
| `post`, `put`, `patch`, `destroy`                       | `(url, options?)` shorthands for `submit`                      |
| `reset(...fields)`, `clearErrors(...fields)`            | Reset values or clear errors: the given fields, or all of them |

With `resetOnSuccess` (the default), the form resets after a successful submission, after any `onSuccess` you pass.

## Navigation

### InertiaPagination

Renders [Pagination](https://docs.artisanpackui.dev/documentation/design-system/components/pagination) from a Laravel `LengthAwarePaginator` and visits the chosen page with Inertia:

```vue
<script setup lang="ts">
import type { LaravelPaginator } from '@artisanpack-ui/vue-laravel';
import { InertiaPagination } from '@artisanpack-ui/vue-laravel';

defineProps<{ users: LaravelPaginator<{ id: number; name: string }> }>();
</script>

<template>
  <InertiaPagination :paginator="users" :query-params="{ search: 'ada' }" preserve-scroll />
</template>
```

| Prop             | Type                               | Default | Description                                 |
| ---------------- | ---------------------------------- | ------- | ------------------------------------------- |
| `paginator`      | `LaravelPaginator`                 |         | The paginator from the controller           |
| `siblingCount`   | `number`                           |         | Pages shown on each side of the current one |
| `queryParams`    | `Record<string, string \| number>` |         | Query parameters to keep on every page link |
| `preserveScroll` | `boolean`                          | `false` | Inertia's `preserveScroll`                  |
| `preserveState`  | `boolean`                          | `false` | Inertia's `preserveState`                   |
| `className`      | `string`                           |         | A class for the Pagination root             |

### InertiaMenu

Renders [Menu](https://docs.artisanpackui.dev/documentation/design-system/components/menu) with its links as Inertia `<Link>`s:

```vue
<InertiaMenu
  label="Main"
  :items="[
    { name: 'dashboard', label: 'Dashboard', href: '/dashboard', active: true },
    { name: 'users', label: 'Users', href: '/users', badge: 3 },
    {
      name: 'settings',
      label: 'Settings',
      children: [{ name: 'profile', label: 'Profile', href: '/settings/profile' }],
    },
  ]"
  @select="onSelect"
/>
```

Each item has a `name`, a `label` and optionally `href`, `active`, `disabled`, `badge` and `children` (a sub-menu, open while it holds the active item). The menu takes `label` and `collapsible` (default `true`), and emits `select` with the item's `name`.

### InertiaBreadcrumbs

Renders the design-system [Breadcrumbs](https://docs.artisanpackui.dev/documentation/design-system/components/breadcrumbs) with its links as Inertia `<Link>`s:

```vue
<InertiaBreadcrumbs
  :items="[
    { label: 'Users', href: '/users' },
    { label: 'Ada Lovelace', href: '/users/1' },
    { label: 'Edit' },
  ]"
/>
```

Each item is `{ label, href? }`. The last item is the current page and is never a link. The scoped `item` slot (`{ item, index, isLast }`) replaces an item's text. `className` and every other attribute, including Breadcrumbs' own props (`label`, `maxItems`, `overflowLabel`, `classes`), go to the Breadcrumbs. Like Breadcrumbs, it collapses the middle of a trail longer than `maxItems` (default `4`) behind an overflow button; set `:max-items="0"` to never collapse.

## Flash messages

### FlashAlerts

Renders each flash message in the page props as an [Alert](https://docs.artisanpackui.dev/documentation/design-system/components/alert): `success`, `error`, `warning` and `info` keep their color, and any other key shows as `info`.

```vue
<FlashAlerts />
```

It takes `dismissible` (default `true`) and `className` for the wrapper.

### As toasts

`FlashToasts` shows each flash message as a design-system [Toast](https://docs.artisanpackui.dev/documentation/design-system/components/toast) and renders the `Toaster` that displays them, after its default slot:

```vue
<script setup lang="ts">
import { FlashToasts } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <FlashToasts placement="top-end">
    <slot />
  </FlashToasts>
</template>
```

| Prop       | Type                              | Default | Description                                                                         |
| ---------- | --------------------------------- | ------- | ----------------------------------------------------------------------------------- |
| `colorMap` | `Record<string, FlashToastColor>` |         | Flash key to toast color, merged over the plugin's `flashColorMap` and the defaults |
| `duration` | `number`                          | `5000`  | Milliseconds before each toast dismisses itself. `0` keeps it                       |
| `toaster`  | `ToasterInstance`                 |         | A toaster from `createToaster()`. Defaults to the page's `toast`                    |
| `region`   | `boolean`                         | `true`  | Renders the `Toaster`. Set `:region="false"` when the page already has one          |

Every other attribute, including the Toaster's own props (`placement`, `label`, `closeLabel`), goes to the Toaster.

`useFlashMessages()` is the composable underneath. It takes the same `colorMap`, `duration` and `toaster` options and returns `{ toast }`. Use it when you render the `Toaster` yourself:

```vue
<script setup lang="ts">
import { Toaster } from '@artisanpack-ui/vue';
import { useFlashMessages } from '@artisanpack-ui/vue-laravel';

useFlashMessages({ colorMap: { status: 'success' } });
</script>

<template>
  <slot />
  <Toaster />
</template>
```

Each non-empty flash value becomes one toast when the page loads and after each visit. The colors come from `colorMap`, then the plugin's `flashColorMap` (`app.use(createArtisanPackUILaravel({ flashColorMap: { status: 'success' } }))`), then the defaults: `success`, `error`, `warning` and `info` keep their color, `message` shows as `info`, and any other key shows as `info`. A color is a `FlashToastColor`, any toast color: `primary`, `secondary`, `accent`, `neutral`, `success`, `warning`, `error` or `info`.

## The signed-in user

`useAuth()` reads `auth.user` from the page props:

```vue
<script setup lang="ts">
import { useAuth } from '@artisanpack-ui/vue-laravel';

const { user, isAuthenticated } = useAuth<{
  id: number;
  name: string;
  email: string;
  role: string;
}>();
</script>

<template>
  <p v-if="isAuthenticated">Hello, {{ user?.name }}</p>
</template>
```

It returns `user`, `isAuthenticated` and `isGuest` as computed refs.

## Layouts

`AppLayout`, `AuthLayout` and `GuestLayout` are page shells that set the document title with Inertia's `<Head>` from a `title` prop, and take `className`.

| Layout        | Slots                                                |
| ------------- | ---------------------------------------------------- |
| `AppLayout`   | `header`, default (in `<main>`), `footer`            |
| `AuthLayout`  | `header`, `sidebar`, default (in `<main>`), `footer` |
| `GuestLayout` | `logo`, default, in a centered column                |

Each is a design-system [Stack](https://docs.artisanpackui.dev/documentation/design-system/components/stack) that fills the viewport, with `<main>` taking the free space, so they need only `@artisanpack-ui/css`, not Tailwind. For an application frame with a sidebar, use [AppShell](https://docs.artisanpackui.dev/documentation/design-system/components/app-shell).

## Types

`@artisanpack-ui/vue-laravel` exports types for Laravel's responses and the shared props: `LaravelPaginator`, `LaravelSimplePaginator`, `PaginationLink`, `FlashMessages`, `FlashToastColor`, `AuthUser`, `AuthProps`, `SharedPageProps`, `InertiaFormOptions`, `InertiaFormContext`, `UseFlashMessagesOptions`, `ArtisanPackUILaravelOptions`, `AppLayoutProps`, `AuthLayoutProps` and `GuestLayoutProps`.

```ts
import type { SharedPageProps } from '@artisanpack-ui/vue-laravel';

interface PageProps extends SharedPageProps {
  appName: string;
}
```
