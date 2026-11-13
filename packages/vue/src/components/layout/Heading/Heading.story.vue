<script setup lang="ts">
import Heading from './Heading.vue';
</script>

<template>
  <Story title="Layout/Heading" group="layout">
    <Variant title="Levels">
      <div style="display: grid; gap: 12px">
        <Heading v-for="level in [1, 2, 3, 4, 5, 6] as const" :key="level" :level="level"
          >The Grove at Greenfield</Heading
        >
      </div>
    </Variant>

    <Variant title="Eyebrow">
      <Heading eyebrow="Portfolio">Every property, one calm place</Heading>
    </Variant>
  </Story>
</template>
