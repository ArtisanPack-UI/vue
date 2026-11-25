---
title: DatePicker
menu_order: 70
meta_description: The Vue DatePicker component. A date field with a calendar popover, for one date, a range, or a date and time, with every prop and part.
---

# DatePicker

A date field with a calendar popover. People can always type a date in the field; the calendar button opens a month grid to pick one instead. It handles one date, a range of two, or with `time` a date and time in one field. Values are ISO 8601 strings, and month and weekday names come from `Intl` in the locale.

```ts
import { DatePicker } from '@artisanpack-ui/vue/form';
// or
import { DatePicker } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@artisanpack-ui/vue/form';

const moveIn = ref<string | null>('2026-11-12');
</script>

<template>
  <DatePicker v-model="moveIn" label="Move-in date" name="move_in" hint="MM/DD/YYYY" />
</template>
```

The field shows the date in the locale's pattern, such as `11/12/2026` in `en-US`, and `v-model` carries the ISO date, `2026-11-12`.

### Ranges

`mode="range"` renders a start and an end input, and the value is an array of two ISO dates. With `name`, both are submitted as `name[]`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@artisanpack-ui/vue/form';

const stay = ref<string[]>(['2026-11-12', '2026-11-18']);
</script>

<template>
  <DatePicker v-model="stay" mode="range" label="Stay" name="stay" />
</template>
```

### Date and time

`time` adds a list of times next to the calendar, `step` minutes apart (30 by default), and the value includes the time: `2026-11-12T11:00`. `timeZone` shows the IANA zone under the field. Time only works in single mode.

```vue
<template>
  <DatePicker v-model="viewingAt" time :step="15" time-zone="Europe/Madrid" label="Viewing" />
</template>
```

### Limits

`min` and `max` bound the dates that can be chosen, and `disabledDates` lists dates that can't be. Unavailable days are struck through as well as muted.

```vue
<template>
  <DatePicker
    v-model="moveIn"
    label="Move-in date"
    min="2026-11-01"
    max="2027-03-31"
    :disabled-dates="['2026-11-26', '2026-12-25']"
  />
</template>
```

### Locale and format

`locale` sets the month and weekday names and, unless you set them, the first day of the week and the text pattern. It defaults to the locale from your translations, else `en-US`. Override the pattern with `format` (using `yyyy`, `MM` and `dd`) and the first day with `weekStartsOn` (0 for Sunday to 6).

```vue
<template>
  <DatePicker v-model="moveIn" label="Date d’entrée" locale="fr-FR" />
  <DatePicker v-model="moveIn" label="Move-in date" format="yyyy-MM-dd" :week-starts-on="1" />
</template>
```

Show the expected pattern in the `hint`. The placeholder defaults to it, such as `MM/DD/YYYY`.

### Footer and rich text

`footer` adds a row under the calendar. The `label`, `hint` and `footer` slots replace the props of the same name when you need markup.

```vue
<template>
  <DatePicker v-model="moveIn" label="Move-in date">
    <template #footer>Move-ins happen on weekdays only.</template>
  </DatePicker>
