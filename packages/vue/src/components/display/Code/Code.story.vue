<script setup lang="ts">
import Code from './Code.vue';

const snippet = `export function formatPrice(amount: number, currency = 'USD') {
  // Tabular figures line up in tables
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}`;

const shell = `composer require artisanpack-ui/livewire-ui-components
php artisan vendor:publish --tag=artisanpack-tokens`;
</script>

<template>
  <Story title="Display/Code" group="display">
    <Variant title="Numbered, highlighted line">
      <Code
        :code="snippet"
        file-name="format-price.ts"
        language="TypeScript"
        numbered
        :highlight="[3]"
      />
    </Variant>

    <Variant title="Plain block">
      <Code :code="shell" file-name="Terminal" language="Shell" />
    </Variant>

    <Variant title="Inline">
      <p>Set <Code inline code='data-theme="dark"' /> on any element to switch that region.</p>
    </Variant>
  </Story>
</template>
