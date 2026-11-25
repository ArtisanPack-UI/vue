---
title: Select
menu_order: 180
meta_description: The Vue Select component. Choose one value from a short list with the native select, with options, groups, placeholder and every part.
---

# Select

Chooses one value from a short list with the native `<select>` element, so the platform supplies the list, keyboard and screen reader support. Use it for more than about six options. For fewer, use [RadioGroup](radio-group.md). To search a long list, or pick several values, use [Combobox](combobox.md).

```ts
import { Select } from '@artisanpack-ui/vue/form';
// or
import { Select } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@artisanpack-ui/vue/form';

const country = ref('');
const countries = [
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'us', label: 'United States' },
];
</script>

<template>
  <Select v-model="country" label="Country" :options="countries" />
</template>
```

### Options

An option is a string, which is both value and label, or a `{ value, label, disabled }` object. Values can be strings or numbers. They're compared as strings, and `v-model` receives the value as you gave it, so numbers stay numbers.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@artisanpack-ui/vue/form';

const size = ref('M');
const guests = ref<string | number>(2);
</script>

<template>
  <Select v-model="size" label="Size" :options="['S', 'M', 'L']" />
  <Select
    v-model="guests"
    label="Guests"
    :options="[
      { value: 1, label: 'One guest' },
      { value: 2, label: 'Two guests' },
      { value: 6, label: 'Six guests', disabled: true },
    ]"
  />
</template>
```

### Groups

A `{ label, options }` entry renders a native `<optgroup>`. Groups and single options can be mixed.

```vue
<template>
  <Select
    v-model="timezone"
    label="Time zone"
    :options="[
      {
        label: 'Americas',
        options: [
          { value: 'America/Toronto', label: 'Toronto' },
          { value: 'America/Denver', label: 'Denver' },
        ],
      },
      {
        label: 'Europe',
        options: [
          { value: 'Europe/Lisbon', label: 'Lisbon' },
          { value: 'Europe/Berlin', label: 'Berlin' },
        ],
      },
    ]"
  />
</template>
```

### Option children

`<option>` and `<optgroup>` elements in the default slot render after `options`. Their values reach `v-model` as strings.

```vue
<template>
  <Select v-model="sort" label="Sort by">
    <option value="newest">Newest first</option>
    <option value="price">Price, low to high</option>
  </Select>
</template>
```

### Placeholder

The first option is an empty placeholder, "Select…" by default and translated. It's selected while the value is empty. Pass `placeholder` to change its text, or an empty string to render no placeholder option. With `required`, the placeholder can't be chosen.

```vue
<template>
  <Select
    v-model="country"
    label="Country"
    :options="countries"
    placeholder="Choose a country"
    required
  />
  <Select v-model="size" label="Size" :options="['S', 'M', 'L']" placeholder="" />
</template>
```

### Icon, sizes and states

```vue
<template>
  <Select v-model="language" label="Language" leading-icon="globe" :options="languages" />
  <Select v-model="language" label="Language" size="sm" :options="languages" />
  <Select v-model="language" label="Language" :options="languages" hint="Used for emails." />
  <Select v-model="language" label="Language" :options="languages" error="Choose a language." />
  <Select v-model="language" label="Language" :options="languages" disabled />
