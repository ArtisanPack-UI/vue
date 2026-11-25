---
title: Navbar
menu_order: 40
meta_description: The Vue Navbar component. A top bar or island with a brand, primary links, a search and actions, with every prop, slot and part.
---

# Navbar

The top bar of a page: a brand at the start, primary links or a search, and actions at the end. It renders a `<header>`, with the links in a `<nav>` landmark, as a full-width bar or a rounded island. Use it for a site's or app's main navigation.

```ts
import { Navbar, NavbarItem } from '@artisanpack-ui/vue/navigation';
// or
import { Navbar, NavbarItem } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';
import { Navbar, NavbarItem } from '@artisanpack-ui/vue/navigation';
</script>

<template>
  <Navbar>
    <template #brand><a href="/">Horizon</a></template>
    <NavbarItem href="/properties" current>Properties</NavbarItem>
    <NavbarItem href="/analytics">Analytics</NavbarItem>
    <NavbarItem href="/tools">Tools &amp; calculators</NavbarItem>
    <template #actions>
      <Button variant="ghost" color="neutral" size="sm">Sign in</Button>
      <Button size="sm">Get started</Button>
    </template>
  </Navbar>
</template>
```

Each region renders only when it has content, so a Navbar can be just a brand and actions.

### Links from data

`links` renders the same `NavbarItem`s from data, before any in the default slot:

```vue
<template>
  <Navbar
    brand="Socials"
    :links="[
      { label: 'Feed', href: '/feed', current: true },
      { label: 'Pages', href: '/pages' },
    ]"
  />
</template>
```

### Layout and surface

`layout="island"` renders a rounded bar that floats inside its container. `surface="glass"` gives it a translucent surface, which falls back to an opaque one under reduced transparency and in high contrast.

```vue
<template>
  <Navbar layout="island" surface="glass" brand="Socials">
    <NavbarItem href="/feed" current>Feed</NavbarItem>
    <NavbarItem href="/pages">Pages</NavbarItem>
  </Navbar>
</template>
```

### Sticky

The Navbar sticks to the top of its scrolling container by default. Set `:sticky="false"` to let it scroll away.

### Search

Put a search field in the `search` slot. It sits between the links and the actions.

```vue
<script setup lang="ts">
import { Input } from '@artisanpack-ui/vue/form';
import { Navbar } from '@artisanpack-ui/vue/navigation';
</script>

<template>
  <Navbar brand="Horizon">
    <template #search>
      <Input type="search" placeholder="Search listings" aria-label="Search listings" />
    </template>
  </Navbar>
</template>
```

## Props

| Prop      | Type                                  | Default              | Description                                                                                                                          |
| --------- | ------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `layout`  | `'bar' \| 'island'`                   | `'bar'`              | A full-width bar or a rounded island. Emitted as `data-layout`.                                                                      |
| `surface` | `'default' \| 'glass'`                | `'default'`          | The bar's surface. Glass falls back to an opaque surface under reduced transparency and in high contrast. Emitted as `data-surface`. |
| `sticky`  | `boolean`                             | `true`               | Sticks to the top of the scrolling container. Emitted as `data-sticky`.                                                              |
| `brand`   | `string`                              | —                    | The brand text at the start. The `brand` slot overrides it.                                                                          |
| `links`   | `NavbarLinkData[]`                    | —                    | The primary links as data, rendered before the default slot's `NavbarItem`s.                                                         |
| `search`  | `string`                              | —                    | Text content for the search region. The `search` slot overrides it.                                                                  |
| `actions` | `string`                              | —                    | Text content for the actions region. The `actions` slot overrides it.                                                                |
| `label`   | `string`                              | `'Main'`, translated | Names the links' nav landmark.                                                                                                       |
| `classes` | `Partial<Record<NavbarPart, string>>` | —                    | Extra classes per [part](#parts). `classes.root` merges with `class`.                                                                |

Navbar sets `inheritAttrs: false` and binds `class`, `style` and every other attribute on the root `<header>`.

## Slots

| Slot      | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| `default` | `NavbarItem` links, rendered after `links` inside the nav landmark. |
| `brand`   | The brand, such as a logo link. Replaces `brand`.                   |
| `search`  | A search field. Replaces `search`.                                  |
| `actions` | Buttons and menus at the end. Replaces `actions`.                   |

## Events

Navbar has no events.

## Parts

Pass extra classes to a part with `classes`. Every part except `root` carries a `data-part` attribute you can also target in CSS.

| Part      | Element  | Description                            |
| --------- | -------- | -------------------------------------- |
| `root`    | `header` | The bar, `.apui-navbar`.               |
| `brand`   | `div`    | The brand region.                      |
| `links`   | `nav`    | The links' landmark, named by `label`. |
| `link`    | `a`      | One `NavbarItem`.                      |
| `search`  | `div`    | The search region.                     |
| `actions` | `div`    | The actions region.                    |

## NavbarItem

A primary link in a Navbar, with `aria-current="page"` on the current page. Its default slot is the text.

### NavbarItem props

| Prop      | Type      | Default | Description                                        |
| --------- | --------- | ------- | -------------------------------------------------- |
| `href`    | `string`  | —       | The destination. Unsafe schemes are dropped.       |
| `current` | `boolean` | `false` | Marks the current page with `aria-current="page"`. |

NavbarItem sets `inheritAttrs: false` and binds `class`, `style` and every other attribute and listener on its `<a>`. It takes the `link` part's classes from the parent Navbar.

### NavbarItem slots

| Slot      | Description    |
| --------- | -------------- |
| `default` | The link text. |

NavbarItem has no events of its own.

## Types

```ts
import type {
  NavbarItemProps,
  NavbarLayout,
  NavbarLinkData,
  NavbarPart,
  NavbarProps,
  NavbarSurface,
} from '@artisanpack-ui/vue/navigation';
```

| Type              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `NavbarProps`     | The Navbar's props.                                                         |
| `NavbarItemProps` | NavbarItem's props.                                                         |
| `NavbarLinkData`  | One entry of `links`: `{ label: string; href: string; current?: boolean }`. |
| `NavbarLayout`    | `'bar' \| 'island'`                                                         |
| `NavbarSurface`   | `'default' \| 'glass'`                                                      |
| `NavbarPart`      | `'root' \| 'brand' \| 'links' \| 'link' \| 'search' \| 'actions'`           |

## Accessibility

| Keys               | Action                                                                       |
| ------------------ | ---------------------------------------------------------------------------- |
| `Tab`, `Shift+Tab` | Move through the brand link, the links, the search and the actions in order. |

- A `<header>` element. The links sit in a `<nav>` landmark named with `label`.
- The current page's link sets `aria-current="page"` and is shown by surface, not color alone.
- Name an icon-only action with `aria-label`, and put a notification count in that name too ("Notifications, 3 unread").
- Keep to about six links. On a narrow bar they scroll rather than wrap or hide, so every link stays reachable.
- Glass keeps text at 4.5:1 over any backdrop.
- Links show a focus ring on `:focus-visible`.

## Related

- [Navbar in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/navbar): anatomy, tokens and live examples.
- [AppShell](../layout/app-shell.md) for a full application frame with a sidebar.
- [Menu](menu.md) for side navigation.
- [UserMenu](../layout/user-menu.md) for the account menu in the actions.
