<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from './Checkbox.vue';

const checked = ref(false);
</script>

<template>
  <Story title="Form/Checkbox" group="form">
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
        <HstCheckbox v-model="state.card" title="Card Style" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <Checkbox
          v-model="checked"
          :label="state.label || 'Accept terms'"
          :hint="state.hint || undefined"
          :error="state.error || undefined"
          :color="state.color || undefined"
          :right="state.right"
          :card="state.card"
          :disabled="state.disabled"
        />
      </template>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Checkbox v-model="checked" label="Primary" color="primary" />
        <Checkbox v-model="checked" label="Secondary" color="secondary" />
        <Checkbox v-model="checked" label="Accent" color="accent" />
        <Checkbox v-model="checked" label="Success" color="success" />
        <Checkbox v-model="checked" label="Warning" color="warning" />
        <Checkbox v-model="checked" label="Error" color="error" />
        <Checkbox v-model="checked" label="Info" color="info" />
      </div>
    </Variant>

    <Variant title="Card Style">
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 300px">
        <Checkbox v-model="checked" label="Option A" :card="true" />
        <Checkbox v-model="checked" label="Option B" :card="true" />
        <Checkbox v-model="checked" label="Option C" :card="true" />
      </div>
    </Variant>

    <Variant title="With Hint and Error">
      <div style="display: flex; flex-direction: column; gap: 16px">
        <Checkbox v-model="checked" label="Subscribe" hint="Get weekly updates" />
        <Checkbox v-model="checked" label="Terms" error="You must accept the terms" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Checkbox

A checkbox input with label, hint, error, card style, and color variants.
</docs>
