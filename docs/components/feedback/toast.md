---
title: Toast
menu_order: 60
meta_description: The Vue Toast, Toaster, toast and createToaster API. Timed, stacked notifications created from data, with every prop, option and method.
---

# Toast

A brief, non-blocking message, such as "Listing saved". Put one `Toaster` on the page, then show toasts from data with `toast.create()`. They stack at the bottom end of the viewport, time out after 5 seconds (paused on hover and focus), and a toast with an action stays until it's used or closed. Rendered on its own, a `Toast` is static: use that for docs, an inline status or a test fixture.

Toasts are never the only place an error is reported. For blocking errors, use an [Alert](alert.md).

```ts
import { Toast, Toaster, createToaster, toast } from '@artisanpack-ui/vue/feedback';
// or
import { Toast, Toaster, createToaster, toast } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Toaster, toast } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';

function save(): void {
  toast.create({ title: 'Listing saved', description: 'Live now.', color: 'success' });
}
</script>

<template>
  <Button @click="save">Save</Button>
  <Toaster />
</template>
```

Mount the `Toaster` once, usually in your root layout. `toast` is a module-level singleton, so you can call `toast.create()` from any component, composable or store.

### Colors and variants

`color` tints the icon and picks the default status icon. An `error` toast is `role="alert"` and announced at once; every other color is announced politely by the region. `variant: 'inverse'` uses the inverse surface for a toast that must stand out, and `surface: 'glass'` renders it on glass.

```ts
toast.create({ title: 'Upload failed', description: 'The file is over 10 MB.', color: 'error' });
toast.create({ title: 'Storage almost full', color: 'warning', variant: 'inverse' });
toast.create({ title: 'Theme updated', surface: 'glass', icon: 'contrast' });
```

### Actions

A toast takes one action button. Pressing it runs `onClick` and dismisses the toast. A toast with an action doesn't dismiss itself, so people have time to use it.

```ts
toast.create({
  title: 'Listing archived',
  description: 'Cedarwood Estates is hidden from search.',
  action: { label: 'Undo', onClick: () => restoreListing() },
});
```

### Duration

`duration` is the number of milliseconds before the toast dismisses itself. The timer pauses while the region is hovered or focused. `0` keeps the toast until it's closed. Without `duration`, the toaster's duration applies (5000 by default).

```ts
toast.create({ title: 'Copied', duration: 2000 });
toast.create({ title: 'Your export is ready', duration: 0 });
```

`hideClose: true` hides the close button. Keep it for toasts that time out; a sticky toast without a close button can't be dismissed except by its action or Escape.

### Updating and dismissing

`create()` returns the toast's id. Pass it to `update()` to change the toast in place; only the options you give change. Creating a toast with the id of one that's showing updates that toast instead of adding another.

```ts
const id = toast.create({ title: 'Uploading photos…', duration: 0, hideClose: true });

try {
  await uploadPhotos();
  toast.update(id, {
    title: 'Photos uploaded',
    color: 'success',
    duration: 4000,
    hideClose: false,
  });
} catch {
  toast.update(id, { title: 'Upload failed', color: 'error', hideClose: false });
}
```

There's no promise helper; the pattern above covers loading, success and failure. `dismiss(id)` closes one toast with its exit transition and `remove(id)` drops it at once. Call either without an id to clear every toast.

```ts
toast.dismiss(id);
toast.dismiss();
```

### Placement and region options

The `Toaster` props set the region's placement and defaults. `start` and `end` follow the text direction, so `bottom-end` is the bottom right in a left-to-right layout and the bottom left in a right-to-left one.

```vue
<template>
  <Toaster placement="top-end" :max="3" :duration="8000" offsets="24px" />
</template>
```

A `Toaster` with any of these options makes its own toaster, and `toast.create()` sends to it once it mounts. Toasts created before it mounted move over. The options are read once, when the `Toaster` is set up; changing them later has no effect, so give it a new `key` to rebuild it.

### Separate toasters

`createToaster()` makes an independent toaster, for example a second region in an editor pane. Render it with the `toaster` prop and call its methods instead of `toast`'s.

