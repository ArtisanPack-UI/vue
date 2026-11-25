---
title: ColorPicker
menu_order: 50
meta_description: The Vue ColorPicker component. A color field with a popover area, hue and opacity sliders, formats, eyedropper and swatches, with every prop.
---

# ColorPicker

A color field. It renders a swatch button and a text value, like an [Input](input.md), and the swatch opens a popover with a saturation and brightness area, hue and opacity sliders, a format select (HEX, RGB, HSL, OKLCH), an eyedropper and preset swatches. The text value stays outside the popover, so people can always type a color. Use it for brand colors, labels and theme settings.

```ts
import { ColorPicker } from '@artisanpack-ui/vue/form';
// or
import { ColorPicker } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@artisanpack-ui/vue/form';

const accent = ref('#1f74bf');
</script>

<template>
  <ColorPicker v-model="accent" label="Accent color" name="accent" />
</template>
```

### Formats

`v-model` takes a color as text in any of the four formats and reports it in the current `format`. The format select in the popover switches the format and emits `format-change`; the value is then reported in the new format.

```vue
<template>
  <ColorPicker v-model="brand" label="Brand color" format="oklch" @format-change="saveFormat" />
</template>
```

Typing in the text value sets the color when the user presses Enter or leaves the field.

### Opacity

The opacity slider is on by default, and the text includes the alpha when it isn't 1. Set `:alpha="false"` to keep every value opaque: the slider is left out and the alpha is dropped from the text.

```vue
<template>
  <ColorPicker v-model="label" label="Label color" :alpha="false" />
</template>
```

### Swatches

`swatches` adds preset colors to the popover, as text in any format. Each swatch is a button named by its value, with `aria-pressed` on the current one.

```vue
<template>
  <ColorPicker
    v-model="accent"
    label="Accent color"
    :swatches="['#1f74bf', '#0b9488', '#c92f33', '#7c3aed']"
  />
</template>
```

### Popover

The popover opens from the swatch button. Bind `v-model:open` to control it. It's teleported to the end of `<body>`; set `:portal="false"` to render it in place, for example inside a dialog that traps focus. The eyedropper is hidden in browsers without the EyeDropper API.

### Hint, error and states

`hint`, `error`, `invalid`, `disabled` and `required` work as on [Input](input.md). `disabled` also disables the swatch button and every control in the popover. `size` matches Input's heights.

## Props

