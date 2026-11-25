---
title: Form
menu_order: 10
meta_description: The Vue form components. Text fields, choices, pickers, uploads and form layout, and the label, hint, error and attribute behavior they share.
---

# Form

The form components collect input: text fields, choices, pickers, uploads, and the form and fieldset that lay them out. Import them from the `@artisanpack-ui/vue/form` subpath, or from the package root.

```ts
import { Button, Checkbox, Input, Select } from '@artisanpack-ui/vue/form';
```

## Components

- [Button](form/button.md): triggers an action, or links with the same styles.
- [Checkbox](form/checkbox.md): turns one option on or off, with an indeterminate state.
- [CheckboxGroup](form/checkbox-group.md): a labeled set of checkboxes bound to an array, with select all, columns and cards.
- [CodeEditor](form/code-editor.md): editable code with file tabs, a language select, line numbers and diagnostics.
- [ColorPicker](form/color-picker.md): a color field with a popover area, sliders, formats, eyedropper and swatches.
- [Combobox](form/combobox.md): a text input that filters a listbox, for one value, several as chips, or tags.
- [DatePicker](form/date-picker.md): a date field with a calendar popover, for a date, a range, or a date and time.
- [Fieldset](form/fieldset.md): groups related fields under a legend.
- [File](form/file.md): uploads files by dropping or browsing, with progress, errors and remove buttons.
- [Form](form/form-component.md): a native form that stacks its fields and ends with an actions row.
- [Input](form/input.md): a single-line text field with prefix, suffix and icons.
- [Password](form/password.md): a password field with a reveal button, strength meter and live requirements.
- [Pin](form/pin.md): a row of single-character cells for one-time codes.
- [RadioGroup](form/radio-group.md): chooses exactly one option from a small set.
- [Range](form/range.md): a slider for one value, or two thumbs for a from–to range.
- [Rating](form/rating.md): shows a star score, or collects one.
- [RichTextEditor](form/rich-text-editor.md): formatted text editing with a toolbar.
- [Select](form/select.md): chooses one value from a short list with the native select.
- [Signature](form/signature.md): captures a signature by drawing, typing or uploading.
- [Textarea](form/textarea.md): multi-line text with an optional character counter.
- [Toggle](form/toggle.md): a switch for settings that take effect immediately.
- [ValidationSummary](form/validation-summary.md): lists every error in a form after a failed submit, each linked to its field.

The deprecated `Editor`, `Radio` and `FileUpload` aliases are covered in [Deprecated components](deprecated.md).

## Shared field behavior

The form fields render the same anatomy and follow the same rules, so what you learn on [Input](form/input.md) carries over.

### Label, hint and error

Most fields take `label`, `hint` and `error` props:

- `label` renders a visible `<label>` linked to the native control with `for`/`id`. Always pass one. A field without a label needs an `aria-label`, and a placeholder never replaces the label. CheckboxGroup and RadioGroup render the label as the `<legend>` of their fieldset.
- `hint` renders help text under the control.
- `error` renders the message after the hint, with an alert icon, so the error is never shown by color alone. It also marks the field invalid.
- `invalid` marks the field invalid without a message, for when the message is shown elsewhere, such as in a [ValidationSummary](form/validation-summary.md).

Checkbox and Toggle take `description` instead of `hint`. Rating has no hint, error or `required`.

Invalid fields set `data-invalid` on the root and `aria-invalid="true"` on the control. A field that isn't invalid leaves `aria-invalid` alone, so one you pass yourself is kept. The error text isn't a live region: after a failed submit, move focus to the first invalid field or show a ValidationSummary, which takes focus.

### How ids and aria-describedby connect

Each field generates a unique id with `useId()`, or uses the `id` attribute you pass. That id goes on the control, and the hint and error get `<id>-hint` and `<id>-error`. The control's `aria-describedby` lists the hint, then the error, then any `aria-describedby` you passed, so screen readers read the help text and the message after the label. Fields with more parts add theirs: Checkbox links its description, DatePicker its time-zone line, and CodeEditor its keyboard instructions.

