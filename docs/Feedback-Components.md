# Feedback Components

```ts
import { Alert, EmptyState, ErrorDisplay, Loading, Skeleton, Toast, Toaster, toast, createToaster } from '@artisanpack-ui/vue/feedback';
```

---

## Alert

Contextual feedback messages for success, warnings, information, and errors.

```vue
<Alert color="success" dismissible>Operation completed successfully.</Alert>
<Alert color="error">Something went wrong.</Alert>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'info' \| 'success' \| 'warning' \| 'error'` | -- | Color variant |
| `dismissible` | `boolean` | `false` | Show close button |
| `visible` | `boolean` | -- | Controlled visibility |
| `className` | `string` | -- | Additional CSS classes |

---

## EmptyState

Placeholder shown when a list, table, or section has no content.

```vue
<EmptyState heading="No results" description="Try adjusting your search filters.">
  <template #action><Button>Reset Filters</Button></template>
</EmptyState>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | -- | Heading text |
| `headingAs` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h3'` | Heading element |
| `description` | `string` | -- | Description text |
| `className` | `string` | -- | Additional CSS classes |

---

## ErrorDisplay

User-friendly error state with optional retry action.

```vue
<ErrorDisplay title="Failed to load data" message="Please check your connection." retryable @retry="fetchData" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Something went wrong'` | Error title |
| `message` | `string` | -- | Error message |
| `retryable` | `boolean` | `false` | Show retry button |
| `retryLabel` | `string` | `'Try again'` | Retry button text |
| `className` | `string` | -- | Additional CSS classes |

---

## Loading

Animated loading indicator with multiple animation styles.

```vue
<Loading color="primary" size="lg" variant="dots" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `DaisyColor` | -- | Color variant |
| `size` | `Size` | -- | Indicator size |
| `variant` | `'spinner' \| 'dots' \| 'ring' \| 'ball' \| 'bars' \| 'infinity'` | `'spinner'` | Animation style |
| `ariaLabel` | `string` | `'Loading'` | Accessible label |
| `className` | `string` | -- | Additional CSS classes |

---

## Skeleton

Placeholder loading animation for content placeholders.

```vue
<Skeleton width="200px" height="1rem" />
<Skeleton circle width="48px" height="48px" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | -- | Width (CSS value) |
| `height` | `string` | -- | Height (CSS value) |
| `circle` | `boolean` | `false` | Circle shape |
| `className` | `string` | -- | Additional CSS classes |

---

## Toast

