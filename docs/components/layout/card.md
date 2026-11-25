---
title: Card
menu_order: 30
meta_description: The Vue Card component. A surface with optional media, header, body and footer, with surfaces, link cards and every prop, slot and part.
---

# Card

The default container: a surface with an edge, plus optional media, header, body and footer parts. Use it to group related content, such as a record summary, a settings section or a link to a report.

```ts
import { Card } from '@artisanpack-ui/vue/layout';
// or
import { Card } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Card } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Card title="Quarterly report" description="Updated 2 hours ago">
    Revenue grew 12% this quarter.
    <template #footer>3 comments</template>
  </Card>
</template>
```

`title`, `description`, `actions`, `footer` and `media` each take a prop or a slot of the same name; the slot wins. Each part only renders when it has content, and the body only renders when the default slot has visible content.

### Actions

The `actions` slot sits at the end of the header, next to the title.

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';
import { Card } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Card title="Quarterly report" description="Updated 2 hours ago">
    Revenue grew 12% this quarter.
    <template #actions>
      <Button size="sm" variant="ghost">Share</Button>
    </template>
  </Card>
</template>
```

### Surfaces

`surface` picks the background: `default`, `raised`, `sunken` or `glass`. Glass falls back to the raised surface under reduced transparency and in high contrast mode.

```vue
<template>
  <Card title="Raised" surface="raised">A raised surface.</Card>
  <Card title="Sunken" surface="sunken">A sunken surface.</Card>
  <Card title="Glass" surface="glass">Content on a glass surface.</Card>
</template>
```

### Media

`media` shows an image edge to edge above the header. `mediaAlt` is its alternative text; the default, `''`, marks it decorative. Only relative, `http`, `https`, `blob` and `data:image/…` URLs are rendered. For anything other than a plain image, use the `media` slot, which renders inside a `<div>`.

```vue
<template>
  <Card media="/images/q3.jpg" media-alt="Revenue chart for Q3" title="Quarterly report">
    Revenue grew 12% this quarter.
  </Card>
</template>
```

### Link cards

With `href`, the title becomes a link whose hit area covers the whole card, and the card gets the hover edge. Buttons in `actions` stay separately clickable. `href` needs a title (prop or slot) to live in; without one, or with an unsafe scheme such as `javascript:`, it's ignored and a development warning is logged.

```vue
<template>
  <Card href="/reports/q3" title="Read the report" description="PDF, 2 MB">
    The whole card is the link's hit area.
  </Card>
</template>
```

Set `interactive` to get the hover edge without a link, for example when the card is the target of your own click handler.

## Props

| Prop          | Type                                           | Default     | Description                                                                                              |
| ------------- | ---------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `surface`     | `'default' \| 'raised' \| 'sunken' \| 'glass'` | `'default'` | The surface. Emitted as `data-surface`.                                                                  |
| `interactive` | `boolean`                                      | `false`     | Adds the hover edge. Implied by a working `href`. Emitted as `data-interactive`.                         |
| `href`        | `string`                                       | —           | Makes the title a link whose hit area covers the card. Ignored without a title or with an unsafe scheme. |
| `title`       | `string`                                       | —           | The heading in the header, an `<h3>`. The `title` slot overrides it.                                     |
| `description` | `string`                                       | —           | Supporting text under the title. The `description` slot overrides it.                                    |
| `actions`     | `string`                                       | —           | Controls at the end of the header. Usually the `actions` slot instead.                                   |
| `footer`      | `string`                                       | —           | The footer row, separated by an edge. The `footer` slot overrides it.                                    |
| `media`       | `string`                                       | —           | An image URL shown edge to edge above the header. The `media` slot overrides it.                         |
| `mediaAlt`    | `string`                                       | `''`        | Alternative text for `media`. Empty marks the image decorative.                                          |
| `classes`     | `Partial<Record<CardPart, string>>`            | —           | Extra classes per [part](#parts), such as `{ header: '…', body: '…' }`. Use `class` for the root.        |

`class`, `style` and every other attribute go to the root `<div>`.

## Slots

| Slot          | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| `default`     | The body. The body part is omitted when this has no visible content.                  |
| `media`       | Replaces the `media` image. Rendered in a `<div>`.                                    |
| `title`       | The heading content. Replaces `title`, and is wrapped in the link when `href` is set. |
| `description` | Replaces `description`.                                                               |
| `actions`     | Controls at the end of the header. Replaces `actions`.                                |
| `footer`      | Replaces `footer`.                                                                    |

## Events

Card has no events of its own. Listeners such as `@click` fall through to the root `<div>`.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part          | Element        | Description                                              |
| ------------- | -------------- | -------------------------------------------------------- |
| `root`        | `div`          | The card, `.apui-card`.                                  |
| `media`       | `img` or `div` | The media image, or the wrapper around the `media` slot. |
| `header`      | `div`          | The header row with the title group and the actions.     |
| `title`       | `h3`           | The title. Holds the link when `href` is set.            |
| `description` | `p`            | The description under the title.                         |
| `actions`     | `div`          | The actions at the end of the header.                    |
| `body`        | `div`          | The default slot.                                        |
| `footer`      | `div`          | The footer row.                                          |

## Types

```ts
import type { CardPart, CardProps, CardSurface } from '@artisanpack-ui/vue/layout';
```

| Type          | Description                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `CardProps`   | The component's props.                                                                         |
| `CardSurface` | `'default' \| 'raised' \| 'sunken' \| 'glass'`                                                 |
| `CardPart`    | `'root' \| 'media' \| 'header' \| 'title' \| 'description' \| 'actions' \| 'body' \| 'footer'` |

## Accessibility

| Keys  | Action                                                                   |
| ----- | ------------------------------------------------------------------------ |
| `Tab` | Moves to the title link when `href` is set, then to each control inside. |

- A card is a plain container. Give it a heading so it can be found; the title is an `<h3>`.
- With `href`, the title is the one link, and its hit area covers the card. Nested buttons stay separately focusable and clickable.
- The focus ring sits on the whole card while its title link has `:focus-visible`.
- Give meaningful media a `mediaAlt`; leave it empty for decorative images.
- Text keeps a 4.5:1 contrast ratio on every surface, glass included.

## Related

- [Card in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/card): anatomy, tokens and live examples.
- [Grid](grid.md) and [Stack](stack.md) to lay out several cards.
- [KpiCard](../display/kpi-card.md) for a single metric.
