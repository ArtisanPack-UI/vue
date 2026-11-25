---
title: ListItem
menu_order: 110
meta_description: The Vue ListItem and List components. Rows with leading, title, description and trailing parts, as links, buttons or plain rows.
---

# ListItem

A row with leading, title, description and trailing parts, such as a person, a notification or a file. With `href` the title becomes a link that covers the row, and with `interactive` a button. Put rows in a `List` to render them as `<li>` elements of a `<ul>` or `<ol>`; on its own, a ListItem renders a `<div>`.

```ts
import { List, ListItem } from '@artisanpack-ui/vue/layout';
// or
import { List, ListItem } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Avatar, Badge } from '@artisanpack-ui/vue/display';
import { List, ListItem } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <List variant="bordered">
    <ListItem title="Olivia Rhye" description="olivia@company.com">
      <template #leading><Avatar name="Olivia Rhye" /></template>
      <template #trailing><Badge color="primary">Admin</Badge></template>
    </ListItem>
    <ListItem title="Phoenix Baker" description="phoenix@company.com">
      <template #leading><Avatar name="Phoenix Baker" /></template>
      <template #trailing><Badge>Editor</Badge></template>
    </ListItem>
  </List>
</template>
```

The title comes from `title`, the `title` slot, or, when neither is set, the default slot.

### Links and buttons

`href` makes the title a link whose hit area covers the row. Only relative, `http`, `https`, `mailto`, `tel` and `sms` URLs are kept. Without `href`, `interactive` makes the title a button that covers the row. Attributes and listeners go to the row, so a `@click` on an interactive row runs when its button is pressed.

```vue
<script setup lang="ts">
import { List, ListItem } from '@artisanpack-ui/vue/layout';

function openOffer(): void {
  // …
}
</script>

<template>
  <List variant="divided">
    <ListItem href="/people/olivia" title="Olivia Rhye" description="olivia@company.com" />
    <ListItem
      interactive
      leading-icon="mail"
      title="Offer received"
      description="Lakeview Lofts · $248,000"
      trailing="2m"
      @click="openOffer"
    />
  </List>
</template>
```

### Selected and disabled

`selected` marks the current or chosen row with `data-selected`, and sets `aria-current="true"` on its link or button. `disabled` dims the row, sets `aria-disabled`, disables its button, and removes its link's `href`.

```vue
<template>
  <List>
    <ListItem href="/inbox" title="Inbox" selected />
    <ListItem href="/archive" title="Archive" disabled />
  </List>
</template>
```

### List variants

`variant` sets the List's frame: `plain` (the default), `bordered` (a framed surface) or `divided` (rules between rows only). `ordered` renders an `<ol>` instead of a `<ul>`.

```vue
<template>
  <List variant="divided" ordered>
    <ListItem title="Upload photos" />
    <ListItem title="Set a price" />
  </List>
</template>
```

## Props

| Prop          | Type                                    | Default | Description                                                                                                                                                               |
| ------------- | --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                                | —       | The main text. The `title` slot overrides it.                                                                                                                             |
| `description` | `string`                                | —       | Secondary text under the title. The `description` slot overrides it.                                                                                                      |
| `href`        | `string`                                | —       | Makes the title a link covering the row. Unsafe schemes are dropped.                                                                                                      |
| `interactive` | `boolean`                               | `false` | Without `href`, makes the title a button covering the row.                                                                                                                |
| `selected`    | `boolean`                               | `false` | The current or chosen row. Emitted as `data-selected`, and as `aria-current="true"` on the link or button.                                                                |
| `disabled`    | `boolean`                               | `false` | Dims the row and disables its link or button. Emitted as `data-disabled` and `aria-disabled`.                                                                             |
| `leadingIcon` | `string`                                | —       | An icon name from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons) in the leading part. The `leading` slot overrides it. |
| `trailing`    | `string`                                | —       | Short text at the end, such as a time. The `trailing` slot overrides it.                                                                                                  |
| `classes`     | `Partial<Record<ListItemPart, string>>` | —       | Extra classes per [part](#parts), such as `{ title: '…' }`.                                                                                                               |

`class`, `style`, other attributes and listeners such as `@click` go to the row (`<li>` or `<div>`).

## Slots

| Slot          | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| `default`     | The title, used when neither `title` nor the `title` slot is set.     |
| `leading`     | Content at the start, such as an Avatar. Replaces `leadingIcon`.      |
| `title`       | The title content. Replaces `title`.                                  |
| `description` | Replaces `description`.                                               |
| `trailing`    | Content at the end, such as a Badge or a button. Replaces `trailing`. |

## Events

ListItem has no events of its own. Listeners such as `@click` fall through to the row.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part          | Element                 | Description                                                                                                   |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `root`        | `li` or `div`           | The row, `.apui-list-item`. An `<li>` inside a List. Carries `data-interactive` when it has a link or button. |
| `leading`     | `span`                  | The leading icon or slot.                                                                                     |
| `title`       | `a`, `button` or `span` | The title: a link with `href`, a button with `interactive`, otherwise plain text.                             |
| `description` | `span`                  | The description.                                                                                              |
| `trailing`    | `span`                  | The trailing text or slot.                                                                                    |

## List

Rows of ListItems. Its children render as `<li>` elements. `class`, `style` and other attributes go to the `<ul>` or `<ol>`.

### List props

| Prop      | Type                                 | Default   | Description                            |
| --------- | ------------------------------------ | --------- | -------------------------------------- |
| `variant` | `'plain' \| 'bordered' \| 'divided'` | `'plain'` | The frame. Emitted as `data-variant`.  |
| `ordered` | `boolean`                            | `false`   | Renders an `<ol>` instead of a `<ul>`. |

### List slots

| Slot      | Description    |
| --------- | -------------- |
| `default` | The ListItems. |

List has no events. Its root is `.apui-list` and it has no `classes` prop.

## Types

```ts
import type {
  ListItemPart,
  ListItemProps,
  ListProps,
  ListVariant,
} from '@artisanpack-ui/vue/layout';
```

| Type            | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `ListItemProps` | The ListItem's props.                                           |
| `ListProps`     | The List's props.                                               |
| `ListVariant`   | `'plain' \| 'bordered' \| 'divided'`                            |
| `ListItemPart`  | `'root' \| 'leading' \| 'title' \| 'description' \| 'trailing'` |

## Accessibility

| Keys    | Action                                                                        |
| ------- | ----------------------------------------------------------------------------- |
| `Tab`   | Moves to the row's link or button, then to any controls in the trailing part. |
| `Enter` | Follows the row's link or activates its button.                               |

- Interactive rows are links (`href`) or buttons (`interactive`), never a clickable `<li>`; the control covers the row.
- Selection sets `aria-current="true"` on the row's link or button.
- Rows in a List are `<li>` elements of a `<ul>` or `<ol>`.
- The focus ring is drawn inside the row, so rows in a list don't overlap it.
- Disabled rows set `aria-disabled`, use the disabled text color, and their link or button is disabled.

## Related

- [ListItem in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/list-item): anatomy, tokens and live examples.
- [Avatar](../display/avatar.md) and [Badge](../display/badge.md) for leading and trailing content.
- [Menu](../navigation/menu.md) for navigation lists.
