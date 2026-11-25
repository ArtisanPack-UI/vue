---
title: Calendar
menu_order: 10
meta_description: The Vue Calendar component. Events on a month grid, a week, a day or an agenda list, with navigation, categories, links and a details dialog.
---

# Calendar

Shows events on a month grid, a week, a day or an agenda list. It renders a `<div class="apui-calendar">` with a toolbar (Today, previous and next buttons, the title, view tabs and an optional New event button), the view's body, and a legend of event categories. Clicking an event opens a [Dialog](../layout/dialog.md) with its details, or follows its link. The days, titles and labels come from the shared behavior package, so the calendar matches the Livewire and React ones, with names from `Intl` in the locale.

For picking a date in a form, use [DatePicker](../form/date-picker.md).

```ts
import { Calendar } from '@artisanpack-ui/vue/data';
// or
import { Calendar } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Calendar, type CalendarEvent } from '@artisanpack-ui/vue/data';

const events: CalendarEvent[] = [
  {
    id: 1,
    start: '2026-11-02T09:00',
    end: '2026-11-02T10:00',
    title: 'Team meeting',
    color: 'error',
    category: 'Marketing',
    description: 'Weekly sync with the marketing team.',
  },
  {
    id: 2,
    start: '2026-11-03T10:00',
    end: '2026-11-03T12:00',
    title: 'Marketing course',
    color: 'info',
    category: 'Learning',
  },
  { id: 3, start: '2026-11-05', title: 'Anna’s birthday', color: 'accent', category: 'People' },
  {
    id: 4,
    start: '2026-11-16',
    end: '2026-11-18',
    title: 'Trade show',
    color: 'warning',
    category: 'Travel',
  },
];
</script>

<template>
  <Calendar :events="events" date="2026-11-01" />
</template>
```

Without `date`, the calendar opens on today. Without `view`, it opens on the month.

### Events

Each event needs a `title` and a `start`. Dates are ISO strings (or `Date` objects).

- `start: '2026-11-05'` is an all-day event. `start: '2026-11-02T09:00'` is a timed one.
- `end` is inclusive for dates, so `start: '2026-11-16', end: '2026-11-18'` covers three days. A timed event that ends at 00:00 ends the day before.
- A time with `Z` or an offset, such as `2026-11-02T14:00Z`, is converted to `timeZone`. A time without one is used as written.
- `allDay: true` makes an event all day even when `start` has a time.
- `color` tints the event. An unknown color falls back to `primary`.
- `category` shows in the legend, the agenda and the event's accessible name. Events with the same category should share a color.
- `description` shows in the details dialog.
- `href` makes the event a link instead of a button. Unsafe URL schemes are dropped. A link event doesn't open the details dialog or emit `event-click`.

| Key             | Type                                                                                               | Description                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `id`            | `string \| number`                                                                                 | A stable id. Defaults to the list index.                                                             |
| `start`         | `string \| Date`                                                                                   | Required (or the 2.x `date`). `YYYY-MM-DD` for an all-day event, `YYYY-MM-DDTHH:mm` for a timed one. |
| `end`           | `string \| Date`                                                                                   | The end. Inclusive for dates.                                                                        |
| `title`         | `string`                                                                                           | Required. What the event is.                                                                         |
| `color`         | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'neutral'` | The tint. Defaults to `primary`.                                                                     |
| `allDay`        | `boolean`                                                                                          | All day even when `start` has a time.                                                                |
| `category`      | `string`                                                                                           | Shown in the legend, the agenda and the accessible name.                                             |
| `description`   | `string`                                                                                           | Shown in the details dialog.                                                                         |
| `href`          | `string`                                                                                           | Makes the event a link.                                                                              |
| `date`          | `string \| Date`                                                                                   | Deprecated 2.x key for `start`.                                                                      |
| `endDate`       | `string \| Date`                                                                                   | Deprecated 2.x key for `end`.                                                                        |
| `[key: string]` | `unknown`                                                                                          | Anything else, kept on the event passed to `event-click` and the `details` slot.                     |

### Views

The view tabs switch between `month`, `week`, `day` and `agenda`. The month grid shows up to `maxEvents` events per day, then a "+N more" button that opens that day. The week and day views show each day's events with their time range. The agenda is a list of the shown month's days that have events, each under its date as a heading. With no events, it shows "No events".

Previous and next move by the view's period: a month, a week or a day. Today jumps back to today.

### Controlling the view and date

`v-model:view` and `v-model:date` bind the view and the shown date (`YYYY-MM-DD`). Unbound, the calendar tracks them itself and still emits the updates. Use them to load the events for the shown period.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { Calendar, type CalendarEvent, type CalendarView } from '@artisanpack-ui/vue/data';

const view = ref<CalendarView>('week');
const date = ref('2026-11-02');
const events = ref<CalendarEvent[]>([]);

watch(
  [view, date],
  async () => {
    const response = await fetch(`/api/events?view=${view.value}&date=${date.value}`);
    events.value = await response.json();
  },
  { immediate: true },
);
</script>

<template>
  <Calendar v-model:view="view" v-model:date="date" :events="events" />
</template>
```

