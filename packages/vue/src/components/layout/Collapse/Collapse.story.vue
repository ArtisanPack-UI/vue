<script setup lang="ts">
import Collapse from './Collapse.vue';
</script>

<template>
  <Story title="Layout/Collapse" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstSelect v-model="state.icon" title="Icon" :options="['arrow', 'plus', 'none']" />
        <HstCheckbox v-model="state.bordered" title="Bordered" />
        <HstCheckbox v-model="state.defaultOpen" title="Default Open" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 600px">
          <Collapse
            :title="state.title || 'Click to expand'"
            :icon="state.icon || 'arrow'"
            :bordered="state.bordered"
            :default-open="state.defaultOpen"
            :disabled="state.disabled"
          >
            <p>This is the collapsible content. It can contain any elements.</p>
          </Collapse>
        </div>
      </template>
    </Variant>

    <Variant title="Icon Variants">
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 600px">
        <Collapse title="Arrow Icon" icon="arrow"><p>Uses an arrow icon.</p></Collapse>
        <Collapse title="Plus Icon" icon="plus"><p>Uses a plus/minus icon.</p></Collapse>
        <Collapse title="No Icon" icon="none"><p>No icon indicator.</p></Collapse>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Collapse

A collapsible panel with arrow, plus, or no icon indicator.
</docs>