```vue
<script setup lang="ts">
import { Toaster, createToaster } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';

const editorToasts = createToaster({ placement: 'top', max: 2, hotkey: ['altKey', 'KeyE'] });
</script>

<template>
  <Button @click="editorToasts.create({ title: 'Draft saved' })">Save draft</Button>
  <Toaster :toaster="editorToasts" label="Editor notifications" />
</template>
```

A `Toaster` with a `toaster` prop never receives `toast.create()` calls, and the region options (`placement`, `max` and so on) are ignored in favor of the toaster's own.

### Routing

`toast` sends each call to the newest mounted `Toaster` without a `toaster` prop. While none is mounted, toasts wait in a default toaster and show as soon as one mounts. If two `Toaster`s render the same toaster, only the newest shows them, so each toast appears once. A `Toaster` only registers itself on the client, after mounting, so server rendering is safe.

### A standalone toast

On its own, `Toast` renders the same markup with no timer and no region. Its close button emits `open-change`; hiding it is up to you.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Toast } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';

const open = ref(true);
</script>

<template>
  <Toast v-if="open" variant="inverse" title="Listing archived" @open-change="open = $event">
    <template #actions>
      <Button size="sm" variant="outline" color="neutral">Undo</Button>
    </template>
  </Toast>
</template>
```

## Props

The props of the standalone `Toast`. For timed toasts, see [Toast options](#toast-options).

| Prop          | Type                                                                                               | Default                               | Description                                                                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                                                                                           | —                                     | The message, linked with `aria-labelledby`. The `title` slot overrides it.                                                                                          |
| `description` | `string`                                                                                           | —                                     | Supporting text, linked with `aria-describedby`. The `description` slot overrides it.                                                                               |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'`                           | Tints the icon. `error` makes the toast `role="alert"`. Emitted as `data-color`.                                                                                    |
| `variant`     | `'default' \| 'inverse'`                                                                           | `'default'`                           | `inverse` uses the inverse surface. Emitted as `data-variant`.                                                                                                      |
| `surface`     | `'overlay' \| 'glass'`                                                                             | `'overlay'`                           | The toast's surface. Glass falls back to overlay under reduced transparency and in high contrast. Emitted as `data-surface`.                                        |
| `icon`        | `string`                                                                                           | —                                     | An icon name from the icon registry. Defaults to the color's status icon: `circle-check`, `triangle-alert`, `circle-alert` or `info`. The `icon` slot overrides it. |
| `actions`     | `string`                                                                                           | —                                     | Text for the actions row. Usually you use the `actions` slot instead.                                                                                               |
| `hideClose`   | `boolean`                                                                                          | `false`                               | Hides the close button.                                                                                                                                             |
| `closeLabel`  | `string`                                                                                           | `'Dismiss notification'` (translated) | The close button's accessible name.                                                                                                                                 |
| `classes`     | `Partial<Record<ToastPart, string>>`                                                               | —                                     | Extra classes per [part](#parts). Use `class` for the root.                                                                                                         |

The component sets `inheritAttrs: false` and binds `class`, `style` and every other attribute to the root `<div>`.

## Slots

| Slot          | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `title`       | Replaces the `title` prop. Still linked with `aria-labelledby`.        |
| `description` | Replaces the `description` prop. Still linked with `aria-describedby`. |
| `icon`        | Replaces the status icon. The wrapper stays `aria-hidden`.             |
| `actions`     | Buttons under the text, such as Undo.                                  |

## Events

| Event          | Payload         | Description                                                                                 |
| -------------- | --------------- | ------------------------------------------------------------------------------------------- |
| `@open-change` | `open: boolean` | The close button was pressed. Always `false`. Hiding a standalone toast is the owner's job. |

## Parts

Pass extra classes to a part with `classes` (on `Toast`, or on `Toaster` for every toast it shows). The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part            | Element  | Description                                                                                                                             |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `root`          | `div`    | The toast, `.apui-toast`. `role="status"`, or `role="alert"` for an error.                                                              |
| `icon`          | `span`   | The status icon. `aria-hidden`.                                                                                                         |
| `title`         | `p`      | The message. Only rendered when there is a title.                                                                                       |
| `description`   | `p`      | The supporting text. Only rendered when there is a description.                                                                         |
| `actions`       | `div`    | The actions row. Only rendered when there are actions.                                                                                  |
| `actionTrigger` | `button` | The action [Button](../form/button.md) of a toast in a `Toaster`, `data-part="action-trigger"`. Set through `Toaster`'s `classes` only. |
| `closeTrigger`  | `button` | The close button, `data-part="close-trigger"`.                                                                                          |

## Toaster

The toast region: a labelled `aria-live` landmark that shows toasts created from data, stacked, timed and paused on hover and focus. It's teleported to `<body>`.

### Toaster props

| Prop         | Type                                                                              | Default                               | Description                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `placement`  | `'top-start' \| 'top' \| 'top-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end'` | `'bottom-end'`                        | Where the region sits. `start` and `end` follow the text direction.                                                           |
| `max`        | `number`                                                                          | `5`                                   | At most this many toasts show at once; the rest queue.                                                                        |
| `gap`        | `number`                                                                          | `8`                                   | Space between toasts, in px.                                                                                                  |
| `duration`   | `number`                                                                          | `5000`                                | Milliseconds before a toast without its own `duration` dismisses itself. `0` keeps it.                                        |
| `offsets`    | `string`                                                                          | `'16px'`                              | Distance from the viewport edge.                                                                                              |
| `toaster`    | `ToasterInstance`                                                                 | —                                     | A toaster from `createToaster()` to render instead of the default `toast` toaster. The region options above are then ignored. |
| `label`      | `string`                                                                          | `'Notifications'` (translated)        | The region's accessible name.                                                                                                 |
| `closeLabel` | `string`                                                                          | `'Dismiss notification'` (translated) | Each toast's close button name.                                                                                               |
| `classes`    | `Partial<Record<ToastPart \| 'group' \| 'actionTrigger', string>>`                | —                                     | Extra classes per part of each toast, plus `group` for the region.                                                            |

`placement`, `max`, `gap`, `duration`, `offsets` and `toaster` are read once, at setup. The root is a `Teleport`, so attributes such as `class` don't fall through; style the region with `classes.group`.

### Toaster slots and events

`Toaster` has no slots and no events. Each toast's content comes from its data.

### Toaster parts

| Part    | Element | Description                                                                        |
| ------- | ------- | ---------------------------------------------------------------------------------- |
| `group` | `div`   | The region, `role="region"` with `aria-live="polite"` and the `label` as its name. |

Each toast inside it uses the [Toast parts](#parts).

## toast

The default toaster, a `ToasterInstance`. It routes every call to the page's `Toaster`, as described in [Routing](#routing).

| Member    | Signature                                     | Description                                                                                                                |
| --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `create`  | `(options: ToastInput) => string`             | Adds a toast and returns its id. With the id of a toast that's showing, updates that toast instead.                        |
| `update`  | `(id: string, options: ToastInput) => string` | Updates a toast in place. Only the options given change; meta such as `color` merges with the toast's own. Returns the id. |
| `dismiss` | `(id?: string) => void`                       | Dismisses one toast with its exit transition, or every toast without an id.                                                |
| `remove`  | `(id?: string) => void`                       | Removes one toast at once, without the exit transition, or every toast without an id.                                      |
| `store`   | `ToastStore` (read-only)                      | The underlying Zag toast store of the current target toaster. For advanced use, such as reading the visible toasts.        |

```ts
import { toast } from '@artisanpack-ui/vue/feedback';

const id = toast.create({ title: 'Listing saved', color: 'success' });
toast.update(id, { description: 'Live now.' });
toast.dismiss(id);
```

## createToaster

```ts
function createToaster(options?: ToasterInstanceOptions): ToasterInstance;
```

Creates an independent toaster with the same `create`, `update`, `dismiss`, `remove` and `store` members as `toast`. Render it with `<Toaster :toaster="…">`. It's re-exported from `@artisanpack-ui/behavior/vue`.

| Option      | Type                                                                              | Default              | Description                                                                             |
| ----------- | --------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| `placement` | `'top-start' \| 'top' \| 'top-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end'` | `'bottom-end'`       | Where the region sits.                                                                  |
| `max`       | `number`                                                                          | `5`                  | At most this many show at once; the rest queue.                                         |
| `gap`       | `number`                                                                          | `8`                  | Space between toasts, in px.                                                            |
| `offsets`   | `string`                                                                          | `'16px'`             | Distance from the viewport edge.                                                        |
| `duration`  | `number`                                                                          | `5000`               | Milliseconds before a toast without its own `duration` dismisses itself.                |
| `hotkey`    | `string[]`                                                                        | `['altKey', 'KeyT']` | Keys that move focus to the region. Only settable here; `Toaster` has no `hotkey` prop. |

Returns a `ToasterInstance`.

## Toast options

What `toast.create()` and `update()` take (`ToastInput`).

| Option        | Type                                                                                               | Default                | Description                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| `id`          | `string`                                                                                           | generated              | Reusing the id of a showing toast updates it instead of adding one.                                             |
| `title`       | `string`                                                                                           | —                      | The message.                                                                                                    |
| `description` | `string`                                                                                           | —                      | Supporting text.                                                                                                |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'`            | Tints the icon. `error` makes the toast an alert. `success`, `warning` and `error` also set the queue priority. |
| `variant`     | `'default' \| 'inverse'`                                                                           | `'default'`            | `inverse` uses the inverse surface.                                                                             |
| `surface`     | `'overlay' \| 'glass'`                                                                             | `'overlay'`            | The toast's surface.                                                                                            |
| `icon`        | `string`                                                                                           | —                      | An icon name from the icon registry. Defaults to the color's status icon.                                       |
| `duration`    | `number`                                                                                           | the toaster's (`5000`) | Milliseconds before it dismisses itself, paused on hover and focus. `0` keeps it.                               |
| `action`      | `{ label: string; onClick?: () => void }`                                                          | —                      | One action button. Pressing it runs `onClick` and dismisses the toast. A toast with an action never times out.  |
| `hideClose`   | `boolean`                                                                                          | `false`                | Hides the close button.                                                                                         |

## Types

```ts
import type {
  ToastEmits,
  ToasterInstance,
  ToasterInstanceOptions,
  ToasterProps,
  ToastInput,
  ToastPart,
  ToastProps,
} from '@artisanpack-ui/vue/feedback';
```

| Type                     | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| `ToastProps`             | The standalone `Toast`'s props.                                               |
| `ToastEmits`             | The standalone `Toast`'s events: `{ 'open-change': [open: boolean] }`.        |
| `ToastPart`              | `'root' \| 'icon' \| 'title' \| 'description' \| 'actions' \| 'closeTrigger'` |
| `ToasterProps`           | The `Toaster`'s props.                                                        |
| `ToasterInstance`        | A toaster: `toast`, or the return value of `createToaster()`.                 |
| `ToasterInstanceOptions` | The options `createToaster()` takes.                                          |
| `ToastInput`             | One toast as data, as `create()` and `update()` take it.                      |

## Accessibility

| Keys        | Action                                                                            |
| ----------- | --------------------------------------------------------------------------------- |
| `Alt` + `T` | Moves focus to the toaster's region (change it with `createToaster({ hotkey })`). |
| `Tab`       | Moves through the toasts' actions and close buttons.                              |
| `Escape`    | On a toast in a `Toaster`, dismisses it.                                          |

- The region is a labelled landmark (`role="region"`, "Notifications" by default) with `aria-live="polite"`. An error toast is `role="alert"` and announced at once.
- A toast times out after its duration, paused while the region is hovered or focused. `duration: 0` keeps it.
- Toasts with actions don't dismiss themselves, so people have time to use them (WCAG 2.2.1).
- Never report an error only in a toast. Blocking errors belong in an [Alert](alert.md).
- The close button has an accessible name, "Dismiss notification" by default. Change it with `closeLabel`.
- Text keeps a 4.5:1 contrast ratio on the overlay, inverse and glass surfaces.
- The region sits at the bottom end of the viewport and mirrors in right-to-left layouts.

## Related

- [Toast in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/toast): anatomy, tokens and live examples.
- [Alert](alert.md) for messages that belong in the page.
- [Deprecated components](../deprecated.md) for migrating from `ToastProvider`, `useToast` and `ToastMessage`.
