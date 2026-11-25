---
title: RadioGroup
menu_order: 140
meta_description: The Vue RadioGroup component. Choose one option as radios, cards or segments, with every prop, event, part and keyboard behavior.
---

# RadioGroup

Chooses exactly one option from a small set. It renders native radios that share one name inside a `<fieldset>`, so the platform supplies roving focus and arrow keys. Use it for two to about six options. For more, use [Select](select.md). RadioGroup replaces the deprecated `Radio`.

```ts
import { RadioGroup } from '@artisanpack-ui/vue/form';
// or
import { RadioGroup } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup } from '@artisanpack-ui/vue/form';

const delivery = ref('standard');
</script>

<template>
  <RadioGroup v-model="delivery" label="Delivery" :options="['standard', 'express', 'pickup']" />
</template>
```

### Options

An option is a string, which is both value and label, or an object. Values can be strings or numbers. They're compared as strings, and `v-model` receives the value as you gave it.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup } from '@artisanpack-ui/vue/form';
import type { RadioGroupOption } from '@artisanpack-ui/vue/form';

const size = ref<string | number | null>(null);
const options: RadioGroupOption[] = [
  { value: 'sm', label: 'Small', description: 'Up to 2 people' },
  { value: 'md', label: 'Medium', description: 'Up to 4 people' },
  { value: 'lg', label: 'Large', description: 'Sold out', disabled: true },
];
</script>

<template>
  <RadioGroup v-model="size" label="Table size" :options="options" />
</template>
```

| Key           | Type               | Description                                                                                                       |
| ------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `value`       | `string \| number` | The option's value.                                                                                               |
| `label`       | `string`           | The text shown. Defaults to the value.                                                                            |
| `description` | `string`           | Supporting text under the label, linked to the radio with `aria-describedby`. Not shown in the segmented variant. |
| `meta`        | `string`           | A price or other figure, shown on cards. Not shown in the segmented variant.                                      |
| `disabled`    | `boolean`          | Makes the option unselectable.                                                                                    |

### Variants

`variant="cards"` renders each option as a selectable card, which suits plans and shipping methods with a description and a price in `meta`. `variant="segmented"` joins the options into one control, which suits short labels such as view modes. Segments don't show descriptions or meta.

```vue
<template>
  <RadioGroup
    v-model="plan"
    label="Plan"
    variant="cards"
    :options="[
      { value: 'starter', label: 'Starter', description: 'For one site', meta: '$9/mo' },
      { value: 'pro', label: 'Pro', description: 'For up to 10 sites', meta: '$29/mo' },
    ]"
  />
  <RadioGroup
    v-model="view"
    label="View"
    variant="segmented"
    orientation="horizontal"
    :options="['list', 'grid', 'board']"
  />
</template>
```

### Orientation

Options stack by default. `orientation="horizontal"` lays them in a row.

```vue
<template>
  <RadioGroup
    v-model="answer"
    label="Did this help?"
    orientation="horizontal"
    :options="['yes', 'no']"
  />
</template>
```

### Hint, error and states

```vue
<template>
  <RadioGroup v-model="delivery" label="Delivery" :options="options" hint="Pickup is free." />
  <RadioGroup
    v-model="delivery"
    label="Delivery"
    :options="options"
    error="Choose a delivery method."
    required
  />
  <RadioGroup v-model="delivery" label="Delivery" :options="options" disabled />