### Event details

By default, clicking an event emits `event-click` and opens a Dialog titled with the event's title, with its full date and time, its category as a Badge and its description. The `details` slot replaces the dialog's body. Set `details` to `false` to skip the dialog and handle `event-click` yourself.

```vue
<template>
  <Calendar :events="events">
    <template #details="{ event }">
      <p>{{ event.description }}</p>
      <a :href="`/events/${event.id}/edit`">Edit event</a>
    </template>
  </Calendar>

  <Calendar :events="events" :details="false" @event-click="(event) => openDrawer(event)" />
</template>
```

### Creating events

`creatable` adds a New event button to the toolbar. It emits `create` with the shown date. Open your own form from it.

```vue
<template>
  <Calendar :events="events" creatable @create="(date) => openNewEventForm(date)" />
</template>
```

### Locale, time zone and week start

`locale` sets the month and weekday names and the first day of the week. It defaults to the translations' locale, else `en-US`. `timeZone` sets which date is today and converts times that carry `Z` or an offset. `weekStartsOn` overrides the first day of the week, from 0 (Sunday) to 6. `today` sets the date marked as today, which helps in tests and demos.

```vue
<template>
  <Calendar :events="events" locale="fr-FR" time-zone="Europe/Paris" :week-starts-on="1" />
</template>
```

### Labels

`labels` replaces built-in text. Keys you leave out keep their translated defaults.

```vue
<template>
  <Calendar :events="events" :labels="{ newEvent: 'Book a room', empty: 'Nothing booked' }" />
</template>
```

| Key        | Default                                | Description                                                                   |
| ---------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| `today`    | `'Today'`                              | The Today button.                                                             |
| `previous` | `'Previous'`                           | The previous button's accessible name.                                        |
| `next`     | `'Next'`                               | The next button's accessible name.                                            |
| `views`    | `'Calendar view'`                      | The view tabs' accessible name.                                               |
| `month`    | `'Month'`                              | The month tab.                                                                |
| `week`     | `'Week'`                               | The week tab.                                                                 |
| `day`      | `'Day'`                                | The day tab.                                                                  |
| `agenda`   | `'Agenda'`                             | The agenda tab.                                                               |
| `allDay`   | `'All day'`                            | An all-day event's time.                                                      |
| `more`     | `'+{count} more'`                      | The "+N more" button's text. `{count}` is filled in.                          |
| `showMore` | `'Show {count} more events on {date}'` | The "+N more" button's accessible name. `{count}` and `{date}` are filled in. |
| `newEvent` | `'New event'`                          | The New event button.                                                         |
| `empty`    | `'No events'`                          | The agenda's text when the month has no events.                               |
| `legend`   | `'Categories'`                         | The legend's accessible name.                                                 |

## Props

