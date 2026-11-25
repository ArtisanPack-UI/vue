---
title: Dialog
menu_order: 50
meta_description: The Vue Dialog component. A modal window with focus trap, v-model:open, confirmations and every prop, slot, event and part.
---

# Dialog

A modal window for a focused task or a confirmation. While it's open, focus is trapped inside, page scroll is locked and the rest of the page is hidden from assistive technology. Escape, the close button and the backdrop close it, and focus returns to the trigger. It replaces the deprecated `Modal`.

```ts
import { Dialog } from '@artisanpack-ui/vue/layout';
// or
import { Dialog } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input } from '@artisanpack-ui/vue/form';
import { Dialog } from '@artisanpack-ui/vue/layout';

const open = ref(false);
</script>

<template>
  <Dialog
    v-model:open="open"
    trigger="Invite member"
    title="Invite member"
    description="They'll get an email with a link to join the project."
  >
    <Input type="email" label="Email" />
    <template #footer>
      <Button variant="outline" color="neutral" @click="open = false">Cancel</Button>
      <Button @click="open = false">Send invite</Button>
    </template>
  </Dialog>
</template>
```

### Opening without a trigger

`trigger` (or the `trigger` slot) renders an outline neutral [Button](../form/button.md) that opens the dialog. Leave it out to open the dialog from anywhere by setting `open`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';
import { Dialog } from '@artisanpack-ui/vue/layout';

const editing = ref(false);
</script>

<template>
  <Button @click="editing = true">Edit profile</Button>
  <Dialog v-model:open="editing" title="Edit profile">
    <!-- form -->
  </Dialog>
</template>
```

### Controlled and uncontrolled

When you pass `open` (with `v-model:open` or `:open`), the dialog is controlled: it reports every change through `update:open` and shows only what the prop says. A parent that ignores or vetoes the change keeps the dialog where it is, and a static `:open="true"` stays open. Without `open`, the dialog keeps its own state and still emits `update:open`.

### Confirmations

Use `role="alertdialog"` for confirmations that interrupt. The backdrop doesn't close an alert dialog, and focus starts on the close button. `color` tints the header icon.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';
import { Dialog } from '@artisanpack-ui/vue/layout';

const confirmOpen = ref(false);

function remove(): void {
  confirmOpen.value = false;
  // …
}
</script>

<template>
  <Button color="error" variant="soft" @click="confirmOpen = true">Delete listing</Button>
  <Dialog
    v-model:open="confirmOpen"
    role="alertdialog"
    size="sm"
    color="error"
    icon="trash"
    title="Delete Cedarwood Estates?"
    description="The listing and its 3 open offers will be removed. This can't be undone."
  >
    <template #footer>
      <Button variant="outline" color="neutral" @click="confirmOpen = false">Cancel</Button>
      <Button color="error" @click="remove">Delete listing</Button>
    </template>
  </Dialog>
</template>
```

### Sizes and surfaces

`size` sets the panel's width: `sm` (360px), `md` (the `--apui-dialog-width` token, 480px) or `lg` (640px). `surface="glass"` gives a translucent panel that falls back to the overlay surface under reduced transparency and in high contrast mode.

```vue
<template>
  <Dialog v-model:open="open" size="lg" surface="glass" title="Activity">
    <!-- … -->
  </Dialog>
</template>
```

### Non-modal and in-place rendering

`:modal="false"` drops the focus trap, scroll lock and `aria-modal`. `:portal="false"` renders the dialog where it's declared instead of teleporting it to the end of `<body>`.

### Untitled dialogs

The title names the panel. Without a title, pass an `aria-label`; it becomes the panel's accessible name.

```vue
<template>
  <Dialog v-model:open="open" aria-label="Image preview" hide-close>
    <img src="/images/q3.jpg" alt="Revenue chart for Q3" />
  </Dialog>
</template>
```

## Props

