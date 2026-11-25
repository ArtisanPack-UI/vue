---
title: Input
menu_order: 110
meta_description: The Vue Input component. A single-line text field with label, hint, error, prefix, suffix and icons, with every prop, slot and part.
---

# Input

A single-line text field. It renders a visible label, a box around the native `<input>` with optional prefix, suffix and icons, and hint and error text under it. Use it for names, emails, URLs, numbers and any other short text.

```ts
import { Input } from '@artisanpack-ui/vue/form';
// or
import { Input } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@artisanpack-ui/vue/form';

const email = ref('');
</script>

<template>
  <Input v-model="email" label="Email" type="email" name="email" hint="We never share it." />
</template>
```

### Types

`type` is passed to the native input, so any text-like type works: `text`, `email`, `url`, `search`, `tel`, `number` and `password`. For passwords with a reveal button and a strength meter, use [Password](password.md).

```vue
<template>
  <Input label="Website" type="url" placeholder="https://example.com" />
  <Input label="Phone" type="tel" autocomplete="tel" />
</template>
```

### Numbers

`v-model` always carries the input's string value, also for `type="number"`. Bind a string ref, or convert the value yourself:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@artisanpack-ui/vue/form';

const bedrooms = ref(2);
</script>

<template>
  <Input
    label="Bedrooms"
    type="number"
    min="0"
    :model-value="bedrooms"
    @update:model-value="(value) => (bedrooms = Number(value))"
  />
</template>
```

### Prefix, suffix and icons

`prefix` and `suffix` put text inside the box, before and after the value. `leadingIcon` and `trailingIcon` take names from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons). They sit at the logical start and end, so they swap sides in right-to-left layouts.

```vue
<template>
  <Input label="Price" prefix="$" suffix="USD" />
  <Input label="Recipient" leading-icon="mail" />
  <Input label="Search" type="search" trailing-icon="search" />
</template>
```

The `prefix`, `suffix`, `icon` and `iconEnd` slots replace the props of the same name when you need markup.

### Hint, error and states

`hint` adds help text under the box. `error` adds the message after the hint, marks the field invalid and sets `aria-invalid="true"` on the control. Use `invalid` to mark the field without a message, for example when a [ValidationSummary](validation-summary.md) already names the problem.

```vue
<template>
  <Input label="Name" required error="Enter your name." />
  <Input label="Account ID" model-value="ACC-1042" readonly />
  <Input label="Promo code" disabled />
