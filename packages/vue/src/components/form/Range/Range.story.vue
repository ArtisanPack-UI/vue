<script setup lang="ts">
import { ref } from 'vue';
import Range from './Range.vue';

const value = ref(50);
</script>

<template>
  <Story title="Form/Range" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstNumber v-model="state.min" title="Min" />
        <HstNumber v-model="state.max" title="Max" />
        <HstNumber v-model="state.step" title="Step" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Range
            v-model="value"
            :label="state.label || 'Volume'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :min="state.min ?? 0"
            :max="state.max ?? 100"
            :step="state.step ?? 1"
            :color="state.color || undefined"
            :disabled="state.disabled"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
        <Range v-model="value" label="Primary" color="primary" />
        <Range v-model="value" label="Secondary" color="secondary" />
        <Range v-model="value" label="Accent" color="accent" />
        <Range v-model="value" label="Success" color="success" />
      </div>
    </Variant>

    <Variant title="Custom Range">
      <div style="max-width: 400px">
        <Range
          v-model="value"
          label="Temperature"
          :min="-20"
          :max="50"
          :step="5"
          hint="Celsius"
          color="warning"
        />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Range

A range slider with label, hint, min/max/step, and color variants.
</docs>
