# Laravel Inertia Integration

The `@artisanpack-ui/vue-laravel` package provides Inertia.js adapter wrappers, composables, and layout components for seamless integration with Laravel.

## Installation

```bash
npm install @artisanpack-ui/vue-laravel
```

### Peer dependencies

- `vue` >= 3.5
- `@inertiajs/vue3` >= 2.0
- `@artisanpack-ui/vue` (installed automatically)

## Plugin Setup

Register both the core and Laravel plugins in your `app.ts`:

```ts
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { createArtisanPackUI } from '@artisanpack-ui/vue';
import { createArtisanPackUILaravel } from '@artisanpack-ui/vue-laravel';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
    return pages[`./Pages/${name}.vue`];
  },
  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) });

    app.use(plugin);
    app.use(createArtisanPackUI());
    app.use(createArtisanPackUILaravel());

    app.mount(el);
  },
});
```

### Plugin options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefix` | `string` | `'Ap'` | Prefix for globally registered adapter component names |
| `flashColorMap` | `Record<string, string>` | See below | Declared in the options type but **not yet wired at runtime**. To customize flash-to-color mapping, pass `colorMap` directly to `useFlashMessages()` instead. |

#### Default flash color map (useFlashMessages)

The default mapping used by `useFlashMessages()`:

```ts
{
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  message: 'info',
}
```

## Layout Components

Three layout wrappers are provided for common Laravel page structures:

### AppLayout

Main application layout for authenticated pages:

```vue
<script setup lang="ts">
import { AppLayout } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <AppLayout title="Dashboard">
    <template #header>
      <h1>Dashboard</h1>
    </template>

    <p>Page content</p>
  </AppLayout>
</template>
```

### AuthLayout / GuestLayout

```vue
<script setup lang="ts">
import { GuestLayout } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <GuestLayout title="Login">
    <LoginForm />
  </GuestLayout>
</template>
```

## Form Components

Inertia adapter form components automatically bind to Inertia's form state and display server-side validation errors.

### InertiaForm

Wraps child form fields and provides form context via injection:

```vue
<script setup lang="ts">
import { InertiaForm, InertiaInput, InertiaSelect } from '@artisanpack-ui/vue-laravel';
import { useInertiaForm } from '@artisanpack-ui/vue-laravel';
import { Button } from '@artisanpack-ui/vue';

const { form, processing, post, getError } = useInertiaForm({
  name: '',
  email: '',
  role: '',
});
</script>

<template>
  <InertiaForm @submit.prevent="post('/users')">
    <InertiaInput label="Name" v-model="form.name" :error="getError('name')" />
    <InertiaInput label="Email" type="email" v-model="form.email" :error="getError('email')" />
    <InertiaSelect label="Role" v-model="form.role" :error="getError('role')" :options="roles" />

    <Button type="submit" color="primary" :loading="processing">Save</Button>
  </InertiaForm>
</template>
```

### Available Inertia form components

| Component | Base Component | Description |
|-----------|---------------|-------------|
| `InertiaInput` | `Input` | Text input with Inertia error binding |
| `InertiaSelect` | `Select` | Select dropdown with Inertia error binding |
| `InertiaTextarea` | `Textarea` | Textarea with Inertia error binding |
| `InertiaCheckbox` | `Checkbox` | Checkbox with Inertia error binding |
| `InertiaToggle` | `Toggle` | Toggle switch with Inertia error binding |
| `InertiaPassword` | `Password` | Password input with Inertia error binding |
| `InertiaRadio` | `Radio` | Radio group with Inertia error binding |

All Inertia form components accept the same props as their base counterparts plus automatic `error` mapping from Inertia's form state.

## Navigation Components

### InertiaPagination

Renders pagination from a Laravel paginator response using Inertia links:

```vue
<script setup lang="ts">
import { InertiaPagination } from '@artisanpack-ui/vue-laravel';

defineProps<{ users: LaravelPaginator<User> }>();
</script>

<template>
  <InertiaPagination :paginator="users" />
</template>
```

### InertiaBreadcrumbs

Renders breadcrumbs using Inertia's `<Link>` for client-side navigation:

```vue
<script setup lang="ts">
import { InertiaBreadcrumbs } from '@artisanpack-ui/vue-laravel';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Users', href: '/users' },
  { label: 'Edit' },
];
</script>

<template>
  <InertiaBreadcrumbs :items="items" />
</template>
```

### InertiaMenu

Menu component with Inertia links:

