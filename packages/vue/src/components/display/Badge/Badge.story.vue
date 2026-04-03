<script setup lang="ts">
import Badge from './Badge.vue';
</script>

<template>
  <Story title="Display/Badge" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.value" title="Value" />
        <HstSelect v-model="state.color" title="Color" :options="['', 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info']" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'xs', 'sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.outline" title="Outline" />
        <HstCheckbox v-model="state.ghost" title="Ghost" />
      </template>

      <template #default="{ state }">
        <Badge
          :value="state.value || 'Badge'"
          :color="state.color || undefined"
          :size="state.size || undefined"
          :outline="state.outline"
          :ghost="state.ghost"
        />
      </template>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <Badge v-for="c in ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info']" :key="c" :value="c" :color="c" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 8px; align-items: center">
        <Badge value="XS" size="xs" color="primary" />
        <Badge value="SM" size="sm" color="primary" />
        <Badge value="MD" size="md" color="primary" />
        <Badge value="LG" size="lg" color="primary" />
      </div>
    </Variant>

    <Variant title="Outline">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <Badge value="Primary" color="primary" :outline="true" />
        <Badge value="Success" color="success" :outline="true" />
        <Badge value="Error" color="error" :outline="true" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Badge

A badge/tag component with colors, sizes, outline, and ghost variants.
</docs>
