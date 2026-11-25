---
title: InertiaPagination
menu_order: 110
meta_description: The Vue InertiaPagination component. Pagination driven by a Laravel paginator that visits pages with Inertia, keeping filters and query strings.
---

# InertiaPagination

[Pagination](../navigation/pagination.md) driven by a Laravel paginator. It reads the current and last page from the paginator your controller returns, and visits the chosen page with Inertia's `router.visit()`. Use it under a list or table that the server paginates.

```ts
import { InertiaPagination } from '@artisanpack-ui/vue-laravel';
```

## Usage

Pass the paginator from `->paginate()` as a page prop:

```php
return Inertia::render('Users/Index', [
    'users' => User::query()->paginate(15),
]);
```

```vue
<script setup lang="ts">
import type { LaravelPaginator } from '@artisanpack-ui/vue-laravel';
import { InertiaPagination } from '@artisanpack-ui/vue-laravel';

defineProps<{ users: LaravelPaginator<{ id: number; name: string }> }>();
</script>

<template>
  <ul>
    <li v-for="user in users.data" :key="user.id">{{ user.name }}</li>
  </ul>
  <InertiaPagination :paginator="users" preserve-scroll />
</template>
```

Choosing a page visits the paginator's `path` with `?page=N`.

### API resource collections

A paginated API resource collection, such as `UserResource::collection(User::paginate())`, puts the page details under `meta`. Pass it as is; InertiaPagination reads `meta` when the top level has no `current_page`:

```vue
<script setup lang="ts">
import type { LaravelResourcePaginator } from '@artisanpack-ui/vue-laravel';
import { InertiaPagination } from '@artisanpack-ui/vue-laravel';

defineProps<{ users: LaravelResourcePaginator<{ id: number; name: string }> }>();
</script>

<template>
  <InertiaPagination :paginator="users" />
</template>
```

### Keeping filters and search

By default the visit carries only the page parameter, so the current query string is dropped. Two props add to it:

- `preserveQuery` keeps every parameter in the current URL, such as `search`, `filter` or `sort`, and replaces only the page. Repeated keys, such as `tags[]=a&tags[]=b`, keep all their values. A current value replaces the paginator path's value for the same key.
- `queryParams` sets the given parameters on every visit. It wins over the current query and the path. It can't override the page parameter.

The page parameter is always set last, so the clicked page always wins.

```vue
<script setup lang="ts">
import type { LaravelPaginator } from '@artisanpack-ui/vue-laravel';
import { InertiaPagination } from '@artisanpack-ui/vue-laravel';

defineProps<{
  users: LaravelPaginator<{ id: number; name: string }>;
  filters: { role: string };
}>();
</script>

<template>
  <!-- On /users?search=ada&sort=name, page 3 visits /users?search=ada&sort=name&role=admin&page=3 -->
  <InertiaPagination
    :paginator="users"
    preserve-query
    :query-params="{ role: filters.role }"
    preserve-state
    preserve-scroll
  />
</template>
```

### Partial reloads

`only` reloads just the named page props, so the rest of the page isn't sent again:

```vue
<template>
  <InertiaPagination :paginator="users" :only="['users']" preserve-state />
</template>
```

### Custom page parameter

When the controller paginates with a different parameter, such as `->paginate(15, pageName: 'usersPage')`, set `pageParam` to match:

```vue
<template>
  <InertiaPagination :paginator="users" page-param="usersPage" />
</template>
```

### Showing a summary

Pagination's own props pass through. Give it `total`, `perPage` and `summary` to show "Showing 16–30 of 120":

```vue
<template>
  <InertiaPagination :paginator="users" :total="users.total" :per-page="users.per_page" summary />
</template>
```

### Simple and cursor paginators

InertiaPagination needs `last_page`, so it works with `->paginate()` only. The results of `->simplePaginate()` and `->cursorPaginate()` have no page count; type them with `LaravelSimplePaginator` and `LaravelCursorPaginator` and render previous and next links yourself:

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { LaravelCursorPaginator } from '@artisanpack-ui/vue-laravel';

defineProps<{ posts: LaravelCursorPaginator<{ id: number; title: string }> }>();
</script>

<template>
  <nav aria-label="Pagination">
    <Link v-if="posts.prev_page_url" :href="posts.prev_page_url" preserve-scroll>Previous</Link>
    <Link v-if="posts.next_page_url" :href="posts.next_page_url" preserve-scroll>Next</Link>
  </nav>
