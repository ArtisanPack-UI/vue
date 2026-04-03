<script setup lang="ts">
import { ref } from 'vue';
import Radio from './Radio.vue';

const value = ref('');
const options = [
  { value: 'small', label: 'Small', hint: 'Best for personal use' },
  { value: 'medium', label: 'Medium', hint: 'Best for teams' },
  { value: 'large', label: 'Large', hint: 'Best for enterprise' },
];
</script>

<template>
  <Story title="Form/Radio" group="form">
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
        <HstCheckbox v-model="state.inline" title="Inline" />
        <HstCheckbox v-model="state.card" title="Card Style" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <Radio
          v-model="value"
          :label="state.label || 'Plan'"
          :hint="state.hint || undefined"
          :error="state.error || undefined"
          :color="state.color || undefined"
          :options="options"
          option-value="value"
          option-label="label"
          option-hint="hint"
          :inline="state.inline"
          :card="state.card"
          :disabled="state.disabled"
        />
      </template>
    </Variant>

    <Variant title="Inline">
      <Radio
        v-model="value"
        label="Size"
        :options="options"
        option-value="value"
        option-label="label"
        :inline="true"
        color="primary"
      />
    </Variant>

    <Variant title="Card Style">
      <div style="max-width: 400px">
        <Radio
          v-model="value"
          label="Plan"
          :options="options"
          option-value="value"
          option-label="label"
          option-hint="hint"
          :card="true"
          color="primary"
        />
      </div>
    </Variant>

    <Variant title="With Error">
      <Radio
        v-model="value"
        label="Selection"
        :options="options"
        option-value="value"
        option-label="label"
        error="Please select an option"
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Radio

A radio group component with inline, card style, hints, and color variants.
</docs>
