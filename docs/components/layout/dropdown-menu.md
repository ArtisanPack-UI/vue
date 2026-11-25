---
title: DropdownMenu
menu_order: 80
meta_description: The Vue DropdownMenu component with DropdownMenuItem, Group and Separator. Action, checkbox and radio items, with every prop, slot, event and part.
---

# DropdownMenu

A list of actions or options anchored to a trigger button. It holds action, checkbox and radio items, in groups with labels. The arrow keys move between items, typeahead jumps to an item, and Escape closes the menu and returns focus to the trigger. It replaces the deprecated `Dropdown` and `DropdownItem`.

```ts
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@artisanpack-ui/vue/layout';
// or
import { DropdownMenu, DropdownMenuItem } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@artisanpack-ui/vue/layout';

function onSelect(value: string): void {
  // 'edit', 'duplicate' or 'delete'
}
</script>

<template>
  <DropdownMenu label="Options" @select="onSelect">
    <DropdownMenuGroup label="Listing">
      <DropdownMenuItem value="edit" icon="pencil" shortcut="E">Edit</DropdownMenuItem>
      <DropdownMenuItem value="duplicate" icon="copy">Duplicate</DropdownMenuItem>
      <DropdownMenuItem value="archive" disabled>Archive</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem value="delete" icon="trash" color="error">Delete</DropdownMenuItem>
  </DropdownMenu>
</template>
```

The trigger is an outline neutral [Button](../form/button.md) with a chevron. Choosing an action item emits `select` with its value from the menu, and from the item itself, then closes the menu.

### Click handlers on items

Attributes and listeners on a `DropdownMenuItem` go to the item element, and choosing an item clicks it. So an item's `@click` runs whether it's chosen with the pointer or with `Enter`:

```vue
<template>
  <DropdownMenu label="Options">
    <DropdownMenuItem value="edit" @click="edit">Edit</DropdownMenuItem>
  </DropdownMenu>
</template>
```

### Checkbox and radio items

Set `type="checkbox"` or `type="radio"` on an item. These items don't emit `select`; they emit `checked-change` with `{ value, checked }`, from the item and from the menu. The checked state stays yours to set through `checked`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuCheckedChange,
} from '@artisanpack-ui/vue/layout';

const showGrid = ref(true);
const sort = ref('newest');

function onCheckedChange({ value, checked }: DropdownMenuCheckedChange): void {
  if (value === 'grid') showGrid.value = checked;
  else if (checked) sort.value = value;
}
</script>

<template>
  <DropdownMenu label="View" align="end" @checked-change="onCheckedChange">
    <DropdownMenuItem type="checkbox" value="grid" :checked="showGrid">Show grid</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuGroup label="Sort by">
      <DropdownMenuItem type="radio" value="newest" :checked="sort === 'newest'"
        >Newest</DropdownMenuItem
      >
      <DropdownMenuItem type="radio" value="price" :checked="sort === 'price'"
        >Price</DropdownMenuItem
      >
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
```

### Items as data

`items` renders the same children from an array of entries: action items (the default type), checkbox and radio items, separators and groups. Data entries render before any composed children.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { DropdownMenu, type DropdownMenuEntry } from '@artisanpack-ui/vue/layout';

const sort = ref('newest');

const items = computed<DropdownMenuEntry[]>(() => [
  { value: 'edit', label: 'Edit', icon: 'pencil', shortcut: 'E' },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Sort by',
    items: [
      { type: 'radio', value: 'newest', label: 'Newest', checked: sort.value === 'newest' },
      { type: 'radio', value: 'price', label: 'Price', checked: sort.value === 'price' },
    ],
  },
]);
</script>

<template>
  <DropdownMenu
    label="Options"
    :items="items"
    @checked-change="({ value, checked }) => checked && (sort = value)"
  />
</template>
```

### Icon-only trigger

For an icon-only trigger, put an icon and visually hidden text in the `label` slot:

```vue
<script setup lang="ts">
import { Icon } from '@artisanpack-ui/vue/utility';
import { DropdownMenu, DropdownMenuItem } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <DropdownMenu>
    <template #label>
      <Icon name="ellipsis" />
      <span class="apui-sr-only">More actions</span>
    </template>
    <DropdownMenuItem value="edit">Edit</DropdownMenuItem>
  </DropdownMenu>
</template>
```

### Alignment, surface and portal

`align` picks which edge of the menu lines up with the trigger: `start`, `center` or `end`. Start and end follow the text direction. `surface="glass"` gives a translucent panel. `:portal="false"` renders the panel in place instead of teleporting it to the end of `<body>`.

### Controlled open state

`v-model:open` binds whether the menu is open. When you pass `open`, the menu is controlled: it reports changes through `update:open` and shows only what the prop says. Without it, the menu keeps its own state.

## Props

