---
title: Navigation
menu_order: 30
meta_description: Vue navigation components from @artisanpack-ui/vue/navigation. Breadcrumbs, links, menus, navbars, pagination, the Spotlight palette and steps.
---

# Navigation

Navigation components move people between pages and show where they are. Import them from `@artisanpack-ui/vue/navigation` or from the package root.

```ts
import { Breadcrumbs, Menu, Pagination } from '@artisanpack-ui/vue/navigation';
// or
import { Breadcrumbs, Menu, Pagination } from '@artisanpack-ui/vue';
```

- [Breadcrumbs](navigation/breadcrumbs.md): shows where the current page sits in the hierarchy.
- [Link](navigation/link.md): an inline or standalone link, or a button styled as one.
- [Menu](navigation/menu.md): a navigation list with sections and collapsible sub-menus.
- [Navbar](navigation/navbar.md): the top bar with a brand, primary links, a search and actions.
- [Pagination](navigation/pagination.md): moves between the pages of a long list.
- [Spotlight](navigation/spotlight.md): a command palette that searches pages, records and actions.
- [Steps](navigation/steps.md): shows progress through a sequence.

## Shared behavior

- **Current page.** Breadcrumbs, Menu, Navbar and Pagination mark the current page with `aria-current="page"`, and Steps marks the current step with `aria-current="step"`. Pass `current` (or put the current page last in Breadcrumbs) so assistive technology knows where the visitor is.
- **Safe links.** Every `href` goes through the same check: only relative, `http`, `https`, `mailto`, `tel` and `sms` URLs render. Anything else, such as `javascript:`, is dropped, and the item renders without a link.
- **Landmarks.** Breadcrumbs, Menu, Pagination and Navbar's links render a `<nav>`. Name each one with `label` when a page has more than one.
- **Router links.** Breadcrumbs takes a scoped `link` slot, and Menu reads a router link component provided with `MENU_LINK_KEY`, so you can render Vue Router's `RouterLink` or Inertia's `Link` in place of the `<a>`. See [Laravel and Inertia](../laravel-inertia.md) for the Inertia wrappers.
- **Translatable text.** Built-in text such as "Breadcrumb", "Previous page" and "No results." comes from the package translations, and every string is also a prop.

The deprecated `Sidebar` and `SpotlightSearch` are still exported from this subpath; see [Deprecated components](deprecated.md) for what replaces them.
