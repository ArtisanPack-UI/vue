---
title: Textarea
menu_order: 200
meta_description: The Vue Textarea component. Multi-line text entry with a character counter and auto-resize, with every prop, event and part.
---

# Textarea

Multi-line text entry in the same anatomy as [Input](input.md): a label, a box, hint and error text. It can show a character counter and grow with its content. Use it for comments, notes and descriptions. For formatted text, use [RichTextEditor](rich-text-editor.md).

```ts
import { Textarea } from '@artisanpack-ui/vue/form';
// or
import { Textarea } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@artisanpack-ui/vue/form';

const notes = ref('');
</script>

<template>
  <Textarea v-model="notes" label="Notes" :rows="3" />
</template>
```

### Character counter

`maxLength` sets the native `maxlength` and shows a counter, such as "120 / 500". The counter itself is `aria-hidden`. A polite live region announces the characters left only once they reach 10% of the limit, or 10 characters if that's more, so screen readers aren't interrupted on every keystroke.

```vue
<template>
  <Textarea v-model="description" label="Description" :max-length="500" />
</template>
```

Translate the announcement with `remainingLabel`. `{count}` is replaced with the characters left.

```vue
<template>
  <Textarea
    v-model="description"
    label="Descripción"
    :max-length="500"
    remaining-label="Caracteres restantes: {count}"
  />
</template>
```

### Auto-resize

`autoResize` grows the box with its content, using CSS `field-sizing`. `rows` becomes the minimum height.

```vue
<template>
  <Textarea v-model="message" label="Message" :rows="2" auto-resize />
</template>
```

### Hint, error and states

```vue
<template>
  <Textarea v-model="notes" label="Notes" hint="Only your team can see notes." />
  <Textarea v-model="notes" label="Notes" error="Add a note before saving." required />
  <Textarea v-model="notes" label="Notes" readonly />
  <Textarea v-model="notes" label="Notes" disabled />
</template>
```

## Props

| Prop             | Type                                    | Default                                  | Description                                                                                |
| ---------------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `modelValue`     | `string`                                | —                                        | The value, bound with `v-model`.                                                           |
| `rows`           | `number`                                | `4`                                      | Visible lines of text. With `autoResize`, the minimum.                                     |
| `maxLength`      | `number`                                | —                                        | The most characters allowed. Sets `maxlength` and shows the counter.                       |
| `autoResize`     | `boolean`                               | `false`                                  | Grows the box with its content (CSS `field-sizing`). Emitted as `data-auto-resize`.        |
| `label`          | `string`                                | —                                        | The visible label, linked to the control. Without it, pass an `aria-label`.                |
| `hint`           | `string`                                | —                                        | Help text under the box, linked with `aria-describedby`.                                   |
| `error`          | `string`                                | —                                        | Validation message. Marks the field invalid and is linked with `aria-describedby`.         |
| `invalid`        | `boolean`                               | `false`                                  | Marks the field invalid without a message.                                                 |
| `disabled`       | `boolean`                               | `false`                                  | Disables the control.                                                                      |
| `readonly`       | `boolean`                               | `false`                                  | Makes the control read-only. It stays focusable.                                           |
| `required`       | `boolean`                               | `false`                                  | Marks the field required and shows the required mark.                                      |
| `placeholder`    | `string`                                | —                                        | Placeholder text. Never a replacement for the label.                                       |
| `remainingLabel` | `string`                                | `'Characters left: {count}'`, translated | The counter's announcement near the limit. `{count}` is replaced with the characters left. |
| `classes`        | `Partial<Record<TextareaPart, string>>` | —                                        | Extra classes per [part](#parts), such as `{ control: 'font-mono' }`.                      |

Textarea sets `inheritAttrs: false`. `class` goes to the root. Every other attribute, including `id`, `name`, `autocomplete`, `aria-*` and listeners such as `@blur`, goes to the native `<textarea>`. An `id` you pass replaces the generated one, and an `aria-describedby` you pass is added after the hint and error ids.

## v-model

| Binding   | Type     | Carries                            |
| --------- | -------- | ---------------------------------- |
| `v-model` | `string` | The current value, on every input. |

Without `v-model`, Textarea keeps its own value, so the counter still updates. An uncontrolled Textarea also follows its form's reset.

## Slots

Textarea has no slots.

## Events

| Event                | Payload  | Description        |
| -------------------- | -------- | ------------------ |
| `@update:modelValue` | `string` | The value changed. |

Other listeners, such as `@blur` and `@keydown`, fall through to the native `<textarea>`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part       | Element    | Description                                                                                                   |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `root`     | `div`      | The field, `.apui-textarea`. Carries `data-invalid`, `data-disabled`, `data-readonly` and `data-auto-resize`. |
| `label`    | `label`    | The visible label.                                                                                            |
| `required` | `span`     | The required mark. `aria-hidden`.                                                                             |
| `box`      | `div`      | The bordered box around the control and counter.                                                              |
| `control`  | `textarea` | The native textarea.                                                                                          |
| `count`    | `span`     | The counter, such as "120 / 500". `aria-hidden`. Only rendered with `maxLength`.                              |
| `hint`     | `p`        | The hint text.                                                                                                |
| `error`    | `p`        | The error text with its icon.                                                                                 |

## Types

```ts
import type { TextareaEmits, TextareaPart, TextareaProps } from '@artisanpack-ui/vue/form';
```

| Type            | Description                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| `TextareaProps` | The component's props.                                                                  |
| `TextareaEmits` | The component's events.                                                                 |
| `TextareaPart`  | `'root' \| 'label' \| 'required' \| 'box' \| 'control' \| 'count' \| 'hint' \| 'error'` |

## Accessibility

| Keys  | Action                                                                       |
| ----- | ---------------------------------------------------------------------------- |
| `Tab` | Moves focus to the control. Typing edits the value, and `Enter` adds a line. |

- Give every Textarea a visible `label`, linked with `for` and `id`. A placeholder never replaces the label.
- The hint and error are linked to the control with `aria-describedby`. An error or `invalid` sets `aria-invalid="true"`. The error is text, never color alone.
- The counter is `aria-hidden`. A polite live region announces the characters left only near the limit.
- Disabled uses the sunken surface and disabled text colors, never opacity alone.
- Shows a visible focus ring on the box while the control has `:focus-visible`.

## Related

- [Textarea in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/textarea): anatomy, tokens and live examples.
- [Input](input.md) for single-line text.
- [RichTextEditor](rich-text-editor.md) for formatted text.
