---
title: Alert
menu_order: 10
meta_description: The Vue Alert component. Inline status messages with colors, variants, actions and a dismiss button, with every prop, slot, event and part.
---

# Alert

An inline message about the state of a page or section. It renders a `<div>` with a status icon, a title, a description, optional actions and an optional close button. Use it for messages that belong to the content around them, such as a failed save or a billing warning. For brief, non-blocking confirmations, use a [Toast](toast.md).

```ts
import { Alert } from '@artisanpack-ui/vue/feedback';
// or
import { Alert } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Alert } from '@artisanpack-ui/vue/feedback';
</script>

<template>
  <Alert
    color="success"
    title="Listing published"
    description="Cedarwood Estates is now visible in search."
  />
</template>
```

### Colors and variants

`color` sets the status and picks the default icon: `success` shows `circle-check`, `warning` shows `triangle-alert`, `error` shows `circle-alert`, and every other color shows `info`. `variant` sets the treatment: `soft` tints the background, `outline` suits dense forms, and `solid` is for blocking failures.

```vue
<template>
  <Alert color="info" title="Scheduled maintenance" description="Sunday, 02:00–04:00 UTC." />
  <Alert color="warning" variant="outline" title="Storage almost full" />
  <Alert
    color="error"
    variant="solid"
    title="Payment failed"
    description="Update your card to keep publishing."
  />
</template>
```

An `error` alert has `role="alert"`, so screen readers announce it at once. Every other color has `role="status"`.

### Slots instead of props

The `title`, `description`, `icon` and `actions` slots override the props with the same names. The default slot fills the description too.

```vue
<script setup lang="ts">
import { Alert } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';
</script>

<template>
  <Alert color="warning" title="Your trial ends in 3 days">
    Add a payment method to keep your listings live.
    <template #actions>
      <Button size="sm" href="/billing">Add payment method</Button>
      <Button size="sm" variant="ghost" color="neutral">Remind me later</Button>
    </template>
  </Alert>
</template>
```

### Dismissible

`dismissible` adds a close button. Pressing it hides the alert with the `hidden` attribute and emits `open-change` with `false`. The alert keeps no `open` prop, so to show it again, remount it (for example with a new `key`).

```vue
<script setup lang="ts">
import { Alert } from '@artisanpack-ui/vue/feedback';

function rememberDismissal(): void {
  localStorage.setItem('hide-import-tip', '1');
}
</script>

<template>
  <Alert
    dismissible
    color="info"
    title="Import your listings"
    description="Upload a CSV to add many listings at once."
    @open-change="rememberDismissal"
  />
</template>
```

### Glass surface

`surface="glass"` renders the alert on the glass surface, for alerts that sit over imagery.

```vue
<template>
  <Alert surface="glass" title="Preview mode" description="Changes aren't saved." />
</template>
```

## Props

| Prop          | Type                                                                                               | Default                  | Description                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                                                                                           | —                        | The headline: what happened. The `title` slot overrides it.                                               |
| `description` | `string`                                                                                           | —                        | Supporting text: what to do next. The `description` and default slots override it.                        |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'`              | The status. `error` sets `role="alert"`; every other color sets `role="status"`. Emitted as `data-color`. |
| `variant`     | `'soft' \| 'outline' \| 'solid'`                                                                   | `'soft'`                 | The visual treatment. Emitted as `data-variant`.                                                          |
| `surface`     | `'default' \| 'glass'`                                                                             | `'default'`              | The alert's surface. Emitted as `data-surface`.                                                           |
| `icon`        | `string`                                                                                           | —                        | An icon name from the icon registry. Defaults to the color's status icon. The `icon` slot overrides it.   |
| `actions`     | `string`                                                                                           | —                        | Text for the actions row. Usually you use the `actions` slot instead.                                     |
| `dismissible` | `boolean`                                                                                          | `false`                  | Adds a close button that hides the alert and emits `open-change`.                                         |
| `closeLabel`  | `string`                                                                                           | `'Dismiss'` (translated) | The close button's accessible name.                                                                       |
| `classes`     | `Partial<Record<AlertPart, string>>`                                                               | —                        | Extra classes per [part](#parts), such as `{ title: 'font-semibold' }`. Use `class` for the root.         |

The component sets `inheritAttrs: false` and binds `class`, `style` and every other attribute to the root `<div>`.

## Slots

| Slot          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `default`     | The description. Used when the `description` slot isn't set. |
| `title`       | Replaces the `title` prop.                                   |
| `description` | Replaces the `description` prop and the default slot.        |
| `icon`        | Replaces the status icon. The wrapper stays `aria-hidden`.   |
| `actions`     | Buttons or links under the text.                             |

## Events

| Event          | Payload         | Description                                                                        |
| -------------- | --------------- | ---------------------------------------------------------------------------------- |
| `@open-change` | `open: boolean` | The close button was pressed. Always `false`; the alert has already hidden itself. |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part           | Element  | Description                                                                                           |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `root`         | `div`    | The alert, `.apui-alert`.                                                                             |
| `icon`         | `span`   | The status icon. `aria-hidden`.                                                                       |
| `title`        | `p`      | The headline. Only rendered when there is a title.                                                    |
| `description`  | `div`    | The supporting text. Only rendered when there is a description.                                       |
| `actions`      | `div`    | The actions row. Only rendered when there are actions.                                                |
| `closeTrigger` | `button` | The close [Button](../form/button.md), `data-part="close-trigger"`. Only rendered when `dismissible`. |

## Types

```ts
import type { AlertColor, AlertEmits, AlertPart, AlertProps } from '@artisanpack-ui/vue/feedback';
```

| Type         | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| `AlertProps` | The component's props.                                                        |
| `AlertColor` | The eight semantic colors.                                                    |
| `AlertEmits` | The component's events: `{ 'open-change': [open: boolean] }`.                 |
| `AlertPart`  | `'root' \| 'icon' \| 'title' \| 'description' \| 'actions' \| 'closeTrigger'` |

## Accessibility

| Keys              | Action                                          |
| ----------------- | ----------------------------------------------- |
| `Tab`             | Moves through the actions and the close button. |
| `Enter` / `Space` | On the close button, dismisses the alert.       |

- Errors are `role="alert"` and announced at once; every other color is `role="status"` and announced politely.
- The icon is decorative (`aria-hidden`). The title and description carry the meaning, never color alone.
- The close button has an accessible name, `Dismiss` by default. Change it with `closeLabel`.
- Text keeps a 4.5:1 contrast ratio on every variant and surface, in every theme.
- The icon, actions and close button mirror in right-to-left layouts.
- When dismissing removes the focused close button, move focus somewhere sensible in your `@open-change` listener.

## Related

- [Alert in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/alert): anatomy, tokens and live examples.
- [Toast](toast.md) for brief, non-blocking messages.
- [ErrorState](error-state.md) for content that failed to load.
- [ValidationSummary](../form/validation-summary.md) for a list of form errors.
