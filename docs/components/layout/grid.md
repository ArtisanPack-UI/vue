---
title: Grid
menu_order: 90
meta_description: The Vue Grid component. A layout primitive that places children in equal columns, with reflowing columns, gaps and alignment.
---

# Grid

A layout primitive that places its children in equal columns, with the gap from the space scale. With `minItemWidth`, the grid drops columns as it narrows, down to one. Use it for card lists, galleries and dashboards. It renders `.apui-grid` from `@artisanpack-ui/css` and needs no Tailwind.

```ts
import { Grid } from '@artisanpack-ui/vue/layout';
// or
import { Grid } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Card, Grid } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Grid :columns="3">
    <Card title="Cedarwood Estates">12 units</Card>
    <Card title="The Grove">24 units</Card>
    <Card title="Harbor Lofts">8 units</Card>
  </Grid>
</template>
```

Every child is a grid item.

### Reflowing columns

`minItemWidth` sets the narrowest a column may get. The grid shows up to `columns` columns and drops one whenever they'd get narrower than that, so it reflows to a single column on narrow screens without breakpoints.

```vue
<template>
  <Grid :columns="4" min-item-width="12rem" gap="6">
    <div v-for="n in 8" :key="n">Item {{ n }}</div>
  </Grid>
</template>
```

### Gap

`gap` is a step of the space scale: `'0'`, `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'8'`, `'10'`, `'12'` or `'16'`. Numbers work too.

```vue
<template>
  <Grid :columns="2" :gap="8">
    <!-- … -->
  </Grid>
</template>
```

### Alignment

`align` sets how items sit in their row (`align-items`) and `justify` how they sit in their column (`justify-items`). Both default to `stretch`.

```vue
<template>
  <Grid :columns="3" align="start" justify="center">
    <!-- … -->
  </Grid>
</template>
```

## Props

| Prop           | Type                                        | Default     | Description                                                                                                |
| -------------- | ------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `columns`      | `number`                                    | `1`         | The number of columns, clamped to 1–12. The most there are with `minItemWidth`. Emitted as `data-columns`. |
| `minItemWidth` | `string`                                    | —           | The narrowest a column may get, any CSS length. Sets `--apui-grid-min-item-width`.                         |
| `gap`          | `GridGap \| number`                         | `'4'`       | The space between rows and columns, a step of the space scale. Emitted as `data-gap`.                      |
| `align`        | `'start' \| 'center' \| 'end' \| 'stretch'` | `'stretch'` | How items sit in their row (`align-items`). Emitted as `data-align`.                                       |
| `justify`      | `'start' \| 'center' \| 'end' \| 'stretch'` | `'stretch'` | How items sit in their column (`justify-items`). Emitted as `data-justify`.                                |

`class`, `style` and other attributes go to the root `<div>`. A `style` you pass merges with the min item width custom property. Grid has no `classes` prop because it has only one element.

## Slots

| Slot      | Description     |
| --------- | --------------- |
| `default` | The grid items. |

## Events

Grid has no events.

## Types

```ts
import type { GridAlign, GridGap, GridJustify, GridProps } from '@artisanpack-ui/vue/layout';
```

| Type          | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `GridProps`   | The component's props.                                                         |
| `GridGap`     | `'0' \| '1' \| '2' \| '3' \| '4' \| '5' \| '6' \| '8' \| '10' \| '12' \| '16'` |
| `GridAlign`   | `'start' \| 'center' \| 'end' \| 'stretch'`                                    |
| `GridJustify` | `'start' \| 'center' \| 'end' \| 'stretch'`                                    |

## Accessibility

Grid isn't focusable and has no keyboard interaction.

- It's layout only: no role. The reading order is the source order, which the columns keep.
- Columns run in the text direction, so they start at the inline end in right-to-left layouts.
- With `minItemWidth`, the grid reflows to one column at narrow widths.

## Related

- [Grid in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/grid): anatomy, tokens and live examples.
- [Stack](stack.md) for a single row or column.
- [Card](card.md) for the items of a card grid.
