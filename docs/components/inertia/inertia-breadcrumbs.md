---
title: InertiaBreadcrumbs
menu_order: 60
meta_description: The Vue InertiaBreadcrumbs component. The Breadcrumbs trail with its links rendered as Inertia Links, with every prop and slot it forwards.
---

# InertiaBreadcrumbs

[Breadcrumbs](../navigation/breadcrumbs.md) whose links navigate with Inertia. It renders the trail from a list of items, with each level before the current page as an Inertia `<Link>`. Use it at the top of a page to show where it sits in the app.

```ts
import { InertiaBreadcrumbs } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { InertiaBreadcrumbs } from '@artisanpack-ui/vue-laravel';

defineProps<{ user: { id: number; name: string } }>();
</script>

<template>
  <InertiaBreadcrumbs
    :items="[
      { label: 'Users', href: '/users' },
      { label: user.name, href: `/users/${user.id}` },
      { label: 'Edit' },
    ]"
  />
</template>
```

The last item is the current page. It's never a link, even with an `href`, and carries `aria-current="page"`. An earlier item without `href` renders as plain text.

### Long trails

Like Breadcrumbs, it collapses the middle of a trail longer than `maxItems` (default `4`) behind an overflow button. Set `:max-items="0"` to never collapse:

```vue
<template>
  <InertiaBreadcrumbs :items="trail" :max-items="0" />
</template>
```

### Custom item content

The scoped `item` slot replaces each level's text, inside the link or the current page:

```vue
<template>
  <InertiaBreadcrumbs :items="trail">
    <template #item="{ item, isLast }">
      <strong v-if="isLast">{{ item.label }}</strong>
      <template v-else>{{ item.label }}</template>
    </template>
  </InertiaBreadcrumbs>
</template>
```

## Props

| Prop        | Type                                 | Default | Description                                                     |
| ----------- | ------------------------------------ | ------- | --------------------------------------------------------------- |
| `items`     | `{ label: string; href?: string }[]` | —       | Required. The trail, from the section down to the current page. |
| `className` | `string`                             | —       | Extra classes for the Breadcrumbs root.                         |

Each item takes:

| Field   | Type     | Description                                                    |
| ------- | -------- | -------------------------------------------------------------- |
| `label` | `string` | Required. The level's name.                                    |
| `href`  | `string` | The URL the Inertia `<Link>` visits. Ignored on the last item. |

### Forwarded props

`class`, `style` and every other attribute go to [Breadcrumbs](../navigation/breadcrumbs.md#props), including its own props: `label` (the landmark's name), `maxItems`, `overflowLabel` and `classes`. InertiaBreadcrumbs renders the levels itself, so Breadcrumbs' `items` prop and the `icon` and `hideLabel` item fields aren't available.

## Slots

| Slot   | Slot props                                                   | Description                                   |
| ------ | ------------------------------------------------------------ | --------------------------------------------- |
| `item` | `{ item: { label, href? }, index: number, isLast: boolean }` | Replaces a level's text. Defaults to `label`. |

## Events

InertiaBreadcrumbs has no events of its own. Listeners fall through to the Breadcrumbs `<nav>`.

## Parts

InertiaBreadcrumbs renders Breadcrumbs' parts unchanged; each Inertia `<Link>` carries the `link` part. Pass extra classes with `classes`; see [Breadcrumbs parts](../navigation/breadcrumbs.md#parts).

## Types

The item type isn't exported from the package. Breadcrumbs' own `BreadcrumbItem` from `@artisanpack-ui/vue/navigation` has the same `label` and `href` fields.

## Accessibility

| Keys            | Action                                                                                  |
| --------------- | --------------------------------------------------------------------------------------- |
| `Tab`           | Moves through the links and the overflow button. The current page isn't a stop.         |
| `Enter`/`Space` | On the overflow button, reveals the hidden levels and moves focus to the first of them. |

- A `<nav>` landmark named by `label` (default "Breadcrumb", translated), holding an ordered list.
- The current page has `aria-current="page"` and isn't a link.
- Separators are hidden from screen readers and mirror in right-to-left layouts.
- The overflow button names how many levels it hides and sets `aria-expanded`.

## Related

- [Breadcrumbs in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/breadcrumbs): anatomy, tokens and live examples.
- [Breadcrumbs](../navigation/breadcrumbs.md), the component this wraps.
- [InertiaMenu](inertia-menu.md).
