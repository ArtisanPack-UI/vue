<script setup lang="ts">
import Progress from './Progress.vue';
</script>

<template>
  <Story title="Display/Progress" group="display">
    <Variant title="Labeled">
      <div style="display: grid; gap: 16px; padding: 16px">
        <Progress :value="64" label="Uploading 12 photos" value-text="8 of 12" />
        <Progress :value="92" color="warning" label="Monthly visits used" />
        <Progress :value="40" size="sm" aria-label="Profile completeness" />
      </div>
    </Variant>
    <Variant title="Indeterminate and segmented">
      <div style="display: grid; gap: 16px; padding: 16px">
        <Progress indeterminate label="Preparing export" value-text="Estimating…" />
        <Progress segmented :value="3" :max="5" label="Listing setup" value-text="3 of 5" />
      </div>
    </Variant>
  </Story>
</template>
