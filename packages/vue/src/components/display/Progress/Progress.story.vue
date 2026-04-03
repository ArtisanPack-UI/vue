<script setup lang="ts">
import Progress from './Progress.vue';
</script>

<template>
  <Story title="Display/Progress" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstNumber v-model="state.value" title="Value" />
        <HstNumber v-model="state.max" title="Max" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']"
        />
        <HstCheckbox v-model="state.showValue" title="Show Value" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Progress
            :value="state.value ?? 65"
            :max="state.max ?? 100"
            :color="state.color || undefined"
            :show-value="state.showValue"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 400px">
        <Progress :value="80" color="primary" />
        <Progress :value="60" color="secondary" />
        <Progress :value="90" color="success" />
        <Progress :value="40" color="warning" />
        <Progress :value="20" color="error" />
      </div>
    </Variant>

    <Variant title="With Value">
      <div style="max-width: 400px">
        <Progress :value="72" :max="100" color="primary" :show-value="true" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Progress

A progress bar with color variants and optional value display.
</docs>
