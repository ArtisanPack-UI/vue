---
title: GuestLayout
menu_order: 50
meta_description: The Vue GuestLayout component. An Inertia page shell for sign-in and registration pages, centering a 28rem column in the viewport.
---

# GuestLayout

A page shell for guest pages such as sign in, registration and password reset. It renders the `logo` slot and the default slot in a column up to 28rem wide, centered in the viewport by a design-system [Stack](../layout/stack.md). With `title`, it sets the document title through Inertia's `<Head>`.

```ts
import { GuestLayout } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button, Card } from '@artisanpack-ui/vue';
import {
  GuestLayout,
  InertiaForm,
  InertiaInput,
  InertiaPassword,
} from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <GuestLayout title="Sign in">
    <template #logo>
      <img src="/logo.svg" alt="Acme" width="120" height="32" />
    </template>

    <main>
      <Card>
        <InertiaForm
          v-slot="{ form, processing }"
          :data="{ email: '', password: '' }"
          action="/login"
          aria-label="Sign in"
        >
          <InertiaInput
            v-model="form.email"
            name="email"
            label="Email"
            type="email"
            autocomplete="username"
          />
          <InertiaPassword v-model="form.password" name="password" label="Password" />
          <Button type="submit" :loading="processing">Sign in</Button>
        </InertiaForm>
      </Card>
    </main>
  </GuestLayout>
</template>
```

The column has no gap between the logo and the content; add spacing in your own markup. It needs only `@artisanpack-ui/css`, not Tailwind.

## Props

| Prop        | Type     | Default | Description                                                                 |
| ----------- | -------- | ------- | --------------------------------------------------------------------------- |
| `title`     | `string` | —       | The document title, set with Inertia's `<Head>`. Nothing is set without it. |
| `className` | `string` | —       | Extra classes for the root Stack.                                           |

`class`, `style` and every other attribute go to the root Stack.

## Slots

| Slot      | Description                                |
| --------- | ------------------------------------------ |
| `logo`    | Above the content, such as the app's logo. |
| `default` | The page content, such as a sign-in form.  |

## Events

GuestLayout has no events.

## Parts

GuestLayout has no parts of its own. The root is a Stack (`.apui-stack`) with `min-block-size: 100vh` that centers an inner Stack up to `28rem` wide.

## Types

```ts
import type { GuestLayoutProps } from '@artisanpack-ui/vue-laravel';
```

| Type               | Description                                     |
| ------------------ | ----------------------------------------------- |
| `GuestLayoutProps` | The component's props: `title` and `className`. |

## Accessibility

- Unlike AppLayout and AuthLayout, GuestLayout renders no `<main>`. Wrap the content in `<main>` yourself, as in the example.
- Give the logo image an `alt` that names the app.
- Give every page a `title`, so the document title names the page.

## Related

- [Stack in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/stack): the layout primitive it's built on.
- [AppLayout](app-layout.md) and [AuthLayout](auth-layout.md).
- [InertiaForm](inertia-form.md) for the sign-in form.