</template>
```

`required` sets `required` on the control and shows a `*` after the label. The mark is `aria-hidden`, since screen readers already announce the native `required`.

## Props

| Prop           | Type                                 | Default  | Description                                                                                             |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------- |
| `modelValue`   | `string \| number`                   | —        | The value, bound with `v-model`. A number is shown as text; `update:modelValue` always emits a string.  |
| `type`         | `string`                             | `'text'` | The native input type, such as `email`, `url`, `search` or `number`.                                    |
| `size`         | `'sm' \| 'md' \| 'lg'`               | `'md'`   | Control height. Emitted as `data-size`.                                                                 |
| `label`        | `string`                             | —        | The visible label, linked to the control with `for`/`id`. Without it, pass an `aria-label`.             |
| `hint`         | `string`                             | —        | Help text under the control, linked with `aria-describedby`.                                            |
| `error`        | `string`                             | —        | Validation message. Marks the field invalid and is linked with `aria-describedby`.                      |
| `invalid`      | `boolean`                            | `false`  | Marks the field invalid without a message.                                                              |
| `disabled`     | `boolean`                            | `false`  | Disables the control.                                                                                   |
| `readonly`     | `boolean`                            | `false`  | Makes the control read-only. It stays focusable.                                                        |
| `required`     | `boolean`                            | `false`  | Sets `required` on the control and shows the required mark.                                             |
| `placeholder`  | `string`                             | —        | Placeholder text. Never a replacement for the label.                                                    |
| `prefix`       | `string`                             | —        | Text inside the box before the value, such as a currency or `https://`. The `prefix` slot overrides it. |
| `suffix`       | `string`                             | —        | Text inside the box after the value, such as a unit. The `suffix` slot overrides it.                    |
| `leadingIcon`  | `string`                             | —        | Icon name before the value, resolved through the icon registry. The `icon` slot overrides it.           |
| `trailingIcon` | `string`                             | —        | Icon name after the value, resolved through the icon registry. The `iconEnd` slot overrides it.         |
| `classes`      | `Partial<Record<InputPart, string>>` | —        | Extra classes per [part](#parts), such as `{ label: 'font-semibold' }`. Use `class` for the root.       |

`class` goes to the root `<div>`. Every other attribute, including `id`, `name`, `autocomplete`, `min`, `aria-*` and listeners such as `@blur`, goes to the native `<input>`. An `id` you pass becomes the control's id, and the hint and error ids are built from it (`<id>-hint`, `<id>-error`). Your own `aria-describedby` is kept and added after them.

## v-model

| Binding   | Type     | Carries                                                                              |
| --------- | -------- | ------------------------------------------------------------------------------------ |
| `v-model` | `string` | The input's value on every `input` event. Always a string, even for `type="number"`. |

Without `v-model`, the native input keeps its own value.

## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
| `icon`    | Replaces the icon from `leadingIcon`.             |
| `iconEnd` | Replaces the icon from `trailingIcon`.            |
| `prefix`  | Rich content before the value. Replaces `prefix`. |
| `suffix`  | Rich content after the value. Replaces `suffix`.  |

## Events

| Event                | Payload  | Description        |
| -------------------- | -------- | ------------------ |
| `@update:modelValue` | `string` | The value changed. |

Native listeners such as `@input`, `@change`, `@focus` and `@blur` fall through to the `<input>` and still run.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part       | Element | Description                                                                                         |
| ---------- | ------- | --------------------------------------------------------------------------------------------------- |
| `root`     | `div`   | The field, `.apui-input`. Carries `data-size`, `data-invalid`, `data-disabled` and `data-readonly`. |
| `label`    | `label` | The visible label.                                                                                  |
| `required` | `span`  | The `*` mark inside the label. `aria-hidden`.                                                       |
| `box`      | `div`   | The bordered box around the control, prefix, suffix and icons.                                      |
| `icon`     | `span`  | The leading icon. `aria-hidden`.                                                                    |
| `prefix`   | `span`  | The prefix text.                                                                                    |
| `control`  | `input` | The native input.                                                                                   |
| `suffix`   | `span`  | The suffix text.                                                                                    |
| `iconEnd`  | `span`  | The trailing icon. `aria-hidden`.                                                                   |
| `hint`     | `p`     | The help text.                                                                                      |
| `error`    | `p`     | The error message, with an alert icon.                                                              |

## Types

```ts
import type { InputEmits, InputPart, InputProps, InputSize } from '@artisanpack-ui/vue/form';
```

| Type         | Description                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `InputProps` | The component's props.                                                                                                      |
| `InputEmits` | The component's events: `update:modelValue` with a string.                                                                  |
| `InputSize`  | `'sm' \| 'md' \| 'lg'`                                                                                                      |
| `InputPart`  | `'root' \| 'label' \| 'required' \| 'box' \| 'icon' \| 'prefix' \| 'control' \| 'suffix' \| 'iconEnd' \| 'hint' \| 'error'` |

## Accessibility

| Keys  | Action                                              |
| ----- | --------------------------------------------------- |
| `Tab` | Moves focus to the control. Typing edits the value. |

- Give every Input a visible `label`. A placeholder never replaces it. Without a label, pass an `aria-label`.
- The label is linked with `for`/`id`; hint and error are linked to the control with `aria-describedby`.
- Invalid sets `aria-invalid="true"` on the control, and the error is text with an icon, never color alone. A consumer's own `aria-invalid` is kept while the field isn't invalid.
- The error isn't a live region. After a failed submit, move focus to the first invalid field or show a [ValidationSummary](validation-summary.md).
- Disabled styling uses the sunken surface and disabled text colors, never opacity alone.
- Shows a visible focus ring on the box while the control has `:focus-visible`.

## Related

- [Input in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/input): anatomy, tokens and live examples.
- [Textarea](textarea.md) for multi-line text.
- [Password](password.md) for passwords.
- [Combobox](combobox.md) to choose from a filtered list.
- [Form components](../form.md) for the behavior every form field shares.
