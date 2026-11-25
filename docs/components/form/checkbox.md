---
title: Checkbox
menu_order: 20
meta_description: The Vue Checkbox component. One option on or off, with an indeterminate state, description and error, with every prop and part.
---

# Checkbox

Turns one option on or off. It renders a native `<input type="checkbox">` inside a styled box, a label, and optional description and error text. It also has an indeterminate (mixed) state for "select all" rows. Use it in forms that are submitted; for a setting that applies at once, use [Toggle](toggle.md).

```ts
import { Checkbox } from '@artisanpack-ui/vue/form';
// or
import { Checkbox } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@artisanpack-ui/vue/form';

const subscribed = ref(false);
</script>

<template>
  <Checkbox v-model:checked="subscribed" label="Email me about new offers" name="subscribed" />
</template>
```

Checkbox binds `checked`, not `modelValue`, so use `v-model:checked`.

### Description and error

`description` adds supporting text under the label. `error` adds a message, marks the checkbox invalid and sets `aria-invalid="true"`. Both are linked to the control with `aria-describedby`.

```vue
<template>
  <Checkbox
    label="I accept the terms"
    description="You can read them in a new tab."
    error="Accept the terms to continue."
    required
  />
</template>
```

`required` sets the native `required` attribute, for example for consent. Unlike the text fields, a Checkbox shows no required mark.

### Indeterminate

`indeterminate` shows the mixed state and sets the native `indeterminate` property, which screen readers announce as "mixed". It wins over `checked`. When the user clicks a mixed checkbox, the browser would clear the state; Checkbox keeps it until you change the prop, so update it in your `update:checked` handler.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Checkbox } from '@artisanpack-ui/vue/form';

const rooms = ref([
  { id: 1, name: 'Kitchen', done: true },
  { id: 2, name: 'Bathroom', done: false },
]);
const all = computed(() => rooms.value.every((room) => room.done));
const some = computed(() => rooms.value.some((room) => room.done));

function setAll(checked: boolean): void {
  rooms.value.forEach((room) => (room.done = checked));
}
</script>

<template>
  <Checkbox
    label="All rooms cleaned"
    :checked="all"
    :indeterminate="some && !all"
    @update:checked="setAll"
  />
  <Checkbox v-for="room in rooms" :key="room.id" v-model:checked="room.done" :label="room.name" />
</template>
```

For a list of options with select all built in, use [CheckboxGroup](checkbox-group.md).

### Controlled and uncontrolled

With `v-model:checked` (or `:checked`), the checkbox follows the value you pass. Without it, it keeps its own state and still emits `update:checked`. When its form resets, the checkbox goes back to the `checked` prop: its initial value if it's uncontrolled, the owner's current value if it's controlled.

## Props

| Prop            | Type                                    | Default | Description                                                                                     |
| --------------- | --------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `checked`       | `boolean`                               | `false` | Whether it's checked, bound with `v-model:checked`. Emitted as `data-state`.                    |
| `indeterminate` | `boolean`                               | `false` | Shows the mixed state and sets the native `indeterminate` property. Wins over `checked`.        |
| `label`         | `string`                                | —       | The visible label, linked to the control. Without it, pass an `aria-label`.                     |
| `description`   | `string`                                | —       | Supporting text under the label, linked with `aria-describedby`.                                |
| `error`         | `string`                                | —       | Validation message. Marks it invalid and is linked with `aria-describedby`.                     |
| `invalid`       | `boolean`                               | `false` | Marks it invalid without a message.                                                             |
| `disabled`      | `boolean`                               | `false` | Disables the control.                                                                           |
| `required`      | `boolean`                               | `false` | Sets `required` on the control, such as consent to terms. No visual mark.                       |
| `classes`       | `Partial<Record<CheckboxPart, string>>` | —       | Extra classes per [part](#parts), such as `{ label: 'font-medium' }`. Use `class` for the root. |

`class` goes to the root `<div>`. Every other attribute, including `id`, `name`, `value`, `aria-*` and listeners, goes to the native `<input type="checkbox">`. An `id` you pass becomes the control's id, and the description and error ids are built from it. Your own `aria-describedby` is kept and added after them.

## v-model

| Binding           | Type      | Carries                                        |
| ----------------- | --------- | ---------------------------------------------- |
| `v-model:checked` | `boolean` | The control's checked state after each toggle. |

## Slots

Checkbox has no slots. Use `label` and `description` for its text.

## Events

| Event             | Payload   | Description                    |
| ----------------- | --------- | ------------------------------ |
| `@update:checked` | `boolean` | The user toggled the checkbox. |

Native listeners such as `@change` and `@focus` fall through to the `<input>`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part          | Element | Description                                                                                                                           |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `root`        | `div`   | The checkbox, `.apui-checkbox`. Carries `data-state` (`checked`, `unchecked` or `indeterminate`), `data-invalid` and `data-disabled`. |
| `box`         | `span`  | The visible box that holds the control and indicator.                                                                                 |
| `control`     | `input` | The native checkbox, visually hidden over the box.                                                                                    |
| `indicator`   | `span`  | The check and minus glyphs. `aria-hidden`.                                                                                            |
| `label`       | `label` | The visible label.                                                                                                                    |
| `description` | `p`     | The supporting text.                                                                                                                  |
| `error`       | `p`     | The error message, with an alert icon.                                                                                                |

## Types

```ts
import type { CheckboxPart, CheckboxProps } from '@artisanpack-ui/vue/form';
```

| Type            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| `CheckboxProps` | The component's props.                                                               |
| `CheckboxPart`  | `'root' \| 'box' \| 'control' \| 'indicator' \| 'label' \| 'description' \| 'error'` |

## Accessibility

| Keys    | Action                |
| ------- | --------------------- |
| `Space` | Toggles the checkbox. |

- The native checkbox stays in the DOM, visually hidden over the box, so the platform handles keyboard and screen readers.
- The label is linked with `for`/`id`; description and error with `aria-describedby`. Give a checkbox without a label an `aria-label`.
- Indeterminate sets the native `indeterminate` property, announced as "mixed".
- The hit area covers the box plus 4px, and clicking the label toggles it too.
- Disabled styling uses the sunken surface and disabled text colors, never opacity alone.
- Shows a visible focus ring on the box while the control has `:focus-visible`.
- Use [Toggle](toggle.md), not Checkbox, for settings that apply instantly.

## Related

- [Checkbox in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/checkbox): anatomy, tokens and live examples.
- [CheckboxGroup](checkbox-group.md) for a set of related checkboxes.
- [Toggle](toggle.md) for settings that apply at once.
- [RadioGroup](radio-group.md) for one choice out of several.
