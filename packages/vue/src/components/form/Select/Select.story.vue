<script setup lang="ts">
import '@artisanpack-ui/css';
import { ref } from 'vue';
import Select from './Select.vue';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico', disabled: true },
];

const value = ref('');
</script>

<template>
  <Story title="Form/Select" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Select
            v-model="value"
            :label="state.label || 'Country'"
            :options="countries"
            :placeholder="state.placeholder || undefined"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :size="state.size || undefined"
            :disabled="state.disabled"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Error">
      <div style="max-width: 400px">
        <Select label="Country" :options="countries" :required="true" error="Choose a country." />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="max-width: 400px">
        <Select label="Country" :options="countries" model-value="us" :disabled="true" />
      </div>
    </Variant>

    <Variant title="With Hint and Icon">
      <div style="max-width: 400px">
        <Select
          label="Owner"
          :options="['Ada', 'Grace', 'Linus']"
          leading-icon="user"
          hint="Who is responsible for the account."
        />
      </div>
    </Variant>

    <Variant title="Option Children">
      <div style="max-width: 400px">
        <Select label="Country" :options="countries" model-value="gb">
          <option value="gb">United Kingdom</option>
        </Select>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Select

Chooses one value from a short list with the native select element (`.apui-select`). Pass
`options` as strings or `{ value, label, disabled }` objects; option children in the default
slot render after them.

## Usage

```vue
<Select v-model="country" label="Country" :options="countries" :required="true" />
<Select v-model="size" label="Size" :options="['S', 'M', 'L']" placeholder="" />
```
</docs>
