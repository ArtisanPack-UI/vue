<script setup lang="ts">
import Loading from './Loading.vue';
import type { LoadingProps } from './types';

const sizes: NonNullable<LoadingProps['size']>[] = ['xs', 'sm', 'md', 'lg', 'xl'];
</script>

<template>
  <Story title="Feedback/Loading" group="feedback">
    <Variant title="Spinner sizes">
      <div style="display: flex; gap: 20px; align-items: center; padding: 16px">
        <Loading v-for="size in sizes" :key="size" :size="size" :delay="0" />
      </div>
    </Variant>
    <Variant title="Dots and label">
      <div style="display: flex; gap: 24px; align-items: center; padding: 16px">
        <Loading variant="dots" :delay="0" />
        <Loading size="sm" :delay="0">Saving changes…</Loading>
      </div>
    </Variant>
    <Variant title="Overlay">
      <div aria-busy="true" style="position: relative; block-size: 160px; padding: 16px">
        <p>Weekly revenue</p>
        <Loading overlay size="lg" :delay="0">Loading revenue…</Loading>
      </div>
    </Variant>
  </Story>
</template>