| Prop      | Type                                        | Default     | Description                                                                                                                      |
| --------- | ------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `open`    | `boolean`                                   | `false`     | Whether the menu is open. Passing it makes the menu controlled. Bind with `v-model:open`.                                        |
| `label`   | `string`                                    | —           | The trigger button's content. The `label` slot overrides it.                                                                     |
| `items`   | `DropdownMenuEntry[]`                       | —           | Entries as data, rendered before the composed children.                                                                          |
| `align`   | `'start' \| 'center' \| 'end'`              | `'start'`   | The menu edge that lines up with the trigger's. Start and end follow the text direction. Emitted as `data-align`.                |
| `surface` | `'overlay' \| 'glass'`                      | `'overlay'` | The panel's surface. Glass falls back to overlay under reduced transparency and in high contrast. Emitted as `data-surface`.     |
| `portal`  | `boolean`                                   | `true`      | Teleports the panel to the end of `<body>`. Off renders it in place.                                                             |
| `classes` | `Partial<Record<DropdownMenuPart, string>>` | —           | Extra classes per [part](#parts), such as `{ trigger: '…', item: '…' }`. Applies to the items, groups and separators inside too. |

DropdownMenu doesn't inherit attributes onto a wrapper. `class`, `style` and every other attribute go to the panel (`.apui-dropdown-menu`), not the trigger.

## v-model

| Binding        | Type      | Carries                   |
| -------------- | --------- | ------------------------- |
| `v-model:open` | `boolean` | Whether the menu is open. |

## Slots

| Slot      | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| `default` | `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator` children. |
| `label`   | The trigger's content. Replaces `label`.                                      |

## Events

| Event             | Payload                     | Description                                                                            |
| ----------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| `@update:open`    | `boolean`                   | The menu opened or closed itself (trigger, Escape, outside click, a choice).           |
| `@select`         | `string`                    | An action item was chosen. Carries its value. Not emitted for checkbox or radio items. |
| `@checked-change` | `DropdownMenuCheckedChange` | A checkbox or radio item was toggled. Carries `{ value, checked }`.                    |

## Parts

Pass extra classes to a part with `classes` on the DropdownMenu. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part             | Element  | Description                                                                 |
| ---------------- | -------- | --------------------------------------------------------------------------- |
| `trigger`        | `button` | The trigger [Button](../form/button.md).                                    |
| `positioner`     | `div`    | Positions the panel next to the trigger.                                    |
| `root`           | `div`    | The panel, `.apui-dropdown-menu`, `role="menu"`. Same element as `content`. |
| `content`        | `div`    | The panel. Same element as `root`.                                          |
| `itemGroup`      | `div`    | A group of items.                                                           |
| `itemGroupLabel` | `div`    | A group's label.                                                            |
| `item`           | `div`    | An item, `role="menuitem"`, `menuitemcheckbox` or `menuitemradio`.          |
| `itemIndicator`  | `span`   | The check mark of a checkbox or radio item.                                 |
| `icon`           | `span`   | The item's icon. `aria-hidden`.                                             |
| `itemText`       | `span`   | The item's label.                                                           |
| `shortcut`       | `kbd`    | The item's keyboard shortcut.                                               |
| `separator`      | `hr`     | A rule between items.                                                       |

## DropdownMenuItem

An action, checkbox or radio item. The default slot is its label. It must be inside a `DropdownMenu`, or it throws. `class`, `style`, other attributes and listeners such as `@click` go to the item element.

### DropdownMenuItem props

| Prop       | Type                              | Default  | Description                                                                                                                                                          |
| ---------- | --------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`    | `string`                          | —        | Required. The value that `select` and `checked-change` report. Unique within the menu.                                                                               |
| `icon`     | `string`                          | —        | An icon name from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons), before the label. The `icon` slot overrides it. |
| `shortcut` | `string`                          | —        | A keyboard shortcut shown at the end, in a `<kbd>`. Display only; it doesn't bind the key.                                                                           |
| `color`    | `'error'`                         | —        | Marks a danger item. Put it last, after a separator. Emitted as `data-color`.                                                                                        |
| `disabled` | `boolean`                         | `false`  | Skipped by the arrow keys and can't be chosen.                                                                                                                       |
| `type`     | `'item' \| 'checkbox' \| 'radio'` | `'item'` | An action item, or a checkbox or radio item.                                                                                                                         |
| `checked`  | `boolean`                         | `false`  | Whether a checkbox or radio item is checked.                                                                                                                         |

### DropdownMenuItem slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | The label.                     |
| `icon`    | Replaces the icon from `icon`. |

### DropdownMenuItem events

| Event             | Payload                     | Description                                                            |
| ----------------- | --------------------------- | ---------------------------------------------------------------------- |
| `@select`         | `string`                    | This action item was chosen.                                           |
| `@checked-change` | `DropdownMenuCheckedChange` | This checkbox or radio item was toggled. Carries `{ value, checked }`. |

## DropdownMenuGroup

A group of items, labelled by `label` for assistive technology. It must be inside a `DropdownMenu`. Attributes go to the group's `<div>`.

### DropdownMenuGroup props

| Prop    | Type     | Default | Description                                               |
| ------- | -------- | ------- | --------------------------------------------------------- |
| `label` | `string` | —       | The group's visible label, linked with `aria-labelledby`. |

### DropdownMenuGroup slots

| Slot      | Description        |
| --------- | ------------------ |
| `default` | The group's items. |

DropdownMenuGroup has no events.

## DropdownMenuSeparator

A rule between items, rendered as an `<hr>`. It must be inside a `DropdownMenu`. It has no props, slots or events.

## Types

```ts
import type {
  DropdownMenuActionEntry,
  DropdownMenuAlign,
  DropdownMenuCheckedChange,
  DropdownMenuEntry,
  DropdownMenuGroupEntry,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuItemType,
  DropdownMenuOptionEntry,
  DropdownMenuPart,
  DropdownMenuProps,
  DropdownMenuSeparatorEntry,
  DropdownMenuSurface,
} from '@artisanpack-ui/vue/layout';
```

| Type                         | Description                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DropdownMenuProps`          | The DropdownMenu's props.                                                                                                                                               |
| `DropdownMenuItemProps`      | The DropdownMenuItem's props.                                                                                                                                           |
| `DropdownMenuGroupProps`     | The DropdownMenuGroup's props.                                                                                                                                          |
| `DropdownMenuEntry`          | One entry of `items`: an action, option, separator or group entry.                                                                                                      |
| `DropdownMenuActionEntry`    | `{ type?: 'item', value, label, icon?, shortcut?, color?: 'error', disabled? }`                                                                                         |
| `DropdownMenuOptionEntry`    | `{ type: 'checkbox' \| 'radio', value, label, checked?, icon?, shortcut?, disabled? }`                                                                                  |
| `DropdownMenuSeparatorEntry` | `{ type: 'separator' }`                                                                                                                                                 |
| `DropdownMenuGroupEntry`     | `{ type: 'group', label?, items: DropdownMenuEntry[] }`                                                                                                                 |
| `DropdownMenuCheckedChange`  | The `checked-change` payload: `{ value: string, checked: boolean }`.                                                                                                    |
| `DropdownMenuItemType`       | `'item' \| 'checkbox' \| 'radio'`                                                                                                                                       |
| `DropdownMenuAlign`          | `'start' \| 'center' \| 'end'`                                                                                                                                          |
| `DropdownMenuSurface`        | `'overlay' \| 'glass'`                                                                                                                                                  |
| `DropdownMenuPart`           | `'root' \| 'content' \| 'trigger' \| 'positioner' \| 'itemGroup' \| 'itemGroupLabel' \| 'item' \| 'icon' \| 'itemText' \| 'shortcut' \| 'itemIndicator' \| 'separator'` |

## Accessibility

| Keys                          | Action                                                                    |
| ----------------------------- | ------------------------------------------------------------------------- |
| `Enter`, `Space`, `ArrowDown` | On the trigger, opens the menu on the first item.                         |
| `ArrowUp`                     | On the trigger, opens the menu on the last item.                          |
| `ArrowDown`, `ArrowUp`        | Moves to the next or previous item, skipping disabled ones.               |
| `Home`, `End`                 | Moves to the first or last item.                                          |
| `A`–`Z`                       | Typeahead: moves to the next item whose label starts with the typed text. |
| `Enter`, `Space`              | Chooses the item; a checkbox or radio item toggles.                       |
| `Escape`                      | Closes the menu and returns focus to the trigger.                         |
| `Tab`                         | Closes the menu and moves on.                                             |

- The panel has `role="menu"`, with `menuitem`, `menuitemcheckbox` and `menuitemradio` items; checked items set `aria-checked`.
- The trigger sets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`.
- Focus moves into the menu on open and returns to the trigger when it closes.
- Disabled items set `aria-disabled` and are skipped by the arrow keys.
- Groups are labelled by their label with `aria-labelledby`.
- An icon-only trigger needs visually hidden text in the `label` slot.
- Danger items keep 4.5:1 contrast on the overlay surface; put them last, after a separator.
- The panel opens below the trigger at its start edge, mirrors in right-to-left layouts, and flips when there's no room.

## Related

- [DropdownMenu in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/dropdown-menu): anatomy, tokens and live examples.
- [UserMenu](user-menu.md) for the account menu.
- [Popover](popover.md) for non-menu content anchored to a trigger.
- [Menu](../navigation/menu.md) for navigation lists.
- [Deprecated components](../deprecated.md) for migrating from `Dropdown`.
