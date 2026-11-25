---
title: Data
menu_order: 50
meta_description: The Vue data components. Tables with sorting, selection and pagination, bar, line, area and donut charts, and event calendars.
---

# Data

Components for data sets: rows of records, series of values and events over time. Import them from `@artisanpack-ui/vue/data` or from the package root.

```ts
import { Calendar, Chart, Table } from '@artisanpack-ui/vue/data';
```

- [Calendar](data/calendar.md): events on a month grid, a week, a day or an agenda list.
- [Chart](data/chart.md): bar, line, area and donut charts in a card, with tooltips and a data table.
- [Table](data/table.md): rows of data with sorting, selection, expansion, pagination and loading and empty states.

## Shared behavior

- The components display the data you pass. Table reports sorting, selection, expansion and page changes, and Calendar reports view and date changes. Sorting, filtering, paging and loading events stay in your code, so the same components work with data in memory or from a server.
- Calendar and Chart compute their layout with the shared behavior package, the same rules the Livewire and React components use, so the three stacks render the same days, labels and geometry. There's no chart or calendar library to install.
- Every component takes `classes`, an object of extra classes per part. Parts carry `data-scope` and `data-part` attributes you can target in CSS.
- Built-in text is translated, and every string has a prop (or, for Calendar, a `labels` key) to replace it.
- Table and Calendar still accept their 1.x and 2.x props. Each page lists them under "Deprecated props".

## Related

- [Display](display.md) for single values, progress and small trends.
- [Components](../components.md) for every category and the Vue-specific conventions.
