<script setup lang="ts">
import Icon from './Icon.vue';
</script>

<template>
  <Story title="Utility/Icon" group="utility">
    <Variant title="Sizes and labels">
      <div style="display: flex; gap: 16px; align-items: center">
        <Icon name="house" size="sm" />
        <Icon name="house" />
        <Icon name="house" size="lg" />
        <Icon name="house" size="xl" />
        <Icon name="circle-alert" color="error" label="Payment failed" />
        <Icon name="arrow-right" />
      </div>
    </Variant>
    <Variant title="Tiles">
      <div style="display: flex; gap: 12px; align-items: center">
        <Icon name="wallet" variant="tile" color="primary" />
        <Icon name="trending-up" variant="tile" color="success" />
        <Icon name="triangle-alert" variant="tile" color="warning" size="lg" />
        <Icon name="file-text" variant="tile" size="sm" />
      </div>
    </Variant>
    <Variant title="Custom svg">
      <Icon variant="tile" label="Spreadsheet">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18" />
        </svg>
      </Icon>
    </Variant>
  </Story>
</template>
