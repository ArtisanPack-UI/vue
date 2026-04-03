<script setup lang="ts">
import Code from './Code.vue';

const sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;
</script>

<template>
  <Story title="Display/Code" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.language" title="Language" />
        <HstCheckbox v-model="state.copyable" title="Copyable" />
        <HstCheckbox v-model="state.lineNumbers" title="Line Numbers" />
        <HstCheckbox v-model="state.inline" title="Inline" />
      </template>

      <template #default="{ state }">
        <Code
          :code="sampleCode"
          :language="state.language || 'typescript'"
          :copyable="state.copyable"
          :line-numbers="state.lineNumbers"
          :inline="state.inline"
        />
      </template>
    </Variant>

    <Variant title="With Line Numbers">
      <Code :code="sampleCode" language="typescript" :line-numbers="true" :copyable="true" />
    </Variant>

    <Variant title="Inline">
      <p>Use the <Code code="npm install @artisanpack-ui/vue" :inline="true" /> command to install.</p>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Code

A code display component with syntax highlighting, line numbers, and copy button.
</docs>
