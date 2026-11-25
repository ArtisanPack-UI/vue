---
title: UserMenu
menu_order: 170
meta_description: The Vue UserMenu component. The account menu with identity, workspace switcher, theme control, your items and Log out.
---

# UserMenu

The account menu. Its trigger shows the signed-in person's avatar, name and role, and its menu holds their identity, a workspace switcher, a theme control, your own items and Log out, last. It's built from [Avatar](../display/avatar.md) and [DropdownMenu](dropdown-menu.md) and behaves like a DropdownMenu. Use it in the sidebar footer of an [AppShell](app-shell.md) or at the end of a navbar.

```ts
import { UserMenu } from '@artisanpack-ui/vue/layout';
// or
import { UserMenu } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { UserMenu, type UserMenuTheme } from '@artisanpack-ui/vue/layout';

const user = {
  name: 'Olivia Rhye',
  email: 'olivia@company.com',
  role: 'Admin · Apexify',
  status: 'online' as const,
};
const workspaces = [
  { id: 'apexify', name: 'Apexify' },
  { id: 'horizon', name: 'Horizon Homes' },
];
const items = [
  { value: 'profile', label: 'Profile', icon: 'user' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
];

const workspace = ref('apexify');
const theme = ref<UserMenuTheme>('system');

function onSelect(value: string): void {
  if (value === 'logout') {
    // sign out
  }
}
</script>

<template>
  <UserMenu
    :user="user"
    :workspaces="workspaces"
    :workspace="workspace"
    :theme="theme"
    :items="items"
    @workspace-change="workspace = $event"
    @theme-change="theme = $event"
    @select="onSelect"
  />
</template>
```

The menu is laid out in a fixed order: the header with the avatar, name and email; the workspace group; your `items`, then your default slot children; the theme control; and Log out, after a separator. Choosing Log out or one of your action items emits `select` with its value. Log out's value is `'logout'`.

### Workspaces

Pass two or more `workspaces` to render a Workspace group of radio items; `workspace` is the current one's id. With fewer than two, the group is left out. Choosing a workspace emits `workspace-change` with its id. The checked workspace stays yours to set.

### Theme

The theme control offers Light, Dark and System as radio items with icons; `theme` is the checked one. Choosing one emits `theme-change`. UserMenu doesn't apply the theme itself; set the `theme` prop and apply the choice yourself (see [Theming](../../theming.md)). `hide-theme` leaves the control out.

### Your own items

Add items with `items` (DropdownMenu entries as data), or as `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator` children in the default slot. Both go between the workspace group and the theme control.

```vue
<script setup lang="ts">
import { DropdownMenuItem, UserMenu } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <UserMenu :user="user" @select="onSelect">
    <DropdownMenuItem value="billing" icon="credit-card">Billing</DropdownMenuItem>
  </UserMenu>
</template>
```

> **Note:** Values that start with `workspace:` or `theme:`, and the value `logout`, are taken by the built-in items. Give your items other values.

### Compact trigger

`compact` shows only the avatar in the trigger. The person's name stays its accessible name.

```vue
<template>
  <UserMenu :user="user" compact align="end" hide-theme />
</template>
```

To replace the trigger's content entirely, use the `trigger` slot.

## Props

