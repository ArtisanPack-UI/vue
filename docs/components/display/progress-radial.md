---
title: ProgressRadial
menu_order: 100
meta_description: The Vue ProgressRadial component. Circular progress with the value in the center, determinate or indeterminate, with size, thickness and color.
---

# ProgressRadial

Circular progress with the value in the center. It renders a `<span class="apui-progress-radial" role="progressbar">` around an SVG ring, with the same semantics as [Progress](progress.md). Use it in compact spots such as cards and dashboards.

```ts
import { ProgressRadial } from '@artisanpack-ui/vue/display';
// or
import { ProgressRadial } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ProgressRadial } from '@artisanpack-ui/vue/display';
</script>

<template>
  <ProgressRadial :value="72" label="Complete" />
</template>
```

The center shows the percentage, with the `label` as a caption under it. The label names the progressbar. `value` is clamped to the range from 0 to `max`.

### Size, thickness and color

`size` is the ring's diameter and `thickness` its stroke width, both in pixels.

```vue
<template>
  <ProgressRadial :value="40" :size="48" :thickness="4" color="success" aria-label="Storage used" />
  <ProgressRadial :value="90" :size="96" :thickness="8" color="warning" label="Quota" />
</template>
```

### Value text

`valueText` replaces the percentage in the center and is read as `aria-valuetext`.

```vue
<template>
  <ProgressRadial :value="3" :max="4" value-text="3/4" label="Tasks" />
</template>
```

### Small rings

`hideValue` leaves the center empty. A `label` then becomes the progressbar's `aria-label` instead of a visible caption.

```vue
<template>
  <ProgressRadial :value="60" :size="24" :thickness="3" hide-value label="Sync progress" />
</template>
```

### Indeterminate

When the amount isn't known, `indeterminate` spins a quarter arc and leaves `aria-valuenow` out. The center shows only the label, or `valueText` if you pass it. The spin slows when the user prefers reduced motion.

```vue
<template>
  <ProgressRadial indeterminate label="Loading" />
</template>
```

## Props

| Prop            | Type                                                                                               | Default     | Description                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `value`         | `number`                                                                                           | `0`         | The progress, from 0 to `max`. Clamped.                                                                        |
| `modelValue`    | `number`                                                                                           | —           | The design system's Vue spelling of `value`, used when `value` isn't set. Prefer `value`.                      |
| `max`           | `number`                                                                                           | `100`       | The value at completion.                                                                                       |
| `indeterminate` | `boolean`                                                                                          | `false`     | The amount isn't known: a quarter arc spins, and `aria-valuenow` is left out. Emitted as `data-indeterminate`. |
| `size`          | `number`                                                                                           | `64`        | The ring's diameter in px. Set as the `--apui-_s` custom property.                                             |
| `thickness`     | `number`                                                                                           | `6`         | The ring's stroke width in px.                                                                                 |
| `color`         | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | The bar's color. Emitted as `data-color`.                                                                      |
| `label`         | `string`                                                                                           | —           | A caption under the value that also names the progressbar. With `hideValue`, it's the `aria-label`.            |
| `valueText`     | `string`                                                                                           | —           | The value in words, shown in the center and read as `aria-valuetext`.                                          |
| `hideValue`     | `boolean`                                                                                          | `false`     | Leaves the center empty, for small rings.                                                                      |
| `classes`       | `Partial<Record<ProgressRadialPart, string>>`                                                      | —           | Extra classes per [part](#parts), such as `{ value: '…', bar: '…' }`.                                          |

ProgressRadial sets `inheritAttrs: false` and merges `class`, `style` and every other attribute, including `aria-label`, onto the root `<span>`.

ProgressRadial takes `modelValue`, but it never emits `update:modelValue`: it's a display, so `v-model` only passes the value in.

## Slots

ProgressRadial has no slots.

## Events

ProgressRadial has no events.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part    | Element  | Description                                                |
| ------- | -------- | ---------------------------------------------------------- |
| `root`  | `span`   | The progressbar, `.apui-progress-radial`.                  |
| `svg`   | `svg`    | The ring. `aria-hidden`.                                   |
| `track` | `circle` | The ring's track.                                          |
| `bar`   | `circle` | The filled arc.                                            |
| `value` | `span`   | The center: the percentage or `valueText`, and the label.  |
| `label` | `span`   | The caption under the value. Its id names the progressbar. |

## Types

```ts
import type {
  ProgressColor,
  ProgressRadialPart,
  ProgressRadialProps,
} from '@artisanpack-ui/vue/display';
```

| Type                  | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `ProgressRadialProps` | The component's props.                                            |
| `ProgressRadialPart`  | `'root' \| 'svg' \| 'track' \| 'bar' \| 'value' \| 'label'`       |
| `ProgressColor`       | The eight semantic colors, exported with [Progress](progress.md). |

## Accessibility

ProgressRadial isn't interactive and has no keyboard behavior.

- The root is `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax` and `aria-valuenow`. `aria-valuenow` is left out while indeterminate.
- It's named by its `label`: through `aria-labelledby`, or as `aria-label` with `hideValue`. Without a label, pass `aria-label`.
- `valueText` is read as `aria-valuetext`.
- The ring fills in the reading direction: clockwise in LTR, counterclockwise in RTL.
- The spin slows under reduced motion.

## Related

- [ProgressRadial in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/progress-radial): anatomy, tokens and live examples.
- [Progress](progress.md) for a linear bar.
- [Loading](../feedback/loading.md) for a spinner.