</template>
```

## Props

| Prop          | Type                                      | Default      | Description                                                                                          |
| ------------- | ----------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `options`     | `RadioGroupOption[]`                      | `[]`         | The options: strings, or `{ value, label, description, meta, disabled }` objects.                    |
| `modelValue`  | `string \| number \| null`                | —            | The selected value, bound with `v-model`.                                                            |
| `label`       | `string`                                  | —            | The group label, rendered as the `<legend>`.                                                         |
| `hint`        | `string`                                  | —            | Help text under the options, linked to the fieldset with `aria-describedby`.                         |
| `error`       | `string`                                  | —            | Validation message. Marks every radio invalid and is linked to the fieldset with `aria-describedby`. |
| `invalid`     | `boolean`                                 | `false`      | Marks the group invalid without a message.                                                           |
| `disabled`    | `boolean`                                 | `false`      | Disables the fieldset and every option.                                                              |
| `required`    | `boolean`                                 | `false`      | Sets `required` on the radios and shows the required mark.                                           |
| `orientation` | `'vertical' \| 'horizontal'`              | `'vertical'` | Stacks the options or lays them in a row. Emitted as `data-orientation`.                             |
| `variant`     | `'default' \| 'cards' \| 'segmented'`     | `'default'`  | Plain radios, cards or joined segments. Emitted as `data-variant`.                                   |
| `classes`     | `Partial<Record<RadioGroupPart, string>>` | —            | Extra classes per [part](#parts), such as `{ item: 'gap-3' }`.                                       |

RadioGroup sets `inheritAttrs: false`. `class` and every other attribute go to the `<fieldset>`, except `name`, which names every radio. Without a `name`, the radios share the group's id, which is the `id` you pass or a generated one. Each radio's id is the group id plus its index, such as `delivery-0`.

## v-model

| Binding   | Type               | Carries                                                 |
| --------- | ------------------ | ------------------------------------------------------- |
| `v-model` | `string \| number` | The value of the checked option, as given in `options`. |

Without `v-model`, RadioGroup keeps track of the checked option itself.

## Slots

RadioGroup has no slots. Pass labels, descriptions and meta through `options`.

## Events

| Event                | Payload            | Description            |
| -------------------- | ------------------ | ---------------------- |
| `@update:modelValue` | `string \| number` | An option was checked. |

Other listeners fall through to the `<fieldset>`.

## Parts

Pass extra classes to a part with `classes`, using the camelCase key. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS. The three item text parts use kebab-case `data-part` values.

| Part              | `data-part`        | Element    | Description                                                                                                     |
| ----------------- | ------------------ | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `root`            | —                  | `fieldset` | The group, `.apui-radio-group`. Carries `data-orientation`, `data-variant`, `data-invalid` and `data-disabled`. |
| `label`           | `label`            | `legend`   | The group label.                                                                                                |
| `required`        | `required`         | `span`     | The required mark. `aria-hidden`.                                                                               |
| `items`           | `items`            | `div`      | The list of options.                                                                                            |
| `item`            | `item`             | `label`    | One option. Carries `data-disabled`.                                                                            |
| `box`             | `box`              | `span`     | The box around the radio and its indicator.                                                                     |
| `control`         | `control`          | `input`    | The native radio.                                                                                               |
| `indicator`       | `indicator`        | `span`     | The drawn dot. `aria-hidden`.                                                                                   |
| `itemText`        | `item-text`        | `span`     | The option label.                                                                                               |
| `itemDescription` | `item-description` | `span`     | The option description.                                                                                         |
| `itemMeta`        | `item-meta`        | `span`     | The option meta, such as a price.                                                                               |
| `hint`            | `hint`             | `p`        | The hint text.                                                                                                  |
| `error`           | `error`            | `p`        | The error text with its icon.                                                                                   |

## Types

```ts
import type {
  RadioGroupOption,
  RadioGroupOrientation,
  RadioGroupPart,
  RadioGroupProps,
  RadioGroupVariant,
} from '@artisanpack-ui/vue/form';
```

| Type                    | Description                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `RadioGroupProps`       | The component's props.                                                                                           |
| `RadioGroupOption`      | `string \| { value: string \| number; label?: string; description?: string; meta?: string; disabled?: boolean }` |
| `RadioGroupVariant`     | `'default' \| 'cards' \| 'segmented'`                                                                            |
| `RadioGroupOrientation` | `'vertical' \| 'horizontal'`                                                                                     |
| `RadioGroupPart`        | The part names in the [Parts](#parts) table.                                                                     |

## Accessibility

| Keys                      | Action                                                                    |
| ------------------------- | ------------------------------------------------------------------------- |
| `Tab`                     | Moves focus into the group, to the checked radio or the first one.        |
| `ArrowDown`, `ArrowRight` | Moves to the next option and checks it, following the text direction.     |
| `ArrowUp`, `ArrowLeft`    | Moves to the previous option and checks it, following the text direction. |
| `Space`                   | Checks the focused option.                                                |

- Native radios that share one name sit in a `<fieldset>` with a `<legend>`, so the platform supplies the radio group role, roving focus and arrow keys. Give every group a `label`.
- Arrow keys follow the text direction under right-to-left layouts, and the dot and cards mirror.
- The hint and error are linked to the fieldset with `aria-describedby`. An error or `invalid` sets `aria-invalid` on each radio.
- An option's description is linked to its radio with `aria-describedby`.
- Disabled options use the sunken surface and disabled text colors, never opacity alone.
- Shows a visible focus ring on the box, or the segment, while its radio has `:focus-visible`.

## Related

- [RadioGroup in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/radio-group): anatomy, tokens and live examples.
- [CheckboxGroup](checkbox-group.md) for choosing several options.
- [Select](select.md) for longer lists.
- [Deprecated components](../deprecated.md) for moving from `Radio`.
