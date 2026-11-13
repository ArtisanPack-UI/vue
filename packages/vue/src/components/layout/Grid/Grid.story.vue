<script setup lang="ts">
import Grid from './Grid.vue';
</script>

<template>
  <Story title="Layout/Grid" group="layout">
    <Variant title="Three columns">
      <Grid :columns="3">
        <div v-for="n in 6" :key="n">Item {{ n }}</div>
      </Grid>
    </Variant>
    <Variant title="Reflowing (min item width)">
      <Grid :columns="4" min-item-width="12rem" gap="6">
        <div v-for="n in 8" :key="n">Item {{ n }}</div>
      </Grid>
    </Variant>
  </Story>
</template>
