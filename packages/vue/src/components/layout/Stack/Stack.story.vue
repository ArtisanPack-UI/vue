<script setup lang="ts">
import Stack from './Stack.vue';
</script>

<template>
  <Story title="Layout/Stack" group="layout">
    <Variant title="Vertical">
      <Stack gap="4"
        ><div>One</div>
        <div>Two</div>
        <div>Three</div></Stack
      >
    </Variant>
    <Variant title="Horizontal, between, wrapping">
      <Stack orientation="horizontal" justify="between" align="center" wrap>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Stack>
    </Variant>
  </Story>
</template>
