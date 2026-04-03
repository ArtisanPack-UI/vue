<script setup lang="ts">
import Popover from './Popover.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Layout/Popover" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.position"
          title="Position"
          :options="['top', 'bottom', 'left', 'right']"
        />
        <HstSelect v-model="state.triggerMode" title="Trigger" :options="['click', 'hover']" />
        <HstCheckbox v-model="state.persistent" title="Persistent" />
      </template>

      <template #default="{ state }">
        <div style="padding: 100px; text-align: center">
          <Popover
            :position="state.position || 'top'"
            :trigger-mode="state.triggerMode || 'click'"
            :persistent="state.persistent"
          >
            <template #trigger>
              <Button color="primary">Click Me</Button>
            </template>
            <div style="padding: 12px; max-width: 200px">
              <p style="font-weight: bold">Popover Content</p>
              <p style="font-size: 0.875rem">This is a popover with rich content.</p>
            </div>
          </Popover>
        </div>
      </template>
    </Variant>

    <Variant title="Positions">
      <div
        style="display: flex; gap: 40px; padding: 100px; justify-content: center; flex-wrap: wrap"
      >
        <Popover v-for="pos in ['top', 'bottom', 'left', 'right']" :key="pos" :position="pos">
          <template #trigger>
            <Button color="secondary">{{ pos }}</Button>
          </template>
          <div style="padding: 8px">{{ pos }} popover</div>
        </Popover>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Popover

A floating popover triggered by click or hover with configurable position.
</docs>
