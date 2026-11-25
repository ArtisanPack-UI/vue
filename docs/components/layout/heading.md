---
title: Heading
menu_order: 100
meta_description: The Vue Heading component. A title from the type scale with separate semantic level and visual size, plus an optional eyebrow.
---

# Heading

A title from the type scale. It renders a native `<h1>`–`<h6>`, with the semantic level and the visual size set apart, so the page outline stays correct whatever the design calls for. An optional eyebrow adds a short uppercase label just before it.

```ts
import { Heading } from '@artisanpack-ui/vue/layout';
// or
import { Heading } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Heading } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Heading :level="1">Listings</Heading>
  <Heading>Recent activity</Heading>
</template>
```

Without `level`, Heading renders an `<h2>`.

### Level and size

`level` sets the element (`h1`–`h6`) and `size` how big it looks. `size` defaults to `level`. Both take a number or a string from 1 to 6; values outside the range fall back to the default.

```vue
<template>
  <!-- An h2 that looks like an h4 -->
  <Heading :level="2" :size="4">Billing details</Heading>
</template>
```

### Eyebrow

`eyebrow` (or the `eyebrow` slot) renders a short uppercase label in a `<p>` just before the heading. It's not part of the heading, so it never adds a level to the outline.

```vue
<template>
  <Heading :level="1" eyebrow="Portfolio">Every property, one calm place</Heading>
</template>
```

## Props

| Prop      | Type                                   | Default     | Description                                                                                         |
| --------- | -------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `level`   | `HeadingStep`                          | `2`         | The semantic level: renders `h1`–`h6`. Emitted as `data-level`.                                     |
| `size`    | `HeadingStep`                          | the `level` | The visual size, 1 (largest) to 6. Emitted as `data-size`.                                          |
| `eyebrow` | `string`                               | —           | A short uppercase section label, rendered just before the heading. The `eyebrow` slot overrides it. |
| `classes` | `Partial<Record<HeadingPart, string>>` | —           | Extra classes per [part](#parts), such as `{ eyebrow: '…' }`.                                       |

`class`, `style` and every other attribute go to the `<h1>`–`<h6>`, not the eyebrow. With an eyebrow, Heading renders two sibling elements and no wrapper.

## Slots

| Slot      | Description                              |
| --------- | ---------------------------------------- |
| `default` | The heading text.                        |
| `eyebrow` | The eyebrow content. Replaces `eyebrow`. |

## Events

Heading has no events.

## Parts

Pass extra classes to a part with `classes`.

| Part      | Element   | Description                                                     |
| --------- | --------- | --------------------------------------------------------------- |
| `root`    | `h1`–`h6` | The heading, `.apui-heading`.                                   |
| `eyebrow` | `p`       | The eyebrow, before the heading. Carries `data-part="eyebrow"`. |

## Types

```ts
import type { HeadingPart, HeadingProps, HeadingStep } from '@artisanpack-ui/vue/layout';
```

| Type           | Description                                       |
| -------------- | ------------------------------------------------- |
| `HeadingProps` | The component's props.                            |
| `HeadingStep`  | A level or size, `1`–`6` as a number or a string. |
| `HeadingPart`  | `'root' \| 'eyebrow'`                             |

## Accessibility

Heading isn't focusable and has no keyboard interaction.

- It renders a native heading element at `level`; `size` only changes how it looks.
- Keep one `h1` per page and don't skip levels.
- The eyebrow is a paragraph before the heading, so it never adds a level to the outline.
- Text keeps 4.5:1 contrast; the eyebrow uses the muted text color.

## Related

- [Heading in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/heading): anatomy, tokens and live examples.
- [Text](text.md) for body copy.
- [PageHeader](page-header.md) for a page's title row with actions.
