<script setup lang="ts">
import { ref, watch } from 'vue';
import Spotlight from './Spotlight.vue';
import type { SpotlightGroup } from './types';

const groups: SpotlightGroup[] = [
  {
    label: 'Properties',
    items: [
      {
        value: 'grove',
        label: 'The Grove at Greenfield',
        description: 'Spain, Barcelona · Draft',
        icon: 'house',
        color: 'primary',
      },
      {
        value: 'golden-hour',
        label: 'Golden Hour Apartments',
        description: 'United States, Denver',
        icon: 'house',
        color: 'primary',
      },
    ],
  },
  {
    label: 'Pages',
    items: [
      { label: 'Analytics › Reports', href: '#reports', icon: 'file-text', keywords: ['growth'] },
      { label: 'Settings', href: '#settings', icon: 'settings' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { value: 'add', label: 'Add property', icon: 'plus', color: 'success', shortcut: '⌘ N' },
      { value: 'import', label: 'Import listings from CSV', icon: 'upload' },
    ],
  },
];

const search = ref('');
const results = ref<SpotlightGroup[]>([]);
const loading = ref(false);

watch(search, (query, _previous, onCleanup) => {
  if (!query.trim()) {
    results.value = [];
    return;
  }
  loading.value = true;
  const timer = setTimeout(() => {
    const needle = query.toLowerCase();
    results.value = groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length);
    loading.value = false;
  }, 400);
  onCleanup(() => clearTimeout(timer));
});
</script>

<template>
  <Story title="Navigation/Spotlight" group="navigation">
    <Variant title="Default">
      <div style="padding: 16px">
        <Spotlight trigger="Search" :groups="groups" />
      </div>
    </Variant>

    <Variant title="In place">
      <div style="padding: 16px; min-height: 560px">
        <Spotlight :open="true" :modal="false" :portal="false" :recent="false" :groups="groups" />
      </div>
    </Variant>

    <Variant title="Server search">
      <div style="padding: 16px">
        <Spotlight
          trigger="Search listings"
          placeholder="Search listings…"
          :groups="results"
          :search="search"
          remote
          :loading="loading"
          @search-change="search = $event"
        />
      </div>
    </Variant>
  </Story>
</template>
