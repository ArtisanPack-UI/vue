---
title: Breadcrumbs
menu_order: 10
meta_description: The Vue Breadcrumbs component. A trail from data or BreadcrumbsItem children, overflow collapsing and router links, with every prop, slot and part.
---

# Breadcrumbs

Shows where the current page sits in the hierarchy. It renders a `<nav>` landmark holding an ordered list of links, with the current page last and never a link. When the trail is longer than `maxItems`, the middle levels collapse behind an overflow button.

```ts
import { Breadcrumbs, BreadcrumbsItem } from '@artisanpack-ui/vue/navigation';
// or
import { Breadcrumbs, BreadcrumbsItem } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Breadcrumbs } from '@artisanpack-ui/vue/navigation';
</script>

<template>
  <Breadcrumbs
    :items="[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Properties', href: '/properties' },
      { label: 'Lakeview Lofts' },
    ]"
  />
</template>
```

The last level is always the current page. It renders as text with `aria-current="page"`, and its `href` is ignored.

### Composing with BreadcrumbsItem

Instead of `items`, or after them, put `BreadcrumbsItem` children in the default slot. Each one is a level, in order. Its default slot replaces `label`, and other attributes, such as `@click`, land on its link. `v-for` works too.

```vue
<script setup lang="ts">
import { Breadcrumbs, BreadcrumbsItem } from '@artisanpack-ui/vue/navigation';

function openRoot(): void {
  // …
}
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbsItem label="All media" href="/media" @click.prevent="openRoot" />
    <BreadcrumbsItem label="Invoices" />
  </Breadcrumbs>
</template>
```

Levels from `items` come first, then the `BreadcrumbsItem` children. Other children of the default slot are ignored.

### A home icon

`icon` puts an icon from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons) before the label. With `hideLabel`, the label stays for screen readers only, so the icon alone shows.

```vue
<template>
  <Breadcrumbs
    :items="[
      { label: 'Home', href: '/', icon: 'house', hideLabel: true },
      { label: 'Properties', href: '/properties' },
      { label: 'Lakeview Lofts' },
    ]"
  />
</template>
```

### Collapsing long trails

With more levels than `maxItems` (default `4`), the trail shows the first level, an overflow button and the last `maxItems - 2` levels. The button names how many levels it hides. Clicking it reveals them and moves focus to the first revealed link. Set `:max-items="0"` to never collapse.

```vue
<template>
  <Breadcrumbs
    :max-items="3"
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties' },
      { label: 'Lakeview Lofts', href: '/properties/12' },
      { label: 'Analytics', href: '/properties/12/analytics' },
      { label: 'Visitors' },
    ]"
  />
</template>
```

### Router links

The scoped `link` slot replaces the `<a>` of every linked level. Bind `attrs` on your link component so it keeps the `link` part. `href` is the level's checked URL.

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Breadcrumbs, type BreadcrumbItem } from '@artisanpack-ui/vue/navigation';

const trail: BreadcrumbItem[] = [
  { label: 'Properties', href: '/properties' },
  { label: 'Lakeview Lofts' },
];
</script>

<template>
  <Breadcrumbs :items="trail">
    <template #link="{ item, href, attrs }">
      <RouterLink :to="href" v-bind="attrs">{{ item.label }}</RouterLink>
    </template>
  </Breadcrumbs>
