---
title: AppShell
menu_order: 20
meta_description: The Vue AppShell component. The application frame with a sidebar, header, main landmark and skip link, with every prop, slot, event and part.
---

# AppShell

The application frame. It renders a sidebar and a main column as islands separated by a gutter: a skip link, the sidebar (an `<aside>` with the brand, the navigation and a footer), then the `<main>` landmark with the header and your page content. Use it once, at the top of an app layout. It replaces the deprecated `Sidebar`.

```ts
import { AppShell } from '@artisanpack-ui/vue/layout';
// or
import { AppShell } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { AppShell } from '@artisanpack-ui/vue/layout';
import { Menu, MenuItem } from '@artisanpack-ui/vue/navigation';
</script>

<template>
  <AppShell brand="Apexify" label="Main navigation">
    <template #sidebar>
      <Menu label="Main">
        <MenuItem href="/dashboard" current>Dashboard</MenuItem>
        <MenuItem href="/listings">Listings</MenuItem>
      </Menu>
    </template>
    <h1>Dashboard</h1>
  </AppShell>
</template>
```

Each region takes a plain-text prop or a slot of the same name: `brand`, `sidebar`, `header` and `footer`. The slot wins when both are set. The brand and footer wrappers only render when they have content.

### Collapsible sidebar

`collapsible` adds a button to the sidebar footer that shrinks the sidebar to its icons and back. The shell emits `collapsed-change` with the new state. Pass `collapsed` to set the state from outside; the shell follows the prop whenever it changes.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AppShell } from '@artisanpack-ui/vue/layout';

const collapsed = ref(false);
</script>

<template>
  <AppShell
    brand="Apexify"
    collapsible
    :collapsed="collapsed"
    @collapsed-change="collapsed = $event"
  >
    <template #sidebar><!-- Menu --></template>
    Page content
  </AppShell>
</template>
```

> **Note:** There's no `v-model:collapsed`. Listen to `collapsed-change` and write the value back, as above, when you need to keep the state.

### Width and gutter

`sidebarWidth` sets the expanded sidebar's width and `gutter` the space around and between the islands. Both take any CSS length and set the `--apui-sidebar-width` and `--apui-shell-gutter` custom properties on the root.

```vue
<template>
  <AppShell sidebar-width="18rem" gutter="0.75rem">
    <!-- … -->
  </AppShell>
</template>
```

## Props

| Prop            | Type                                    | Default                              | Description                                                                            |
| --------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `collapsed`     | `boolean`                               | `false`                              | Shrinks the sidebar to its icons. Emitted as `data-collapsed`.                         |
| `collapsible`   | `boolean`                               | `false`                              | Adds the button that collapses and expands the sidebar. Emitted as `data-collapsible`. |
| `sidebarWidth`  | `string`                                | —                                    | The expanded sidebar's width, any CSS length. Sets `--apui-sidebar-width`.             |
| `gutter`        | `string`                                | —                                    | The space around and between the islands. Sets `--apui-shell-gutter`.                  |
| `brand`         | `string`                                | —                                    | The brand at the top of the sidebar. The `brand` slot overrides it.                    |
| `sidebar`       | `string`                                | —                                    | The sidebar's navigation. The `sidebar` slot overrides it, usually with a Menu.        |
| `header`        | `string`                                | —                                    | The top bar of the main column. The `header` slot overrides it, usually with a Navbar. |
| `footer`        | `string`                                | —                                    | The foot of the sidebar. The `footer` slot overrides it.                               |
| `label`         | `string`                                | `'Sidebar'`, translated              | The accessible name of the sidebar's complementary landmark.                           |
| `skipLabel`     | `string`                                | `'Skip to main content'`, translated | The skip link's text.                                                                  |
| `collapseLabel` | `string`                                | `'Collapse sidebar'`, translated     | The collapse button's accessible name.                                                 |
| `classes`       | `Partial<Record<AppShellPart, string>>` | —                                    | Extra classes per [part](#parts). `classes.root` merges with `class`.                  |

`class`, `style` and other attributes go to the root `<div>`. A `style` you pass merges with the width and gutter custom properties.

## Slots

| Slot      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| `default` | The page content, inside the `content` part of `<main>`.                |
| `brand`   | The brand at the top of the sidebar. Replaces `brand`.                  |
| `sidebar` | The sidebar's navigation. Replaces `sidebar`.                           |
| `header`  | The top of the main column. Replaces `header`.                          |
| `footer`  | The foot of the sidebar, before the collapse button. Replaces `footer`. |

## Events

| Event               | Payload   | Description                                                       |
| ------------------- | --------- | ----------------------------------------------------------------- |
| `@collapsed-change` | `boolean` | The collapse button was pressed. Carries the new collapsed state. |

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute (the kebab-case name, such as `skip-link`) you can also target in CSS.

| Part              | Element  | Description                                                      |
| ----------------- | -------- | ---------------------------------------------------------------- |
| `root`            | `div`    | The frame, `.apui-app-shell`.                                    |
| `skipLink`        | `a`      | The skip link to the main landmark. Visible only while focused.  |
| `sidebar`         | `aside`  | The sidebar, named by `label`.                                   |
| `brand`           | `div`    | The brand. Only rendered with content.                           |
| `footer`          | `div`    | The sidebar footer. Rendered with content or when `collapsible`. |
| `collapseTrigger` | `button` | The collapse button. Only rendered when `collapsible`.           |
| `main`            | `main`   | The main landmark, the skip link's target. `tabindex="-1"`.      |
| `content`         | `div`    | The wrapper around the default slot.                             |

## Types

```ts
import type { AppShellPart, AppShellProps } from '@artisanpack-ui/vue/layout';
```

| Type            | Description                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `AppShellProps` | The component's props.                                                                                 |
| `AppShellPart`  | `'root' \| 'skipLink' \| 'sidebar' \| 'brand' \| 'footer' \| 'collapseTrigger' \| 'main' \| 'content'` |

## Accessibility

| Keys             | Action                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `Tab`            | The skip link comes first and shows while focused. `Enter` on it moves focus to the main landmark. |
| `Enter`, `Space` | On the collapse button: collapses or expands the sidebar.                                          |

- The sidebar is an `<aside>` (complementary landmark) named with `label`; the content is a `<main>` landmark.
- A skip link to the main landmark is the first focusable element.
- Mark the current navigation item with `aria-current="page"` (MenuItem's `current` does this).
- The collapse button is `aria-pressed` while collapsed, controls the sidebar, and is named with `collapseLabel`.
- Layout uses logical properties, so the sidebar sits at the inline end in right-to-left layouts. On a narrow viewport the islands stack.
- Keep five to eight top-level navigation items; group the rest under section titles.

## Related

- [AppShell in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/app-shell): anatomy, tokens and live examples.
- [Menu](../navigation/menu.md) for the sidebar navigation.
- [Navbar](../navigation/navbar.md) for the header.
- [PageHeader](page-header.md) for the title row of each page.
- [UserMenu](user-menu.md) for the account menu in the sidebar footer.
