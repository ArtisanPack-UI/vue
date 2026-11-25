---
title: CheckboxGroup
menu_order: 30
meta_description: The Vue CheckboxGroup component. A labeled set of checkboxes bound to an array, with select all, columns and cards, with every prop and part.
---

# CheckboxGroup

A labeled set of related checkboxes whose value is the array of checked values. It renders a native `<fieldset>` with a `<legend>`, one [Checkbox](checkbox.md) per option, and optional select all, hint and error. Use it when people can pick any number of options from a short list.

```ts
import { CheckboxGroup } from '@artisanpack-ui/vue/form';
// or
import { CheckboxGroup } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { CheckboxGroup } from '@artisanpack-ui/vue/form';

const topics = ref<string[]>(['offers']);
</script>

<template>
  <CheckboxGroup
    v-model="topics"
    label="Notify me about"
    name="topics[]"
    :options="[
      { value: 'offers', label: 'New offers', description: 'Within an hour of submission' },
      { value: 'prices', label: 'Price changes in saved searches' },
      { value: 'news', label: 'Product news', disabled: true },
    ]"
  />
</template>
```

### Options

An option is a string (used as both value and label) or an object with `value`, and optional `label`, `description` and `disabled`. Values can be strings or numbers. They're compared as strings, and `v-model` receives them as you gave them, so a number stays a number.

```vue
<template>
  <CheckboxGroup v-model="amenities" label="Amenities" :options="['Parking', 'Balcony', 'Pool']" />
</template>
```

`v-model` lists the checked values in option order. Values the parent sets that no option stands for are kept, after the options' values.

### Select all

`selectAll` adds a checkbox above the options. It's checked when every enabled option is, mixed while only some are, and toggles every option that isn't disabled on its own. Change its text with `selectAllLabel`.

```vue
<template>
  <CheckboxGroup v-model="topics" label="Notify me about" :options="options" select-all />
</template>
```

### Layout and cards

`columns` (1, 2 or 3) lays the options out in a grid. `orientation="horizontal"` wraps them in a row. `variant="cards"` turns each option into a card that's clickable anywhere.

```vue
<template>
  <CheckboxGroup v-model="amenities" label="Amenities" :columns="3" :options="amenityOptions" />
  <CheckboxGroup
    v-model="channels"
    label="Channels"
    variant="cards"
    :columns="3"
    :options="[
      { value: 'email', label: 'Email', description: 'olivia@company.com' },
      { value: 'sms', label: 'Text message', description: '+1 555 0100' },
      { value: 'push', label: 'Push', description: 'On your phone' },
    ]"
  />
</template>
```

### Hint and error

`hint` and `error` render under the options and are linked to the fieldset with `aria-describedby`. `error` (or `invalid`) also marks every checkbox invalid. `disabled` disables the fieldset, every option and select all.

```vue
<template>
  <CheckboxGroup
    v-model="topics"
    label="Notify me about"
    :options="options"
    hint="Choose at least one."
    error="Choose at least one topic."
  />
</template>
```

## Props

