---
title: Table
menu_order: 30
meta_description: The Vue Table component. Rows of data in real table markup, with sorting, row selection, expansion, pagination, loading and empty states.
---

# Table

Rows of structured data in real table markup. It renders a `<div class="apui-table">` with a toolbar (title and toolbar content), a scroll container around a native `<table>`, and a footer (footer content and [Pagination](../navigation/pagination.md)). Columns can sort, rows can be selected and expanded, and every cell can be drawn with a slot. Loading shows skeleton rows, and no rows shows an empty state.

Table doesn't sort, filter or page your data itself: it reports what the user asked for, and you pass the rows to show. That works the same for data in memory and data from a server.

```ts
import { Table } from '@artisanpack-ui/vue/data';
// or
import { Table } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Table, type TableColumn } from '@artisanpack-ui/vue/data';

const headers: TableColumn[] = [
  { key: 'number', label: 'Order' },
  { key: 'customer.name', label: 'Customer', secondary: 'customer.email' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', numeric: true },
];

const orders = [
  {
    id: 1,
    number: '#1001',
    customer: { name: 'Olivia Rhye', email: 'olivia@example.com' },
    status: 'Paid',
    total: '$120.00',
  },
  {
    id: 2,
    number: '#1002',
    customer: { name: 'Phoenix Baker', email: 'phoenix@example.com' },
    status: 'Refunded',
    total: '$48.50',
  },
];
</script>

<template>
  <Table title="Recent orders" :headers="headers" :rows="orders" />
</template>
```

Each row needs a unique key, read from `id` by default. Use `keyBy` with a dot path for another field.

### Columns

A column's `key` is a dot path into the row, such as `'customer.name'`. Cells show the value as text: strings, numbers and booleans are printed, anything else (objects, `null`) shows nothing unless you draw the cell with a slot.

| Key         | Type                            | Description                                                                                                  |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`       | `string`                        | Required. Dot path to the row value, such as `'user.name'`. Also the column's id in slot names and the sort. |
| `label`     | `string`                        | The header label. Defaults to the key.                                                                       |
| `sortable`  | `boolean`                       | Makes the header a sort button with `aria-sort`.                                                             |
| `numeric`   | `boolean`                       | End-aligns the column with tabular figures.                                                                  |
| `hidden`    | `boolean`                       | Leaves the column out.                                                                                       |
| `secondary` | `string`                        | A second dot path, shown muted under the value as a two-line cell.                                           |
| `class`     | `string`                        | Extra classes for the header cell.                                                                           |
| `className` | `string`                        | Deprecated. Use `class`.                                                                                     |
| `align`     | `'left' \| 'center' \| 'right'` | Deprecated. `'right'` end-aligns like `numeric`. The others are ignored.                                     |
| `width`     | `string`                        | Deprecated and ignored. Size columns with `class`.                                                           |

### Sorting

A `sortable` column's header is a button. Clicking it emits the next sort: ascending first, then toggling between ascending and descending. Table keeps no sort of its own, so bind `v-model:sort-by` and sort the rows yourself. The sorted header carries `aria-sort` and an arrow icon.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Table, type TableColumn, type TableSort } from '@artisanpack-ui/vue/data';

const headers: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'stock', label: 'In stock', sortable: true, numeric: true },
];
const products = ref([
  { id: 1, name: 'Mug', stock: 42 },
  { id: 2, name: 'Tote', stock: 7 },
  { id: 3, name: 'Cap', stock: 19 },
]);
const sortBy = ref<TableSort>({ column: 'name', direction: 'asc' });

const sorted = computed(() => {
  const { column, direction } = sortBy.value;
  const factor = direction === 'asc' ? 1 : -1;
  return [...products.value].sort(
    (a, b) =>
      String(a[column as keyof typeof a]).localeCompare(
        String(b[column as keyof typeof b]),
        undefined,
        { numeric: true },
      ) * factor,
  );
});
</script>

<template>
  <Table v-model:sort-by="sortBy" title="Products" :headers="headers" :rows="sorted" />
</template>
```

For server-side sorting, listen to `@sort-change` and fetch the rows in the new order.

### Selection

`selectable` adds a checkbox to each row and a select-all box to the header. `v-model` holds the selected keys. Select all only affects the rows on screen: keys from other pages stay selected, and the box is mixed (indeterminate) while some rows are selected. Selected rows carry `aria-selected="true"`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';
import { Table, type TableKey } from '@artisanpack-ui/vue/data';

