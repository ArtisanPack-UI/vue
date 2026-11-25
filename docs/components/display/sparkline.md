---
title: Sparkline
menu_order: 110
meta_description: The Vue Sparkline component. A word-sized trend drawn as inline SVG, as a line, an area or bars, with an accessible label.
---

# Sparkline

A word-sized trend drawn as inline SVG. It renders an `<svg class="apui-sparkline" role="img">` as a line with a dot on the latest value, the same line with a fill, or bars. There's no chart library and no axes. Use it beside a number, such as in a [Stat](stat.md), a table cell or a [KpiCard](kpi-card.md). For a full chart, use [Chart](../data/chart.md).

```ts
import { Sparkline } from '@artisanpack-ui/vue/display';
// or
import { Sparkline } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Sparkline } from '@artisanpack-ui/vue/display';

const visits = [12, 18, 15, 22, 19, 27, 31];
</script>

<template>
  <Sparkline :data="visits" />
</template>
```

`data` is oldest first. Anything that isn't a finite number is skipped. The accessible label is "Trend from 12 to 31".

### Variants

```vue
<template>
  <Sparkline :data="visits" />
  <Sparkline :data="visits" variant="area" />
  <Sparkline :data="visits" variant="bar" />
</template>
```

When the values cross zero, a baseline is drawn at zero. An unknown variant falls back to `line`.

### Size

`width` and `height` are in pixels and also set the `viewBox`.

```vue
<template>
  <Sparkline :data="visits" :width="160" :height="40" variant="area" />
</template>
```

### Label

`label` replaces the accessible label. `{first}`, `{latest}`, `{min}`, `{max}` and `{count}` are filled in from the data. Translate it.

```vue
<template>
  <Sparkline :data="visits" label="Visits this week, from {first} to {latest}, peak {max}" />
</template>
```

## Props

| Prop      | Type                                     | Default                                        | Description                                                                                      |
| --------- | ---------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `data`    | `readonly number[]`                      | —                                              | Required. The values, oldest first. Anything that isn't a finite number is skipped.              |
| `variant` | `'line' \| 'area' \| 'bar'`              | `'line'`                                       | A line with a dot on the latest value, the same with a fill, or bars. Emitted as `data-variant`. |
| `width`   | `number`                                 | `96`                                           | The width in px.                                                                                 |
| `height`  | `number`                                 | `28`                                           | The height in px.                                                                                |
| `label`   | `string`                                 | `'Trend from {first} to {latest}'`, translated | The accessible label. `{first}`, `{latest}`, `{min}`, `{max}` and `{count}` are filled in.       |
| `classes` | `Partial<Record<SparklinePart, string>>` | —                                              | Extra classes per [part](#parts).                                                                |

`class`, `style` and every other attribute go to the root `<svg>`.

## Slots

Sparkline has no slots.

## Events

Sparkline has no events of its own. Listeners fall through to the `<svg>`.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part       | Element  | Description                                           |
| ---------- | -------- | ----------------------------------------------------- |
| `root`     | `svg`    | The sparkline, `.apui-sparkline`.                     |
| `baseline` | `line`   | The zero line. Only drawn when the values cross zero. |
| `area`     | `path`   | The fill under the line. `area` variant only.         |
| `line`     | `path`   | The trend line. `line` and `area` variants.           |
| `dot`      | `circle` | The latest value. `line` and `area` variants.         |
| `bar`      | `rect`   | One bar. `bar` variant only.                          |

## Types

```ts
import type { SparklinePart, SparklineProps, SparklineVariant } from '@artisanpack-ui/vue/display';
```

| Type               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `SparklineProps`   | The component's props.                                       |
| `SparklineVariant` | `'line' \| 'area' \| 'bar'`                                  |
| `SparklinePart`    | `'root' \| 'area' \| 'line' \| 'dot' \| 'bar' \| 'baseline'` |

## Accessibility

Sparkline isn't interactive and has no keyboard behavior.

- The `<svg>` is `role="img"` with a label that states the first and latest values, so the trend isn't only visual.
- Make the values themselves available nearby, in a table or a tooltip.
- Use one color for the whole trend, never green for up and red for down: the number beside it says that.
- The line, dot and bars keep a 3:1 contrast against the surface (`--apui-chart-1`).
- The plot stays left-to-right in every direction.

## Related

- [Sparkline in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/sparkline): anatomy, tokens and live examples.
- [KpiCard](kpi-card.md), which draws a sparkline beside its value.
- [Chart](../data/chart.md) for full charts with axes and a table view.
