---
title: AppLayout
menu_order: 10
meta_description: The Vue AppLayout component. A persistent Inertia page shell with header, main and footer slots that sets the document title.
---

# AppLayout

A page shell for Inertia pages. It stacks the `header` slot, the default slot inside `<main>` and the `footer` slot in a design-system [Stack](../layout/stack.md) that fills the viewport, with `<main>` taking the free space. With `title`, it sets the document title through Inertia's `<Head>`. Use it as a persistent layout for pages without a sidebar.

```ts
import { AppLayout } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Navbar } from '@artisanpack-ui/vue';
import { AppLayout } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <AppLayout title="Dashboard">
    <template #header>
      <Navbar label="Main" />
    </template>

    <h1>Dashboard</h1>

    <template #footer>
      <footer>© Acme</footer>
    </template>
  </AppLayout>
</template>
```

It needs only `@artisanpack-ui/css`, not Tailwind.

### As a persistent layout

Wrap it in your own layout component and set it as the page's Inertia layout, so it isn't recreated on each visit:

```vue
<!-- resources/js/Layouts/Main.vue -->
<script setup lang="ts">
import { AppLayout } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <AppLayout>
    <template #header>
      <!-- navigation -->
    </template>
    <slot />
  </AppLayout>
</template>
```

```vue
<!-- resources/js/Pages/Dashboard.vue -->
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Main from '../Layouts/Main.vue';

defineOptions({ layout: Main });
</script>

<template>
  <Head title="Dashboard" />
  <h1>Dashboard</h1>
</template>
```

In a persistent layout, set the title from each page with Inertia's `<Head>`, since the layout's `title` prop doesn't change between pages.

For an application frame with a collapsible sidebar and islands, use [AppShell](../layout/app-shell.md) instead.

## Props

| Prop        | Type     | Default | Description                                                                 |
| ----------- | -------- | ------- | --------------------------------------------------------------------------- |
| `title`     | `string` | —       | The document title, set with Inertia's `<Head>`. Nothing is set without it. |
| `className` | `string` | —       | Extra classes for the root Stack.                                           |

`class`, `style` and every other attribute go to the root Stack.

## Slots

| Slot      | Description                               |
| --------- | ----------------------------------------- |
| `header`  | Above the main content, such as a Navbar. |
| `default` | The page content, inside `<main>`.        |
| `footer`  | Below the main content.                   |

## Events

AppLayout has no events.

## Parts

AppLayout has no parts of its own. The root is a Stack (`.apui-stack`) with `min-block-size: 100vh`, and `<main>` grows to fill the free space.

## Types

```ts
import type { AppLayoutProps } from '@artisanpack-ui/vue-laravel';
```

| Type             | Description                                     |
| ---------------- | ----------------------------------------------- |
| `AppLayoutProps` | The component's props: `title` and `className`. |

## Accessibility

- The default slot renders in a `<main>` landmark. Don't add another `<main>` inside it.
- Put a `<header>` or a [Navbar](../navigation/navbar.md) in the `header` slot and a `<footer>` in the `footer` slot so they become landmarks too.
- Give every page a `title` (or an Inertia `<Head>`), so the document title names the page.
- Reading order is source order: header, main, footer.

## Related

- [Stack in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/stack): the layout primitive it's built on.
- [AuthLayout](auth-layout.md) for pages with a sidebar, and [GuestLayout](guest-layout.md) for sign-in pages.
- [AppShell](../layout/app-shell.md) for the design-system application frame.
