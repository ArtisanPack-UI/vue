---
title: Laravel and Inertia
menu_order: 55
---

# Laravel and Inertia

`@artisanpack-ui/vue-laravel` connects the components to a Laravel app running Inertia.js: form fields that show Laravel's validation errors, pagination from a Laravel paginator, a menu that navigates with Inertia links, flash messages and the signed-in user. This page covers setup, the composables and the types. Each component has its own page under [Inertia Components](components/inertia.md).

## Install

```bash
npm install @artisanpack-ui/vue-laravel @artisanpack-ui/css
```

It depends on `@artisanpack-ui/vue`, and needs `vue` 3.5+ and `@inertiajs/vue3` 2.0+ as peer dependencies. Load the CSS as in [Getting Started](getting-started.md). Everything is exported from the package root; there are no subpaths.

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

The `<head>` of an Inertia app is in the Blade root template, so apply the stored theme choice there: inline the output of `themeScript()` from `@artisanpack-ui/behavior` first in `<head>` of `app.blade.php`. If the app also has Livewire UI Components, its `@apuiThemeScript` directive renders the same script. See [Theming](theming.md).

### The plugin

```ts
function createArtisanPackUILaravel(options?: ArtisanPackUILaravelOptions): Plugin;
```

The plugin is optional. It registers every component in [Inertia Components](components/inertia.md) globally with a prefix, and provides an app-wide flash color map:

```ts
import { createArtisanPackUILaravel } from '@artisanpack-ui/vue-laravel';

createApp({ render: () => h(App, props) })
  .use(plugin)
  .use(createArtisanPackUILaravel({ prefix: 'Ap', flashColorMap: { status: 'success' } }))
  .mount(el);
```

