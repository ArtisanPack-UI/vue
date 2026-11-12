<script setup lang="ts">
import Link from './Link.vue';
</script>

<template>
  <Story title="Navigation/Link" group="navigation">
    <Variant title="Inline">
      <p>
        Read the <Link href="#">listing terms</Link> or
        <Link href="#" tone="muted">privacy policy</Link>.
      </p>
    </Variant>

    <Variant title="Standalone">
      <div style="display: flex; gap: 24px">
        <Link href="#" standalone trailing-icon="arrow-right">View all properties</Link>
        <Link href="#" standalone external>Documentation</Link>
        <Link href="#" standalone leading-icon="download">Download PDF</Link>
      </div>
    </Variant>

    <Variant title="As a button">
      <Link>Log out</Link>
    </Variant>
  </Story>
</template>
