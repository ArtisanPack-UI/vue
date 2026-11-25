---
title: Pin
menu_order: 130
meta_description: The Vue Pin component. A row of cells for one-time codes with SMS autofill, paste and masking, with every prop, event and part.
---

# Pin

A row of single-character cells for one-time codes, such as a sign-in or verification code. One native input lies transparent over the cells and holds the whole code, and the cells mirror it. SMS autofill, paste and screen readers all work on that one field.

```ts
import { Pin } from '@artisanpack-ui/vue/form';
// or
import { Pin } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Pin } from '@artisanpack-ui/vue/form';

const code = ref('');

function verify(value: string): void {
  // Send the code to the server.
}
</script>

<template>
  <Pin v-model="code" label="Verification code" @complete="verify" />
</template>
```

### Completing the code

`@complete` fires with the code when every cell is filled, whether by typing, paste or SMS autofill. It fires once per change that fills the last cell, so you can submit from it.

### Length and grouping

`length` sets the number of cells. `groupSize` draws a separator after every that many cells, such as `3` for a 3 + 3 code.

```vue
<template>
  <Pin v-model="code" label="Verification code" :group-size="3" />
  <Pin v-model="pin" label="Card PIN" :length="4" />
</template>
```

### Allowed characters

`type="numeric"` (the default) allows digits and sets `inputmode="numeric"`, so phones show the number pad. `type="alphanumeric"` allows letters and digits. Characters the type doesn't allow are dropped as people type or paste, and the code is cut to `length`.

```vue
<template>
  <Pin v-model="code" label="Recovery code" type="alphanumeric" :length="8" :group-size="4" />
</template>
```

### Masking

`mask` shows a dot for each character and makes the control a password input.

```vue
<template>
  <Pin v-model="pin" label="PIN" :length="4" mask />
</template>
```

### Hint, error and states

```vue
<template>
  <Pin v-model="code" label="Verification code" hint="We sent a 6-digit code to your phone." />
  <Pin v-model="code" label="Verification code" error="That code has expired. Request a new one." />
  <Pin v-model="code" label="Verification code" size="sm" disabled />
</template>
```

## Props

| Prop         | Type                               | Default     | Description                                                                       |
| ------------ | ---------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| `modelValue` | `string`                           | —           | The code, bound with `v-model`.                                                   |
| `length`     | `number`                           | `6`         | The number of cells. Also the input's `maxlength`.                                |
| `type`       | `'numeric' \| 'alphanumeric'`      | `'numeric'` | The characters allowed. Others are dropped as people type or paste.               |
| `mask`       | `boolean`                          | `false`     | Shows a dot for each character and makes the control a password input.            |
| `groupSize`  | `number`                           | —           | Draws a separator after every `groupSize` cells, such as `3` for a 3 + 3 code.    |
| `size`       | `'sm' \| 'md'`                     | `'md'`      | Cell size. Emitted as `data-size`.                                                |
| `label`      | `string`                           | —           | The visible label, linked to the control. Without it, pass an `aria-label`.       |
| `hint`       | `string`                           | —           | Help text under the cells, linked with `aria-describedby`.                        |
| `error`      | `string`                           | —           | Validation message. Marks the code invalid and is linked with `aria-describedby`. |
| `invalid`    | `boolean`                          | `false`     | Marks the code invalid without a message.                                         |
| `disabled`   | `boolean`                          | `false`     | Disables the control.                                                             |
| `required`   | `boolean`                          | `false`     | Marks the code required and shows the required mark.                              |
| `classes`    | `Partial<Record<PinPart, string>>` | —           | Extra classes per [part](#parts), such as `{ cell: 'font-mono' }`.                |

Pin sets `inheritAttrs: false`. `class` goes to the root. Every other attribute, including `id`, `name`, `aria-*` and listeners, goes to the native `<input>`. An `id` you pass replaces the generated one, and an `aria-describedby` you pass is added after the hint and error ids.

The input always has `autocomplete="one-time-code"`, `autocapitalize="off"` and `spellcheck="false"`. In numeric mode it also has `inputmode="numeric"` and `pattern="[0-9]*"`.

## v-model

| Binding   | Type     | Carries                             |
| --------- | -------- | ----------------------------------- |
| `v-model` | `string` | The filtered code, on every change. |

Without `v-model`, Pin keeps its own value. An uncontrolled Pin also follows its form's reset, so the cells clear when the form is reset.

## Slots

Pin has no slots.

## Events

| Event                | Payload  | Description           |
| -------------------- | -------- | --------------------- |
| `@update:modelValue` | `string` | The code changed.     |
| `@complete`          | `string` | Every cell is filled. |

Neither event fires when a keystroke or paste leaves the filtered code unchanged. Other listeners fall through to the native `<input>`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part        | Element | Description                                                                      |
| ----------- | ------- | -------------------------------------------------------------------------------- |
| `root`      | `div`   | The field, `.apui-pin`. Carries `data-size`, `data-invalid` and `data-disabled`. |
| `label`     | `label` | The visible label.                                                               |
| `required`  | `span`  | The required mark. `aria-hidden`.                                                |
| `cells`     | `div`   | The row that holds the control and the cells.                                    |
| `control`   | `input` | The transparent native input that holds the whole code.                          |
| `cell`      | `span`  | One cell. `aria-hidden`, with `data-filled` and `data-active`.                   |
| `separator` | `span`  | The separator between groups. `aria-hidden`.                                     |
| `hint`      | `p`     | The hint text.                                                                   |
| `error`     | `p`     | The error text with its icon.                                                    |

## Types

```ts
import type { PinEmits, PinPart, PinProps, PinSize, PinType } from '@artisanpack-ui/vue/form';
```

| Type       | Description                                  |
| ---------- | -------------------------------------------- |
| `PinProps` | The component's props.                       |
| `PinEmits` | The component's events.                      |
| `PinSize`  | `'sm' \| 'md'`                               |
| `PinType`  | `'numeric' \| 'alphanumeric'`                |
| `PinPart`  | The part names in the [Parts](#parts) table. |

## Accessibility

| Keys        | Action                                               |
| ----------- | ---------------------------------------------------- |
| `Tab`       | Moves focus to the code. Typing fills the next cell. |
| `Backspace` | Clears the last character.                           |

- One native input holds the whole code, so SMS autofill, paste and screen readers treat it as one field. The cells are `aria-hidden` mirrors.
- Give every Pin a visible `label`, or an `aria-label`. The hint and error are linked with `aria-describedby`.
- An error or `invalid` sets `aria-invalid="true"` on the control. The error is text, never color alone.
- Don't clear the code on error without saying so in the error text.
- Shows a visible focus ring on the active cell while the control has `:focus-visible`.

## Related

- [Pin in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/pin): anatomy, tokens and live examples.
- [Password](password.md) for passwords.
- [Input](input.md) for other single-line text.
