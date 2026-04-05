<script setup lang="ts">
import { ref } from 'vue';
import Editor from './Editor.vue';

const value = ref('');
</script>

<template>
  <Story title="Form/Editor" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstNumber v-model="state.rows" title="Rows" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 600px">
          <Editor
            v-model="value"
            :label="state.label || 'Code'"
            :placeholder="state.placeholder || 'Enter code here...'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :rows="state.rows || 10"
            :disabled="state.disabled"
            :readonly="state.readonly"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Content">
      <div style="max-width: 600px">
        <Editor
          model-value="const greeting = 'Hello World';\nconsole.log(greeting);"
          label="JavaScript"
          :rows="6"
        />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Editor

A code editor textarea with label, hint, error, and row configuration.
</docs>
