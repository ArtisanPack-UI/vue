<script setup lang="ts">
import { ref } from 'vue';
import Select from './Select.vue';

const value = ref('');
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape', disabled: true },
];
</script>

<template>
  <Story title="Form/Select" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.inline" title="Inline" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Select
            v-model="value"
            :label="state.label || 'Fruit'"
            :placeholder="state.placeholder || 'Select a fruit'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :options="options"
            option-value="value"
            option-label="label"
            :inline="state.inline"
            :disabled="state.disabled"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Error">
      <div style="max-width: 400px">
        <Select
          v-model="value"
          label="Category"
          placeholder="Choose one"
          :options="options"
          option-value="value"
          option-label="label"
          error="Selection is required"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="max-width: 400px">
        <Select
          model-value="apple"
          label="Fruit"
          :options="options"
          option-value="value"
          option-label="label"
          :disabled="true"
        />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Select

A dropdown select component with label, hint, error, and inline layout support.
</docs>
