<script setup lang="ts">
import Divider from './Divider.vue';
</script>

<template>
  <Story title="Layout/Divider" group="layout">
    <Variant title="Horizontal">
      <Divider />
      <Divider strength="strong" />
    </Variant>
    <Variant title="Labelled">
      <Divider label="or continue with" />
      <Divider label="Older activity" align="start" />
    </Variant>
    <Variant title="Vertical">
      <div style="display: flex; gap: 8px">
        <span>Edit</span><Divider orientation="vertical" /><span>Duplicate</span>
      </div>
    </Variant>
  </Story>
</template>