const selected = ref<TableKey[]>([]);
</script>

<template>
  <Table v-model="selected" selectable title="Orders" :headers="headers" :rows="orders">
    <template #toolbar>
      <Button v-if="selected.length" size="sm" color="error" variant="soft">
        Delete {{ selected.length }}
      </Button>
    </template>
  </Table>
</template>
```

Without `v-model`, the table tracks the selection itself and still emits `update:modelValue`. Keys are compared as strings, so `1` and `'1'` match.

### Row labels

Row checkboxes and expand buttons are named after the row: "Select {row}" and "Show details for {row}". By default `{row}` is the first column's text, or the row's key. `rowLabel` names rows yourself.

```vue
<template>
  <Table
    selectable
    expandable
    :headers="headers"
    :rows="orders"
    :row-label="(order) => `order ${order.number}`"
  />
</template>
```

### Expansion

`expandable` adds an expand button to each row. An expanded row is followed by a full-width row with the `expansion` slot. `v-model:expanded` holds the expanded keys. Without it, the table tracks them itself.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Table, type TableKey } from '@artisanpack-ui/vue/data';

const expanded = ref<TableKey[]>([]);
</script>

<template>
  <Table v-model:expanded="expanded" expandable :headers="headers" :rows="orders">
    <template #expansion="{ row }">
      <p>Shipped to {{ row.customer.name }} on {{ row.shippedAt }}.</p>
    </template>
  </Table>
</template>
```

### Custom cells and headers

`cell-<key>` draws one column's cells and `cell` draws every other cell. Both receive the row, the value at the column's key, the column and the row index. `header-<key>` draws a header's label: for a sortable column, it goes inside the sort button. Slot names use the column key as written, including dots, so use the `#[...]` syntax for dotted keys.

```vue
<script setup lang="ts">
import { Badge } from '@artisanpack-ui/vue/display';
import { Table } from '@artisanpack-ui/vue/data';
</script>

<template>
  <Table :headers="headers" :rows="orders">
    <template #cell-status="{ value }">
      <Badge :color="value === 'Paid' ? 'success' : 'neutral'">{{ value }}</Badge>
    </template>
    <template #[`cell-customer.name`]="{ row }">
      <a :href="`/customers/${row.customer.id}`">{{ row.customer.name }}</a>
    </template>
    <template #header-total="{ column }"> {{ column.label }} (USD) </template>
  </Table>
</template>
```

### Row actions

The `actions` slot adds a last, end-aligned column of controls per row. Its header is visually hidden and reads "Actions".

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';
import { Table } from '@artisanpack-ui/vue/data';
</script>

<template>
  <Table :headers="headers" :rows="orders">
    <template #actions="{ row }">
      <Button
        size="xs"
        variant="ghost"
        color="neutral"
        icon-only
        leading-icon="pencil"
        :aria-label="`Edit ${row.number}`"
      />
    </template>
  </Table>
</template>
```

### Clickable rows

With a `@row-click` listener, rows are clickable and carry `data-clickable`. Clicks on links, buttons, inputs, labels, selects and textareas inside the row are ignored, so they keep working. Rows aren't focusable, so also give each row a link or button that does the same thing for keyboard users.

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Table } from '@artisanpack-ui/vue/data';

const router = useRouter();
</script>

<template>
  <Table
    :headers="headers"
    :rows="orders"
    @row-click="(order) => router.push(`/orders/${order.id}`)"
  >
    <template #cell-number="{ row, value }">
      <a :href="`/orders/${row.id}`">{{ value }}</a>
    </template>
  </Table>
</template>
```

### Pagination

`pagination` takes [Pagination](../navigation/pagination.md)'s props and renders it at the end of the footer. Put the page-change listener in the same object as `onPageChange`. Pass the current page's rows as `rows`.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Table } from '@artisanpack-ui/vue/data';

const page = ref(1);
const perPage = 10;
const visible = computed(() =>
  allOrders.value.slice((page.value - 1) * perPage, page.value * perPage),
);

function goTo(next: number): void {
  page.value = next;
}
</script>

<template>
  <Table
    :headers="headers"
    :rows="visible"
    footer="Prices include tax."
    :pagination="{
      page,
      perPage,
      total: allOrders.length,
      summary: true,
      onPageChange: goTo,
    }"
  />
