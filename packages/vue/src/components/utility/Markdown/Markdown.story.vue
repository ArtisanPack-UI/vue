<script setup lang="ts">
import Markdown from './Markdown.vue';

const sample = `# Hello World

This is a **bold** and *italic* text.

## Features

- Item one
- Item two
- Item three

\`\`\`js
const x = 42;
console.log(x);
\`\`\`

> A blockquote example

[Visit Example](https://example.com)`;
</script>

<template>
  <Story title="Utility/Markdown" group="utility">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstTextarea v-model="state.content" title="Content" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 600px">
          <Markdown :content="state.content || sample" />
        </div>
      </template>
    </Variant>

    <Variant title="Default">
      <div style="max-width: 600px">
        <Markdown :content="sample" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Markdown

A Markdown renderer that converts Markdown content to styled HTML.
</docs>
