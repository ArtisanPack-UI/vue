<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';
</script>

<template>
  <Story title="Utility/ThemeToggle" group="utility">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect v-model="state.size" title="Size" :options="['', 'xs', 'sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.persist" title="Persist" />
      </template>

      <template #default="{ state }">
        <ThemeToggle :size="state.size || undefined" :persist="state.persist" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 16px; align-items: center">
        <ThemeToggle size="xs" />
        <ThemeToggle size="sm" />
        <ThemeToggle size="md" />
        <ThemeToggle size="lg" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# ThemeToggle

A light/dark mode toggle with optional localStorage persistence.
</docs>
