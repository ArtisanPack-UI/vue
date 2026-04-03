<script setup lang="ts">
/** @module InertiaBreadcrumbs */
import { Link } from '@inertiajs/vue3';
import { Breadcrumbs } from '@artisanpack-ui/vue';

defineOptions({ inheritAttrs: false });
</script>

<template>
  <!-- @vue-ignore -->
  <Breadcrumbs v-bind="$attrs">
    <template #item="{ item, index, isLast }">
      <Link v-if="item.href && !isLast" :href="item.href">
        <slot name="item" :item="item" :index="index" :is-last="isLast">
          {{ item.label }}
        </slot>
      </Link>
      <template v-else>
        <slot name="item" :item="item" :index="index" :is-last="isLast">
          {{ item.label }}
        </slot>
      </template>
    </template>
  </Breadcrumbs>
</template>
