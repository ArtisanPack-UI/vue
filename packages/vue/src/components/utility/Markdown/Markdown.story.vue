<script setup lang="ts">
import { ref } from 'vue';
import Markdown from './Markdown.vue';

const notes = `## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room
- [ ] Ask about \`heating costs\`

> Viewings run 30 minutes.

| Unit | Rent |
|---|---:|
| 2B | $1,400 |
| 4A | $1,650 |
`;

const draft = ref(notes);

// Split so the SFC parser doesn't read it as the end of this block.
const closeScript = '</' + 'script>';
const raw = `Press <kbd>Esc</kbd> to close. <script>alert(1)${closeScript} and [a link](javascript:alert(1)).`;
</script>

<template>
  <Story title="Utility/Markdown" group="utility">
    <Variant title="Preview">
      <Markdown :source="notes" />
    </Variant>

    <Variant title="Split">
      <Markdown v-model:source="draft" mode="split" />
    </Variant>

    <Variant title="Write">
      <Markdown :source="notes" mode="write" />
    </Variant>

    <Variant title="Raw HTML, sanitize off">
      <Markdown :source="raw" :sanitize="false" />
    </Variant>
  </Story>
</template>
