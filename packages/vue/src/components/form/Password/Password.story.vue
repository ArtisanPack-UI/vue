<script setup lang="ts">
import { ref } from 'vue';
import Password from './Password.vue';

const value = ref('');
</script>

<template>
  <Story title="Form/Password" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
        <HstCheckbox v-model="state.hideToggle" title="Hide Toggle" />
        <HstCheckbox v-model="state.inline" title="Inline" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Password
            v-model="value"
            :label="state.label || 'Password'"
            :placeholder="state.placeholder || 'Enter password'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :clearable="state.clearable"
            :hide-toggle="state.hideToggle"
            :inline="state.inline"
            :disabled="state.disabled"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Error">
      <div style="max-width: 400px">
        <Password
          v-model="value"
          label="Password"
          placeholder="Enter password"
          error="Password must be at least 8 characters"
        />
      </div>
    </Variant>

    <Variant title="No Toggle">
      <div style="max-width: 400px">
        <Password
          v-model="value"
          label="Secret"
          placeholder="Enter secret"
          :hide-toggle="true"
        />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Password

A password input with visibility toggle, clearable, and error support.
</docs>
