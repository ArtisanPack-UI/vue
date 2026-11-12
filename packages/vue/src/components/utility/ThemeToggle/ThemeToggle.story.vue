<script setup lang="ts">
import { ref } from 'vue';
import ThemeToggle from './ThemeToggle.vue';
import type { ThemeChoice } from './types';

const theme = ref<ThemeChoice>('dark');
</script>

<template>
  <Story title="Utility/ThemeToggle" group="utility">
    <Variant title="Segmented">
      <ThemeToggle :persist="false" />
    </Variant>

    <Variant title="Icons only">
      <ThemeToggle :persist="false" icon-only :choices="['light', 'dark', 'system']" />
    </Variant>

    <Variant title="Icon button">
      <ThemeToggle :persist="false" variant="icon" />
    </Variant>

    <Variant title="Menu">
      <ThemeToggle v-model="theme" :persist="false" variant="menu" size="sm" />
    </Variant>

    <Variant title="Translated">
      <ThemeToggle
        :persist="false"
        label="Tema"
        light-label="Claro"
        dark-label="Oscuro"
        high-contrast-label="Alto contraste"
        system-label="Sistema"
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# ThemeToggle

Lets people choose light, dark, high contrast or system. The choice sets `data-theme` on the
document, persists in localStorage and follows the OS while it is System. Put the head snippet
(`themeScript()` or `ThemeScript`) in `<head>` so the stored choice applies before first paint.
</docs>
