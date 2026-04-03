<script setup lang="ts">
import Grid from './Grid.vue';
</script>

<template>
  <Story title="Layout/Grid" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect v-model="state.cols" title="Columns" :options="[1, 2, 3, 4, 5, 6]" />
        <HstSelect v-model="state.gap" title="Gap" :options="[0, 1, 2, 3, 4, 5, 6, 8]" />
      </template>

      <template #default="{ state }">
        <Grid :cols="state.cols ?? 3" :gap="state.gap ?? 4">
          <div v-for="i in 6" :key="i" style="background: #3b82f6; color: white; padding: 16px; border-radius: 8px; text-align: center">
            Item {{ i }}
          </div>
        </Grid>
      </template>
    </Variant>

    <Variant title="Responsive">
      <Grid :cols="1" :cols-sm="2" :cols-md="3" :cols-lg="4" :gap="4">
        <div v-for="i in 8" :key="i" style="background: #8b5cf6; color: white; padding: 16px; border-radius: 8px; text-align: center">
          Item {{ i }}
        </div>
      </Grid>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Grid

A responsive CSS grid layout with configurable columns and gap at each breakpoint.
</docs>
