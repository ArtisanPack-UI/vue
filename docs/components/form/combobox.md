---
title: Combobox
menu_order: 60
meta_description: The Vue Combobox component. A text input that filters a listbox, with multiple values as chips, tags, remote search and create.
---

# Combobox

A text input that filters a listbox as people type. It holds one value, or several shown as removable chips with `multiple`, and can offer to create a value that isn't listed. `multiple` with `allowCreate` is a tags input. Use it for lists too long to scan in a [Select](select.md), or when the options come from a search on the server.

```ts
import { Combobox } from '@artisanpack-ui/vue/form';
// or
import { Combobox } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Combobox } from '@artisanpack-ui/vue/form';

const property = ref<string | null>(null);

const properties = [
  { value: 'lakeview', label: 'Lakeview Lofts', description: '12 units · Chicago' },
  { value: 'lakeside', label: 'Lakeside Cottages', description: '4 units · Madison' },
  { value: 'harbor', label: 'Harbor Point', description: '30 units · Boston' },
];
</script>

<template>
  <Combobox v-model="property" label="Property" name="property" :options="properties" />
</template>
```

Typing filters the options by their label and marks the matching text. Choosing an option puts its label in the input; `v-model` receives its value.

### Options

An option is a string (used as both value and label) or an object with `value` and optional `label`, `description`, `icon`, `color` and `disabled`. Values are compared as strings. A number value comes back through `v-model` as the number you gave.

### Multiple values

With `multiple`, the value is an array and each chosen option shows as a chip with a remove button. Enter toggles the highlighted option and keeps the listbox open. Backspace in the empty input removes the last chip. `max` caps how many values can be chosen; past it, the other options are disabled. An option's `color` tints its chip.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Combobox } from '@artisanpack-ui/vue/form';

const amenities = ref<string[]>(['parking']);
</script>

<template>
  <Combobox
    v-model="amenities"
    label="Amenities"
    name="amenities[]"
    multiple
    :max="5"
    :options="[
      { value: 'parking', label: 'Parking', color: 'info' },
      { value: 'pool', label: 'Pool', color: 'success' },
      { value: 'gym', label: 'Gym' },
    ]"
  />
</template>
```

### Tags: creating values

`allowCreate` adds a "Create “…”" option for typed text that matches no option (ignoring case). Choosing it emits `create` with the text and adds it to the value. The Combobox remembers created values, but add them to your `options` if they should stay listed.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Combobox } from '@artisanpack-ui/vue/form';

const tags = ref<string[]>([]);
const tagOptions = ref(['Pet friendly', 'Furnished', 'Short term']);

function addTag(tag: string): void {
  tagOptions.value.push(tag);
}
</script>

<template>
  <Combobox
    v-model="tags"
    label="Listing tags"
    placeholder="Add a tag…"
    hint="Press Enter to add, Backspace to remove the last tag."
    multiple
    allow-create
    :options="tagOptions"
    @create="addTag"
  />
</template>
```

### Remote search

With `remote`, the Combobox doesn't filter: listen to `search-change` and pass the matching options yourself. `loading` shows a spinner in the box and the loading text in the listbox.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Combobox, type ComboboxOption } from '@artisanpack-ui/vue/form';

const owner = ref<string | null>(null);
const people = ref<ComboboxOption[]>([]);
const loading = ref(false);

