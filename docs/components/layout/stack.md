---
title: Stack
menu_order: 140
meta_description: The Vue Stack component. A layout primitive that places children in a column or a row, with gaps, alignment and wrapping.
---

# Stack

A layout primitive that places its children in a column or a row, with the gap from the space scale, alignment and optional wrapping. Use it for form fields, button rows and any one-dimensional layout. It renders `.apui-stack` from `@artisanpack-ui/css` and needs no Tailwind.

```ts
import { Stack } from '@artisanpack-ui/vue/layout';
// or
import { Stack } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Input } from '@artisanpack-ui/vue/form';
import { Stack } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Stack gap="4">
    <Input label="Name" />
    <Input label="Email" type="email" />
  </Stack>
</template>
```

Every child is a stack item. Without props, Stack is a column with a gap of `'2'`.

### Rows

`orientation="horizontal"` lays the items out in a row that runs in the text direction. Add `wrap` when the row may not fit on a narrow screen.

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';
import { Stack } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Stack orientation="horizontal" justify="end" gap="2" wrap>
    <Button variant="outline" color="neutral">Cancel</Button>
    <Button>Save</Button>
  </Stack>
</template>
```

### Gap

`gap` is a step of the space scale: `'0'`, `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'8'`, `'10'`, `'12'` or `'16'`. Numbers work too.

### Alignment

`align` sets `align-items`: `start`, `center`, `end`, `stretch` (the default) or `baseline`. `justify` sets `justify-content`: `start` (the default), `center`, `end`, `between`, `around` or `evenly`.

```vue
<template>
  <Stack orientation="horizontal" justify="between" align="center">
    <span>Total</span>
    <strong>$248,000</strong>
  </Stack>
</template>
```

## Props

| Prop          | Type                                                                | Default      | Description                                                                        |
| ------------- | ------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'`                                        | `'vertical'` | A column, or a row that runs in the text direction. Emitted as `data-orientation`. |
| `direction`   | `'vertical' \| 'horizontal'`                                        | —            | Deprecated. Use `orientation`.                                                     |
| `gap`         | `StackGap \| number`                                                | `'2'`        | The space between items, a step of the space scale. Emitted as `data-gap`.         |
| `align`       | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | `'stretch'`  | `align-items`. Emitted as `data-align`.                                            |
| `justify`     | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'`    | `justify-content`. Emitted as `data-justify`.                                      |
| `wrap`        | `boolean`                                                           | `false`      | Lets a row wrap onto more lines. Emitted as `data-wrap`.                           |

`class`, `style` and other attributes go to the root `<div>`. Stack has no `classes` prop because it has only one element.

## Slots

| Slot      | Description      |
| --------- | ---------------- |
| `default` | The stack items. |

## Events

Stack has no events.

## Deprecated props

| Prop        | Replacement                                           |
| ----------- | ----------------------------------------------------- |
| `direction` | `orientation`. When both are set, `orientation` wins. |

## Types

```ts
import type {
  StackAlign,
  StackGap,
  StackJustify,
  StackOrientation,
  StackProps,
} from '@artisanpack-ui/vue/layout';
```

| Type               | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `StackProps`       | The component's props.                                                         |
| `StackOrientation` | `'vertical' \| 'horizontal'`                                                   |
| `StackGap`         | `'0' \| '1' \| '2' \| '3' \| '4' \| '5' \| '6' \| '8' \| '10' \| '12' \| '16'` |
| `StackAlign`       | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`                      |
| `StackJustify`     | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'`            |

## Accessibility

Stack isn't focusable and has no keyboard interaction.

- It's layout only: no role. The reading order is the source order.
- A row runs in the text direction, so it starts at the inline end in right-to-left layouts.
- Set `wrap` on a row that may not fit at 320px.

## Related

- [Stack in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/stack): anatomy, tokens and live examples.
- [Grid](grid.md) for items in columns.
- [Divider](divider.md) for a rule between items.