| Option          | Type                              | Default | Description                                                                                                                                                                                                       |
| --------------- | --------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefix`        | `string`                          | `'Ap'`  | The prefix for the global component names, so `<ApInertiaInput>` and `<ApFlashToasts>`.                                                                                                                           |
| `flashColorMap` | `Record<string, FlashToastColor>` | —       | Flash key to toast color for [`useFlashMessages()`](#useflashmessages) and [FlashToasts](components/inertia/flash-toasts.md) across the app, merged over the defaults. A component's own `colorMap` wins over it. |

It registers `InertiaMenu`, `InertiaBreadcrumbs`, `InertiaPagination`, `InertiaForm`, `InertiaInput`, `InertiaSelect`, `InertiaTextarea`, `InertiaCheckbox`, `InertiaToggle`, `InertiaPassword`, `InertiaRadio`, `InertiaRadioGroup`, `AppLayout`, `AuthLayout`, `GuestLayout`, `FlashAlerts` and `FlashToasts`, each with the prefix.

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

## Components

| Component                                                       | What it does                                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [InertiaForm](components/inertia/inertia-form.md)               | A `<form>` that owns an Inertia form, submits it and gives its errors to the fields. |
| [InertiaInput](components/inertia/inertia-input.md)             | Input with the field's Laravel error.                                                |
| [InertiaPassword](components/inertia/inertia-password.md)       | Password with the field's Laravel error.                                             |
| [InertiaTextarea](components/inertia/inertia-textarea.md)       | Textarea with the field's Laravel error.                                             |
| [InertiaSelect](components/inertia/inertia-select.md)           | Select with the field's Laravel error.                                               |
| [InertiaCheckbox](components/inertia/inertia-checkbox.md)       | Checkbox with the field's Laravel error, bound with a plain `v-model`.               |
| [InertiaToggle](components/inertia/inertia-toggle.md)           | Toggle with the field's Laravel error, bound with a plain `v-model`.                 |
| [InertiaRadioGroup](components/inertia/inertia-radio-group.md)  | RadioGroup with the field's Laravel error.                                           |
| [InertiaRadio](components/inertia/inertia-radio.md)             | Deprecated. Use InertiaRadioGroup.                                                   |
| [InertiaMenu](components/inertia/inertia-menu.md)               | Menu whose links are Inertia `<Link>`s.                                              |
| [InertiaBreadcrumbs](components/inertia/inertia-breadcrumbs.md) | Breadcrumbs whose links are Inertia `<Link>`s.                                       |
| [InertiaPagination](components/inertia/inertia-pagination.md)   | Pagination from a Laravel paginator, visiting pages with Inertia.                    |
| [AppLayout](components/inertia/app-layout.md)                   | Header, main and footer shell.                                                       |
| [AuthLayout](components/inertia/auth-layout.md)                 | Shell with a sidebar beside the main content.                                        |
| [GuestLayout](components/inertia/guest-layout.md)               | Centered column for sign-in pages.                                                   |
| [FlashAlerts](components/inertia/flash-alerts.md)               | Flash messages as inline Alerts.                                                     |
| [FlashToasts](components/inertia/flash-toasts.md)               | Flash messages as toasts, with the Toaster.                                          |

Each field wrapper takes a required `name` and shows, in order, the `error` you pass, the enclosing `InertiaForm`'s error for `name`, or `errors[name]` from the page props. See [How the field wrappers work](components/inertia.md#how-the-field-wrappers-work).

## Composables

### useInertiaForm

```ts
function useInertiaForm<T extends Record<string, unknown>>(
  initialData: T,
  options?: InertiaFormOptions,
): {
  form: InertiaFormInstance<T>; // Inertia's useForm() form; the type isn't exported
  errors: ComputedRef<Partial<Record<keyof T, string>>>;
  processing: ComputedRef<boolean>;
  recentlySuccessful: ComputedRef<boolean>;
  isDirty: ComputedRef<boolean>;
  getError: (field: keyof T | string) => string | undefined;
  clearErrors: (...fields: (keyof T | string)[]) => void;
  reset: (...fields: (keyof T | string)[]) => void;
  submit: (
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    options?: Record<string, unknown>,
  ) => void;
  post: (url: string, options?: Record<string, unknown>) => void;
  put: (url: string, options?: Record<string, unknown>) => void;
  patch: (url: string, options?: Record<string, unknown>) => void;
  destroy: (url: string, options?: Record<string, unknown>) => void;
};
```

Wraps Inertia's `useForm()` for use without [InertiaForm](components/inertia/inertia-form.md), which calls it for you:

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
    <Button type="submit" :loading="processing">Save</Button>
  </form>
</template>
```

| Returns                                                 | Description                                                                                     |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `form`                                                  | The Inertia form from `useForm(initialData)`. Bind fields to it.                                |
| `errors`, `processing`, `recentlySuccessful`, `isDirty` | Computed refs of the form's state.                                                              |
| `getError(field)`                                       | The field's error, for a component's `error` prop.                                              |
| `clearErrors(...fields)`                                | Clears the given fields' errors, or all of them.                                                |
| `reset(...fields)`                                      | Resets the given fields to their initial values, or all of them.                                |
| `submit(method, url, options?)`                         | Submits the form. `options` are Inertia visit options, such as `onSuccess` or `preserveScroll`. |
| `post`, `put`, `patch`, `destroy`                       | `(url, options?)` shorthands for `submit`.                                                      |

`options.resetOnSuccess` defaults to `true`: the form resets after a successful submission, after any `onSuccess` you pass. Set it to `false` on edit forms.

### useFlashMessages

```ts
function useFlashMessages(options?: UseFlashMessagesOptions): { toast: ToasterInstance };
```

Watches the `flash` page prop and shows each non-empty value as a toast with `toast.create()`, when the page loads and after each visit. Render a `Toaster` to display them, or use [FlashToasts](components/inertia/flash-toasts.md), which calls this composable and renders the Toaster for you:

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

| Option     | Type                              | Default | Description                                                                             |
| ---------- | --------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| `colorMap` | `Record<string, FlashToastColor>` | —       | Flash key to toast color, merged over the plugin's `flashColorMap` and the defaults.    |
| `duration` | `number`                          | `5000`  | Milliseconds before each toast dismisses itself. `0` keeps it.                          |
| `toaster`  | `ToasterInstance`                 | —       | A toaster from `createToaster()` to show the toasts in. Defaults to the page's `toast`. |

