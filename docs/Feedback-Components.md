# Feedback Components

```ts
import { Alert, EmptyState, ErrorDisplay, Loading, Skeleton, ToastProvider, ToastMessage, useToast } from '@artisanpack-ui/vue/feedback';
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

## Toast System

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
