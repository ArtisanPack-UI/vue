<script setup lang="ts">
import Tooltip from './Tooltip.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Utility/Tooltip" group="utility">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.text" title="Text" />
        <HstSelect v-model="state.position" title="Position" :options="['top', 'bottom', 'left', 'right']" />
        <HstSelect v-model="state.color" title="Color" :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']" />
        <HstCheckbox v-model="state.forceOpen" title="Force Open" />
      </template>

      <template #default="{ state }">
        <div style="padding: 100px; text-align: center">
          <Tooltip
            :text="state.text || 'Tooltip text'"
            :position="state.position || 'top'"
            :color="state.color || undefined"
            :force-open="state.forceOpen"
          >
            <Button color="primary">Hover Me</Button>
          </Tooltip>
        </div>
      </template>
    </Variant>

    <Variant title="Positions">
      <div style="display: flex; gap: 40px; padding: 80px; justify-content: center">
        <Tooltip v-for="pos in ['top', 'bottom', 'left', 'right']" :key="pos" :text="`${pos} tooltip`" :position="pos">
          <Button color="secondary">{{ pos }}</Button>
        </Tooltip>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Tooltip

A tooltip that appears on hover with position and color options.
</docs>
