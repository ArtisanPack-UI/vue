---
title: Components
menu_order: 3
---

# Components

Every component's full reference lives in the design-system documentation: one page per component with a Vue tab, live examples, and tables of its props, parts, slots and events. This page lists them with the subpath each one is exported from, and covers what is specific to Vue.

## Importing

Every component is a named export of the package root and of one category subpath:

```ts
import { Button, Dialog } from '@artisanpack-ui/vue';
// or
import { Button } from '@artisanpack-ui/vue/form';
import { Dialog } from '@artisanpack-ui/vue/layout';
```

The subpaths are `/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`, `/composables` and `/ai`. The AI components are only exported from [`/ai`](Ai-Components). Each subpath ships its own type declarations.

## v-model

Form components bind their value with `v-model`. Checkbox and Toggle bind `checked`, and components with an open state bind `open`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Dialog, Input, Toggle } from '@artisanpack-ui/vue';

const name = ref('');
const notify = ref(true);
const editing = ref(false);
</script>

<template>
  <Button @click="editing = true">Edit profile</Button>

  <Dialog v-model:open="editing" title="Edit profile">
    <Input v-model="name" label="Name" name="name" />
    <Toggle v-model:checked="notify" label="Email me about replies" />
  </Dialog>
</template>
```

| Binding           | Components                                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model`         | Input, Password, Pin, Textarea, Select, Combobox, CheckboxGroup, RadioGroup, Range, Rating, ColorPicker, DatePicker, File, Signature, RichTextEditor, CodeEditor, Tabs, Accordion, Steps, Table (the selected rows), Calendar, ThemeToggle |
| `v-model:checked` | Checkbox, Toggle, Swap                                                                                                                                                                                                                     |
| `v-model:open`    | Dialog, Drawer, Popover, Tooltip, DropdownMenu, UserMenu, Spotlight, Collapse, ImageGallery, Combobox, DatePicker, ColorPicker, MenuSub                                                                                                    |
| `v-model:page`    | Pagination                                                                                                                                                                                                                                 |
| Others            | Markdown `v-model:source`; Calendar `v-model:date` and `v-model:view`; Table `v-model:sortBy` and `v-model:expanded`                                                                                                                       |

A component bound with `v-model:open` follows the value you pass. It reports a change through `update:open` and waits for the value to change, so a parent that ignores the event keeps it where it is. Without the binding, it keeps its own state. The component pages list each component's events under the Vue tab.

## class and classes

`class`, `style` and other attributes fall through to the component. `class` lands on its root part (for overlays, the panel). On form fields, attributes such as `name`, `required` and `autocomplete` go to the native control. Combobox is the exception: its attributes land on its root, so an `aria-label` or `autocomplete` doesn't reach the input. Give it an accessible name with the `label` prop, and use its `name` prop to name the hidden inputs it submits.

To style any other part, pass `classes`, keyed by part name:

```vue
<Button
  color="primary"
  :classes="{ label: 'tracking-wide', icon: 'opacity-75' }"
  leading-icon="plus"
>
  New listing
</Button>
```

The part names are listed on each component's page and exported as types (`ButtonPart`, `DialogPart`, …). See [Component Markup](https://docs.artisanpackui.dev/documentation/design-system/styling/component-markup).

## Slots

Text props such as `title`, `description` and `footer` have a slot of the same name for richer content, and icon props have an `icon` slot (`iconEnd` for a trailing icon):

```vue
<Card title="Revenue">
  <template #actions>
    <Button size="sm" variant="ghost">Export</Button>
  </template>
  …
</Card>
```

Each component page lists its slots.

## Icons

Icon props (`leadingIcon`, `icon`, …) take names from the shared [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons). `registerIcons`, `registerDirectionalIcons`, `isSafeIconBody` and `UnsafeIconError` are re-exported from the package root, so you can add your own:

```ts
import { registerIcons } from '@artisanpack-ui/vue';

registerIcons({
  'brand-logo': '<path d="M4 4h16v16H4z"/><circle cx="12" cy="12" r="4"/>',
});
```

## Toasts

