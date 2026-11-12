<script setup lang="ts">
import ProgressRadial from './ProgressRadial.vue';
</script>

<template>
  <Story title="Display/ProgressRadial" group="display">
    <Variant title="Sizes">
      <div style="display: flex; gap: 24px; align-items: center; padding: 16px">
        <ProgressRadial :value="68" :size="40" :thickness="4" hide-value label="Profile complete" />
        <ProgressRadial :value="68" :size="80" :thickness="7" label="complete" />
        <ProgressRadial :value="68" :size="112" :thickness="9" label="of goal" />
      </div>
    </Variant>
    <Variant title="Colors and indeterminate">
      <div style="display: flex; gap: 24px; align-items: center; padding: 16px">
        <ProgressRadial :value="85" color="success" aria-label="Debt repaid" />
        <ProgressRadial :value="60" color="info" aria-label="Fines returned" />
        <ProgressRadial indeterminate :size="48" :thickness="5" aria-label="Calculating" />
      </div>
    </Variant>
  </Story>
</template>
