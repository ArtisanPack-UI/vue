---
title: Menu
menu_order: 30
meta_description: The Vue Menu component. Navigation lists with icons, badges, titles and collapsible sub-menus, from children or data, with every prop, slot and part.
---

# Menu

A navigation list in a `<nav>` landmark: links with icons and badges, section titles, separators and collapsible sub-menus, with the current page marked. Use it for an app's side navigation or a settings section. Sub-menus follow the disclosure pattern, so Menu isn't an ARIA menu; for a list of actions, use [DropdownMenu](../layout/dropdown-menu.md).

```ts
import { Menu, MenuItem, MenuSeparator, MenuSub, MenuTitle } from '@artisanpack-ui/vue/navigation';
// or
import { Menu, MenuItem, MenuSeparator, MenuSub, MenuTitle } from '@artisanpack-ui/vue';
```

## Usage

Compose a Menu from `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator`:

```vue
<script setup lang="ts">
import { Menu, MenuItem, MenuSeparator, MenuSub, MenuTitle } from '@artisanpack-ui/vue/navigation';
</script>

<template>
  <Menu label="Main">
    <MenuItem href="/dashboard" icon="list">Dashboard</MenuItem>
    <MenuSub label="Properties" icon="settings">
      <MenuItem href="/properties">All properties</MenuItem>
      <MenuItem href="/properties/12" current>Lakeview Lofts</MenuItem>
      <MenuItem href="/properties/drafts" badge="3">Drafts</MenuItem>
    </MenuSub>
    <MenuItem href="/inbox" icon="mail" badge="12">Inbox</MenuItem>
    <MenuTitle>Settings</MenuTitle>
    <MenuItem href="/team" icon="user">Team</MenuItem>
    <MenuSeparator />
    <MenuItem href="/billing" disabled>Billing</MenuItem>
  </Menu>
</template>
```

`MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` must be rendered inside a `Menu`, or they throw.

### Menus from data

Pass the same structure as `items`. An entry with `items` is a sub-menu, `{ type: 'title' }` a section title and `{ type: 'separator' }` a rule. Data entries render before any children.

```vue
<script setup lang="ts">
import { Menu, type MenuItemData } from '@artisanpack-ui/vue/navigation';

const items: MenuItemData[] = [
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: '/account/profile', current: true },
      { label: 'Security', href: '/account/security' },
    ],
  },
  { type: 'separator' },
  { type: 'title', label: 'Billing' },
  { label: 'Invoices', href: '/billing/invoices', icon: 'file-text' },
];
</script>

<template>
  <Menu label="Settings" :items="items" />
</template>
```

Each item and sub-menu is keyed by its `key`, else an item's `href`, else its position. Set `key` when entries can reorder. A sub-menu's `open` in data is its initial state; the sub-menu still toggles.

### Current page

Set `current` on the item for the page being shown. It gets `aria-current="page"`, and a sub-menu holding it opens on its own. When an item inside a closed sub-menu becomes current later, as in a persistent layout, that sub-menu opens and emits `update:open` with `true`.

### Sub-menus

A `MenuSub`'s item is a button that opens and closes its nested list. Bind `v-model:open` to control it, or set `defaultOpen` for its initial state:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Menu, MenuItem, MenuSub } from '@artisanpack-ui/vue/navigation';

const reportsOpen = ref(true);
</script>

<template>
  <Menu label="Main">
    <MenuSub v-model:open="reportsOpen" label="Reports" icon="file-text">
      <MenuItem href="/reports/sales">Sales</MenuItem>
      <MenuItem href="/reports/traffic">Traffic</MenuItem>
    </MenuSub>
  </Menu>
</template>
```

Set `:collapsible="false"` on the Menu to show every sub-menu open, with its item as a plain heading instead of a button.

### Router links

An enabled `MenuItem` with an `href` can render your router's link component in place of the `<a>`. Provide it with `MENU_LINK_KEY` in a wrapper component, and every Menu below it uses it, with the same attributes and parts:

```vue
<script setup lang="ts">
import { provide } from 'vue';
import { Link } from '@inertiajs/vue3';
import { MENU_LINK_KEY } from '@artisanpack-ui/vue/navigation';

provide(MENU_LINK_KEY, Link);
</script>

<template>
  <slot />