| Prop          | Type                                                                                               | Default               | Description                                                                                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`        | `boolean`                                                                                          | `false`               | Whether it's open. Passing it makes the dialog controlled. Bind with `v-model:open`.                                                                                                          |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                                             | `'md'`                | The panel's width: 360px, `--apui-dialog-width` (480px) or 640px. Emitted as `data-size`.                                                                                                     |
| `role`        | `'dialog' \| 'alertdialog'`                                                                        | `'dialog'`            | `alertdialog` for interrupting confirmations: the backdrop doesn't close it, and focus starts on the close button.                                                                            |
| `surface`     | `'overlay' \| 'glass'`                                                                             | `'overlay'`           | The panel's surface. Emitted as `data-surface`.                                                                                                                                               |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | —                     | Tints the header icon. Emitted as `data-color`.                                                                                                                                               |
| `icon`        | `string`                                                                                           | —                     | An icon name from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons), shown in a tinted circle before the title. The `icon` slot overrides it. |
| `title`       | `string`                                                                                           | —                     | The heading (an `<h2>`) and the panel's accessible name. The `title` slot overrides it.                                                                                                       |
| `description` | `string`                                                                                           | —                     | Supporting text under the title, linked with `aria-describedby`. The `description` slot overrides it.                                                                                         |
| `footer`      | `string`                                                                                           | —                     | The actions row. Usually the `footer` slot instead.                                                                                                                                           |
| `trigger`     | `string`                                                                                           | —                     | Content for a trigger button that opens the dialog. Without it, open the dialog through `open`.                                                                                               |
| `modal`       | `boolean`                                                                                          | `true`                | Traps focus, locks scroll and hides the rest of the page from assistive technology.                                                                                                           |
| `portal`      | `boolean`                                                                                          | `true`                | Teleports the dialog to the end of `<body>`. Off renders it in place.                                                                                                                         |
| `hideClose`   | `boolean`                                                                                          | `false`               | Hides the close button in the header. Escape still closes the dialog.                                                                                                                         |
| `closeLabel`  | `string`                                                                                           | `'Close'`, translated | The close button's accessible name.                                                                                                                                                           |
| `classes`     | `Partial<Record<DialogPart, string>>`                                                              | —                     | Extra classes per [part](#parts), such as `{ header: '…', body: '…' }`.                                                                                                                       |

Dialog doesn't inherit attributes onto a wrapper. `class`, `style`, `aria-label` and every other attribute go to the panel (`.apui-dialog`), not the trigger.

## v-model

| Binding        | Type      | Carries                                                                                        |
| -------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | Whether the dialog is open. Updated by the trigger, Escape, the backdrop and the close button. |

## Slots

| Slot          | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `default`     | The body. The body part is omitted when this has no visible content. |
| `trigger`     | The trigger button's content. Replaces `trigger`.                    |
| `icon`        | The header icon. Replaces `icon`.                                    |
| `title`       | The heading content. Replaces `title`.                               |
| `description` | Replaces `description`.                                              |
| `footer`      | The actions row. Replaces `footer`.                                  |

## Events

| Event          | Payload   | Description                                                                     |
| -------------- | --------- | ------------------------------------------------------------------------------- |
| `@update:open` | `boolean` | The dialog opened or closed itself (trigger, Escape, backdrop or close button). |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part           | Element  | Description                                                                                    |
| -------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `trigger`      | `button` | The trigger [Button](../form/button.md). Only rendered with `trigger`.                         |
| `backdrop`     | `div`    | The dimmed backdrop.                                                                           |
| `positioner`   | `div`    | Centers the panel.                                                                             |
| `root`         | `div`    | The panel, `.apui-dialog`, `role="dialog"` or `role="alertdialog"`. Same element as `content`. |
| `content`      | `div`    | The panel. Same element as `root`.                                                             |
| `header`       | `div`    | The icon, title, description and close button. Omitted when all are absent.                    |
| `icon`         | `span`   | The tinted header icon. `aria-hidden`.                                                         |
| `title`        | `h2`     | The title.                                                                                     |
| `description`  | `p`      | The description.                                                                               |
| `closeTrigger` | `button` | The icon-only close [Button](../form/button.md).                                               |
| `body`         | `div`    | The default slot.                                                                              |
| `footer`       | `div`    | The actions row.                                                                               |

## Types

```ts
import type {
  DialogColor,
  DialogEmits,
  DialogPart,
  DialogProps,
  DialogRole,
  DialogSize,
  DialogSurface,
} from '@artisanpack-ui/vue/layout';
```

| Type            | Description                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DialogProps`   | The component's props.                                                                                                                                     |
| `DialogEmits`   | The component's events: `{ 'update:open': [open: boolean] }`.                                                                                              |
| `DialogSize`    | `'sm' \| 'md' \| 'lg'`                                                                                                                                     |
| `DialogRole`    | `'dialog' \| 'alertdialog'`                                                                                                                                |
| `DialogSurface` | `'overlay' \| 'glass'`                                                                                                                                     |
| `DialogColor`   | The eight semantic colors.                                                                                                                                 |
| `DialogPart`    | `'root' \| 'content' \| 'trigger' \| 'backdrop' \| 'positioner' \| 'header' \| 'icon' \| 'title' \| 'description' \| 'closeTrigger' \| 'body' \| 'footer'` |

## Accessibility

| Keys               | Action                                                        |
| ------------------ | ------------------------------------------------------------- |
| `Tab`, `Shift+Tab` | Moves between the controls inside; focus stays in the dialog. |
| `Escape`           | Closes the dialog and returns focus to the trigger.           |
| `Enter`, `Space`   | On the trigger, opens the dialog.                             |

- Focus moves into the dialog on open and is trapped there while it's modal; it returns to the trigger on close.
- The title is linked with `aria-labelledby` and the description with `aria-describedby`. Give every dialog a title, or an `aria-label` when it has none.
- A modal dialog sets `aria-modal`, hides everything else from assistive technology and locks page scroll.
- Destructive confirmations use `role="alertdialog"`: the backdrop doesn't close them.
- The close button has an accessible name, "Close" by default (translated). Change it with `closeLabel`.
- Glass falls back to the overlay surface under `prefers-reduced-transparency` and in high contrast mode.

## Related

- [Dialog in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/dialog): anatomy, tokens and live examples.
- [Drawer](drawer.md) for a panel that slides in from an edge.
- [Popover](popover.md) for non-modal content anchored to a trigger.
- [Deprecated components](../deprecated.md) for migrating from `Modal`.