</template>
```

### Popover and states

The calendar is teleported to the end of `<body>`; set `:portal="false"` to render it in place. Bind `v-model:open` to control it. `readonly` keeps the field focusable but the calendar doesn't open. `hint`, `error`, `invalid`, `disabled` and `required` work as on [Input](input.md).

## Props

| Prop            | Type                                      | Default                                                            | Description                                                                                                            |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `modelValue`    | `string \| string[] \| null`              | —                                                                  | The ISO value: `2026-11-12`, `2026-11-12T11:00` with `time`, or two dates with `mode="range"`. Bind it with `v-model`. |
| `mode`          | `'single' \| 'range'`                     | `'single'`                                                         | One date, or a range of two. Emitted as `data-mode`.                                                                   |
| `time`          | `boolean`                                 | `false`                                                            | Date and time: adds the time list. Single mode only. Emitted as `data-time`.                                           |
| `step`          | `number`                                  | `30`                                                               | Minutes between the times in the time list.                                                                            |
| `timeZone`      | `string`                                  | —                                                                  | The IANA time zone, shown under the field in time mode.                                                                |
| `locale`        | `string`                                  | the translations' locale, else `'en-US'`                           | BCP 47 locale for month and weekday names (`Intl`).                                                                    |
| `min`           | `string`                                  | —                                                                  | The earliest date that can be chosen, ISO.                                                                             |
| `max`           | `string`                                  | —                                                                  | The latest date that can be chosen, ISO.                                                                               |
| `disabledDates` | `string[]`                                | —                                                                  | Dates that can't be chosen, ISO.                                                                                       |
| `weekStartsOn`  | `number`                                  | follows the locale                                                 | First day of the week, 0 (Sunday) to 6.                                                                                |
| `format`        | `string`                                  | follows the locale                                                 | The text pattern, with `yyyy`, `MM` and `dd`.                                                                          |
| `size`          | `'sm' \| 'md' \| 'lg'`                    | `'md'`                                                             | Control height. Emitted as `data-size`.                                                                                |
| `label`         | `string`                                  | —                                                                  | The visible label. The `label` slot overrides it.                                                                      |
| `hint`          | `string`                                  | —                                                                  | Help text under the field. Show the expected format here. The `hint` slot overrides it.                                |
| `error`         | `string`                                  | —                                                                  | Validation message. Marks the field invalid.                                                                           |
| `invalid`       | `boolean`                                 | `false`                                                            | Marks the field invalid without a message.                                                                             |
| `disabled`      | `boolean`                                 | `false`                                                            | Disables the field and the calendar.                                                                                   |
| `readonly`      | `boolean`                                 | `false`                                                            | Read-only: focusable, the calendar doesn't open.                                                                       |
| `required`      | `boolean`                                 | `false`                                                            | Marks the field required and shows the required mark.                                                                  |
| `placeholder`   | `string`                                  | the pattern, such as `MM/DD/YYYY`                                  | Placeholder text.                                                                                                      |
| `name`          | `string`                                  | —                                                                  | Submits the ISO value in a hidden input (`name[]` twice in range mode).                                                |
| `open`          | `boolean`                                 | `false`                                                            | Whether the calendar is open. Bind it with `v-model:open`.                                                             |
| `portal`        | `boolean`                                 | `true`                                                             | Teleports the popover to the end of the body. Off renders it in place.                                                 |
| `footer`        | `string`                                  | —                                                                  | A row under the calendar. The `footer` slot overrides it.                                                              |
| `triggerLabel`  | `string`                                  | `'Choose date'`, translated (`'Choose date and time'` with `time`) | The calendar button's accessible name.                                                                                 |
| `previousLabel` | `string`                                  | `'Previous month'`, translated                                     | The previous-month button's name.                                                                                      |
| `nextLabel`     | `string`                                  | `'Next month'`, translated                                         | The next-month button's name.                                                                                          |
| `calendarLabel` | `string`                                  | `'Calendar'`, translated                                           | The popover's name.                                                                                                    |
| `timeLabel`     | `string`                                  | `'Time'`, translated                                               | The time list's name and heading.                                                                                      |
| `endLabel`      | `string`                                  | `'End date'`, translated                                           | The end input's name in range mode.                                                                                    |
| `timeZoneLabel` | `string`                                  | `'Time zone: {zone}'`, translated                                  | The time-zone line; `{zone}` stands for the zone.                                                                      |
| `classes`       | `Partial<Record<DatePickerPart, string>>` | —                                                                  | Extra classes per [part](#parts). Use `class` for the root.                                                            |

`class` goes to the root `<div>`. Every other attribute, including `id`, `aria-*` and listeners, goes to the first text input. An `id` you pass becomes that input's id (the end input gets `<id>-1`), and the other ids are built from it. Your own `aria-describedby` is kept and added after the hint, time-zone and error ids. Use the `name` prop, not a `name` attribute, so the ISO value is submitted rather than the typed text.

## v-model

| Binding        | Type              | Carries                                                                                                                               |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`      | `DatePickerValue` | The ISO value after a day, a time or typed text changes it: a string or `null` in single mode, an array of two strings in range mode. |
| `v-model:open` | `boolean`         | Whether the calendar is open.                                                                                                         |

Passed, each prop is controlled: the picker reports a change and waits for the value you pass back. Not passed, the picker keeps its own value and open state.

## Slots

| Slot     | Description                                    |
| -------- | ---------------------------------------------- |
| `label`  | Rich label content. Replaces `label`.          |
| `hint`   | Rich help text. Replaces `hint`.               |
| `footer` | The row under the calendar. Replaces `footer`. |

## Events

| Event                | Payload                      | Description                                    |
| -------------------- | ---------------------------- | ---------------------------------------------- |
| `@update:modelValue` | `string \| string[] \| null` | A day, a time or typed text changed the value. |
| `@update:open`       | `boolean`                    | The calendar opened or closed itself.          |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS. In the markup, part names of more than one word are kebab-case, such as `data-part="table-cell-trigger"`.