The colors come from `colorMap`, then the plugin's `flashColorMap`, then the defaults: `success`, `error`, `warning` and `info` keep their color, `message` shows as `info`, and any other key shows as `info`. It returns `{ toast }`, the toaster the messages go to. Call it in a component's `setup`, since it reads the page with `usePage()`.

### useAuth

```ts
function useAuth<T extends AuthUser = AuthUser>(): {
  user: ComputedRef<T | null>;
  isAuthenticated: ComputedRef<boolean>;
  isGuest: ComputedRef<boolean>;
};
```

Reads `auth.user` from the page props:

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

| Returns           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `user`            | The signed-in user, or `null` when there is none. |
| `isAuthenticated` | `true` when there is a signed-in user.            |
| `isGuest`         | `true` when there is no signed-in user.           |

## Types

```ts
import type {
  AppLayoutProps,
  ArtisanPackUILaravelOptions,
  AuthLayoutProps,
  AuthProps,
  AuthUser,
  FlashMessages,
  FlashToastColor,
  GuestLayoutProps,
  InertiaFormContext,
  InertiaFormOptions,
  LaravelCursorPaginator,
  LaravelPaginator,
  LaravelResourcePaginator,
  LaravelSimplePaginator,
  PaginationLink,
  SharedPageProps,
  UseFlashMessagesOptions,
} from '@artisanpack-ui/vue-laravel';
```

| Type                                                    | Description                                                                                                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SharedPageProps`                                       | The shared page props: `auth?: AuthProps`, `flash?: FlashMessages`, `errors?: Record<string, string>`, plus any other key. Extend it for your own. |
| `AuthProps`                                             | `{ user: AuthUser \| null }`, the `auth` prop.                                                                                                     |
| `AuthUser`                                              | `{ id: number; name: string; email: string }`, plus any other key.                                                                                 |
| `FlashMessages`                                         | The `flash` prop: optional `success`, `error`, `warning`, `info` and `message` strings, plus any other string key.                                 |
| `FlashToastColor`                                       | A toast color: `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'`.                                 |
| `UseFlashMessagesOptions`                               | `{ colorMap?, duration?, toaster? }`, the options of [`useFlashMessages`](#useflashmessages) and FlashToasts.                                      |
| `InertiaFormOptions`                                    | `{ resetOnSuccess?: boolean }`, for `useInertiaForm` and InertiaForm's `options`. `resetOnSuccess` defaults to `true`.                             |
| `InertiaFormContext`                                    | What InertiaForm provides under `INERTIA_FORM_KEY`. See [InertiaForm](components/inertia/inertia-form.md#form-context).                            |
| `ArtisanPackUILaravelOptions`                           | `{ prefix?, flashColorMap? }`, the [plugin's](#the-plugin) options.                                                                                |
| `LaravelPaginator<T>`                                   | A `->paginate()` result. See [InertiaPagination](components/inertia/inertia-pagination.md#types) for this and the other paginator types.           |
| `LaravelSimplePaginator<T>`                             | A `->simplePaginate()` result.                                                                                                                     |
| `LaravelCursorPaginator<T>`                             | A `->cursorPaginate()` result.                                                                                                                     |
| `LaravelResourcePaginator<T>`                           | A paginated API resource collection, with the page details under `meta`.                                                                           |
| `PaginationLink`                                        | One entry of a paginator's `links`.                                                                                                                |
| `AppLayoutProps`, `AuthLayoutProps`, `GuestLayoutProps` | The layouts' props: `title?` and `className?`.                                                                                                     |

Extend `SharedPageProps` for your app's own shared props:

```ts
import type { SharedPageProps } from '@artisanpack-ui/vue-laravel';

interface PageProps extends SharedPageProps {
  appName: string;
}
```

The package also exports the value `INERTIA_FORM_KEY`, the injection key for InertiaForm's context. See [InertiaForm](components/inertia/inertia-form.md#inertia_form_key).
