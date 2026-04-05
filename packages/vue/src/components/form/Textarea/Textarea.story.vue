<script setup lang="ts">
import { ref } from 'vue';
import Textarea from './Textarea.vue';

const value = ref('');
</script>

<template>
  <Story title="Form/Textarea" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstNumber v-model="state.rows" title="Rows" />
        <HstCheckbox v-model="state.inline" title="Inline" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Textarea
            v-model="value"
            :label="state.label || 'Message'"
            :placeholder="state.placeholder || 'Enter your message'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :rows="state.rows || 4"
            :inline="state.inline"
            :disabled="state.disabled"
            :readonly="state.readonly"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Error">
      <div style="max-width: 400px">
        <Textarea
          v-model="value"
          label="Bio"
          placeholder="Tell us about yourself"
          error="Bio must be at least 20 characters"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="max-width: 400px">
        <Textarea model-value="Cannot edit this" label="Notes" :disabled="true" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Textarea

A multi-line text input with label, hint, error, and inline layout support.
</docs>