async function find(search: string): Promise<void> {
  loading.value = true;
  try {
    const response = await fetch(`/api/people?search=${encodeURIComponent(search)}`);
    people.value = await response.json();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Combobox
    v-model="owner"
    label="Owner"
    remote
    :options="people"
    :loading="loading"
    @search-change="find"
  />
</template>
```

Debounce `find` yourself if the server needs it. `search` sets the input's text when the Combobox renders.

### Custom option and empty content

The `item` slot renders each option's content and receives the option. The `empty` slot replaces the text shown when nothing matches, for example with a link to add a record.

```vue
<template>
  <Combobox v-model="owner" label="Owner" :options="people">
    <template #item="{ option }">
      <strong>{{ option.label }}</strong> · {{ option.description }}
    </template>
    <template #empty>No people match. <a href="/people/new">Add a person</a>.</template>
  </Combobox>
</template>
```

### Clearing, icons and states

`clearable` adds a button that clears the value. `leadingIcon` adds an icon before the input (the `icon` slot overrides it). `hint`, `error`, `invalid`, `disabled` and `required` work as on [Input](input.md).

### Submitting with a form

The visible input's text is never submitted. With `name`, the Combobox renders a hidden input carrying the value, or one per value with `multiple` (use a name such as `tags[]` if the server expects an array). Nothing is submitted while the value is empty.

## Props

| Prop           | Type                                               | Default                                    | Description                                                                                   |
| -------------- | -------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `modelValue`   | `string \| number \| (string \| number)[] \| null` | —                                          | The value, bound with `v-model`: a value or null, or an array with `multiple`.                |
| `options`      | `ComboboxOption[]`                                 | `[]`                                       | The options: strings, or `{ value, label, description, icon, color, disabled }` objects.      |
| `size`         | `'sm' \| 'md' \| 'lg'`                             | `'md'`                                     | Control height. Emitted as `data-size`.                                                       |
| `label`        | `string`                                           | —                                          | The visible label, linked to the input.                                                       |
| `hint`         | `string`                                           | —                                          | Help text under the control, linked with `aria-describedby`.                                  |
| `error`        | `string`                                           | —                                          | Validation message. Marks the field invalid and is linked with `aria-describedby`.            |
| `invalid`      | `boolean`                                          | `false`                                    | Marks the field invalid without a message.                                                    |
| `disabled`     | `boolean`                                          | `false`                                    | Disables the input, the buttons and the chips.                                                |
| `required`     | `boolean`                                          | `false`                                    | Marks the field required and shows the required mark.                                         |
| `placeholder`  | `string`                                           | `'Search…'`, translated                    | Shown in the empty input.                                                                     |
| `name`         | `string`                                           | —                                          | Submits the value with a native form through hidden inputs.                                   |
| `multiple`     | `boolean`                                          | `false`                                    | Selects several values, shown as removable chips. Emitted as `data-multiple`.                 |
| `max`          | `number`                                           | —                                          | With `multiple`, the most values that can be chosen.                                          |
| `allowCreate`  | `boolean`                                          | `false`                                    | Offers "Create …" for typed text that matches no option; emits `create`.                      |
| `remote`       | `boolean`                                          | `false`                                    | Turns off filtering: the app filters the options on `search-change`.                          |
| `search`       | `string`                                           | —                                          | The text in the input when it renders. It filters and marks the options.                      |
| `loading`      | `boolean`                                          | `false`                                    | Shows the spinner and the loading text. Emitted as `data-loading`.                            |
| `clearable`    | `boolean`                                          | `false`                                    | Adds a button that clears the value.                                                          |
| `open`         | `boolean`                                          | `false`                                    | Whether the listbox is open, bound with `v-model:open`.                                       |
| `portal`       | `boolean`                                          | `true`                                     | Teleports the listbox to the end of the body. Off renders it in place.                        |
| `leadingIcon`  | `string`                                           | —                                          | Icon name before the input, resolved through the icon registry. The `icon` slot overrides it. |
| `emptyLabel`   | `string`                                           | `'No matches for “{search}”.'`, translated | Shown when nothing matches; `{search}` is the typed text. The `empty` slot overrides it.      |
| `loadingLabel` | `string`                                           | `'Loading…'`, translated                   | Shown in the listbox while loading.                                                           |
| `createLabel`  | `string`                                           | `'Create “{value}”'`, translated           | The create option's text; `{value}` is the typed text.                                        |
| `removeLabel`  | `string`                                           | `'Remove {label}'`, translated             | A chip's remove button's name; `{label}` is the chip.                                         |
| `removedLabel` | `string`                                           | `'Removed {label}.'`, translated           | Announced when a chip is removed.                                                             |
| `clearLabel`   | `string`                                           | `'Clear'`, translated                      | The clear button's name.                                                                      |
| `triggerLabel` | `string`                                           | `'Show options'`, translated               | The chevron button's name.                                                                    |
| `classes`      | `Partial<Record<ComboboxPart, string>>`            | —                                          | Extra classes per [part](#parts), such as `{ content: 'max-h-64', chip: 'font-medium' }`.     |

Unlike the other form fields, every attribute, including `class`, lands on the root `<div>`, not on the input. An `aria-label`, `aria-describedby` or `autocomplete` you pass doesn't reach the input, so name the field with `label` and submit it with the `name` prop. An `id` you pass is used to build the part ids: the input gets `<id>-control`, and the hint and error `<id>-control-hint` and `<id>-control-error`.

## v-model

| Binding        | Type            | Carries                                                                                                                                             |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`      | `ComboboxValue` | The chosen value, or `null` when cleared; with `multiple`, the array of values. Options keep their original value type; created values are strings. |
| `v-model:open` | `boolean`       | Whether the listbox is open.                                                                                                                        |

Passed, each prop is controlled: the Combobox reports a change and waits for the value you pass back. Not passed, it keeps its own value and open state.

## Slots

| Slot    | Slot props                       | Description                                                                                                                  |
| ------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `icon`  | —                                | Replaces the icon from `leadingIcon`.                                                                                        |
| `item`  | `{ option: ComboboxSlotOption }` | Renders each option's content. Replaces the label with its marked match and the description. Not used for the create option. |
| `empty` | —                                | Replaces the text shown when nothing matches. Not shown while loading.                                                       |

## Events

| Event                | Payload         | Description                                                                   |
| -------------------- | --------------- | ----------------------------------------------------------------------------- |
| `@update:modelValue` | `ComboboxValue` | The value changed: an option was chosen or removed, or the value was cleared. |
| `@update:open`       | `boolean`       | The listbox opened or closed.                                                 |
| `@search-change`     | `string`        | The user typed in the input. With `remote`, fetch the matching options.       |
| `@create`            | `string`        | The user chose the create option. The payload is the typed text.              |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS. In the markup, part names of more than one word are kebab-case, such as `data-part="chip-remove"`.

| Part              | Element  | Description                                                                                                            |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `root`            | `div`    | The field, `.apui-combobox`. Carries `data-size`, `data-multiple`, `data-invalid`, `data-disabled` and `data-loading`. |
| `label`           | `label`  | The visible label.                                                                                                     |
| `required`        | `span`   | The `*` mark inside the label. `aria-hidden`.                                                                          |
| `box`             | `div`    | The bordered box around the icon, chips, input and buttons.                                                            |
| `icon`            | `span`   | The leading icon, and an option's icon in the listbox. `aria-hidden`.                                                  |
| `chip`            | `span`   | A chosen value with `multiple`. Carries `data-value` and `data-color`.                                                 |
| `chipRemove`      | `button` | A chip's remove button.                                                                                                |
| `control`         | `input`  | The text input, `role="combobox"`.                                                                                     |
| `spinner`         | `span`   | The loading spinner. Only rendered while loading. `aria-hidden`.                                                       |
| `clearTrigger`    | `button` | The clear button. Only rendered with `clearable`.                                                                      |
| `trigger`         | `button` | The chevron button that opens the listbox.                                                                             |
| `hint`            | `p`      | The help text.                                                                                                         |
| `error`           | `p`      | The error message, with an alert icon.                                                                                 |
| `positioner`      | `div`    | Positions the listbox.                                                                                                 |
| `content`         | `div`    | The listbox.                                                                                                           |
| `item`            | `div`    | One option. The create option carries `data-create`.                                                                   |
| `itemText`        | `span`   | An option's text.                                                                                                      |
| `mark`            | `mark`   | The part of a label that matches the typed text.                                                                       |
| `itemDescription` | `span`   | An option's description.                                                                                               |
| `itemIndicator`   | `span`   | The check shown on chosen options with `multiple`.                                                                     |
| `empty`           | `div`    | The empty or loading text.                                                                                             |
| `status`          | `span`   | A polite live region that announces removed chips.                                                                     |

## Types

```ts
import type {
  ComboboxColor,
  ComboboxOption,
  ComboboxOptionObject,
  ComboboxPart,
  ComboboxProps,
  ComboboxSize,
  ComboboxSlotOption,
  ComboboxValue,
} from '@artisanpack-ui/vue/form';
```

| Type                   | Description                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ComboboxProps`        | The component's props.                                                                                                                                    |
| `ComboboxOption`       | `string \| ComboboxOptionObject`                                                                                                                          |
| `ComboboxOptionObject` | `{ value: string \| number; label?: string; description?: string; icon?: string; color?: ComboboxColor; disabled?: boolean }`                             |
| `ComboboxValue`        | `string \| number \| (string \| number)[] \| null`                                                                                                        |
| `ComboboxSlotOption`   | The option the `item` slot receives: `{ value: string; label: string; description?; icon?; color?; disabled?; create? }`. Its `value` is always a string. |
| `ComboboxColor`        | The eight semantic colors, for an option's chip.                                                                                                          |
| `ComboboxSize`         | `'sm' \| 'md' \| 'lg'`                                                                                                                                    |
| `ComboboxPart`         | The part names in the [Parts](#parts) table.                                                                                                              |

## Accessibility

| Keys                    | Action                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `Tab`                   | Moves focus to the input.                                                                |
| Typing                  | Filters the options (or sends the search, with `remote`) and highlights the first match. |
| `ArrowDown` / `ArrowUp` | Opens the listbox and moves through the options, skipping disabled ones.                 |
| `Home` / `End`          | Moves to the first or last option while open.                                            |
| `Enter`                 | Chooses the highlighted option; with `multiple`, toggles it and keeps the listbox open.  |
| `Escape`                | Closes the listbox; the value stays.                                                     |
| `Backspace`             | With `multiple`, in the empty input, removes the last chip and announces it.             |

- Always pass a visible `label`. Attributes land on the root, so an `aria-label` doesn't name the input.
- The input is `role="combobox"` with `aria-expanded`, `aria-controls`, `aria-autocomplete="list"` and `aria-activedescendant` on the highlighted option.
- The listbox is labelled by the label; with `multiple` it sets `aria-multiselectable`, and chosen options set `aria-selected`.
- Matches are shown with weight and an underline, not color alone.
- Each chip's remove button is named "Remove {label}"; removing a chip is announced through the status region.
- Hint and error are linked to the input with `aria-describedby`; invalid sets `aria-invalid`.
- The listbox opens under the control at its start edge, mirrors in RTL and flips when there's no room.

## Related

- [Combobox in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/combobox): anatomy, tokens and live examples.
- [Select](select.md) for short lists without typing.
- [CheckboxGroup](checkbox-group.md) for a few options that should all stay visible.
- [Input](input.md) for the shared field anatomy.
