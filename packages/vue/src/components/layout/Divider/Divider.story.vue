<script setup lang="ts">
import Divider from './Divider.vue';
</script>

<template>
  <Story title="Layout/Divider" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.labelPosition"
          title="Label Position"
          :options="['', 'start', 'center', 'end']"
        />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']"
        />
        <HstCheckbox v-model="state.vertical" title="Vertical" />
      </template>

      <template #default="{ state }">
        <div :style="state.vertical ? 'display: flex; height: 100px; align-items: center' : ''">
          <span v-if="state.vertical">Left</span>
          <Divider
            :label="state.label || undefined"
            :label-position="state.labelPosition || undefined"
            :color="state.color || undefined"
            :vertical="state.vertical"
          />
          <span v-if="state.vertical">Right</span>
        </div>
      </template>
    </Variant>

    <Variant title="With Label">
      <Divider label="OR" />
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Divider label="Primary" color="primary" />
        <Divider label="Secondary" color="secondary" />
        <Divider label="Accent" color="accent" />
        <Divider label="Success" color="success" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Divider

A horizontal or vertical divider with optional label and color.
</docs>
