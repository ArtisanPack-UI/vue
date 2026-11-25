---
title: Range
menu_order: 150
meta_description: The Vue Range component. A slider for one value or a from-to range, with marks, value bubbles and formatting, with every prop and part.
---

# Range

A slider for one value, or two thumbs for a from–to range. Each thumb is a native `<input type="range">` laid over the drawn track, so the platform supplies the slider role, keys and touch. Use it when an approximate value is fine, such as a search radius or a price range. For exact numbers, use an [Input](input.md) with `type="number"`.

```ts
import { Range } from '@artisanpack-ui/vue/form';
// or
import { Range } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Range } from '@artisanpack-ui/vue/form';

const volume = ref(40);
</script>

<template>
  <Range v-model="volume" label="Volume" />
</template>
```

### Min, max and step

The range runs from `min` to `max` in steps of `step`, which default to `0`, `100` and `1`.

```vue
<template>
  <Range v-model="radius" label="Search radius" :min="5" :max="50" :step="5" />
</template>
```

Without a value, a single thumb starts at the midpoint, as the native input does.

### Formatting the value

`format` sets how a value reads in the bubble and in `aria-valuetext`. `{value}` is replaced with the number.

```vue
<template>
  <Range v-model="radius" label="Search radius" :max="50" format="{value} km" />
</template>
```

### Value bubble

`showValue` sets when the bubble above the thumb shows: `'focus'` (the default) while the thumb is focused or dragged, `'always'`, or `'never'`.

```vue
<template>
  <Range v-model="volume" label="Volume" show-value="always" />
</template>
```

### Dual thumbs

`dual` renders two thumbs for a from–to range. The value is `[from, to]`, and the thumbs can't cross. Without a value, the thumbs start at `min` and `max`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Range } from '@artisanpack-ui/vue/form';

const price = ref<[number, number]>([200, 500]);
</script>

<template>
  <Range v-model="price" label="Price" dual :min="100" :max="700" :step="10" format="${value}k" />
</template>
```

Each thumb is named by the label plus its thumb name, "Minimum" or "Maximum" by default. Translate or change them with `thumbLabels`. In a form, both inputs post into `name[]`, so `name="price"` submits `price[]` twice.

### Marks

`marks` places labels under the track at their values. The marks are `aria-hidden`, so they repeat information the thumb already gives.

```vue
<template>
  <Range
    v-model="level"
    label="Level"
    :max="4"
    :marks="[
      { value: 0, label: 'Off' },
      { value: 2, label: 'Medium' },
      { value: 4, label: 'Max' },
    ]"
  />
</template>
```

### Colors, sizes and states

```vue
<template>
  <Range v-model="value" label="Progress" color="success" />
  <Range v-model="value" label="Small" size="sm" />
  <Range v-model="value" label="Budget" hint="Monthly spend in dollars." />
  <Range v-model="value" label="Budget" error="Choose a budget of at least $100." />
  <Range v-model="value" label="Locked" disabled />
