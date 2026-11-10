<script setup lang="ts">
import '@artisanpack-ui/css';
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
        <HstSelect v-model="state.size" title="Size" :options="['', 'sm', 'md', 'lg']" />
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
            :size="state.size || undefined"
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
          hint="We never share it."
          type="email"
        />
      </div>
    </Variant>

    <Variant title="With Error">
      <div style="max-width: 400px">
        <Input
          label="Email"
          model-value="not-an-email"
          type="email"
          :required="true"
          error="Enter a valid email address."
        />
      </div>
    </Variant>

    <Variant title="Prefix, Suffix and Icons">
      <div style="max-width: 400px; display: grid; gap: 16px">
        <Input label="Recipient" prefix="to:" suffix="@work" leading-icon="mail" />
        <Input label="Search" type="search" trailing-icon="search" />
      </div>
    </Variant>

    <Variant title="Readonly">
      <div style="max-width: 400px">
        <Input label="Account ID" model-value="ACC-1042" :readonly="true" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="max-width: 400px">
        <Input label="Disabled" placeholder="Cannot edit" :disabled="true" />
      </div>
    </Variant>

    <Variant title="Input Types">
      <div style="max-width: 400px; display: grid; gap: 16px">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="Enter password" />
        <Input label="Number" type="number" placeholder="0" />
        <Input label="URL" type="url" placeholder="https://example.com" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Input

Single-line text entry with a visible label, hint and error (`.apui-input`). Bind the value
with `v-model`. `class` goes to the root; every other attribute goes to the native input.

## Usage

```vue
<Input v-model="email" label="Email" type="email" hint="We never share it." />
<Input v-model="price" label="Price" prefix="$" suffix="USD" />
<Input v-model="name" label="Name" :required="true" :error="errors.name" />
```
</docs>
