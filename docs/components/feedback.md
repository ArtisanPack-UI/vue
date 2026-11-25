---
title: Feedback
menu_order: 60
meta_description: Vue feedback components for status, progress and errors. Alert, EmptyState, ErrorState, Loading, Skeleton and Toast.
---

# Feedback

Components that tell people what's happening: status messages, loading indicators, placeholders, empty and error states, and toast notifications. They're exported from `@artisanpack-ui/vue/feedback` and from the package root.

```ts
import { Alert, Loading, Toaster, toast } from '@artisanpack-ui/vue/feedback';
```

- [Alert](feedback/alert.md): an inline message about the state of a page or section.
- [EmptyState](feedback/empty-state.md): explains why there's nothing here and what to do next.
- [ErrorState](feedback/error-state.md): explains what failed and how to recover, in place of content that couldn't load.
- [Loading](feedback/loading.md): a spinner or dots with a status label.
- [Skeleton](feedback/skeleton.md): placeholder shapes that match the layout while content loads.
- [Toast](feedback/toast.md): brief, timed notifications, with `Toaster`, `toast` and `createToaster()`.

## Choosing a component

| Situation                                                | Use                                   |
| -------------------------------------------------------- | ------------------------------------- |
| A save, sync or billing message tied to a section        | [Alert](feedback/alert.md)            |
| A quick confirmation that doesn't need a response        | [Toast](feedback/toast.md)            |
| A list or page with nothing in it yet                    | [EmptyState](feedback/empty-state.md) |
| Content that failed to load, a 404 or a permission error | [ErrorState](feedback/error-state.md) |
| A wait whose layout you know                             | [Skeleton](feedback/skeleton.md)      |
| A wait whose layout you don't know                       | [Loading](feedback/loading.md)        |
| Measurable progress                                      | [Progress](display/progress.md)       |

## Shared behavior

- Alert, EmptyState and ErrorState share a shape: `title`, `description`, `icon` and `actions` props, each overridden by the slot with the same name, and the default slot fills the description.
- Every component sets `inheritAttrs: false` and binds `class`, `style` and other attributes to its root. All but Skeleton take a `classes` prop for extra classes per part.
- The built-in accessible names ("Dismiss", "Loading", "Notifications", "Dismiss notification") are translated, and each has a prop to override it.

## Deprecated

`ErrorDisplay` (use ErrorState) and `ToastProvider`, `ToastMessage`, `useToast` and `TOAST_KEY` (use Toaster, Toast and `toast`) are still exported from this subpath for 1.x code. See [Deprecated components](deprecated.md).
