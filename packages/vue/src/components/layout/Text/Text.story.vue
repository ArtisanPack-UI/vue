<script setup lang="ts">
import Text from './Text.vue';
</script>

<template>
  <Story title="Layout/Text" group="layout">
    <Variant title="Sizes">
      <div style="display: grid; gap: 10px">
        <Text v-for="size in ['lead', 'lg', 'md', 'sm', 'xs'] as const" :key="size" :size="size"
          >Twenty-four bright apartments around a garden courtyard.</Text
        >
      </div>
    </Variant>

    <Variant title="Tone and weight">
      <div style="display: flex; gap: 20px">
        <Text as="span" tone="muted">Muted</Text>
        <Text as="span" tone="success">+10.9% vs last month</Text>
        <Text as="span" tone="error">Payment failed</Text>
        <Text as="span" weight="semibold">Semibold</Text>
      </div>
    </Variant>

    <Variant title="Truncate">
      <Text truncate style="max-width: 260px"
        >ARK Genomic Revolution ETF — transaction declined by the issuing bank</Text
      >
    </Variant>
  </Story>
</template>
