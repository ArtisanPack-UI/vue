---
title: Progress
menu_order: 90
meta_description: The Vue Progress component. A linear progress bar, determinate, indeterminate or segmented, with a label, value text, sizes and colors.
---

# Progress

A linear progress bar. It renders a `<div class="apui-progress" role="progressbar">` with an optional head (label and value) above a track. It can show a known amount, an unknown amount (indeterminate) or steps (segmented). For a circular indicator, use [ProgressRadial](progress-radial.md). For a spinner, use [Loading](../feedback/loading.md).

```ts
import { Progress } from '@artisanpack-ui/vue/display';
// or
import { Progress } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Progress } from '@artisanpack-ui/vue/display';
</script>

<template>
  <Progress :value="64" label="Uploading photos" />
</template>
```

With a `label`, the head shows the label and the percentage, and the label names the progressbar. `value` is clamped to the range from 0 to `max`. A `max` of 0 or less is treated as 100.

### Without a label

Without a label or `valueText`, there's no head, only the track. Name the progressbar with `aria-label`.

```vue
<template>
  <Progress :value="30" aria-label="Profile completeness" />
</template>
```

### Value text

`valueText` replaces the percentage in the head and is read as `aria-valuetext`.

```vue
<template>
  <Progress :value="8" :max="12" label="Lessons completed" value-text="8 of 12" />
</template>
```

### Indeterminate

When the amount isn't known, `indeterminate` slides a short bar along the track and leaves `aria-valuenow` out. The percentage isn't shown. The animation stops when the user prefers reduced motion.

```vue
<template>
  <Progress indeterminate label="Preparing your export" />
</template>
```

### Segmented

`segmented` splits the track into `max` segments, `value` of them done. Use it for steps.

```vue
<template>
  <Progress segmented :value="2" :max="5" label="Setup" value-text="Step 2 of 5" />
</template>
```

### Sizes and colors

```vue
<template>
  <Progress :value="40" size="sm" color="success" aria-label="Storage used" />
  <Progress :value="80" color="warning" aria-label="Quota used" />
  <Progress :value="95" size="lg" color="error" aria-label="Disk used" />
</template>
```

## Props

| Prop            | Type                                                                                               | Default     | Description                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `number`                                                                                           | `0`         | The progress, from 0 to `max`. Clamped.                                                                                       |
| `modelValue`    | `number`                                                                                           | —           | The design system's Vue spelling of `value`, used when `value` isn't set. Prefer `value`.                                     |
| `max`           | `number`                                                                                           | `100`       | The value at completion. With `segmented`, the number of segments.                                                            |
| `indeterminate` | `boolean`                                                                                          | `false`     | The amount isn't known: a short bar slides along the track, and `aria-valuenow` is left out. Emitted as `data-indeterminate`. |
| `segmented`     | `boolean`                                                                                          | `false`     | Splits the track into `max` segments, `value` of them done. Emitted as `data-segmented`.                                      |
| `size`          | `'sm' \| 'md' \| 'lg'`                                                                             | `'md'`      | The track's height. Emitted as `data-size`.                                                                                   |
| `color`         | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | The bar's color. Emitted as `data-color`.                                                                                     |
| `label`         | `string`                                                                                           | —           | What's progressing. Shown above the track and names the progressbar.                                                          |
| `valueText`     | `string`                                                                                           | —           | The value in words, such as "8 of 12". Shown in the head and read as `aria-valuetext`.                                        |
| `classes`       | `Partial<Record<ProgressPart, string>>`                                                            | —           | Extra classes per [part](#parts), such as `{ label: '…', bar: '…' }`.                                                         |

Progress sets `inheritAttrs: false` and merges `class`, `style` and every other attribute, including `aria-label`, onto the root `<div>`.

Progress takes `modelValue`, but it never emits `update:modelValue`: it's a display, so `v-model` only passes the value in.

## Slots

Progress has no slots.

## Events

Progress has no events.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part    | Element | Description                                                        |
| ------- | ------- | ------------------------------------------------------------------ |
| `root`  | `div`   | The progressbar, `.apui-progress`.                                 |
| `head`  | `div`   | The label and value row. Only rendered with a label or value text. |
| `label` | `span`  | The label. Its id names the progressbar.                           |
| `value` | `span`  | The percentage, or `valueText`.                                    |
| `track` | `div`   | The track.                                                         |
| `bar`   | `div`   | The filled bar, or one segment with `data-done` when done.         |

## Types

```ts
import type { ProgressColor, ProgressPart, ProgressProps } from '@artisanpack-ui/vue/display';
```

| Type            | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `ProgressProps` | The component's props.                                       |
| `ProgressColor` | The eight semantic colors. Shared with ProgressRadial.       |
| `ProgressPart`  | `'root' \| 'head' \| 'label' \| 'value' \| 'track' \| 'bar'` |

## Accessibility

Progress isn't interactive and has no keyboard behavior.

- The root is `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax` and `aria-valuenow`. `aria-valuenow` is left out while indeterminate.
- It's named by its `label` (`aria-labelledby`). Without one, pass `aria-label`.
- `valueText` is read as `aria-valuetext`.
- The track has an edge so it stays visible at 3:1 on every surface.
- The bar fills, and the indeterminate bar slides, in the reading direction. The animation stops under reduced motion.

## Related

- [Progress in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/progress): anatomy, tokens and live examples.
- [ProgressRadial](progress-radial.md) for a circular indicator.
- [Loading](../feedback/loading.md) for a spinner.
- [Steps](../navigation/steps.md) for a labeled multi-step flow.