| Part               | Element  | Description                                                                                                                         |
| ------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `root`             | `div`    | The field, `.apui-date-picker`. Carries `data-size`, `data-mode`, `data-time`, `data-invalid`, `data-disabled` and `data-readonly`. |
| `label`            | `label`  | The visible label.                                                                                                                  |
| `required`         | `span`   | The `*` mark inside the label. `aria-hidden`.                                                                                       |
| `box`              | `div`    | The bordered box around the calendar button and the inputs.                                                                         |
| `trigger`          | `button` | The calendar button.                                                                                                                |
| `control`          | `input`  | A text input: one, or the start and end in range mode.                                                                              |
| `hint`             | `p`      | The help text.                                                                                                                      |
| `timeZone`         | `p`      | The time-zone line. Only in time mode with `timeZone`.                                                                              |
| `error`            | `p`      | The error message, with an alert icon.                                                                                              |
| `positioner`       | `div`    | Positions the popover.                                                                                                              |
| `content`          | `div`    | The popover, named by `calendarLabel`.                                                                                              |
| `view`             | `div`    | The month view.                                                                                                                     |
| `viewControl`      | `div`    | The row with the previous and next buttons and the month name.                                                                      |
| `prevTrigger`      | `button` | The previous-month button.                                                                                                          |
| `rangeText`        | `span`   | The visible month and year.                                                                                                         |
| `nextTrigger`      | `button` | The next-month button.                                                                                                              |
| `table`            | `table`  | The month, `role="grid"`.                                                                                                           |
| `tableHead`        | `thead`  | The weekday row's group.                                                                                                            |
| `tableRow`         | `tr`     | A row of the month.                                                                                                                 |
| `tableHeader`      | `th`     | A weekday name, with the long name in `abbr`.                                                                                       |
| `tableBody`        | `tbody`  | The weeks.                                                                                                                          |
| `tableCell`        | `td`     | A day's cell, with `aria-selected` and `aria-disabled`.                                                                             |
| `tableCellTrigger` | `div`    | The day itself, named by its full localized date.                                                                                   |
| `time`             | `div`    | The time column. Only in time mode.                                                                                                 |
| `timeLabel`        | `span`   | The time column's heading. `aria-hidden`; the list carries the name.                                                                |
| `timeList`         | `div`    | The time listbox.                                                                                                                   |
| `timeOption`       | `div`    | One time.                                                                                                                           |
| `footer`           | `div`    | The row under the calendar.                                                                                                         |

## Types

```ts
import type {
  DatePickerEmits,
  DatePickerMode,
  DatePickerPart,
  DatePickerProps,
  DatePickerSize,
  DatePickerValue,
} from '@artisanpack-ui/vue/form';
```

| Type              | Description                                  |
| ----------------- | -------------------------------------------- |
| `DatePickerProps` | The component's props.                       |
| `DatePickerEmits` | The component's events.                      |
| `DatePickerMode`  | `'single' \| 'range'`                        |
| `DatePickerValue` | `string \| string[] \| null`                 |
| `DatePickerSize`  | `'sm' \| 'md' \| 'lg'`                       |
| `DatePickerPart`  | The part names in the [Parts](#parts) table. |

## Accessibility

| Keys                       | Action                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `Tab`                      | Moves between the calendar button and the input. Typing a date in the pattern always works. |
| `Enter` / `Space`          | On the calendar button, opens the calendar; on a day, chooses it.                           |
| `ArrowLeft` / `ArrowRight` | Previous and next day. They follow the text direction, so they swap under RTL.              |
| `ArrowUp` / `ArrowDown`    | Same day of the previous and next week; in the time list, the previous and next time.       |
| `PageUp` / `PageDown`      | Previous and next month (with `Shift`, a year).                                             |
| `Home` / `End`             | Start and end of the week; in the time list, the first and last time.                       |
| `Escape`                   | Closes the calendar and returns focus to the field.                                         |

- Typing a date always works; the calendar never replaces the input. Always pass a visible `label`.
- The month is a `role="grid"`; each day is named by its full localized date, and its cell carries `aria-selected`, `aria-disabled` and `aria-current="date"` for today.
- The calendar button is labelled and reports `aria-expanded` and `aria-controls`.
- In range mode the end input is named by `endLabel`.
- The time list is a listbox with roving focus; the time zone is always visible when set.
- Unavailable days are struck through as well as muted, never color alone; the selected day is filled, and today has a ring.
- Hint, time zone and error are linked to the input with `aria-describedby`; invalid sets `aria-invalid`.
- Every built-in name is a prop, so you can translate it.

## Related

- [DatePicker in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/date-picker): anatomy, tokens and live examples.
- [Calendar](../data/calendar.md) for an always-visible month view.
- [Input](input.md) for the shared field anatomy.
