---
title: AuthLayout
menu_order: 20
meta_description: The Vue AuthLayout component. An Inertia page shell for signed-in pages, with a sidebar beside the main content and a header and footer.
---

# AuthLayout

A page shell for signed-in Inertia pages. It renders the `header` slot, then the `sidebar` slot beside the default slot inside `<main>`, then the `footer` slot, on design-system [Stacks](../layout/stack.md) that fill the viewport. With `title`, it sets the document title through Inertia's `<Head>`. Use it for an app's signed-in area when a plain sidebar is enough.

```ts
import { AuthLayout } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { AuthLayout, InertiaMenu } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <AuthLayout title="Users">
    <template #header>
      <header><!-- logo, user menu --></header>
    </template>

    <template #sidebar>
      <aside style="inline-size: 16rem">
        <InertiaMenu
          label="Main"
          :items="[
            { name: 'dashboard', label: 'Dashboard', href: '/dashboard' },
            { name: 'users', label: 'Users', href: '/users', active: true },
          ]"
        />
      </aside>
    </template>

    <h1>Users</h1>
  </AuthLayout>
</template>
```

The sidebar takes the width of its content, and `<main>` takes the rest. Give the sidebar a width yourself. It needs only `@artisanpack-ui/css`, not Tailwind.

Use it as a persistent layout the same way as [AppLayout](app-layout.md#as-a-persistent-layout). For a collapsible sidebar, islands and a mobile drawer, use [AppShell](../layout/app-shell.md) instead.

## Props

| Prop        | Type     | Default | Description                                                                 |
| ----------- | -------- | ------- | --------------------------------------------------------------------------- |
| `title`     | `string` | —       | The document title, set with Inertia's `<Head>`. Nothing is set without it. |
| `className` | `string` | —       | Extra classes for the root Stack.                                           |

`class`, `style` and every other attribute go to the root Stack.

## Slots

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| `header`  | Across the top, such as a Navbar.             |
| `sidebar` | At the inline start, beside the main content. |
| `default` | The page content, inside `<main>`.            |
| `footer`  | Across the bottom.                            |

## Events

AuthLayout has no events.

## Parts

AuthLayout has no parts of its own. The root is a vertical Stack (`.apui-stack`) with `min-block-size: 100vh`; the sidebar and `<main>` sit in a horizontal Stack that grows to fill it.

## Types

```ts
import type { AuthLayoutProps } from '@artisanpack-ui/vue-laravel';
```

| Type              | Description                                     |
| ----------------- | ----------------------------------------------- |
| `AuthLayoutProps` | The component's props: `title` and `className`. |

## Accessibility

- The default slot renders in a `<main>` landmark. Don't add another `<main>` inside it.
- Wrap the sidebar in an `<aside>` or a named `<nav>` so it's a landmark. [InertiaMenu](inertia-menu.md) renders a `<nav>`.
- The sidebar comes before `<main>` in the reading order and sits at the inline start, so it moves to the right in right-to-left layouts.
- The layout doesn't collapse the sidebar on small screens. Hide it or move it into a [Drawer](../layout/drawer.md) yourself, or use AppShell.

## Related

- [Stack in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/stack): the layout primitive it's built on.
- [AppLayout](app-layout.md) and [GuestLayout](guest-layout.md).
- [AppShell](../layout/app-shell.md) for the design-system application frame.