</template>
```

### Loading and empty states

`loading` shows three skeleton rows and sets `aria-busy="true"` on the root. With no rows, the table shows an empty state with `emptyText` ("No records found."). The `empty` slot replaces it, for example with an [EmptyState](../feedback/empty-state.md) that has an action.

```vue
<script setup lang="ts">
import { EmptyState } from '@artisanpack-ui/vue/feedback';
import { Table } from '@artisanpack-ui/vue/data';
</script>

<template>
  <Table :headers="headers" :rows="orders" :loading="fetching" empty-text="No orders yet.">
    <template #empty>
      <EmptyState title="No orders yet" description="Orders show here once customers check out." />
    </template>
  </Table>
</template>
```

### Appearance

`density` sets row height, padding and type size. Unset, it follows the page's density. `surface="glass"` puts the table on a translucent surface. `stickyHeader` (on by default) keeps the header row in view while the rows scroll. `hideHeaders` hides the header row visually but keeps it for screen readers.

```vue
<template>
  <Table
    density="compact"
    surface="glass"
    :sticky-header="false"
    :headers="headers"
    :rows="orders"
  />
</template>
```

## Props

| Prop             | Type                                                          | Default                                | Description                                                                                                  |
| ---------------- | ------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `headers`        | `TableColumn[]`                                               | —                                      | The columns, in order. Required in practice. The deprecated `columns` still works. See [Columns](#columns).  |
| `rows`           | `Record<string, unknown>[]`                                   | —                                      | Required. The rows to show.                                                                                  |
| `keyBy`          | `string`                                                      | `'id'`                                 | Dot path to each row's unique key.                                                                           |
| `rowLabel`       | `(row: Record<string, unknown>) => string`                    | the first column's text, or the key    | Names a row for the `{row}` in `selectRowLabel` and `expandLabel`. A blank result falls back to the default. |
| `title`          | `string`                                                      | —                                      | The toolbar title, an `h3`. It names the table unless `label` is set. The `title` slot overrides it.         |
| `label`          | `string`                                                      | —                                      | The table's accessible name, instead of the title. Translate it.                                             |
| `density`        | `'compact' \| 'default' \| 'comfortable'`                     | the page's density                     | Row height, padding and type size. Emitted as `data-density`.                                                |
| `surface`        | `'default' \| 'glass'`                                        | `'default'`                            | `glass` puts the table on a translucent surface. Emitted as `data-surface`.                                  |
| `stickyHeader`   | `boolean`                                                     | `true`                                 | Keeps the header row in view while the rows scroll. Emitted as `data-sticky-header`.                         |
| `hideHeaders`    | `boolean`                                                     | `false`                                | Hides the header row visually. Screen readers still announce it.                                             |
| `selectable`     | `boolean`                                                     | `false`                                | Adds row checkboxes and a select-all box.                                                                    |
| `modelValue`     | `TableKey[]`                                                  | —                                      | The selected keys (`v-model`). Uncontrolled when unset.                                                      |
| `expandable`     | `boolean`                                                     | `false`                                | Adds an expand button to each row.                                                                           |
| `expanded`       | `TableKey[]`                                                  | —                                      | The expanded keys (`v-model:expanded`). Uncontrolled when unset.                                             |
| `sortBy`         | `TableSort`                                                   | —                                      | The current sort (`v-model:sort-by`). The sorted header carries `aria-sort`.                                 |
| `loading`        | `boolean`                                                     | `false`                                | Shows skeleton rows and sets `aria-busy`.                                                                    |
| `emptyText`      | `string`                                                      | `'No records found.'`, translated      | The empty state's title.                                                                                     |
| `toolbar`        | `string`                                                      | —                                      | Toolbar content after the title. The `toolbar` slot overrides it.                                            |
| `footer`         | `string`                                                      | —                                      | Footer content at the start. The `footer` slot overrides it.                                                 |
| `pagination`     | `PaginationProps & { onPageChange?: (page: number) => void }` | —                                      | Pagination's props, rendered at the end of the footer. `onPageChange` listens for page changes.              |
| `selectAllLabel` | `string`                                                      | `'Select all'`, translated             | The select-all box's accessible name.                                                                        |
| `selectRowLabel` | `string`                                                      | `'Select {row}'`, translated           | Each row box's accessible name. `{row}` is replaced.                                                         |
| `sortLabel`      | `string`                                                      | `'Sort by {column}'`, translated       | Each sort button's accessible name. `{column}` is replaced with the column's label.                          |
| `expandLabel`    | `string`                                                      | `'Show details for {row}'`, translated | Each expand button's accessible name. `{row}` is replaced.                                                   |
| `actionsLabel`   | `string`                                                      | `'Actions'`, translated                | The actions column's visually hidden header.                                                                 |
| `classes`        | `Partial<Record<TablePart, string>>`                          | —                                      | Extra classes per [part](#parts), such as `{ cell: '…', headCell: '…' }`.                                    |

Table also takes the deprecated props listed in [Deprecated props](#deprecated-props).

`class`, `style` and every other attribute go to the root `<div>`.

## v-model

| Binding            | Type         | Description                                                                                                                                                        |
| ------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model`          | `TableKey[]` | The selected rows' keys. Needs `selectable`.                                                                                                                       |
| `v-model:sort-by`  | `TableSort`  | The current sort, `{ column, direction }`. Table keeps no sort of its own, so bind it (or pass `sortBy` and handle `sort-change`) for the header to show the sort. |
| `v-model:expanded` | `TableKey[]` | The expanded rows' keys. Needs `expandable`.                                                                                                                       |

