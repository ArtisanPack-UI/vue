---
title: FlashToasts
menu_order: 40
meta_description: The Vue FlashToasts component. Shows Laravel session flash messages from Inertia page props as design-system toasts and renders the Toaster.
---

# FlashToasts

Shows the session's flash messages as design-system [toasts](../feedback/toast.md). It calls `useFlashMessages()`, which turns each non-empty `flash` page prop into a toast when the page loads and after each visit, and renders a `Toaster` after its default slot to display them. Put it in your persistent layout.

```ts
import { FlashToasts } from '@artisanpack-ui/vue-laravel';
```

## Usage

Share `flash` in `HandleInertiaRequests` as described in [Laravel and Inertia](../../laravel-inertia.md#share-the-props), flash a message in the controller, and wrap the layout's content:

```php
return back()->with('success', 'Settings saved.');
```

```vue
<!-- resources/js/Layouts/Main.vue -->
<script setup lang="ts">
import { FlashToasts } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <FlashToasts placement="top-end">
    <slot />
  </FlashToasts>
</template>
```

`placement` and every other attribute go to the Toaster.

### Colors

Each flash key picks the toast's color. The map is built from, in order of priority, the `colorMap` prop, the plugin's `flashColorMap`, and the defaults: `success`, `error`, `warning` and `info` keep their color, and `message` and any other key show as `info`.

```vue
<template>
  <FlashToasts :color-map="{ status: 'success', danger: 'error' }">
    <slot />
  </FlashToasts>
</template>
```

To set the map app-wide, pass it to the plugin: `app.use(createArtisanPackUILaravel({ flashColorMap: { status: 'success' } }))`.

### Duration

Each flash toast dismisses itself after `duration` milliseconds, 5000 by default, paused while the region is hovered or focused. Set `:duration="0"` to keep toasts until they're closed.

### A page that already has a Toaster

When the layout already renders a `Toaster`, for toasts you create yourself with `toast.create()`, set `:region="false"`. The flash toasts then show in that Toaster:

```vue
<script setup lang="ts">
import { Toaster } from '@artisanpack-ui/vue';
import { FlashToasts } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <FlashToasts :region="false">
    <slot />
  </FlashToasts>
  <Toaster placement="bottom-end" />
</template>
```

### A separate toaster

Pass a toaster from `createToaster()` to keep flash toasts apart from the page's `toast`. FlashToasts renders that toaster:

```vue
<script setup lang="ts">
import { createToaster } from '@artisanpack-ui/vue';
import { FlashToasts } from '@artisanpack-ui/vue-laravel';

const flashToaster = createToaster({ placement: 'top-end' });
</script>

<template>
  <FlashToasts :toaster="flashToaster" label="Messages">
    <slot />
  </FlashToasts>
</template>
```

## Props

| Prop       | Type                              | Default | Description                                                                                              |
| ---------- | --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `colorMap` | `Record<string, FlashToastColor>` | —       | Flash key to toast color, merged over the plugin's `flashColorMap` and the defaults. Read once on setup. |
| `duration` | `number`                          | `5000`  | Milliseconds before each flash toast dismisses itself. `0` keeps it. Read once on setup.                 |
| `toaster`  | `ToasterInstance`                 | —       | A toaster from `createToaster()` to show the toasts in, and to render. Defaults to the page's `toast`.   |
| `region`   | `boolean`                         | `true`  | Renders a `Toaster` after the default slot. Set it to `false` when the page already renders one.         |

### Forwarded props

FlashToasts sets `inheritAttrs: false`. `class`, `style` and every other attribute go to the [Toaster](../feedback/toast.md), including its own props: `placement`, `max`, `gap`, `offsets`, `label`, `closeLabel` and `classes`. Toaster's `toaster` is set from FlashToasts' `toaster` prop. FlashToasts' `duration` applies to the flash toasts only and isn't passed to the Toaster. With a `toaster`, the Toaster ignores `placement`, `max`, `gap` and `offsets`; set them on `createToaster()` instead. With `region` off, the attributes go nowhere.

## Slots

| Slot      | Description                                    |
| --------- | ---------------------------------------------- |
| `default` | The page content, rendered before the Toaster. |

## Events

FlashToasts has no events.

## Parts

FlashToasts has no parts of its own. Pass per-part classes to the toasts with the Toaster's `classes`; see [Toast parts](../feedback/toast.md#parts).

## Types

```ts
import type { FlashToastColor, UseFlashMessagesOptions } from '@artisanpack-ui/vue-laravel';
```

| Type                      | Description                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `FlashToastColor`         | A toast color: `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'`. |
| `UseFlashMessagesOptions` | `{ colorMap?, duration?, toaster? }`, the options FlashToasts shares with `useFlashMessages()`.                    |

`ToasterInstance` comes from `@artisanpack-ui/vue/feedback`.

## Accessibility

| Keys     | Action                                   |
| -------- | ---------------------------------------- |
| `Alt+T`  | Moves focus to the toaster's region.     |
| `Tab`    | Moves through the toasts' close buttons. |
| `Escape` | On a toast, dismisses it.                |

- The Toaster's region is a labelled landmark ("Notifications", translated) with `aria-live="polite"`. An `error` toast is `role="alert"` and is announced at once.
- Toasts time out. Don't rely on a flash toast as the only report of a blocking error; show it inline too, or use [FlashAlerts](flash-alerts.md).
- Each close button has an accessible name ("Dismiss notification", translated).

## Related

- [Toast in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/toast): anatomy, tokens and live examples.
- [Toast](../feedback/toast.md) for `Toaster`, `toast` and `createToaster`.
- [useFlashMessages](../../laravel-inertia.md#useflashmessages), the composable underneath.
- [FlashAlerts](flash-alerts.md) to show the same messages as inline Alerts.
