---
title: Deprecated Components
menu_order: 100
meta_description: The 1.x component names kept as aliases in @artisanpack-ui/vue 2.0, what each renders and which props it maps.
---

# Deprecated Components

These 1.x names still work in 2.0 so an app keeps building while you migrate. Each is a thin alias: it renders its replacement, maps the 1.x props it can, and warns once in development. They're marked `@deprecated` and will be removed in the next major. Every attribute an alias doesn't map, including the replacement's own props, passes through to the replacement.

| Deprecated                  | Renders                            | Mapped                                                                                                                                                                                                               | Ignored                      |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `Modal`                     | `Dialog`                           | `subtitle` → `description`, `glass` → `surface="glass"`, `ariaLabel` → `aria-label`, the `actions` slot → `footer`. `persistent` gives an `alertdialog` with no close button that ignores Escape and backdrop closes | `bottom` (use a Drawer)      |
| `Dropdown`, `DropdownItem`  | `DropdownMenu`, `DropdownMenuItem` | `label` and the `trigger` slot → the trigger's `label`, `end` → `align="end"`. `DropdownItem` keeps its `click` event (also fired from the keyboard) and takes an optional `value`                                   | `top`, `hover`               |
| `Sidebar`                   | `AppShell`                         | The `sidebar` slot, the default slot as the content, `ariaLabel` → `label`                                                                                                                                           | `open`, `side`, `responsive` |
| `SpotlightSearch`           | `Spotlight`                        | `items` grouped by `group` (each `id` becomes the value), `ariaLabel` → `label`. `select` still sends the 1.x item. The `item` slot is gone                                                                          |                              |
| `Radio`                     | `RadioGroup`                       | The `optionValue`, `optionLabel` and `optionHint` keys, `inline` → horizontal, `card` → `variant="cards"`, `cardClass` → `classes.item`                                                                              | `color`                      |
| `Editor`                    | `CodeEditor`                       | All its props carry over                                                                                                                                                                                             |                              |
| `FileUpload`                | `File`                             | See below                                                                                                                                                                                                            |                              |
| `ErrorDisplay`              | `ErrorState`                       |                                                                                                                                                                                                                      |                              |
| `ToastProvider`, `useToast` | `Toaster` and `toast`              | `defaultDuration` → `duration`, `max`, and the 1.x `position` classes → a `placement`. Its default slot also gets `toast`                                                                                            | `toast-middle`               |
| `ToastMessage`              | `Toast`                            | `message` → `title`, `color`; the close button emits `dismiss` with the item's id                                                                                                                                    |                              |

Each replacement has its own page: [Dialog](layout/dialog.md), [DropdownMenu](layout/dropdown-menu.md), [AppShell](layout/app-shell.md), [Spotlight](navigation/spotlight.md), [RadioGroup](form/radio-group.md), [CodeEditor](form/code-editor.md), [File](form/file.md), [ErrorState](feedback/error-state.md) and [Toast](feedback/toast.md). In `@artisanpack-ui/vue-laravel`, `InertiaRadio` is deprecated in favor of [InertiaRadioGroup](inertia/inertia-radio-group.md); see [InertiaRadio](inertia/inertia-radio.md).

A few behaviors change:

- `Sidebar` has no mobile drawer or end-side sidebar: it sits at the start edge and stacks above the content on narrow screens.
- `ToastProvider` has its own toaster, so `useToast()` below it never reaches the page's `toast`. Toasts past `max` now queue instead of evicting the oldest.
- `FileUpload` takes `File`'s API, not its 1.x one: the `filesSelected` event and the `withDragDrop`, `dragDropText`, `dragDropClass`, `progress` and `hideProgress` props are gone. Keeping the import isn't enough. Bind `v-model` to receive the selected files, and pass progress per file in the entries.

The [codemod](../upgrading.md) rewrites most of them for you.