Selection and expansion are uncontrolled when unbound: the table keeps its own list and still emits the updates. When bound, the table follows the value you pass.

## Slots

| Slot           | Slot props                      | Description                                                                                 |
| -------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `title`        | —                               | Rich title content in the toolbar's `h3`. Overrides `title`.                                |
| `toolbar`      | —                               | Toolbar content after the title, such as search or bulk actions. Overrides `toolbar`.       |
| `footer`       | —                               | Footer content at the start, before the pagination. Overrides `footer`.                     |
| `empty`        | —                               | Replaces the empty state when there are no rows.                                            |
| `cell`         | `{ row, value, column, index }` | Every cell's content. `cell-<key>` wins for its column.                                     |
| `cell-<key>`   | `{ row, value, column, index }` | One column's cells. `value` is the value at the column's key.                               |
| `header-<key>` | `{ column }`                    | One column's header label. Inside the sort button when the column is sortable.              |
| `actions`      | `{ row, index }`                | Row actions in a last, end-aligned column. The column only exists when this slot is passed. |
| `expansion`    | `{ row, index }`                | An expanded row's content, in a full-width row under it.                                    |

`row` is the row object, `value` is `unknown`, `column` is the `TableColumn` and `index` is the row's position in `rows`.

## Events

| Event                | Payload                                              | Description                                                                                  |
| -------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `@update:modelValue` | `keys: TableKey[]`                                   | The selection changed.                                                                       |
| `@sort-change`       | `sort: TableSort`                                    | A sort button was clicked. Carries the next sort.                                            |
| `@update:sortBy`     | `sort: TableSort`                                    | The same, for `v-model:sort-by`.                                                             |
| `@expanded-change`   | `keys: TableKey[]`                                   | A row was expanded or collapsed.                                                             |
| `@update:expanded`   | `keys: TableKey[]`                                   | The same, for `v-model:expanded`.                                                            |
| `@row-click`         | `row: Record<string, unknown>, index: number`        | A row was clicked outside its controls. Rows are only clickable when this listener is bound. |
| `@sort`              | `state: { key: string; direction: 'asc' \| 'desc' }` | Deprecated. The 1.x sort event. Use `sort-change`.                                           |

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS. Two parts use kebab-case there: `headCell` is `data-part="head-cell"` and `expandTrigger` is `data-part="expand-trigger"`.

| Part            | Element      | Description                                                                                                   |
| --------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| `root`          | `div`        | The frame, `.apui-table`.                                                                                     |
| `toolbar`       | `div`        | The title and toolbar content. Only rendered with either.                                                     |
| `title`         | `h3`         | The title. Its id names the table.                                                                            |
| `scroll`        | `div`        | The scroll container around the table.                                                                        |
| `table`         | `table`      | The native table.                                                                                             |
| `headCell`      | `th`         | A column header, with `aria-sort` when sortable and `data-numeric` when numeric. Also the actions header.     |
| `sort`          | `button`     | A sortable header's button.                                                                                   |
| `row`           | `tr`         | A body row, with `aria-selected` when selectable and `data-clickable` when clickable. Also the skeleton rows. |
| `cell`          | `td`         | A body cell, with `data-numeric` when numeric. The actions cell carries `data-actions`.                       |
| `select`        | `th` or `td` | The select-all or row checkbox cell.                                                                          |
| `expandTrigger` | `button`     | A row's expand button.                                                                                        |
| `expansion`     | `tr`         | The full-width row under an expanded row.                                                                     |
| `primary`       | `span`       | The value in a two-line cell.                                                                                 |
| `secondary`     | `span`       | The muted second line in a two-line cell.                                                                     |
| `footer`        | `div`        | The footer content and pagination. Only rendered with either.                                                 |

