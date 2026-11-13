<script setup lang="ts">
import Kbd from './Kbd.vue';
</script>

<template>
  <Story title="Utility/Kbd" group="utility">
    <Variant title="Keys and shortcuts">
      <div style="display: flex; gap: 24px; align-items: center">
        <Kbd :keys="['mod', 'k']" platform="other" />
        <Kbd :keys="['ctrl', 'shift', 'p']" />
        <Kbd :keys="['esc']" />
        <Kbd :keys="['up']" />
        <Kbd :keys="['down']" />
        <Kbd :keys="['enter']" />
        <Kbd :keys="['tab']" />
        <Kbd :keys="['mod', 'k']" platform="other" size="sm" />
      </div>
    </Variant>

    <Variant title="In running text">
      <p>
        Press <Kbd :keys="['mod', 'k']" platform="other" /> to search, or <Kbd :keys="['?']" /> for
        all shortcuts.
      </p>
    </Variant>
  </Story>
</template>