| Prop             | Type                                         | Default                    | Description                                                                               |
| ---------------- | -------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| `options`        | `CheckboxGroupOption[]`                      | `[]`                       | The options: strings, or `{ value, label, description, disabled }` objects.               |
| `modelValue`     | `(string \| number)[]`                       | —                          | The checked values, bound with `v-model`.                                                 |
| `label`          | `string`                                     | —                          | The group label, rendered as the legend.                                                  |
| `hint`           | `string`                                     | —                          | Help text under the options, linked to the fieldset with `aria-describedby`.              |
| `error`          | `string`                                     | —                          | Validation message. Marks every option invalid and is linked with `aria-describedby`.     |
| `invalid`        | `boolean`                                    | `false`                    | Marks every option invalid without a message.                                             |
| `disabled`       | `boolean`                                    | `false`                    | Disables every option and select all.                                                     |
| `orientation`    | `'vertical' \| 'horizontal'`                 | `'vertical'`               | Stacks the options or wraps them in a row. Emitted as `data-orientation`.                 |
| `variant`        | `'default' \| 'cards'`                       | `'default'`                | Plain checkboxes, or cards. Emitted as `data-variant`.                                    |
| `columns`        | `number`                                     | `1`                        | 1, 2 or 3 columns. Emitted as `data-columns`.                                             |
| `selectAll`      | `boolean`                                    | `false`                    | Adds a select-all checkbox with the mixed state.                                          |
| `selectAllLabel` | `string`                                     | `'Select all'`, translated | The select-all label.                                                                     |
| `classes`        | `Partial<Record<CheckboxGroupPart, string>>` | —                          | Extra classes per [part](#parts), such as `{ items: 'gap-4' }`. Use `class` for the root. |

`class` and other attributes go to the `<fieldset>`. A `name` attribute (such as `topics[]`) lands on every option's checkbox instead, so the checked values are submitted with a native form. An `id` you pass becomes the fieldset's id; the options get `<id>-0`, `<id>-1` and so on, and select all gets `<id>-all`. Your own `aria-describedby` is kept and added after the hint and error ids.

There's no `required` prop: a native `required` on a checkbox would demand that every box be checked. Validate "at least one" yourself and show it with `error`.

## v-model

| Binding   | Type                   | Carries                                                                 |
| --------- | ---------------------- | ----------------------------------------------------------------------- |
| `v-model` | `(string \| number)[]` | The checked values, in option order, with each option's original value. |

Without `v-model`, the group keeps its own selection and still emits `update:modelValue`.

## Slots

CheckboxGroup has no slots. Each option's text comes from its `label` and `description`.

## Events

| Event                | Payload                | Description                          |
| -------------------- | ---------------------- | ------------------------------------ |
| `@update:modelValue` | `(string \| number)[]` | An option or select all was toggled. |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS. Each option is a [Checkbox](checkbox.md) with its own parts.

| Part        | Element    | Description                                                                                                                        |
| ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `root`      | `fieldset` | The group, `.apui-checkbox-group`. Carries `data-orientation`, `data-variant`, `data-columns`, `data-invalid` and `data-disabled`. |
| `label`     | `legend`   | The group label.                                                                                                                   |
| `selectAll` | `div`      | Wraps the select-all checkbox. Rendered as `data-part="select-all"`.                                                               |
| `items`     | `div`      | Wraps the option checkboxes.                                                                                                       |
| `hint`      | `p`        | The help text.                                                                                                                     |
| `error`     | `p`        | The error message, with an alert icon.                                                                                             |

## Types

```ts
import type {
  CheckboxGroupOption,
  CheckboxGroupPart,
  CheckboxGroupProps,
} from '@artisanpack-ui/vue/form';
```

| Type                  | Description                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CheckboxGroupProps`  | The component's props.                                                                                                                                                                       |
| `CheckboxGroupOption` | `string \| { value: string \| number; label?: string; description?: string; meta?: string; disabled?: boolean }`. `meta` is part of the shared option type and isn't shown by CheckboxGroup. |
| `CheckboxGroupPart`   | `'root' \| 'label' \| 'selectAll' \| 'items' \| 'hint' \| 'error'`                                                                                                                           |

## Accessibility

| Keys    | Action                                       |
| ------- | -------------------------------------------- |
| `Tab`   | Moves between select all and the checkboxes. |
| `Space` | Toggles the focused checkbox.                |

- A native `<fieldset>` and `<legend>` group the checkboxes, so the group's name is announced with each option. Always pass `label`.
- Each option is a native checkbox with its own label; an option's description is linked to it with `aria-describedby`.
- Hint and error are linked to the fieldset with `aria-describedby`; invalid sets `aria-invalid` on each checkbox.
- Select all is a real checkbox with the mixed (indeterminate) state while some options are checked.
- In the cards variant the label covers the card, so the whole card is clickable.
- Use [RadioGroup](radio-group.md) for mutually exclusive options.

## Related

- [CheckboxGroup in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/checkbox-group): anatomy, tokens and live examples.
- [Checkbox](checkbox.md) for a single option.
- [RadioGroup](radio-group.md) for one choice out of several.
- [Combobox](combobox.md) with `multiple` for long lists.