## Deprecated props

These 1.x props still work so older code keeps running. Move to the replacements.

| Prop           | Type                                          | Replacement                                                                                                                |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `columns`      | `TableColumn[]`                               | `headers`. Used only when `headers` isn't set.                                                                             |
| `className`    | `string`                                      | `class`. Added to the root.                                                                                                |
| `compact`      | `boolean`                                     | `density="compact"`. Used only when `density` isn't set.                                                                   |
| `emptyMessage` | `string`                                      | `emptyText`. While set, it wins over `emptyText`.                                                                          |
| `sort`         | `{ key: string; direction: 'asc' \| 'desc' }` | `sortBy`, with `column` in place of `key`. Used only when `sortBy` isn't set. The `@sort` event still fires on every sort. |
| `striped`      | `boolean`                                     | None. Stripes are no longer drawn. Use a [Badge](../display/badge.md) for status. Ignored.                                 |
| `hoverable`    | `boolean`                                     | None. Rows always tint on hover. Ignored.                                                                                  |
| `pinRows`      | `boolean`                                     | `stickyHeader`. Ignored.                                                                                                   |
| `pinCols`      | `boolean`                                     | None. Ignored.                                                                                                             |

The column keys `className`, `align` and `width` are deprecated too. See [Columns](#columns).

## Types

```ts
import type {
  SortState,
  TableColumn,
  TableKey,
  TablePart,
  TableProps,
  TableSort,
} from '@artisanpack-ui/vue/data';
```

| Type          | Description                                                                               |
| ------------- | ----------------------------------------------------------------------------------------- |
| `TableProps`  | The component's props.                                                                    |
| `TableColumn` | A column. See [Columns](#columns).                                                        |
| `TableKey`    | `string \| number`, a row key.                                                            |
| `TableSort`   | `{ column: string; direction: 'asc' \| 'desc' }`                                          |
| `TablePart`   | The 15 part names listed in [Parts](#parts).                                              |
| `SortState`   | Deprecated. The 1.x sort, `{ key: string; direction: 'asc' \| 'desc' }`. Use `TableSort`. |

## Accessibility

| Keys             | Action                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`            | Moves through the select-all box, the sort buttons, then each row's box, expand button, and the links and buttons in its cells. |
| `Enter`, `Space` | On a sort button, sorts by that column (ascending, then toggling). On an expand button, shows or hides the row's expansion.     |
| `Space`          | On a checkbox, selects or clears the row, or every row on screen for select all.                                                |

- Real table markup: a `<table>` with `<thead>` and `<tbody>`, and header cells with `scope="col"`.
- The table is named by its title (`aria-labelledby`) or `label` (`aria-label`). Give a table without a title a `label`.
- A sortable header carries `aria-sort` (`ascending`, `descending` or `none`) and holds a button named by `sortLabel`. The icon is decorative.
- Row boxes are named by `selectRowLabel` and selected rows carry `aria-selected="true"`. The select-all box is named by `selectAllLabel` and is mixed while some rows are selected. Use `rowLabel` when the first column doesn't name the row well.
- Expand buttons are named by `expandLabel` and carry `aria-expanded` and `aria-controls`. The chevron mirrors in RTL.
- While loading, the root carries `aria-busy="true"` and the skeleton rows are `aria-hidden`.
- Clickable rows aren't focusable. Put a link or button in the row for keyboard and screen reader users.
- Numbers end-align with tabular figures. Show status with a Badge, never a whole-row color.

## Related

- [Table in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/table): anatomy, tokens and live examples.
- [Pagination](../navigation/pagination.md), rendered in the footer.
- [Checkbox](../form/checkbox.md), used for row selection.
- [EmptyState](../feedback/empty-state.md) for a richer empty slot.
- [Badge](../display/badge.md) for status cells.
