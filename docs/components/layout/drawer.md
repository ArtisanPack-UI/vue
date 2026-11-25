---
title: Drawer
menu_order: 70
meta_description: The Vue Drawer component. A panel that slides in from an edge, with sides, sizes, bottom sheets, v-model:open and every prop, slot and part.
---

# Drawer

A panel that slides in from an edge of the screen, for filters, record details or secondary tasks. It renders an `<aside>` with the dialog role. While it's open, focus is trapped inside, page scroll is locked and the rest of the page is hidden from assistive technology. Escape, the close button and the backdrop close it, and focus returns to the trigger.

```ts
import { Drawer } from '@artisanpack-ui/vue/layout';
// or
import { Drawer } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input } from '@artisanpack-ui/vue/form';
import { Drawer } from '@artisanpack-ui/vue/layout';

const open = ref(false);
</script>

<template>
  <Drawer v-model:open="open" trigger="Filters" title="Filters" description="218 properties match">
    <Input label="Location" leading-icon="search" />
    <template #footer>
      <Button variant="ghost" color="neutral">Reset</Button>
      <Button @click="open = false">Show 218 results</Button>
    </template>
  </Drawer>
</template>
```

### Opening without a trigger

`trigger` (or the `trigger` slot) renders an outline neutral [Button](../form/button.md) that opens the drawer. Leave it out and set `open` from your own control instead:

```vue
<template>
  <Button @click="open = true">Show details</Button>
  <Drawer v-model:open="open" title="Listing details">
    <!-- … -->
  </Drawer>
</template>
```

When you pass `open`, the drawer is controlled: it reports changes through `update:open` and shows only what the prop says. Without it, the drawer keeps its own state.

### Sides

`side` picks the edge: `end` (the default) is on the right in left-to-right layouts and on the left in right-to-left ones, and `start` is the opposite. `bottom` is a full-width sheet with a drag handle.

```vue
<template>
  <Drawer side="start" trigger="Menu" title="Menu">
    <!-- … -->
  </Drawer>
  <Drawer side="bottom" trigger="Share" title="Share listing">
    <Button variant="outline" color="neutral" leading-icon="copy">Copy link</Button>
  </Drawer>
</template>
```

### Sizes and surfaces

`size` sets the width of a start or end drawer: `sm` (320px), `md` (the `--apui-drawer-width` token, 400px) or `lg` (560px). `surface="glass"` gives a translucent panel that falls back to the overlay surface under reduced transparency and in high contrast mode.

### Non-modal and in-place rendering

`:modal="false"` drops the focus trap, scroll lock and `aria-modal`. `:portal="false"` renders the drawer where it's declared instead of teleporting it to the end of `<body>`.

### Untitled drawers

The title names the panel. Without a title, pass an `aria-label`; it becomes the panel's accessible name.

## Props

