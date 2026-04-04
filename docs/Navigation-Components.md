# Navigation Components

```ts
import { Breadcrumbs, Menu, Navbar, Pagination, Sidebar, SpotlightSearch, Steps } from '@artisanpack-ui/vue/navigation';
```

---

## Breadcrumbs

Navigation breadcrumb trail with semantic markup and ARIA navigation role.

```vue
<Breadcrumbs :items="[
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Widget' },
]" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | **required** | Breadcrumb items (root to current) |
| `className` | `string` | -- | Additional CSS classes |

---

## Menu

Vertical or horizontal menu with active state, nested submenus, and keyboard navigation.

```vue
<Menu :items="[
  { name: 'home', label: 'Home', href: '/', active: true },
  { name: 'settings', label: 'Settings', href: '/settings' },
]" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItem[]` | **required** | Menu item definitions |
| `horizontal` | `boolean` | `false` | Horizontal layout |
| `size` | `Size` | -- | Menu size |
| `color` | `DaisyColor` | -- | Active item color |
| `className` | `string` | -- | Additional CSS classes |

---

## Navbar

Top navigation bar with start, center, and end slots.

```vue
<script setup lang="ts">
import { Navbar, Menu } from '@artisanpack-ui/vue/navigation';
import { ThemeToggle } from '@artisanpack-ui/vue/utility';

const navItems = [
  { name: 'home', label: 'Home', href: '/' },
  { name: 'about', label: 'About', href: '/about' },
];
</script>

<template>
  <Navbar color="primary" glass>
    <template #start><a href="/">Logo</a></template>
    <template #center><Menu :items="navItems" horizontal /></template>
    <template #end><ThemeToggle /></template>
  </Navbar>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `DaisyColor` | -- | Background color |
| `glass` | `boolean` | `false` | Glass morphism styling |
| `className` | `string` | -- | Additional CSS classes |

---

## Pagination

Page navigation with numbered pages, previous/next buttons, and configurable sibling count.

```vue
<Pagination :current-page="page" :total-pages="10" @update:current-page="page = $event" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | **required** | Active page (1-based) |
| `totalPages` | `number` | **required** | Total number of pages |
| `siblingCount` | `number` | `1` | Siblings shown on each side of current page |
| `size` | `Size` | -- | Button size |
| `className` | `string` | -- | Additional CSS classes |

---

## Sidebar

Collapsible side navigation panel. Responsive: overlay on mobile, fixed on desktop.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Sidebar, Menu } from '@artisanpack-ui/vue/navigation';

const sidebarOpen = ref(false);
const sidebarItems = [
  { name: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { name: 'settings', label: 'Settings', href: '/settings' },
];
</script>

<template>
  <Sidebar v-model:open="sidebarOpen">
    <Menu :items="sidebarItems" />
  </Sidebar>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Visibility (`v-model:open`) |
| `side` | `'left' \| 'right'` | `'left'` | Side of the screen |
| `responsive` | `boolean` | `true` | Always visible on `lg`+ breakpoints |
| `ariaLabel` | `string` | `'Sidebar navigation'` | Accessible label |
| `className` | `string` | -- | Additional CSS classes |

---

## SpotlightSearch

Command palette / search overlay triggered by Cmd+K / Ctrl+K. Provides keyboard navigation, fuzzy filtering, and grouped results.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SpotlightSearch } from '@artisanpack-ui/vue/navigation';

const spotlightOpen = ref(false);
const commands = [
  { id: '1', label: 'Go to Dashboard', description: 'Navigate to dashboard', group: 'Navigation' },
  { id: '2', label: 'Create Post', description: 'Create a new blog post', group: 'Actions' },
];
</script>

<template>
  <SpotlightSearch v-model:open="spotlightOpen" :items="commands" placeholder="Type a command..." />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | -- | Visibility (`v-model:open`) |
| `items` | `SpotlightItem[]` | **required** | Searchable items |
| `placeholder` | `string` | `'Search...'` | Search input placeholder |
| `ariaLabel` | `string` | `'Search'` | Accessible label |
| `className` | `string` | -- | Additional CSS classes |

---

## Steps

Multi-step progress indicator with color-coded completion states.

```vue
<Steps :steps="[
  { label: 'Cart' },
  { label: 'Shipping' },
  { label: 'Payment' },
  { label: 'Confirm' },
]" :current-step="1" color="primary" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | **required** | Step definitions |
| `currentStep` | `number` | -- | Active step index (0-based) |
| `vertical` | `boolean` | `false` | Vertical layout |
| `color` | `DaisyColor` | `'primary'` | Color for completed steps |
| `className` | `string` | -- | Additional CSS classes |
