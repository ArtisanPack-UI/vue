<script setup lang="ts">
import Diff from './Diff.vue';
</script>

<template>
  <Story title="Display/Diff" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect v-model="state.mode" title="Mode" :options="['side-by-side', 'inline']" />
        <HstCheckbox v-model="state.lineNumbers" title="Line Numbers" />
      </template>

      <template #default="{ state }">
        <Diff
          before="const greeting = 'Hello';\nconsole.log(greeting);"
          after="const greeting = 'Hello World';\nconsole.log(greeting);\nconsole.log('Done');"
          before-label="Original"
          after-label="Modified"
          :mode="state.mode || 'side-by-side'"
          :line-numbers="state.lineNumbers"
        />
      </template>
    </Variant>

    <Variant title="Inline Mode">
      <Diff
        before="function add(a, b) { return a + b; }"
        after="function add(a: number, b: number): number { return a + b; }"
        mode="inline"
        :line-numbers="true"
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Diff

A text diff viewer with side-by-side and inline modes.
</docs>