</template>
```

The item passes `href`, not `to`, so provide a component that accepts `href`, such as Inertia's `Link`. For Vue Router, provide a small wrapper that renders `RouterLink` with `:to="href"`. With Inertia, `InertiaMenu` from `@artisanpack-ui/vue-laravel` also renders its links as Inertia `Link`s; see [Laravel and Inertia](../../laravel-inertia.md).

## Props

| Prop          | Type                                | Default | Description                                                                                                       |
| ------------- | ----------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `items`       | `MenuItemData[]`                    | —       | The menu as data, rendered before the children.                                                                   |
| `collapsible` | `boolean`                           | `true`  | Sub-menus open and close from their item. Off shows them all, with a heading item. Emitted as `data-collapsible`. |
| `label`       | `string`                            | —       | Names the nav landmark. Set it when the page has more than one.                                                   |
| `classes`     | `Partial<Record<MenuPart, string>>` | —       | Extra classes per [part](#parts), for the Menu and every item in it. `classes.root` merges with `class`.          |

The Menu sets `inheritAttrs: false` and binds `class`, `style` and every other attribute on the root `<nav>`.

## Slots

| Slot      | Description                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| `default` | `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` children, rendered after `items`. |

## Events

Menu has no events. `MenuSub` emits `update:open`; see [MenuSub](#menusub).

## Parts

Pass extra classes to a part with the Menu's `classes`; they apply to that part in every item. Every part except `root` carries a `data-part` attribute you can also target in CSS (`itemText` renders as `data-part="item-text"`).

| Part        | Element                 | Description                                                            |
| ----------- | ----------------------- | ---------------------------------------------------------------------- |
| `root`      | `nav`                   | The landmark, `.apui-menu`.                                            |
| `list`      | `ul`                    | The top-level list.                                                    |
| `item`      | `a`, `button` or `span` | A link, a sub-menu toggle, or a sub-menu heading when not collapsible. |
| `icon`      | `span`                  | An item's icon. `aria-hidden`.                                         |
| `itemText`  | `span`                  | An item's label.                                                       |
| `badge`     | `span`                  | An item's count or status.                                             |
| `chevron`   | `span`                  | A sub-menu toggle's chevron. `aria-hidden` and mirrored in RTL.        |
| `sub`       | `ul`                    | A sub-menu's nested list. `hidden` while closed.                       |
| `title`     | `li`                    | A section title.                                                       |
| `separator` | `li`                    | A rule between items. `aria-hidden`.                                   |

## MenuItem

A link in a Menu. It renders an `<a>` with `href`, or a `<button type="button">` without one. A disabled item renders an `<a>` without `href`, with `aria-disabled="true"` and `tabindex="-1"`.

### MenuItem props

| Prop       | Type               | Default | Description                                                                     |
| ---------- | ------------------ | ------- | ------------------------------------------------------------------------------- |
| `href`     | `string`           | —       | The destination. Unsafe schemes are dropped and the item renders as a button.   |
| `icon`     | `string`           | —       | An icon name from the registry, before the label. The `icon` slot overrides it. |
| `badge`    | `string \| number` | —       | A count or status at the end. Not rendered when empty.                          |
| `current`  | `boolean`          | `false` | Marks the current page with `aria-current="page"`.                              |
| `disabled` | `boolean`          | `false` | Drops the `href` and takes the link out of the Tab order.                       |

MenuItem sets `inheritAttrs: false` and binds `class`, `style` and every other attribute and listener on the link, not the `<li>`.

### MenuItem slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | The label.                     |
| `icon`    | Replaces the icon from `icon`. |

MenuItem has no events of its own. Listeners such as `@click` go to the link.

## MenuSub

A collapsible group of items. Its item is a button with `aria-expanded` and `aria-controls` pointing at its nested list. With the Menu's `collapsible` off, the item is a plain heading and the list always shows.

### MenuSub props

| Prop          | Type               | Default | Description                                                                                                             |
| ------------- | ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`           | —       | Required. The toggle's text.                                                                                            |
| `icon`        | `string`           | —       | An icon name from the registry, before the label.                                                                       |
| `badge`       | `string \| number` | —       | A count or status at the end of the toggle. Only shown when collapsible.                                                |
| `disabled`    | `boolean`          | `false` | Disables the toggle.                                                                                                    |
| `open`        | `boolean`          | —       | Whether it's open (`v-model:open`). Controlled only when it's a boolean; `undefined` leaves the sub-menu its own state. |
| `defaultOpen` | `boolean`          | —       | The initial state when uncontrolled. Without it, the sub-menu starts open when it holds the current page.               |

