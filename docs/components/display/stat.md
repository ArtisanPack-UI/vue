---
title: Stat
menu_order: 120
meta_description: The Vue Stat component. A headline number with its label, unit, icon, change and context, with sizes, colors, emphasis and bare layouts.
---

# Stat

A headline number with its label, change and context. It renders a `<div class="apui-stat">` with the label and an icon tile on top, the value, and a foot with the change and a description. The change is an arrow and text, never color alone. Use a row of Stats for a dashboard summary.

```ts
import { Stat } from '@artisanpack-ui/vue/display';
// or
import { Stat } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Stat } from '@artisanpack-ui/vue/display';
</script>

<template>
  <Stat
    label="Total revenue"
    value="$7,415,644"
    icon="wallet"
    color="info"
    :change="-5.4"
    description="vs last month"
  />
</template>
```

`value` is shown as is, so format it first. The default slot replaces it when you need markup.

### The change

`change` takes a percentage. It's shown with one decimal and no sign ("5.4%"), and its sign sets the trend: an up, down or flat arrow plus hidden text ("Decrease") for screen readers. `delta` takes the change as text instead and wins over `change`. `trend` sets the direction explicitly. A `delta` without a `trend` or `change` shows no arrow and no hidden text.

```vue
<template>
  <Stat label="Conversion" value="10.87" unit="%" :change="2.5" description="vs last month" />
  <Stat label="Hours listened" value="34.6" delta="6.2 hrs" trend="up" description="this week" />
  <Stat label="Refunds" value="12" delta="0" trend="flat" />
</template>
```

### Sizes, colors and emphasis

`size` sets the value's type style. `color` tints the icon tile and the emphasis fill. `emphasis` adds a soft fill in `color`, for the one stat that matters most in a row.

```vue
<template>
  <div class="grid grid-cols-3 gap-4">
    <Stat
      label="Total income"
      value="$348,261"
      icon="wallet"
      color="primary"
      :change="10.9"
      emphasis
    />
    <Stat label="Profit" value="$15,708.98" icon="trending-up" color="success" :change="8.1" />
    <Stat size="sm" label="Visits" value="721K" :change="11" />
  </div>
</template>
```

### Inside a card

`bare` drops the container, for a stat inside a [Card](../layout/card.md) or another surface.

```vue
<template>
  <Card>
    <Stat bare size="lg" label="Amount invested" value="367K" :change="11" />
  </Card>
</template>
```

### Custom value and icon

The default slot replaces the value, and the `icon` slot replaces the named icon.

```vue
<template>
  <Stat label="Rating" unit="/ 5">
    <strong>4.8</strong>
    <template #icon>
      <MyStarIcon />
    </template>
  </Stat>
</template>
```

## Props

| Prop          | Type                                                                                               | Default                   | Description                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| `label`       | `string`                                                                                           | —                         | What the number measures.                                                               |
| `value`       | `string \| number`                                                                                 | —                         | The number, already formatted. The default slot replaces it.                            |
| `modelValue`  | `string \| number`                                                                                 | —                         | The same as `value`, under the design-system kit's Vue spelling. `value` wins.          |
| `unit`        | `string`                                                                                           | —                         | A unit after the value, smaller and muted.                                              |
| `icon`        | `string`                                                                                           | —                         | A registry icon name for the tile. Decorative. The `icon` slot replaces it.             |
| `delta`       | `string`                                                                                           | —                         | The change as text. Takes precedence over `change`.                                     |
| `change`      | `number`                                                                                           | —                         | The change as a percentage, shown with one decimal. Sets `trend` from its sign.         |
| `trend`       | `'up' \| 'down' \| 'flat'`                                                                         | from the sign of `change` | The change's direction: an arrow and hidden text. Emitted as `data-trend` on the delta. |
| `description` | `string`                                                                                           | —                         | Context after the delta, such as "vs last month".                                       |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                                             | `'md'`                    | The value's type style. Emitted as `data-size`.                                         |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'`               | Tints the icon tile and the emphasis fill. Emitted as `data-color`.                     |
| `emphasis`    | `boolean`                                                                                          | `false`                   | A soft fill in `color`. Emitted as `data-emphasis`.                                     |
| `bare`        | `boolean`                                                                                          | `false`                   | No container, for a stat inside a Card. Emitted as `data-bare`.                         |
| `upLabel`     | `string`                                                                                           | `'Increase'`, translated  | Hidden text before an up delta.                                                         |
| `downLabel`   | `string`                                                                                           | `'Decrease'`, translated  | Hidden text before a down delta.                                                        |
| `flatLabel`   | `string`                                                                                           | `'No change'`, translated | Hidden text before a flat delta.                                                        |
| `classes`     | `Partial<Record<StatPart, string>>`                                                                | —                         | Extra classes per [part](#parts).                                                       |

`class`, `style` and every other attribute go to the root `<div>`.

Stat takes `modelValue`, but it never emits `update:modelValue`: `v-model` only passes the value in.

## Slots

| Slot      | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `default` | Replaces `value`. The unit still follows it.                    |
| `icon`    | Replaces the icon from `icon`. Rendered in the decorative tile. |

## Events

Stat has no events of its own. Listeners fall through to the root `<div>`.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part          | Element | Description                                                                      |
| ------------- | ------- | -------------------------------------------------------------------------------- |
| `root`        | `div`   | The stat, `.apui-stat`.                                                          |
| `top`         | `div`   | The label and icon row. Only rendered with a label or an icon.                   |
| `label`       | `span`  | The label.                                                                       |
| `icon`        | `span`  | The icon tile. `aria-hidden`.                                                    |
| `value`       | `span`  | The value and unit.                                                              |
| `unit`        | `span`  | The unit.                                                                        |
| `foot`        | `span`  | The delta and description. Only rendered with either.                            |
| `delta`       | `span`  | The change: hidden direction text, the arrow and the text. Carries `data-trend`. |
| `description` | `span`  | The context text.                                                                |

## Types

```ts
import type {
  StatColor,
  StatPart,
  StatProps,
  StatSize,
  StatTrend,
} from '@artisanpack-ui/vue/display';
```

| Type        | Description                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `StatProps` | The component's props.                                                                            |
| `StatColor` | The eight semantic colors.                                                                        |
| `StatSize`  | `'sm' \| 'md' \| 'lg'`                                                                            |
| `StatTrend` | `'up' \| 'down' \| 'flat'`                                                                        |
| `StatPart`  | `'root' \| 'top' \| 'label' \| 'icon' \| 'value' \| 'unit' \| 'foot' \| 'delta' \| 'description'` |

## Accessibility

Stat isn't interactive and has no keyboard behavior.

- The change is visible text with an arrow, plus a hidden direction label (`upLabel`, `downLabel`, `flatLabel`): color is never the only signal.
- The value uses tabular figures. The label and description keep a 4.5:1 contrast on the default and emphasis fills.
- Up and down deltas keep a 4.5:1 contrast in success and error text.
- The icon tile is decorative and hidden from assistive technology.

## Related

- [Stat in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/stat): anatomy, tokens and live examples.
- [KpiCard](kpi-card.md) for a stat with a sparkline and a target in a card.
- [Sparkline](sparkline.md) for a word-sized trend.
- [Card](../layout/card.md) for a container around a bare stat.
