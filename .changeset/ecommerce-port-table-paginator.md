---
'@artisanpack-ui/vue': minor
'@artisanpack-ui/vue-laravel': minor
---

Match the React packages for the ecommerce Vue ports.

- `@artisanpack-ui/vue-laravel` supports Inertia 3 (`@inertiajs/vue3` `^2.0.0 || ^3.0.0`).
- `Table` takes `rowLabel(row)` to name each row in the select and expand labels, such as "Select order #1048", and inserts label values literally.
- `PaginationLink` has the `page` number Laravel 12 and later send, and `LaravelSimplePaginator` has `current_page_url`.
- New `LaravelCursorPaginator` and `LaravelResourcePaginator` types for `cursorPaginate()` and paginated API resource collections.
- `InertiaPagination` accepts a paginated API resource collection (page details under `meta`), and takes `pageParam`, `only` for partial reloads, and `preserveQuery` to keep the current URL's search, filter and sort parameters when changing page.
