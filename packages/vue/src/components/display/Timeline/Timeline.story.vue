<script setup lang="ts">
import Timeline from './Timeline.vue';

const items = [
  {
    id: '1',
    title: 'Order Placed',
    description: 'Your order has been placed.',
    time: '10:00 AM',
    color: 'primary' as const,
  },
  {
    id: '2',
    title: 'Processing',
    description: 'Your order is being processed.',
    time: '11:30 AM',
    color: 'info' as const,
  },
  {
    id: '3',
    title: 'Shipped',
    description: 'Your order has been shipped.',
    time: '2:00 PM',
    color: 'success' as const,
  },
  {
    id: '4',
    title: 'Delivered',
    description: 'Your order has been delivered.',
    time: '5:00 PM',
    color: 'success' as const,
  },
];
</script>

<template>
  <Story title="Display/Timeline" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstCheckbox v-model="state.vertical" title="Vertical" />
        <HstCheckbox v-model="state.snap" title="Snap" />
        <HstCheckbox v-model="state.compact" title="Compact" />
      </template>

      <template #default="{ state }">
        <Timeline
          :items="items"
          :vertical="state.vertical"
          :snap="state.snap"
          :compact="state.compact"
        />
      </template>
    </Variant>

    <Variant title="Compact">
      <Timeline :items="items" :compact="true" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Timeline

A timeline component for displaying chronological events with colors and layout options.
</docs>
