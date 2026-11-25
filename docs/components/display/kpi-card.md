---
title: KpiCard
menu_order: 80
meta_description: The Vue KpiCard component. A headline metric in a card, with its change, a sparkline of its trend, progress toward a target and a period control.
---

# KpiCard

A headline metric in a card. It's built from [Stat](stat.md), with a [Sparkline](sparkline.md) of the metric's trend beside the value and a [Progress](progress.md) bar toward a target under it. It renders a `<div class="apui-card apui-kpi-card">`. Use it for the key numbers at the top of a dashboard.

```ts
import { KpiCard } from '@artisanpack-ui/vue/display';
// or
import { KpiCard } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { KpiCard, type KpiCardStat } from '@artisanpack-ui/vue/display';

const revenue: KpiCardStat = {
  label: 'Revenue',
  value: '$18,420',
  icon: 'wallet',
  color: 'primary',
  change: 12.4,
  description: 'vs last month',
};
</script>

<template>
  <KpiCard :stat="revenue" />
</template>
```

`stat` takes Stat's props as one object: `label`, `value`, `unit`, `icon`, `color`, `delta`, `change`, `trend`, `description` and the hidden trend labels. The change works as it does in [Stat](stat.md#the-change).

### Sparkline

`sparkline` takes the recent values, oldest first, and draws them as an area sparkline beside the value. `sparklineLabel` replaces its accessible label. `{first}`, `{latest}`, `{min}`, `{max}` and `{count}` are filled in.

```vue
<template>
  <KpiCard
    :stat="revenue"
    :sparkline="[12, 14, 13, 16, 15, 18]"
    sparkline-label="Revenue from {first}K to {latest}K"
  />
</template>
```

### Target

`target` adds a progress bar toward a goal, tinted in the stat's `color` (primary when the color is neutral). Show it only when a goal exists. `targetLabel` sets the text at the end of the row. `{percent}`, `{value}` and `{max}` are filled in. The percentage is clamped from 0 to 100.

```vue
<template>
  <KpiCard
    :stat="revenue"
    :target="{ value: 18420, max: 25000, label: 'Goal $25,000' }"
    target-label="{percent}% reached"
  />
</template>
```

### Period control

The `period` slot puts a control, such as a [Select](../form/select.md), in the label row.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@artisanpack-ui/vue/form';
import { KpiCard } from '@artisanpack-ui/vue/display';

const period = ref('30d');
const periods = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];
</script>

<template>
  <KpiCard :stat="revenue">
    <template #period>
      <Select v-model="period" :options="periods" size="sm" aria-label="Period" />
    </template>
  </KpiCard>
