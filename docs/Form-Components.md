# Form Components

```ts
import { Button, Input, Select, Checkbox, Toggle, Radio, Textarea, Password, Pin, Range, DatePicker, ColorPicker, Editor, RichTextEditor, FileUpload } from '@artisanpack-ui/vue/form';
```

---

## Button

A versatile button that can render as a `<button>` or `<a>` element with badge, tooltip, loading, and responsive support.

```vue
<Button color="primary" @click="save">Save</Button>
<Button link="/about" external>Learn More</Button>
<Button :loading="submitting" color="success">Submit</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label. Hidden on small screens when `responsive` is true |
| `color` | `DaisyColor \| 'ghost' \| 'outline'` | -- | DaisyUI color variant |
| `size` | `Size` | -- | Button size (`xs`, `sm`, `md`, `lg`) |
| `loading` | `boolean` | `false` | Shows a loading spinner in place of the left icon |
| `link` | `string` | -- | Renders as `<a>` element with this URL |
| `external` | `boolean` | `false` | Opens link in new tab with `rel="noopener noreferrer"` |
| `badge` | `string` | -- | Badge text after the label |
| `badgeColor` | `DaisyColor \| 'ghost' \| 'outline'` | -- | Badge color variant |
| `badgeClasses` | `string` | -- | Additional badge CSS classes |
| `responsive` | `boolean` | `false` | Hides label on small screens |
| `tooltip` | `string` | -- | Tooltip text on hover |
| `tooltipPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML type attribute |

---

## Input

A text input with label, icons, prefix/suffix adornments, clearable action, and inline label mode.

```vue
<Input label="Email" type="email" v-model="email" />
<Input label="Search" v-model="search" clearable inline />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text below the input |
| `error` | `string` | -- | Error message (replaces hint, adds `aria-invalid`) |
| `clearable` | `boolean` | `false` | Shows a clear (X) button |
| `inline` | `boolean` | `false` | Floating/inline label mode |
| `id` | `string` | auto | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `type` | `'text' \| 'email' \| 'number' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'hidden'` | `'text'` | Input type |
| `placeholder` | `string` | -- | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |

---

## Select

A dropdown select with option mapping, placeholder, icons, and inline label.

```vue
<Select label="Country" v-model="country" :options="countries" option-value="id" option-label="name" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `placeholder` | `string` | -- | Disabled placeholder option text |
| `placeholderValue` | `string` | `''` | Value for the placeholder option |
| `inline` | `boolean` | `false` | Inline label mode |
| `optionValue` | `string` | `'id'` | Property key for option values |
| `optionLabel` | `string` | `'name'` | Property key for option labels |
| `options` | `SelectOption[]` | -- | Array of option objects |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |

