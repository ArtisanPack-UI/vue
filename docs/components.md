---
title: Components
menu_order: 40
---

# Components

Every component has its own page, grouped by the subpath it's exported from. Each page lists every prop, slot, event, `v-model` binding and part, with examples and keyboard behavior, and links to the component in the design-system documentation for its anatomy, tokens and live examples. This page covers the conventions all of them share.

## Importing

Every component is a named export of the package root and of one category subpath:

```ts
import { Button, Dialog } from '@artisanpack-ui/vue';
// or
import { Button } from '@artisanpack-ui/vue/form';
import { Dialog } from '@artisanpack-ui/vue/layout';
```

The subpaths are `/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`, `/composables` and `/ai`. The AI components are only exported from [`/ai`](components/ai.md). Each subpath ships its own type declarations.

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

A component bound with `v-model:open` follows the value you pass. It reports a change through `update:open` and waits for the value to change, so a parent that ignores the event keeps it where it is. Without the binding, it keeps its own state. Each component page lists its bindings and events.

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

Put one `Toaster` on the page, then call `toast.create()` from anywhere. See [Toast](components/feedback/toast.md).

## Global registration

Components can be registered globally with the [Vue plugin](getting-started.md), under a prefix (`<ApButton>`). Only the components you pass are registered.

## Categories

- [Form](components/form.md) (`/form`): buttons, text fields, choices, pickers, editors, file uploads and form validation.
- [Layout](components/layout.md) (`/layout`): the app shell, page headers, cards, grids and stacks, overlays such as Dialog, Drawer, Popover and DropdownMenu, tabs, accordions and typography.
- [Navigation](components/navigation.md) (`/navigation`): links, menus, the navbar, breadcrumbs, pagination, steps and the Spotlight command palette.
- [Display](components/display.md) (`/display`): avatars, badges, stats and KPI cards, progress, sparklines, timelines, code, diffs and image galleries.
- [Data](components/data.md) (`/data`): Table, Chart and Calendar.
- [Feedback](components/feedback.md) (`/feedback`): alerts, toasts, loading indicators, skeletons and empty or error states.
- [Utility](components/utility.md) (`/utility`): icons, tooltips, the clipboard button, keyboard keys, Markdown, Swap and the theme toggle.
- [AI Components](components/ai.md) (`/ai`): admin screens for the `artisanpack-ui/ai` Laravel package.
- [Inertia Components](components/inertia.md) (`@artisanpack-ui/vue-laravel`): form fields, navigation, layouts and flash messages wired to Inertia and Laravel.
- [Deprecated components](components/deprecated.md): the 1.x names kept as aliases in 2.0.

## Livewire-only components

[StreamableContent](https://docs.artisanpackui.dev/documentation/design-system/components/streamable-content), [ImageLibrary](https://docs.artisanpackui.dev/documentation/design-system/components/image-library) and [ThemePreview](https://docs.artisanpackui.dev/documentation/design-system/components/theme-preview) are Livewire-only: the design system ships them in Livewire UI Components, not in React or Vue.
