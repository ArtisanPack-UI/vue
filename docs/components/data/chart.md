---
title: Chart
menu_order: 20
meta_description: The Vue Chart component. Bar, line, area and donut charts in a card, with a legend, tooltips, value formatting and an accessible data table.
---

# Chart

A bar, line, area or donut chart in a card. It renders a `<div class="apui-card apui-chart">` with a header (title, description, legend and actions), an inline SVG plot and an optional data table. The geometry is computed by the shared behavior package, so the chart matches the Livewire and React ones, with no chart library. Every mark is focusable and shows a tooltip on hover and on keyboard focus.

```ts
import { Chart } from '@artisanpack-ui/vue/data';
// or
import { Chart } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Chart } from '@artisanpack-ui/vue/data';

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
const revenue = [{ name: 'Revenue', data: [4100, 6000, 8200, 10000, 4000, 8000] }];
</script>

<template>
  <Chart title="Weekly revenue" :labels="weeks" :series="revenue" prefix="$" notation="compact" />
</template>
```

`title` is required: it's the heading, and it names the plot and the table. `labels` are the categories along the x axis, or the donut's slices. Each series' `data` lines up with `labels`.

### Types

`type` is `bar` (the default), `line`, `area` or `donut`. An unknown type falls back to `bar`.

- **Bar** draws the first series only.
- **Line** and **area** draw every series. A `null` (or any value that isn't a finite number) breaks the line. A legend shows for two or more series.
- **Donut** draws the first series as slices of `labels`, with each slice's share beside it in the legend. `width` and `height` don't apply.

Bar, line and area charts label the first series' highest value on the plot.

```vue
<script setup lang="ts">
import { Chart } from '@artisanpack-ui/vue/data';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const salesAndTarget = [
  { name: 'Sales', data: [600000, 1800000, 2600000, 3200000] },
  { name: 'Target', data: [3200000, 4400000, 3800000, null] },
];
</script>

<template>
  <Chart
    type="area"
    title="Sales vs target"
    :labels="quarters"
    :series="salesAndTarget"
    prefix="$"
    notation="compact"
  />
  <Chart
    type="line"
    title="Sales vs target"
    :labels="quarters"
    :series="salesAndTarget"
    prefix="$"
    notation="compact"
  />
  <Chart
    type="donut"
    title="Active listings"
    description="By country"
    :labels="['United States', 'Mexico', 'Canada', 'Other']"
    :series="[1240, 990, 723, 260]"
  />
</template>
```

### Series shapes

`series` takes an array of `{ name, data }` objects, or a plain array of numbers for one series named by `title`. A series' `data` can also hold points, as `{ x, y }` objects or `[x, y]` pairs. Without `labels`, the `x` values of the first series given as points become the categories.

```vue
<template>
  <Chart title="Signups" :series="[12, 18, 15, 22]" :labels="['Mon', 'Tue', 'Wed', 'Thu']" />
  <Chart
    type="line"
    title="Signups"
    :series="[{ name: 'Signups', data: [{ x: 'Mon', y: 12 }, { x: 'Tue', y: 18 }, ['Wed', 15]] }]"
  />
</template>
```

### Value formatting

`prefix` and `suffix` go around every value, in the axis, the tooltip, the table and the peak label. `notation="compact"` abbreviates large numbers ($12.5k, $3.2M). `standard` groups thousands (12,500).

```vue
<template>
  <Chart
    type="bar"
    title="Conversion by week"
    :labels="weeks"
    :series="[2.1, 2.4, 3.0, 2.8]"
    suffix="%"
  />
</template>
```

### Data table

`tabular` shows the data as a table under the plot: one row per category and one column per series. Donut cells show the value and its share. Turn it on wherever the exact values matter.

```vue
<template>
  <Chart
    type="donut"
    title="Active listings"
    :labels="countries"
    :series="[1240, 990, 723, 260]"
    tabular
  />
</template>
```

### Size

`width` and `height` set the plot's `viewBox` (cartesian charts only). The SVG scales to its container, so these set the aspect ratio and the text size relative to the plot. A value that doesn't leave room for the padding falls back to the default.

```vue
<template>
  <Chart
    type="line"
    title="Sales"
    :labels="quarters"
    :series="salesAndTarget"
    :width="1000"
    :height="260"
  />
</template>
```

### Header actions

The `actions` slot adds controls to the header, such as a period select or an export button.

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';
import { Chart } from '@artisanpack-ui/vue/data';
</script>

<template>
  <Chart title="Weekly revenue" :labels="weeks" :series="revenue">
    <template #actions>
      <Button size="sm" variant="ghost" color="neutral" leading-icon="download">Export</Button>
    </template>
  </Chart>
</template>
```

## Props

| Prop          | Type                                                    | Default      | Description                                                                               |
| ------------- | ------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `type`        | `'bar' \| 'line' \| 'area' \| 'donut'`                  | `'bar'`      | Bars (the first series), lines, lines with a fill, or a donut. Emitted as `data-type`.    |
| `series`      | `readonly ChartSeries[] \| readonly (number \| null)[]` | —            | Required. `[{ name, data }]`, or a plain array of values for one series named by `title`. |
| `labels`      | `readonly string[]`                                     | —            | The categories: x-axis labels, or the donut's slices.                                     |
| `title`       | `string`                                                | —            | Required. The heading. It names the plot and the table.                                   |
| `description` | `string`                                                | —            | Supporting text under the title.                                                          |
| `actions`     | `string`                                                | —            | Header controls as text. The `actions` slot replaces it.                                  |
| `tabular`     | `boolean`                                               | `false`      | Shows the data table under the plot (the design system's `showTable`).                    |
| `prefix`      | `string`                                                | —            | Printed before every value, such as `$`.                                                  |
| `suffix`      | `string`                                                | —            | Printed after every value, such as `%`.                                                   |
| `notation`    | `'standard' \| 'compact'`                               | `'standard'` | `standard` (12,500) or `compact` ($12.5k).                                                |
| `width`       | `number`                                                | `520`        | The plot's `viewBox` width. Cartesian charts only.                                        |
| `height`      | `number`                                                | `220`        | The plot's `viewBox` height. Cartesian charts only.                                       |
| `classes`     | `Partial<Record<ChartPart, string>>`                    | —            | Extra classes per [part](#parts).                                                         |

`class`, `style` and every other attribute go to the root `<div>`.

### Series shape

| Key    | Type                 | Description                                                                                                                          |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `name` | `string`             | The series' name, in the legend, the tooltip and the table's column header.                                                          |
| `data` | `readonly unknown[]` | The values, lined up with `labels`: numbers, `{ x, y }` points or `[x, y]` pairs. Anything that isn't a finite number becomes a gap. |

Series take the chart colors `--apui-chart-1` to `--apui-chart-6` in order, then repeat. Each mark, line, area, dot and swatch carries `data-series` with its color number.

## Slots

| Slot      | Description                                          |
| --------- | ---------------------------------------------------- |
| `actions` | Controls in the header. Replaces the `actions` prop. |

## Events

Chart has no events of its own. Listeners fall through to the root `<div>`.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part          | Element          | Description                                                                                         |
| ------------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| `root`        | `div`            | The card, `.apui-card.apui-chart`.                                                                  |
| `header`      | `div`            | The title, description, legend and actions.                                                         |
| `title`       | `h3`             | The heading.                                                                                        |
| `description` | `p`              | The supporting text.                                                                                |
| `actions`     | `div`            | The header controls.                                                                                |
| `legend`      | `ul`             | The series legend (two or more series), or the donut's slices with their shares.                    |
| `swatch`      | `span`           | A legend item's color. `aria-hidden`.                                                               |
| `body`        | `div`            | The plot, the donut legend and the tooltip.                                                         |
| `plot`        | `svg`            | The plot, a `role="group"` named by the title.                                                      |
| `grid`        | `line`           | A horizontal grid line.                                                                             |
| `axis`        | `text`           | A tick or category label.                                                                           |
| `mark`        | `path` or `rect` | A bar, a donut slice, or a line or area chart's focus target per category. Focusable, `role="img"`. |
| `line`        | `path`           | A series' line.                                                                                     |
| `area`        | `path`           | A series' fill. `area` type only.                                                                   |
| `point`       | `g`              | The crosshair and dots for one category, shown on hover and focus.                                  |
| `crosshair`   | `line`           | The vertical line at the hovered category.                                                          |
| `dot`         | `circle`         | A series' value at the hovered category.                                                            |
| `value`       | `text` or `span` | The first series' peak label on the plot, or a donut slice's share in the legend.                   |
| `tooltip`     | `div`            | The tooltip. `aria-hidden`, since the marks carry the same text.                                    |
| `table`       | `table`          | The data table. Only rendered with `tabular`.                                                       |

## Types

```ts
import type {
  ChartNotation,
  ChartPart,
  ChartProps,
  ChartSeries,
  ChartType,
} from '@artisanpack-ui/vue/data';
```

| Type            | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `ChartProps`    | The component's props.                                     |
| `ChartSeries`   | One series: `{ name?: string; data: readonly unknown[] }`. |
| `ChartType`     | `'bar' \| 'line' \| 'area' \| 'donut'`                     |
| `ChartNotation` | `'standard' \| 'compact'`                                  |
| `ChartPart`     | The 20 part names listed in [Parts](#parts).               |

## Accessibility

| Keys               | Action                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `Tab`, `Shift+Tab` | Move between the marks: bars, slices, or one target per category on line and area charts. Focusing a mark opens its tooltip. |
| `Escape`           | Closes the tooltip.                                                                                                          |

- Every chart has a title that names the plot (`role="group"`) and the table.
- Every mark is focusable, with its category and values as its accessible name, such as "W3: $8.2k". The tooltip opens on hover and on keyboard focus.
- The grid, axis labels, lines, areas and the peak label are hidden from assistive technology: the marks and the table carry the data.
- A legend shows for two or more series. Values are always reachable as labels, in the tooltip or in the table, never by color alone. Some light-mode chart colors sit under 3:1, so turn on `tabular` when exact values matter.
- The plot stays left-to-right in every direction. The header and legend mirror in RTL.

## Related

- [Chart in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/chart): anatomy, tokens and live examples.
- [Sparkline](../display/sparkline.md) for a word-sized trend without axes.
- [KpiCard](../display/kpi-card.md) for a headline metric with a trend.
- [Table](table.md) for tabular data.
