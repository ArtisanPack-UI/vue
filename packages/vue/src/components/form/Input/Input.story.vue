<script setup lang="ts">
import { ref } from 'vue';
import Input from './Input.vue';

const value = ref('');
</script>

<template>
  <Story title="Form/Input" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstSelect
          v-model="state.type"
          title="Type"
          :options="['text', 'email', 'number', 'password', 'search', 'tel', 'url']"
        />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
        <HstCheckbox v-model="state.inline" title="Inline" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Input
            v-model="value"
            :label="state.label || 'Name'"
            :placeholder="state.placeholder || 'Enter your name'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :type="state.type || 'text'"
            :clearable="state.clearable"
            :inline="state.inline"
            :disabled="state.disabled"
            :readonly="state.readonly"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Label and Hint">
      <div style="max-width: 400px">
        <Input
          v-model="value"
          label="Email"
          placeholder="you@example.com"
          hint="We'll never share your email."
          type="email"
        />
      </div>
    </Variant>

    <Variant title="With Error">
      <div style="max-width: 400px">
        <Input
          v-model="value"
          label="Username"
          placeholder="Enter username"
          error="Username is already taken"
        />
      </div>
    </Variant>

    <Variant title="Clearable">
      <div style="max-width: 400px">
        <Input
          v-model="value"
          label="Search"
          placeholder="Type to search..."
          :clearable="true"
          type="search"
        />
      </div>
    </Variant>

    <Variant title="Inline">
      <div style="max-width: 400px">
        <Input v-model="value" label="Inline Input" placeholder="Inline layout" :inline="true" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="max-width: 400px">
        <Input model-value="Cannot edit" label="Disabled" :disabled="true" />
      </div>
    </Variant>

    <Variant title="Input Types">
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
        <Input v-model="value" label="Text" type="text" placeholder="Text input" />
        <Input v-model="value" label="Email" type="email" placeholder="email@example.com" />
        <Input v-model="value" label="Number" type="number" placeholder="0" />
        <Input v-model="value" label="URL" type="url" placeholder="https://example.com" />
        <Input v-model="value" label="Tel" type="tel" placeholder="+1 (555) 000-0000" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Input

A form input component with label, hint, error, clearable, and inline layout support.

## Usage

```vue
<Input v-model="name" label="Name" placeholder="Enter name" />
<Input v-model="email" label="Email" type="email" error="Invalid email" />
```
</docs>
