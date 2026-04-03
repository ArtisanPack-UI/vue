<script setup lang="ts">
import Sparkline from './Sparkline.vue';
</script>

<template>
  <Story title="Display/Sparkline" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect v-model="state.type" title="Type" :options="['line', 'area', 'bar']" />
        <HstSelect v-model="state.color" title="Color" :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']" />
        <HstNumber v-model="state.height" title="Height" />
        <HstCheckbox v-model="state.showTooltip" title="Show Tooltip" />
      </template>

      <template #default="{ state }">
        <Sparkline
          :data="[4, 7, 2, 8, 5, 9, 3, 6, 8, 4, 7, 5]"
          :type="state.type || 'line'"
          :color="state.color || 'primary'"
          :height="state.height || 40"
          :show-tooltip="state.showTooltip"
        />
      </template>
    </Variant>

    <Variant title="Types">
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px">
        <div>
          <span style="font-size: 0.75rem; color: gray">Line</span>
          <Sparkline :data="[4, 7, 2, 8, 5, 9, 3, 6]" type="line" color="primary" />
        </div>
        <div>
          <span style="font-size: 0.75rem; color: gray">Area</span>
          <Sparkline :data="[4, 7, 2, 8, 5, 9, 3, 6]" type="area" color="success" />
        </div>
        <div>
          <span style="font-size: 0.75rem; color: gray">Bar</span>
          <Sparkline :data="[4, 7, 2, 8, 5, 9, 3, 6]" type="bar" color="accent" />
        </div>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Sparkline

A compact inline chart (line, area, or bar) for data visualization.
</docs>
