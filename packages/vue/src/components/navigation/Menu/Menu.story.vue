<script setup lang="ts">
import Menu from './Menu.vue';

const items = [
  { name: 'home', label: 'Home', href: '/' },
  { name: 'about', label: 'About', href: '/about', active: true },
  { name: 'services', label: 'Services', href: '/services' },
  { name: 'disabled', label: 'Disabled', href: '#', disabled: true },
  {
    name: 'more',
    label: 'More',
    children: [
      { name: 'blog', label: 'Blog', href: '/blog' },
      { name: 'contact', label: 'Contact', href: '/contact' },
    ],
  },
];
</script>

<template>
  <Story title="Navigation/Menu" group="navigation">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstCheckbox v-model="state.horizontal" title="Horizontal" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'xs', 'sm', 'md', 'lg']" />
        <HstSelect v-model="state.color" title="Color" :options="['', 'primary', 'secondary', 'accent', 'neutral']" />
      </template>

      <template #default="{ state }">
        <Menu
          :items="items"
          :horizontal="state.horizontal"
          :size="state.size || undefined"
          :color="state.color || undefined"
        />
      </template>
    </Variant>

    <Variant title="Horizontal">
      <Menu :items="items" horizontal />
    </Variant>

    <Variant title="With Nested Items">
      <div style="max-width: 250px">
        <Menu :items="items" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Menu

A vertical or horizontal menu with nested items, active state, and disabled items.
</docs>