</template>
```

## Props

| Prop             | Type                                   | Default                                        | Description                                                                                                  |
| ---------------- | -------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `stat`           | `KpiCardStat`                          | `{}`                                           | The metric, with Stat's props. See [Stat shape](#stat-shape).                                                |
| `sparkline`      | `readonly number[]`                    | —                                              | The recent values, oldest first, drawn as an area Sparkline beside the value. Non-finite values are skipped. |
| `sparklineLabel` | `string`                               | `'Trend from {first} to {latest}'`, translated | The sparkline's accessible label.                                                                            |
| `target`         | `KpiCardTarget`                        | —                                              | Progress toward a goal. See [Target shape](#target-shape).                                                   |
| `targetLabel`    | `string`                               | `'{percent}% of goal'`, translated             | The text at the end of the target row. `{percent}`, `{value}` and `{max}` are filled in.                     |
| `period`         | `string`                               | —                                              | A period control as text. Usually the `period` slot instead, which overrides it.                             |
| `classes`        | `Partial<Record<KpiCardPart, string>>` | —                                              | Extra classes per [part](#parts).                                                                            |

`class`, `style` and every other attribute go to the root `<div>`.

### Stat shape

| Key           | Type                       | Default                   | Description                                                                  |
| ------------- | -------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `label`       | `string`                   | —                         | What the metric measures.                                                    |
| `value`       | `string \| number`         | —                         | The number, already formatted.                                               |
| `unit`        | `string`                   | —                         | A unit after the value.                                                      |
| `icon`        | `string`                   | —                         | A registry icon name for the tile.                                           |
| `color`       | `StatColor`                | `'neutral'`               | Tints the icon tile and the target bar. Emitted as `data-color` on the root. |
| `delta`       | `string`                   | —                         | The change as text. Takes precedence over `change`.                          |
| `change`      | `number`                   | —                         | The change as a percentage. Sets `trend` from its sign.                      |
| `trend`       | `'up' \| 'down' \| 'flat'` | —                         | The change's direction.                                                      |
| `description` | `string`                   | —                         | Context after the delta.                                                     |
| `upLabel`     | `string`                   | `'Increase'`, translated  | Hidden text before an up delta.                                              |
| `downLabel`   | `string`                   | `'Decrease'`, translated  | Hidden text before a down delta.                                             |
| `flatLabel`   | `string`                   | `'No change'`, translated | Hidden text before a flat delta.                                             |

### Target shape

| Key     | Type     | Default | Description                                                                                          |
| ------- | -------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `value` | `number` | —       | Required. The progress, from 0 to `max`.                                                             |
| `max`   | `number` | `100`   | The goal's value.                                                                                    |
| `label` | `string` | —       | Names the goal and the bar, such as "Goal $25,000". Without it, the bar is named by the target text. |

## Slots

| Slot     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `period` | A period control in the label row. Overrides the `period` prop. |

## Events

KpiCard has no events of its own. Listeners fall through to the root `<div>`.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part          | Element | Description                             |
| ------------- | ------- | --------------------------------------- |
| `root`        | `div`   | The card, `.apui-card.apui-kpi-card`.   |
| `top`         | `div`   | The label, period and icon row.         |
| `label`       | `span`  | The metric's label.                     |
| `period`      | `div`   | The period control.                     |
| `icon`        | `span`  | The icon tile. `aria-hidden`.           |
| `row`         | `div`   | The summary and the sparkline.          |
| `summary`     | `div`   | The value and the foot.                 |
| `value`       | `span`  | The value and unit.                     |
| `unit`        | `span`  | The unit.                               |
| `foot`        | `span`  | The delta and description.              |
| `delta`       | `span`  | The change, with `data-trend`.          |
| `description` | `span`  | The context text.                       |
| `sparkline`   | `svg`   | The Sparkline.                          |
| `target`      | `div`   | The Progress bar and its text.          |
| `targetText`  | `div`   | The target's label and percentage text. |

## Types

```ts
import type {
  KpiCardPart,
  KpiCardProps,
  KpiCardStat,
  KpiCardTarget,
} from '@artisanpack-ui/vue/display';
```

| Type            | Description                                  |
| --------------- | -------------------------------------------- |
| `KpiCardProps`  | The component's props.                       |
| `KpiCardStat`   | The metric. See [Stat shape](#stat-shape).   |
| `KpiCardTarget` | The goal. See [Target shape](#target-shape). |
| `KpiCardPart`   | The 15 part names listed in [Parts](#parts). |

## Accessibility

KpiCard has no keyboard behavior of its own. A control in the `period` slot keeps its own.

- The sparkline is `role="img"` with a label that states its first and latest values.
- The target bar is a labeled `progressbar`, with its percentage as text beside it.
- The change follows Stat: visible text with an arrow and a hidden direction label, never color alone.
- The icon tile is decorative and hidden from assistive technology.
- Give a period control an accessible name, such as `aria-label="Period"`.

## Related

- [KpiCard in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/kpi-card): anatomy, tokens and live examples.
- [Stat](stat.md) for a metric without a card.
- [Sparkline](sparkline.md) and [Progress](progress.md), the parts it's built from.
- [Card](../layout/card.md) for other card content.
