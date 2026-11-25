---
title: Pagination
menu_order: 50
meta_description: The Vue Pagination component. Page buttons with previous and next, v-model:page, sibling counts and a summary, with every prop, event and part.
---

# Pagination

Moves between the pages of a long list. It renders a `<nav>` landmark with an optional summary, a previous button, the page buttons with ellipses for gaps, and a next button. Use it under a table or a list of results.

```ts
import { Pagination } from '@artisanpack-ui/vue/navigation';
// or
import { Pagination } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Pagination } from '@artisanpack-ui/vue/navigation';

const page = ref(1);
</script>

<template>
  <Pagination v-model:page="page" :total="318" :per-page="10" />
</template>
```

Pagination is controlled: it shows the `page` you pass and emits the chosen page. Bind `v-model:page`, or update `page` from `@page-change`, or the buttons appear to do nothing.

### Page count

Pass `total` and `perPage` (default `10`), and Pagination works out the page count. Or pass `pageCount` directly when you don't know the total. `page` is clamped to the page count, and there's always at least one page.

```vue
<template>
  <Pagination v-model:page="page" :page-count="12" />
</template>
```

### Siblings

The first and last pages always show, with `siblings` pages on each side of the current one (default `1`) and an ellipsis for each gap. The number of buttons stays the same as the page moves. A short list shows every page.

```vue
<template>
  <Pagination v-model:page="page" :page-count="40" :siblings="2" />
</template>
```

### Summary

`summary` shows a line before the buttons: "Showing 21–30 of 318" with a `total`, or "Page 3 of 12" without one. `summaryLabel` replaces it, with `{from}`, `{to}`, `{total}`, `{page}` and `{pageCount}` placeholders.

```vue
<template>
  <Pagination
    v-model:page="page"
    :total="318"
    :per-page="10"
    summary
    summary-label="Showing {from}–{to} of {total} properties"
  />
</template>
```

### Loading pages from the server

Fetch the page from `@page-change`. With Laravel and Inertia, `InertiaPagination` from `@artisanpack-ui/vue-laravel` takes a paginator and visits the chosen page for you; see [Laravel and Inertia](../../laravel-inertia.md).

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Pagination } from '@artisanpack-ui/vue/navigation';

const page = ref(1);
const total = ref(0);

async function load(next: number): Promise<void> {
  const response = await fetch(`/api/listings?page=${next}`);
  const body = await response.json();
  total.value = body.total;
  page.value = next;
}
</script>

<template>
  <Pagination :page="page" :total="total" :per-page="25" @page-change="load" />
</template>
```

## Props

| Prop            | Type                                      | Default                                                                                           | Description                                                                     |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `page`          | `number`                                  | `1`                                                                                               | The current page, from 1 (`v-model:page`). Clamped to the page count.           |
| `pageCount`     | `number`                                  | —                                                                                                 | How many pages there are. Without it, `total / perPage`, rounded up.            |
| `total`         | `number`                                  | —                                                                                                 | How many items the whole list has.                                              |
| `perPage`       | `number`                                  | `10`                                                                                              | How many items a page holds.                                                    |
| `siblings`      | `number`                                  | `1`                                                                                               | Pages shown on each side of the current one.                                    |
| `summary`       | `boolean`                                 | `false`                                                                                           | Shows the summary before the pages.                                             |
| `label`         | `string`                                  | `'Pagination'`, translated                                                                        | The nav landmark's accessible name.                                             |
| `previousLabel` | `string`                                  | `'Previous page'`, translated                                                                     | The previous button's accessible name.                                          |
| `nextLabel`     | `string`                                  | `'Next page'`, translated                                                                         | The next button's accessible name.                                              |
| `pageLabel`     | `string`                                  | `'Page {page}'`, translated                                                                       | Each page button's accessible name, with `{page}`.                              |
| `summaryLabel`  | `string`                                  | `'Showing {from}–{to} of {total}'`, or `'Page {page} of {pageCount}'` without a total, translated | The summary text, with `{from}`, `{to}`, `{total}`, `{page}` and `{pageCount}`. |
| `classes`       | `Partial<Record<PaginationPart, string>>` | —                                                                                                 | Extra classes per [part](#parts), such as `{ page: 'tabular-nums' }`.           |

`class`, `style` and every other attribute go to the root `<nav>`.

## v-model

| Binding        | Type     | Description                                                                |
| -------------- | -------- | -------------------------------------------------------------------------- |
| `v-model:page` | `number` | The current page. Updated when a page, previous or next button is clicked. |

## Slots

Pagination has no slots.

## Events

| Event          | Payload        | Description                                                                                |
| -------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `@page-change` | `page: number` | A page was chosen. Not emitted for the current page, or for previous and next at the ends. |
| `@update:page` | `page: number` | The same, for `v-model:page`.                                                              |

## Parts

Pass extra classes to a part with `classes`. Every part except `root` carries a `data-part` attribute you can also target in CSS.

| Part       | Element  | Description                                                              |
| ---------- | -------- | ------------------------------------------------------------------------ |
| `root`     | `nav`    | The landmark, `.apui-pagination`.                                        |
| `summary`  | `span`   | The summary. Only rendered with `summary`.                               |
| `previous` | `button` | The previous button. `aria-disabled` on the first page; mirrored in RTL. |
| `page`     | `button` | One page button. The current one has `aria-current="page"`.              |
| `ellipsis` | `span`   | A gap between pages. `aria-hidden`.                                      |
| `next`     | `button` | The next button. `aria-disabled` on the last page; mirrored in RTL.      |

## paginationRange

The function Pagination uses to pick its buttons, exported for custom pagers:

```ts
import { paginationRange } from '@artisanpack-ui/vue/navigation';

paginationRange(5, 20, 1);
// [1, null, 4, 5, 6, null, 20]
```

| Parameter  | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| `page`     | `number` | The current page, from 1.              |
| `count`    | `number` | How many pages there are.              |
| `siblings` | `number` | Pages on each side of the current one. |

It returns `(number | null)[]`: the first and last pages, `siblings` pages around the current one, and `null` for each gap. The length stays the same as the page moves. When `count` is at most `2 * siblings + 5`, it returns every page.

## Types

```ts
import type { PaginationPart, PaginationProps } from '@artisanpack-ui/vue/navigation';
```

| Type              | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| `PaginationProps` | The component's props.                                                |
| `PaginationPart`  | `'root' \| 'summary' \| 'previous' \| 'page' \| 'ellipsis' \| 'next'` |

## Accessibility

| Keys              | Action                                      |
| ----------------- | ------------------------------------------- |
| `Tab`             | Moves through previous, the pages and next. |
| `Enter` / `Space` | Goes to the focused page.                   |

- A `<nav>` landmark named by `label` ("Pagination").
- The current page has `aria-current="page"`.
- Previous and next are icon-only buttons with translatable names. On the first or last page they stay focusable with `aria-disabled="true"` and do nothing.
- Each page button is named "Page n" (`pageLabel`). Ellipses are `aria-hidden`.
- The previous and next chevrons mirror in right-to-left layouts, and the order follows the text direction.
- Buttons are at least 28px square, above the 24px minimum target size, and show a visible focus ring.
- When the page changes, move focus or announce the new results yourself, such as by focusing the list's heading.

## Related

- [Pagination in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/pagination): anatomy, tokens and live examples.
- [Table](../data/table.md) for paged data.
- [Laravel and Inertia](../../laravel-inertia.md) for `InertiaPagination`.
