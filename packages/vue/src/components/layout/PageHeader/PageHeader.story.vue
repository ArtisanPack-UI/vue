<script setup lang="ts">
import PageHeader from './PageHeader.vue';
</script>

<template>
  <Story title="Layout/PageHeader" group="layout">
    <Variant title="Title, description and actions">
      <PageHeader
        title="Dashboard"
        description="Income, profit and transactions across all stores."
        meta="Edited 20 min ago"
      >
        <template #actions><button type="button">Share</button></template>
      </PageHeader>
    </Variant>
  </Story>
</template>