</template>
```

With Inertia, use `InertiaBreadcrumbs` from `@artisanpack-ui/vue-laravel`; see [Laravel and Inertia](../../laravel-inertia.md).

## Props

| Prop            | Type                                       | Default                                                                 | Description                                                                                                                               |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `items`         | `BreadcrumbItem[]`                         | `[]`                                                                    | The trail, from the section down to the current page. The last level is the current page. `BreadcrumbsItem` children follow it.           |
| `maxItems`      | `number`                                   | `4`                                                                     | How many entries show before the middle collapses: the first level, the overflow button and the last `maxItems - 2`. `0` never collapses. |
| `label`         | `string`                                   | `'Breadcrumb'`, translated                                              | The nav landmark's accessible name.                                                                                                       |
| `overflowLabel` | `string`                                   | `'Show {count} more level'` or `'Show {count} more levels'`, translated | The overflow button's accessible name. `{count}` is replaced with the number of hidden levels.                                            |
| `classes`       | `Partial<Record<BreadcrumbsPart, string>>` | —                                                                       | Extra classes per [part](#parts), such as `{ link: 'font-medium' }`.                                                                      |

Each `BreadcrumbItem` takes:

| Field       | Type      | Description                                                                                          |
| ----------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `label`     | `string`  | Required. The level's name.                                                                          |
| `href`      | `string`  | Where it links. Ignored on the last level. Unsafe schemes are dropped and the level renders as text. |
| `icon`      | `string`  | An icon name from the registry, before the label.                                                    |
| `hideLabel` | `boolean` | Keeps the label for screen readers only, next to the icon.                                           |

`class`, `style` and every other attribute go to the root `<nav>`.

## Slots

| Slot      | Slot props                                                               | Description                                                                                                              |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `default` | —                                                                        | `BreadcrumbsItem` children, rendered after `items`.                                                                      |
| `link`    | `{ item: BreadcrumbItem; href: string; attrs: Record<string, unknown> }` | Replaces the anchor of each linked level, such as with a router link. Bind `attrs` on it. Not used for the current page. |

## Events

Breadcrumbs has no events. Put listeners such as `@click` on a `BreadcrumbsItem` to have them land on its link.

## Parts

Pass extra classes to a part with `classes`. Every part except `root` carries a `data-part` attribute you can also target in CSS.

| Part        | Element  | Description                                                                                                |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `root`      | `nav`    | The landmark, `.apui-breadcrumbs`.                                                                         |
| `list`      | `ol`     | The ordered list of levels.                                                                                |
| `item`      | `li`     | One level, or the overflow entry. Collapsed levels carry `data-collapsed` and are `hidden` until revealed. |
| `link`      | `a`      | A linked level.                                                                                            |
| `separator` | `span`   | The chevron before every level but the first. `aria-hidden` and mirrored in RTL.                           |
| `current`   | `span`   | The current page, with `aria-current="page"`.                                                              |
| `overflow`  | `button` | The button that reveals the collapsed levels, with `aria-expanded`.                                        |

## BreadcrumbsItem

One composed level of a `Breadcrumbs`, as a direct child. On its own it renders nothing.

### BreadcrumbsItem props

| Prop        | Type      | Default | Description                                       |
| ----------- | --------- | ------- | ------------------------------------------------- |
| `label`     | `string`  | —       | The level's name. The default slot overrides it.  |
| `href`      | `string`  | —       | Where it links. Ignored on the last level.        |
| `icon`      | `string`  | —       | An icon name from the registry, before the label. |
| `hideLabel` | `boolean` | `false` | Keeps the label for screen readers only.          |

Every other attribute and listener, such as `@click` or `data-*`, goes to the level's `<a>`. When you use the parent's `link` slot, these attributes aren't passed to it.

### BreadcrumbsItem slots

| Slot      | Description                          |
| --------- | ------------------------------------ |
| `default` | The level's label. Replaces `label`. |

BreadcrumbsItem has no events of its own.

## Types

```ts
import type {
  BreadcrumbItem,
  BreadcrumbsItemProps,
  BreadcrumbsPart,
  BreadcrumbsProps,
} from '@artisanpack-ui/vue/navigation';
```

| Type                   | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| `BreadcrumbsProps`     | The component's props.                                                           |
| `BreadcrumbsItemProps` | BreadcrumbsItem's props.                                                         |
| `BreadcrumbItem`       | One level in `items`: `label`, `href`, `icon`, `hideLabel`.                      |
| `BreadcrumbsPart`      | `'root' \| 'list' \| 'item' \| 'link' \| 'separator' \| 'current' \| 'overflow'` |

## Accessibility

| Keys              | Action                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------- |
| `Tab`             | Moves through the links and the overflow button. The current page isn't a stop.         |
| `Enter` / `Space` | On the overflow button, reveals the hidden levels and moves focus to the first of them. |

- A `<nav>` landmark named by `label` ("Breadcrumb"), holding an ordered list.
- The current page has `aria-current="page"` and isn't a link.
- Separators are `aria-hidden` and mirror in right-to-left layouts.
- The overflow button names how many levels it hides and sets `aria-expanded`. Revealed levels follow it in reading order.
- A level with `hideLabel` keeps its label as visually hidden text, so an icon-only home link still has a name.
- Links keep a 4.5:1 contrast ratio and show a visible focus ring.

## Related

- [Breadcrumbs in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/breadcrumbs): anatomy, tokens and live examples.
- [Link](link.md) for links in running text.
- [Menu](menu.md) for a navigation list.
- [Laravel and Inertia](../../laravel-inertia.md) for `InertiaBreadcrumbs`.
