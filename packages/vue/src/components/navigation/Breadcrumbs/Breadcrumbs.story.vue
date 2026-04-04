<script setup lang="ts">
import Breadcrumbs from './Breadcrumbs.vue';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Category', href: '/products/category' },
  { label: 'Current Page' },
];
</script>

<template>
  <Story title="Navigation/Breadcrumbs" group="navigation">
    <Variant title="Default">
      <Breadcrumbs :items="items" />
    </Variant>

    <Variant title="Two Levels">
      <Breadcrumbs :items="[{ label: 'Home', href: '/' }, { label: 'About' }]" />
    </Variant>

    <Variant title="Single Item (Current Page Only)">
      <Breadcrumbs :items="[{ label: 'Dashboard' }]" />
    </Variant>

    <Variant title="Deep Nesting">
      <Breadcrumbs
        :items="[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Security', href: '/admin/settings/security' },
          { label: 'Two-Factor Auth' },
        ]"
      />
    </Variant>

    <Variant title="With Custom Class">
      <Breadcrumbs :items="items" class-name="text-sm" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Breadcrumbs

A navigation breadcrumb trail with semantic markup and ARIA navigation role.

## Usage

```vue
<Breadcrumbs
  :items="[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page' },
  ]"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | — | Array of breadcrumb items (root to current) |
| `className` | `string` | — | Additional CSS classes |

## BreadcrumbItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display label for the breadcrumb |
| `href` | `string?` | Optional URL; the last item typically has no href |
</docs>
