<script setup lang="ts">
import Breadcrumbs from './Breadcrumbs.vue';
import BreadcrumbsItem from './BreadcrumbsItem.vue';
</script>

<template>
  <Story title="Navigation/Breadcrumbs" group="navigation">
    <Variant title="Default">
      <Breadcrumbs
        :items="[
          { label: 'Dashboard', href: '#' },
          { label: 'Properties', href: '#' },
          { label: 'Lakeview Lofts' },
        ]"
      />
    </Variant>

    <Variant title="Home icon and overflow">
      <Breadcrumbs
        :items="[
          { label: 'Home', href: '#', icon: 'house', hideLabel: true },
          { label: 'Properties', href: '#' },
          { label: 'Lakeview Lofts', href: '#' },
          { label: 'Analytics', href: '#' },
          { label: 'Visitor' },
        ]"
      />
    </Variant>

    <Variant title="Composed">
      <Breadcrumbs>
        <BreadcrumbsItem label="All media" href="#" @click.prevent />
        <BreadcrumbsItem label="Invoices" />
      </Breadcrumbs>
    </Variant>
  </Story>
</template>
