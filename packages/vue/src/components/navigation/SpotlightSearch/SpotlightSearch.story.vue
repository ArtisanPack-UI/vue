<script setup lang="ts">
import { ref } from 'vue';
import SpotlightSearch from './SpotlightSearch.vue';
import Button from '../../form/Button/Button.vue';

const open = ref(false);
const items = [
  { id: '1', label: 'Dashboard', description: 'Go to dashboard', group: 'Pages' },
  { id: '2', label: 'Settings', description: 'Manage settings', group: 'Pages' },
  { id: '3', label: 'Users', description: 'Manage users', group: 'Pages' },
  { id: '4', label: 'Create Post', description: 'Write a new post', group: 'Actions' },
  { id: '5', label: 'Export Data', description: 'Download CSV', group: 'Actions' },
];
</script>

<template>
  <Story title="Navigation/SpotlightSearch" group="navigation">
    <Variant title="Default">
      <Button color="primary" @click="open = true">Open Spotlight (Cmd+K)</Button>
      <SpotlightSearch v-model:open="open" :items="items" placeholder="Search commands..." />
    </Variant>
  </Story>
</template>

<docs lang="md">
# SpotlightSearch

A command palette / spotlight search overlay with grouped items and keyboard navigation.
</docs>
