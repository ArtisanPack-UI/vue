<script setup lang="ts">
import ErrorDisplay from './Error.vue';
</script>

<template>
  <Story title="Feedback/ErrorDisplay (deprecated)" group="feedback">
    <Variant title="Retryable">
      <ErrorDisplay message="Use ErrorState instead; this renders one." retryable />
    </Variant>
  </Story>
</template>
