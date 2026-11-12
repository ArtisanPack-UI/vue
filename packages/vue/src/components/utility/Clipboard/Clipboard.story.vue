<script setup lang="ts">
import Clipboard from './Clipboard.vue';

const url = 'https://horizonhomes.com/l/grove-greenfield';
</script>

<template>
  <Story title="Utility/Clipboard" group="utility">
    <Variant title="Button">
      <Clipboard :value="url" />
    </Variant>

    <Variant title="Icon button">
      <Clipboard value="LST-4127" variant="icon" label="Copy reference" />
    </Variant>

    <Variant title="Copy field">
      <div style="max-inline-size: 420px">
        <Clipboard :value="url" variant="field" size="md" label="Copy share link" />
      </div>
    </Variant>
  </Story>
</template>