</template>
```

## Props

| Prop          | Type                                                                                               | Default                                            | Description                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `modelValue`  | `number \| [number, number]`                                                                       | —                                                  | The value, bound with `v-model`: a number, or `[from, to]` with `dual`.                              |
| `min`         | `number`                                                                                           | `0`                                                | The lowest value.                                                                                    |
| `max`         | `number`                                                                                           | `100`                                              | The highest value.                                                                                   |
| `step`        | `number`                                                                                           | `1`                                                | The step between values.                                                                             |
| `dual`        | `boolean`                                                                                          | `false`                                            | Two thumbs for a from–to range. They can't cross.                                                    |
| `showValue`   | `'never' \| 'focus' \| 'always'`                                                                   | `'focus'`                                          | When the value bubble shows. Emitted as `data-show-value`.                                           |
| `format`      | `string`                                                                                           | —                                                  | How a value reads in the bubble and `aria-valuetext`. `{value}` is the number, such as `{value} km`. |
| `marks`       | `RangeMark[]`                                                                                      | —                                                  | Labels under the track, placed at their values.                                                      |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'`                                        | The fill and thumb edge. Emitted as `data-color`.                                                    |
| `size`        | `'sm' \| 'md'`                                                                                     | `'md'`                                             | Thumb size. Emitted as `data-size`.                                                                  |
| `label`       | `string`                                                                                           | —                                                  | The visible label, linked to the first thumb. Without it, pass an `aria-label`.                      |
| `hint`        | `string`                                                                                           | —                                                  | Help text under the track, linked with `aria-describedby`.                                           |
| `error`       | `string`                                                                                           | —                                                  | Validation message. Marks the field invalid and is linked with `aria-describedby`.                   |
| `invalid`     | `boolean`                                                                                          | `false`                                            | Marks the field invalid without a message.                                                           |
| `disabled`    | `boolean`                                                                                          | `false`                                            | Disables the thumbs.                                                                                 |
| `thumbLabels` | `Partial<{ start: string; end: string }>`                                                          | `{ start: 'Minimum', end: 'Maximum' }`, translated | With `dual`, the names added to the label for each thumb.                                            |
| `classes`     | `Partial<Record<RangePart, string>>`                                                               | —                                                  | Extra classes per [part](#parts), such as `{ track: 'h-2' }`.                                        |

Range sets `inheritAttrs: false`. `class` goes to the root. Every other attribute, including `id`, `name`, `aria-*` and listeners, goes to the native input. With `dual`, attributes go to both inputs, with three exceptions: `name` gets a `[]` suffix, `aria-label` and `aria-labelledby` become part of each thumb's name, and other `aria-*` attributes go on the start thumb only. The end thumb's id is the field id plus `-end`.

## v-model

| Binding   | Type                         | Carries                                                          |
| --------- | ---------------------------- | ---------------------------------------------------------------- |
| `v-model` | `number \| [number, number]` | The thumb's number, or `[from, to]` with `dual`, on every input. |

Without `v-model`, Range keeps its own value, so the fill and bubble still follow the thumb.

## Slots

Range has no slots.

## Events

| Event                | Payload                      | Description                                               |
| -------------------- | ---------------------------- | --------------------------------------------------------- |
| `@update:modelValue` | `number \| [number, number]` | The value changed: a number, or `[from, to]` with `dual`. |

Other listeners fall through to the native input, or to both inputs with `dual`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element | Description                                                                                                                      |
| --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `root`    | `div`   | The field, `.apui-range`. Carries `data-size`, `data-color`, `data-show-value`, `data-dual`, `data-invalid` and `data-disabled`. |
| `label`   | `label` | The visible label.                                                                                                               |
| `track`   | `div`   | The drawn track that holds the fill, inputs and thumbs.                                                                          |
| `fill`    | `div`   | The filled part of the track.                                                                                                    |
| `control` | `input` | A native range input. Carries `data-thumb="start"` or `"end"`.                                                                   |
| `thumb`   | `span`  | The drawn thumb. `aria-hidden`, with `data-thumb`.                                                                               |
| `bubble`  | `span`  | The value bubble inside the thumb. Not rendered when `showValue` is `'never'`.                                                   |
| `marks`   | `div`   | The row of marks. `aria-hidden`.                                                                                                 |
| `mark`    | `span`  | One mark.                                                                                                                        |
| `hint`    | `p`     | The hint text.                                                                                                                   |
| `error`   | `p`     | The error text with its icon.                                                                                                    |

## Types

```ts
import type {
  RangeColor,
  RangeEmits,
  RangeMark,
  RangePart,
  RangeProps,
  RangeShowValue,
  RangeSize,
  RangeValue,
} from '@artisanpack-ui/vue/form';
```

| Type             | Description                                  |
| ---------------- | -------------------------------------------- |
| `RangeProps`     | The component's props.                       |
| `RangeEmits`     | The component's events.                      |
| `RangeValue`     | `number \| [number, number]`                 |
| `RangeMark`      | `{ value: number; label: string }`           |
| `RangeShowValue` | `'never' \| 'focus' \| 'always'`             |
| `RangeColor`     | The eight semantic colors.                   |
| `RangeSize`      | `'sm' \| 'md'`                               |
| `RangePart`      | The part names in the [Parts](#parts) table. |

## Accessibility

| Keys                      | Action                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ArrowRight` / `ArrowUp`  | Increases the value by `step`. `ArrowRight` follows the text direction, so it decreases in right-to-left layouts. |
| `ArrowLeft` / `ArrowDown` | Decreases the value by `step`. `ArrowLeft` follows the text direction, so it increases in right-to-left layouts.  |
| `PageUp` / `PageDown`     | Changes the value by a larger step.                                                                               |
| `Home` / `End`            | Jumps to `min` or `max`.                                                                                          |

- Each thumb is a native range input, so the platform supplies `role="slider"`, the keys and touch.
- Give every Range a `label`, or an `aria-label`.
- With `format`, `aria-valuetext` carries the formatted value, such as "$200k".
- With `dual`, each thumb is named by the label plus its thumb label, such as "Price Minimum", and the thumbs can't cross.
- The fill and thumbs follow the text direction. Under right-to-left layouts the track fills from the right.
- The thumb has a 24px hit area.
- Disabled uses the disabled text color for the fill and edge, never opacity alone.
- Shows a visible focus ring on the thumb while its input has `:focus-visible`.

## Related

- [Range in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/range): anatomy, tokens and live examples.
- [Input](input.md) for exact numbers.
- [Rating](rating.md) for scores.
