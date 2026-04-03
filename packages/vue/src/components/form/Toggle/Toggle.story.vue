<script setup lang="ts">
import { ref } from 'vue';
import Toggle from './Toggle.vue';

const value = ref(false);
</script>

<template>
  <Story title="Form/Toggle" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']"
        />
        <HstCheckbox v-model="state.right" title="Right Aligned" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <Toggle
          v-model="value"
          :label="state.label || 'Enable feature'"
          :hint="state.hint || undefined"
          :error="state.error || undefined"
          :color="state.color || undefined"
          :right="state.right"
          :disabled="state.disabled"
        />
      </template>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Toggle v-model="value" label="Primary" color="primary" />
        <Toggle v-model="value" label="Secondary" color="secondary" />
        <Toggle v-model="value" label="Accent" color="accent" />
        <Toggle v-model="value" label="Success" color="success" />
        <Toggle v-model="value" label="Warning" color="warning" />
        <Toggle v-model="value" label="Error" color="error" />
        <Toggle v-model="value" label="Info" color="info" />
      </div>
    </Variant>

    <Variant title="With Hint">
      <Toggle v-model="value" label="Notifications" hint="Receive email notifications" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Toggle

A toggle/switch component with label, hint, error, and color variants.
</docs>