```vue
<script setup lang="ts">
import { InertiaMenu } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaMenu :items="menuItems" />
</template>
```

## Composables

### useInertiaForm

Wraps Inertia's `useForm()` with helpers for ArtisanPack UI error display. Accepts a generic type parameter `<T>` matching the form data shape:

```ts
import { useInertiaForm } from '@artisanpack-ui/vue-laravel';

const { form, errors, processing, recentlySuccessful, isDirty, getError, post, put, patch, destroy, reset, clearErrors } = useInertiaForm<{
  name: string;
  email: string;
}>({
  name: '',
  email: '',
});
```

| Return Value | Type | Description |
|-------------|------|-------------|
| `form` | Inertia form object | The raw Inertia `useForm()` return value |
| `errors` | `ComputedRef<Record<string, string>>` | Reactive error map |
| `processing` | `ComputedRef<boolean>` | Whether the form is submitting |
| `recentlySuccessful` | `ComputedRef<boolean>` | True briefly after successful submission |
| `isDirty` | `ComputedRef<boolean>` | Whether form data has changed |
| `getError(field)` | `(field: string) => string \| undefined` | Get error for a specific field |
| `post(url)` | `(url: string, options?) => void` | Submit via POST |
| `put(url)` | `(url: string, options?) => void` | Submit via PUT |
| `patch(url)` | `(url: string, options?) => void` | Submit via PATCH |
| `destroy(url)` | `(url: string, options?) => void` | Submit via DELETE |
| `reset(...fields)` | `(...fields: string[]) => void` | Reset form data |
| `clearErrors(...fields)` | `(...fields: string[]) => void` | Clear validation errors |

Options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `resetOnSuccess` | `boolean` | `true` | Auto-reset form after successful submission |

### useFlashMessages

Watches Inertia page props for flash messages and triggers toasts:

```vue
<script setup lang="ts">
import { useFlashMessages } from '@artisanpack-ui/vue-laravel';

// Must be inside a ToastProvider
useFlashMessages();
</script>
```

Flash keys (`success`, `error`, `warning`, `info`, `message`) are mapped to toast colors automatically.

Options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colorMap` | `Record<string, ToastColor>` | `{ success, error, warning, info, message }` | Custom flash-to-color mapping |
| `duration` | `number` | `5000` | Toast duration in milliseconds |

### useAuth

Access the authenticated user from Inertia shared props:

```vue
<script setup lang="ts">
import { useAuth } from '@artisanpack-ui/vue-laravel';

const { user, isAuthenticated, isGuest } = useAuth();
</script>

<template>
  <p v-if="isAuthenticated">Hello, {{ user?.name }}</p>
  <p v-else>Please sign in.</p>
</template>
```

| Return Value | Type | Description |
|-------------|------|-------------|
| `user` | `ComputedRef<AuthUser \| null>` | The authenticated user or `null` |
| `isAuthenticated` | `ComputedRef<boolean>` | `true` when logged in |
| `isGuest` | `ComputedRef<boolean>` | `true` when not logged in |

Extend the `AuthUser` type for your application:

```ts
interface AppUser extends AuthUser {
  avatar_url: string;
  role: 'admin' | 'user';
}

const { user } = useAuth<AppUser>();
```

## Feedback Components

### FlashAlerts

Renders flash messages as inline Alert components:

```vue
<script setup lang="ts">
import { FlashAlerts } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <FlashAlerts />
</template>
```

### FlashToasts

Renders flash messages as toast notifications (requires `ToastProvider`):

```vue
<script setup lang="ts">
import { FlashToasts } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <FlashToasts />
</template>
```

## TypeScript Types

Import Laravel-specific types for type-safe page props:

```ts
import type {
  LaravelPaginator,
  LaravelSimplePaginator,
  PaginationLink,
  FlashMessages,
  AuthUser,
  AuthProps,
  SharedPageProps,
} from '@artisanpack-ui/vue-laravel';

// ToastColor is exported from the core package
import type { ToastColor } from '@artisanpack-ui/vue';
```

### Extending SharedPageProps

```ts
interface MyPageProps extends SharedPageProps {
  appName: string;
  permissions: string[];
}
```

## Laravel Backend Setup

### HandleInertiaRequests middleware

Share auth and flash data:

```php
// app/Http/Middleware/HandleInertiaRequests.php
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

### Flash messages from controllers

```php
return redirect()->route('users.index')->with('success', 'User created.');
```
