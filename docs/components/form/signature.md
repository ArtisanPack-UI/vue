---
title: Signature
menu_order: 190
meta_description: The Vue Signature component. Capture a signature by drawing, typing or uploading, as a PNG data URL, with every prop, label and part.
---

# Signature

Captures a signature by drawing, typing or uploading an image. Every mode gives the same value, a PNG data URL. Type mode is always offered, so people who can't draw with a pointer can still sign. Use it for agreements, deliveries and consent forms.

```ts
import { Signature } from '@artisanpack-ui/vue/form';
// or
import { Signature } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Signature } from '@artisanpack-ui/vue/form';

const signature = ref('');
</script>

<template>
  <Signature v-model="signature" label="Signature" hint="Olivia Rhye, November 25, 2026" />
</template>
```

The value is `''` until someone signs, then a `data:image/png;base64,…` URL. It goes back to `''` when they clear it.

### Modes

People switch between Draw, Type and Upload with the mode buttons. `modes` limits the modes offered, and `mode` sets the one shown first. `type` is always added, because it's the keyboard path. Modes always show in the order draw, type, upload, and a `mode` that isn't offered falls back to the first offered one.

```vue
<template>
  <Signature v-model="signature" label="Signature" :modes="['draw']" />
  <Signature v-model="signature" label="Signature" mode="type" />
</template>
```

The first renders Draw and Type. Switching modes starts over: the pad and the typed name clear, and the value goes back to `''`. `mode` is read once, when the component mounts.

- **Draw** draws on a canvas with a mouse, finger or stylus. Undo removes the last stroke.
- **Type** renders the typed name in a script font as a PNG on the signing line.
- **Upload** reads an image file and redraws it as a PNG, which drops metadata. Files that aren't images are ignored.

### Ink color

`penColor` sets the ink: `'default'` uses the text color, or pass one of the eight semantic colors. The ink keeps 4.5:1 contrast on the pad in every theme.

```vue
<template>
  <Signature v-model="signature" label="Signature" pen-color="primary" />
</template>
```

### Forms

Pass `name` to submit the value with a plain form. It goes on a hidden input that holds the data URL.

```vue
<template>
  <form method="post" action="/agreements">
    <Signature name="signature" label="Signature" required />
  </form>
</template>
```

Check on the server that the value is a PNG data URL before you store it.

### Translating the labels

Every built-in string has its own prop, such as `drawLabel`, `padLabel` and `clearedLabel`. Each defaults to its translated string. `placeholder` sets the text under the signing line.

```vue
<template>
  <Signature
    v-model="signature"
    label="Firma"
    placeholder="Firme sobre la línea"
    modes-label="Método de firma"
    draw-label="Dibujar"
    type-label="Escribir"
    upload-label="Subir"
    clear-label="Borrar"
    cleared-label="Firma borrada."
  />
</template>
```

### States

```vue
<template>
  <Signature v-model="signature" label="Signature" error="Sign to accept the terms." required />
  <Signature v-model="signature" label="Signature" disabled />
</template>
```

`disabled` stops drawing, typing and uploading, and disables the mode buttons and tools.

## Props

