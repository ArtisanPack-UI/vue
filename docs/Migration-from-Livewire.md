# Migration from Livewire

This guide helps you migrate from ArtisanPack UI Livewire components (`artisanpack-ui/livewire-ui-components`) to the Vue equivalents (`@artisanpack-ui/vue`).

## Overview

The Vue components mirror the Livewire component API as closely as possible. The main differences are:

- **Naming**: Blade `<x-artisanpack-button>` becomes Vue `<Button>`
- **Data binding**: `wire:model` becomes `v-model`
- **Events**: `wire:click` becomes `@click`
- **Slots**: Blade named slots (`<x-slot:header>`) become Vue named slots (`<template #header>`)
- **Server state**: Livewire properties become Vue refs or Inertia form state

## Component Mapping

| Livewire (Blade) | Vue Import | Notes |
|-------------------|------------|-------|
| `<x-artisanpack-button>` | `Button` | Same props |
| `<x-artisanpack-input>` | `Input` | Same props |
| `<x-artisanpack-select>` | `Select` | Same props |
| `<x-artisanpack-textarea>` | `Textarea` | Same props |
| `<x-artisanpack-checkbox>` | `Checkbox` | Same props |
| `<x-artisanpack-toggle>` | `Toggle` | Same props |
| `<x-artisanpack-radio>` | `Radio` | Same props |
| `<x-artisanpack-card>` | `Card` | Same props and slots |
| `<x-artisanpack-modal>` | `Modal` | `wire:model` becomes `v-model` |
| `<x-artisanpack-alert>` | `Alert` | Same props |
| `<x-artisanpack-table>` | `Table` | Different slot API (see below) |
| `<x-artisanpack-tabs>` | `Tabs` | Props-based API |
| `<x-artisanpack-badge>` | `Badge` | Same props |
| `<x-artisanpack-avatar>` | `Avatar` | Same props |
| `<x-artisanpack-loading>` | `Loading` | Same props |
| `<x-artisanpack-tooltip>` | `Tooltip` | Same props |
| `<x-artisanpack-drawer>` | `Drawer` | `wire:model` becomes `v-model` |
| `<x-artisanpack-dropdown>` | `Dropdown` | Same props |
| `<x-artisanpack-menu>` | `Menu` | Same props |
| `<x-artisanpack-breadcrumbs>` | `Breadcrumbs` | Same props |
| `<x-artisanpack-pagination>` | `Pagination` | Same props |
| `<x-artisanpack-steps>` | `Steps` | Same props |
| `<x-artisanpack-progress>` | `Progress` | Same props |

## Common Patterns

### Data binding

```blade
{{-- Livewire --}}
<x-artisanpack-input wire:model="name" label="Name" />
```

```vue
<!-- Vue -->
<Input v-model="name" label="Name" />
```

### Event handling

```blade
{{-- Livewire --}}
<x-artisanpack-button wire:click="save" color="primary">Save</x-artisanpack-button>
```

```vue
<!-- Vue -->
<Button @click="save" color="primary">Save</Button>
```

### Slots

```blade
{{-- Livewire --}}
<x-artisanpack-card>
    <x-slot:header>Title</x-slot:header>
    Content
    <x-slot:footer>
        <x-artisanpack-button>Action</x-artisanpack-button>
    </x-slot:footer>
</x-artisanpack-card>
```

```vue
<!-- Vue -->
<Card>
  <template #header>Title</template>
  Content
  <template #footer>
    <Button>Action</Button>
  </template>
</Card>
```

### Modal state

```blade
{{-- Livewire --}}
<x-artisanpack-modal wire:model="showModal" title="Confirm">
    Are you sure?
</x-artisanpack-modal>
```

```vue
<!-- Vue -->
<Modal v-model="showModal" title="Confirm">
  Are you sure?
</Modal>
```

### Table

The Table component uses Vue scoped slots instead of Blade's `@scope` directive:

```blade
{{-- Livewire --}}
<x-artisanpack-table :headers="$headers" :rows="$users">
    @scope('cell_name', $user)
        <strong>{{ $user->name }}</strong>
    @endscope
</x-artisanpack-table>
```

```vue
<!-- Vue -->
<Table :columns="columns" :rows="users">
  <template #cell-name="{ row }">
    <strong>{{ row.name }}</strong>
  </template>
</Table>
```

### Error handling

```blade
{{-- Livewire --}}
<x-artisanpack-input
    wire:model="email"
    label="Email"
    :error="$errors->first('email')"
/>
```

```vue
<!-- Vue with Inertia -->
<script setup>
import { InertiaInput } from '@artisanpack-ui/vue-laravel';
import { useInertiaForm } from '@artisanpack-ui/vue-laravel';
const { form, getError, post } = useInertiaForm({ email: '' });
</script>

<template>
  <InertiaInput name="email" v-model="form.email" label="Email" :error="getError('email')" />
</template>
```

### Loading states

```blade
{{-- Livewire --}}
<x-artisanpack-button wire:click="save" color="primary">
    <span wire:loading.remove>Save</span>
    <span wire:loading>Saving...</span>
</x-artisanpack-button>
```

```vue
<!-- Vue -->
<Button @click="save" color="primary" :loading="processing">
  Save
</Button>
```

## Step-by-Step Migration

1. **Install Vue packages**: `npm install @artisanpack-ui/vue @artisanpack-ui/vue-laravel`
2. **Set up Inertia.js** in your Laravel app if not already done
3. **Register plugins** in your `app.ts` (see [[Laravel Inertia Integration]])
4. **Convert pages one at a time**: Start with simpler pages (static content, basic forms) before tackling complex interactive pages
5. **Replace Blade components** with Vue imports using the mapping table above
6. **Replace `wire:model`** with `v-model`
7. **Replace `wire:click`** with `@click` and move handler logic to `<script setup>`
8. **Replace Blade slots** with Vue template slots
9. **Replace server-side validation** display with `useInertiaForm()` + `getError()`
10. **Test each page** after conversion

## Props That Changed

Most props are identical between Livewire and Vue versions. Notable differences:

| Prop | Livewire | Vue | Notes |
|------|----------|-----|-------|
| `wire:model` | Livewire binding | `v-model` | Standard Vue binding |
| `error` | `$errors->first('field')` | `getError('field')` | Via `useInertiaForm()` |
| `icon` (prefix) | `o-icon-name` | Slot-based | Use `#prefix` / `#suffix` slots |
| Table cell scopes | `@scope('cell_name', $row)` | `#cell-name="{ row }"` | Vue scoped slots |

## What's Not Available (Yet)

Some Livewire-specific features do not have direct Vue equivalents:

- **Real-time validation** via `wire:model.live`: Use `@input` with debounce or watchers
- **Deferred loading** via `wire:init`: Use Vue's `onMounted` lifecycle hook
- **Polling** via `wire:poll`: Use `setInterval` in `onMounted`/`onUnmounted`