</template>
```

## Props

| Prop          | Type                                    | Default                 | Description                                                                                      |
| ------------- | --------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| `modelValue`  | `string \| number`                      | —                       | The selected value, bound with `v-model`.                                                        |
| `options`     | `(SelectOption \| SelectOptionGroup)[]` | `[]`                    | The options: strings, `{ value, label, disabled }` objects, or `{ label, options }` groups.      |
| `size`        | `'sm' \| 'md' \| 'lg'`                  | `'md'`                  | Control height. Emitted as `data-size`.                                                          |
| `label`       | `string`                                | —                       | The visible label, linked to the control. Without it, pass an `aria-label`.                      |
| `hint`        | `string`                                | —                       | Help text under the control, linked with `aria-describedby`.                                     |
| `error`       | `string`                                | —                       | Validation message. Marks the field invalid and is linked with `aria-describedby`.               |
| `invalid`     | `boolean`                               | `false`                 | Marks the field invalid without a message.                                                       |
| `disabled`    | `boolean`                               | `false`                 | Disables the control.                                                                            |
| `required`    | `boolean`                               | `false`                 | Marks the field required, shows the required mark and makes the placeholder option unselectable. |
| `placeholder` | `string`                                | `'Select…'`, translated | The empty first option. An empty string renders no placeholder option.                           |
| `leadingIcon` | `string`                                | —                       | Icon name before the value, resolved through the icon registry. The `icon` slot overrides it.    |
| `classes`     | `Partial<Record<SelectPart, string>>`   | —                       | Extra classes per [part](#parts), such as `{ control: 'font-medium' }`.                          |

Select sets `inheritAttrs: false`. `class` goes to the root. Every other attribute, including `id`, `name`, `aria-*` and listeners such as `@blur`, goes to the native `<select>`. An `id` you pass replaces the generated one, and an `aria-describedby` you pass is added after the hint and error ids. An `aria-invalid` you pass is kept unless the field is invalid.

## v-model

| Binding   | Type               | Carries                                                                                                                       |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string \| number` | The chosen option's value as given in `options`. Option children and the placeholder give a string, `''` for the placeholder. |

## Slots

| Slot      | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
| `default` | Extra `<option>` and `<optgroup>` elements, rendered after `options`.              |
| `icon`    | Replaces the icon from `leadingIcon`. Rendered inside the `aria-hidden` icon part. |

## Events

| Event                | Payload            | Description           |
| -------------------- | ------------------ | --------------------- |
| `@update:modelValue` | `string \| number` | An option was chosen. |

Other listeners, such as `@change` and `@blur`, fall through to the native `<select>`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part        | Element  | Description                                                                         |
| ----------- | -------- | ----------------------------------------------------------------------------------- |
| `root`      | `div`    | The field, `.apui-select`. Carries `data-size`, `data-invalid` and `data-disabled`. |
| `label`     | `label`  | The visible label.                                                                  |
| `required`  | `span`   | The required mark. `aria-hidden`.                                                   |
| `box`       | `div`    | The bordered box around the icon, control and indicator.                            |
| `icon`      | `span`   | The leading icon. `aria-hidden`.                                                    |
| `control`   | `select` | The native select.                                                                  |
| `indicator` | `span`   | The chevron. `aria-hidden`.                                                         |
| `hint`      | `p`      | The hint text.                                                                      |
| `error`     | `p`      | The error text with its icon.                                                       |

## Types

```ts
import type {
  SelectOption,
  SelectOptionGroup,
  SelectOptionObject,
  SelectPart,
  SelectProps,
  SelectSize,
} from '@artisanpack-ui/vue/form';
```

| Type                 | Description                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| `SelectProps`        | The component's props.                                                     |
| `SelectOption`       | `string \| SelectOptionObject`                                             |
| `SelectOptionObject` | `{ value: string \| number; label?: string; disabled?: boolean }`          |
| `SelectOptionGroup`  | `{ label: string; options: SelectOption[] }`, rendered as an `<optgroup>`. |
| `SelectSize`         | `'sm' \| 'md' \| 'lg'`                                                     |
| `SelectPart`         | The part names in the [Parts](#parts) table.                               |

## Accessibility

| Keys                              | Action                                     |
| --------------------------------- | ------------------------------------------ |
| `Tab`                             | Moves focus to the select.                 |
| `Space`, `Enter`, `Alt+ArrowDown` | Opens the native list (platform behavior). |
| `ArrowUp`, `ArrowDown`            | Moves through the options.                 |
| `Escape`                          | Closes the list and keeps the value.       |

- Uses the native `<select>`, so the platform supplies the listbox, keyboard and screen reader support.
- Give every Select a visible `label`, linked with `for` and `id`.
- The hint and error are linked to the control with `aria-describedby`. An error or `invalid` sets `aria-invalid="true"`.
- The placeholder is an empty option in the muted color, so it never looks like a value. It can't be chosen when `required`.
- The chevron doesn't mirror under right-to-left layouts. The icon and chevron swap sides with the text direction.
- Shows a visible focus ring on the box while the control has `:focus-visible`.

## Related

- [Select in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/select): anatomy, tokens and live examples.
- [Combobox](combobox.md) for searching a long list or choosing several values.
- [RadioGroup](radio-group.md) for a few options shown at once.
