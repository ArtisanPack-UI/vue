<script setup lang="ts">
import Sparkline from './Sparkline.vue';
</script>

<template>
  <Story title="Display/Sparkline" group="display">
    <Variant title="Line, area, bar and large">
      <div style="display: flex; gap: 32px; align-items: center">
        <Sparkline :data="[2, 4, 3, 7, 6, 9, 12, 11, 14]" />
        <Sparkline :data="[2, 6, 4, 7, 5, 8, 10, 7, 12]" variant="area" />
        <Sparkline :data="[2, 6, 4, 7, 5, 8, 10, 7, 12]" variant="bar" />
        <Sparkline
          :data="[2, 4, 3, 7, 6, 9, 12, 11, 14]"
          variant="area"
          :width="160"
          :height="40"
        />
      </div>
    </Variant>

    <Variant title="Crossing zero">
      <Sparkline :data="[-4, -2, 1, 3, -1, 2, 5, 4, 6]" variant="bar" />
    </Variant>
  </Story>
</template>