Option groups: an `options` entry with a `label` and its own `options` renders a native `<optgroup>` (this replaces Livewire's `select-group`).

```vue
<Select v-model="type" label="Property type" :options="[{ label: 'Apartments', options: ['Studio', 'Loft'] }]" />
```

---

## Combobox

A text input that filters a listbox (design-system Combobox, #54). Pick one value, or several shown as removable chips with `multiple`; `allowCreate` offers “Create …” for unlisted text, so `multiple` + `allowCreate` is the tags input. Typing filters by label, ignoring case and accents, and marks the match. With `remote`, filter the options yourself on `search-change`.

```vue
<Combobox v-model="property" label="Property" leading-icon="search" :options="properties" />

<Combobox v-model="tags" label="Listing tags" multiple allow-create :options="tagOptions" @create="addTag" />

<Combobox v-model="owner" label="Owner" remote :loading="loading" :options="results" @search-change="query = $event" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| (string \| number)[] \| null` | -- | The value (`v-model`); an array with `multiple`. An option's number value comes back as that number |
| `options` | `ComboboxOption[]` | `[]` | Strings or `{ value, label, description, icon, color, disabled }` |
| `label` / `hint` / `error` | `string` | -- | Field label, help text and validation message |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height |
| `multiple` | `boolean` | `false` | Several values as chips; Backspace in the empty input removes the last |
| `max` | `number` | -- | With `multiple`, the most values; the rest are disabled once reached |
| `allowCreate` | `boolean` | `false` | Offers “Create …” for new text; emits `create` |
| `remote` | `boolean` | `false` | You filter the options on `search-change` |
| `search` | `string` | -- | The input's initial text, which filters and marks the options |
| `loading` | `boolean` | `false` | Spinner and loading text |
| `clearable` | `boolean` | `false` | A button that clears the value |
| `open` | `boolean` | `false` | The listbox (`v-model:open`) |
| `portal` | `boolean` | `true` | Teleports the listbox to the body |
| `leadingIcon` | `string` | -- | Icon name before the input (or the `icon` slot) |
| `invalid` / `disabled` / `required` | `boolean` | `false` | States |
| `placeholder` | `string` | `'Search…'` | Empty input text |
| `name` | `string` | -- | Submits the value with a native form: a hidden input per value (use `tags[]` for an array), none while empty |
| `emptyLabel`, `loadingLabel`, `createLabel`, `removeLabel`, `removedLabel`, `clearLabel`, `triggerLabel` | `string` | English | Built-in text, for translation; `{search}`, `{value}` and `{label}` are filled in |
| `classes` | `object` | -- | Extra classes per part |

Events: `update:modelValue`, `update:open`, `search-change` (the typed text), `create` (the new value). Slots: `icon`, `empty`, `item` (`#item="{ option }"`).

---

## Checkbox

Checkbox with label, card layout variant, and color support.

```vue
<Checkbox label="I agree to the terms" v-model="agreed" color="primary" />
<Checkbox label="Premium" v-model="isPremium" card />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `right` | `boolean` | `false` | Position label to the right |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `color` | `DaisyColor` | -- | Color variant |
| `card` | `boolean` | `false` | Card layout mode |
| `cardClass` | `string` | -- | Additional card CSS classes |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Toggle

A switch for settings that take effect immediately (design system, `.apui-toggle`): a native checkbox with `role="switch"`. Bind it with `v-model:checked`. Label the setting, not the state; in forms that need a submit, use Checkbox.

```vue
<Toggle v-model:checked="darkMode" label="Dark mode" />
<Toggle v-model:checked="digest" label="Weekly digest" description="Every Monday at 9:00." color="success" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | On or off; bind with `v-model:checked` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track size (`data-size`) |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Track color when on (`data-color`) |
| `label` | `string` | -- | Visible label, linked to the control |
| `description` | `string` | -- | Supporting text, linked with `aria-describedby` |
| `error` | `string` | -- | Validation message; marks it invalid |
| `invalid` | `boolean` | `false` | Invalid without a message |
| `disabled` | `boolean` | `false` | Disabled state |
| `required` | `boolean` | `false` | Sets `required` on the control |
| `classes` | `Partial<Record<TogglePart, string>>` | -- | Extra classes per part |

Emits `update:checked`. `class` goes to the root; other attributes go to the native checkbox.
---

## Radio

> **Deprecated.** Use [RadioGroup](#radiogroup). Radio is removed in a later major release.

Radio button group from an options array with card layout and orientation support.

```vue
<Radio label="Plan" v-model="plan" :options="plans" option-value="id" option-label="name" />
<Radio v-model="size" :options="sizes" card />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Group label (rendered as `<legend>`) |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `color` | `DaisyColor` | -- | Color variant |
| `optionValue` | `string` | `'id'` | Property key for option values |
| `optionLabel` | `string` | `'name'` | Property key for option labels |
| `optionHint` | `string` | `'hint'` | Property key for option hint text |
| `options` | `RadioOption[]` | -- | Array of option objects |
| `inline` | `boolean` | `false` | Horizontal layout (when `card` is false) |
| `card` | `boolean` | `false` | Card layout mode |
| `cardClass` | `string` | -- | Additional card CSS classes |
| `id` | `string` | -- | Custom fieldset ID |
| `name` | `string` | -- | Radio group name |
| `required` | `boolean` | `false` | Required field |

---

## RadioGroup

Chooses exactly one option from a small set (`.apui-radio-group`): native radios in a fieldset, so arrow keys move between options and follow the text direction. Replaces the deprecated `Radio`. A `name` attribute names every radio.

```vue
<RadioGroup v-model="plan" label="Plan" variant="cards" :options="plans" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `RadioGroupOption[]` | `[]` | Strings, or `{ value, label, description, meta, disabled }` objects |
| `modelValue` | `string \| number` | -- | The selected value (`v-model`) |
| `label` | `string` | -- | The legend |
| `hint` | `string` | -- | Help text, linked to the fieldset |
| `error` | `string` | -- | Validation message; marks every radio invalid |
| `invalid` | `boolean` | `false` | Invalid without a message |
| `disabled` | `boolean` | `false` | Disables every option |
| `required` | `boolean` | `false` | Sets `required` and shows the required mark |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Stacks or rows |
| `variant` | `'default' \| 'cards' \| 'segmented'` | `'default'` | Plain radios, cards or joined segments |
| `classes` | `Partial<Record<RadioGroupPart, string>>` | -- | Extra classes per part |

---

## CheckboxGroup

A labeled set of Checkboxes (`.apui-checkbox-group`) whose value is the array of checked values, with select all (mixed state), columns and cards. A `name` attribute (such as `topics[]`) lands on every checkbox.

```vue
<CheckboxGroup v-model="topics" label="Notify me about" :options="options" select-all />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `CheckboxGroupOption[]` | `[]` | Strings, or `{ value, label, description, disabled }` objects |
| `modelValue` | `(string \| number)[]` | -- | The checked values (`v-model`) |
| `label`, `hint`, `error`, `invalid`, `disabled` | | | As in RadioGroup |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `variant` | `'default' \| 'cards'` | `'default'` | Cards are clickable anywhere |
| `columns` | `number` | `1` | 1, 2 or 3 columns |
| `selectAll` | `boolean` | `false` | Adds a select-all Checkbox |
| `selectAllLabel` | `string` | `'Select all'` | Its label; pass a translation |

---

## Rating

Shows a star score (`readonly`: one image with a text alternative, half stars) or collects one with native radios (`.apui-rating`). The stars mirror under RTL.

```vue
<Rating readonly :model-value="4.2" :count="17" />
<Rating v-model="score" label="Rate the viewing" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | -- | The score (`v-model`) |
| `max` | `number` | `5` | The number of stars |
| `readonly` | `boolean` | `false` | Shows the score instead of collecting it |
| `disabled` | `boolean` | `false` | Disables the radios |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Star size |
| `count` | `number` | -- | The number of reviews |
| `label` | `string` | -- | The input's accessible name |
| `valueLabel` | `string` | `':value out of :max'` | The text alternative and each radio's name |
| `countLabel` | `string` | `'(:count reviews)'` | The count text |

---

## Textarea

Multi-line text entry in Input's field anatomy (design system, `.apui-textarea`), with an optional character counter. Screen readers hear the characters left only near the limit.

```vue
<Textarea v-model="notes" label="Notes" :rows="3" />
<Textarea v-model="description" label="Description" :max-length="500" auto-resize />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `4` | Visible lines (the minimum with `autoResize`) |
| `maxLength` | `number` | -- | Sets `maxlength` and shows the counter |
| `autoResize` | `boolean` | `false` | Grows with the content (`data-auto-resize`) |
| `label` | `string` | -- | Visible label, linked to the control |
| `hint` | `string` | -- | Help text, linked with `aria-describedby` |
| `error` | `string` | -- | Validation message; marks the field invalid |
| `invalid` | `boolean` | `false` | Invalid without a message |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `required` | `boolean` | `false` | Required, with the required mark |
| `placeholder` | `string` | -- | Placeholder text |
| `remainingLabel` | `string` | `'Characters left: {count}'` | Counter announcement near the limit; translate it |
| `classes` | `Partial<Record<TextareaPart, string>>` | -- | Extra classes per part |

Bind with `v-model` (`update:modelValue`).
---

## Password

Password entry with a reveal toggle (design system, `.apui-password`), an optional strength meter and live requirements. The reveal button keeps one name and toggles `aria-pressed`.

```vue
<Password v-model="password" label="Password" leading-icon="lock" />
<Password
  v-model="newPassword"
  label="New password"
  autocomplete="new-password"
  strength-meter
  :requirements="[{ label: 'At least 12 characters', pattern: '.{12,}' }]"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height |
| `autocomplete` | `'current-password' \| 'new-password'` | `'current-password'` | Autocomplete hint |
| `label` / `hint` / `error` | `string` | -- | Field anatomy, as Input |
| `invalid` / `disabled` / `readonly` / `required` | `boolean` | `false` | States |
| `placeholder` | `string` | -- | Placeholder text |
| `leadingIcon` | `string` | -- | Icon name before the value, such as `lock` (or the `icon` slot) |
| `strengthMeter` | `boolean` | `false` | Shows the strength meter (Weak, Fair, Good, Strong) |
| `requirements` | `{ label, pattern }[]` | -- | Rules checked as people type (`pattern` is a RegExp source) |
| `revealLabel` | `string` | `'Show password'` | Reveal button name; translate it |
| `labels` | `Partial<PasswordLabels>` | English | Strength and requirement-state text; translate it |
| `classes` | `Partial<Record<PasswordPart, string>>` | -- | Extra classes per part |

Bind with `v-model`. Never block paste.
---

## Pin

A row of cells for one-time codes (design system, `.apui-pin`). One native input with `autocomplete="one-time-code"` drives the cells, so SMS autofill and paste fill the whole code.

```vue
<Pin v-model="code" label="Verification code" :group-size="3" @complete="verify" />
<Pin v-model="pin" label="PIN" :length="4" mask />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | `number` | `6` | Number of cells |
| `type` | `'numeric' \| 'alphanumeric'` | `'numeric'` | Characters allowed; others are dropped |
| `mask` | `boolean` | `false` | Shows dots; the control becomes a password input |
| `groupSize` | `number` | -- | A separator after every `groupSize` cells |
| `size` | `'sm' \| 'md'` | `'md'` | Cell size |
| `label` / `hint` / `error` | `string` | -- | Field anatomy |
| `invalid` / `disabled` / `required` | `boolean` | `false` | States |
| `classes` | `Partial<Record<PinPart, string>>` | -- | Extra classes per part |

Emits `update:modelValue` and `complete` (the code, once every cell is filled).
---

## Range

A slider for one value or a from–to range (design system, `.apui-range`): a native `<input type="range">` per thumb over the drawn track. It fills from the right under RTL.

```vue
<Range v-model="radius" label="Search radius" :max="50" format="{value} km" />
<Range v-model="price" label="Price" dual :min="100" :max="700" format="${value}k" show-value="always" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` / `max` / `step` | `number` | `0` / `100` / `1` | Bounds and step |
| `modelValue` | `number \| [number, number]` | midpoint / `[min, max]` | Bind with `v-model` |
| `dual` | `boolean` | `false` | Two thumbs that can't cross |
| `showValue` | `'never' \| 'focus' \| 'always'` | `'focus'` | When the value bubble shows |
| `format` | `string` | -- | `{value}` template for the bubble and `aria-valuetext` |
| `marks` | `{ value, label }[]` | -- | Labels under the track |
| `color` | eight semantic colors | `'primary'` | Fill and thumb edge |
| `size` | `'sm' \| 'md'` | `'md'` | Thumb size |
| `label` / `hint` / `error` | `string` | -- | Field anatomy |
| `invalid` / `disabled` | `boolean` | `false` | States |
| `thumbLabels` | `{ start?, end? }` | `Minimum` / `Maximum` | Thumb names with `dual`; translate them |
| `classes` | `Partial<Record<RangePart, string>>` | -- | Extra classes per part |
---

## Fieldset

Groups related fields under a legend (design system, `.apui-fieldset`): a native `<fieldset>`, so the group's name is announced with each field. Put fields side by side in `<div data-scope="fieldset" data-part="row">`.

```vue
<Fieldset title="Contact" description="Who buyers and renters should reach.">
  <Input v-model="name" label="Full name" />
</Fieldset>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'panel' \| 'divided' \| 'plain'` | `'panel'` | Look (`data-variant`) |
| `title` | `string` | -- | The group's name (or the `title` slot) |
| `description` | `string` | -- | Supporting text (or the `description` slot) |
| `disabled` | `boolean` | `false` | Disables every control inside |
| `classes` | `Partial<Record<FieldsetPart, string>>` | -- | Extra classes per part |

---

## Form

A native form (design system, `.apui-form`) that stacks its fields with the field gap and ends with the `actions` slot, aligned to the end. Listen for the native `submit`.

```vue
<Form aria-label="Invite member" @submit.prevent="save">
  <Input v-model="email" type="email" label="Email" />
  <template #actions><Button type="submit">Send invite</Button></template>
</Form>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `string` | -- | Actions text (use the `actions` slot for buttons) |
| `divided` | `boolean` | `false` | An edge above the actions (`data-divided`) |
| `classes` | `Partial<Record<FormPart, string>>` | -- | Extra classes per part |

---

## ValidationSummary

Lists every error in a form after a failed submit, each linked to its field (design system, `.apui-validation-summary`). Errors are an alert that takes focus; warnings are a status. A link focuses the element with that id, else the control with that name. Renders nothing without errors. Not the same as ErrorState.

```vue
<ValidationSummary :errors="form.errors" />
<ValidationSummary color="warning" :errors="[{ field: 'description', message: 'Description is short.' }]" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `errors` | `{ field, message }[] \| Record<string, string \| string[]>` | -- | The errors (a map shows each field's first message) |
| `color` | `'error' \| 'warning'` | `'error'` | Alert or status |
| `title` | `string` | `Fix N fields` / `N recommendations` | Heading (or the `title` slot); translate it |
| `classes` | `Partial<Record<ValidationSummaryPart, string>>` | -- | Extra classes per part |

---

## DatePicker

A text field with a calendar popover for a single date or a range, built on the design system (`.apui-date-picker`, styled by `@artisanpack-ui/css`) and the behavior engine's date-picker machine. With `time` it is DateTime: date and time in one field. Typing a date always works; the calendar is an aid. Values are ISO 8601 strings: `2026-11-12`, `2026-11-12T11:00` with `time`, and an array of two with `mode="range"`.

```vue
<DatePicker v-model="moveIn" label="Move-in date" hint="MM/DD/YYYY" required />
<DatePicker v-model="stay" mode="range" label="Stay" :min="today" :disabled-dates="blackoutDates" />
<DatePicker v-model="viewingAt" time :step="30" time-zone="Europe/Madrid" label="Viewing" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` (`v-model`) | `string \| string[] \| null` | -- | The ISO value. Passed, it's controlled; not passed, the picker keeps its own |
| `mode` | `'single' \| 'range'` | `'single'` | One date, or two in one box (`data-mode`) |
| `time` | `boolean` | `false` | Adds a time list beside the month; the value carries the time (`data-time`). Single mode only |
| `step` | `number` | `30` | Minutes between times (24-hour) |
| `timeZone` | `string` | -- | IANA zone, shown under the field in time mode |
| `locale` | `string` | `'en-US'` | Month and weekday names from `Intl`, the first day of the week and the default pattern |
| `min` / `max` | `string` | -- | Earliest and latest dates, ISO |
| `disabledDates` | `string[]` | -- | Dates that can't be chosen, struck through |
| `weekStartsOn` | `number` | locale | First day of the week, 0 (Sunday) to 6 |
| `format` | `string` | locale | Text pattern with `yyyy`, `MM`, `dd` (`dd.MM.yyyy`) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height (`data-size`) |
| `label` / `hint` / `error` | `string` | -- | The field anatomy shared with Input; `label` and `hint` slots too |
| `invalid` / `disabled` / `readonly` / `required` | `boolean` | `false` | Field states |
| `placeholder` | `string` | the pattern | `MM/DD/YYYY` by default |
| `name` | `string` | -- | Submits the ISO value in a hidden input (`name[]` twice in range mode) |
| `open` (`v-model:open`) | `boolean` | `false` | Whether the calendar is open |
| `portal` | `boolean` | `true` | Teleports the popover to the body. Off renders it in place |
| `footer` | `string` | -- | A row under the calendar; the `footer` slot too |
| `triggerLabel` | `string` | `'Choose date'` | The calendar button's name (`'Choose date and time'` with `time`); translate it |
| `previousLabel` / `nextLabel` | `string` | `'Previous month'` / `'Next month'` | The month buttons' names |
| `calendarLabel` / `timeLabel` / `endLabel` | `string` | `'Calendar'` / `'Time'` / `'End date'` | The popover's, the time list's and the end input's names |
| `timeZoneLabel` | `string` | `'Time zone: {zone}'` | The time-zone line |
| `classes` | `Partial<Record<DatePickerPart, string>>` | -- | Extra classes per part |

Emits `update:modelValue` and `update:open`. `class` goes to the root; other attributes go to the (first) text input. The month is a `role="grid"`: arrow keys move by day and week and follow the text direction (they swap under RTL), PageUp and PageDown change month, and the month buttons' arrows mirror. The time list is a listbox.

**Migrating from 1.x:** `dateType` and `inline` are gone. `date-type="datetime-local"` is `time`; native `time`, `month` and `week` inputs are plain `<Input type="…">`.

---

## ColorPicker

A color field (`.apui-color-picker`) on the behavior engine's color-picker machine (`useColorPicker`, Zag). The swatch opens a popover with a saturation and brightness area, hue and opacity sliders, a format select (HEX, RGB, HSL, OKLCH), an eyedropper (only where the browser has the EyeDropper API) and preset swatches. The text value stays in the field, always available for typing in any format. Attributes other than `class` land on the text value.

```vue
<ColorPicker v-model="accent" label="Accent color" format="oklch" :swatches="brand" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | -- | The color as text (`v-model`), reported in the current format |
| `format` | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'` | `'hex'` | The text format; the format select switches it |
| `alpha` | `boolean` | `true` | Offers opacity; off keeps every value opaque |
| `swatches` | `string[]` | `[]` | Preset colors, shown in the popover |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height |
| `label`, `hint`, `error`, `invalid`, `disabled`, `required` | | | The shared field anatomy |
| `open` | `boolean` | `false` | The popover's open state (`v-model:open`) |
| `portal` | `boolean` | `true` | Renders the popover at the end of the body (Teleport) |
| `triggerLabel`, `areaLabel`, `hueLabel`, `alphaLabel`, `formatLabel`, `eyeDropperLabel`, `swatchesLabel` | `string` | English | Built-in accessible names; pass translations |

Emits `update:modelValue`, `update:open` and `format-change`. The DaisyUI props (`icon`, `clearable`, `random`, …) are gone.

---

## CodeEditor

Editable code in a native textarea (`.apui-code-editor`): file tabs, a language select, line numbers, the active line, diagnostics listed in text and a status bar. Tab indents; Escape, then Tab, leaves the editor. The code stays left to right in RTL. `class` goes to the root; every other attribute goes to the textarea.

```vue
<CodeEditor v-model="css" label="Custom CSS" language="CSS" :rows="8" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `string` | -- | Shown in the status bar and selected in the language select |
| `languages` | `(string \| { value, label })[]` | -- | Options for the language select |
| `tabs` | `(string \| { value, label })[]` | -- | File tabs, a tablist over the code |
| `tab` | `string` | first tab | The selected tab |
| `diagnostics` | `{ line, column?, message, severity? }[]` | -- | Marked in the gutter and listed in text |
| `tabSize` | `number` | `2` | Spaces Tab inserts |
| `rows` | `number` | `12` | The fewest lines shown; grows with the content |
| `label`, `hint`, `error` | | | The shared field anatomy |
| `invalid`, `disabled`, `readonly`, `required` | `boolean` | `false` | States |
| `tabsLabel`, `languageLabel`, `positionLabel`, `spacesLabel`, `errorCountLabel`, `errorsCountLabel`, `warningCountLabel`, `warningsCountLabel`, `problemsLabel`, `lineLabel`, `severityErrorLabel`, `severityWarningLabel`, `severityInfoLabel`, `instructionsLabel` | `string` | English | Built-in strings; pass translations. Count and position labels take `:count`, `:max`, `:line` and `:column`. |

Events: `update:modelValue`, `tab-change` and `language-change` (each with a string).

---

## Editor

> **Deprecated.** Use [CodeEditor](#codeeditor), the design-system replacement. `Editor` is removed in a later major release.

Monospace textarea for code or structured text editing: `<Editor label="JSON Config" v-model="config" :rows="15" />`.

---

## RichTextEditor

Formatted text with a toolbar over the shared prose styles (`.apui-rich-text-editor`), on a built-in contentEditable engine. Livewire runs TinyMCE behind the same toolbar; the Vue editor has no uploads, and Link and Image ask for a URL with the browser prompt. The value is sanitized to the editor's formats (safe URLs only) before it's shown. `class` goes to the root, `name` to a hidden input.

```vue
<RichTextEditor v-model="body" label="Description" counter />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toolbar` | `'default' \| 'compact' \| 'minimal' \| RichTextToolbarItem[]` | `'default'` | A preset or a list of commands and `'\|'` dividers |
| `output` | `'html' \| 'markdown'` | `'html'` | The format `v-model` reads and writes. Markdown drops underline |
| `maxLength` | `number` | -- | Typing stops at the limit; the footer counts against it |
| `counter` | `boolean` | `false` | Shows the word and character count |
| `label`, `hint`, `error` | | | The shared field anatomy |
| `invalid`, `disabled`, `readonly`, `required` | `boolean` | `false` | States |
| `placeholder` | `string` | -- | Shown while the content is empty |
| `toolbarLabel`, `boldLabel`, `italicLabel`, `underlineLabel`, `strikeLabel`, `heading2Label`, `heading3Label`, `bulletListLabel`, `orderedListLabel`, `quoteLabel`, `codeLabel`, `linkLabel`, `imageLabel`, `undoLabel`, `redoLabel`, `linkPromptLabel`, `imagePromptLabel`, `imageAltPromptLabel`, `shortcutsLabel`, `wordLabel`, `wordsLabel`, `characterLabel`, `charactersLabel`, `limitLabel` | `string` | English | Built-in strings; pass translations. Count and position labels take `:count`, `:max`, `:line` and `:column`. |

Keyboard: Mod+B/I/U, Mod+Shift+X, Mod+Shift+7/8, Mod+K; `##`, `###`, `-`, `1.` or `>` then Space at the start of a line. **Breaking in 2.0:** `minHeight` is gone and the toolbar is built in.

---

## Signature

Draw, type or upload a signature (`.apui-signature`). Every mode gives the same value, a PNG data URL; Type is always offered as the keyboard path.

```vue
<Signature v-model="signature" label="Signature" hint="Olivia Rhye · Nov 7, 2026" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'draw' \| 'type' \| 'upload'` | `'draw'` | The mode shown first |
| `modes` | `SignatureMode[]` | all | The modes offered; `type` is always added |
| `penColor` | `'default'` or a semantic color | `'default'` | The ink |
| `label`, `hint`, `error` | | | The shared field anatomy |
| `invalid`, `disabled`, `required` | `boolean` | `false` | States |
| `placeholder` | `string` | `'Sign above the line'` | The text under the line |
| `modesLabel`, `drawLabel`, `typeLabel`, `uploadLabel`, `padLabel`, `typedLabel`, `uploadTriggerLabel`, `undoLabel`, `clearLabel`, `clearedLabel` | `string` | English | Built-in strings; pass translations. Count and position labels take `:count`, `:max`, `:line` and `:column`. |

---

## File

Uploads files by dropping or browsing (`.apui-file`): the native file input is transparent over the drop zone, and the list shows sizes, progress, errors and remove buttons. Exported as `File`; `FileUpload` is a deprecated alias of the new `File`, with the new API: the 2.x `filesSelected` event and the `withDragDrop`, `dragDropText`, `dragDropClass`, `progress` and `hideProgress` props are gone (use `v-model` and per-file entries). `File` shadows the browser global where you import it, so alias it if you need both: `import { File as FileUpload } from '@artisanpack-ui/vue'`.

```vue
<File v-model="photos" label="Listing photos" multiple accept="image/*" hint="JPG or PNG, up to 20 MB each" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | The visible label; without it the title names the input |
| `title` | `string` | `'Drop files here or browse'` | The drop zone's main line |
| `hint` | `string` | -- | The limits |
| `error`, `invalid`, `disabled`, `required` | | | The shared field anatomy |
| `accept` | `string` | -- | Accepted file types |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `maxSize` | `number` | -- | Bytes, emitted as `data-max-size`; validate on `update:modelValue` |
| `variant` | `'dropzone' \| 'compact'` | `'dropzone'` | Drop zone or compact row |
| `modelValue` | `(File \| FileEntry)[]` | -- | The files to list (`v-model`); entries take `{ name, size, progress, error }` |
| `removeLabel` | `string` | `'Remove :name'` | The remove buttons' name |

Emits `update:modelValue` and `remove` (`file, index`). `withDragDrop`, `dragDropText`, `progress` and `hideProgress` are gone: the drop zone is always on, and progress is per file.
