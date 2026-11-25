---
title: InertiaMenu
menu_order: 100
meta_description: The Vue InertiaMenu component. The Menu with its links rendered as Inertia Links, built from 2.x-style item data, with nested sub-menus.
---

# InertiaMenu

[Menu](../navigation/menu.md) whose links navigate with Inertia. It renders a Menu from a list of items, where every link is an Inertia `<Link>`, so following it is an Inertia visit instead of a full page load. Use it for an app's side navigation.

```ts
import { InertiaMenu } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { InertiaMenu } from '@artisanpack-ui/vue-laravel';

const page = usePage();

const items = computed(() => [
  { name: 'dashboard', label: 'Dashboard', href: '/dashboard', active: page.url === '/dashboard' },
  {
    name: 'users',
    label: 'Users',
    href: '/users',
    active: page.url.startsWith('/users'),
    badge: 3,
  },
  {
    name: 'settings',
    label: 'Settings',
    children: [
      {
        name: 'profile',
        label: 'Profile',
        href: '/settings/profile',
        active: page.url === '/settings/profile',
      },
      { name: 'billing', label: 'Billing', href: '/settings/billing', disabled: true },
    ],
  },
]);
</script>

<template>
  <InertiaMenu label="Main" :items="items" />
</template>
```

Each item has a `name` and a `label`. An item with `href` is an Inertia link, an item without one is a button, and an item with `children` is a sub-menu.

### Active item and sub-menus

`active: true` marks the current page with `aria-current="page"`. A sub-menu that holds the active item renders open. In a persistent layout, where the menu isn't recreated on each visit, a sub-menu also opens when an item inside it becomes active. Otherwise sub-menus open and close from their toggle; set `:collapsible="false"` to keep every sub-menu open.

### The select event

`select` fires with an item's `name` when it's clicked, for items with or without `href`. It doesn't fire for a disabled item. Inertia's `<Link>` does the navigating, so use `select` for side effects, such as closing a drawer, or for button items:

```vue
<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { InertiaMenu } from '@artisanpack-ui/vue-laravel';

function onSelect(name: string): void {
  if (name === 'logout') {
    router.post('/logout');
  }
}
</script>

<template>
  <InertiaMenu
    label="Account"
    :items="[
      { name: 'profile', label: 'Profile', href: '/profile' },
      { name: 'logout', label: 'Sign out' },
    ]"
    @select="onSelect"
  />
</template>
```

### Composed items

The default slot takes Menu's composed children, such as `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator`, rendered after the items. A `MenuItem` with `href` there is an Inertia `<Link>` too. Composed items don't emit `select`.

```vue
<script setup lang="ts">
import { MenuItem, MenuSeparator, MenuTitle } from '@artisanpack-ui/vue';
import { InertiaMenu } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaMenu
    label="Main"
    :items="[{ name: 'dashboard', label: 'Dashboard', href: '/dashboard' }]"
  >
    <MenuSeparator />
    <MenuTitle>Help</MenuTitle>
    <MenuItem href="/docs" icon="book-open">Documentation</MenuItem>
  </InertiaMenu>
</template>
```

Item data has no `icon`, title or separator. Use composed children for those.

## Props

| Prop          | Type                | Default | Description                                                                          |
| ------------- | ------------------- | ------- | ------------------------------------------------------------------------------------ |
| `items`       | `InertiaMenuItem[]` | `[]`    | The menu items. See [the item shape](#item-shape).                                   |
| `label`       | `string`            | —       | The `<nav>` landmark's accessible name. Set it when the page has more than one nav.  |
| `collapsible` | `boolean`           | `true`  | Sub-menus open and close from their toggle. When `false`, every sub-menu stays open. |

### Item shape

| Field      | Type                | Default | Description                                                            |
| ---------- | ------------------- | ------- | ---------------------------------------------------------------------- |
| `name`     | `string`            | —       | Required. Identifies the item in the `select` event and keys the item. |
| `label`    | `string`            | —       | Required. The item's text.                                             |
| `href`     | `string`            | —       | The URL the Inertia `<Link>` visits. Without it, the item is a button. |
| `active`   | `boolean`           | `false` | Marks the current page.                                                |
| `disabled` | `boolean`           | `false` | Disables the item, or a sub-menu's toggle.                             |
| `badge`    | `string \| number`  | —       | A count or status at the end of the item or sub-menu toggle.           |
| `children` | `InertiaMenuItem[]` | —       | Nested items. The item becomes a sub-menu and its `href` is ignored.   |

### Forwarded props

`class`, `style` and every other attribute go to [Menu](../navigation/menu.md#props), which puts them on the `<nav>`. That includes Menu's `classes` prop for per-part classes. InertiaMenu sets Menu's `items`, `label` and `collapsible` itself.

## Slots

| Slot      | Description                                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| `default` | Composed Menu children, rendered after the items. Links among them use Inertia's `<Link>`. |

## Events

| Event     | Payload        | Description                                                        |
| --------- | -------------- | ------------------------------------------------------------------ |
| `@select` | `name: string` | An item from `items` was clicked. Not emitted for a disabled item. |

## Parts

InertiaMenu renders Menu's parts unchanged. Pass extra classes with `classes`; see [Menu parts](../navigation/menu.md#parts).

## Types

The item type, `InertiaMenuItem`, isn't exported from the package. Type your items inline or with Menu's types from `@artisanpack-ui/vue/navigation`.

## Accessibility

| Keys               | Action                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `Tab`, `Shift+Tab` | Move through the links and sub-menu toggles in order. Items in a closed sub-menu are skipped. |
| `Enter`            | Follows a link; opens or closes a sub-menu.                                                   |
| `Space`            | Opens or closes a sub-menu.                                                                   |

- Renders a `<nav>` landmark. Name it with `label` when the page has more than one.
- The active item sets `aria-current="page"`, shown by surface and color, not color alone.
- A sub-menu's toggle is a button with `aria-expanded` and `aria-controls` (the disclosure pattern), not an ARIA menu, so the arrow keys aren't used.
- Disabled links set `aria-disabled`, lose their link and leave the Tab order.
- Keep nesting to two levels.

## Related

- [Menu in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/menu): anatomy, tokens and live examples.
- [Menu](../navigation/menu.md), the component this wraps.
- [InertiaBreadcrumbs](inertia-breadcrumbs.md) and [AuthLayout](auth-layout.md) for the sidebar it usually sits in.
