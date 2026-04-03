<script setup lang="ts">
import { ref } from 'vue';
import ColorPicker from './ColorPicker.vue';

const value = ref('#3b82f6');
</script>

<template>
  <Story title="Form/ColorPicker" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
        <HstCheckbox v-model="state.random" title="Random Default" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <ColorPicker
            v-model="value"
            :label="state.label || 'Color'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :clearable="state.clearable"
            :random="state.random"
            :disabled="state.disabled"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Clearable">
      <div style="max-width: 400px">
        <ColorPicker v-model="value" label="Brand Color" :clearable="true" hint="Click X to clear" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# ColorPicker

A color picker with clearable and random default options.
</docs>
