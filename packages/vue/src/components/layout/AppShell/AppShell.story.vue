<script setup lang="ts">
import AppShell from './AppShell.vue';
</script>

<template>
  <Story title="Layout/AppShell" group="layout">
    <Variant title="Collapsible">
      <AppShell brand="Apexify" footer="Olivia Rhye" header="Top bar" collapsible>
        <template #sidebar>Navigation</template>
        Page content
      </AppShell>
    </Variant>
  </Story>
</template>