| Prop          | Type                                  | Default               | Description                                                                                                |
| ------------- | ------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `open`        | `boolean`                             | `false`               | Whether it's open. Passing it makes the drawer controlled. Bind with `v-model:open`.                       |
| `side`        | `'end' \| 'start' \| 'bottom'`        | `'end'`               | The edge it slides in from. `end` and `start` follow the reading direction. Emitted as `data-side`.        |
| `size`        | `'sm' \| 'md' \| 'lg'`                | `'md'`                | The width at the start or end side: 320px, `--apui-drawer-width` (400px) or 560px. Emitted as `data-size`. |
| `surface`     | `'overlay' \| 'glass'`                | `'overlay'`           | The panel's surface. Emitted as `data-surface`.                                                            |
| `title`       | `string`                              | —                     | The heading (an `<h2>`) and the panel's accessible name. The `title` slot overrides it.                    |
| `description` | `string`                              | —                     | Supporting text under the title, linked with `aria-describedby`. The `description` slot overrides it.      |
| `footer`      | `string`                              | —                     | The actions row. Usually the `footer` slot instead.                                                        |
| `trigger`     | `string`                              | —                     | Content for a trigger button that opens the drawer. Without it, open the drawer through `open`.            |
| `modal`       | `boolean`                             | `true`                | Traps focus, locks scroll and hides the rest of the page from assistive technology.                        |
| `portal`      | `boolean`                             | `true`                | Teleports the drawer to the end of `<body>`. Off renders it in place.                                      |
| `hideClose`   | `boolean`                             | `false`               | Hides the close button in the header. Escape still closes the drawer.                                      |
| `closeLabel`  | `string`                              | `'Close'`, translated | The close button's accessible name.                                                                        |
| `classes`     | `Partial<Record<DrawerPart, string>>` | —                     | Extra classes per [part](#parts), such as `{ header: '…', body: '…' }`.                                    |

Drawer doesn't inherit attributes onto a wrapper. `class`, `style`, `aria-label` and every other attribute go to the panel (`.apui-drawer`), not the trigger.

## v-model

| Binding        | Type      | Carries                                                                                        |
| -------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | Whether the drawer is open. Updated by the trigger, Escape, the backdrop and the close button. |

## Slots

| Slot          | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `default`     | The body. The body part is omitted when this has no visible content. |
| `trigger`     | The trigger button's content. Replaces `trigger`.                    |
| `title`       | The heading content. Replaces `title`.                               |
| `description` | Replaces `description`.                                              |
| `footer`      | The actions row. Replaces `footer`.                                  |

## Events

| Event          | Payload   | Description                                                                     |
| -------------- | --------- | ------------------------------------------------------------------------------- |
| `@update:open` | `boolean` | The drawer opened or closed itself (trigger, Escape, backdrop or close button). |

## Parts

Pass extra classes to a part with `classes`. Every part carries a `data-part` attribute (scoped `drawer`) you can also target in CSS.

| Part           | Element  | Description                                                            |
| -------------- | -------- | ---------------------------------------------------------------------- |
| `trigger`      | `button` | The trigger [Button](../form/button.md). Only rendered with `trigger`. |
| `backdrop`     | `div`    | The dimmed backdrop.                                                   |
| `positioner`   | `div`    | Places the panel at its side. Carries `data-side`.                     |
| `root`         | `aside`  | The panel, `.apui-drawer`, `role="dialog"`. Same element as `content`. |
| `content`      | `aside`  | The panel. Same element as `root`.                                     |
| `handle`       | `div`    | The drag handle of a bottom sheet. `aria-hidden`.                      |
| `header`       | `div`    | The title, description and close button. Omitted when all are absent.  |
| `title`        | `h2`     | The title.                                                             |
| `description`  | `p`      | The description.                                                       |
| `closeTrigger` | `button` | The icon-only close [Button](../form/button.md).                       |
| `body`         | `div`    | The default slot.                                                      |
| `footer`       | `div`    | The actions row.                                                       |

## Types

```ts
import type {
  DrawerPart,
  DrawerProps,
  DrawerSide,
  DrawerSize,
  DrawerSurface,
} from '@artisanpack-ui/vue/layout';
```

| Type            | Description                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DrawerProps`   | The component's props.                                                                                                                                       |
| `DrawerSide`    | `'end' \| 'start' \| 'bottom'`                                                                                                                               |
| `DrawerSize`    | `'sm' \| 'md' \| 'lg'`                                                                                                                                       |
| `DrawerSurface` | `'overlay' \| 'glass'`                                                                                                                                       |
| `DrawerPart`    | `'root' \| 'content' \| 'trigger' \| 'backdrop' \| 'positioner' \| 'handle' \| 'header' \| 'title' \| 'description' \| 'closeTrigger' \| 'body' \| 'footer'` |

## Accessibility

| Keys               | Action                                                            |
| ------------------ | ----------------------------------------------------------------- |
| `Tab`, `Shift+Tab` | Moves between the controls inside; focus stays in a modal drawer. |
| `Escape`           | Closes the drawer and returns focus to the trigger.               |
| `Enter`, `Space`   | On the trigger, opens the drawer.                                 |

- Focus moves into the drawer on open and is trapped there while it's modal; it returns to the trigger on close.
- The title is linked with `aria-labelledby` and the description with `aria-describedby`. Give every drawer a title, or an `aria-label` when it has none.
- A modal drawer sets `aria-modal`, hides everything else from assistive technology and locks page scroll.
- The side follows the reading direction, and the slide-in comes from that edge. The animation is off under `prefers-reduced-motion`.
- The close button has an accessible name, "Close" by default (translated). Change it with `closeLabel`.
- Don't open a drawer from a drawer.

## Related

- [Drawer in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/drawer): anatomy, tokens and live examples.
- [Dialog](dialog.md) for a centered modal window.
- [AppShell](app-shell.md) for a persistent sidebar.
