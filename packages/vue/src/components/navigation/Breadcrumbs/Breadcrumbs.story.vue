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
  </Story>
</template>

<docs lang="md">
# Breadcrumbs

A breadcrumb navigation trail with linked and current items.
</docs>
