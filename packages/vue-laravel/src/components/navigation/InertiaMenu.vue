<script setup lang="ts">
/** @module InertiaMenu */
import { Link } from '@inertiajs/vue3';
import { Menu } from '@artisanpack-ui/vue';

defineOptions({ inheritAttrs: false });

const emit = defineEmits<{
  select: [name: string];
}>();
</script>

<template>
  <!-- @vue-ignore -->
  <Menu v-bind="$attrs" @select="emit('select', $event)">
    <template #item="{ item }">
      <Link v-if="item.href && !item.disabled" :href="item.href">
        <slot name="item" :item="item">{{ item.label }}</slot>
      </Link>
      <template v-else>
        <slot name="item" :item="item">{{ item.label }}</slot>
      </template>
    </template>
  </Menu>
</template>
