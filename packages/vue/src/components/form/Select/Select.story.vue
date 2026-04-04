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
        <HstText v-model="state.placeholderValue" title="Placeholder Value" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstText v-model="state.id" title="ID" />
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
            :placeholder-value="state.placeholderValue || undefined"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :id="state.id || undefined"
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

    <Variant title="Inline Layout">
      <div style="max-width: 400px">
        <Select
          v-model="value"
          label="Fruit"
          placeholder="Pick one"
          :options="options"
          option-value="value"
          option-label="label"
          :inline="true"
        />
      </div>
    </Variant>

    <Variant title="With Hint">
      <div style="max-width: 400px">
        <Select
          v-model="value"
          label="Preference"
          placeholder="Select a fruit"
          :options="options"
          option-value="value"
          option-label="label"
          hint="Choose your favorite fruit"
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

    <Variant title="Required">
      <div style="max-width: 400px">
        <Select
          v-model="value"
          label="Fruit"
          placeholder="Select a fruit"
          :options="options"
          option-value="value"
          option-label="label"
          :required="true"
        />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Select

A dropdown select component with label, hint, error, and inline layout support.

## Usage

```vue
<Select
  v-model="selectedValue"
  label="Category"
  placeholder="Choose one"
  :options="categories"
  option-value="id"
  option-label="name"
/>
```

## Props

| Prop               | Type               | Default  | Description                            |
| ------------------ | ------------------ | -------- | -------------------------------------- |
| `modelValue`       | `string \| number` | —        | Current value (for v-model)            |
| `label`            | `string`           | —        | Text label above the select            |
| `hint`             | `string`           | —        | Helper text below the select           |
| `error`            | `string`           | —        | Error message (replaces hint)          |
| `placeholder`      | `string`           | —        | Text for disabled placeholder option   |
| `placeholderValue` | `string`           | `''`     | Value for the placeholder option       |
| `inline`           | `boolean`          | `false`  | Inline fieldset label layout           |
| `optionValue`      | `string`           | `'id'`   | Key on option objects for the value    |
| `optionLabel`      | `string`           | `'name'` | Key on option objects for display text |
| `options`          | `SelectOption[]`   | —        | Array of option objects                |
| `id`               | `string`           | —        | Custom id for the select element       |
| `required`         | `boolean`          | —        | Whether the field is required          |
| `disabled`         | `boolean`          | —        | Whether the field is disabled          |
</docs>
