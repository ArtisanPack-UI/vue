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
        <HstText v-model="state.description" title="Description" />
        <HstText v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.indeterminate" title="Indeterminate" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <Checkbox
          v-model:checked="checked"
          :label="state.label || 'Email me about new offers'"
          :description="state.description || undefined"
          :error="state.error || undefined"
          :indeterminate="state.indeterminate"
          :disabled="state.disabled"
          :required="state.required"
        />
      </template>
    </Variant>

    <Variant title="States">
      <div style="display: grid; gap: 12px">
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" :checked="true" />
        <Checkbox label="Indeterminate" :indeterminate="true" />
        <Checkbox label="Disabled" :disabled="true" />
        <Checkbox label="Disabled and checked" :checked="true" :disabled="true" />
      </div>
    </Variant>

    <Variant title="With Description and Error">
      <Checkbox
        label="Email me about new offers"
        description="At most once a day."
        error="Required to continue."
        :required="true"
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Checkbox

Turns one option on or off, with an indeterminate (mixed) state (`.apui-checkbox`). Bind it
with `v-model:checked`.

## Usage

```vue
<Checkbox v-model:checked="subscribed" label="Email me about new offers" />
<Checkbox :checked="some" :indeterminate="some && !all" label="Select all" />
```
</docs>