Brief, non-blocking messages, built on the design system (`.apui-toast`, design-system #51). Put one `Toaster` on the page, then show toasts from data with `toast.create()`. They stack at the bottom end of the viewport, time out after 5 seconds (paused while the region is hovered or focused), and a toast with an action stays until it's used or closed. An `error` toast is announced at once (`role="alert"`); never make a toast the only place an error is reported.

```vue
<script setup lang="ts">
import { Button, Toaster, toast } from '@artisanpack-ui/vue';

function archive() {
  toast.create({
    title: 'Listing archived',
    description: 'Cedarwood Estates is hidden from search.',
    action: { label: 'Undo', onClick: () => console.log('restored') },
  });
}
</script>

<template>
  <Toaster />
  <Button @click="archive">Archive listing</Button>
</template>
```

`toast.create(options)` returns the toast's id; `toast.update(id, options)`, `toast.dismiss(id?)` and `toast.remove(id?)` change or clear toasts. Options: `title`, `description`, `color` (default `neutral`), `variant` (`'default' | 'inverse'`), `surface` (`'overlay' | 'glass'`), `icon`, `duration` (ms, `0` keeps it), `action` (`{ label, onClick }`), `hideClose` and `id`.

### Toaster Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `'top-start' \| 'top' \| 'top-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end'` | `'bottom-end'` | Where the region sits |
| `max` | `number` | `5` | Toasts shown at once; the rest queue |
| `gap` | `number` | `8` | Space between toasts (px) |
| `duration` | `number` | `5000` | Default time before a toast dismisses itself (ms) |
| `offsets` | `string` | `'16px'` | Distance from the viewport edge |
| `toaster` | `ToasterInstance` | -- | A toaster from `createToaster()` to render instead of the default `toast` |
| `label` | `string` | `'Notifications'` | The region's accessible name |
| `closeLabel` | `string` | `'Dismiss notification'` | Each toast's close button name; translate it |
| `classes` | `Partial<Record<ToastPart \| 'group' \| 'actionTrigger', string>>` | -- | Extra classes per toast part, plus `group` for the region and `actionTrigger` for the action button |

`toast` goes to the newest mounted `Toaster` without a `toaster` prop; if two option-less `Toaster`s are mounted, only the newest renders, so each toast shows once. A `Toaster` with options takes over toasts created before it mounted (up to 5). `toaster` and the options (`placement`, `max`, `gap`, `duration`, `offsets`) are read once, when the `Toaster` is set up; changing them later has no effect. For a separate stack, create one with `createToaster({ … })`, pass it as `toaster` and call its own `create()`.

### Static Toast

Rendered on its own, a `Toast` is static (no timer), for docs or inline status:

```vue
<Toast color="success" title="Listing saved" description="Cedarwood Estates is live now." />
<Toast variant="inverse" title="Listing archived">
  <template #actions>
    <Button size="sm" variant="outline" color="neutral">Undo</Button>
  </template>
</Toast>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | -- | The message |
| `description` | `string` | -- | Supporting text |
| `color` | semantic color | `'neutral'` | Tints the icon; `error` sets `role="alert"` |
| `variant` | `'default' \| 'inverse'` | `'default'` | `inverse` stands out on the inverse surface |
| `surface` | `'overlay' \| 'glass'` | `'overlay'` | The toast's surface |
| `icon` | `string` | color's status icon | Icon name from the registry |
| `actions` | `string` | -- | Action content (usually the `#actions` slot) |
| `hideClose` | `boolean` | `false` | Hide the close button |
| `closeLabel` | `string` | `'Dismiss notification'` | The close button's accessible name; translate it |
| `classes` | `Partial<Record<ToastPart, string>>` | -- | Extra classes per part |

The close button emits `open-change` with `false`; hiding a static toast is up to you.

---

## Toast System (deprecated)

> Deprecated: use [Toast](#toast), `Toaster` and `toast.create()`. `ToastProvider`, `ToastMessage` and `useToast` stay exported while `@artisanpack-ui/vue-laravel`'s flash toasts use them.

A toast notification system with an imperative API.

### Setup

Wrap your app with `ToastProvider`:

```vue
<!-- App.vue -->
<script setup>
import { ToastProvider } from '@artisanpack-ui/vue/feedback';
</script>

<template>
  <ToastProvider :default-duration="5000" :max="5">
    <RouterView />
  </ToastProvider>
</template>
```

### Usage

```vue
<script setup>
import { useToast } from '@artisanpack-ui/vue/feedback';

const toast = useToast();

function save() {
  toast.success('Changes saved!');
}

function handleError() {
  toast.error('Something went wrong.', 8000);
}
</script>
```

### ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultDuration` | `number` | `5000` | Auto-dismiss duration (ms) |
| `max` | `number` | `5` | Max simultaneous toasts |
| `position` | `ToastPosition[]` | `['toast-end', 'toast-bottom']` | Position classes |

### ToastAPI (from `useToast()`)

| Method | Signature | Description |
|--------|-----------|-------------|
| `show` | `(options: ToastOptions) => string` | Show toast with full options |
| `success` | `(message: string, duration?: number) => string` | Success toast |
| `error` | `(message: string, duration?: number) => string` | Error toast |
| `warning` | `(message: string, duration?: number) => string` | Warning toast |
| `info` | `(message: string, duration?: number) => string` | Info toast |
| `dismiss` | `(id: string) => void` | Dismiss a specific toast |
| `dismissAll` | `() => void` | Dismiss all toasts |