| Prop             | Type                                     | Default                                                          | Description                                                                                                             |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `user`           | `UserMenuUser`                           | —                                                                | Required. Who is signed in: `{ name, email?, avatar?, role?, status? }`.                                                |
| `workspaces`     | `UserMenuWorkspace[]`                    | `[]`                                                             | Workspaces to switch between. Two or more render a Workspace group.                                                     |
| `workspace`      | `string`                                 | —                                                                | The current workspace's id.                                                                                             |
| `hideTheme`      | `boolean`                                | `false`                                                          | Hides the theme control.                                                                                                |
| `theme`          | `'light' \| 'dark' \| 'system'`          | `'system'`                                                       | The checked theme option.                                                                                               |
| `items`          | `DropdownMenuEntry[]`                    | —                                                                | Items between the workspace group and the theme control, as DropdownMenu entries.                                       |
| `compact`        | `boolean`                                | `false`                                                          | Shows only the avatar in the trigger. The name stays its accessible name. Emitted as `data-avatar-only` on the trigger. |
| `open`           | `boolean`                                | `false`                                                          | Whether the menu is open. Passing it makes the menu controlled. Bind with `v-model:open`.                               |
| `align`          | `'start' \| 'center' \| 'end'`           | `'start'`                                                        | The menu edge that lines up with the trigger's. Emitted as `data-align`.                                                |
| `surface`        | `'overlay' \| 'glass'`                   | `'overlay'`                                                      | The menu's surface. Emitted as `data-surface`.                                                                          |
| `portal`         | `boolean`                                | `true`                                                           | Teleports the menu to the end of `<body>`. Off renders it in place.                                                     |
| `workspaceLabel` | `string`                                 | `'Workspace'`, translated                                        | The workspace group's label.                                                                                            |
| `themeLabel`     | `string`                                 | `'Theme'`, translated                                            | The theme group's label.                                                                                                |
| `themeLabels`    | `Partial<Record<UserMenuTheme, string>>` | `{ light: 'Light', dark: 'Dark', system: 'System' }`, translated | The theme options' names. Missing keys keep their defaults.                                                             |
| `logoutLabel`    | `string`                                 | `'Log out'`, translated                                          | The last item's label.                                                                                                  |
| `classes`        | `Partial<Record<UserMenuPart, string>>`  | —                                                                | Extra classes per [part](#parts), DropdownMenu parts included.                                                          |

UserMenu doesn't inherit attributes onto a wrapper. `class`, `style` and every other attribute go to the menu panel (`.apui-dropdown-menu.apui-user-menu`), not the trigger.

## v-model

| Binding        | Type      | Carries                   |
| -------------- | --------- | ------------------------- |
| `v-model:open` | `boolean` | Whether the menu is open. |

When you pass `open`, the menu is controlled: it reports changes through `update:open` and shows only what the prop says. Without it, the menu keeps its own state.

## Slots

| Slot      | Description                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- |
| `default` | `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator` children, after `items`. |
| `trigger` | Replaces the trigger's content (the avatar, name, role and indicator).                       |

## Events

| Event               | Payload         | Description                                             |
| ------------------- | --------------- | ------------------------------------------------------- |
| `@update:open`      | `boolean`       | The menu opened or closed itself.                       |
| `@select`           | `string`        | An action item was chosen: one of yours, or `'logout'`. |
| `@workspace-change` | `string`        | A workspace was chosen. Carries its id.                 |
| `@theme-change`     | `UserMenuTheme` | A theme option was chosen.                              |

UserMenu doesn't emit `checked-change`. A checkbox or radio item you add as a child reports through its own `@checked-change` listener; one added through `items` can't be observed, so add option items as children.

## Parts

Pass extra classes to a part with `classes`. The trigger, header, identity and theme parts are scoped `user-menu`; the items, groups and separators keep the `dropdown-menu` scope.

| Part                                                                                                | Element  | Description                                                          |
| --------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `trigger`                                                                                           | `button` | The trigger.                                                         |
| `avatar`                                                                                            | Avatar   | The avatar in the trigger and the header.                            |
| `identity`                                                                                          | `span`   | The name and role (trigger) or name and email (header).              |
| `name`                                                                                              | `span`   | The person's name.                                                   |
| `role`                                                                                              | `span`   | The role under the name in the trigger.                              |
| `indicator`                                                                                         | `span`   | The up-down chevron in the trigger. `aria-hidden`.                   |
| `positioner`                                                                                        | `div`    | Positions the menu next to the trigger.                              |
| `root`                                                                                              | `div`    | The menu panel, `.apui-dropdown-menu.apui-user-menu`, `role="menu"`. |
| `header`                                                                                            | `div`    | The avatar, name and email at the top of the menu.                   |
| `email`                                                                                             | `span`   | The email in the header.                                             |
| `theme`                                                                                             | `div`    | The theme control.                                                   |
| `themeOptions`                                                                                      | `div`    | The row of theme options. Carries `data-part="theme-options"`.       |
| `itemGroup`, `itemGroupLabel`, `item`, `icon`, `itemText`, `shortcut`, `itemIndicator`, `separator` | —        | The menu's items, as on [DropdownMenu](dropdown-menu.md#parts).      |

## Types

```ts
import type {
  UserMenuPart,
  UserMenuProps,
  UserMenuTheme,
  UserMenuUser,
  UserMenuWorkspace,
} from '@artisanpack-ui/vue/layout';
```

| Type                | Description                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `UserMenuProps`     | The component's props.                                                                                                                       |
| `UserMenuUser`      | `{ name: string, email?: string, avatar?: string, role?: string, status?: 'online' \| 'away' \| 'offline' }`                                 |
| `UserMenuWorkspace` | `{ id: string, name: string }`                                                                                                               |
| `UserMenuTheme`     | `'light' \| 'dark' \| 'system'`                                                                                                              |
| `UserMenuPart`      | The DropdownMenu parts plus `'avatar' \| 'identity' \| 'name' \| 'role' \| 'indicator' \| 'header' \| 'email' \| 'theme' \| 'themeOptions'`. |

## Accessibility

| Keys                          | Action                                                             |
| ----------------------------- | ------------------------------------------------------------------ |
| `Enter`, `Space`, `ArrowDown` | On the trigger, opens the menu on the first item.                  |
| `ArrowDown`, `ArrowUp`        | Moves through the items, the workspace and theme options included. |
| `Enter`, `Space`              | Chooses the item; a workspace or theme option is checked.          |
| `Escape`                      | Closes the menu and returns focus to the trigger.                  |

- The trigger is a `<button>` with `aria-haspopup="menu"` and `aria-expanded`. Its accessible name is the person's name, also when `compact`.
- Workspace and theme options are `menuitemradio` items in labelled groups, with `aria-checked`.
- The theme options show icons; their names stay in the accessibility tree.
- Log out is always the last item, after a separator.
- Focus moves into the menu on open and back to the trigger on close, as in DropdownMenu.

## Related

- [UserMenu in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/user-menu): anatomy, tokens and live examples.
- [DropdownMenu](dropdown-menu.md) for the items you can add.
- [AppShell](app-shell.md) for the sidebar it usually sits in.
- [ThemeToggle](../utility/theme-toggle.md) for a standalone theme control.
