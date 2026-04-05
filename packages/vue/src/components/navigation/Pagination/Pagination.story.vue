<script setup lang="ts">
import { ref } from 'vue';
import Pagination from './Pagination.vue';

const page = ref(1);
</script>

<template>
  <Story title="Navigation/Pagination" group="navigation">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstNumber v-model="state.totalPages" title="Total Pages" />
        <HstNumber v-model="state.siblingCount" title="Sibling Count" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'xs', 'sm', 'md', 'lg']" />
      </template>

      <template #default="{ state }">
        <Pagination
          v-model:current-page="page"
          :total-pages="state.totalPages || 10"
          :sibling-count="state.siblingCount || 1"
          :size="state.size || undefined"
        />
      </template>
    </Variant>

    <Variant title="Many Pages">
      <Pagination v-model:current-page="page" :total-pages="50" />
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; flex-direction: column; gap: 16px">
        <Pagination v-model:current-page="page" :total-pages="10" size="xs" />
        <Pagination v-model:current-page="page" :total-pages="10" size="sm" />
        <Pagination v-model:current-page="page" :total-pages="10" size="md" />
        <Pagination v-model:current-page="page" :total-pages="10" size="lg" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Pagination

A pagination component with configurable page count, sibling display, and sizes.
</docs>
