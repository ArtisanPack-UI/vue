<script setup lang="ts">
import Badge from './Badge.vue';

const colors = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'success',
  'warning',
  'error',
  'info',
] as const;
const variants = ['solid', 'soft', 'outline', 'ghost'] as const;
</script>

<template>
  <Story title="Display/Badge" group="display">
    <Variant title="Variants and colors">
      <div style="display: grid; gap: 8px">
        <div
          v-for="variant in variants"
          :key="variant"
          style="display: flex; gap: 8px; flex-wrap: wrap"
        >
          <Badge
            v-for="color in colors"
            :key="color"
            :variant="variant"
            :color="color"
            :dot="variant === 'ghost'"
            >{{ color }}</Badge
          >
        </div>
      </div>
    </Variant>

    <Variant title="Dot, icon and size">
      <div style="display: flex; gap: 8px; align-items: center">
        <Badge color="primary" size="sm">Small</Badge>
        <Badge color="success" dot>Active</Badge>
        <Badge color="success" leading-icon="arrow-right">+11.01%</Badge>
        <Badge color="info" variant="solid" size="lg">New</Badge>
      </div>
    </Variant>
  </Story>
</template>
