<script setup lang="ts">
import ToastProvider from './ToastProvider.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Feedback/Toast" group="feedback">
    <Variant title="Default">
      <ToastProvider>
        <template #default="{ toast }">
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <Button color="info" @click="toast.info('This is an info toast')">Info</Button>
            <Button color="success" @click="toast.success('Operation successful!')">Success</Button>
            <Button color="warning" @click="toast.warning('Please be careful')">Warning</Button>
            <Button color="error" @click="toast.error('Something went wrong')">Error</Button>
          </div>
        </template>
      </ToastProvider>
    </Variant>

    <Variant title="Custom Duration">
      <ToastProvider :default-duration="10000">
        <template #default="{ toast }">
          <Button color="primary" @click="toast.success('This lasts 10 seconds')">10s Toast</Button>
        </template>
      </ToastProvider>
    </Variant>

    <Variant title="Position: Top Center">
      <ToastProvider :position="['toast-center', 'toast-top']">
        <template #default="{ toast }">
          <Button color="primary" @click="toast.info('Top center notification')">
            Top Center Toast
          </Button>
        </template>
      </ToastProvider>
    </Variant>

    <Variant title="Position: Top Start">
      <ToastProvider :position="['toast-start', 'toast-top']">
        <template #default="{ toast }">
          <Button color="primary" @click="toast.info('Top left notification')">
            Top Start Toast
          </Button>
        </template>
      </ToastProvider>
    </Variant>

    <Variant title="Position: Bottom Center">
      <ToastProvider :position="['toast-center', 'toast-bottom']">
        <template #default="{ toast }">
          <Button color="primary" @click="toast.info('Bottom center notification')">
            Bottom Center Toast
          </Button>
        </template>
      </ToastProvider>
    </Variant>

    <Variant title="Max Toasts (Limit 3)">
      <ToastProvider :max="3">
        <template #default="{ toast }">
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <Button
              color="info"
              @click="
                () => {
                  toast.info('Toast 1');
                  toast.success('Toast 2');
                  toast.warning('Toast 3');
                  toast.error('Toast 4 — evicts the first');
                }
              "
            >
              Fire 4 Toasts (Max 3)
            </Button>
          </div>
        </template>
      </ToastProvider>
    </Variant>

    <Variant title="Dismiss All">
      <ToastProvider>
        <template #default="{ toast }">
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <Button
              color="info"
              @click="
                () => {
                  toast.info('First toast');
                  toast.success('Second toast');
                  toast.warning('Third toast');
                }
              "
            >
              Show 3 Toasts
            </Button>
            <Button color="error" @click="toast.dismissAll()">Dismiss All</Button>
          </div>
        </template>
      </ToastProvider>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Toast

A toast notification system with info, success, warning, and error types. Uses a provider/composable pattern.

## Usage

```vue
<ToastProvider>
  <template #default="{ toast }">
    <button @click="toast.success('Saved!')">Save</button>
  </template>
</ToastProvider>
```

## ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultDuration` | `number` | `5000` | Auto-dismiss duration in milliseconds |
| `max` | `number` | `5` | Maximum simultaneously visible toasts |
| `position` | `ToastPosition[]` | `['toast-end', 'toast-bottom']` | DaisyUI position classes for the container |

## Toast API

The `useToast()` composable (or scoped slot) provides:

- `toast.show(options)` — Show a toast with full options
- `toast.success(message)` — Success variant
- `toast.error(message)` — Error variant
- `toast.warning(message)` — Warning variant
- `toast.info(message)` — Info variant
- `toast.dismiss(id)` — Dismiss specific toast
- `toast.dismissAll()` — Dismiss all toasts

## Positions

Combine horizontal (`toast-start`, `toast-center`, `toast-end`) with vertical (`toast-top`, `toast-middle`, `toast-bottom`).
</docs>