Put one `Toaster` on the page, then call `toast.create()` from anywhere:

```vue
<script setup lang="ts">
import { Button, Toaster, toast } from '@artisanpack-ui/vue';
</script>

<template>
  <Button @click="toast.create({ title: 'Listing saved', color: 'success' })">Save</Button>
  <Toaster />
</template>
```

## Global registration

Components can be registered globally with the [Vue plugin](Getting-Started), under a prefix (`<ApButton>`). Only the components you pass are registered.

## All components

### Actions

| Component                                                                                    | Subpath       | Also exported |
| -------------------------------------------------------------------------------------------- | ------------- | ------------- |
| [Button](https://docs.artisanpackui.dev/documentation/design-system/components/button)       | `/form`       |               |
| [Link](https://docs.artisanpackui.dev/documentation/design-system/components/link)           | `/navigation` |               |
| [Clipboard](https://docs.artisanpackui.dev/documentation/design-system/components/clipboard) | `/utility`    |               |
| [Swap](https://docs.artisanpackui.dev/documentation/design-system/components/swap)           | `/utility`    |               |

### Forms

| Component                                                                                                     | Subpath | Also exported |
| ------------------------------------------------------------------------------------------------------------- | ------- | ------------- |
| [Form](https://docs.artisanpackui.dev/documentation/design-system/components/form)                            | `/form` |               |
| [Fieldset](https://docs.artisanpackui.dev/documentation/design-system/components/fieldset)                    | `/form` |               |
| [Input](https://docs.artisanpackui.dev/documentation/design-system/components/input)                          | `/form` |               |
| [Password](https://docs.artisanpackui.dev/documentation/design-system/components/password)                    | `/form` |               |
| [Pin](https://docs.artisanpackui.dev/documentation/design-system/components/pin)                              | `/form` |               |
| [Textarea](https://docs.artisanpackui.dev/documentation/design-system/components/textarea)                    | `/form` |               |
| [Select](https://docs.artisanpackui.dev/documentation/design-system/components/select)                        | `/form` |               |
| [Combobox](https://docs.artisanpackui.dev/documentation/design-system/components/combobox)                    | `/form` |               |
| [Checkbox](https://docs.artisanpackui.dev/documentation/design-system/components/checkbox)                    | `/form` |               |
| [CheckboxGroup](https://docs.artisanpackui.dev/documentation/design-system/components/checkbox-group)         | `/form` |               |
| [RadioGroup](https://docs.artisanpackui.dev/documentation/design-system/components/radio-group)               | `/form` |               |
| [Toggle](https://docs.artisanpackui.dev/documentation/design-system/components/toggle)                        | `/form` |               |
| [Range](https://docs.artisanpackui.dev/documentation/design-system/components/range)                          | `/form` |               |
| [Rating](https://docs.artisanpackui.dev/documentation/design-system/components/rating)                        | `/form` |               |
| [ColorPicker](https://docs.artisanpackui.dev/documentation/design-system/components/color-picker)             | `/form` |               |
| [DatePicker](https://docs.artisanpackui.dev/documentation/design-system/components/date-picker)               | `/form` |               |
| [File](https://docs.artisanpackui.dev/documentation/design-system/components/file)                            | `/form` |               |
| [Signature](https://docs.artisanpackui.dev/documentation/design-system/components/signature)                  | `/form` |               |
| [ValidationSummary](https://docs.artisanpackui.dev/documentation/design-system/components/validation-summary) | `/form` |               |

### Editors and content

| Component                                                                                                | Subpath    | Also exported |
| -------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [RichTextEditor](https://docs.artisanpackui.dev/documentation/design-system/components/rich-text-editor) | `/form`    |               |
| [CodeEditor](https://docs.artisanpackui.dev/documentation/design-system/components/code-editor)          | `/form`    |               |
| [Markdown](https://docs.artisanpackui.dev/documentation/design-system/components/markdown)               | `/utility` |               |
| [Code](https://docs.artisanpackui.dev/documentation/design-system/components/code)                       | `/display` |               |
| [Kbd](https://docs.artisanpackui.dev/documentation/design-system/components/kbd)                         | `/utility` |               |
| [Diff](https://docs.artisanpackui.dev/documentation/design-system/components/diff)                       | `/display` |               |
| [Heading](https://docs.artisanpackui.dev/documentation/design-system/components/heading)                 | `/layout`  |               |
| [Text](https://docs.artisanpackui.dev/documentation/design-system/components/text)                       | `/layout`  |               |
| [Divider](https://docs.artisanpackui.dev/documentation/design-system/components/divider)                 | `/layout`  |               |
| [Icon](https://docs.artisanpackui.dev/documentation/design-system/components/icon)                       | `/utility` |               |

### Data display

| Component                                                                                    | Subpath    | Also exported  |
| -------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Badge](https://docs.artisanpackui.dev/documentation/design-system/components/badge)         | `/display` |                |
| [Avatar](https://docs.artisanpackui.dev/documentation/design-system/components/avatar)       | `/display` | `AvatarGroup`  |
| [Stat](https://docs.artisanpackui.dev/documentation/design-system/components/stat)           | `/display` |                |
| [KpiCard](https://docs.artisanpackui.dev/documentation/design-system/components/kpi-card)    | `/display` |                |
| [Sparkline](https://docs.artisanpackui.dev/documentation/design-system/components/sparkline) | `/display` |                |
| [Table](https://docs.artisanpackui.dev/documentation/design-system/components/table)         | `/data`    |                |
| [Chart](https://docs.artisanpackui.dev/documentation/design-system/components/chart)         | `/data`    |                |
| [Timeline](https://docs.artisanpackui.dev/documentation/design-system/components/timeline)   | `/display` | `TimelineItem` |
| [ListItem](https://docs.artisanpackui.dev/documentation/design-system/components/list-item)  | `/layout`  | `List`         |
| [Calendar](https://docs.artisanpackui.dev/documentation/design-system/components/calendar)   | `/data`    |                |

### Feedback

| Component                                                                                               | Subpath     | Also exported                       |
| ------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------- |
| [Alert](https://docs.artisanpackui.dev/documentation/design-system/components/alert)                    | `/feedback` |                                     |
| [Toast](https://docs.artisanpackui.dev/documentation/design-system/components/toast)                    | `/feedback` | `Toaster`, `toast`, `createToaster` |
| [Loading](https://docs.artisanpackui.dev/documentation/design-system/components/loading)                | `/feedback` |                                     |
| [Progress](https://docs.artisanpackui.dev/documentation/design-system/components/progress)              | `/display`  |                                     |
| [ProgressRadial](https://docs.artisanpackui.dev/documentation/design-system/components/progress-radial) | `/display`  |                                     |
| [Skeleton](https://docs.artisanpackui.dev/documentation/design-system/components/skeleton)              | `/feedback` |                                     |
| [EmptyState](https://docs.artisanpackui.dev/documentation/design-system/components/empty-state)         | `/feedback` |                                     |
| [ErrorState](https://docs.artisanpackui.dev/documentation/design-system/components/error-state)         | `/feedback` |                                     |

### Overlays

| Component                                                                                           | Subpath       | Also exported                                                    |
| --------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| [Dialog](https://docs.artisanpackui.dev/documentation/design-system/components/dialog)              | `/layout`     |                                                                  |
| [Drawer](https://docs.artisanpackui.dev/documentation/design-system/components/drawer)              | `/layout`     |                                                                  |
| [Popover](https://docs.artisanpackui.dev/documentation/design-system/components/popover)            | `/layout`     |                                                                  |
| [Tooltip](https://docs.artisanpackui.dev/documentation/design-system/components/tooltip)            | `/utility`    |                                                                  |
| [DropdownMenu](https://docs.artisanpackui.dev/documentation/design-system/components/dropdown-menu) | `/layout`     | `DropdownMenuItem`, `DropdownMenuGroup`, `DropdownMenuSeparator` |
| [Spotlight](https://docs.artisanpackui.dev/documentation/design-system/components/spotlight)        | `/navigation` |                                                                  |

### Navigation

| Component                                                                                        | Subpath       | Also exported                                       |
| ------------------------------------------------------------------------------------------------ | ------------- | --------------------------------------------------- |
| [Navbar](https://docs.artisanpackui.dev/documentation/design-system/components/navbar)           | `/navigation` | `NavbarItem`                                        |
| [Menu](https://docs.artisanpackui.dev/documentation/design-system/components/menu)               | `/navigation` | `MenuItem`, `MenuSub`, `MenuTitle`, `MenuSeparator` |
| [UserMenu](https://docs.artisanpackui.dev/documentation/design-system/components/user-menu)      | `/layout`     |                                                     |
| [Tabs](https://docs.artisanpackui.dev/documentation/design-system/components/tabs)               | `/layout`     | `Tab`                                               |
| [Steps](https://docs.artisanpackui.dev/documentation/design-system/components/steps)             | `/navigation` | `Step`                                              |
| [Pagination](https://docs.artisanpackui.dev/documentation/design-system/components/pagination)   | `/navigation` |                                                     |
| [Breadcrumbs](https://docs.artisanpackui.dev/documentation/design-system/components/breadcrumbs) | `/navigation` | `BreadcrumbsItem`                                   |

### Disclosure

| Component                                                                                    | Subpath   | Also exported   |
| -------------------------------------------------------------------------------------------- | --------- | --------------- |
| [Accordion](https://docs.artisanpackui.dev/documentation/design-system/components/accordion) | `/layout` | `AccordionItem` |
| [Collapse](https://docs.artisanpackui.dev/documentation/design-system/components/collapse)   | `/layout` |                 |

### Layout

| Component                                                                                       | Subpath   | Also exported |
| ----------------------------------------------------------------------------------------------- | --------- | ------------- |
| [AppShell](https://docs.artisanpackui.dev/documentation/design-system/components/app-shell)     | `/layout` |               |
| [PageHeader](https://docs.artisanpackui.dev/documentation/design-system/components/page-header) | `/layout` |               |
| [Card](https://docs.artisanpackui.dev/documentation/design-system/components/card)              | `/layout` |               |
| [Grid](https://docs.artisanpackui.dev/documentation/design-system/components/grid)              | `/layout` |               |
| [Stack](https://docs.artisanpackui.dev/documentation/design-system/components/stack)            | `/layout` |               |

### Media

| Component                                                                                           | Subpath    | Also exported |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [ImageGallery](https://docs.artisanpackui.dev/documentation/design-system/components/image-gallery) | `/display` |               |
| [Carousel](https://docs.artisanpackui.dev/documentation/design-system/components/carousel)          | `/display` |               |
| [ImageSlider](https://docs.artisanpackui.dev/documentation/design-system/components/image-slider)   | `/display` |               |

### Theme

| Component                                                                                         | Subpath    | Also exported |
| ------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [ThemeToggle](https://docs.artisanpackui.dev/documentation/design-system/components/theme-toggle) | `/utility` | `ThemeScript` |

## Livewire-only components

[StreamableContent](https://docs.artisanpackui.dev/documentation/design-system/components/streamable-content), [ImageLibrary](https://docs.artisanpackui.dev/documentation/design-system/components/image-library) and [ThemePreview](https://docs.artisanpackui.dev/documentation/design-system/components/theme-preview) are Livewire-only: the design system ships them in Livewire UI Components, not in React or Vue.

## Deprecated exports

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

A few behaviours change:

- `Sidebar` has no mobile drawer or end-side sidebar: it sits at the start edge and stacks above the content on narrow screens.
- `ToastProvider` has its own toaster, so `useToast()` below it never reaches the page's `toast`. Toasts past `max` now queue instead of evicting the oldest.
- `FileUpload` takes `File`'s API, not its 1.x one: the `filesSelected` event and the `withDragDrop`, `dragDropText`, `dragDropClass`, `progress` and `hideProgress` props are gone. Keeping the import isn't enough. Bind `v-model` to receive the selected files, and pass progress per file in the entries.

The [codemod](Upgrading) rewrites most of them for you.
