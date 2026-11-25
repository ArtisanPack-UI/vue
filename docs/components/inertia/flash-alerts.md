---
title: FlashAlerts
menu_order: 30
meta_description: The Vue FlashAlerts component. Shows Laravel session flash messages from Inertia page props as inline Alerts, one per message.
---

# FlashAlerts

Shows the session's flash messages as inline [Alerts](../feedback/alert.md). It reads `flash` from the Inertia page props and renders one Alert per non-empty message, colored by its key. Use it for banners at the top of a page; use [FlashToasts](flash-toasts.md) for transient toasts instead.

```ts
import { FlashAlerts } from '@artisanpack-ui/vue-laravel';
```

## Usage

Share `flash` in `HandleInertiaRequests` as described in [Laravel and Inertia](../../laravel-inertia.md#share-the-props), flash a message in the controller, and render FlashAlerts where the banners belong:

```php
return redirect()->route('users.index')->with('success', 'User created.');
```

```vue
<script setup lang="ts">
import { AppLayout, FlashAlerts } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <AppLayout>
    <FlashAlerts />
    <slot />
  </AppLayout>
</template>
```

### Colors

Each flash key picks the Alert's color:

| Flash key | Alert color |
| --------- | ----------- |
| `success` | `success`   |
| `error`   | `error`     |
| `warning` | `warning`   |
| `info`    | `info`      |
| `message` | `info`      |
| any other | `info`      |

The color map is fixed. The plugin's `flashColorMap` only applies to [FlashToasts](flash-toasts.md) and `useFlashMessages()`.

### Dismissing

Alerts are dismissible by default, and a dismissed Alert hides itself. Each Alert is keyed by its flash key, so while FlashAlerts stays mounted, as in a persistent layout, a new message under the same key arrives in the hidden Alert and isn't shown. Render FlashAlerts in the page rather than the persistent layout if that matters. Set `:dismissible="false"` to keep them:

```vue
<template>
  <FlashAlerts :dismissible="false" />
</template>
```

## Props

| Prop          | Type      | Default | Description                             |
| ------------- | --------- | ------- | --------------------------------------- |
| `dismissible` | `boolean` | `true`  | Gives each Alert a close button.        |
| `className`   | `string`  | —       | Extra classes for the wrapping `<div>`. |

When there are no messages, nothing is rendered. Otherwise the Alerts are in a `<div>` that receives `class`, `style` and every other attribute. The Alerts' other props, such as `variant`, aren't configurable.

## Slots

FlashAlerts has no slots. Each message is the Alert's text.

## Events

FlashAlerts has no events.

## Parts

FlashAlerts has no parts of its own. Each Alert renders its own parts; see [Alert parts](../feedback/alert.md#parts).

## Types

```ts
import type { FlashMessages, SharedPageProps } from '@artisanpack-ui/vue-laravel';
```

| Type              | Description                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `FlashMessages`   | The `flash` page prop: optional `success`, `error`, `warning`, `info` and `message` strings, plus any other string key. |
| `SharedPageProps` | The shared page props, whose `flash` FlashAlerts reads.                                                                 |

## Accessibility

| Keys            | Action                                  |
| --------------- | --------------------------------------- |
| `Tab`           | Moves to each Alert's close button.     |
| `Enter`/`Space` | On a close button, dismisses the Alert. |

- An `error` message renders with `role="alert"` and is announced at once; the rest use `role="status"` and are announced politely.
- Meaning comes from each Alert's icon and text, not color alone.
- Each close button has an accessible name ("Dismiss", translated).

## Related

- [Alert in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/alert): anatomy, tokens and live examples.
- [Alert](../feedback/alert.md), the component it renders.
- [FlashToasts](flash-toasts.md) to show the same messages as toasts.