`class`, `style` and other attributes go to the sub-menu's `<li>`.

### MenuSub slots

| Slot      | Description           |
| --------- | --------------------- |
| `default` | The sub-menu's items. |

### MenuSub events

| Event          | Payload         | Description                                               |
| -------------- | --------------- | --------------------------------------------------------- |
| `@update:open` | `open: boolean` | The toggle was clicked, or an item inside became current. |

When `open` is bound, the sub-menu shows only what it says, so update it from `@update:open` (or use `v-model:open`).

## MenuTitle

A section title between items. Its default slot is the text. It renders an `<li>` with the `title` part, and attributes go to it.

## MenuSeparator

A rule between items, hidden from assistive technology. It renders an empty `<li>` with the `separator` part and takes no props or slots.

## Deprecated types

`MenuItem` is also exported as a type: the 2.x item shape (`name`, `label`, `href`, `active`, `disabled`, `children`), so `import type { MenuItem }` keeps compiling. Use `MenuItemData` for `items` instead. As a value, `MenuItem` is the component. `InertiaMenu` still takes the 2.x shape.

## Types

```ts
import type {
  MenuItemData,
  MenuItemProps,
  MenuLinkData,
  MenuPart,
  MenuProps,
  MenuSeparatorData,
  MenuSubData,
  MenuSubProps,
  MenuTitleData,
} from '@artisanpack-ui/vue/navigation';
import { MENU_LINK_KEY } from '@artisanpack-ui/vue/navigation';
```

| Type                | Description                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `MenuProps`         | The Menu's props.                                                                                               |
| `MenuItemProps`     | MenuItem's props.                                                                                               |
| `MenuSubProps`      | MenuSub's props.                                                                                                |
| `MenuItemData`      | One entry of `items`: `MenuLinkData \| MenuSubData \| MenuTitleData \| MenuSeparatorData`.                      |
| `MenuLinkData`      | A link: `label`, and optionally `type: 'item'`, `key`, `href`, `icon`, `badge`, `current`, `disabled`.          |
| `MenuSubData`       | A sub-menu: `label`, `items`, and optionally `type: 'sub'`, `key`, `icon`, `badge`, `disabled`, `open`.         |
| `MenuTitleData`     | A section title: `{ type: 'title'; label: string }`.                                                            |
| `MenuSeparatorData` | A rule: `{ type: 'separator' }`.                                                                                |
| `MenuPart`          | `'root' \| 'list' \| 'item' \| 'icon' \| 'itemText' \| 'badge' \| 'chevron' \| 'sub' \| 'title' \| 'separator'` |
| `MENU_LINK_KEY`     | `InjectionKey<Component>`. Provide a router link component for the Menu items below it.                         |

## Accessibility

| Keys               | Action                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `Tab`, `Shift+Tab` | Move through the links and sub-menu toggles in order. Items in a closed sub-menu are skipped. |
| `Enter`            | Follows a link, or opens and closes a sub-menu.                                               |
| `Space`            | Opens or closes a sub-menu.                                                                   |

- A `<nav>` landmark. Name it with `label` when the page has more than one.
- The current page's item sets `aria-current="page"` and is shown by surface and color, not color alone.
- A sub-menu's item is a button with `aria-expanded` and `aria-controls` (the disclosure pattern). It isn't an ARIA menu, so the arrow keys aren't used.
- A sub-menu holding the current page renders open.
- Disabled links set `aria-disabled`, lose their `href` and leave the Tab order.
- Titles and badges are text, so screen readers read them in order. Separators are `aria-hidden`.
- The chevron mirrors in right-to-left layouts and is `aria-hidden`; the expanded state carries the meaning.
- Keep nesting to two levels.

## Related

- [Menu in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/menu): anatomy, tokens and live examples.
- [AppShell](../layout/app-shell.md) for the sidebar a Menu usually sits in.
- [DropdownMenu](../layout/dropdown-menu.md) for a menu of actions.
- [Navbar](navbar.md) for primary links in the top bar.
- [Laravel and Inertia](../../laravel-inertia.md) for `InertiaMenu`.