| Prop              | Type                                       | Default                                      | Description                                                                                        |
| ----------------- | ------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `modelValue`      | `string`                                   | —                                            | The color as text in any format, bound with `v-model`; reported in the current format.             |
| `format`          | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'`       | `'hex'`                                      | The text format. The format select switches it. Emitted as `data-format`.                          |
| `alpha`           | `boolean`                                  | `true`                                       | Offers opacity. Off keeps every value opaque.                                                      |
| `swatches`        | `string[]`                                 | `[]`                                         | Preset colors as text, shown in the popover.                                                       |
| `size`            | `'sm' \| 'md' \| 'lg'`                     | `'md'`                                       | Control height, matching Input. Emitted as `data-size`.                                            |
| `label`           | `string`                                   | —                                            | The visible label, linked to the text value.                                                       |
| `hint`            | `string`                                   | —                                            | Help text under the field, linked with `aria-describedby`.                                         |
| `error`           | `string`                                   | —                                            | Validation message. Marks the field invalid and is linked with `aria-describedby`.                 |
| `invalid`         | `boolean`                                  | `false`                                      | Marks the field invalid without a message.                                                         |
| `disabled`        | `boolean`                                  | `false`                                      | Disables the field and the popover's controls.                                                     |
| `required`        | `boolean`                                  | `false`                                      | Marks the field required and shows the required mark.                                              |
| `open`            | `boolean`                                  | `false`                                      | Whether the popover is open, bound with `v-model:open`.                                            |
| `portal`          | `boolean`                                  | `true`                                       | Renders the popover at the end of the body (Teleport).                                             |
| `triggerLabel`    | `string`                                   | `'Choose a color'`, translated               | The swatch button's and the popover's name.                                                        |
| `areaLabel`       | `string`                                   | `'Saturation and brightness'`, translated    | The area's name.                                                                                   |
| `hueLabel`        | `string`                                   | `'Hue'`, translated                          | The hue slider's name.                                                                             |
| `alphaLabel`      | `string`                                   | `'Opacity'`, translated                      | The opacity slider's name.                                                                         |
| `formatLabel`     | `string`                                   | `'Format'`, translated                       | The format select's name.                                                                          |
| `eyeDropperLabel` | `string`                                   | `'Pick a color from the screen'`, translated | The eyedropper's name.                                                                             |
| `swatchesLabel`   | `string`                                   | `'Swatches'`, translated                     | The preset group's name.                                                                           |
| `classes`         | `Partial<Record<ColorPickerPart, string>>` | —                                            | Extra classes per [part](#parts), such as `{ trigger: 'rounded-full' }`. Use `class` for the root. |

`class` goes to the root `<div>`. Every other attribute, including `id`, `name`, `aria-*` and listeners, goes to the text value `<input>`. An `id` you pass becomes the text value's id, and the other ids are built from it. Your own `aria-describedby` is kept and added after the hint and error ids.

## v-model

| Binding        | Type      | Carries                                                                             |
| -------------- | --------- | ----------------------------------------------------------------------------------- |
| `v-model`      | `string`  | The color as text in the current format, on every change, including while dragging. |
| `v-model:open` | `boolean` | Whether the popover is open.                                                        |

Passed, each prop is controlled: the picker reports a change and waits for the value you pass back. Not passed, the picker keeps its own value and open state.

## Slots

ColorPicker has no slots.

## Events

| Event                | Payload                              | Description                                       |
| -------------------- | ------------------------------------ | ------------------------------------------------- |
| `@update:modelValue` | `string`                             | The color changed, as text in the current format. |
| `@update:open`       | `boolean`                            | The popover opened or closed itself.              |
| `@format-change`     | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'` | The format select changed the format.             |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part                 | Element  | Description                                                                                              |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `root`               | `div`    | The field, `.apui-color-picker`. Carries `data-size`, `data-format`, `data-invalid` and `data-disabled`. |
| `label`              | `label`  | The visible label.                                                                                       |
| `required`           | `span`   | The `*` mark inside the label. `aria-hidden`.                                                            |
| `box`                | `div`    | The bordered box around the swatch button and the text value.                                            |
| `trigger`            | `button` | The swatch button that opens the popover.                                                                |
| `swatch`             | `span`   | A color sample: in the trigger, and in each preset swatch.                                               |
| `control`            | `input`  | The text value.                                                                                          |
| `hint`               | `p`      | The help text.                                                                                           |
| `error`              | `p`      | The error message, with an alert icon.                                                                   |
| `positioner`         | `div`    | Positions the popover.                                                                                   |
| `content`            | `div`    | The popover, a named dialog.                                                                             |
| `area`               | `div`    | The saturation and brightness area.                                                                      |
| `areaBackground`     | `div`    | The area's gradient.                                                                                     |
| `areaThumb`          | `div`    | The area's thumb, a `role="slider"`.                                                                     |
| `channelSlider`      | `div`    | The hue or opacity slider.                                                                               |
| `channelSliderTrack` | `div`    | A slider's track.                                                                                        |
| `channelSliderThumb` | `div`    | A slider's thumb, a `role="slider"`.                                                                     |
| `transparencyGrid`   | `div`    | The checkerboard behind the opacity slider.                                                              |
| `row`                | `div`    | The row with the format select and the eyedropper.                                                       |
| `formatSelect`       | `select` | The format select.                                                                                       |
| `eyeDropperTrigger`  | `button` | The eyedropper. Hidden without the EyeDropper API.                                                       |
| `swatchGroup`        | `div`    | The preset swatches.                                                                                     |
| `swatchTrigger`      | `button` | One preset swatch.                                                                                       |

In the markup, part names of more than one word are kebab-case, such as `data-part="area-thumb"` and `data-part="eye-dropper-trigger"`.

## Types

```ts
import type {
  ColorPickerEmits,
  ColorPickerPart,
  ColorPickerProps,
  ColorPickerSize,
  ColorTextFormat,
} from '@artisanpack-ui/vue/form';
```

| Type               | Description                                  |
| ------------------ | -------------------------------------------- |
| `ColorPickerProps` | The component's props.                       |
| `ColorPickerEmits` | The component's events.                      |
| `ColorPickerSize`  | `'sm' \| 'md' \| 'lg'`                       |
| `ColorTextFormat`  | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'`         |
| `ColorPickerPart`  | The part names in the [Parts](#parts) table. |

## Accessibility

| Keys                                 | Action                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Tab`                                | Moves between the swatch button and the text value; in the popover, between the area, the sliders, the format select, the eyedropper and the swatches. |
| `Enter` / `Space`                    | On the swatch button, opens the popover; on a swatch, chooses it.                                                                                      |
| `ArrowLeft` / `ArrowRight`           | On the area, less or more saturation; on a slider, less or more of its channel. They follow the text direction.                                        |
| `ArrowUp` / `ArrowDown`              | On the area, more or less brightness; on a slider, more or less of its channel.                                                                        |
| `PageUp` / `PageDown`, `Shift+Arrow` | Larger steps.                                                                                                                                          |
| `Enter`                              | In the text value, sets the color from the typed text.                                                                                                 |
| `Escape`                             | Closes the popover and returns focus to the swatch button.                                                                                             |

- Always pass a visible `label`; it names the text value.
- The text value is always visible and typable, in any of the four formats, so the popover is never the only way to set a color.
- The area and sliders are `role="slider"` elements with `aria-valuetext` such as "72%, 75%", "208°" or "80%".
- The area and sliders mirror under RTL.
- The swatch button reports `aria-expanded` and `aria-controls`; the popover is a named dialog.
- Swatches are buttons named by their value, with `aria-pressed` on the current one, in a named group.
- Hint and error are linked to the text value with `aria-describedby`; invalid sets `aria-invalid`.
- Every built-in name is a prop, so you can translate it.

## Related

- [ColorPicker in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/color-picker): anatomy, tokens and live examples.
- [Input](input.md) for the shared field anatomy.
- [Popover](../layout/popover.md) for other floating panels.