| Prop                 | Type                                                                                                            | Default                                                                             | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `modelValue`         | `string`                                                                                                        | —                                                                                   | The signature as a PNG data URL, or `''`. Bound with `v-model`.                               |
| `mode`               | `'draw' \| 'type' \| 'upload'`                                                                                  | `'draw'`                                                                            | The mode shown first. Read on mount.                                                          |
| `modes`              | `('draw' \| 'type' \| 'upload')[]`                                                                              | All three                                                                           | The modes offered. `type` is always added.                                                    |
| `penColor`           | `'default' \| 'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'`                                                                         | The ink color. Emitted as `data-pen-color`.                                                   |
| `label`              | `string`                                                                                                        | —                                                                                   | The visible label. It names the group. Without it, the group is named by `padLabel`.          |
| `hint`               | `string`                                                                                                        | —                                                                                   | Help text under the pad, such as who is signing and the date. Linked with `aria-describedby`. |
| `error`              | `string`                                                                                                        | —                                                                                   | Validation message. Marks the field invalid and is linked with `aria-describedby`.            |
| `invalid`            | `boolean`                                                                                                       | `false`                                                                             | Marks the field invalid without a message.                                                    |
| `disabled`           | `boolean`                                                                                                       | `false`                                                                             | Disables drawing, typing, uploading and the tools.                                            |
| `required`           | `boolean`                                                                                                       | `false`                                                                             | Shows the required mark and sets `aria-required` on the typed name.                           |
| `placeholder`        | `string`                                                                                                        | `'Sign above the line'`, translated                                                 | The text under the signing line.                                                              |
| `modesLabel`         | `string`                                                                                                        | `'Signature method'`, translated                                                    | The mode switch group's accessible name.                                                      |
| `drawLabel`          | `string`                                                                                                        | `'Draw'`, translated                                                                | The draw mode button.                                                                         |
| `typeLabel`          | `string`                                                                                                        | `'Type'`, translated                                                                | The type mode button.                                                                         |
| `uploadLabel`        | `string`                                                                                                        | `'Upload'`, translated                                                              | The upload mode button.                                                                       |
| `padLabel`           | `string`                                                                                                        | `'Signature pad. Draw with a mouse, finger or stylus, or choose Type.'`, translated | The canvas's accessible name.                                                                 |
| `typedLabel`         | `string`                                                                                                        | `'Type your full name'`, translated                                                 | The typed-name input's accessible name.                                                       |
| `uploadTriggerLabel` | `string`                                                                                                        | `'Choose an image'`, translated                                                     | The upload trigger's text.                                                                    |
| `undoLabel`          | `string`                                                                                                        | `'Undo stroke'`, translated                                                         | The icon-only undo button's accessible name.                                                  |
| `clearLabel`         | `string`                                                                                                        | `'Clear'`, translated                                                               | The clear button's text.                                                                      |
| `clearedLabel`       | `string`                                                                                                        | `'Signature cleared.'`, translated                                                  | Announced in the live region after clearing.                                                  |
| `classes`            | `Partial<Record<SignaturePart, string>>`                                                                        | —                                                                                   | Extra classes per [part](#parts), such as `{ pad: 'h-48' }`.                                  |

Signature sets `inheritAttrs: false`. `class` and every other attribute go to the root, except `name`, which goes to the hidden input, and `aria-describedby`, which is added after the hint and error ids. An `id` you pass becomes the base for the inner ids, such as `<id>-ink` and `<id>-typed`.

## v-model

| Binding   | Type     | Carries                                                                          |
| --------- | -------- | -------------------------------------------------------------------------------- |
| `v-model` | `string` | A PNG data URL after every stroke, typed change or upload, or `''` once cleared. |

Without `v-model`, Signature keeps its own value. A new `modelValue` from outside is loaded onto the pad. The value the component just emitted isn't reloaded, so drawing isn't interrupted.

## Slots

Signature has no slots.

## Events

| Event                | Payload  | Description                                                  |
| -------------------- | -------- | ------------------------------------------------------------ |
| `@update:modelValue` | `string` | The signature changed: a PNG data URL, or `''` once cleared. |

Other listeners fall through to the root.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part          | Element  | Description                                                                                                              |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `root`        | `div`    | The field, `.apui-signature`, `role="group"`. Carries `data-mode`, `data-pen-color`, `data-invalid` and `data-disabled`. |
| `label`       | `span`   | The visible label. It names the group through `aria-labelledby`.                                                         |
| `required`    | `span`   | The required mark. `aria-hidden`.                                                                                        |
| `modes`       | `div`    | The mode switch, `role="group"`.                                                                                         |
| `mode`        | `button` | One mode button, with `aria-pressed` and `data-value`.                                                                   |
| `pad`         | `div`    | The signing area.                                                                                                        |
| `line`        | `span`   | The signing line. `aria-hidden`.                                                                                         |
| `mark`        | `span`   | The × at the start of the line. `aria-hidden`.                                                                           |
| `ink`         | `canvas` | The drawing canvas, `role="img"`. Hidden in type mode.                                                                   |
| `typed`       | `input`  | The typed-name input. Shown in type mode.                                                                                |
| `upload`      | `label`  | The upload trigger around a file input. Shown in upload mode while the pad is empty.                                     |
| `tools`       | `div`    | The undo and clear buttons. Hidden in type mode.                                                                         |
| `undo`        | `button` | The icon-only undo button. Shown in draw mode, enabled while there's a stroke.                                           |
| `clear`       | `button` | The clear button. Enabled while there's a signature.                                                                     |
| `placeholder` | `span`   | The text under the signing line. `aria-hidden`.                                                                          |
| `hint`        | `p`      | The hint text.                                                                                                           |
| `error`       | `p`      | The error text with its icon.                                                                                            |

A visually hidden `status` part, a polite live region, announces clearing. It doesn't take classes.

## Types

```ts
import type {
  SignatureEmits,
  SignatureMode,
  SignaturePart,
  SignaturePenColor,
  SignatureProps,
  SignatureTranslations,
} from '@artisanpack-ui/vue/form';
```

| Type                    | Description                                                                                                                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SignatureProps`        | The component's props.                                                                                                                                                                                                                              |
| `SignatureEmits`        | The component's events.                                                                                                                                                                                                                             |
| `SignatureMode`         | `'draw' \| 'type' \| 'upload'`                                                                                                                                                                                                                      |
| `SignaturePenColor`     | `'default'` or one of the eight semantic colors.                                                                                                                                                                                                    |
| `SignatureTranslations` | The built-in strings, keyed `modes`, `draw`, `type`, `upload`, `pad`, `typed`, `uploadTrigger`, `undo`, `clear`, `placeholder` and `cleared`. Re-exported from `@artisanpack-ui/behavior`. The Vue component takes them as separate `*Label` props. |
| `SignaturePart`         | The part names in the [Parts](#parts) table.                                                                                                                                                                                                        |

## Accessibility

| Keys              | Action                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `Tab`             | Moves through the mode buttons, the typed name or the upload input, then undo and clear. |
| `Enter` / `Space` | Chooses a mode, or runs undo or clear.                                                   |

- Type mode is always offered and is the keyboard path. Drawing is never the only option.
- The root is a group named by the label and described by the hint and error. Always pass a `label`.
- The canvas is `role="img"` with an accessible name that points to Type mode.
- Mode buttons are toggle buttons with `aria-pressed`. Switching modes starts over.
- Undo and clear are labeled buttons. Undo is icon-only with an accessible name, and its icon mirrors in right-to-left layouts.
- Clearing is announced through a polite live region.
- The ink and the typed name use text tones with 4.5:1 contrast on the pad in every theme, and `CanvasText` in forced colors.
- Invalid shows an error edge on the pad plus the error text, never color alone.
- Disabled uses the sunken surface and disabled text colors, never opacity alone.

## Related

- [Signature in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/signature): anatomy, tokens and live examples.
- [File](file.md) for uploading other files.
- [Form](form-component.md) for submit handling and validation.