| Prop           | Type                                     | Default                                  | Description                                                                              |
| -------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `view`         | `'month' \| 'week' \| 'day' \| 'agenda'` | `'month'`                                | The view (`v-model:view`). Uncontrolled when unset. Emitted as `data-view`.              |
| `date`         | `string`                                 | today                                    | The date the view shows, `YYYY-MM-DD` (`v-model:date`). Uncontrolled when unset.         |
| `today`        | `string`                                 | the current date in `timeZone`           | The date marked as today, `YYYY-MM-DD`.                                                  |
| `events`       | `CalendarEvent[]`                        | `[]`                                     | The events. See [Events](#events).                                                       |
| `weekStartsOn` | `number`                                 | the locale's first day                   | The first day of the week, 0 (Sunday) to 6.                                              |
| `locale`       | `string`                                 | the translations' locale, else `'en-US'` | BCP 47 locale for names and the first day of the week.                                   |
| `timeZone`     | `string`                                 | `'UTC'`                                  | IANA time zone for today and for times with `Z` or an offset.                            |
| `maxEvents`    | `number`                                 | `2`                                      | Events a month cell shows before "+N more".                                              |
| `creatable`    | `boolean`                                | `false`                                  | Shows a New event button that emits `create`.                                            |
| `details`      | `boolean`                                | `true`                                   | Clicking an event opens a Dialog with its details.                                       |
| `labels`       | `Partial<CalendarLabels>`                | —                                        | Built-in text. Keys you leave out keep their translated defaults. See [Labels](#labels). |
| `classes`      | `Partial<Record<CalendarPart, string>>`  | —                                        | Extra classes per [part](#parts).                                                        |

Calendar also takes the deprecated props listed in [Deprecated props](#deprecated-props).

`class`, `style` and every other attribute go to the root `<div>`. A passed `id` becomes the root's id and the prefix of its parts' ids.

## v-model

| Binding        | Type           | Description                                                                     |
| -------------- | -------------- | ------------------------------------------------------------------------------- |
| `v-model:view` | `CalendarView` | The view: `'month'`, `'week'`, `'day'` or `'agenda'`.                           |
| `v-model:date` | `string`       | The shown date, `YYYY-MM-DD`. Changes with Today, previous, next and "+N more". |

Both are uncontrolled when unbound: the calendar keeps its own view and date and still emits the updates. When bound, it follows the value you pass. The deprecated `v-model` (`modelValue`) still binds the date. See [Deprecated props](#deprecated-props).

## Slots

| Slot      | Slot props                 | Description                                                                                                                           |
| --------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `details` | `{ event: CalendarEvent }` | Replaces the details Dialog's body. The dialog keeps the event's title and full date and time. `event` is the event as you passed it. |

## Events

| Event                | Payload                                    | Description                                                                             |
| -------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `@update:view`       | `view: CalendarView`                       | The view changed, for `v-model:view`.                                                   |
| `@view-change`       | `view: CalendarView`                       | The same.                                                                               |
| `@update:date`       | `date: string`                             | The shown date changed, for `v-model:date`.                                             |
| `@date-change`       | `date: string`                             | The same.                                                                               |
| `@event-click`       | `event: CalendarEvent`                     | An event button was clicked. Not emitted for events with `href`.                        |
| `@create`            | `date: string`                             | The New event button was clicked. Carries the shown date.                               |
| `@update:modelValue` | `date: string`                             | Deprecated. The 2.x `v-model`. Emitted with every date change. Use `update:date`.       |
| `@month-change`      | `payload: { month: number; year: number }` | Deprecated. The shown month (1–12) and year, when the month changes. Use `date-change`. |

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS. Multi-word parts are kebab-case there, such as `todayTrigger` as `data-part="today-trigger"`.

| Part              | Element         | Description                                                                                                  |
| ----------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| `root`            | `div`           | The calendar, `.apui-calendar`.                                                                              |
| `toolbar`         | `div`           | The buttons, title and view tabs.                                                                            |
| `todayTrigger`    | `button`        | The Today button, a `Button`.                                                                                |
| `previousTrigger` | `button`        | The previous button, a `Button`.                                                                             |
| `nextTrigger`     | `button`        | The next button, a `Button`.                                                                                 |
| `title`           | `h2`            | The shown period, such as "November 2026". A polite live region.                                             |
| `viewTabs`        | `div`           | The segmented view tabs, `.apui-tabs`.                                                                       |
| `createTrigger`   | `button`        | The New event button, a `Button`. Only rendered with `creatable`.                                            |
| `body`            | `div`           | The view's body, the tabs' `role="tabpanel"`.                                                                |
| `grid`            | `div` or `ul`   | The `role="grid"` in the month, week and day views, or the agenda list.                                      |
| `row`             | `div` or `li`   | A week row or the weekday header row, or an agenda day.                                                      |
| `weekday`         | `div` or `h3`   | A column header, or an agenda day's date heading.                                                            |
| `cell`            | `div` or `ul`   | A day's `role="gridcell"`, with `data-date`, `data-today` and `data-outside`. Or an agenda day's event list. |
| `date`            | `span`          | The day number in a month cell or a week or day column header.                                               |
| `event`           | `button` or `a` | An event, with `data-color` and `data-event-key`.                                                            |
| `eventTime`       | `span`          | The event's time or range.                                                                                   |
| `eventTitle`      | `span`          | The event's title.                                                                                           |
| `more`            | `button`        | The "+N more" button.                                                                                        |
| `legend`          | `ul`            | The categories. Only rendered when events have categories.                                                   |
| `legendItem`      | `li`            | One category, with `data-color`.                                                                             |

## Deprecated props

These 2.x props still work so older code keeps running. Move to the replacements.

| Prop         | Type     | Replacement                                                                                                                                               |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue` | `string` | `v-model:date`. Used to seed the date when `date` isn't set. `update:modelValue` still fires on every date change.                                        |
| `month`      | `number` | `date`. The shown month, 1–12 (clamped), with `year`. When a parent writes `month-change` back, the calendar keeps the day instead of jumping to the 1st. |
| `year`       | `number` | `date`. Used with `month`.                                                                                                                                |
| `weekStart`  | `0 \| 1` | `weekStartsOn`. Used only when `weekStartsOn` isn't set.                                                                                                  |
| `minDate`    | `string` | None. Navigation is no longer limited. Ignored.                                                                                                           |
| `maxDate`    | `string` | None. Navigation is no longer limited. Ignored.                                                                                                           |
| `className`  | `string` | `class`. Added to the root.                                                                                                                               |

The event keys `date` and `endDate` are deprecated too. Use `start` and `end`.

## Types

```ts
import type {
  CalendarColor,
  CalendarEvent,
  CalendarLabels,
  CalendarPart,
  CalendarProps,
  CalendarView,
} from '@artisanpack-ui/vue/data';
```

| Type             | Description                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `CalendarProps`  | The component's props.                                                                             |
| `CalendarEvent`  | An event. See [Events](#events).                                                                   |
| `CalendarView`   | `'month' \| 'week' \| 'day' \| 'agenda'`                                                           |
| `CalendarColor`  | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'neutral'` |
| `CalendarLabels` | The built-in text. See [Labels](#labels).                                                          |
| `CalendarPart`   | The 20 part names listed in [Parts](#parts).                                                       |

## Accessibility

| Keys                      | Action                                                                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`                     | Moves through Today, previous, next, the selected view tab, New event, the grid's day (one tab stop) and the events and "+N more" buttons inside the days. |
| `ArrowLeft`, `ArrowRight` | In the grid, the previous and next day. In the view tabs, the previous and next tab. They follow the text direction, so they swap under RTL.               |
| `ArrowUp`, `ArrowDown`    | In the grid, the same day of the previous and next week.                                                                                                   |
| `Home`, `End`             | In the grid, the start and end of the row. In the view tabs, the first and last tab.                                                                       |
| `Enter`, `Space`          | On a tab, chooses the view. On an event, opens it (its details or its link).                                                                               |

- The month, week and day views are a `role="grid"` named by the title, with rows, column headers and gridcells. Each day starts with its full localized date (visually hidden beside the number), and today carries `aria-current="date"`.
- Each event is a button or link named by its visible time and title, then (visually hidden) its category and full date and time. It's never identified by its tint alone, and the legend keeps the category key visible.
- The agenda view is the accessible list alternative: the month's days with events, each with its date as a heading.
- The view tabs are a tablist named by `labels.views`, controlling the body (`role="tabpanel"`). The title is a polite live region, so period changes are announced.
- "+N more" opens the day view and moves focus to that day.
- Event details open in the design-system Dialog, which traps focus and returns it to the event.
- Names come from `Intl` in the locale, and every built-in string is translatable through `labels`.

## Related

- [Calendar in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/calendar): anatomy, tokens and live examples.
- [DatePicker](../form/date-picker.md) for choosing a date in a form.
- [Dialog](../layout/dialog.md), used for event details.
- [Timeline](../display/timeline.md) for a list of past events.