</template>
```

## Props

| Prop             | Type                                     | Default  | Description                                                                                                                                      |
| ---------------- | ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `paginator`      | `LaravelPaginator`-like `\| { meta: … }` | —        | Required. A `->paginate()` result, or a resource collection with the details under `meta`. Only `current_page`, `last_page` and `path` are read. |
| `pageParam`      | `string`                                 | `'page'` | The query parameter that carries the page.                                                                                                       |
| `siblingCount`   | `number`                                 | —        | Pages shown on each side of the current one. Passed to Pagination's `siblings`, which defaults to `1`.                                           |
| `className`      | `string`                                 | —        | Extra classes for the Pagination root.                                                                                                           |
| `preserveScroll` | `boolean`                                | `false`  | Inertia's `preserveScroll` for the visit.                                                                                                        |
| `preserveState`  | `boolean`                                | `false`  | Inertia's `preserveState` for the visit.                                                                                                         |
| `queryParams`    | `Record<string, string \| number>`       | —        | Parameters set on every visit. Win over the current query and the path; never override `pageParam`.                                              |
| `preserveQuery`  | `boolean`                                | `false`  | Keeps the current URL's query parameters, replacing only the page.                                                                               |
| `only`           | `string[]`                               | —        | Inertia's `only`: reload just these page props.                                                                                                  |

The `paginator` type is `Pick<LaravelPaginator, 'current_page' | 'last_page' | 'path'> | { meta: Pick<…> }`, so any object with those three fields works.

### Forwarded props

`class`, `style` and every other attribute go to [Pagination](../navigation/pagination.md#props), including its own props: `total`, `perPage`, `summary`, `label`, `previousLabel`, `nextLabel`, `pageLabel`, `summaryLabel` and `classes`. InertiaPagination sets `page`, `pageCount` and `siblings` itself.

## Events

InertiaPagination has no events of its own: choosing a page visits it. Pagination's `@page-change` and `@update:page` listeners fall through, if you need to react before the visit finishes.

## Parts

InertiaPagination renders Pagination's parts unchanged. Pass extra classes with `classes`; see [Pagination parts](../navigation/pagination.md#parts).

## Types

```ts
import type {
  LaravelCursorPaginator,
  LaravelPaginator,
  LaravelResourcePaginator,
  LaravelSimplePaginator,
  PaginationLink,
} from '@artisanpack-ui/vue-laravel';
```

Each paginator type is generic over the row type `T`, which defaults to `Record<string, unknown>`.

| Type                          | Description                                                                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LaravelPaginator<T>`         | `LengthAwarePaginator::toArray()`, from `->paginate()`: `current_page`, `data: T[]`, `first_page_url`, `from`, `last_page`, `last_page_url`, `links: PaginationLink[]`, `next_page_url`, `path`, `per_page`, `prev_page_url`, `to`, `total`. |
| `LaravelSimplePaginator<T>`   | `Paginator::toArray()`, from `->simplePaginate()`: `current_page`, `current_page_url?` (Laravel 12.15+), `data`, `first_page_url`, `from`, `next_page_url`, `path`, `per_page`, `prev_page_url`, `to`. No `total` or `last_page`.            |
| `LaravelCursorPaginator<T>`   | `CursorPaginator::toArray()`, from `->cursorPaginate()`: `data`, `path`, `per_page`, `next_cursor`, `next_page_url`, `prev_cursor`, `prev_page_url`.                                                                                         |
| `LaravelResourcePaginator<T>` | A paginated API resource collection: `data: T[]`, `links: { first, last, prev, next }` and `meta`, the `LaravelPaginator` fields without `data` and the page URLs.                                                                           |
| `PaginationLink`              | One entry of a paginator's `links`: `url: string \| null`, `label: string`, `active: boolean`, and `page?: number \| null` (Laravel 12.23+; `null` for an ellipsis or a disabled previous or next link).                                     |

## Accessibility

| Keys            | Action                                      |
| --------------- | ------------------------------------------- |
| `Tab`           | Moves through previous, the pages and next. |
| `Enter`/`Space` | Goes to the focused page.                   |

- A `<nav>` landmark named by `label` (default "Pagination", translated).
- The current page has `aria-current="page"`. Previous and next set `aria-disabled` at the ends.
- Each page button's accessible name comes from `pageLabel` ("Page {page}"), so a screen reader hears more than a bare number.
- Without `preserveScroll`, Inertia scrolls to the top of the page after the visit, which suits a full page of new results. Set `preserveScroll` when the list sits low on a page and the reader should stay near it.

## Related

- [Pagination in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/pagination): anatomy, tokens and live examples.
- [Pagination](../navigation/pagination.md), the component this wraps.
- [Table](../data/table.md) for the list it usually sits under.