In CheckboxGroup and RadioGroup, the hint and error are linked to the `<fieldset>` rather than to each option, and invalid sets `aria-invalid` on every option.

### Required

`required` sets the native `required` attribute on the control, so the browser's own validation runs inside a [Form](form/form-component.md). Text-like fields also show a `*` after the label; the mark is `aria-hidden`, because screen readers already announce "required". Checkbox and Toggle set `required` without a mark. CheckboxGroup, Range and Rating have no `required` prop.

### Where attributes go

On the form fields, `class` goes to the root element and every other attribute goes to the native control: `id`, `name`, `autocomplete`, `inputmode`, `aria-*`, `data-*` and listeners such as `@blur`. So `name` and other form attributes work the way they do on a plain `<input>`, and the field is submitted with a native form.

The exceptions:

- **Combobox** puts every attribute on its root, so an `aria-label`, `aria-describedby` or `autocomplete` doesn't reach its input. Name it with `label`, and submit it with its `name` prop, which renders hidden inputs carrying the value.
- **DatePicker** submits the ISO value through its `name` prop. A `name` attribute would submit the typed text instead.
- **CheckboxGroup** and **RadioGroup** put attributes on the `<fieldset>`, except `name`, which lands on every option.
- **Fieldset** and **Form** put every attribute on their native element.

Every part also takes extra classes through the `classes` prop, keyed by part name, and carries a `data-part` attribute you can target in CSS. Each component page lists its parts.

### Controlled and uncontrolled

Bind the value with `v-model` (Checkbox and Toggle use `v-model:checked`). A bound field follows the value you pass. Without a binding, it keeps its own state and still emits its `update:*` event. Fields with a popover, such as Combobox, DatePicker and ColorPicker, bind `v-model:open` the same way. See [v-model](../components.md#v-model) for the full list.

When a native form resets, the uncontrolled Checkbox, Textarea and Pin follow it: the Checkbox goes back to its `checked` prop, and Textarea's counter and Pin's cells show the reset value.

### Translated text

Built-in text, such as "Select all", "Show options" or "Remove :name", defaults to translated English. Each component also takes a prop for every string, so you can pass your own. Placeholders in those strings, written `:name` or `{name}` as each prop documents, are filled in for you; a placeholder the component doesn't know is left as written.

## Shared option lists

CheckboxGroup and RadioGroup take the same `options` shape:

- A string is both the value and the label.
- An object has `value` (a string or number) and optional `label` (defaults to the value), `description` (shown under the label and linked with `aria-describedby`), `meta` (a price or other figure, shown on RadioGroup cards) and `disabled`.

Values are compared as strings, so `1` and `'1'` match the same option, but `v-model` receives each value as you gave it: a number stays a number. Combobox and Select take their own option types with the same string-or-object idea.

## Shared text rules

Some fields follow rules every stack shares, so the same input gives the same result in Vue, React and Livewire:

- **Textarea** announces the characters left only near the limit: when they reach 10, or 10% of `maxLength` if that's more.
- **Password** scores strength from 0 (empty) to 4: one point each for 8 or more characters, 12 or more, mixed case, a digit and a symbol, minus one, between 1 and 4. A requirement whose pattern isn't a valid regular expression counts as unmet.
- **Pin** keeps only the characters its `type` allows (digits, or letters and digits) and stops at its length, also when people paste.
- **Range** places values as a percentage of the track, clamped to 0–100, and its `format` fills `{value}` for the bubble, the marks and `aria-valuetext`. A dual range submits both thumbs as `name[]`; `aria-label` and `aria-labelledby` become part of each thumb's name, and other `aria-*` attributes go on the start thumb.
- **ValidationSummary** takes errors as a list of `{ field, message }` or as a map of field names to a message or an array of messages (the first is shown). Empty messages are dropped. Its links move focus to the field: the element with that id, else the control with that `name`, else one bound with that `wire:model`.

## Related

- [Components](../components.md) for v-model bindings, icons and the full component list.
- [Getting started](../getting-started.md) to install the package and load the CSS.
